import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);

function readArg(name, fallback = "") {
  const index = args.indexOf(`--${name}`);
  if (index === -1) return fallback;
  return args[index + 1] ?? fallback;
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const writeHeartbeatScript = path.join(scriptDir, "write-operator-heartbeat.mjs");
const heartbeatPath = readArg("heartbeat", ".omx/state/operator-heartbeat.json");
const reportPath = readArg("report", "reports/operations/operator-heartbeat-daemon.jsonl");
const intervalSeconds = Math.max(1, Number(readArg("interval-seconds", "300")));
const maxHeartbeats = Math.max(0, Number(readArg("max-heartbeats", "0")));
const pidFile = readArg("pid-file", ".omx/state/operator-heartbeat-daemon.pid");
const summaryPath = readArg("summary", ".omx/state/operator-heartbeat-daemon-summary.json");
const issue = readArg("issue", "");
const item = readArg("item", "");
const phase = readArg("phase", "heartbeat-daemon");
const context = readArg("context", "");
const commandPrefix = readArg("command", "daemon heartbeat");
const nextAction = readArg("next", "continue supervised operator run");
const status = readArg("status", "running");

let count = 0;
const startedAt = new Date().toISOString();

function writeSummary(currentStatus) {
  ensureDir(summaryPath);
  fs.writeFileSync(summaryPath, `${JSON.stringify({
    ok: currentStatus === "completed" || currentStatus === "running",
    status: currentStatus,
    started_at: startedAt,
    updated_at: new Date().toISOString(),
    pid: process.pid,
    heartbeat_path: heartbeatPath,
    report_path: reportPath,
    interval_seconds: intervalSeconds,
    max_heartbeats: maxHeartbeats,
    observed_heartbeats: count,
    issue,
    item
  }, null, 2)}\n`);
}

function writeHeartbeat() {
  count += 1;
  execFileSync(process.execPath, [
    writeHeartbeatScript,
    "--heartbeat", heartbeatPath,
    "--report", reportPath,
    "--phase", phase,
    "--iteration", String(count),
    "--issue", issue,
    "--item", item,
    "--command", `${commandPrefix} ${count}`,
    "--next", nextAction,
    "--context", context,
    "--status", status
  ], { stdio: ["ignore", "ignore", "inherit"] });
  writeSummary("running");
}

ensureDir(pidFile);
fs.writeFileSync(pidFile, `${process.pid}\n`);
writeSummary("running");
writeHeartbeat();

if (maxHeartbeats === 1) {
  writeSummary("completed");
  process.exit(0);
}

const timer = setInterval(() => {
  writeHeartbeat();
  if (maxHeartbeats > 0 && count >= maxHeartbeats) {
    clearInterval(timer);
    writeSummary("completed");
    process.exit(0);
  }
}, intervalSeconds * 1000);

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    clearInterval(timer);
    writeSummary("stopped");
    process.exit(0);
  });
}
