import fs from "node:fs";

const failures = [];

function requirePath(filePath) {
  if (!fs.existsSync(filePath)) failures.push(`missing required path: ${filePath}`);
}

function requirePhrases(filePath, phrases) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, "utf8");
  for (const phrase of phrases) {
    if (!content.includes(phrase)) failures.push(`${filePath} missing phrase: ${phrase}`);
  }
}

const requiredPaths = [
  "reports/gtm/README.md",
  "reports/gtm/gtm-mock-sample-20260428.md",
  "items/0026-gtm-mock-lane-v0.md",
  "scripts/check-gtm-mock.mjs",
  "docs/APPLY_CONDITIONS.md"
];

for (const filePath of requiredPaths) requirePath(filePath);

requirePhrases("reports/gtm/README.md", [
  "GTM mock lane",
  "허용 행동",
  "금지 행동",
  "Approval gate",
  "실제 SNS, 커뮤니티, 이메일, 광고, 앱/웹 스토어",
  "credential",
  "human review",
  "Mock proposal 필수 필드"
]);

requirePhrases("reports/gtm/gtm-mock-sample-20260428.md", [
  "Status: mock-proposal",
  "Draft type: devlog",
  "Draft type: release note",
  "Draft type: community post",
  "Do-not-publish boundary",
  "Approval needed: human approval required before any real channel action",
  "Risk notes",
  "Recommended next item",
  "Approval checklist"
]);

requirePhrases("items/0026-gtm-mock-lane-v0.md", [
  "Status: in_progress",
  "Work type: gtm_mock",
  "Issue: #38",
  "npm run check:gtm-mock",
  "실제 외부 채널 게시"
]);

requirePhrases("docs/APPLY_CONDITIONS.md", [
  "실채널 GTM 승인 gate",
  "SNS/email/ads/store/community",
  "human approval required",
  "Do-not-publish boundary"
]);

if (failures.length > 0) {
  console.error(JSON.stringify({ ok: false, failures }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      ok: true,
      requiredPaths: requiredPaths.length,
      failures: []
    },
    null,
    2
  )
);
