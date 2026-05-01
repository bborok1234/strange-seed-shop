## 요약

이미 merge된 Issue #245 / PR #246의 운영 evidence를 main CI 기준으로 닫는다. 기능 코드는 변경하지 않고 item, issue report, roadmap, control-room, heartbeat만 최신 main 상태에 맞춘다.

## Small win

- 이번 PR이 만든 가장 작은 승리: `달빛 온실 조사 원정 v0`가 main CI `25208987443`까지 통과한 완료 항목으로 기록된다.

## Plan-first evidence

- Plan artifact: `items/0125-greenhouse-lunar-clue-expedition-v0.md`
- Plan에서 벗어난 변경이 있다면 이유: N/A — merge 후 evidence closeout만 수행한다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:game-ui-frontend`, `game-studio:game-playtest`
- 적용한 playfield/HUD/playtest 기준: 원 기능 PR #246에서 Browser Use iab와 visual gate를 완료했다.
- Game Studio route에서 벗어난 변경이 있다면 이유: N/A — UI 코드 변경 없음.

## 작업 checklist

- [x] Plan artifact의 수용 기준을 모두 확인했다.
- [x] 게임 기능/UI/에셋/QA 변경이면 Game Studio route를 기록했다.
- [x] UI/HUD 변경이면 `game-studio:game-ui-frontend` 기준으로 playfield 보호와 persistent HUD 밀도를 확인했다.
- [x] 게임 화면 QA이면 `game-studio:game-playtest` 기준으로 첫 actionable screen, main verbs, HUD readability, playfield obstruction을 확인했다.
- [x] UI/visual 변경이면 Browser Use 우선 QA를 시도하고 evidence 또는 blocker를 남겼다.
- [x] 필요한 문서/roadmap/dashboard/report를 갱신했다.
- [x] GitHub issue/PR/comment evidence를 축약 없이 남겼다.

## 사용자/운영자 가치

- 게임 가치: 이미 merge된 달빛 온실 조사 vertical slice의 완료 상태가 roadmap에서 정확히 닫혀 다음 보상/수집 후보가 흐려지지 않는다.
- 운영사 가치: seed-ops loop가 merge 후 main CI evidence까지 남긴다.

## Before / After 또는 Visual evidence

- Before: Issue #245는 구현/PR merge가 끝났지만 roadmap/item evidence가 main CI 완료 상태로 닫히지 않았다.
- After: Issue #245, PR #246, main CI `25208987443`, merge commit `bae8b9ef038351f0547a8cec3431b32a57d2d526`가 item/report/roadmap/control-room에 남는다.
- Browser Use evidence 또는 blocker: N/A — 문서/evidence closeout이며 UI 변경 없음. 원 기능의 Browser Use evidence는 `reports/visual/p0-greenhouse-lunar-clue-expedition-20260501.md`.
- N/A 사유: UI 코드와 visual surface 변경 없음.

## Playable mode

- main 실행 명령: `npm run play:main` 후 필요 시 `npm run play:main:install`, 그리고 `cd ../strange-seed-shop-play && npm run dev -- --host 127.0.0.1 --port 5174`
- 이 PR이 사람 플레이 환경을 막지 않는 이유: 문서/evidence closeout만 변경한다.

## 검증

- [x] `npm run check:dashboard` PASS
- [x] `npm run check:control-room` PASS
- [x] `npm run check:ops-live` PASS
- [x] `npm run check:seed-ops-queue` PASS

## 안전 범위

- [x] 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음
- [x] `ENABLE_AGENT_AUTOMERGE` 변경 없음
- [x] Branch protection 우회 없음

## 남은 위험

다음 seed-ops 후보는 `달빛 온실 조사` 완료/보상 수령 순간을 온실 단서 source와 달빛 씨앗/수집 루프로 더 명확히 연결해야 한다.

## 연결된 issue

N/A — Issue #245는 PR #246으로 이미 닫혔다.
