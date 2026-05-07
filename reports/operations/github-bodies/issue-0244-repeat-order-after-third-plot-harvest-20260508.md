# Phaser v1 repeat order after third plot harvest

## 요약

#453 이후 플레이어는 `3번 햇살 밭`에 다시 심을 수 있지만, 그 다음 수확/주문 반복이 아직 첫 발견 문맥으로 남을 위험이 있습니다. 이 issue는 `plot_03` 수확을 두 번째 주문 납품으로 연결해 확장된 밭이 실제 반복 생산력으로 읽히게 만듭니다.

## Small win

`3번 햇살 밭` 수확 후 주문 상자를 다시 채우고 두 번째 납품을 완료할 수 있습니다.

## 사용자/운영자 가치

플레이어는 새 밭이 장식이 아니라 반복 주문 생산에 기여하는 것을 봅니다. 운영자는 v1 first-session loop가 expansion -> planting -> harvest -> repeat delivery까지 이어지는 evidence를 확보합니다.

## Visual evidence 계획

- `reports/visual/issue-0455-repeat-order-after-third-plot-harvest/visual-report-20260508.md`
- plot_03 ready/harvest screenshot
- second order delivery screenshot

## 검증

- `npm run check:phaser`
- `npm run check:ci`

## 안전 범위

- Runtime image generation/API/cache 호출 없음.
- 기존 generated raster plot/order crate/FX states만 사용합니다.
- 결제/광고/외부 배포/고객 데이터 없음.

## 남은 위험

Storage unlock과 offline cap은 후속 WorkUnit입니다. 이 slice는 repeat order proof까지만 닫습니다.

## 연결된 문서

- WorkUnit: `items/0244-repeat-order-after-third-plot-harvest.md`
- Follow-up to #453 / PR #454
