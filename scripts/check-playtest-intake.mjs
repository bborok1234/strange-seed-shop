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

function parseScoreRows(filePath) {
  if (!fs.existsSync(filePath)) return [];
  return fs
    .readFileSync(filePath, "utf8")
    .split("\n")
    .filter((line) => line.startsWith("| "))
    .map((line) => line.split("|").map((cell) => cell.trim()))
    .filter((cells) => ["first_5m_clarity", "cuteness", "collection_desire", "comeback_hook", "confusion"].includes(cells[1]));
}

const requiredPaths = [
  "docs/NORTH_STAR.md",
  "reports/playtests/README.md",
  "reports/playtests/playtest-intake-sample-20260428.md",
  "items/0025-feedback-intake-and-fun-rubric-v0.md",
  "scripts/check-playtest-intake.mjs"
];

for (const filePath of requiredPaths) requirePath(filePath);

requirePhrases("docs/NORTH_STAR.md", [
  "첫 5분 fun rubric",
  "first_5m_clarity",
  "cuteness",
  "collection_desire",
  "comeback_hook",
  "confusion",
  "혼란도는 낮을수록 좋다",
  "confusion >= 4",
  "막힘 없이 진행",
  "심각한 혼란 또는 시작 행동을 찾지 못함"
]);

requirePhrases("reports/playtests/README.md", [
  "Intake 필수 필드",
  "Privacy",
  "Severity",
  "Product axis",
  "Evidence",
  "Duplicate links",
  "Fun rubric scores",
  "Recommended next item",
  "실제 고객 데이터"
]);

requirePhrases("reports/playtests/playtest-intake-sample-20260428.md", [
  "Source: internal-playtest",
  "Privacy: none",
  "Severity: medium",
  "Product axis: first_5m_clarity, cuteness, collection_desire, comeback_hook, confusion",
  "Duplicate links: none",
  "Fun rubric scores",
  "Recommended next item",
  "No real customer data"
]);

requirePhrases("items/0025-feedback-intake-and-fun-rubric-v0.md", [
  "Status: in_progress",
  "Work type: feedback",
  "Issue: #36",
  "npm run check:playtest-intake",
  "실제 고객 개인정보"
]);

const scoreRows = parseScoreRows("reports/playtests/playtest-intake-sample-20260428.md");
const expectedRubrics = new Set(["first_5m_clarity", "cuteness", "collection_desire", "comeback_hook", "confusion"]);
for (const row of scoreRows) {
  const rubric = row[1];
  const score = Number(row[2]);
  expectedRubrics.delete(rubric);
  if (!Number.isInteger(score) || score < 1 || score > 5) {
    failures.push(`invalid score for ${rubric}: ${row[2]}`);
  }
}
for (const rubric of expectedRubrics) failures.push(`missing rubric score: ${rubric}`);

if (failures.length > 0) {
  console.error(JSON.stringify({ ok: false, failures }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      ok: true,
      requiredPaths: requiredPaths.length,
      rubricScores: scoreRows.length,
      failures: []
    },
    null,
    2
  )
);
