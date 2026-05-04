## 요약

#368은 #360에서 GREENHOUSE_ORDER 한정으로 도입한 fall-through 처리(receipt의 "다음 주문"이 stale-completed order를 가리키는 confusing UX bug fix)를 chain의 나머지 3개 greenhouse orders로 확장합니다:

- GREENHOUSE_EXPANSION_ORDER → "다음 단계: 온실 동선"
- GREENHOUSE_ROUTE_SUPPLY_ORDER → "다음 단계: 온실 물길"
- GREENHOUSE_IRRIGATION_ORDER → "다음 단계: 온실 물안개"

각 단계에서 `getCurrentOrder` priority chain이 자기 자신을 반환할 때 의미 있는 next-step copy로 substitute. 다른 order(merchant, lunar 등)는 기존 동작 유지.

## Small win

greenhouse 4단계 어디서든 납품 직후 receipt가 stale order copy를 보여주지 않고 다음 단계 hint로 player를 가이드한다.

## 사용자/운영자 가치

- 사용자: greenhouse chain 전체에서 dispatch receipt가 일관되게 다음 단계 안내를 보여준다.
- 운영자: #360 패턴 일관성을 chain 전체로 확장해 P0.5 production loop UX 일관성을 높인다.

## Before / After

- Before: GREENHOUSE_EXPANSION_ORDER/GREENHOUSE_ROUTE_SUPPLY_ORDER/GREENHOUSE_IRRIGATION_ORDER 납품 직후 receipt가 자기 자신을 "다음 주문"으로 표시.
- After: 각 단계에서 fall-through 감지 시 다음 storage upgrade를 가리키는 의미 있는 카피로 substitute.

## 검증

- [x] `npm run build`
- [x] 기존 GREENHOUSE_ORDER fall-through regression(#360) 통과
- [x] `npm run check:ci`
- [x] mirror gates 통과
- [x] Browser Use iab attempt or blocker

## 안전 범위

- code mutation은 `commitOrder` 내 fall-through 분기에 한정.
- 다른 order는 기존 동작 유지(natural next order title).
- save 호환: 변경 없음.

## 남은 위험

- 4개 케이스 모두 자동화 regression은 시퀀스 길어 비용 높다. GREENHOUSE_ORDER 한정 regression이 패턴 안정성을 보장.

## 연결된 issue

Closes #368
