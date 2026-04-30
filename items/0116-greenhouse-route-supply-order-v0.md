# Greenhouse route supply order v0

Status: done
Branch: `codex/0116-greenhouse-route-supply-order-v0`
Issue: #221
PR: #222

## Context

#218에서 `온실 동선`을 구매하면 3번 밭이 열린다. 하지만 현재 루프는 3번 밭 개방 뒤 같은 `온실 확장 준비` 완료 상태에 머물러, 열린 밭을 실제 생산/주문 루프에 쓰는 다음 목표가 약하다. 다음 vertical slice는 3번 밭 개방 뒤 `3번 밭 순환 납품` 주문을 열어 확장된 재배 용량이 더 큰 주문 목표로 이어지게 만든다.

## Reference teardown

- `docs/NORTH_STAR.md`: 생산 엔진, 주문/납품, 업그레이드 선택, 다음 해금 목표가 한 화면에서 이어져야 한다.
- `docs/IDLE_CORE_CREATIVE_GUIDE.md`: order 보상은 다음 시설/생산 목표로 이어지고, 화면에서 자원 흐름이 느껴져야 한다.
- `docs/PROJECT_COMMANDS.md`: 다음 issue는 safe/small이 아니라 vertical slice 기준으로 고른다.

## Game Studio route

- `game-studio:game-studio`: 3번 밭 개방 -> 확장 밭 순환 주문 -> 납품 보상 vertical slice.
- `game-studio:web-game-foundations`: 주문 정의와 save order progress를 기존 `idleProduction` 경계 안에서 확장한다.
- `game-studio:game-ui-frontend`: 새 주문/완료 상태가 모바일 action surface와 playfield를 가리지 않게 한다.
- `game-studio:game-playtest`: Browser Use와 visual regression으로 route complete 이후 새 주문, 수령, 납품, 완료 상태를 검증한다.

## Creative brief

`3번 밭 순환 납품`은 넓어진 온실 동선을 따라 세 밭의 잎을 한 번에 모아 보내는 첫 순환 주문이다. 플레이어는 3번 밭이 단순 빈 슬롯이 아니라 더 큰 주문 목표를 감당하는 생산 용량으로 바뀌었다고 느껴야 한다.

## Vertical slice scoring

- `player verb`: 3번 밭 개방 후 생산 잎을 수령하고 새 순환 주문을 납품한다.
- `production/progression role`: 밭 확장 보상이 다음 주문 목표와 재료 보상으로 환류된다.
- `screen moment`: route complete 상태에서 `3번 밭 순환 납품 0/90`이 보이고, 납품 후 완료 보상이 보인다.
- `asset/FX`: 신규 asset 없음. 기존 order crate, production FX, 3열 playfield를 재사용한다.
- `playtest evidence`: Browser Use `iab`, focused visual, full visual, CI.

## Plan

1. `GREENHOUSE_ROUTE_SUPPLY_ORDER`를 추가하고, `greenhouseRouteLevel >= 1` 이후 current order가 이 주문으로 전환되게 한다.
2. route QA save에서 새 주문이 0/90 상태로 보이게 하고, 생산 잎 수령으로 진행률을 채울 수 있게 한다.
3. 납품 보상으로 잎/꽃가루/재료를 지급하고 완료 상태가 playfield/order card에 남게 한다.
4. Browser Use evidence, visual regression, roadmap/dashboard/GitHub evidence를 갱신한다.

## Acceptance

- [x] `온실 동선` 완료 뒤 현재 주문이 `3번 밭 순환 납품`으로 전환된다.
- [x] `생산 잎 수령`으로 새 주문 진행률이 90/90까지 찬다.
- [x] 납품하면 보상 `+110 잎 · +4 꽃가루 · +1 재료`가 지급되고 완료 상태가 보인다.
- [x] 모바일 393px에서 3열 playfield, production card, action surface, bottom tabs가 서로 가리지 않는다.
- [x] Browser Use `iab`, focused visual, full visual, CI가 통과한다.

## Verification

- Browser Use `iab`: PASS, `reports/visual/p0-greenhouse-route-supply-order-browser-use-20260430.png`
- Visual report: `reports/visual/p0-greenhouse-route-supply-order-v0-20260430.md`
- Focused visual: `npm run check:visual -- --grep "온실 동선 순환 주문"` PASS
- Regression focused visual: `npm run check:visual -- --grep "온실 동선 확장|온실 동선 순환 주문"` PASS
- Full visual: `npm run check:visual` PASS, 41 passed
- CI: `npm run check:ci` PASS
- PR checks: #222 PASS (`Check automerge eligibility`, `Verify game baseline`)
- Main CI: `25158289934` PASS

## Risks

- #218 회귀에서 새 주문 open state가 production card 내부 overflow를 만들었다. route complete compact CSS와 route supply complete row 표시를 수정했고, focused regression과 Browser Use 최종 캡처로 확인했다.
- 남은 follow-up blocker 없음.

## Safety

- 신규 asset 생성 없음.
- runtime image generation 없음.
- 실제 결제, 광고, 외부 배포, credential, 고객 데이터 없음.
