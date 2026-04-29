import fs from "node:fs";

const failures = [];

const requiredPaths = [
  "docs/PROJECT_COMMANDS.md",
  ".codex/skills/seed-ops/SKILL.md",
  ".codex/skills/seed-brief/SKILL.md",
  ".codex/skills/seed-design/SKILL.md",
  ".codex/skills/seed-qa/SKILL.md",
  ".codex/skills/seed-play/SKILL.md",
  "items/0067-project-command-surface.md"
];

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

for (const filePath of requiredPaths) requirePath(filePath);

const commands = ["$seed-ops", "$seed-brief", "$seed-design", "$seed-qa", "$seed-play"];

requirePhrases("docs/PROJECT_COMMANDS.md", [
  "프로젝트 전용 명령어",
  "운영모드",
  "보고/상황판",
  "설계/기획 대화",
  "실기 QA",
  "사람 플레이 준비",
  "완료 보고는 중단 조건이 아니라 checkpoint",
  "issue -> `## Plan` -> 구현 -> 검증 -> PR -> CI -> merge -> 다음 issue",
  "GitHub metadata 품질 규칙",
  "--body-file",
  "literal `\\n`",
  "작업 checklist",
  "Browser Use 우선 QA",
  "Browser Use",
  "Playwright CLI",
  "Computer Use",
  "npm run play:main",
  ...commands
]);

requirePhrases("items/0067-project-command-surface.md", [
  "Status: active",
  "Work type: agent_ops",
  "Issue: #117",
  "## Plan",
  ...commands,
  "npm run check:project-commands",
  "npm run check:all"
]);

requirePhrases("AGENTS.md", [
  "docs/PROJECT_COMMANDS.md",
  ...commands,
  "프로젝트 전용 명령어",
  "완료 보고는 중단 조건이 아니라 체크포인트",
  "--body-file"
]);

requirePhrases("docs/README.md", [
  "PROJECT_COMMANDS.md",
  ...commands,
  "프로젝트 전용 명령어"
]);

for (const command of ["seed-ops", "seed-brief", "seed-design", "seed-qa", "seed-play"]) {
  requirePhrases(`.codex/skills/${command}/SKILL.md`, [
    `name: ${command}`,
    "description:",
    "# "
  ]);
}

requirePhrases(".codex/skills/seed-ops/SKILL.md", [
  "무한 운영모드",
  "issue 선택/생성 -> `## Plan` artifact",
  "완료 보고는 중단 조건이 아니라 checkpoint",
  "Stop rules"
]);

requirePhrases(".codex/skills/seed-brief/SKILL.md", [
  "보고/상황판 모드",
  "새 구현을 시작하지 않는다",
  "issue/PR/CI"
]);

requirePhrases(".codex/skills/seed-design/SKILL.md", [
  "설계/기획 대화 모드",
  "tradeoff",
  "별도 issue"
]);

requirePhrases(".codex/skills/seed-qa/SKILL.md", [
  "실기 QA/visual QA 모드",
  "Browser Use",
  "Playwright CLI",
  "Computer Use"
]);

requirePhrases(".codex/skills/seed-play/SKILL.md", [
  "사람 플레이 준비 모드",
  "npm run play:main",
  "../strange-seed-shop-play",
  "5174"
]);

requirePhrases("package.json", [
  "check:project-commands",
  "scripts/check-project-commands.mjs"
]);

console.log(JSON.stringify({ ok: failures.length === 0, requiredPaths: requiredPaths.length, failures }, null, 2));

if (failures.length > 0) process.exit(1);
