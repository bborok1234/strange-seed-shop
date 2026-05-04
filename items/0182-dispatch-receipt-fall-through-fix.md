# WorkUnit #360 — dispatch receipt의 nextOrderTitle이 fall-through 케이스에서 stale-completed order를 가리키는 UX bug를 다음 단계 hint로 대체한다

## GitHub authority

- GitHub issue: #360 https://github.com/bborok1234/strange-seed-shop/issues/360
- Branch: `codex/0182-dispatch-receipt-fall-through-fix`
- Campaign source of truth: P0.5 Idle Core + Creative Rescue
- Runner decision: `production-game-intake-required` after #358 main CI `25304766061` success and queue empty
- Status: plan-first

## 문제 / 배경

`commitOrder`에서 `deliveryReceipt.nextOrderTitle`은 `getOrderAfterCompleting(save, orderBeforeDelivery).title`로 설정된다. `getOrderAfterCompleting`은 save를 cloned 후 `getCurrentOrder`를 호출한다. `getCurrentOrder`는 priority chain의 마지막 fallback에서 `save.idleProduction.completedOrderIds.includes(GREENHOUSE_ORDER.id) ? GREENHOUSE_ORDER : ...`처럼 이미 완료된 order를 반환할 수 있다. 결과적으로 첫 GREENHOUSE_ORDER 납품 직후 dispatch receipt가 보여주는 "다음 주문: 온실 선반 납품"은 방금 납품한 order와 같다. UX 관점에서 confusing한 copy.

#350 storage handoff card는 이 gap을 부분적으로 닫았지만(receipt expire 이후 영구 handoff card로 "다음 목표: 선반 정리" 안내), receipt 자체의 1.8s 동안 player가 보는 "다음 주문" copy는 여전히 stale-completed order를 가리킨다.

## 목표

`commitOrder`에서 `getOrderAfterCompleting` 결과가 `orderBeforeDelivery`와 같은 id이면 fall-through 케이스로 감지하고, `nextOrderTitle`을 "다음 단계: 선반 정리"(또는 storage handoff card와 동일한 카피)로 substitute한다. 일반 케이스(다음 order가 정상적으로 다른 order)에서는 기존 동작 유지.

## Plan

1. `commitOrder`에서 `getOrderAfterCompleting(save, orderBeforeDelivery)` 결과를 변수로 받고, id 비교로 fall-through 여부 판정.
2. 첫 GREENHOUSE_ORDER fall-through 케이스(`orderBeforeDelivery.id === GREENHOUSE_ORDER.id && save.greenhouseStorageLevel < MAX`)에서 `nextOrderTitle = "다음 단계: 선반 정리"`로 substitute.
3. 다른 fall-through 케이스(향후 발생 가능)는 추가 케이스로 확장 가능. 이번 PR에서는 GREENHOUSE_ORDER 한정.
4. 기존 chip strip / handoff card는 변경 없음.
5. focused checks → issue/PR body-file/evidence mirror → branch push → PR create/watch/merge → main CI observation.

## 수용 기준

- [ ] 첫 GREENHOUSE_ORDER 납품 직후 dispatch receipt의 "다음 주문" 카피가 "온실 선반 납품"이 아니라 "다음 단계: 선반 정리"이다.
- [ ] 다른 order(merchant_followup, merchant_second_chapter 등) 납품 시 dispatch receipt 카피는 기존 그대로(natural next order title).
- [ ] focused regression(작업대 강화 → 시설 → GREENHOUSE_ORDER 납품 후 receipt copy 검증)이 통과한다.

## 검증 명령

- `npm run build`
- `npx playwright test --config playwright.config.ts --grep "온실 설비는 새 납품 주문으로 이어진다"` (회귀 보장)
- `npm run check:ci` 외 mirror gates

## 리스크

- 첫 GREENHOUSE_ORDER만 한정 fix. 다른 fall-through 케이스(예: 모든 greenhouse upgrade 완료 후 LUNAR_GUARDIAN_ORDER 빠진 상태)는 별도 WorkUnit으로 추적.

## Subagent/Team Routing

- 기본은 solo execution.
