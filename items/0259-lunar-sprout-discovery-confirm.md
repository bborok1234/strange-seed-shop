# 달빛 새싹 발견 확인이 연구 선반 family reveal로 이어지게 만들기

Status: active
Owner: agent
Created: 2026-05-08
GitHub issue: #486
Branch: `codex/v1-lunar-sprout-discovery-confirm`
Game Studio route: `game-studio:game-studio` -> `game-studio:game-ui-frontend` -> `game-studio:phaser-2d-game` -> `game-studio:game-playtest`

## Plan

### 목표

#484에서 `달빛 새싹 발견 준비` 상태까지 만들었다. 다음 blocker는 이 reveal-ready 상태가 아직 실제 player verb가 아니라 action rail 안내에 머문다는 점이다. 이번 WorkUnit은 `발견 확인` action을 추가해 연구 선반에 달빛 family reveal surface를 남긴다.

### Campaign source of truth

- Active campaign: P0.5 Idle Core + Creative Rescue
- Game source: `docs/GAME_BIBLE.md`
- Runtime foundation: `docs/phaser/REBOOT_FOUNDATION_SPEC.md`
- 직전 checkpoint: #484 / PR #485 / main CI `25526399609`

### Reference teardown

- Cell to Singularity는 새 node discovery를 별도 확인 action과 unlocked node surface로 보여준다.
- Idle Miner Tycoon류의 unlock은 reward text만이 아니라 다음 시설/구역에 persistent state를 남긴다.
- 현재 production gap: 달빛 새싹 수확 후 `다음 발견 준비 완료`는 보이지만, 플레이어가 눌러서 family reveal을 확정하는 verb와 연구 선반 playfield state가 없다.

### Creative brief

- Player verb: `발견 확인`
- Production/progression role: research family reveal과 다음 D7 route의 첫 anchor
- Screen moment: 달빛 새싹 수확 직후 action rail, 그리고 연구 선반 선택 시 family reveal surface
- Asset/FX decision: 새 accepted asset은 만들지 않는다. 대신 research shelf playfield state에 달빛 family chips를 추가하고, HUD/action surface에 `달빛 family reveal`을 표시한다. 이는 기존 asset 재사용이 아니라 persistent playfield state/HUD affordance를 추가하는 visual payoff다.
- Game-feel payoff: 수확 후 기다리는 상태가 버튼 click과 연구 선반 상태 변화로 닫힌다.

### Candidate issue list

1. 선택: 달빛 새싹 발견 확인 -> 연구 선반 family reveal
   - #484의 reveal-ready state를 player verb로 닫는다.
   - 연구/장기 메타 실루엣을 첫 Phaser board 안에 남긴다.
2. 보류: dedicated 달빛 새싹 reveal FX asset generation
   - 현재 generation credential/model 환경이 없어 accepted raster provenance를 만들 수 없다.
3. 큰 방향 점프 후보: 원정 문 preview
   - 장기 메타에는 좋지만, 현재 research family reveal이 확정되지 않아 route anchor가 부족하다.

### Strategic Jump Check

이 작업은 작은 연결 기능이지만, research family reveal을 확정해 D7 원정/희귀 seed route로 넘어갈 수 있는 anchor를 만든다. 큰 방향 점프 후보인 원정 문 preview는 이 reveal surface 이후에 붙이는 편이 플레이어 이해가 더 좋다.

### Title Contract

제목은 screen moment(`달빛 새싹 발견 확인`), player verb(`확인`), progression role(`연구 선반 family reveal`)을 포함한다.

## Department Scorecard

| 부서 | 판정 | 근거 |
| --- | --- | --- |
| 기획팀 | approve | reveal-ready 상태를 `발견 확인` player verb로 닫는다. |
| 리서치팀 | approve | Cell to Singularity식 discovery node 확인과 unlocked state를 축소한다. |
| 아트팀 | revise | dedicated reveal FX는 필요하지만 이번 slice는 research shelf chips/HUD surface로 visual payoff를 만든다. |
| 개발팀 | approve | `GardenState`, Phaser HUD/action, research shelf visual state, smoke checker만 변경한다. |
| 검수팀 | revise | Browser Use tool이 현재 노출되지 않아 Playwright fallback screenshot/report로 검증한다. |
| 마케팅팀 | approve | 외부 채널/실결제/광고 없음. |
| 고객지원팀 | approve | 수확 후 `다음 발견 준비`가 실제 확인 action으로 닫혀 혼란을 줄인다. |

## Role Debate

아트팀은 dedicated reveal FX를 요구하지만 asset generation 환경이 비어 있다. 이번 WorkUnit은 새 raster 대신 연구 선반 playfield chips와 action surface를 추가해 player-facing visual payoff를 확보한다. 검수팀의 Browser Use 요구는 현재 tool blocker로 기록하고 Playwright fallback을 사용한다.

## Subagent/Team Routing

사용하지 않는다. 변경 범위가 좁고 runtime/checker/evidence가 tightly coupled되어 leader가 직접 수행한다.

## Self-Evaluation Loop

- claim: `달빛 새싹 발견 준비` 후 `발견 확인` action이 나타나고, 클릭하면 `researchLunarFamilyRevealed=true` 및 연구 선반 family reveal surface가 남는다.
- smallest verifier: `npm run check:phaser`에서 달빛 새싹 수확 후 `발견 확인`을 클릭하고 screenshot/telemetry를 검증한다.
- rubric:
  - pass: action rail에 `발견 확인`, 클릭 후 `researchNextGoalRevealReady=false`, `researchLunarFamilyRevealed=true`, objective/receipt/research shelf visual state가 달빛 family reveal을 설명한다.
  - fail: reveal-ready 상태가 버튼 없이 머물거나, 클릭 후 persistent 연구 선반 상태가 없다.
- artifact path: `reports/visual/issue-0486-lunar-sprout-discovery-confirm/`
- iteration log:
  - 2026-05-08: `npm run check:phaser` pass. 달빛 새싹 수확 후 `발견 확인` action과 연구 선반 family reveal screenshot/telemetry를 `reports/visual/issue-0486-lunar-sprout-discovery-confirm/`에 저장했다.
- stop condition: local phaser smoke, CI checker, GitHub checks, merge, main CI green.

## Acceptance Criteria

- `GardenState`가 달빛 family reveal confirmed telemetry를 노출한다.
- `발견 확인` action이 달빛 새싹 수확 후 표시된다.
- 클릭 후 objective/receipt/action rail/research shelf playfield state가 `달빛 family reveal`을 설명한다.
- `scripts/check-phaser-foundation.mjs`가 #484 path 이후 `발견 확인`까지 클릭하고 screenshot evidence를 저장한다.
- Browser Use blocker와 Playwright fallback visual evidence가 `reports/visual/issue-0486-lunar-sprout-discovery-confirm/visual-report-20260508.md`에 남는다.
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

- 새 raster/sprite/FX asset을 만들지 않는다.
- runtime image generation/API/cache를 호출하지 않는다.
- 원정 문, dedicated reveal modal, 새 creature portrait는 후속 WorkUnit으로 분리한다.

## Evidence

- `npm run check:phaser` pass
- `npm run check:ci` pass
- Visual report: `reports/visual/issue-0486-lunar-sprout-discovery-confirm/visual-report-20260508.md`
- Key screenshots:
  - `reports/visual/issue-0486-lunar-sprout-discovery-confirm/phaser-check-lunar-sprout-harvested-393.png`
  - `reports/visual/issue-0486-lunar-sprout-discovery-confirm/phaser-check-lunar-family-revealed-393.png`
