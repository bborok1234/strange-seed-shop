## 요약

`$seed-ops`가 다음 게임 issue를 고를 때 asset/FX/playfield/HUD/경쟁작 production gap 없이 기능 구현으로 흐르지 못하게 운영 gate를 강화했다.

PR evidence: #239

## Small win

- 이번 PR이 만든 가장 작은 승리: `npm run check:seed-ops-queue`가 생겨 seed-ops/control-room/roadmap의 다음 queue gate가 약해지면 실패한다.

## Plan-first evidence

- Plan artifact: `items/0122-seed-ops-asset-fx-gate-hardening.md`
- Plan에서 벗어난 변경이 있다면 이유: 없음

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: N/A — 게임 런타임 UI/asset 변경이 아니라 agent_ops 하네스 보강이다.
- 적용한 playfield/HUD/playtest 기준: 후속 게임 issue의 `asset/FX` 축이 `playfield state`, `HUD affordance`, `sprite/FX`, `order crate visual state`, `reward motion` 중 하나의 concrete visual/game-feel payoff를 요구하도록 고정했다.
- Game Studio route에서 벗어난 변경이 있다면 이유: 없음

## 작업 checklist

- [x] Plan artifact의 수용 기준을 모두 확인했다.
- [x] 게임 기능/UI/에셋/QA 변경이면 Game Studio route를 기록했다.
- [x] UI/HUD 변경이면 `game-studio:game-ui-frontend` 기준으로 playfield 보호와 persistent HUD 밀도를 확인했다. N/A — UI/HUD runtime 변경 없음.
- [x] 게임 화면 QA이면 `game-studio:game-playtest` 기준으로 첫 actionable screen, main verbs, HUD readability, playfield obstruction을 확인했다. N/A — 게임 화면 변경 없음.
- [x] UI/visual 변경이면 Browser Use 우선 QA를 시도하고 evidence 또는 blocker를 남겼다. N/A — docs/scripts-only 변경.
- [x] 필요한 문서/roadmap/dashboard/report를 갱신했다.
- [x] GitHub issue/PR/comment evidence를 축약 없이 남겼다.

## 사용자/운영자 가치

- 게임 가치: 다음 게임 작업이 단순 기능 증가가 아니라 first screen, playfield, HUD, FX, 보상 motion 같은 production quality payoff를 포함하게 한다.
- 운영사 가치: 사용자가 같은 지적을 반복하지 않아도 CI와 control room이 약한 queue 선택을 막는다.

## Before / After 또는 Visual evidence

- Before: 기존 gate는 `asset/FX 또는 sprite-animation decision` 문구만 요구해 기존 asset 재사용 계획으로 통과할 수 있었다.
- After: `asset/FX` 축은 기존 asset 재사용만으로는 통과하지 않고, concrete visual/game-feel payoff와 경쟁작 production gap을 요구한다.
- Browser Use evidence 또는 blocker: N/A
- N/A 사유: UI/visual runtime 변경 없음. 후속 UI/visual/game issue에서는 Browser Use 우선 QA가 계속 필수다.

## Playable mode

- main 실행 명령: `npm run play:main` 후 필요 시 `npm run play:main:install`, 그리고 `cd ../strange-seed-shop-play && npm run dev -- --host 127.0.0.1 --port 5174`
- 이 PR이 사람 플레이 환경을 막지 않는 이유: 게임 런타임 변경이 없고 `npm run check:control-room`의 playable main check가 통과했다.

## 검증

- [x] `npm run check:seed-ops-queue` PASS
- [x] `npm run check:project-commands` PASS
- [x] `npm run check:ops-live` PASS
- [x] `npm run check:dashboard` PASS
- [x] `npm run check:ci` PASS
- [x] UI/visual 변경이면 Browser Use QA와 `npm run check:visual` 또는 명시 blocker + fallback PASS. N/A — docs/scripts-only 변경.

## 안전 범위

- [x] 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음
- [x] `ENABLE_AGENT_AUTOMERGE` 변경 없음
- [x] Branch protection 우회 없음

## 남은 위험

- 이 PR은 다음 queue gate를 강화한다. 다음 게임 issue 자체에서는 Browser Use 실기 QA와 visual evidence를 다시 수행해야 한다.

## 연결된 issue

Closes #238
