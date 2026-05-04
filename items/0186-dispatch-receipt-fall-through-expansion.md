# WorkUnit #368 — dispatch receipt nextOrderTitle fall-through 처리를 모든 greenhouse chain orders로 확장한다

## GitHub authority

- GitHub issue: #368 https://github.com/bborok1234/strange-seed-shop/issues/368
- Branch: `codex/0186-dispatch-receipt-fall-through-expansion`
- Campaign source of truth: P0.5 Idle Core + Creative Rescue
- Runner decision: `production-game-intake-required` after #366 main CI `25305919963` success and queue empty
- Status: plan-first

## 문제 / 배경

#360은 GREENHOUSE_ORDER 한정으로 fall-through 케이스(getCurrentOrder priority chain이 stale-completed order를 반환하는 상황)에서 nextOrderTitle을 "다음 단계: 선반 정리"로 substitute했다. 그러나 같은 패턴이 chain의 다른 단계에서도 반복된다:

- GREENHOUSE_EXPANSION_ORDER 완료 + greenhouseRouteLevel < MAX → fallback이 자기 자신
- GREENHOUSE_ROUTE_SUPPLY_ORDER 완료 + greenhouseIrrigationLevel < MAX → fallback이 자기 자신
- GREENHOUSE_IRRIGATION_ORDER 완료 + greenhouseMistLevel < MAX → fallback이 자기 자신

각 단계에서 receipt가 confusing한 "다음 주문: <자기 자신>" 카피를 보여준다.

## 목표

`commitOrder`의 fall-through 처리를 확장해 위 3개 추가 케이스에도 의미 있는 카피를 substitute한다:

- GREENHOUSE_EXPANSION_ORDER → "다음 단계: 온실 동선"
- GREENHOUSE_ROUTE_SUPPLY_ORDER → "다음 단계: 온실 물길"
- GREENHOUSE_IRRIGATION_ORDER → "다음 단계: 온실 물안개"

기존 GREENHOUSE_ORDER 케이스 + generic fallback("다음 단계 준비")는 그대로 유지.

## Plan

1. `commitOrder`의 fall-through if/else if 체인에 3개 추가 케이스를 더한다.
2. focused checks → mirror gates → PR.

## 수용 기준

- [ ] 4개 greenhouse chain orders(GREENHOUSE_ORDER, GREENHOUSE_EXPANSION_ORDER, GREENHOUSE_ROUTE_SUPPLY_ORDER, GREENHOUSE_IRRIGATION_ORDER) 각각에서 fall-through 시 의미 있는 카피.
- [ ] 다른 order(merchant, lunar, etc.)는 기존 동작 유지.
- [ ] generic fallback "다음 단계 준비"가 정의되지 않은 케이스의 안전망.

## 검증 명령

- `npm run build`
- 기존 GREENHOUSE_ORDER fall-through regression 통과 (#360 카피 검증)
- mirror gates

## 리스크

- 4개 케이스 자동화 regression은 비용 높다. GREENHOUSE_ORDER 한정 regression이 통과하면 같은 패턴 일관성으로 검증.

## Subagent/Team Routing

- 기본은 solo execution.
