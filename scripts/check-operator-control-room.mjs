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
  "docs/OPERATOR_CONTROL_ROOM.md",
  "docs/PLAYABLE_MODE.md",
  "reports/research/agent_operator_control_room_research_20260428.md",
  ".github/ISSUE_TEMPLATE/agent-work-item.md",
  ".github/pull_request_template.md",
  "scripts/prepare-playable-main.mjs",
  "scripts/operator-control-room.mjs"
];

for (const filePath of requiredPaths) requirePath(filePath);

requirePhrases("docs/OPERATOR_CONTROL_ROOM.md", [
  "Operator Control Room",
  "Small win",
  "Visual evidence",
  "Playable Mode",
  "npm run play:main",
  "5174",
  "24h dry run gate",
  "ClawSweeper",
  "GitHub Mission Control",
  "Ralph"
]);

requirePhrases("docs/PLAYABLE_MODE.md", [
  "사람 플레이 모드",
  "../strange-seed-shop-play",
  "detached HEAD",
  "5174",
  "--force",
  "--serve"
]);

requirePhrases(".github/ISSUE_TEMPLATE/agent-work-item.md", [
  "Small win",
  "플레이어 가치 또는 운영사 가치",
  "Visual evidence 계획",
  "Playable mode 영향",
  "npm run play:main"
]);

requirePhrases(".github/pull_request_template.md", [
  "Small win",
  "Before / After 또는 Visual evidence",
  "Playable mode",
  "npm run play:main",
  "남은 위험"
]);

requirePhrases("scripts/prepare-playable-main.mjs", [
  "git",
  "worktree",
  "--detach",
  "origin/main",
  "5174",
  "--check",
  "--serve",
  "--force",
  "playable worktree has local changes"
]);

requirePhrases("scripts/operator-control-room.mjs", [
  "Operator Control Room Snapshot",
  "Open PRs",
  "Open issues",
  "Playable mode",
  "Visual evidence rule",
  "Next stop gate",
  "production vertical slice"
]);

console.log(JSON.stringify({ ok: failures.length === 0, requiredPaths: requiredPaths.length, failures }, null, 2));
if (failures.length > 0) process.exit(1);
