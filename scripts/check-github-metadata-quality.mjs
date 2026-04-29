import fs from "node:fs";

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
    if (!content.includes(phrase)) {
      failures.push(`${filePath} missing phrase: ${phrase}`);
    }
  }
}

function forbidPhrases(filePath, phrases) {
  const content = read(filePath);
  for (const phrase of phrases) {
    if (content.includes(phrase)) {
      failures.push(`${filePath} contains forbidden phrase: ${phrase}`);
    }
  }
}

const prSections = [
  "## 요약",
  "## Small win",
  "## Plan-first evidence",
  "## Game Studio route",
  "## 작업 checklist",
  "## 사용자/운영자 가치",
  "## Before / After 또는 Visual evidence",
  "## Playable mode",
  "## 검증",
  "## 안전 범위",
  "## 남은 위험",
  "## 연결된 issue"
];

const issueSections = [
  "## 문제 / 배경",
  "## 목표",
  "## Small win",
  "## Game Studio route",
  "## Plan",
  "## 플레이어 가치 또는 운영사 가치",
  "## 수용 기준",
  "## Visual evidence 계획",
  "## Playable mode 영향",
  "## 안전 범위",
  "## 검증 명령"
];

requirePhrases(".github/pull_request_template.md", [
  ...prSections,
  "--body-file",
  "literal `\\n`",
  "섹션을 삭제하지 않는다",
  "N/A 사유",
  "Browser Use 우선 QA",
  "작업 checklist",
  "game-studio:game-studio",
  "game-studio:game-ui-frontend",
  "game-studio:game-playtest",
  "playfield",
  "HUD"
]);

requirePhrases(".github/ISSUE_TEMPLATE/agent-work-item.md", [
  ...issueSections,
  "--body-file",
  "literal `\\n`",
  "섹션을 삭제하지 않는다",
  "N/A 사유",
  "Browser Use 우선 QA",
  "game-studio:game-studio",
  "game-studio:game-ui-frontend",
  "game-studio:game-playtest",
  "Playtest evidence"
]);

requirePhrases("docs/PROJECT_COMMANDS.md", [
  "GitHub metadata 품질 규칙",
  "markdown 파일",
  "--body-file",
  "literal `\\n`",
  "작업 checklist",
  "Browser Use 우선 QA",
  "Game Studio routing gate",
  "game-studio:game-studio",
  "game-studio:game-playtest",
  "완료 댓글도 축약하지 않는다",
  "npm run check:github-metadata"
]);

requirePhrases("AGENTS.md", [
  "GitHub issue/PR/comment 본문은 운영사 evidence surface",
  "--body-file",
  "셸 인자 안에 `\\n`",
  "섹션을 삭제하지 않는다",
  "작업 checklist",
  "Browser Use 우선 QA"
]);

requirePhrases("package.json", [
  "check:github-metadata",
  "scripts/check-github-metadata-quality.mjs"
]);

forbidPhrases(".github/pull_request_template.md", ["요약\\n-"]);
forbidPhrases(".github/ISSUE_TEMPLATE/agent-work-item.md", ["Small win\\n"]);

console.log(
  JSON.stringify(
    {
      ok: failures.length === 0,
      checked: {
        prSections: prSections.length,
        issueSections: issueSections.length
      },
      failures
    },
    null,
    2
  )
);

if (failures.length > 0) process.exit(1);
