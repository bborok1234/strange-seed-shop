## 요약

#360은 첫 GREENHOUSE_ORDER 납품 직후 dispatch receipt가 stale-completed order(자기 자신)를 "다음 주문"으로 가리키던 confusing UX bug를 fix합니다. `commitOrder`에서 `getOrderAfterCompleting` 결과가 `orderBeforeDelivery`와 같은 id이면 fall-through 케이스로 감지하고, GREENHOUSE_ORDER 한정으로 nextOrderTitle을 "다음 단계: 선반 정리"로 substitute합니다.

## Small win

GREENHOUSE_ORDER 납품 직후 dispatch receipt가 "다음 주문: 온실 선반 납품"(방금 납품한 order와 같은 카피)이 아니라 "다음 단계: 선반 정리"라는 의미 있는 안내로 마무리됩니다.

## 사용자/운영자 가치

- 사용자: 출하 receipt가 다음 단계 목표를 정확히 가리켜 chain handoff arc 흐름이 끊기지 않는다.
- 운영자: #350 storage handoff card가 영구 표시로 가리키던 다음 목표를 dispatch receipt 1.8s 안에서도 일관되게 보여줘 player journey UI consistency가 한 단계 더 채워진다.

## Before / After 또는 Visual evidence

- Before: GREENHOUSE_ORDER 납품 직후 dispatch receipt가 "다음 주문: 온실 선반 납품"(방금 납품한 order와 같은 카피)을 표시. `getCurrentOrder` priority chain의 fall-through 분기가 stale-completed order를 반환하기 때문.
- After: `naturalNextOrder.id === orderBeforeDelivery.id` 감지로 fall-through 케이스에서 nextOrderTitle을 "다음 단계: 선반 정리"로 substitute. 다른 order 납품(merchant_followup, merchant_second_chapter 등)은 기존 동작 유지.
- Browser Use: current-session iab discovery 실패 기록 `reports/visual/browser-use-blocker-0360-20260504.md`.

## Playable mode

- Local dev: `npm run dev -- --host 127.0.0.1 --port 3000`

## 검증

- [x] `npm run build`
- [x] `npx playwright test --grep "온실 설비는 새 납품 주문으로 이어진다"` (다음 단계: 선반 정리 카피 검증 포함)
- [x] `npm run check:ci`
- [x] `npm run check:ops-live`
- [x] mirror gates 통과

## 안전 범위

- code mutation은 `commitOrder` 내 nextOrderTitle 결정 로직 한 곳.
- 다른 order 분기는 기존 동작 유지(natural next order title).
- save 호환: 신규 state 없음.
- 신규 accepted manifest asset 없음.

## 남은 위험

- 첫 GREENHOUSE_ORDER 한정 fix. 다른 fall-through 케이스(모든 greenhouse upgrade 완료 후 LUNAR_GUARDIAN_ORDER 빠진 상태 등)는 별도 WorkUnit으로 추적. fallback `"다음 단계 준비"`를 generic case에서 사용해 향후 같은 bug 재발생 시 stale-completed copy는 보지 않도록 안전하게 가두었다.

## 연결된 issue

Closes #360

## 작업 checklist

- [x] Game Studio route 기록
- [x] Plan-first artifact: `items/0182-dispatch-receipt-fall-through-fix.md`
- [x] Visual evidence 또는 current-session blocker 기록
- [x] Build + focused regression + CI/ops/mirror gates 통과
- [x] Routine GitHub publication은 body-file로 수행
