# P0.5 Greenhouse route supply order v0 visual QA

Date: 2026-04-30
Issue: #221
Branch: `codex/0116-greenhouse-route-supply-order-v0`

## Scenario

QA URL:

`/?qaOfflineMinutes=60&qaLunarGuardian=1&qaGreenhouseShelf=1&qaGreenhouseStorage=1&qaGreenhouseRoute=1&qaReset=1`

Flow:

1. 복귀 보상 확인.
2. `3번 밭 순환 납품` 0/90 상태 확인.
3. `생산 잎 수령`으로 90/90 진행률 확인.
4. `주문 납품 +110 잎 · +4 꽃가루 · +1 재료` 클릭.
5. action card와 playfield에서 `3번 밭 순환 납품 완료` 확인.

## Browser Use evidence

- `iab`: PASS
- Screenshot: `reports/visual/p0-greenhouse-route-supply-order-browser-use-20260430.png`
- Findings:
  - 새 주문 open state가 처음에는 #218 route expansion test에서 production card 내부 overflow를 만들었다.
  - route complete compact CSS로 부수 정보를 접고, route supply complete row를 실제 화면에 표시하도록 수정했다.
  - 최종 캡처에서 3열 playfield, 순환 주문 완료 card, 성장 선택, 하단 탭이 함께 보이며 가림 없음.

## Automated visual evidence

- `npm run check:visual -- --grep "온실 동선 순환 주문"`: PASS
- `npm run check:visual -- --grep "온실 동선 확장|온실 동선 순환 주문"`: PASS
- `npm run check:visual`: PASS, 41 passed

## CI evidence

- `npm run check:ci`: PASS
