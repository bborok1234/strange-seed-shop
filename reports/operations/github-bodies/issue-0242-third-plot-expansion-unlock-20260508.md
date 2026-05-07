# Phaser v1 third plot expansion unlock

## 요약

#432/#450 이후 첫 주문 납품은 완료되지만, 보상으로 무엇을 성장시키는지 아직 board action으로 연결되지 않습니다. 이 issue는 납품 보상을 `3번 밭 확장`으로 전환해, 세 번째 plot이 preview에서 실제 usable plot으로 바뀌게 만듭니다.

## Small win

첫 주문 납품 보상이 새 밭 한 칸으로 즉시 보입니다.

## 사용자/운영자 가치

플레이어는 주문 납품이 단순 잎 증가가 아니라 정원 확장으로 이어진다는 감각을 얻습니다. 운영자는 첫 production chain reward -> board capacity progression까지 이어지는 v1 evidence를 확보합니다.

## Before / After 또는 Visual evidence

- Before: `3번 확장 자리`는 preview로 보이지만 unlock action이 없습니다.
- After 목표: delivery 후 `3번 밭 확장` action이 나오고, 확장 후 usable empty plot으로 바뀝니다.
- Evidence 예정: `reports/visual/issue-0451-third-plot-expansion-unlock/visual-report-20260508.md`

## Playable mode

Phaser app lane을 수정합니다. Merge 후 main playable refresh 대상입니다.

## 검증

- `npm run check:phaser`
- `npm run check:ci`

## 안전 범위

- Runtime image generation/API/cache 호출 없음.
- 기존 generated raster plot states만 사용합니다.
- 결제/광고/외부 배포/고객 데이터 없음.
- 반복 주문/장기 economy/offline migration 제외.

## 남은 위험

- 세 번째 plot에 새 seed purchase/planting loop를 실제로 연결하는 작업은 후속 WorkUnit입니다.
- Browser Use `iab`가 현재 Codex CLI 세션에서 노출되지 않을 수 있습니다. 이 경우 issue 전용 blocker와 Playwright fallback evidence를 남깁니다.

## 연결된 문서

- WorkUnit: `items/0242-third-plot-expansion-unlock.md`
- Follow-up to #432 / PR #450

## 작업 checklist

- [ ] third plot expansion state/action
- [ ] delivery reward -> expansion cost/result
- [ ] usable empty third plot state
- [ ] `check:phaser` expansion branch
- [ ] visual report
