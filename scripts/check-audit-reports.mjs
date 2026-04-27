import fs from "node:fs";

const requiredPaths = [
  "reports/audits/audit_20260427.md",
  "reports/audits/pr_automation_20260427.md",
  "items/0005-pr-automation-audit.md"
];

const requiredPhrases = new Map([
  [
    "reports/audits/pr_automation_20260427.md",
    ["PR #1", "PR #2", "PR #3", "PR #4", "PR #5", "MERGED", "Agent Automerge Trial", "main CI"]
  ],
  ["items/0005-pr-automation-audit.md", ["Status: verified", "PR 자동화 결과", "npm run check:audit"]]
]);

const failures = [];

for (const path of requiredPaths) {
  if (!fs.existsSync(path)) {
    failures.push(`missing required path: ${path}`);
  }
}

for (const [path, phrases] of requiredPhrases.entries()) {
  if (!fs.existsSync(path)) {
    continue;
  }

  const content = fs.readFileSync(path, "utf8");
  for (const phrase of phrases) {
    if (!content.includes(phrase)) {
      failures.push(`${path} missing phrase: ${phrase}`);
    }
  }
}

console.log(JSON.stringify({ ok: failures.length === 0, requiredPaths: requiredPaths.length, failures }, null, 2));

if (failures.length > 0) {
  process.exit(1);
}
