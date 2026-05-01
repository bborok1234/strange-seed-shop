## 요약

`물안개 응축 납품` 완료 후 생기는 `달빛 온실 단서 +1`을 원정 탭의 `달빛 온실 조사` preview와 기존 `moon_hint` 원정 시작으로 연결했다. 새 save schema나 신규 원정 데이터 없이 완료 주문 state에서 단서를 파생한다.

## Small win

- 이번 PR이 만든 가장 작은 승리: 응축기 payoff를 본 플레이어가 원정 탭 `온실` badge를 따라 들어가 `달빛 온실 조사`를 시작한다.

## Plan-first evidence

- Plan artifact: `items/0125-greenhouse-lunar-clue-expedition-v0.md`
- Plan에서 벗어난 변경이 있다면 이유: 없음.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:game-ui-frontend`, `game-studio:game-playtest`
- 적용한 playfield/HUD/playtest 기준: bottom tab clue badge, expedition preview card visual state, single active CTA, mobile 393px overflow/bottom-tab invariant, Browser Use iab actual flow.
- Game Studio route에서 벗어난 변경이 있다면 이유: 없음.

## 작업 checklist

- [x] Plan artifact의 수용 기준을 모두 확인했다.
- [x] 게임 기능/UI/에셋/QA 변경이면 Game Studio route를 기록했다.
- [x] UI/HUD 변경이면 `game-studio:game-ui-frontend` 기준으로 playfield 보호와 persistent HUD 밀도를 확인했다.
- [x] 게임 화면 QA이면 `game-studio:game-playtest` 기준으로 첫 actionable screen, main verbs, HUD readability, playfield obstruction을 확인했다.
- [x] UI/visual 변경이면 Browser Use 우선 QA를 시도하고 evidence 또는 blocker를 남겼다.
- [x] 필요한 문서/roadmap/dashboard/report를 갱신했다.
- [x] GitHub issue/PR/comment evidence를 축약 없이 남겼다.

## 사용자/운영자 가치

- 게임 가치: `달빛 온실 단서 +1`이 단순 payoff copy에서 끝나지 않고 실제 원정 시작 행동으로 소비된다.
- 운영사 가치: seed-ops queue gate가 `HUD affordance + screen moment + playtest evidence`를 포함한 progression 소비 루프까지 밀어붙인다.

## Before / After 또는 Visual evidence

- Before: 응축기 payoff는 `달빛 온실 단서 +1`을 보여주지만 단서 사용처가 없었다.
- After: 원정 탭에 `온실` badge와 `달빛 온실 조사` card가 뜨고, `달빛 온실 조사 시작`이 기존 `moon_hint` active expedition을 저장한다.
- Browser Use evidence 또는 blocker: `reports/visual/p0-greenhouse-lunar-clue-expedition-20260501.md`
- Screenshots:
  - `reports/visual/p0-greenhouse-lunar-clue-expedition-preview-browser-use-20260501.png`
  - `reports/visual/p0-greenhouse-lunar-clue-expedition-browser-use-20260501.png`

## Playable mode

- main 실행 명령: `npm run play:main` 후 필요 시 `npm run play:main:install`, 그리고 `cd ../strange-seed-shop-play && npm run dev -- --host 127.0.0.1 --port 5174`
- 이 PR이 사람 플레이 환경을 막지 않는 이유: feature branch의 React/CSS/test/docs 변경이며, main playable worktree 정책과 port 5174 설정은 변경하지 않는다.

## 검증

- [x] `npm run check:ci` PASS
- [x] Browser Use iab PASS: `qaGreenhouseMist=1` -> `보상 확인` -> `생산 잎 수령` -> `주문 납품` -> `원정` -> `달빛 온실 조사 시작`
- [x] `npm run check:visual -- --grep "달빛 온실 조사"` PASS
- [x] `npm run check:content` PASS
- [x] `npm run check:loop` PASS
- [x] `npm run build` PASS

## 안전 범위

- [x] 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음
- [x] `ENABLE_AGENT_AUTOMERGE` 변경 없음
- [x] Branch protection 우회 없음

## 남은 위험

`moon_hint` 원정 완료 후 달빛 씨앗 보상/수확 루프는 기존 경로를 재사용한다. 후속 작업은 온실 단서 source를 보상 claim/reveal에도 더 명확히 남길 수 있다.

## 연결된 issue

Closes #245
