# Greenhouse mist condenser payoff v0

Status: review
Work type: game_feature
Owner: agent
Created: 2026-05-01
Updated: 2026-05-01
Scope-risk: narrow
Issue: #242
PR: TBD
Branch: `codex/0124-greenhouse-mist-condenser-payoff-v0`

## Intent

`물안개 응축 납품`은 복귀 보너스를 주문 완료로 연결했지만, 완료 직후 playfield와 HUD가 새 온실 상태를 충분히 보여주지 않는다. 납품 완료 후 `응축기 가동` 상태와 다음 장기 단서를 화면에 남겨, 플레이어가 보상을 받자마자 온실이 한 단계 더 살아났다고 느끼게 만든다.

## Game Studio route

- `game-studio:game-studio`: 복귀 보너스 -> 물안개 응축 납품 -> 응축기 playfield payoff -> 다음 온실 장기 메타 단서 vertical slice.
- `game-studio:game-ui-frontend`: 모바일 정원 action surface와 playfield overlay가 bottom tabs를 침범하지 않게, 완료 payoff를 compact HUD affordance로 설계한다.
- `game-studio:game-playtest`: Browser Use iab와 모바일 393px visual gate로 복귀 modal, 주문 납품, 완료 후 crate/payoff 상태를 확인한다.

## Reference teardown

- 경쟁 idle/merge 게임은 장기 설비를 완료하면 단순 텍스트 완료가 아니라 장치/상자/라인 상태가 바뀌어 다음 목표를 예고한다.
- 현재 화면은 `물안개 응축 납품 완료`와 숫자 보상은 보이지만, order crate/playfield가 다음 진행 방향을 오래 붙잡지 못한다.
- 이번 작업은 신규 bitmap 생성 없이 runtime CSS/procedural FX와 기존 crate/creature asset을 사용해 `order crate visual state`, `HUD affordance`, `reward motion`을 추가한다.

## Creative brief

온실 선반에 맺힌 물안개를 납품하면 작은 `응축기`가 가동되고, crate 주변에 이슬 고리가 남는다. 플레이어는 `재료 1 · 꽃가루 2` 보상과 함께 `달빛 온실 단서`를 보고, 다음 collection/expedition 계열 장기 메타가 온실에서 시작된다는 힌트를 받는다.

Vertical slice axes:

- `player verb`: 복귀 보상을 확인하고, 생산 잎을 수령한 뒤 `물안개 응축 납품`을 완료하고 응축 단서를 확인한다.
- `production/progression role`: 납품 완료 보상이 다음 온실 장기 메타 단서로 이어진다.
- `screen moment`: `qaGreenhouseMist=1` 복귀 후 30초 안에 playfield order crate와 production card가 `응축기 가동` 상태를 보여준다.
- `asset/FX`: order crate visual state, HUD affordance, reward motion을 CSS/procedural FX로 추가한다. 기존 asset 재사용만으로 acceptance를 충족하지 않는다.
- `playtest evidence`: Browser Use iab와 모바일 393px visual regression으로 실제 화면, overflow, screenshot을 확인한다.

## Plan

1. 완료된 `GREENHOUSE_MIST_RETURN_ORDER`를 감지하는 파생 state를 추가한다.
2. production card 완료 row에 `응축기 가동` payoff와 `달빛 온실 단서` HUD chip을 compact하게 표시한다.
3. playfield production scene에 완료된 mist crate variant와 응축 payoff copy를 전달한다.
4. CSS/procedural reward motion을 추가하되 모바일 action surface 높이와 bottom tabs overlap을 유지 검증한다.
5. 기존 물안개 응축 visual test를 확장해 완료 후 payoff text, crate class, overflow invariant, 저장 상태를 확인한다.
6. Browser Use iab로 같은 흐름을 실제 in-app browser에서 확인하고 screenshot/report를 남긴다.
7. roadmap/dashboard/control room, GitHub issue/PR evidence를 갱신한다.

## Acceptance

- [x] `물안개 응축 납품` 완료 후 production card에 `응축기 가동`과 `달빛 온실 단서`가 보인다.
- [x] playfield order crate가 일반 완료 상태가 아니라 mist condenser 완료 variant로 보인다.
- [x] payoff는 player verb, progression role, screen moment, asset/FX, playtest evidence 중 5개 축을 모두 plan/evidence에 남긴다.
- [x] 모바일 393px에서 comeback modal, playfield, production card, bottom tabs가 서로 가리지 않고 overflow가 없다.
- [x] Browser Use iab evidence와 `npm run check:visual -- --grep "물안개 응축"`가 통과한다.
- [x] `npm run check:ci`가 통과한다.

## Verification

- Browser Use `iab`: PASS, `reports/visual/p0-greenhouse-mist-condenser-payoff-20260501.md`
- `npm run check:visual -- --grep "물안개 응축"`: PASS
- `npm run check:loop`: PASS
- `npm run check:content`: PASS
- `npm run build`: PASS
- `npm run check:ci`: PASS

## Safety

- 신규 runtime image generation 없음.
- 신규 외부 dependency 없음.
- 실제 결제, 로그인, 광고, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음.
- 저장 schema 변경 없이 기존 completed order state에서 파생하는 방식을 우선한다.

## Risks

- 완료 payoff를 추가하면 모바일 action surface가 다시 길어질 수 있다. compact row와 visual invariant로 bottom tabs overlap을 막는다.
- 장기 메타 단서가 실제 시스템보다 앞서 보일 수 있다. 이번 범위는 `단서` copy와 visual payoff에 한정하고 새 expedition/collection mechanic은 후속 issue로 넘긴다.
