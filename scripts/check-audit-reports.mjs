import fs from "node:fs";

const requiredPaths = [
  "reports/audits/audit_20260427.md",
  "reports/audits/pr_automation_20260427.md",
  "reports/audits/branch_protection_20260427.md",
  "items/0005-pr-automation-audit.md",
  "items/0006-branch-protection-audit.md",
  "items/0007-generated-pr-audit.md",
  "items/0009-pr-audit-refresh-9.md",
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
      "PR #8",
      "PR #9",
      "이 report는 생성 시점의 스냅샷",
      "고정 PR 번호가 아니라 report 내부 일관성을 검증",
      "무한 갱신 루프는 만들지 않는다",
      "MERGED",
      "Agent Automerge Trial",
      "main CI"
    ]
  ],
  [
    "reports/audits/branch_protection_20260427.md",
    ["protected: true", "HTTP 403", "ENABLE_AGENT_AUTOMERGE", "required checks", "pass"]
  ],
  ["items/0005-pr-automation-audit.md", ["Status: verified", "PR 자동화 결과", "npm run check:audit"]],
  ["items/0007-generated-pr-audit.md", ["Status: verified", "PR 결과 audit 자동 생성", "npm run update:pr-audit"]],
  ["items/0009-pr-audit-refresh-9.md", ["Status: verified", "PR #9", "npm run update:pr-audit"]]
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

const prAuditPath = "reports/audits/pr_automation_20260427.md";
if (fs.existsSync(prAuditPath)) {
  const content = fs.readFileSync(prAuditPath, "utf8");
  const prRows = content.match(/^\| PR #\d+ \|/gm) ?? [];
  const totalMatch = content.match(/- 자동화 PR 수: (\d+)/);
  const mergedMatch = content.match(/- 병합된 자동화 PR 수: (\d+)/);
  const mergedRows = content.match(/^\| PR #\d+ \|.*\| MERGED \|/gm) ?? [];

  if (!totalMatch) {
    failures.push(`${prAuditPath} missing automation PR count`);
  } else if (Number(totalMatch[1]) !== prRows.length) {
    failures.push(`${prAuditPath} automation PR count mismatch: ${totalMatch[1]} != ${prRows.length}`);
  }

  if (!mergedMatch) {
    failures.push(`${prAuditPath} missing merged automation PR count`);
  } else if (Number(mergedMatch[1]) !== mergedRows.length) {
    failures.push(`${prAuditPath} merged automation PR count mismatch: ${mergedMatch[1]} != ${mergedRows.length}`);
  }
}

console.log(JSON.stringify({ ok: failures.length === 0, requiredPaths: requiredPaths.length, failures }, null, 2));

if (failures.length > 0) {
  process.exit(1);
}
