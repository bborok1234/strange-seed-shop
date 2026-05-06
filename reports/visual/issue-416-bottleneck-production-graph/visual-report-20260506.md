# Issue #416 - Bottleneck-readable production graph visual QA

## Browser Use

- Tool: `browser-use:browser` with `iab` backend
- Result: blocked
- Blocker: Codex in-app browser backend was not discoverable in this session. Node REPL Browser Use setup was attempted before Playwright fallback.
- Fallback: Playwright visual regression and screenshots.

## Screenshots

- Before storage upgrade: `reports/visual/issue-416-bottleneck-production-graph/before-storage-393.png`
- After storage upgrade: `reports/visual/issue-416-bottleneck-production-graph/after-storage-393.png`

## Findings

- 393px garden first screen now shows a one-line production graph summary: `분당 7.2 잎 · 보관 부족 · 주문 0/12`.
- Action card recommends `보관 바구니` first and shows storage numeric change `12 -> 24`.
- The storage basket prop is visible in the recommended upgrade and changes state after purchase.
- Existing production claim/order flow still passes the focused regression.
- Desktop mobile-frame art sharing regression passes for 1280x800, 1600x900, and 1920x1180.

## Verification

- `npx playwright test --config playwright.config.ts tests/visual/p0-mobile-game-shell.spec.ts --grep "병목|자동 생산과 첫 주문"`: pass, 2 tests
- `npx playwright test --config playwright.config.ts tests/visual/desktop-art-share.spec.ts`: pass, 15 tests
- `npm run build`: pass
- `npm run check:ci`: pass
