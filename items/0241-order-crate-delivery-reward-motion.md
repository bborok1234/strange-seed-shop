# 0241 Order crate delivery reward motion

## Problem

#448 made Momo carry leaves from the workbench to the order crate, but the crate still stops at progression. v1 needs the next player verb: when the order crate reaches 100%, the player should deliver it and see reward motion/state change instead of reading another receipt-only milestone.

## Goal

Connect order crate 100% state to a delivery claim action, reward feedback, and deterministic Phaser smoke evidence.

## Game Studio Route

- `game-studio:game-studio`: #448 이후 production chain payoff WorkUnit 선택
- `game-studio:phaser-2d-game`: facility action state, delivery claim transition, Phaser smoke path
- `game-studio:game-ui-frontend`: action rail density and order crate affordance
- `game-studio:game-playtest`: crate 100% -> delivery claim -> reward screenshot evidence

## Reference Teardown

- Idle Miner / Egg, Inc. style production loops make the shipping moment explicit: storage/vehicle/order state reaches capacity, then reward feedback confirms the loop.
- Current Phaser v1 state has plant/care/harvest, worker carry, and crate progress, but no visible “contract completed” moment.
- Rejected alternative: defer delivery until economy balance. Reason: without a claim/reward moment, the first production chain still feels like a progress bar with no payoff.

## Creative Brief

The order crate should feel like a small shop shipment: filled crate, short reward burst, receipt, and the next expansion objective. Keep the persistent HUD quiet; use the claim moment for motion.

## Department Scorecard

| 부서 | 판정 | 근거 artifact |
| --- | --- | --- |
| 기획팀 | approve | Player verb becomes `주문 상자 납품`, closing the first production chain. |
| 리서치팀 | approve | Idle/tycoon references reward completed storage/order states with an explicit claim. |
| 아트팀 | approve | Uses generated crate filled/empty PNGs and generated harvest leaf FX strip as reward motion; no code-native accepted asset is introduced. |
| 개발팀 | approve | Adds one facility claim transition and one smoke branch; no persistence migration or external API. |
| 검수팀 | approve | `check:phaser` will verify 4 workbench claims, delivery action, crate reset/reward state, screenshot evidence. |
| 마케팅팀 | approve | No real commerce; player-facing promise stays in-game/mock. |
| 고객지원팀 | approve | A delivery action explains why Momo/order crate matter and what the player does next. |

## Role Debate

N/A. No department is `revise` or `block`.

## Subagent/Team Routing

Solo execute. The slice is small and tightly coupled across Phaser state, action rail, and the existing smoke script; parallel subagents would add coordination cost without a separate ownership boundary.

## Self-Evaluation Loop

Claim: order crate delivery completes the first production chain without breaking existing plant/care/harvest/workbench flow.

Smallest verifier:

- workbench can be claimed until order crate reaches `100`
- order crate exposes a delivery action at `100`
- delivery grants reward leaves, resets order crate progress, and leaves a receipt/objective
- `npm run check:phaser`
- screenshot after delivery shows reward state/FX path

Stop condition: local `check:phaser` and `check:ci` pass, PR checks pass, merge/main CI observed.

## Plan

1. GitHub issue #432 body를 최신 Phaser v1 기준으로 갱신한다.
2. `claimOrderCrateDelivery` state transition을 추가한다.
3. Phaser action rail에 order crate delivery action을 추가한다.
4. Delivery reward FX/screenshot state를 `check-phaser-foundation`에 추가한다.
5. visual report, roadmap, control room, heartbeat를 갱신하고 PR로 검증한다.

## Acceptance Criteria

- Order crate reaches 100% after repeated workbench claims.
- Selecting order crate at 100% exposes a delivery claim action.
- Delivery grants an in-game reward and resets or advances crate state visibly.
- Reward motion uses existing generated raster FX/asset provenance; runtime image generation remains disabled.
- `npm run check:phaser` and `npm run check:ci` pass.

## Verification Commands

- `npm run check:phaser`
- `npm run check:ci`

## Browser Use

Browser Use `iab`가 노출되면 order crate 100% -> delivery claim을 직접 확인한다. 노출되지 않으면 현재 세션 blocker와 Playwright fallback screenshot evidence를 남긴다.

## GitHub

- Issue: https://github.com/bborok1234/strange-seed-shop/issues/432
- Draft PR: https://github.com/bborok1234/strange-seed-shop/pull/450

## Evidence

- `npm run check:phaser` pass
- `npm run check:ci` pass
- Visual report: `reports/visual/issue-0432-order-crate-delivery-reward-motion/visual-report-20260508.md`
- Screenshots:
  - `reports/visual/issue-0432-order-crate-delivery-reward-motion/phaser-check-crate-ready-393.png`
  - `reports/visual/issue-0432-order-crate-delivery-reward-motion/phaser-check-delivery-claim-393.png`
- Runtime evidence after delivery:
  - leaves: `74`
  - order crate progress: `0`
  - completed deliveries: `1`
  - receipt includes `주문 상자 납품`
  - action rail shows `다음 상자 준비`
- Browser Use `iab` is not exposed in this Codex CLI session; Playwright fallback evidence is recorded in the visual report.
