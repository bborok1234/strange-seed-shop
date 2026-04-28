import fs from "node:fs";

const requiredPaths = [
  "docs/BROWSER_QA.md",
  "reports/visual/browser_use_qa_20260427.md",
  "reports/visual/browser-use-mobile-20260427.png",
  "reports/visual/browser-use-click-flow-20260427.png",
  "reports/visual/browser-use-offline-reward-20260427.png",
  "reports/visual/browser-use-main-20260427.png",
  "reports/visual/mission-reward-loop-20260427.png",
  "reports/visual/seed-purchase-loop-20260427.png",
  "reports/visual/expedition-reward-loop-20260427.png",
  "reports/visual/bottom-tab-surfaces-20260427.png",
  "reports/visual/chrome-cdp-mobile-360-20260427.png",
  "reports/visual/chrome-cdp-desktop-1280-20260427.png",
  "reports/visual/design-system-mobile-360-20260427.png",
  "reports/visual/design-system-desktop-1280-20260427.png",
  "reports/visual/design-system-tabs-20260427.png",
  "reports/visual/design-system-shop-click-20260427.md",
  "reports/visual/phaser-browser-use-fallback-20260427.md",
  "reports/visual/phaser-playfield-mobile-360-20260427.png",
  "reports/visual/phaser-playfield-desktop-1280-20260427.png",
  "reports/visual/phaser-playfield-after-loop-20260427.png",
  "reports/visual/browser-use-iab-runtime-diagnostic-20260428.md",
  "reports/visual/browser-use-iab-fallback-phaser-mobile-20260428.png",
  "reports/visual/browser-use-iab-fallback-phaser-desktop-20260428.png"
];

const requiredPhrases = new Map([
  [
    "docs/BROWSER_QA.md",
    [
      "Codex Browser Use 플러그인을 1순위로 사용한다",
      "`browser-use:browser` 스킬을 읽고 따른다",
      "Browser Use를 시도하기 전에",
      "정확한 viewport 크기 지정이 필요한 경우",
      "reports/visual/browser-use-main-20260427.png",
      "reports/visual/mission-reward-loop-20260427.png",
      "reports/visual/seed-purchase-loop-20260427.png",
      "reports/visual/expedition-reward-loop-20260427.png",
      "reports/visual/bottom-tab-surfaces-20260427.png",
      "reports/visual/design-system-mobile-360-20260427.png",
      "reports/visual/design-system-desktop-1280-20260427.png",
      "reports/visual/design-system-tabs-20260427.png",
      "reports/visual/design-system-shop-click-20260427.md",
      "reports/visual/phaser-browser-use-fallback-20260427.md",
      "reports/visual/phaser-playfield-mobile-360-20260427.png",
      "reports/visual/phaser-playfield-desktop-1280-20260427.png",
      "reports/visual/phaser-playfield-after-loop-20260427.png",
      "reports/visual/browser-use-iab-runtime-diagnostic-20260428.md",
      "reports/visual/browser-use-iab-fallback-phaser-mobile-20260428.png",
      "reports/visual/browser-use-iab-fallback-phaser-desktop-20260428.png"
    ]
  ],
  [
    "reports/visual/phaser-browser-use-fallback-20260427.md",
    [
      "accepted fallback",
      "Node REPL `js`",
      "reports/visual/phaser-playfield-mobile-360-20260427.png",
      "reports/visual/phaser-playfield-desktop-1280-20260427.png",
      "reports/visual/phaser-playfield-after-loop-20260427.png"
    ]
  ],
  [
    "reports/visual/browser-use-iab-runtime-diagnostic-20260428.md",
    [
      "Status: accepted fallback",
      "Issue: #18",
      "Browser Use 우선 시도",
      "Node REPL `js`",
      "Static import \"node:os\" is not supported",
      "Accepted fallback evidence",
      "reports/visual/browser-use-iab-fallback-phaser-mobile-20260428.png",
      "reports/visual/browser-use-iab-fallback-phaser-desktop-20260428.png",
      "다음 복구 조건"
    ]
  ],
  [
    "reports/visual/browser_use_qa_20260427.md",
    [
      "Browser Use `iab` backend",
      "reports/visual/browser-use-main-20260427.png",
      "reports/visual/mission-reward-loop-20260427.png",
      "reports/visual/seed-purchase-loop-20260427.png",
      "reports/visual/expedition-reward-loop-20260427.png",
      "reports/visual/bottom-tab-surfaces-20260427.png",
      "reports/visual/design-system-mobile-360-20260427.png",
      "reports/visual/design-system-desktop-1280-20260427.png",
      "reports/visual/design-system-tabs-20260427.png",
      "reports/visual/design-system-shop-click-20260427.md",
      "Chrome DevTools Protocol은 viewport 고정 캡처에만 보조로 사용했다"
    ]
  ]
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
