import { spawnSync } from "node:child_process";
import fs from "node:fs";

const heartbeat = ".omx/state/watchdog-stuck-guard-heartbeat.json";
const report = ".omx/state/watchdog-stuck-guard-report.md";
fs.mkdirSync(".omx/state", { recursive: true });
fs.writeFileSync(heartbeat, `${JSON.stringify({
  schemaVersion: 1,
  kind: "operator-heartbeat",
  timestamp: "2026-04-28T00:00:00.000Z",
  actor: "codex-ralph",
  phase: "stale-guard",
  iteration: 1,
  issue: "#84",
  pr: "",
  item: "items/0051-heartbeat-daemon-hardening.md",
  branch: "codex/heartbeat-daemon-hardening",
  commit: "fixture",
  dirty: false,
  current_command: "fixture stale wait",
  next_action: "write stuck report",
  context_snapshot_path: ".omx/context/heartbeat-daemon-hardening-fixture.md",
  status: "running",
  cwd: process.cwd()
}, null, 2)}\n`);

const result = spawnSync(process.execPath, [
  "scripts/operator-watchdog.mjs",
  "--heartbeat", heartbeat,
  "--now", "2026-04-28T00:11:00.000Z",
  "--max-age-seconds", "600",
  "--stuck-output", report,
  "--next", "write stuck report before completion",
  "--fail-on-stale"
], { encoding: "utf8" });

const failures = [];
if (result.status === 0) failures.push("stale watchdog unexpectedly exited 0");
if (!fs.existsSync(report)) failures.push(`missing watchdog stuck report: ${report}`);

if (fs.existsSync(report)) {
  const content = fs.readFileSync(report, "utf8");
  for (const phrase of [
    "Status: reported",
    "heartbeat age 660s exceeds 600s",
    "write stuck report before completion",
    "Issue: #84"
  ]) {
    if (!content.includes(phrase)) failures.push(`${report} missing phrase: ${phrase}`);
  }
}

console.log(JSON.stringify({ ok: failures.length === 0, watchdogExitStatus: result.status, report, failures }, null, 2));
if (failures.length > 0) process.exit(1);
