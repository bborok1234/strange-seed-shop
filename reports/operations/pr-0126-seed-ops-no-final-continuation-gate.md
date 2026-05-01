## 요약

`$seed-ops`가 두 loop 뒤 assistant `final` 응답으로 멈춘 사고를 운영 gate로 고정했다. 이제 `final response is terminal` 계약을 skill/docs/AGENTS에 명시하고, 실제 continuation은 `next issue plan artifact exists` 상태여야 한다.

## Small win

- 이번 PR이 만든 가장 작은 승리: stop rule 없이 `$seed-ops` final 응답으로 종료하려는 계약 누락을 `check:seed-ops-queue`가 실패로 잡는다.

## Plan-first evidence

- Plan artifact: `items/0126-seed-ops-no-final-continuation-gate.md`
- Plan에서 벗어난 변경이 있다면 이유: 없음.

## Game Studio route

- Umbrella: N/A — 운영사 계약/검증 스크립트 변경이며 게임 기능/UI/HUD/playfield/asset 변경이 아니다.
- Specialist route: N/A.
- 적용한 playfield/HUD/playtest 기준: N/A — 화면 변경 없음.
- Game Studio route에서 벗어난 변경이 있다면 이유: 없음.

## 작업 checklist

- [x] Plan artifact의 수용 기준을 모두 확인했다.
- [x] 게임 기능/UI/에셋/QA 변경이면 Game Studio route를 기록했다. N/A 사유: 운영사 계약 변경.
- [x] UI/HUD 변경이면 `game-studio:game-ui-frontend` 기준으로 playfield 보호와 persistent HUD 밀도를 확인했다. N/A 사유: UI 변경 없음.
- [x] 게임 화면 QA이면 `game-studio:game-playtest` 기준으로 첫 actionable screen, main verbs, HUD readability, playfield obstruction을 확인했다. N/A 사유: 게임 화면 변경 없음.
- [x] UI/visual 변경이면 Browser Use 우선 QA를 시도하고 evidence 또는 blocker를 남겼다. N/A 사유: 운영 문서/스크립트 변경.
- [x] 필요한 문서/roadmap/dashboard/report를 갱신했다.
- [x] GitHub issue/PR/comment evidence를 축약 없이 남겼다.

## 사용자/운영자 가치

- 게임 가치: production vertical slice queue가 agent final로 끊기는 일을 줄인다.
- 운영사 가치: “다음 후보를 적어둠”과 “다음 issue plan artifact를 만들어 실제로 계속 진행함”을 gate가 구분한다.

## Before / After 또는 Visual evidence

- Before: Issue #242와 Issue #245 두 loop 완료 뒤 stop rule 없이 assistant final로 멈췄다.
- After: `No-final continuation gate`, `final response is terminal`, `next issue plan artifact exists`, `left the next queue candidate is not continuation` 문구가 운영 문서와 검사 스크립트에 고정됐다.
- Browser Use evidence 또는 blocker: N/A — UI/visual 변경 없음.
- N/A 사유: 게임 화면을 수정하지 않는다.

## Playable mode

- main 실행 명령: `npm run play:main` 후 필요 시 `npm run play:main:install`, 그리고 `cd ../strange-seed-shop-play && npm run dev -- --host 127.0.0.1 --port 5174`
- 이 PR이 사람 플레이 환경을 막지 않는 이유: 게임 runtime, UI, asset, save/economy 코드를 변경하지 않는다.

## 검증

- [x] `npm run check:seed-ops-queue` PASS
- [x] `npm run check:project-commands` PASS
- [x] `npm run check:ops-live` PASS
- [x] `npm run check:dashboard` PASS
- [x] `npm run check:ci` PASS
- [x] UI/visual 변경이면 Browser Use QA와 `npm run check:visual` 또는 명시 blocker + fallback PASS. N/A 사유: UI/visual 변경 없음.

## 안전 범위

- [x] 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음
- [x] `ENABLE_AGENT_AUTOMERGE` 변경 없음
- [x] Branch protection 우회 없음

## 남은 위험

- 이 gate는 로컬 문서/검사 계약을 강화한다. Codex App 런타임 자체가 final 응답을 물리적으로 차단하는 것은 아니므로, PR merge 후 다음 `$seed-ops` loop는 이 checker와 plan-first evidence를 계속 통과해야 한다.

## 연결된 issue

Closes #248
