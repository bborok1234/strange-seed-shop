import fs from "node:fs";

const failures = [];

function requirePath(path) {
  if (!fs.existsSync(path)) failures.push(`missing required path: ${path}`);
}

function requirePhrase(path, phrase) {
  if (!fs.existsSync(path)) return;
  const content = fs.readFileSync(path, "utf8");
  if (!content.includes(phrase)) failures.push(`${path} missing phrase: ${phrase}`);
}

function forbidPhrase(path, phrase) {
  if (!fs.existsSync(path)) return;
  const content = fs.readFileSync(path, "utf8");
  if (content.includes(phrase)) failures.push(`${path} must not include phrase: ${phrase}`);
}

const requiredPaths = [
  "docs/GAME_UI_UX_RESEARCH_20260428.md",
  "items/0053-game-ui-ux-p0-rescue.md",
  "assets/source/asset_alpha_exceptions.json",
  "scripts/check-asset-alpha-quality.mjs",
  "reports/visual/p0-ui-ux-rescue-20260428.md",
  "reports/visual/p0-ui-ux-before-main-mobile-20260428.png",
  "reports/visual/p0-ui-ux-before-main-desktop-20260428.png",
  "reports/visual/p0-ui-ux-after-mobile-20260428.png",
  "reports/visual/p0-ui-ux-after-desktop-20260428.png",
  "reports/visual/p0-ui-ux-debug-mode-desktop-20260428.png",
  "items/0056-mobile-tab-screen-visual-regression.md",
  "playwright.config.ts",
  "tests/visual/p0-mobile-game-shell.spec.ts",
  "reports/visual/p0-mobile-ui-visual-regression-20260428.md",
  "reports/visual/p0-mobile-garden-playfield-playwright-20260428.png",
  "reports/visual/p0-mobile-tab-screen-playwright-20260428.png",
  "reports/visual/p0-desktop-in-stage-album-playwright-20260428.png",
  "items/0057-mobile-garden-hud-polish.md",
  "reports/visual/p0-mobile-garden-hud-polish-20260428.md",
  "reports/visual/p0-mobile-garden-hud-polish-mobile-20260428.png",
  "reports/visual/p0-mobile-garden-hud-polish-mobile-360-20260428.png",
  "reports/visual/p0-mobile-garden-hud-polish-desktop-20260428.png",
  "items/0058-playfield-presentation-polish.md",
  "reports/visual/p0-playfield-presentation-polish-20260428.md",
  "reports/visual/p0-playfield-presentation-polish-mobile-393-20260428.png",
  "reports/visual/p0-playfield-presentation-polish-mobile-375-20260428.png",
  "reports/visual/p0-playfield-presentation-polish-mobile-360-20260428.png",
  "reports/visual/p0-playfield-presentation-polish-desktop-20260428.png",
  "items/0059-playfield-visual-noise-cleanup.md",
  "reports/visual/p0-playfield-noise-cleanup-20260428.md",
  "reports/visual/p0-playfield-noise-cleanup-mobile-393-20260428.png",
  "reports/visual/p0-playfield-noise-cleanup-mobile-375-20260428.png",
  "reports/visual/p0-playfield-noise-cleanup-mobile-360-20260428.png",
  "reports/visual/p0-playfield-noise-cleanup-desktop-20260428.png"
];
for (const path of requiredPaths) requirePath(path);


for (const phrase of [
  "P0 UI/UX Rescue Visual Evidence",
  "Before — current main",
  "After — branch",
  "Explicit debug desktop",
  "Remaining visual risk"
]) {
  requirePhrase("reports/visual/p0-ui-ux-rescue-20260428.md", phrase);
}

for (const phrase of [
  "Playfield first",
  "Debug is not player UI",
  "Mobile and desktop are separate display modes",
  "Playwright CLI visual regression",
  "full tab screen",
  "alpha channel"
]) {
  requirePhrase("docs/GAME_UI_UX_RESEARCH_20260428.md", phrase);
}

for (const phrase of [
  "P0 Game Studio Operating Mode — UI/UX Rescue",
  "Playfield-first garden screen",
  "Mobile tab screen architecture",
  "Player/debug surface split",
  "Asset alpha/background quality gate",
  "Issue #95"
]) {
  requirePhrase("docs/ROADMAP.md", phrase);
}

for (const phrase of [
  "P0 Game Screen Policy — 2026-04-28",
  "Phaser playfield를 가장 큰 시각 영역",
  "개발 정보는 보이지 않아야 한다",
  "full tab screen",
  "npm run check:visual"
]) {
  requirePhrase("docs/DESIGN_SYSTEM.md", phrase);
}

for (const phrase of [
  "showDebugPanel",
  "isPlayerTabScreen",
  "showSidePanel",
  "garden-action-dock",
  "showDebugPanel && activeTab === \"garden\""
]) {
  requirePhrase("src/App.tsx", phrase);
}

for (const phrase of [
  ".app-shell.playable-focus",
  "grid-template-rows: minmax(360px, 1fr) auto",
  ".garden-stage.has-player-tab",
  "height: calc(100% - 72px",
  "display: none;",
  ".garden-action-dock",
  "max-height: none"
]) {
  requirePhrase("src/styles.css", phrase);
}


for (const phrase of [
  "drawHarvestAura",
  "drawLockGlyph",
  "drawEmptyCue",
  "drawStatusPill"
]) {
  requirePhrase("src/game/playfield/GardenScene.ts", phrase);
}

for (const phrase of [
  "strokeAlpha",
  "plot.state !== \"locked\"",
  "0.08"
]) {
  requirePhrase("src/game/playfield/GardenScene.ts", phrase);
}

forbidPhrase("src/game/playfield/GardenScene.ts", "setWordWrapWidth");
forbidPhrase("src/game/playfield/GardenScene.ts", "this.viewModel?.headline ?? \"정원 준비 중\"");
forbidPhrase("src/game/playfield/GardenScene.ts", "this.viewModel?.hint ?? \"밭을 눌러 성장과 수확을 진행하세요\"");

console.log(JSON.stringify({ ok: failures.length === 0, checked: requiredPaths.length, failures }, null, 2));

if (failures.length > 0) process.exit(1);
