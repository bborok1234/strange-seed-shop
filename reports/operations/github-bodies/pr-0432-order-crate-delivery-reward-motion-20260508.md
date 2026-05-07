## 요약

#448에서 연결한 Momo carrier/order crate progression 다음 단계로, 주문 상자 100% -> 납품 action -> reward motion/state reset을 Phaser v1 runtime에 연결했습니다.

## Small win

첫 production chain이 `심기 -> 수확 -> 작업대 수령 -> 모모 운반 -> 주문 상자 납품`으로 닫힙니다.

## 사용자/운영자 가치

플레이어는 주문 상자가 다 찬 뒤 눌러야 할 행동과 보상 결과를 한 장면에서 이해합니다. 운영자는 generated raster crate/FX asset을 runtime delivery payoff와 deterministic smoke evidence로 연결합니다.

## Before / After 또는 Visual evidence

- Before: order crate는 progress/filled state까지만 있고 claim/reward verb가 없었습니다.
- After: order crate 100%에서 `납품` action이 나오고, 납품 시 `잎 +30`, completed delivery state, crate progress reset, reward FX가 남습니다.
- Visual report: `reports/visual/issue-0432-order-crate-delivery-reward-motion/visual-report-20260508.md`
- Screenshot sequence:
  - `reports/visual/issue-0432-order-crate-delivery-reward-motion/phaser-check-fresh-start-393.png`
  - `reports/visual/issue-0432-order-crate-delivery-reward-motion/phaser-check-after-plant-393.png`
  - `reports/visual/issue-0432-order-crate-delivery-reward-motion/phaser-check-ready-393.png`
  - `reports/visual/issue-0432-order-crate-delivery-reward-motion/phaser-check-after-harvest-393.png`
  - `reports/visual/issue-0432-order-crate-delivery-reward-motion/phaser-check-workbench-claim-393.png`
  - `reports/visual/issue-0432-order-crate-delivery-reward-motion/phaser-check-crate-ready-393.png`
  - `reports/visual/issue-0432-order-crate-delivery-reward-motion/phaser-check-delivery-claim-393.png`

## Playable mode

Phaser app lane changed. Merge 후 main playable worktree refresh 대상입니다. Legacy playable lane은 수정하지 않았습니다.

## 검증

- `npm run check:phaser`
- `npm run check:ci`

## 안전 범위

- Runtime image generation/API/cache 호출 없음.
- 기존 generated raster crate/FX asset만 Phaser에서 preload/render합니다.
- 결제/광고/외부 배포/고객 데이터 없음.
- 반복 주문 체인, 장기 economy, offline migration은 제외했습니다.

## 남은 위험

- 반복 주문/다음 order chain은 후속 WorkUnit입니다.
- Dedicated delivery FX strip generation은 아직 별도 asset generation lane으로 분리되어 있습니다.
- Browser Use `iab` hands-on QA는 이번 Codex CLI 세션에서 tool 미노출로 blocked이며, Playwright fallback evidence를 사용했습니다.

## 연결된 issue

- Closes #432

## 작업 checklist

- [x] order crate 100% delivery action
- [x] delivery reward state/receipt/objective
- [x] generated raster FX 기반 reward motion
- [x] `check:phaser` delivery branch
- [x] visual report
- [x] roadmap/control room/heartbeat 갱신
