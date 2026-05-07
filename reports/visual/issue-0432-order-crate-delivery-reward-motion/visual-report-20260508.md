# Issue #432 Visual Report - Order crate delivery reward motion

## Scope

- WorkUnit: `items/0241-order-crate-delivery-reward-motion.md`
- Route: `game-studio:game-studio` -> `game-studio:phaser-2d-game` -> `game-studio:game-ui-frontend` -> `game-studio:game-playtest`
- Target flow: fresh start -> plant -> care to ready -> harvest Pori -> claim workbench 4 times -> order crate ready -> delivery claim.

## Browser Use

Browser Use `iab` is not exposed in this Codex CLI session. The current available tool palette exposes shell, Node REPL, and Computer Use surfaces, so hands-on in-app Browser Use QA is blocked for this issue.

Fallback used: `npm run check:phaser`, which builds the Phaser app, runs a scripted Playwright smoke flow at `393x852`, records screenshots, and checks deterministic runtime state.

## Evidence

- `npm run check:phaser`: pass
- Runtime state after delivery claim:
  - leaves: `74`
  - starter seeds: `0`
  - actors: `actor_pori`, `actor_momo`
  - completed deliveries: `1`
  - order crate progress reset: `0`
  - loaded topology assets include terrain, plot states, workbench, order crate empty/filled, Pori, Momo, care FX, harvest/reward FX.
- Screenshot sequence:
  - `reports/visual/issue-0432-order-crate-delivery-reward-motion/phaser-check-fresh-start-393.png`
  - `reports/visual/issue-0432-order-crate-delivery-reward-motion/phaser-check-after-plant-393.png`
  - `reports/visual/issue-0432-order-crate-delivery-reward-motion/phaser-check-ready-393.png`
  - `reports/visual/issue-0432-order-crate-delivery-reward-motion/phaser-check-after-harvest-393.png`
  - `reports/visual/issue-0432-order-crate-delivery-reward-motion/phaser-check-workbench-claim-393.png`
  - `reports/visual/issue-0432-order-crate-delivery-reward-motion/phaser-check-crate-ready-393.png`
  - `reports/visual/issue-0432-order-crate-delivery-reward-motion/phaser-check-delivery-claim-393.png`

## Findings

- Four workbench claims fill the order crate to delivery-ready state.
- Selecting the filled order crate exposes the `납품` action.
- Delivery claim grants `잎 +30`, increments completed delivery state, resets crate progress to `0`, and leaves the next crate affordance as `다음 상자 준비`.
- The reward burst reuses the generated harvest leaf FX strip as a crate-local delivery reward motion; no runtime image generation/API/cache path is introduced.
- No body scroll regression: body and document height remain `852` at `393x852`, with one Phaser canvas.

## Remaining Risk

Browser Use hands-on interaction remains blocked in this Codex CLI session. Repeat order chain, long-term economy balance, and new dedicated delivery FX asset generation are deferred to follow-up WorkUnits.
