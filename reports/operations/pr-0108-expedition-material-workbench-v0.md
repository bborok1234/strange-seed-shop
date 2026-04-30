## 요약

원정 보상 `재료`를 정원 `작업대 강화`로 연결하고, 강화 완료 후 자동 생산률이 `분당 12.8 잎`에서 `분당 14.3 잎`으로 올라가도록 했다. 동시에 `$seed-ops` 운영 지침에 원격 게시가 issue loop의 완료 조건임을 명시해 확인 질문으로 멈추지 않게 했다.

## Small win

- 이번 PR이 만든 가장 작은 승리: 원정 보상 수령 직후 정원에서 재료를 써서 생산 엔진을 강화하는 한 번의 vertical slice.

## Plan-first evidence

- Plan artifact: `items/0108-expedition-material-workbench-v0.md`
- Plan에서 벗어난 변경이 있다면 이유: 사용자 지적에 따라 운영 source of truth도 함께 보강했다. `$seed-ops` 완료 조건과 직접 관련된 운영 규칙 수정이다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:web-game-foundations`, `game-studio:game-ui-frontend`, `game-studio:game-playtest`
- 적용한 playfield/HUD/playtest 기준: 원정 보상 -> 재료 사용 -> 정원 생산률 상승이 한 화면 흐름으로 읽히는지, mobile action surface가 bottom tab overlap과 내부 overflow 없이 유지되는지 확인했다.
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

- 게임 가치: 원정 보상이 HUD 숫자에 머물지 않고 생산 idle loop의 다음 성장 선택으로 이어진다.
- 운영사 가치: 사용자가 별도 원격 게시 지시를 반복하지 않아도 `$seed-ops`가 branch push, PR, checks, merge, main CI까지 완료 조건으로 수행해야 함을 source of truth와 checker에 남겼다.

## Before / After 또는 Visual evidence

- Before: 원정 보상 재료가 정원 생산 루프에서 즉시 쓸 수 있는 강화 선택지로 연결되지 않았다.
- After: 원정 보상 수령 후 정원에 `작업대 강화`가 보이고, 재료 2개를 써서 `재료 작업대 +15% 가동` 완료 상태와 `분당 14.3 잎` 생산률을 확인할 수 있다.
- Browser Use evidence 또는 blocker: `reports/visual/p0-expedition-material-workbench-browser-use-20260430.png`
- N/A 사유: 해당 없음.

## Playable mode

- main 실행 명령: `npm run play:main` 후 필요 시 `npm run play:main:install`, 그리고 `cd ../strange-seed-shop-play && npm run dev -- --host 127.0.0.1 --port 5174`
- 이 PR이 사람 플레이 환경을 막지 않는 이유: local save migration 기본값을 추가했고, playable main worktree를 수정하지 않는다.

## 검증

- [x] `npm run check:ci` PASS
- [x] UI/visual 변경이면 Browser Use QA와 `npm run check:visual` 또는 명시 blocker + fallback PASS
- [x] `npm run check:visual -- --grep "작업대"` PASS
- [x] `npm run check:visual -- --grep "생산 roster|작업대|복귀 성장 100"` PASS
- [x] `npm run check:visual` PASS, 33 passed

## 안전 범위

- [x] 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음
- [x] `ENABLE_AGENT_AUTOMERGE` 변경 없음
- [x] Branch protection 우회 없음

## 남은 위험

GitHub checks에서 동일한 CI gate를 재확인해야 한다. 기능상 남은 위험은 현재 없음.

## 연결된 issue

Closes #197
