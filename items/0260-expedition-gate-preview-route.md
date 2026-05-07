# 달빛 family reveal이 원정 문 preview route로 이어지게 만들기

Status: active
Owner: agent
Created: 2026-05-08
GitHub issue: #488
Branch: `codex/v1-expedition-gate-preview-route`
Game Studio route: `game-studio:game-studio` -> `game-studio:game-ui-frontend` -> `game-studio:phaser-2d-game` -> `game-studio:game-playtest`

## Plan

### 목표

#486에서 달빛 family reveal이 연구 선반에 남았다. 다음 blocker는 장기 메타 실루엣이 아직 연구 선반 문구에만 있고, D7 route의 첫 anchor인 원정 문 preview가 board/HUD에 나타나지 않는 점이다. 이번 WorkUnit은 달빛 family reveal 이후 `원정 문 단서` preview surface를 열어 연구 progression이 다음 구역으로 이어지는 감각을 만든다.

### Campaign source of truth

- Active campaign: P0.5 Idle Core + Creative Rescue
- Game source: `docs/GAME_BIBLE.md`
- Runtime foundation: `docs/phaser/REBOOT_FOUNDATION_SPEC.md`
- 직전 checkpoint: #486 / PR #487 / main CI `25526968559`

### Reference teardown

- Cell to Singularity는 새 node 발견 후 다음 닫힌 node/branch를 즉시 보여준다.
- Idle Miner Tycoon은 새 구역/shaft가 아직 locked여도 위치와 unlock 목표를 먼저 보여준다.
- 현재 production gap: 달빛 family reveal 후 다음 장기 route가 text promise에 머물고, board에서 닫힌 원정 anchor가 보이지 않는다.

### Creative brief

- Player verb: `원정 문 단서 보기`
- Production/progression role: research -> expedition route preview
- Screen moment: 달빛 family reveal 직후 연구 선반에서 다음 장기 목표가 board preview로 열리는 장면
- Asset/FX decision: 새 accepted asset은 만들지 않는다. Phaser board에 preview-only expedition gate slot/facility silhouette와 HUD objective/action surface를 추가해 persistent playfield state를 만든다. 이는 기존 asset 재사용이 아니라 playfield state + HUD affordance visual payoff다.
- Game-feel payoff: 연구 family reveal이 다음 닫힌 구역 preview로 이어져 D7 meta의 실루엣이 보인다.

### Candidate issue list

1. 선택: 원정 문 preview route
   - #486 이후 큰 방향 점프 후보로, 장기 메타 기대감을 실제 board state로 만든다.
2. 보류: dedicated 원정 문 raster/return crate FX asset plan-prompt
   - asset 계획은 필요하지만 먼저 runtime preview anchor와 player verb가 있어야 prompt scope가 명확하다.
3. 보류: 달빛 family reveal FX generation
   - 현재 generation credential/model 환경이 없어 accepted raster provenance를 만들 수 없다.

### Strategic Jump Check

이번 작업은 직전 issue의 좁은 후속이 아니라, research loop에서 D7 expedition route로 넘어가는 큰 방향 점프다. 다만 구현은 preview-only slot/HUD/action으로 제한해 v1 board foundation을 흔들지 않는다.

### Title Contract

제목은 progression moment(`달빛 family reveal`), route role(`원정 문 preview`), screen state(`route`)를 포함한다.

## Department Scorecard

| 부서 | 판정 | 근거 |
| --- | --- | --- |
| 기획팀 | approve | research family reveal 이후 다음 장기 목표를 board에 보여준다. |
| 리서치팀 | approve | idle 경쟁작의 locked next node/area preview pattern을 축소한다. |
| 아트팀 | revise | dedicated expedition gate raster는 없지만 preview silhouette/HUD state로 visual payoff를 만든다. |
| 개발팀 | approve | preview-only board slot/facility, HUD action, checker 변경으로 제한한다. |
| 검수팀 | revise | Browser Use tool이 현재 노출되지 않아 Playwright fallback screenshot/report로 검증한다. |
| 마케팅팀 | approve | 외부 채널/실결제/광고 없음. |
| 고객지원팀 | approve | 다음 장기 목표가 text가 아니라 board preview로 보이면 혼란이 줄어든다. |

## Role Debate

아트팀은 dedicated expedition gate raster를 요구하지만 현재 generation 환경이 없다. 이번 slice는 preview-only silhouette와 HUD surface를 만들어 runtime route anchor를 먼저 세우고, dedicated raster/FX는 후속 asset plan-prompt로 분리한다.

## Subagent/Team Routing

사용하지 않는다. board slot/HUD/checker 변경이 tightly coupled되어 leader 직접 구현이 적절하다.

## Self-Evaluation Loop

- claim: 달빛 family reveal 이후 `원정 문 단서 보기` action이 나타나고, 클릭하면 board에 preview-only expedition gate state가 남는다.
- smallest verifier: `npm run check:phaser`에서 `발견 확인` 이후 `원정 문 단서 보기`를 클릭하고 screenshot/telemetry를 검증한다.
- rubric:
  - pass: `expeditionGatePreviewVisible=true`, preview slot/facility state가 telemetry에 있고 objective/action rail이 원정 문 preview를 설명한다.
  - fail: text promise만 있고 board preview/telemetry가 없다.
- artifact path: `reports/visual/issue-0488-expedition-gate-preview-route/`
- iteration log:
  - 2026-05-08: `npm run check:phaser` pass. 달빛 family reveal 후 `원정 문 단서 보기` action과 `facility_expedition_gate` preview telemetry/screenshot을 `reports/visual/issue-0488-expedition-gate-preview-route/`에 저장했다.
- stop condition: local phaser smoke, CI checker, GitHub checks, merge, main CI green.

## Acceptance Criteria

- 달빛 family reveal 후 `원정 문 단서 보기` action이 표시된다.
- 클릭 후 preview-only expedition gate slot/facility telemetry가 생긴다.
- board/HUD/objective/receipt가 `원정 문 preview`를 설명한다.
- `scripts/check-phaser-foundation.mjs`가 discovery confirm 이후 expedition preview까지 클릭하고 screenshot evidence를 저장한다.
- Browser Use blocker와 Playwright fallback visual evidence가 `reports/visual/issue-0488-expedition-gate-preview-route/visual-report-20260508.md`에 남는다.
- `npm run check:phaser`, `npm run check:ci`, `npm run check:control-room`, `npm run check:ops-live`, `npm run check:github-metadata`, `git diff --check`가 통과한다.

## Verification Commands

```bash
npm run check:phaser
npm run check:ci
npm run check:control-room
npm run check:ops-live
npm run check:github-metadata
git diff --check
```

## Risks / Non-goals

- 실제 expedition run/return timer/reward는 구현하지 않는다.
- 새 raster/sprite/FX asset을 만들지 않는다.
- runtime image generation/API/cache를 호출하지 않는다.

## Evidence

- `npm run check:phaser` pass
- `npm run check:ci` pass
- Visual report: `reports/visual/issue-0488-expedition-gate-preview-route/visual-report-20260508.md`
- Key screenshots:
  - `reports/visual/issue-0488-expedition-gate-preview-route/phaser-check-lunar-family-revealed-393.png`
  - `reports/visual/issue-0488-expedition-gate-preview-route/phaser-check-expedition-gate-preview-393.png`
