import fs from "node:fs";

const requiredPaths = [
  "reports/audits/audit_20260427.md",
  "reports/audits/pr_automation_20260427.md",
  "reports/audits/branch_protection_20260427.md",
  "items/0005-pr-automation-audit.md",
  "items/0006-branch-protection-audit.md",
  "items/0007-generated-pr-audit.md",
  "scripts/update-pr-automation-audit.mjs"
];

const requiredPhrases = new Map([
  [
    "reports/audits/pr_automation_20260427.md",
    [
      "npm run update:pr-audit",
      "PR #1",
      "PR #2",
      "PR #3",
      "PR #4",
      "PR #5",
      "PR #6",
      "PR #7",
      "MERGED",
      "Agent Automerge Trial",
      "main CI"
    ]
  ],
  [
    "reports/audits/branch_protection_20260427.md",
    ["protected: false", "HTTP 403", "ENABLE_AGENT_AUTOMERGE", "required checks", "warn"]
  ],
  ["items/0005-pr-automation-audit.md", ["Status: verified", "PR 자동화 결과", "npm run check:audit"]],
  ["items/0007-generated-pr-audit.md", ["Status: verified", "PR 결과 audit 자동 생성", "npm run update:pr-audit"]]
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
