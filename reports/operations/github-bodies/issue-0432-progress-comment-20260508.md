## 진행 상황

#432 구현과 로컬 검증을 완료했습니다.

## Small win

주문 상자가 100%가 되면 `납품` action이 열리고, 납품 시 잎 +30 reward, completed delivery state, crate progress reset, reward FX evidence가 남습니다.

## Visual evidence

- Visual report: `reports/visual/issue-0432-order-crate-delivery-reward-motion/visual-report-20260508.md`
- Ready screenshot: `reports/visual/issue-0432-order-crate-delivery-reward-motion/phaser-check-crate-ready-393.png`
- Delivery screenshot: `reports/visual/issue-0432-order-crate-delivery-reward-motion/phaser-check-delivery-claim-393.png`
- Browser Use: 이번 Codex CLI 세션에서 `browser-use:browser` / `iab` tool이 노출되지 않아 hands-on QA는 blocked입니다. Playwright fallback screenshot과 deterministic state evidence를 남겼습니다.

## 검증

- `npm run check:phaser` pass
- `npm run check:ci` pass

## 다음 gate

Draft PR로 게시한 뒤 required checks를 확인하고 green이면 merge/main CI 관찰까지 진행합니다.
