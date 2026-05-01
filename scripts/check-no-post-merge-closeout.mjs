import fs from "node:fs";
import path from "node:path";

const failures = [];

function read(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
}

function requirePhrases(filePath, phrases) {
  const content = read(filePath);
  if (!content) {
    failures.push(`missing readable file: ${filePath}`);
    return;
  }

  for (const phrase of phrases) {
    if (!content.includes(phrase)) failures.push(`${filePath} missing phrase: ${phrase}`);
  }
}

function collectOperationFiles() {
  const dir = "reports/operations";
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).map((name) => path.join(dir, name));
}

function isForbiddenCloseoutBody(filePath) {
  const name = path.basename(filePath);
  if (name.includes("no-post-merge-closeout")) return false;
  return /^(pr|issue)-.+closeout.+body\.md$/.test(name);
}

const forbiddenCloseoutBodies = collectOperationFiles().filter(isForbiddenCloseoutBody);
for (const filePath of forbiddenCloseoutBodies) {
  failures.push(`${filePath}: post-merge closeout body files are forbidden; evidence must live in the original PR before merge/close`);
}

const requiredContractPhrases = [
  "all merge-blocking evidence must be in the original PR before merge/close",
  "post-merge main CI is observation-only",
  "do not create a post-merge closeout PR",
  "main-targeted closeout commit"
];

for (const filePath of [
  "AGENTS.md",
  ".codex/skills/seed-ops/SKILL.md",
  "docs/PROJECT_COMMANDS.md",
  "docs/OPERATOR_RUNBOOK.md",
  "docs/AUTONOMOUS_PROJECT_OPERATING_MODEL.md",
  ".github/pull_request_template.md"
]) {
  requirePhrases(filePath, requiredContractPhrases);
}

const packageJson = JSON.parse(read("package.json"));
if (packageJson.scripts?.["check:no-post-merge-closeout"] !== "node scripts/check-no-post-merge-closeout.mjs") {
  failures.push("package.json missing check:no-post-merge-closeout script");
}
if (!String(packageJson.scripts?.["check:ci"] ?? "").includes("npm run check:no-post-merge-closeout")) {
  failures.push("package.json check:ci should run check:no-post-merge-closeout");
}

const fixtureNames = [
  "pr-0132-lunar-harvest-closeout-body.md",
  "issue-999-post-merge-closeout-body.md"
];
for (const name of fixtureNames) {
  if (!isForbiddenCloseoutBody(path.join("reports/operations", name))) {
    failures.push(`fixture ${name} should be forbidden`);
  }
}

console.log(
  JSON.stringify(
    {
      ok: failures.length === 0,
      forbiddenCloseoutBodies,
      failures
    },
    null,
    2
  )
);

if (failures.length > 0) process.exit(1);
