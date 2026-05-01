import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);

function readArg(name, fallback = "") {
  const index = args.indexOf(`--${name}`);
  if (index === -1) return fallback;
  return args[index + 1] ?? fallback;
}

function hasFlag(name) {
  return args.includes(`--${name}`);
}

function git(args) {
  try {
    return execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return "";
  }
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

const timestamp = new Date().toISOString();
const date = timestamp.slice(0, 10).replaceAll("-", "");
const heartbeatPath = readArg("heartbeat", ".omx/state/operator-heartbeat.json");
const reportPath = readArg("report", `reports/operations/operator-heartbeat-${date}.jsonl`);
const statusPorcelain = git(["status", "--porcelain"]);

const heartbeat = {
  schemaVersion: 1,
  kind: "operator-heartbeat",
  timestamp,
  actor: readArg("actor", "codex-ralph"),
  phase: readArg("phase", "executing"),
  iteration: Number(readArg("iteration", "1")),
  issue: readArg("issue", ""),
  pr: readArg("pr", ""),
  item: readArg("item", ""),
  branch: readArg("branch", git(["branch", "--show-current"])),
  commit: git(["rev-parse", "--short", "HEAD"]),
  dirty: statusPorcelain.length > 0,
  current_command: readArg("command", "manual heartbeat"),
  next_action: readArg("next", "continue current Ralph iteration"),
  context_snapshot_path: readArg("context", ""),
  status: readArg("status", "running"),
  cwd: process.cwd()
};

const publicationGateTarget = readArg("publication-gate", "");
if (publicationGateTarget) {
  const pendingCommand = readArg("pending-command", heartbeat.current_command);
  const bodyFile = readArg("body-file", "");
  const dedupeKey = readArg(
    "publication-dedupe-key",
    [publicationGateTarget, heartbeat.branch, heartbeat.commit, bodyFile, pendingCommand].filter(Boolean).join("|")
  );
  heartbeat.publication_gate = {
    active: true,
    kind: "representational_communication",
    target: publicationGateTarget,
    pending_command: pendingCommand,
    body_file: bodyFile,
    dedupe_key: dedupeKey,
    repeat_policy: readArg("publication-repeat-policy", "do_not_repeat_final_ask"),
    branch: heartbeat.branch,
    commit: heartbeat.commit
  };
  heartbeat.confirmation = {
    required: readArg("confirmation-required", "true") !== "false",
    channel: readArg("confirmation-channel", "commentary")
  };
  heartbeat.continuation = {
    action: readArg("continuation-action", ""),
    artifact_path: readArg("continuation-artifact", ""),
    safe_local_work: readArg("safe-local-work", "")
  };
  heartbeat.stop_rule = readArg("stop-rule", "none");
}

ensureDir(heartbeatPath);
fs.writeFileSync(heartbeatPath, `${JSON.stringify(heartbeat, null, 2)}\n`);

if (!hasFlag("no-report")) {
  ensureDir(reportPath);
  fs.appendFileSync(reportPath, `${JSON.stringify(heartbeat)}\n`);
}

console.log(JSON.stringify({ ok: true, heartbeat: heartbeatPath, report: hasFlag("no-report") ? null : reportPath, phase: heartbeat.phase, next_action: heartbeat.next_action }, null, 2));
