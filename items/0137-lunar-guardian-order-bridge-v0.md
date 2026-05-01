# Lunar guardian order bridge v0

Status: active
Owner: agent
Created: 2026-05-02
Updated: 2026-05-02
Work type: game_feature
Scope-risk: moderate
Issue: #270

## Intent

`달방울 누누`가 수확 reveal과 production roster에 합류한 뒤, 그 역할이 바로 다음 주문/납품/보상으로 이어지게 한다. 현재 lunar payoff는 actor 합류까지는 보이지만, 플레이어가 "이 아이가 어떤 일을 해서 다음 성장을 여는가"를 주문 crate와 reward motion으로 확인하는 단계가 약하다.

## Studio Campaign Gate

Campaign source of truth: `P0.5 Idle Core + Creative Rescue`

This is the next campaign slice after `items/0132-lunar-harvest-creature-payoff-v0.md`. It must not be a CI-only or copy-only loop. The slice must connect a named lunar creature to a production/progression role through a concrete screen moment.

## Game Studio Route

- Umbrella: `game-studio:game-studio`
- UI/HUD/playfield: `game-studio:game-ui-frontend`
- Browser QA/playtest: `game-studio:game-playtest`
- Asset/FX: `game-studio:sprite-pipeline` + project-local `gpt-game-asset-*`

## Reference Teardown

- Egg, Inc.: new production actors should immediately feed a visible contract/order/progress target.
- Idle Miner Tycoon: a newly unlocked worker/manager should convert into faster progress, not just a roster badge.
- Cell to Singularity: a discovery should open the next branch silhouette with a concrete reward step.

## Creative Brief

Player verb:

> `달방울 누누가 합류한 뒤 달빛 보호 주문을 채우고 납품 보상을 받는다.`

Screen moment:

- Garden playfield/order crate after lunar harvest.
- Production card or order panel showing a lunar-specific contribution.
- Delivery/reward moment that points toward the next lunar/greenhouse progression.

Player feeling:

> "누누가 밤 온실을 지키는 역할을 실제로 하고 있고, 다음 달빛 보상까지 이어진다."

## Strategic Jump Check

Issue/PR title retrospective: `reports/operations/seed-ops-issue-pr-title-retrospective-20260502.md`

Candidate comparison:

| 후보 | 큰 방향성 | 선택/거절 |
| --- | --- | --- |
| 정원 첫 화면을 생산 엔진 중심으로 대대적 재배치 | 첫 화면 UI/UX 대대적 개선 | 이번 issue에서 바로 착수하기에는 현재 `다음 행동` visual QA 결함이 회귀 게이트를 무력화한다. 먼저 눈에 보이는 clipping을 막고 다음 issue 후보로 올린다. |
| P0.5 creature/order asset family를 새 raster batch로 재정렬 | 전체 art direction / asset family 개선 | 필요하지만 gpt-image-2/API 또는 Codex native image generation batch plan이 선행되어야 한다. 이번 issue는 새 asset을 만들지 않는다. |
| 달방울 누누 달빛 보호 주문 납품 UI와 QA 하네스 수정 | production readability + visual QA harness defect | 선택. 사용자 스크린샷에서 production card payoff가 실제로 잘렸고, 기존 QA가 DOM text/scrollHeight 중심으로 통과시킨 결함이라 지금 고치지 않으면 다음 큰 UI 작업도 같은 방식으로 놓친다. |

Correction: `Lunar guardian order bridge v0` 제목은 title anti-pattern이다. PR body에서는 `Title Contract` 보정 사유를 남기고, 다음 issue부터는 한국어 `screen moment + player verb + production/progression role` 제목을 사용한다.

## Title Contract

Bad current title: `Lunar guardian order bridge v0`

Preferred product title:

> `달방울 누누가 달빛 보호 주문을 납품하게 만들기`

Reason: `screen moment`는 정원 다음 행동 카드, `player verb`는 달빛 보호 주문 납품, `production/progression role`은 lunar creature -> order -> material/research progression이다.

## Game Studio Department Signoff

| 부서 | 산출물 |
| --- | --- |
| 기획팀 | Player verb: lunar guardian order fill/deliver. Core loop role: production -> order -> progression reward. |
| 리서치팀 | Production gap: #267 proves actor reveal, but not actor-to-order conversion. |
| 아트팀 | Asset/FX axis must include at least one concrete payoff: lunar order crate visual state, reward motion, or dedicated moon-drop delivery FX. Existing asset reuse alone is not enough. |
| 개발팀 | Likely touchpoints: `src/App.tsx`, `src/game/playfield/*`, content data, manifest asset binding, visual/check scripts. Avoid save schema churn unless necessary. |
| 검수팀 | Browser Use `iab` mobile/desktop evidence for post-lunar-harvest order state, delivery state, no bottom-tab overlap, and no hidden overflow. |
| 마케팅팀 | Mock-only promise: `달빛 수호 주문` as a gameplay beat; no real channel action. |
| 고객지원팀 | Confusion risk: player may not understand why lunar harvest changes orders. Add compact player-facing bridge only if it clarifies the next verb. |

## Plan

1. Inspect current lunar harvest state and order/progression data.
2. Define the smallest lunar order bridge that starts after `creature_lunar_common_001` is discovered.
3. Add a concrete visual/game-feel payoff:
   - preferred: lunar order crate visual state plus short reward/delivery FX binding;
   - acceptable fallback: generated or accepted raster FX strip with documented provenance and manifest `animation.binding`.
4. Implement runtime state so lunar production contributes to the new order/progression step.
5. Add/extend QA state for `qaLunarSeedReadyToHarvest=1&qaFxTelemetry=1` to cover post-harvest order bridge.
6. Capture Browser Use evidence and run local gates.
7. Publish PR with all merge-blocking evidence in the PR body before merge/close.

## Acceptance Criteria

- [x] After `달방울 누누` is discovered, the player sees a lunar-specific order/progression target rather than only a roster badge.
- [x] The lunar order bridge includes at least one concrete visual/game-feel payoff from `playfield state`, `HUD affordance`, `sprite/FX`, `order crate visual state`, or `reward motion`.
- [x] New accepted game asset or FX provenance is recorded if a new asset is introduced; existing asset reuse alone is explicitly insufficient. N/A - v0 reuses accepted lunar FX strip and adds CSS/runtime order-crate state, no new accepted manifest asset.
- [x] Browser Use evidence shows post-harvest order state and delivery/reward state on mobile.
- [x] UI visual QA confirms no body scroll, bottom-tab overlap, hidden child overflow, or production/order card clipping.
- [x] No runtime image generation, real payment, login, external deployment, customer data, or real GTM action is introduced.

## Visual QA Finding

User-reported blocker on 2026-05-02:

- URL: `http://127.0.0.1:5173/?qaLunarOrderReady=1&qaFxTelemetry=1`
- Failure: the `다음 행동` production card clipped the `달빛 보호 주문` payoff area under `달방울 누누`; text existed in DOM but was cut off visually.
- Root cause: mobile completed-order layout first kept the three-creature roster, then still squeezed title/reward/payoff text into an overflow-hidden lunar complete row. DOM text presence and broad `scrollHeight/clientHeight` checks were not enough.
- Fix: collapse nonessential completed-state content, remove the dense `+88 잎...` reward line from the visible complete row, make the lunar complete row overflow-visible, and require a regression test that checks row overflow style, title/payoff bounds, hidden reward-line display, and visible child overflow.

## Evidence

- Browser Use `iab` current tab: `http://127.0.0.1:5173/?qaLunarOrderReady=1&qaFxTelemetry=1`
- Post-harvest lunar order state: `reports/visual/lunar-guardian-order-bridge-browser-use-post-harvest-20260502.png`
- Delivery state before clipping fix: `reports/visual/lunar-guardian-order-current-delivered-browser-use-20260502.png`
- Delivery state after clipping fix: `reports/visual/lunar-guardian-order-delivered-no-clipping-browser-use-20260502.png`
- User-reported second clipping reproduction: `reports/visual/lunar-guardian-user-defect-delivered-browser-use-20260502.png`
- Final Browser Use fixed state: `reports/visual/lunar-guardian-order-fixed-browser-use-20260502.png`
- Issue/PR title retrospective: `reports/operations/seed-ops-issue-pr-title-retrospective-20260502.md`

## Verification Plan

- `npm run check:content` - pass
- `npm run check:loop` - pass
- `npm run build` - pass
- `npm run check:visual -- --grep "달빛 보호"` - pass after second clipping fix
- `npm run check:visual -- --grep "달빛"` - pass, 7 tests
- `npm run check:asset-provenance` - pass
- `npm run check:asset-style` - pass
- `npm run check:asset-alpha` - pass
- `npm run check:seed-ops-queue` - pass
- `npm run check:ci` - pass after heartbeat branch/next_action refresh

## Risks

- Scope can grow into a full lunar order system. Keep this to one bridge order and one visible payoff.
- Asset generation may be blocked by key/model access. Record blocker and use Codex native image generation fallback only with raster PNG workspace files and provenance.
- The mobile action surface is already dense. Prefer one compact order state over adding another persistent panel.
