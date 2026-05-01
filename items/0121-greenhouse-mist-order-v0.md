# Greenhouse mist return order v0

Status: verified
Work type: game_feature
Owner: agent
Created: 2026-05-01
Updated: 2026-05-01
Scope-risk: narrow
Issue: #235
PR: #236
Branch: `codex/0121-greenhouse-mist-order-v0`

## Intent

`온실 물안개`는 복귀 보관 보너스를 키우지만, 완료 직후 화면에서는 그 payoff가 다음 주문 목표로 아직 이어지지 않는다. 물안개 완료 뒤 새 주문 `물안개 응축 납품`을 열어, 플레이어가 복귀 보너스로 받은 잎을 곧바로 다음 납품 목표에 쓰고 다시 재료/꽃가루 보상을 받게 만든다.

## Game Studio route

- `game-studio:game-studio`: 물안개 강화 -> 복귀 보너스 -> 새 납품 주문 -> 다음 온실 재료 보상 vertical slice.
- `game-studio:game-ui-frontend`: 모바일 정원 action surface에서 새 주문/완료 상태가 playfield와 bottom tabs를 가리지 않게 한다.
- `game-studio:game-playtest`: Browser Use iab와 모바일 393px visual gate로 복귀 modal, 생산 수령, 주문 crate, 납품 보상을 확인한다.

## Reference teardown

- Idle Miner/Egg, Inc.류 idle loop는 오프라인 수익이 단순 숫자 증가가 아니라 다음 objective completion으로 즉시 이어질 때 복귀 욕구가 강해진다.
- 현재 온실 체인은 선반/정리/동선/물길/물안개까지 이어졌지만, 물안개 완료 후에는 복귀 보너스가 새 주문 목표로 돌아오지 않는다.
- 이 작업은 신규 자원이나 새 asset 없이 기존 order crate와 reward pulse를 재사용해 comeback payoff를 다음 납품 목표로 연결한다.

## Creative brief

`물안개 응축 납품`은 밤새 온실 안개가 잎에 맺힌 것을 모아 납품하는 주문이다. 플레이어는 물안개 보너스 덕분에 복귀 후 잎이 더 쌓였고, 그 잎으로 바로 새 주문을 채워 `재료 1 · 꽃가루 2`를 받는다.

Vertical slice axes:

- `player verb`: 물안개 완료 뒤 복귀 보너스로 받은 잎을 생산 수령하고 `물안개 응축 납품` 주문에 납품한다.
- `production/progression role`: 오프라인 복귀 보너스를 주문/재료 progression으로 되돌린다.
- `screen moment`: `qaGreenhouseMist=1` 복귀 modal 이후 정원 order crate에 새 주문이 보인다.
- `asset/FX`: 신규 asset 없음. 기존 order crate, reward pulse, greenhouse/mist copy를 재사용한다.
- `playtest evidence`: Browser Use iab와 모바일 393px visual regression으로 modal/order/delivery flow를 확인한다.

## Plan

1. `GREENHOUSE_MIST_RETURN_ORDER`를 추가하고 `getActiveOrder`가 물안개 완료 뒤 이 주문을 선택하게 한다.
2. 주문 보상은 `재료 1 · 꽃가루 2`로 두고, 기존 생산 수령/주문 납품 루프와 analytics를 재사용한다.
3. QA seed에 물안개 완료 후 새 주문을 재현하는 경로를 추가하거나 기존 `qaGreenhouseMist=1` 흐름이 새 주문을 열도록 확장한다.
4. 모바일 visual regression에서 복귀 modal -> 생산 수령 -> 새 주문 납품 -> 저장된 completedOrderIds/보상을 검증한다.
5. Browser Use iab로 같은 흐름을 실제 in-app browser에서 확인하고 screenshot/report를 남긴다.
6. roadmap/dashboard/control room, GitHub issue/PR evidence를 갱신한다.

## Acceptance

- [x] `온실 물안개` 완료 뒤 active order가 `물안개 응축 납품`으로 전환된다.
- [x] 복귀 보너스 후 생산 잎을 수령하면 새 주문 진행률이 채워진다.
- [x] 주문 납품 시 `재료 1 · 꽃가루 2`가 지급되고 completedOrderIds에 새 주문 id가 저장된다.
- [x] 모바일 393px에서 comeback modal, production card, order crate, bottom tabs가 서로 가리지 않고 overflow가 없다.
- [x] Browser Use iab evidence와 `npm run check:visual -- --grep "물안개 응축"`가 통과한다.
- [x] `npm run check:ci`가 통과한다.

## Verification

- Browser Use `iab`: PASS, `reports/visual/p0-greenhouse-mist-return-order-v0-20260501.md`
- `npm run check:visual -- --grep "물안개 응축"`: PASS
- `npm run check:loop`: PASS
- `npm run check:content`: PASS
- `npm run build`: PASS
- `npm run check:ci`: PASS

## Safety

- 신규 runtime image generation 없음.
- 신규 외부 dependency 없음.
- 실제 결제, 로그인, 광고, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음.
- 기존 주문/연구/원정 루프의 이전 unlock 순서를 바꾸지 않는다.

## Risks

- 온실 주문 체인이 길어져 action surface 밀도가 올라갈 수 있다. 완료 카드 compact CSS와 visual invariant로 하단 탭 overlap을 확인한다.
- 새 주문만 추가하면 “또 주문”으로 보일 수 있으므로 복귀 보너스 payoff copy를 주문명/보상 문구에 분명히 연결한다.
