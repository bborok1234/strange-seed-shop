# Phaser v1 storage basket unlock affordance

## 요약

#455는 두 번째 주문 납품을 `보관 바구니 준비`로 끝냅니다. 이 issue는 그 다음 bottleneck을 실제 board action으로 연결해 `보관 바구니`를 선택하고 정리할 수 있게 만듭니다.

## Small win

두 번째 납품 후 `보관 바구니`를 80잎으로 정리해 storage/offline-cap 준비 상태를 볼 수 있습니다.

## 사용자/운영자 가치

플레이어는 반복 주문 다음 성장 선택지를 즉시 이해합니다. 운영자는 v1 loop가 order throughput 이후 storage bottleneck으로 넘어가는 evidence를 확보합니다.

## Visual evidence 계획

- `reports/visual/issue-0457-storage-basket-unlock-affordance/visual-report-20260508.md`
- second delivery 후 storage unlock action screenshot
- storage unlocked screenshot

## 검증

- `npm run check:phaser`
- `npm run check:ci`

## 안전 범위

- Runtime image generation/API/cache 호출 없음.
- 새 accepted manifest asset 없음. 전용 storage raster는 후속 asset WorkUnit입니다.
- 결제/광고/외부 배포/고객 데이터 없음.

## 남은 위험

Storage 전용 raster, offline reward cap 수치, comeback modal은 후속 WorkUnit입니다. 이 slice는 board unlock affordance만 닫습니다.

## 연결된 문서

- WorkUnit: `items/0245-storage-basket-unlock-affordance.md`
- Follow-up to #455 / PR #456
