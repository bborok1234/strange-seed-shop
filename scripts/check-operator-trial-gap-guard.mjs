import { spawnSync } from "node:child_process";
import fs from "node:fs";

const scenario = "reports/operations/fixtures/operator-trial-stale-gap-scenario-20260428.json";
const output = "reports/operations/operator-trial-stale-gap-guard-20260428.md";
const result = spawnSync(process.execPath, [
  "scripts/operator-trial-dry-run.mjs",
  "--scenario", scenario,
  "--output", output,
  "--max-gap-seconds", "600"
], { encoding: "utf8" });

const failures = [];

if (result.status === 0) failures.push("stale gap fixture unexpectedly passed");
if (!fs.existsSync(output)) failures.push(`missing stale gap report: ${output}`);

if (fs.existsSync(output)) {
  const report = fs.readFileSync(output, "utf8");
  for (const phrase of [
    "Status: dry-run-review",
    "Max allowed gap seconds: 600",
    "Stale gap windows: 1",
    "702.5",
    "stale-gap"
  ]) {
    if (!report.includes(phrase)) failures.push(`${output} missing phrase: ${phrase}`);
  }
}

console.log(JSON.stringify({ ok: failures.length === 0, scenario, output, dryRunExitStatus: result.status, failures }, null, 2));
if (failures.length > 0) process.exit(1);
