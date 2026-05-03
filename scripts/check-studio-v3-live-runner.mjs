import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const failures = [];

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    failures.push(`missing required path: ${filePath}`);
    return "";
  }
  return fs.readFileSync(filePath, "utf8");
}

function requirePhrases(filePath, phrases) {
  const content = read(filePath);
  for (const phrase of phrases) {
    if (!content.includes(phrase)) failures.push(`${filePath} missing phrase: ${phrase}`);
  }
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    failures.push(`${filePath} unreadable JSON: ${error.message}`);
    return null;
  }
}

requirePhrases("package.json", [
  "studio:v3:runner",
  "scripts/studio-v3-live-runner.mjs",
  "check:studio-v3-live-runner",
  "scripts/check-studio-v3-live-runner.mjs"
]);

requirePhrases("docs/STUDIO_HARNESS_V3_RUNNER_USAGE.md", [
  "npm run studio:v3:runner -- --once --dry-run",
  "--duration-hours 24",
  "Queue empty is not a stop condition",
  "production game quality WorkUnit",
  "P0.5 Idle Core + Creative Rescue",
  "operator:watchdog",
  "PublicationBoundary",
  "credential",
  "Browser Use"
]);

requirePhrases("items/0147-studio-v3-24h-live-runner.md", [
  "Issue: #290",
  "## Plan",
  "24시간",
  "production game quality",
  "npm run studio:v3:runner -- --once --dry-run",
  "npm run check:studio-v3-live-runner"
]);

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "studio-v3-live-runner-"));
const statePath = path.join(tempDir, "state.json");
const reportPath = path.join(tempDir, "report.md");
try {
  execFileSync(process.execPath, [
    "scripts/studio-v3-live-runner.mjs",
    "--once",
    "--dry-run",
    "--offline-fixture", "reports/operations/fixtures/studio-v3-live-runner-queue-empty.json",
    "--state", statePath,
    "--report", reportPath,
    "--no-heartbeat"
  ], { stdio: ["ignore", "pipe", "pipe"] });
} catch (error) {
  failures.push(`offline dry-run failed: ${error.stderr?.toString() || error.message}`);
}

const state = fs.existsSync(statePath) ? readJson(statePath) : null;
const report = fs.existsSync(reportPath) ? fs.readFileSync(reportPath, "utf8") : "";
if (!state) failures.push("offline dry-run did not create state");
if (state) {
  if (state.kind !== "studio-v3-live-runner-state") failures.push(`state.kind mismatch: ${state.kind}`);
  if (state.source_of_truth !== "github-authoritative") failures.push("state source_of_truth must be github-authoritative");
  if (state.queue_empty_is_stop !== false) failures.push("queue_empty_is_stop must be false");
  if (state.decision?.kind !== "production-game-intake-required") failures.push(`queue-empty decision must be production-game-intake-required, got ${state.decision?.kind}`);
  if (!state.production_game_quality_gate?.active_campaign?.includes("P0.5")) failures.push("state missing P0.5 production game quality gate");
}
for (const phrase of ["Queue empty is not a stop condition", "production game quality", "Decision: `production-game-intake-required`"]) {
  if (!report.includes(phrase)) failures.push(`offline report missing phrase: ${phrase}`);
}

console.log(JSON.stringify({ ok: failures.length === 0, tempDir, failures }, null, 2));
if (failures.length > 0) process.exit(1);
