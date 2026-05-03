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

requirePhrases("package.json", [
  "studio:v3:operate",
  "scripts/studio-v3-operator.mjs",
  "check:studio-v3-operator",
  "scripts/check-studio-v3-operator.mjs"
]);

requirePhrases("scripts/studio-v3-operator.mjs", [
  "Studio Harness v3 foreground operator entrypoint",
  "This does not call or route through $seed-ops",
  "seed_ops_entrypoint: false",
  "Browser Use Node REPL MCP",
  "codex mcp add node_repl",
  "plan-first",
  "Browser Use iab QA",
  "GitHub checks",
  "merge",
  "main CI observation"
]);

requirePhrases("docs/STUDIO_HARNESS_V3_RUNNER_USAGE.md", [
  "npm run studio:v3:runner",
  "npm run studio:v3:operate",
  "v3 운영 루프 진입점 상태",
  "현재 사용 가능",
  "금지/회귀",
  "Browser Use"
]);

requirePhrases("docs/PROJECT_COMMANDS.md", [
  "Studio Harness v3 foreground operator",
  "npm run studio:v3:operate",
  "`$seed-ops`는 Studio Harness v3 entrypoint가 아니다",
  "계속 달려",
  "GitHub issue/PR/GateEvent"
]);

requirePhrases(".codex/skills/seed-ops/SKILL.md", [
  "deprecated adapter",
  "Studio Harness v3 entrypoint가 아니다",
  "npm run studio:v3:operate"
]);

forbidPhrases("docs/STUDIO_HARNESS_V3_RUNNER_USAGE.md", [
  "Codex/OMX 세션에서 `$seed-ops`로 시작",
  "`$seed-ops`: 실제 foreground 운영사 루프",
  "```text\n$seed-ops\n```"
]);

forbidPhrases("docs/PROJECT_COMMANDS.md", [
  "사용자가 “계속 달려”, “운영모드”, “북극성까지”라고 하면 `$seed-ops`로 본다",
  "`$seed-ops`는 장시간 운영사 루프의 프로젝트 전용 진입점이다"
]);

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "studio-v3-operator-"));
const promptPath = path.join(tempDir, "prompt.md");
const statePath = path.join(tempDir, "state.json");
const reportPath = path.join(tempDir, "report.md");

const help = runNode(["scripts/studio-v3-operator.mjs", "--help"]);
for (const phrase of ["npm run studio:v3:operate", "$seed-ops is not the v3", "--detached", "--doctor"]) {
  if (!help.includes(phrase)) failures.push(`help output missing phrase: ${phrase}`);
}

const doctor = runNode([
  "scripts/studio-v3-operator.mjs",
  "--doctor",
  "--print-command",
  "--backend", "codex",
  "--worktree", process.cwd(),
  "--prompt", promptPath,
  "--state", statePath,
  "--report", reportPath
]);
for (const phrase of ["\"checks\"", "# foreground", "# detached", "codex", "studio-v3-operator-prompt"]) {
  if (!doctor.includes(phrase) && !doctor.includes(path.basename(promptPath))) failures.push(`doctor output missing phrase: ${phrase}`);
}

const promptOnly = runNode([
  "scripts/studio-v3-operator.mjs",
  "--prompt-only",
  "--backend", "codex",
  "--issue", "293",
  "--worktree", process.cwd(),
  "--prompt", promptPath,
  "--state", statePath,
  "--report", reportPath
]);
if (!promptOnly.includes("seed_ops_entrypoint")) failures.push("prompt-only output missing seed_ops_entrypoint flag");
const prompt = read(promptPath);
for (const phrase of ["절대 $seed-ops", "GitHub issue/PR/GateEvent", "Browser Use iab", "plan-first", "PR create/update", "merge when green", "queue empty"]) {
  if (!prompt.includes(phrase)) failures.push(`generated prompt missing phrase: ${phrase}`);
}
const report = read(reportPath);
for (const phrase of ["$seed-ops", "Foreground command", "Detached command", "Readiness"]) {
  if (!report.includes(phrase)) failures.push(`generated report missing phrase: ${phrase}`);
}

console.log(JSON.stringify({ ok: failures.length === 0, tempDir, failures }, null, 2));
if (failures.length > 0) process.exit(1);
