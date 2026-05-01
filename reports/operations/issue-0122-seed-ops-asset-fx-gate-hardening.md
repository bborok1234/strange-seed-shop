## 문제 / 배경

`$seed-ops`가 다음 게임 issue를 고를 때 asset/FX/playfield/HUD/경쟁작 production gap을 queue에 충분히 반영하지 못하고 기능 구현으로 흐르는 문제가 반복됐다. 기존 gate는 `asset/FX 또는 sprite-animation decision` 같은 문구만 확인해, 실제 시각 표면이나 game-feel payoff가 없어도 통과할 수 있었다.

## 목표

다음 `$seed-ops` 게임 issue가 concrete asset/FX/playfield/HUD payoff 없이 plan-first gate를 통과하지 못하게 한다.

## Small win

- 이번 issue가 만들 가장 작은 승리: `check:seed-ops-queue`가 생겨 seed-ops/control-room/roadmap의 다음 queue gate가 약해지면 CI에서 실패한다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: N/A 사유: 이번 작업은 게임 런타임 UI/asset을 직접 수정하지 않는 agent_ops 하네스 보강이다.
- 북극성/플레이어 동사: 후속 게임 issue가 player verb와 production/progression role을 실제 화면 payoff에 연결하게 한다.
- Playfield 보호 또는 UI surface 원칙: 후속 issue의 `asset/FX` 축은 `playfield state`, `HUD affordance`, `sprite/FX`, `order crate visual state`, `reward motion` 중 하나 이상을 명시해야 한다.
- Playtest evidence 계획: docs/scripts-only 작업이라 Browser Use N/A. 후속 UI/visual/game issue에서는 Browser Use 우선 QA가 필수다.

## Plan

- 구현 전 작성/검토할 plan artifact: `items/0122-seed-ops-asset-fx-gate-hardening.md`, `reports/operations/asset-ops-reference-review-20260501.md`
- 예상 변경 단계:
  - 외부 skill/ops 레퍼런스에서 적용 원칙을 추출한다.
  - `$seed-ops`, project commands, AGENTS, roadmap, control room의 queue gate를 강화한다.
  - 새 checker를 추가하고 CI에 연결한다.
  - dashboard/control room/heartbeat/GitHub evidence를 갱신한다.
- 검증 계획: `npm run check:seed-ops-queue`, `npm run check:project-commands`, `npm run check:ops-live`, `npm run check:ci`
- 건드리지 않을 범위: 게임 런타임, 실제 asset 생성, 결제/로그인/외부 배포/고객 데이터/credential

## 플레이어 가치 또는 운영사 가치

- 게임 가치: 다음 게임 작업이 단순 기능 증가가 아니라 first screen, playfield, HUD, FX, 보상 motion 같은 production quality payoff를 포함하게 한다.
- 운영사 가치: 사용자가 같은 지적을 반복하지 않아도 CI와 control room이 약한 queue 선택을 막는다.

## 수용 기준

- [x] 다음 게임 issue 후보의 `asset/FX` 축은 기존 asset 재사용만으로 통과하지 않는다.
- [x] asset/FX 축은 `playfield state`, `HUD affordance`, `sprite/FX`, `order crate visual state`, `reward motion` 중 최소 하나의 concrete visual/game-feel payoff를 요구한다.
- [x] 단순 주문 추가, copy tweak, spacing tweak, test-only 작업은 visual payoff와 경쟁작 production gap이 없으면 queue gate에서 실패한다고 문서화된다.
- [x] `npm run check:seed-ops-queue`가 gate drift를 검증한다.
- [x] `npm run check:ci`가 새 gate를 포함해 통과한다.

## Visual evidence 계획

- Before screenshot: N/A — docs/scripts-only 변경
- After screenshot: N/A — docs/scripts-only 변경
- Browser Use 우선 QA 계획 또는 N/A 사유: N/A — UI/visual runtime 변경 없음
- N/A 사유: 운영 하네스와 문서/checker 변경이며 후속 game/UI issue에서 Browser Use를 강제한다.

## Playable mode 영향

- [x] 사람이 `npm run play:main`으로 main 게임을 계속 실행할 수 있다.
- 변경 확인 URL/port: N/A

## 안전 범위

- 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음.
- Branch protection 우회 없음.

## 검증 명령

- 기본 CI gate: `npm run check:ci`
- 추가 gate: `npm run check:seed-ops-queue`
- UI/visual 변경: N/A
