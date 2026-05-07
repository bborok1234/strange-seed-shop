# Phaser v1 order crate delivery reward motion

## 요약

#448 이후 Momo가 workbench -> order crate로 잎을 운반하지만, 주문 상자가 100%에 도달한 뒤의 납품/보상 순간은 아직 없습니다. 이 issue는 기존 Stage 3 의도를 최신 Phaser v1 board 기준으로 재계획해, 주문 상자 100% -> 납품 claim -> reward motion까지 연결합니다.

## Small win

첫 생산 체인이 `심기 -> 수확 -> 작업대 수령 -> 모모 운반 -> 주문 상자 납품`으로 닫힙니다.

## 사용자/운영자 가치

플레이어는 주문 상자가 왜 채워지는지, 다 채운 뒤 무엇을 누르는지, 보상으로 무엇이 돌아오는지 한 장면에서 이해합니다. 운영자는 Phaser state/action/FX/smoke evidence가 production vertical slice로 이어지는 증거를 확보합니다.

## Before / After 또는 Visual evidence

- Before: order crate는 진행률과 filled visual feedback까지만 있고, claim/reward verb가 없습니다.
- After 목표: order crate 100%에서 납품 action이 나오고, 납품 시 reward burst/receipt/objective가 남습니다.
- Evidence 예정: `reports/visual/issue-0432-order-crate-delivery-reward-motion/visual-report-20260508.md`

## Playable mode

Phaser app lane을 수정합니다. Merge 후 main playable refresh 대상입니다.

## 검증

- `npm run check:phaser`
- `npm run check:ci`

## 안전 범위

- Runtime image generation/API/cache 호출 없음.
- 기존 generated raster crate/FX asset만 사용합니다.
- 결제/광고/외부 배포/고객 데이터 없음.
- 장기 주문/economy/offline migration 제외.

## 남은 위험

- 이 slice는 첫 delivery payoff까지만 다룹니다. 반복 주문 체인, 장기 주문 밸런스, 새 order asset generation은 후속 WorkUnit입니다.
- Browser Use `iab`가 현재 Codex CLI 세션에서 노출되지 않을 수 있습니다. 이 경우 issue 전용 blocker와 Playwright fallback evidence를 남깁니다.

## 연결된 문서

- WorkUnit: `items/0241-order-crate-delivery-reward-motion.md`
- Follow-up to #448 / PR #449

## 작업 checklist

- [ ] order crate 100% delivery action
- [ ] delivery reward state/receipt/objective
- [ ] generated raster FX 기반 reward motion
- [ ] `check:phaser` delivery branch
- [ ] visual report
