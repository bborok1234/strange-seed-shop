# Issue #448 Visual Report - Momo carrier and order crate motion

## Scope

- WorkUnit: `items/0240-momo-carrier-order-motion.md`
- Route: `game-studio:game-studio` -> `game-studio:phaser-2d-game` -> `game-studio:sprite-pipeline` -> `game-studio:game-playtest`
- Target flow: fresh start -> plant -> care to ready -> harvest Pori -> claim workbench -> Momo carrier appears and order crate progresses.

## Browser Use

Browser Use `iab` was attempted through tool discovery for this Codex CLI session. The tool palette exposed `mcp__node_repl__` and `mcp__computer_use__`, but not `browser-use:browser` / `iab`, so hands-on in-app Browser Use QA is blocked in this session.

Fallback used: `npm run check:phaser`, which builds the Phaser app, runs a scripted Playwright smoke flow at `393x852`, records screenshots, and checks deterministic runtime state.

## Evidence

- `npm run check:phaser`: pass
- Runtime state after workbench claim:
  - leaves: `20`
  - starter seeds: `0`
  - actors: `actor_pori`, `actor_momo`
  - order crate progress: `25`
  - loaded topology assets include Pori, Momo, care FX, harvest FX, plot/facility PNGs.
- Screenshot sequence:
  - `reports/visual/issue-0448-momo-carrier-order-motion/phaser-check-fresh-start-393.png`
  - `reports/visual/issue-0448-momo-carrier-order-motion/phaser-check-after-plant-393.png`
  - `reports/visual/issue-0448-momo-carrier-order-motion/phaser-check-ready-393.png`
  - `reports/visual/issue-0448-momo-carrier-order-motion/phaser-check-after-harvest-393.png`
  - `reports/visual/issue-0448-momo-carrier-order-motion/phaser-check-workbench-claim-393.png`

## Findings

- Pori remains bound to the caretaker strip after harvest.
- First workbench claim adds Momo as a distinct carrier actor bound to `actor_momo_carrier_strip_v1`.
- Momo travels along the workbench -> order crate task path using the generated strip animation.
- The order crate switches from empty visual state to progress feedback, and the deterministic state exposes `orderCrateProgress: 25`.
- No body scroll regression: body and document height remain `852` at `393x852`, with one Phaser canvas.

## Remaining Risk

Browser Use hands-on interaction is still blocked by unavailable `iab` tooling in this session. The next visible gameplay WorkUnit must retry Browser Use before accepting Playwright fallback.
