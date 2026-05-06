# Issue #420 Offline Return Garden State Visual Report

## Browser Use

- Required path: `browser-use:browser` with `iab`.
- Attempted through Node REPL `setupAtlasRuntime({ backend: "iab" })`.
- Result: blocked in this session. The backend reported no Codex IAB browser backend discovered.
- Fallback: Playwright regression and screenshots.

## Evidence

- Mobile 393 after: `reports/visual/issue-420-offline-return-garden-state/mobile-393-after.png`
- Mobile 360 after: `reports/visual/issue-420-offline-return-garden-state/mobile-360-after.png`
- Desktop 1280 after: `reports/visual/issue-420-offline-return-garden-state/desktop-1280-after.png`

## Checks

- `npx playwright test --config playwright.config.ts tests/visual/p0-mobile-game-shell.spec.ts --grep "복귀 보상 확인 후|짧은 모바일 복귀 정원 state|복귀 첫 30초"`: passed, 3 tests.
- `npx playwright test --config playwright.config.ts tests/visual/desktop-art-share.spec.ts --grep "복귀 정원 state|production garden visual composition"`: passed, 2 tests.
- `npm run build`: passed.

## Visual Result

- 복귀 보상 `보상 확인` 후 modal이 사라져도 production card에 `복귀 잎 보관` receipt가 남는다.
- Playfield order crate도 `comeback-return` state로 바뀌어 복귀 보상이 정원 상태로 남는다.
- 393/360 mobile에서 action surface, receipt, bottom tabs가 겹치거나 잘리지 않는다.
- 1280 desktop에서도 중앙 모바일 frame이 유지되고 side rail/dock이 재등장하지 않는다.
