import fs from "node:fs";

const failures = [];

function read(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
}

function requirePath(filePath) {
  if (!fs.existsSync(filePath)) failures.push(`missing required path: ${filePath}`);
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

// This checker still guards static documentation quality gates with exact
// phrases. Runtime behavior regressions, especially publication-boundary
// continuation, must be checked through structured state in
// check-seed-ops-publication-gate-state.mjs and check-ops-live.mjs.
function readJson(filePath) {
  try {
    return JSON.parse(read(filePath));
  } catch (error) {
    failures.push(`${filePath} has invalid JSON: ${error.message}`);
    return null;
  }
}

const coreGatePhrases = [
  "기존 asset 재사용만으로는 통과하지 않는다",
  "concrete visual/game-feel payoff",
  "playfield state",
  "HUD affordance",
  "sprite/FX",
  "order crate visual state",
  "reward motion",
  "경쟁작 production gap",
  "Codex native image generation",
  "gpt-image-2",
  "accepted manifest game asset",
  "animation.binding",
  "npm run check:asset-provenance",
  "npm run check:asset-style",
  "OPENAI_API_KEY",
  "SEED_ASSET_IMAGE_MODEL",
  "단순 주문 추가",
  "copy tweak",
  "test-only"
];

const continuationGatePhrases = [
  "No-final continuation gate",
  "final response is terminal",
  "next issue plan artifact exists",
  "left the next queue candidate is not continuation"
];

const studioCampaignPhrases = [
  "Studio Campaign Gate",
  "P0.5 Idle Core + Creative Rescue",
  "campaign source of truth",
  "Game Studio Department Signoff",
  "기획팀",
  "리서치팀",
  "아트팀",
  "개발팀",
  "검수팀",
  "마케팅팀",
  "고객지원팀",
  "role-debate note",
  "Subagent/Team Routing",
  "Codex native subagents",
  "team mode",
  "reference teardown",
  "creative brief",
  "QA/playtest plan",
  "gastory",
  "style state",
  "prompt/model sidecar",
  "reference image consistency",
  "animation camera/composition lock",
  "frame/GIF/spritesheet extraction"
];

const strategicSelectionPhrases = [
  "Strategic Jump Check",
  "Title Contract",
  "큰 방향 점프 후보",
  "Issue/PR 제목은 운영사 evidence surface",
  "screen moment + player verb + production/progression role",
  "bridge",
  "payoff",
  "closeout"
];

const requiredPaths = [
  "AGENTS.md",
  ".codex/skills/seed-ops/SKILL.md",
  "docs/AUTONOMOUS_PROJECT_OPERATING_MODEL.md",
  "docs/OPERATOR_RUNBOOK.md",
  "docs/PROJECT_COMMANDS.md",
  "docs/ROADMAP.md",
  "docs/OPERATOR_CONTROL_ROOM.md",
  "scripts/operator-control-room.mjs",
  "scripts/check-ops-live.mjs",
  "reports/operations/asset-ops-reference-review-20260501.md",
  "reports/operations/game-studio-harness-reference-review-20260501.md",
  "items/0129-game-studio-ops-harness.md",
  "items/0122-seed-ops-asset-fx-gate-hardening.md"
];

for (const filePath of requiredPaths) requirePath(filePath);

for (const filePath of [
  "AGENTS.md",
  ".codex/skills/seed-ops/SKILL.md",
  "docs/PROJECT_COMMANDS.md",
  "docs/ROADMAP.md",
  "docs/OPERATOR_CONTROL_ROOM.md",
  "scripts/operator-control-room.mjs"
]) {
  requirePhrases(filePath, coreGatePhrases);
}

for (const filePath of [
  "AGENTS.md",
  ".codex/skills/seed-ops/SKILL.md",
  "docs/AUTONOMOUS_PROJECT_OPERATING_MODEL.md",
  "docs/OPERATOR_RUNBOOK.md",
  "docs/PROJECT_COMMANDS.md"
]) {
  requirePhrases(filePath, continuationGatePhrases);
}

for (const filePath of [
  ".codex/skills/seed-ops/SKILL.md",
  "docs/PROJECT_COMMANDS.md",
  "docs/AUTONOMOUS_PROJECT_OPERATING_MODEL.md",
  "docs/OPERATOR_RUNBOOK.md",
  "docs/OPERATOR_CONTROL_ROOM.md",
  "docs/ROADMAP.md",
  "scripts/operator-control-room.mjs",
  "items/0129-game-studio-ops-harness.md",
  "reports/operations/game-studio-harness-reference-review-20260501.md"
]) {
  requirePhrases(filePath, studioCampaignPhrases);
}

for (const filePath of [".codex/skills/seed-ops/SKILL.md", "docs/PROJECT_COMMANDS.md"]) {
  requirePhrases(filePath, strategicSelectionPhrases);
}

requirePhrases("scripts/check-ops-live.mjs", [
  "concrete visual/game-feel payoff",
  "기존 asset 재사용만으로는 통과하지 않는다",
  "asset/FX or sprite-animation decision",
  "P0.5 Idle Core + Creative Rescue",
  "Game Studio Department Signoff",
  "Subagent/Team Routing",
  "campaign source of truth"
]);

requirePhrases("reports/operations/asset-ops-reference-review-20260501.md", [
  "Gastory",
  "Anthropic Skills",
  "Karpathy-style guidelines",
  "Superpowers",
  "gstack",
  "GSD",
  "Matt Pocock skills"
]);

const packageJson = readJson("package.json");
const scripts = packageJson?.scripts ?? {};
const expectedScripts = {
  "check:seed-ops-queue": "node scripts/check-seed-ops-queue-gate.mjs",
  "check:seed-ops-publication-gate": "node scripts/check-seed-ops-publication-gate-state.mjs",
  "check:ralph-runner-bridge": "node scripts/check-ralph-runner-bridge.mjs",
  "check:no-post-merge-closeout": "node scripts/check-no-post-merge-closeout.mjs",
  "check:asset-provenance": "node scripts/check-game-asset-provenance.mjs",
  "check:asset-style": "node scripts/check-asset-style-consistency.mjs",
  "asset:generate:gpt-image": "node scripts/generate-gpt-image-assets.mjs"
};

for (const [scriptName, expectedCommand] of Object.entries(expectedScripts)) {
  if (scripts[scriptName] !== expectedCommand) {
    failures.push(`package.json script ${scriptName} should be ${expectedCommand}, got ${scripts[scriptName] ?? "missing"}`);
  }
}

if (!String(scripts["check:ci"] ?? "").includes("npm run check:seed-ops-publication-gate")) {
  failures.push("package.json check:ci should run check:seed-ops-publication-gate");
}

if (!String(scripts["check:ci"] ?? "").includes("npm run check:ralph-runner-bridge")) {
  failures.push("package.json check:ci should run check:ralph-runner-bridge");
}

if (!String(scripts["check:ci"] ?? "").includes("npm run check:no-post-merge-closeout")) {
  failures.push("package.json check:ci should run check:no-post-merge-closeout");
}

console.log(JSON.stringify({ ok: failures.length === 0, checkedFiles: requiredPaths.length, failures }, null, 2));

if (failures.length > 0) process.exit(1);
