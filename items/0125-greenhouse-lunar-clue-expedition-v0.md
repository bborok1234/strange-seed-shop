# Greenhouse lunar clue expedition v0

Status: done
Work type: game_feature
Owner: agent
Created: 2026-05-01
Updated: 2026-05-01
Scope-risk: narrow
Issue: #245
PR: #246
Branch: `codex/0125-greenhouse-lunar-clue-expedition-v0`

## Intent

`물안개 응축 납품` 완료 후 `달빛 온실 단서 +1` payoff가 보이지만, 아직 그 단서를 실제 행동으로 소비하지 않는다. 응축기 완료 상태를 원정 탭의 `달빛 온실 조사` 경로로 연결해, 플레이어가 단서를 보고 바로 다음 장기 메타 원정을 시작하게 만든다.

## Game Studio route

- `game-studio:game-studio`: 응축기 payoff -> 원정 탭 badge -> 달빛 온실 조사 시작 -> moon_hint active expedition vertical slice.
- `game-studio:game-ui-frontend`: bottom tab badge와 expedition preview card가 모바일 한 화면 tab surface를 깨지 않게 설계한다.
- `game-studio:game-playtest`: Browser Use iab와 모바일 393px visual gate로 응축 납품 완료 후 원정 탭, preview, 시작 버튼, 저장 상태를 확인한다.

## Reference teardown

- 경쟁 idle 게임은 시설 완료 단서가 별도 메뉴 badge와 새 run/start button으로 이어질 때 장기 메타가 살아난다.
- 현재 응축기 payoff는 `달빛 온실 단서 +1`을 보여주지만, 그 단서가 어디서 쓰이는지 다음 행동이 부족하다.
- 이번 작업은 신규 원정 데이터나 새 bitmap 없이 기존 `moon_hint` expedition을 온실 단서 source로 열고, `HUD affordance`와 `screen moment`를 추가한다.

## Creative brief

응축기에서 모은 달빛 물방울이 원정 준비소에 작은 조사 의뢰로 도착한다. 플레이어는 원정 탭 badge를 보고 들어가 `달빛 온실 조사`를 시작한다. 시작 후 기존 `moon_hint` 원정 진행 상태로 이어져, 나중에 달빛 씨앗 보상 루프를 탈 수 있다.

Vertical slice axes:

- `player verb`: 응축 납품 완료 후 원정 탭으로 이동해 `달빛 온실 조사`를 시작한다.
- `production/progression role`: `달빛 온실 단서 +1` payoff를 moon_hint expedition progression으로 소비한다.
- `screen moment`: `qaGreenhouseMist=1` 복귀/납품 완료 후 bottom expedition tab에 `온실 단서` badge와 preview card가 보인다.
- `asset/FX`: HUD affordance, expedition clue card visual state, reward motion continuation을 기존 chip/card 스타일로 추가한다. 기존 asset 재사용만으로 acceptance를 충족하지 않는다.
- `playtest evidence`: Browser Use iab와 모바일 393px visual regression으로 order completion -> expedition clue -> start flow를 확인한다.

## Plan

1. `GREENHOUSE_MIST_RETURN_ORDER` 완료와 lunar seed 미해금 상태에서 `hasGreenhouseLunarClue`를 파생한다.
2. 원정 탭 badge와 preview card에 `달빛 온실 조사`를 추가하고, 기존 `moon_hint` 원정을 시작하도록 연결한다.
3. production card payoff의 다음 행동 copy가 원정 준비소로 이어지도록 유지한다.
4. visual regression에서 응축 납품 완료 후 원정 탭 preview, start button, active expedition 저장 상태를 검증한다.
5. Browser Use iab로 실제 in-app browser에서 같은 흐름을 확인하고 screenshot/report를 남긴다.
6. roadmap/dashboard/control room, GitHub issue/PR evidence를 갱신한다.

## Acceptance

- [x] `물안개 응축 납품` 완료 후 bottom 원정 탭이 `온실 단서` 계열 badge를 보여준다.
- [x] 원정 탭에 `달빛 온실 조사` preview card가 보이고 `달빛 온실 조사 시작` 버튼이 활성화된다.
- [x] 시작 버튼을 누르면 기존 `moon_hint` active expedition이 저장된다.
- [x] 모바일 393px에서 expedition preview와 bottom tabs가 서로 가리지 않고 overflow가 없다.
- [x] Browser Use iab evidence와 `npm run check:visual -- --grep "달빛 온실 조사"`가 통과한다.
- [x] `npm run check:ci`가 통과한다.

## Verification

- Browser Use `iab`: PASS, `reports/visual/p0-greenhouse-lunar-clue-expedition-20260501.md`
- `npm run check:visual -- --grep "달빛 온실 조사"`: PASS
- `npm run check:loop`: PASS
- `npm run check:content`: PASS
- `npm run build`: PASS
- `npm run check:ci`: PASS
- PR #246 GitHub checks: PASS (`Check automerge eligibility`, `Verify game baseline`)
- Main CI: PASS, run `25208987443`, merge commit `bae8b9ef038351f0547a8cec3431b32a57d2d526`

## Safety

- 신규 runtime image generation 없음.
- 신규 외부 dependency 없음.
- 실제 결제, 로그인, 광고, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음.
- 기존 `moon_hint` expedition data를 재사용하고, 신규 save schema 없이 completed order / active expedition / unlocked seed state에서 파생한다.

## Risks

- 연구 단서와 온실 단서가 같은 `moon_hint` 원정을 여는 중복 경로가 된다. copy와 조건을 분리해 이미 연구 원정/달빛 보상을 진행 중인 경우 중복 preview가 나오지 않게 한다.
- 원정 탭 밀도가 올라갈 수 있다. 기존 mobile tab screen invariant와 focused visual test로 보호한다.
