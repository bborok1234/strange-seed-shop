# Greenhouse irrigation order v0

Status: done
Branch: `codex/0118-greenhouse-irrigation-order-v0`
Issue: #227
PR: #228

## Context

#224에서 `온실 물길` 강화가 자동 생산률 +15%로 이어졌다. 다음 vertical slice는 그 빨라진 생산을 새 주문 목표에 쓰게 만들어, 강화가 숫자 상승으로 끝나지 않고 납품/보상 loop로 이어지게 한다.

## Reference teardown

- `docs/NORTH_STAR.md`: 업그레이드 선택 뒤에는 다음 해금/주문/시설 목표가 계속 보여야 한다.
- `docs/IDLE_CORE_CREATIVE_GUIDE.md`: 주문/의뢰 납품은 생산 엔진과 보상 feedback을 화면에서 이어야 한다.
- `docs/PROJECT_COMMANDS.md`: 다음 issue는 safe/small이 아니라 production vertical slice 기준으로 고른다.

## Game Studio route

- `game-studio:game-studio`: 온실 물길 강화 -> 강화된 생산 -> 다음 주문 납품 vertical slice.
- `game-studio:web-game-foundations`: order chain 선택 조건과 save order progress 확장.
- `game-studio:game-ui-frontend`: 새 주문/완료 상태가 모바일 action surface와 bottom tab을 가리지 않게 한다.
- `game-studio:game-playtest`: Browser Use와 visual regression으로 구매 후 새 주문, 납품 가능/완료, 보상 저장을 확인한다.

## Creative brief

`온실 물길 점검`은 물길을 타고 잎과 꽃가루가 더 안정적으로 모이는지 확인하는 납품 주문이다. 새 asset 없이 기존 주문 상자와 생산 카드로 표현하되, 화면에서는 `온실 물길 점검`과 물길 완료 이후의 새 목표가 분명해야 한다.

## Vertical slice scoring

- `player verb`: 물길 강화 뒤 빨라진 생산을 수령하고 `온실 물길 점검` 주문을 납품한다.
- `production/progression role`: 생산률 강화가 다음 주문 progress와 보상으로 환류된다.
- `screen moment`: 물길 완료 뒤 production card에 새 주문이 보이고, 납품 뒤 보상 저장이 확인된다.
- `asset/FX`: 신규 asset 없음. 기존 order crate, production card, order delivery FX 재사용.
- `playtest evidence`: Browser Use `iab`, focused visual, full visual, CI.

## Plan

1. `온실 물길` 완료 뒤 현재 주문을 `온실 물길 점검`으로 전환하는 order definition을 추가한다.
2. 강화된 생산률로 새 주문 progress가 차고, 납품 시 잎/꽃가루/재료 보상이 지급되게 한다.
3. QA seed 경로에 `qaGreenhouseIrrigation=1`를 추가해 물길 완료 상태와 새 주문을 재현한다.
4. Browser Use와 visual regression으로 모바일 393px에서 주문 카드, 성장 선택, 하단 탭 가림이 없는지 확인한다.

## Acceptance

- [x] `온실 물길` 완료 뒤 `온실 물길 점검` 주문이 현재 주문으로 보인다.
- [x] 강화된 자동 생산률로 새 주문 progress가 쌓인다.
- [x] 납품 시 잎/꽃가루/재료 보상이 save에 반영된다.
- [x] 모바일 393px에서 playfield, production card, order card, bottom tabs가 서로 가리지 않는다.
- [x] Browser Use `iab`, focused visual, full visual, CI가 통과한다.

## Verification

- Browser Use `iab`: PASS, `reports/visual/p0-greenhouse-irrigation-order-browser-use-20260501.png`
- Visual report: `reports/visual/p0-greenhouse-irrigation-order-v0-20260501.md`
- Focused visual: `npm run check:visual -- --grep "온실 물길 점검"` PASS
- Regression focused visual: `npm run check:visual -- --grep "온실 물길 강화|온실 물길 점검"` PASS
- Full visual: `npm run check:visual` PASS, 43 passed
- CI: `npm run check:ci` PASS

## Risks

- 새 주문이 action surface 밀도를 다시 올릴 수 있다. Browser Use에서 완료 row가 compact CSS에 가려지는 문제를 발견했고, `has-irrigation-order` 예외와 visual invariant로 수정/확인했다.

## Safety

- 신규 asset 생성 없음.
- runtime image generation 없음.
- 실제 결제, 광고, 외부 배포, credential, 고객 데이터 없음.
