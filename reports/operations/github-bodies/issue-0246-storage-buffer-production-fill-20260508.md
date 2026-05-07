# Phaser v1 storage buffer production fill

## 요약

#457은 `보관 바구니`를 열고 capacity를 24로 올렸지만, 아직 보관량이 차지 않습니다. 이 issue는 storage unlock 다음 작업대 수령이 `오프라인 보관 n/24`를 채우도록 연결합니다.

## Small win

보관 바구니 unlock 후 작업대 수령이 `보관 +4/24` feedback으로 이어집니다.

## 사용자/운영자 가치

플레이어는 storage upgrade가 다음 생산 수령에 실제로 영향을 주는 것을 봅니다. 운영자는 offline/comeback 이전 단계인 storage buffer evidence를 확보합니다.

## Visual evidence 계획

- `reports/visual/issue-0459-storage-buffer-production-fill/visual-report-20260508.md`
- storage unlocked 후 workbench claim screenshot
- storage buffer selected screenshot

## 검증

- `npm run check:phaser`
- `npm run check:ci`

## 안전 범위

- Runtime image generation/API/cache 호출 없음.
- 새 accepted manifest asset 없음.
- 결제/광고/외부 배포/고객 데이터 없음.

## 남은 위험

Offline comeback reward calculation과 storage 전용 raster는 후속 WorkUnit입니다.

## 연결된 문서

- WorkUnit: `items/0246-storage-buffer-production-fill.md`
- Follow-up to #457 / PR #458
