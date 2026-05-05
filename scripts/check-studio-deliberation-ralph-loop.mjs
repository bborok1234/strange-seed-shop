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

function forbidPhrases(filePath, phrases) {
  const content = read(filePath);
  for (const phrase of phrases) {
    if (content.includes(phrase)) failures.push(`${filePath} forbidden phrase: ${phrase}`);
  }
}

function runNode(args) {
  try {
    return execFileSync(process.execPath, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  } catch (error) {
    failures.push(`node ${args.join(" ")} failed: ${error.stderr?.toString() || error.message}`);
    return error.stdout?.toString() || "";
  }
}

requirePhrases(".codex/skills/studio-deliberate/SKILL.md", [
  "name: studio-deliberate",
  "Run Codex-native",
  "docs/studio/DELIBERATION_WORKFLOW.md",
  "docs/studio/personas/*.md",
  "reports/deliberation/<axis-slug>/",
  "Codex native subagents",
  "standing delegation",
  "prompt-side `$ralph`"
]);

forbidPhrases(".codex/skills/studio-deliberate/SKILL.md", [
  "[TODO:",
  "플레이어의 세션·동기·verb·loop를 설계하는 사람",
  "시각적 위계·color palette·motion language",
  "기술 제약·성능 예산·구현 비용",
  "회의의 quality bar"
]);

requirePhrases(".codex/skills/studio-deliberate/agents/openai.yaml", [
  "display_name: \"Studio Deliberate\"",
  "Use $studio-deliberate"
]);

requirePhrases("docs/studio/USER_PREFERENCES.md", [
  "P8 — Standing delegation",
  "사용자의 개입 없이도 studio가 돌아가게",
  "repo-native approval ledger"
]);

requirePhrases("docs/studio/DELIBERATION_WORKFLOW.md", [
  "Autonomous Studio standing delegation",
  "user-review.md",
  "do not self-approve"
]);

requirePhrases("docs/studio/HANDOFF.md", [
  "Cycle A OK / 다음 axis는 garden-respecting-hud-assets",
  "Decision resolved",
  "userApproved: true",
  "`garden-respecting-hud-assets`"
]);

requirePhrases("scripts/write-operator-heartbeat.mjs", [
  "user-approved",
  "userApproved",
  "user_approval",
  "approval-source",
  "axis"
]);

requirePhrases("scripts/studio-v3-operator.mjs", [
  "--axis SLUG",
  "--cycle-a-approved",
  "$studio-deliberate",
  "Selected deliberation axis",
  "selected_axis"
]);

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "studio-deliberation-loop-"));
const promptPath = path.join(tempDir, "prompt.md");
const statePath = path.join(tempDir, "state.json");
const reportPath = path.join(tempDir, "report.md");

const promptOnly = runNode([
  "scripts/studio-v3-operator.mjs",
  "--prompt-only",
  "--backend", "codex",
  "--axis", "garden-respecting-hud-assets",
  "--cycle-a-approved",
  "--worktree", process.cwd(),
  "--prompt", promptPath,
  "--state", statePath,
  "--report", reportPath
]);
for (const phrase of ["garden-respecting-hud-assets", "\"cycle_a_approved\": true"]) {
  if (!promptOnly.includes(phrase)) failures.push(`prompt-only output missing phrase: ${phrase}`);
}

const prompt = read(promptPath);
for (const phrase of [
  "Selected deliberation axis: `garden-respecting-hud-assets`",
  "$studio-deliberate garden-respecting-hud-assets",
  "standing delegation",
  "userApproved=true",
  "Do not invent user approval"
]) {
  if (!prompt.includes(phrase)) failures.push(`generated prompt missing phrase: ${phrase}`);
}

const report = read(reportPath);
for (const phrase of ["Selected deliberation axis: `garden-respecting-hud-assets`", "Cycle A approved: true"]) {
  if (!report.includes(phrase)) failures.push(`generated report missing phrase: ${phrase}`);
}

const heartbeatPath = path.join(tempDir, "heartbeat.json");
const heartbeatReport = path.join(tempDir, "heartbeat.jsonl");
runNode([
  "scripts/write-operator-heartbeat.mjs",
  "--heartbeat", heartbeatPath,
  "--report", heartbeatReport,
  "--actor", "check",
  "--phase", "cycle-a-approved",
  "--axis", "garden-respecting-hud-assets",
  "--user-approved", "true",
  "--approval-source", "Codex handoff user message",
  "--approval-scope", "Cycle A close"
]);
const heartbeat = JSON.parse(read(heartbeatPath) || "{}");
if (heartbeat.userApproved !== true) failures.push("heartbeat userApproved must be true");
if (heartbeat.axis !== "garden-respecting-hud-assets") failures.push("heartbeat axis mismatch");
if (heartbeat.user_approval?.source !== "Codex handoff user message") failures.push("heartbeat approval source mismatch");

console.log(JSON.stringify({ ok: failures.length === 0, tempDir, failures }, null, 2));
if (failures.length > 0) process.exit(1);
