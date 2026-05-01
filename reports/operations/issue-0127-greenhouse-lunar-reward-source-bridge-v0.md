## 문제 / 배경

`물안개 응축 납품`과 `달빛 온실 조사` 시작은 연결됐지만, `moon_hint` 원정 보상 수령 순간에는 온실/응축기 source가 사라진다. 이 때문에 플레이어가 온실 production chain의 payoff가 달방울 씨앗/달방울 누누 수집으로 돌아온다는 흐름을 약하게 느낀다.

## 목표

`달빛 온실 조사` 완료/보상 수령 순간에도 온실 단서 source를 유지하고, 보상 card와 seed/album 목표 surface가 `달방울 씨앗` / `달방울 누누` 수집 루프로 이어지게 만든다.

GitHub issue: #251

## Small win

- 이번 issue가 만들 가장 작은 승리: 원정 보상 수령 후에도 `응축기에서 회수한 온실 단서`가 다음 lunar seed/creature 목표와 함께 보인다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:game-ui-frontend`, `game-studio:game-playtest`, `game-studio:web-game-foundations`
- 북극성/플레이어 동사: 플레이어가 `원정 보상 받기`를 누른 뒤 달방울 씨앗으로 이동한다.
- Playfield 보호 또는 UI surface 원칙: expedition tab reward card와 seed/album badge로 처리하고 garden playfield persistent HUD를 늘리지 않는다.
- Playtest evidence 계획: Browser Use `iab` + focused visual test + save-state assertion.

## Plan

- 구현 전 작성/검토할 plan artifact: `items/0127-greenhouse-lunar-reward-source-bridge-v0.md`
- 예상 변경 단계:
  - expedition source 저장 필드 추가.
  - greenhouse clue start/claim flow에 source persistence 추가.
  - reward card/seed/album source badge 추가.
  - QA fixture와 visual test 추가.
  - visual evidence, roadmap, dashboard, control room 갱신.
- 검증 계획:
  - Browser Use `iab`
  - `npm run check:visual -- --grep "달빛 온실 조사 보상"`
  - `npm run check:ci`
- 건드리지 않을 범위:
  - 신규 bitmap asset 생성.
  - 기존 보상 수치 변경.

## 플레이어 가치 또는 운영사 가치

- 게임 가치: 온실 production chain의 보상이 lunar collection progression으로 되돌아오는 payoff가 분명해진다.
- 운영사 가치: `player verb + progression role + screen moment + asset/FX + playtest evidence`를 갖춘 vertical slice를 이어간다.

## 수용 기준

- [x] `달빛 온실 조사` 시작 save가 `activeExpedition.source = "greenhouse_mist"`를 저장한다.
- [x] 보상 수령 후 `lunarRewardSource = "greenhouse_mist"`가 남고 `seed_lunar_001`이 해금된다.
- [x] expedition reward card가 `응축기에서 회수한 온실 단서`와 다음 목표를 함께 보여준다.
- [x] seeds/album 목표 surface가 같은 source를 보여준다.
- [x] 모바일 expedition panel layout invariant가 통과한다.
- [x] Browser Use와 visual/CI 검증이 통과한다.

## Visual evidence 계획

- Before screenshot: 기존 `reports/visual/p0-greenhouse-lunar-clue-expedition-20260501.md`
- After screenshot: `reports/visual/p0-greenhouse-lunar-reward-source-bridge-browser-use-claim-20260501.png`, `reports/visual/p0-greenhouse-lunar-reward-source-bridge-browser-use-seeds-20260501.png`, `reports/visual/p0-greenhouse-lunar-reward-source-bridge-browser-use-album-20260501.png`
- Browser Use 우선 QA 계획 또는 N/A 사유: Browser Use `iab`로 claim flow를 직접 확인했다.
- N/A 사유: 해당 없음.

## Playable mode 영향

- [x] 사람이 `npm run play:main`으로 main 게임을 계속 실행할 수 있다.
- 변경 확인 URL/port: local dev server, `http://127.0.0.1:5173/?qaGreenhouseLunarClaimReady=1&qaTab=expedition&qaReset=1`

## 안전 범위

- 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음.
- Branch protection 우회 없음.

## 검증 명령

- 기본 CI gate: `npm run check:ci`
- UI/visual 변경: Browser Use QA + `npm run check:visual -- --grep "달빛 온실 조사 보상"`

## 검증 결과

- Browser Use `iab`: `qaGreenhouseLunarClaimReady=1&qaTab=expedition&qaReset=1`에서 `원정 보상 받기`를 클릭한 뒤 reward card가 `달빛 온실 조사 보상`, `응축기에서 회수한 온실 단서`, `달방울 씨앗`, `달방울 누누`를 함께 표시함.
- Browser Use `iab`: `달방울 씨앗 보러가기` CTA가 씨앗 탭의 `도감 목표 씨앗` card로 이동하고, `온실 단서 source: 응축기에서 회수한 온실 단서`를 유지함.
- Browser Use `iab`: 도감 탭의 `도감 다음 수집 목표`가 `달방울 누누`와 같은 source를 유지함.
- `npm run check:visual -- --grep "달빛 온실 조사 보상"`: 1 passed.
- `npm run check:ci`: passed.
