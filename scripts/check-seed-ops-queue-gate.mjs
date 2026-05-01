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

const coreGatePhrases = [
  "기존 asset 재사용만으로는 통과하지 않는다",
  "concrete visual/game-feel payoff",
  "playfield state",
  "HUD affordance",
  "sprite/FX",
  "order crate visual state",
  "reward motion",
  "경쟁작 production gap",
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

requirePhrases("scripts/check-ops-live.mjs", [
  "concrete visual/game-feel payoff",
  "기존 asset 재사용만으로는 통과하지 않는다",
  "asset/FX or sprite-animation decision"
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

requirePhrases("package.json", [
  "check:seed-ops-queue",
  "scripts/check-seed-ops-queue-gate.mjs"
]);

console.log(JSON.stringify({ ok: failures.length === 0, checkedFiles: requiredPaths.length, failures }, null, 2));

if (failures.length > 0) process.exit(1);
