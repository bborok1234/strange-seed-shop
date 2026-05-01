# [Game Feature] 물안개 응축 완료가 playfield 보상 상태로 남는다

## 문제 / 배경

`물안개 응축 납품` 완료 후 저장 상태와 보상 숫자는 맞지만, playfield/HUD는 완료감과 다음 장기 메타 단서를 충분히 보여주지 않는다. 경쟁 idle/merge 게임 기준에서는 설비 완료 순간에 장치, 상자, 라인 상태가 바뀌어야 복귀 보상이 다음 목표로 이어졌다는 감각이 난다.

## 목표

`물안개 응축 납품` 완료 직후 production card와 playfield order crate에 `응축기 가동` 상태, `달빛 온실 단서`, reward motion을 추가해 기능-only 주문 완료를 production payoff 장면으로 바꾼다.

Issue: #242
PR: #243

## Small win

플레이어가 복귀 후 `생산 잎 수령` -> `물안개 응축 납품`을 완료하면, 정원 화면에서 즉시 `응축기 가동`과 `달빛 온실 단서`를 확인한다.

## Game Studio route

- `game-studio:game-studio`: 복귀 보너스 -> 물안개 응축 납품 -> 응축기 playfield payoff -> 다음 온실 장기 메타 단서 vertical slice.
- `game-studio:game-ui-frontend`: 모바일 정원 action surface가 완료 payoff를 보여도 playfield와 bottom tabs를 보호한다.
- `game-studio:game-playtest`: Browser Use iab와 모바일 393px screenshot/invariant로 실제 게임 화면을 검증한다.

## Plan

1. 완료된 `GREENHOUSE_MIST_RETURN_ORDER`를 감지하는 파생 state를 추가한다.
2. production card 완료 row에 `응축기 가동` payoff와 `달빛 온실 단서` HUD chip을 compact하게 표시한다.
3. playfield production scene에 완료된 mist crate variant와 응축 payoff copy를 전달한다.
4. CSS/procedural reward motion을 추가하되 모바일 action surface 높이와 bottom tabs overlap을 유지 검증한다.
5. 기존 물안개 응축 visual test를 확장해 완료 후 payoff text, crate class, overflow invariant, 저장 상태를 확인한다.
6. Browser Use iab로 같은 흐름을 실제 in-app browser에서 확인하고 screenshot/report를 남긴다.
7. roadmap/dashboard/control room, GitHub issue/PR evidence를 갱신한다.

## 플레이어 가치 또는 운영사 가치

- 플레이어 가치: 복귀 보너스와 주문 완료가 온실의 새 장치 상태로 남아, 다음 목표가 화면에서 읽힌다.
- 운영사 가치: 강화된 `$seed-ops` queue gate가 기능-only가 아니라 asset/FX/production gap까지 issue plan에 반영한다.

## 수용 기준

- [x] `물안개 응축 납품` 완료 후 production card에 `응축기 가동`과 `달빛 온실 단서`가 보인다.
- [x] playfield order crate가 일반 완료 상태가 아니라 mist condenser 완료 variant로 보인다.
- [x] payoff는 player verb, progression role, screen moment, asset/FX, playtest evidence 중 5개 축을 모두 plan/evidence에 남긴다.
- [x] 모바일 393px에서 comeback modal, playfield, production card, bottom tabs가 서로 가리지 않고 overflow가 없다.
- [x] Browser Use iab evidence와 `npm run check:visual -- --grep "물안개 응축"`가 통과한다.
- [x] `npm run check:ci`가 통과한다.

## Visual evidence 계획

Browser Use `iab`로 `qaGreenhouseMist=1` 복귀 상태에서 `보상 확인` -> `생산 잎 수령` -> `물안개 응축 납품` 완료 -> `응축기 가동` payoff 확인을 수행했다. Screenshot은 `reports/visual/p0-greenhouse-mist-condenser-payoff-browser-use-20260501.png`에 저장했다. 보강으로 Playwright mobile 393px screenshot을 `test-results/`에 남겼다.

## Playable mode 영향

사람 플레이용 `main` worktree/port 정책은 변경하지 않는다. 기능은 feature branch에서 검증하고, merge 후 main playable에 반영된다.

## 안전 범위

- 신규 asset 생성 없음.
- 신규 dependency 없음.
- runtime image generation 없음.
- 실제 결제, 로그인, 광고, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음.

## 검증 명령

- Browser Use `iab`
- Browser Use `iab` — PASS, `reports/visual/p0-greenhouse-mist-condenser-payoff-20260501.md`
- `npm run check:visual -- --grep "물안개 응축"` — PASS
- `npm run check:loop` — PASS
- `npm run check:content` — PASS
- `npm run build` — PASS
- `npm run check:ci` — PASS
- PR #243 GitHub checks — PASS (`Check automerge eligibility`, `Verify game baseline`)
- Main CI — PASS, run `25208478314`, merge commit `50edf94215eec86b1dd76586b2c189e007217977`
