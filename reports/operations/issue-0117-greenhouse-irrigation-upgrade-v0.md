# [P0.5] 온실 물길 강화로 순환 주문 보상 쓰기

## 문제 / 배경

#221에서 `3번 밭 순환 납품`이 열렸지만, 납품 보상 `재료 1`과 `꽃가루 4`를 바로 다음 생산 성장에 쓰는 선택지가 없다.

## 목표

순환 주문 완료 뒤 `온실 물길` 강화를 열어, 보상 재료와 꽃가루가 자동 생산률 상승으로 이어지게 한다.

## Small win

플레이어가 순환 주문 보상을 받자마자 “이 보상으로 정원이 더 빨라진다”는 다음 목표를 본다.

## Game Studio route

- `game-studio:game-studio`: 순환 주문 보상 -> 온실 물길 강화 -> 자동 생산률 상승 vertical slice.
- `game-studio:web-game-foundations`: save progression과 production rate 계산 확장.
- `game-studio:game-ui-frontend`: 모바일 action surface 밀도 보호.
- `game-studio:game-playtest`: Browser Use와 visual regression evidence.

## Plan

1. `greenhouseIrrigationLevel` save 필드와 normalization 기본값을 추가한다.
2. `GREENHOUSE_ROUTE_SUPPLY_ORDER` 완료 뒤 `온실 물길` upgrade choice를 연다.
3. 구매 비용 `재료 1 · 꽃가루 4`를 소비하고 자동 생산률 +15%를 적용한다.
4. Browser Use와 visual regression으로 구매 전/후 rate와 모바일 가림을 확인한다.

## 플레이어 가치 또는 운영사 가치

플레이어 가치는 주문 보상이 다음 생산 속도 강화로 이어지는 idle loop 명확성이다. 운영사 가치는 #221 이후에도 작은 polish가 아니라 production loop vertical slice를 이어간다는 점이다.

## 수용 기준

- [x] `3번 밭 순환 납품` 완료 뒤 `온실 물길` 성장 선택이 보인다.
- [x] `재료 1 · 꽃가루 4`로 구매하면 save의 `greenhouseIrrigationLevel`이 1이 된다.
- [x] 구매 후 자동 생산률이 11.2/분에서 12.8/분으로 상승한다.
- [x] 모바일 393px에서 playfield, production card, upgrade choice, bottom tabs가 서로 가리지 않는다.
- [x] Browser Use `iab`, focused visual, full visual, CI가 통과한다.

## Visual evidence 계획

- Browser Use `iab`: `reports/visual/p0-greenhouse-irrigation-upgrade-browser-use-20260430.png`
- Visual report: `reports/visual/p0-greenhouse-irrigation-upgrade-v0-20260430.md`

## Playable mode 영향

- QA 경로: `/?qaOfflineMinutes=60&qaLunarGuardian=1&qaGreenhouseShelf=1&qaGreenhouseStorage=1&qaGreenhouseRoute=1&qaGreenhouseRouteSupply=1&qaReset=1`
- 확인 흐름: 복귀 보상 -> `온실 물길` 구매 -> 생산률과 저장값 확인

## 안전 범위

- 신규 asset 생성 없음.
- runtime image generation 없음.
- 실제 결제, 광고, 외부 배포, credential, 고객 데이터 없음.

## 검증 명령

- Browser Use `iab`: PASS, `reports/visual/p0-greenhouse-irrigation-upgrade-browser-use-20260430.png`
- Visual report: `reports/visual/p0-greenhouse-irrigation-upgrade-v0-20260430.md`
- `npm run check:visual -- --grep "온실 물길 강화"`: PASS
- `npm run check:visual -- --grep "온실 동선 순환 주문|온실 물길 강화"`: PASS
- `npm run check:visual`: PASS, 42 passed
- `npm run check:ci`: PASS

## 남은 위험

- PR checks에서 동일 gate를 재확인해야 한다.
