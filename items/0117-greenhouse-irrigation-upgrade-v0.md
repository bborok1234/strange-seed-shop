# Greenhouse irrigation upgrade v0

Status: done
Branch: `codex/0117-greenhouse-irrigation-upgrade-v0`
Issue: #224

## Context

#221에서 `3번 밭 순환 납품`이 열리고, 납품 보상으로 `재료 1`과 `꽃가루 4`가 지급된다. 다음 vertical slice는 그 보상을 `온실 물길` 강화에 쓰게 만들어, 세 밭 순환 주문 보상이 자동 생산률 상승으로 환류되게 한다.

## Reference teardown

- `docs/NORTH_STAR.md`: 업그레이드 선택은 생산 속도, 밭, 주문, 탐험, 연구 중 무엇을 키울지의 선택으로 읽혀야 한다.
- `docs/IDLE_CORE_CREATIVE_GUIDE.md`: 주문 보상은 다음 시설/생산 목표로 이어져야 하며, 숫자 변화는 화면에서 느껴져야 한다.
- `docs/PROJECT_COMMANDS.md`: 다음 issue는 safe/small이 아니라 vertical slice 기준으로 고른다.

## Game Studio route

- `game-studio:game-studio`: 순환 주문 보상 -> 온실 물길 강화 -> 자동 생산률 상승 vertical slice.
- `game-studio:web-game-foundations`: save progression 필드와 생산률 계산을 기존 simulation boundary 안에서 확장한다.
- `game-studio:game-ui-frontend`: 강화 선택/완료 상태가 모바일 action surface와 playfield를 가리지 않게 한다.
- `game-studio:game-playtest`: Browser Use와 visual regression으로 구매 전/후 생산률과 화면 밀도를 확인한다.

## Creative brief

`온실 물길`은 넓어진 세 밭 사이에 작은 물길을 연결해 정원 동료들이 잎을 더 빠르게 모으는 장면이다. 새 asset 없이 기존 생산 카드와 성장 선택을 쓰되, 화면에서는 `온실 물길`과 `자동 생산 +15%`가 분명해야 한다.

## Vertical slice scoring

- `player verb`: 순환 주문 보상 재료로 `온실 물길`을 구매한다.
- `production/progression role`: 주문 납품 보상이 자동 생산률 상승으로 환류된다.
- `screen moment`: 순환 주문 완료 뒤 성장 선택에 `온실 물길`이 보이고, 구매 후 production rate가 상승한다.
- `asset/FX`: 신규 asset 없음. 기존 생산 카드, order crate, upgrade choice surface 재사용.
- `playtest evidence`: Browser Use `iab`, focused visual, full visual, CI.

## Plan

1. save에 `greenhouseIrrigationLevel`을 추가하고 normalization 기본값 0을 보존한다.
2. `GREENHOUSE_ROUTE_SUPPLY_ORDER` 완료 뒤 `온실 물길` upgrade choice를 열고, `재료 1`과 `꽃가루 4`를 소비해 자동 생산률 +15%를 적용한다.
3. QA 경로에서 순환 주문 완료 상태와 구매 후 생산률 상승을 재현한다.
4. Browser Use evidence와 roadmap/dashboard/GitHub evidence를 갱신한다.

## Acceptance

- [x] `3번 밭 순환 납품` 완료 뒤 `온실 물길` 성장 선택이 보인다.
- [x] `재료 1 · 꽃가루 4`로 구매하면 save의 `greenhouseIrrigationLevel`이 1이 된다.
- [x] 구매 후 자동 생산률이 11.2/분에서 12.8/분으로 상승한다.
- [x] 모바일 393px에서 playfield, production card, upgrade choice, bottom tabs가 서로 가리지 않는다.
- [x] Browser Use `iab`, focused visual, full visual, CI가 통과한다.

## Verification

- Browser Use `iab`: PASS, `reports/visual/p0-greenhouse-irrigation-upgrade-browser-use-20260430.png`
- Visual report: `reports/visual/p0-greenhouse-irrigation-upgrade-v0-20260430.md`
- Focused visual: `npm run check:visual -- --grep "온실 물길 강화"` PASS
- Regression focused visual: `npm run check:visual -- --grep "온실 동선 순환 주문|온실 물길 강화"` PASS
- Full visual: `npm run check:visual` PASS, 42 passed
- CI: `npm run check:ci` PASS

## Risks

- 새 save 필드가 추가된다. `createNewSave`와 `normalizeSave`에 기본값 0을 넣어 기존 save가 자동 보정되게 했다.
- route complete 화면의 action surface 밀도는 기존 compact CSS와 신규 visual gate로 확인했다.

## Safety

- 신규 asset 생성 없음.
- runtime image generation 없음.
- 실제 결제, 광고, 외부 배포, credential, 고객 데이터 없음.
