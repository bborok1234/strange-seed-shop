# 원정 문 preview가 첫 원정 출발/귀환 crate로 이어지게 만들기

Status: verified
Owner: agent
Created: 2026-05-08
GitHub issue: #490
Branch: `codex/v1-first-expedition-depart-return`
Game Studio route: `game-studio:game-studio` -> `game-studio:game-ui-frontend` -> `game-studio:phaser-2d-game` -> `game-studio:game-playtest`

## Plan

### 목표

#488 / PR #489에서 달빛 family reveal 이후 원정 문 preview가 board/HUD에 남았다. 다음 blocker는 D7 route가 아직 preview로만 끝나고, v1 Launch Slice의 `expedition gate -> depart -> traveling -> returned crate` 흐름이 없다. 이번 WorkUnit은 첫 tutorial route인 `뒷마당 틈새길`을 preview 상태에서 출발 가능한 첫 원정으로 연결하고, 진행 중/귀환 상자/보상 수령을 board와 HUD에서 재현 가능하게 만든다.

### Campaign source of truth

- Active campaign: P0.5 Idle Core + Creative Rescue
- Game source: `docs/GAME_BIBLE.md`
- Production companion: `docs/GAME_PRODUCTION_SPEC.md`
- Runtime foundation: `docs/phaser/REBOOT_FOUNDATION_SPEC.md`
- 직전 checkpoint: #488 / PR #489 / main CI `25527621378`

### Reference teardown

- Idle Miner Tycoon은 새 shaft/area preview 뒤 바로 첫 activation 목표를 제시한다.
- Cell to Singularity는 닫힌 node preview 뒤 첫 unlock action과 다음 node silhouette를 함께 보여준다.
- 현재 production gap: 원정 문은 D7 chip으로 보이지만 player verb가 `preview 확인`에서 멈추고, 원정 출발/귀환 보상 상태가 없어 long meta가 playable loop로 읽히지 않는다.

### Creative brief

- Player verb: `틈새길 보내기`, `귀환 상자 열기`
- Production/progression role: expedition gate tutorial route, rare/source loop의 첫 실루엣
- Screen moment: 원정 문 preview 확인 후 Pori/Momo 중 한 actor가 원정 문으로 향하고, 귀환 상자가 보상 수령 상태로 남는 장면
- Asset/FX decision: 새 accepted asset은 만들지 않는다. 기존 `facility_order_crate_*`, soft shadow, actor strip을 사용해 `returned crate` placeholder를 runtime state로 표시한다. 전용 원정 문/귀환 상자 raster는 후속 asset plan-prompt로 분리한다.
- Game-feel payoff: research route가 실제 idle long verb로 이어지고, player가 “다녀오면 뭔가 가져온다”를 첫 D7 loop로 이해한다.

### Candidate issue list

1. 선택: 첫 원정 출발/귀환 crate route
   - #489가 만든 preview anchor를 즉시 playable route로 바꾼다.
2. 보류: dedicated expedition gate/return crate raster plan-prompt
   - 필요하지만 runtime verb가 먼저 있어야 asset prompt가 정확하다.
3. 보류: 15분 달빛 흔적 찾기 route
   - tutorial route가 없으면 두 번째 route의 requirement/duration UI가 뜬금없다.

### Strategic Jump Check

이번 작업은 좁은 copy tweak가 아니라 D7 research/expedition slice의 실제 route verb를 연다. 다만 production risk를 줄이기 위해 route는 scripted tutorial state machine과 smoke checker까지로 제한하고, 실제 5분 wall-clock timer나 multi-party setup은 구현하지 않는다.

### Title Contract

제목은 progression moment(`원정 문 preview`), player verb(`출발/귀환`), screen payoff(`crate`)를 포함한다.

## Department Scorecard

| 부서 | 판정 | 근거 |
| --- | --- | --- |
| 기획팀 | approve | D7 long meta가 preview에서 첫 원정 verb로 이어진다. |
| 리서치팀 | approve | idle 경쟁작의 locked area -> first activation -> return reward pattern을 축소한다. |
| 아트팀 | revise | 전용 expedition gate/return crate raster는 없고 기존 crate asset으로 returned state를 표현한다. 후속 asset plan-prompt가 필요하다. |
| 개발팀 | approve | GardenState의 expedition route state, HUD action, actor target, checker 변경으로 제한한다. |
| 검수팀 | revise | Browser Use tool이 현재 노출되지 않아 Playwright fallback screenshot/report로 검증한다. |
| 마케팅팀 | approve | 외부 채널/실결제/광고 없음. |
| 고객지원팀 | approve | 플레이어가 preview 이후 다음 행동과 보상 의미를 이해할 수 있다. |

## Role Debate

아트팀은 원정 문 전용 prop과 귀환 상자 FX를 요구하지만 현재 `OPENAI_API_KEY`와 `SEED_ASSET_IMAGE_MODEL`이 없어 새 accepted raster provenance를 만들 수 없다. 이번 slice는 existing raster를 production asset으로 새로 주장하지 않고, route state/actor path/HUD receipt를 먼저 만든다. dedicated raster/FX는 다음 asset WorkUnit으로 분리한다.

## Subagent/Team Routing

사용하지 않는다. `gameState.ts`, `main.ts`, `scripts/check-phaser-foundation.mjs`가 서로 맞물린 단일 route state 변경이라 leader 직접 구현이 적절하다.

## Self-Evaluation Loop

- claim: 원정 문 preview 이후 `틈새길 보내기` action이 나타나고, 클릭하면 expedition route가 traveling state가 되며, `귀환 상자 열기`를 통해 보상과 receipt가 남는다.
- smallest verifier: `npm run check:phaser`에서 #489 scripted path 이후 `틈새길 보내기`와 `귀환 상자 열기`를 클릭하고 screenshot/telemetry를 검증한다.
- rubric:
  - pass: `activeExpeditionRouteId=expedition_backyard_gap`, `expeditionState=returned/claimed` progression, objective/rail/receipt가 출발과 귀환 보상을 설명한다.
  - fail: 원정 문 preview만 있고 출발/귀환 state가 없다.
- artifact path: `reports/visual/issue-0490-first-expedition-depart-return/`
- iteration log:
  - 2026-05-08: plan-first artifact 작성.
  - 2026-05-08: `npm run check:phaser` pass. #489 scripted path 이후 `틈새길 보내기`, 자동 귀환, `귀환 상자 열기`까지 클릭하고 traveling/returned/claimed telemetry와 screenshot을 `reports/visual/issue-0490-first-expedition-depart-return/`에 저장했다.
- stop condition: local phaser smoke, CI checker, GitHub checks, merge, main CI green.

## Acceptance Criteria

- 원정 문 preview 후 `틈새길 보내기` action이 표시된다.
- 출발 후 expedition telemetry가 `traveling` 상태와 route id `expedition_backyard_gap`을 노출한다.
- board/HUD/objective/receipt가 원정 진행 중 상태를 설명하고 actor path가 원정 문을 향한다.
- 귀환 상태에서 `귀환 상자 열기` action이 표시되고 클릭 후 leaves/reward/receipt가 증가한다.
- `scripts/check-phaser-foundation.mjs`가 expedition depart/return/claim까지 클릭하고 screenshot evidence를 저장한다.
- Browser Use blocker와 Playwright fallback visual evidence가 `reports/visual/issue-0490-first-expedition-depart-return/visual-report-20260508.md`에 남는다.
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

- 실제 5분 wall-clock timer를 기다리게 하지 않는다. Scripted v1 smoke에서는 출발 직후 deterministic return-ready state를 만든다.
- multi-party setup, route list, second route, rare source 확률표는 구현하지 않는다.
- 새 raster/sprite/FX asset을 만들지 않는다.
- runtime image generation/API/cache를 호출하지 않는다.

## Evidence

- `npm run check:phaser` pass
- `npm run check:ci` pass
- Visual report: `reports/visual/issue-0490-first-expedition-depart-return/visual-report-20260508.md`
- Key screenshots:
  - `reports/visual/issue-0490-first-expedition-depart-return/phaser-check-expedition-traveling-393.png`
  - `reports/visual/issue-0490-first-expedition-depart-return/phaser-check-expedition-returned-393.png`
  - `reports/visual/issue-0490-first-expedition-depart-return/phaser-check-expedition-claimed-393.png`
