# Phaser v1 third plot seed planting loop

## 요약

#451로 `3번 햇살 밭`은 열리지만, 첫 루프 경로에서는 씨앗이 0이라 새 밭을 바로 사용할 수 없습니다. 이 issue는 확장 보상이 다음 씨앗 심기로 이어지게 만들어 “하나만 더 키워볼까?” 루프를 강화합니다.

## Small win

새로 열린 세 번째 밭에 바로 씨앗을 심을 수 있습니다.

## 사용자/운영자 가치

플레이어는 확장 보상이 빈칸으로 끝나지 않고 다음 재배 행동으로 이어지는 것을 봅니다. 운영자는 v1 first-session loop가 board expansion 후 다시 planting으로 순환하는 evidence를 확보합니다.

## Visual evidence 계획

- `reports/visual/issue-0453-third-plot-seed-planting-loop/visual-report-20260508.md`
- expansion 후 plot_03 planted screenshot

## 검증

- `npm run check:phaser`
- `npm run check:ci`

## 안전 범위

- Runtime image generation/API/cache 호출 없음.
- 기존 generated raster plot states만 사용합니다.
- 결제/광고/외부 배포/고객 데이터 없음.

## 남은 위험

- 새 seed 종류/상점/도감 reveal은 후속 WorkUnit입니다. 이 slice는 next planting loop만 닫습니다.

## 연결된 문서

- WorkUnit: `items/0243-third-plot-seed-planting-loop.md`
- Follow-up to #451 / PR #452
