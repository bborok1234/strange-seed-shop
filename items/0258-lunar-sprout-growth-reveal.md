# 달빛 새싹 수확이 다음 발견 reveal로 이어지게 만들기

Status: active
Owner: agent
Created: 2026-05-08
GitHub issue: #484
GitHub PR: #485
Branch: `codex/v1-lunar-sprout-growth-reveal`
Game Studio route: `game-studio:game-studio` -> `game-studio:game-ui-frontend` -> `game-studio:phaser-2d-game` -> `game-studio:game-playtest`

## Plan

### 목표

`다음 씨앗 목표`를 심은 뒤 플레이어가 다시 일반 수확 receipt로 떨어지지 않게 한다. `달빛 새싹`은 별도 목표 씨앗으로 성장하고, 수확 순간에 다음 발견/reveal 준비 상태와 receipt/objective/telemetry를 남겨 collection progression이 이어져야 한다.

### Campaign source of truth

- Active campaign: P0.5 Idle Core + Creative Rescue
- Game source: `docs/GAME_BIBLE.md`
- Runtime foundation: `docs/phaser/REBOOT_FOUNDATION_SPEC.md`
- 직전 checkpoint: #482 / PR #483 / main CI `25525693860`

### Reference teardown

- Egg, Inc.와 Idle Miner Tycoon은 해금 목표를 버튼 보상으로 끝내지 않고 곧바로 다음 생산/성장 행동으로 연결한다.
- Cell to Singularity는 발견 단서가 다음 node/reveal 기대감으로 이어져야 progression이 끊기지 않는다.
- 현재 Phaser board의 production gap: `seed_lunar_sprout_001`을 심은 뒤 수확하면 일반 말랑잎 수확처럼 처리되어 목표 씨앗의 의미와 다음 발견 payoff가 사라진다.

### Creative brief

- Player verb: `돌보기` -> `수확` -> `다음 발견 확인`
- Production/progression role: 연구 단서에서 다음 seed family reveal로 이어지는 collection progression bridge
- Screen moment: 도감 기록 후 목표 씨앗을 심고, 3번 밭에서 달빛 새싹을 수확하는 첫 5분 후반 장면
- Asset/FX decision: 새 accepted asset은 만들지 않는다. 기존 generated plot state와 harvest FX를 사용하되 `seed_lunar_sprout_001` chip/objective/receipt/telemetry로 별도 목표 수확 상태를 만든다. 새 dedicated reveal FX는 추후 `fx_album_record_stamp_strip_v1` generation blocker가 풀린 뒤 별도 WorkUnit으로 분리한다.
- Game-feel payoff: 일반 수확이 아니라 `달빛 새싹 발견 준비` receipt, objective, telemetry, screenshot state로 다음 발견 욕구를 만든다.

### Candidate issue list

1. 선택: 달빛 새싹 성장/수확 reveal bridge
   - 직전 #482가 심기에서 멈추기 때문에 다음 player verb가 즉시 비어 있다.
   - 새 외부 asset 없이 runtime/save/HUD/checker로 safe local completion 가능하다.
2. 보류: 도감 기록 스탬프 FX runtime integration
   - `fx_album_record_stamp_strip_v1`은 plan/prompt까지만 있고 실제 raster generation artifact가 없다.
   - 현재 `OPENAI_API_KEY`와 `SEED_ASSET_IMAGE_MODEL`이 없는 환경에서 fake asset을 만들 수 없다.
3. 큰 방향 점프 후보: 원정 문 D7 preview/research route
   - 장기 메타 실루엣에는 강하지만, 현재 달빛 새싹 수확이 닫히지 않아 전제 progression이 끊긴다.

### Strategic Jump Check

이번 선택은 직전 issue의 작은 후속처럼 보이지만, 실제 blocker는 첫 research family progression이 일반 수확으로 붕괴하는 것이다. 큰 방향 점프 후보인 원정 문 preview는 달빛 새싹 reveal 이후에 넣어야 player progression line이 자연스럽다.

### Title Contract

제목은 screen moment(`달빛 새싹 수확`)와 player verb(`수확`)와 progression role(`다음 발견 reveal`)을 포함한다.

## Department Scorecard

| 부서 | 판정 | 근거 |
| --- | --- | --- |
| 기획팀 | approve | player verb가 `돌보기/수확/다음 발견`으로 이어지고, 첫 research family loop를 닫는다. |
| 리서치팀 | approve | 경쟁작 production gap은 해금 목표가 다음 성장/reveal로 연결되지 않는 점이다. |
| 아트팀 | revise | 새 dedicated reveal FX는 필요하지만 현재 생성 credential/model 환경이 없어 이번 slice에서는 기존 harvest FX와 HUD/receipt payoff로 제한한다. |
| 개발팀 | approve | `GardenState`, Phaser HUD telemetry, smoke checker만 변경하는 좁은 runtime tranche다. |
| 검수팀 | revise | Browser Use tool이 현재 노출되지 않아 Playwright fallback screenshot/report로 검증한다. blocker를 visual report에 명시한다. |
| 마케팅팀 | approve | 외부 채널/실결제/광고 없음. devlog angle은 "첫 연구 씨앗이 다음 발견으로 이어짐"이다. |
| 고객지원팀 | approve | 수확 후 다음 행동 의미를 objective와 receipt로 설명해 혼란을 줄인다. |

## Role Debate

아트팀은 dedicated reveal FX strip을 요구하지만, 현재 accepted raster asset이 없고 API/model 환경도 비어 있다. 검수팀은 Browser Use evidence를 요구하지만 현재 세션의 Browser Use execution tool이 노출되지 않았다. 이번 slice는 runtime progression blocker를 먼저 닫고, 새 FX generation/runtime은 별도 asset WorkUnit으로 넘긴다. Playwright screenshot은 fallback evidence로 사용하되 blocker를 보고서에 적는다.

## Subagent/Team Routing

사용하지 않는다. 변경 범위가 `gameState`, `main`, `check-phaser-foundation`, evidence docs로 좁고, 독립 병렬 subtasks보다 leader가 직접 context를 유지하는 편이 빠르다.

## Self-Evaluation Loop

- claim: `seed_lunar_sprout_001` 수확이 일반 말랑잎 수확이 아니라 달빛 새싹 reveal-ready 상태로 전환된다.
- smallest verifier: `npm run check:phaser`에서 목표 씨앗 planting 이후 두 번 `돌보기`, `수확`을 실행한다.
- rubric:
  - pass: `researchNextGoalSeedHarvested=true`, `researchNextGoalRevealReady=true`, plot_03 empty, receipt/objective에 `달빛 새싹`과 `다음 발견`이 남고 screenshot이 저장된다.
  - fail: 일반 수확 receipt/objective만 남거나 plot state/telemetry가 맞지 않는다.
- artifact path: `reports/visual/issue-0484-lunar-sprout-growth-reveal/`
- iteration log:
  - 2026-05-08: `npm run check:phaser` pass. `seed_lunar_sprout_001` ready/harvested screenshot과 telemetry를 `reports/visual/issue-0484-lunar-sprout-growth-reveal/`에 저장했다.
- stop condition: local phaser smoke, CI checker, GitHub checks, merge, main CI green.

## Acceptance Criteria

- `GardenState`가 달빛 새싹 수확/reveal-ready telemetry를 노출한다.
- `harvestSelectedPlot`이 `seed_lunar_sprout_001`을 별도 branch로 처리한다.
- 달빛 새싹 수확 후 objective/receipt/action rail이 다음 발견 상태를 설명한다.
- `scripts/check-phaser-foundation.mjs`가 목표 씨앗 심기 이후 성장/수확까지 진행하고 screenshot evidence를 저장한다.
- Browser Use blocker와 Playwright fallback visual evidence가 `reports/visual/issue-0484-lunar-sprout-growth-reveal/visual-report-20260508.md`에 남는다.
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
- 실제 결제, 광고, 외부 배포, 고객 데이터는 건드리지 않는다.
- 원정 문, 새 creature portrait, dedicated reveal modal은 후속 WorkUnit으로 분리한다.

## Evidence

- `npm run check:phaser` pass
- `npm run check:ci` pass
- Draft PR: #485
- Visual report: `reports/visual/issue-0484-lunar-sprout-growth-reveal/visual-report-20260508.md`
- Key screenshots:
  - `reports/visual/issue-0484-lunar-sprout-growth-reveal/phaser-check-lunar-sprout-ready-393.png`
  - `reports/visual/issue-0484-lunar-sprout-growth-reveal/phaser-check-lunar-sprout-harvested-393.png`
