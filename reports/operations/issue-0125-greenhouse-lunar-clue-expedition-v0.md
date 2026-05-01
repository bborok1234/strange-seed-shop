# [Game Feature] 달빛 온실 단서가 원정 시작으로 소비된다

## 문제 / 배경

`물안개 응축 납품` 완료 후 `달빛 온실 단서 +1` payoff가 보이지만, 단서를 실제 행동으로 쓰는 경로가 없다. 장기 메타 단서는 메뉴 badge와 시작 가능한 objective로 이어져야 플레이어가 다음 목표를 이해한다.

## 목표

응축기 완료 상태에서 원정 탭에 `달빛 온실 조사` preview를 열고, 기존 `moon_hint` 원정을 시작할 수 있게 한다.

Issue: #245
PR: TBD

## Small win

플레이어가 응축 납품을 완료한 뒤 원정 탭으로 이동해 `달빛 온실 조사`를 시작하고, active expedition 저장 상태를 확인한다.

## Game Studio route

- `game-studio:game-studio`: 응축기 payoff -> 원정 탭 badge -> 달빛 온실 조사 시작 -> moon_hint active expedition vertical slice.
- `game-studio:game-ui-frontend`: 모바일 원정 tab surface와 bottom tabs를 보호한다.
- `game-studio:game-playtest`: Browser Use iab와 모바일 393px visual gate로 실제 게임 화면을 검증한다.

## Plan

1. `GREENHOUSE_MIST_RETURN_ORDER` 완료와 lunar seed 미해금 상태에서 `hasGreenhouseLunarClue`를 파생한다.
2. 원정 탭 badge와 preview card에 `달빛 온실 조사`를 추가하고, 기존 `moon_hint` 원정을 시작하도록 연결한다.
3. visual regression에서 응축 납품 완료 후 원정 탭 preview, start button, active expedition 저장 상태를 검증한다.
4. Browser Use iab로 같은 흐름을 실제 in-app browser에서 확인하고 screenshot/report를 남긴다.
5. roadmap/dashboard/control room, GitHub issue/PR evidence를 갱신한다.

## 플레이어 가치 또는 운영사 가치

- 플레이어 가치: `달빛 온실 단서 +1`이 어디서 쓰이는지 즉시 알 수 있고, 다음 장기 메타 원정을 시작한다.
- 운영사 가치: seed-ops queue가 payoff 표시에서 멈추지 않고 production/progression 소비 루프까지 이어진다.

## 수용 기준

- [x] `물안개 응축 납품` 완료 후 bottom 원정 탭이 `온실 단서` 계열 badge를 보여준다.
- [x] 원정 탭에 `달빛 온실 조사` preview card가 보이고 `달빛 온실 조사 시작` 버튼이 활성화된다.
- [x] 시작 버튼을 누르면 기존 `moon_hint` active expedition이 저장된다.
- [x] 모바일 393px에서 expedition preview와 bottom tabs가 서로 가리지 않고 overflow가 없다.
- [x] Browser Use iab evidence와 `npm run check:visual -- --grep "달빛 온실 조사"`가 통과한다.
- [x] `npm run check:ci`가 통과한다.

## Visual evidence 계획

Browser Use `iab`로 `qaGreenhouseMist=1` 복귀 상태에서 `보상 확인` -> `생산 잎 수령` -> `물안개 응축 납품` 완료 -> `원정` 탭 -> `달빛 온실 조사 시작` 흐름을 확인했다. Screenshot은 `reports/visual/p0-greenhouse-lunar-clue-expedition-preview-browser-use-20260501.png`와 `reports/visual/p0-greenhouse-lunar-clue-expedition-browser-use-20260501.png`에 저장했다.

## Playable mode 영향

사람 플레이용 `main` worktree/port 정책은 변경하지 않는다. 기능은 feature branch에서 검증하고, merge 후 main playable에 반영된다.

## 안전 범위

- 신규 asset 생성 없음.
- 신규 dependency 없음.
- runtime image generation 없음.
- 실제 결제, 로그인, 광고, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음.

## 검증 명령

- Browser Use `iab`
- Browser Use `iab` — PASS, `reports/visual/p0-greenhouse-lunar-clue-expedition-20260501.md`
- `npm run check:visual -- --grep "달빛 온실 조사"` — PASS
- `npm run check:loop` — PASS
- `npm run check:content` — PASS
- `npm run build` — PASS
- `npm run check:ci` — PASS
