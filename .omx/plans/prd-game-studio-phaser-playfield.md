# PRD: Phaser Garden Playfield Runtime Spike

Status: approved-for-execution
Owner: ship-game-studio-phaser-playfi / worker-1
Created: 2026-04-27
Scope-risk: moderate

## 1. Intent

Phase 0 already proves the idle/clicker economy loop, but the Garden still reads like a dashboard because the central surface is DOM cards rather than a tactile playfield. This PRD defines the smallest Phaser-backed Garden playfield that can make planting, tapping, and harvesting feel like game actions while preserving the existing React-owned save/content/analytics architecture.

The work is a runtime integration spike, not a full art or systems rewrite.

## 2. Product Goal

Create a central Garden playfield where the player can understand and feel this loop in one viewport:

1. choose starter seed,
2. watch a planted plot become active,
3. tap the plot for visible growth feedback,
4. harvest a ready creature,
5. claim the album reward or unlock the second plot from the existing React HUD.

Success means the first-session loop remains mechanically unchanged but gains an unmistakable game-like center surface.

## 3. Non-Goals

- Do not change save schema, content JSON schema, analytics event names, or Phase 0 economy numbers.
- Do not move persistence, content loading, analytics, missions, or economy mutation into Phaser.
- Do not add checkout, login/account, ads SDK, external navigation, or runtime image generation.
- Do not replace the DOM HUD, bottom tabs, shop surfaces, album, expedition, or mission panels.
- Do not require final production sprite sheets before the integration boundary is proven.

## 4. Target Player Experience

The player lands in the greenhouse and sees a cozy central garden scene rather than only cards. The scene should clearly answer:

- Which plot is empty, growing, ready, or locked?
- What happens when I tap the active seed?
- Is the harvest ready and rewarding?
- Where is my next DOM-driven action after the canvas interaction?

On a 360x800 mobile viewport, the central playfield, current CTA, and bottom tabs must remain visible without requiring a confusing first scroll.

## 5. Architecture Requirements

### 5.1 React Ownership

React remains the source of truth for:

- `PlayerSave` loading/saving and all mutations,
- typed content tables,
- mission progression,
- analytics calls,
- HUD/CTA rendering,
- tab navigation and non-Garden surfaces.

### 5.2 Phaser Ownership

Phaser owns only Garden scene presentation:

- canvas lifecycle,
- plot layout and sprites/shapes,
- growth/ready/tap/harvest visual feedback,
- lightweight tweens/particles/readability effects,
- pointer hit targets that emit typed actions.

### 5.3 Boundary Contract

Implement a single React-to-Phaser host boundary:

- `GardenPlayfieldHost` mounts and destroys the Phaser game instance.
- `GardenScene` receives a serializable Garden view model.
- Phaser emits typed actions only, such as:
  - `tap_growth` with `plotIndex`,
  - `harvest_plot` with `plotIndex`,
  - optional `select_plot` with `plotIndex` for future UI hints.
- React action handlers decide whether an action is valid and perform existing save/content/analytics mutations.

Phaser must never import persistence, analytics, or content JSON directly and must never mutate `PlayerSave`.

## 6. View Model Requirements

Add a renderer-facing Garden view model that contains only the data needed by the scene:

- plot index and locked/empty/growing/ready state,
- selected seed family and display label when planted,
- growth progress percentage,
- seconds remaining or ready flag,
- harvested/discovered hint where needed,
- viewport-safe labels for current state.

The view model should be derived from `PlayerSave`, content definitions, and `now` in React/TypeScript code outside Phaser scene mutation.

## 7. Visual and Interaction Requirements

### Required States

The first shipped spike must show at least these states in the Phaser scene:

- empty starter plot,
- growing planted seed,
- tap response feedback,
- harvest-ready feedback.

### Required Interactions

- Tapping a growing plot emits `tap_growth`.
- Tapping/clicking a ready plot emits `harvest_plot`.
- Locked or invalid plots may animate as unavailable but must not mutate state.

### Presentation Guidance

Use existing asset manifest paths if available and safe. If final sprite strips are unavailable, use polished Phaser vector primitives, simple sprite placeholders, particles, and labels so the runtime boundary can ship without blocking on art.

## 8. Dependency Decision

Preferred dependency: `phaser@4.0.0` if install, TypeScript build, and minimal mount all pass in this Vite/React stack.

Fallback: if Phaser 4 fails the install/build/minimal mount gate, document the blocker and use `phaser@3.90.0` with the same host/scene/action boundary.

No other new dependency is approved by this PRD.

## 9. Asset Pipeline Follow-Up

If asset source files are edited, restrict changes to `assets/source/asset_plan.json` and/or `assets/source/asset_prompts.json` and prioritize a growth-tactility sprite batch:

- seed idle,
- tap pulse,
- sprout/grow strip,
- harvest-ready creature strip,
- harvest sparkle,
- leaf reward pop.

Runtime code must not depend on newly generated assets being complete.

## 10. Acceptance Criteria

- A Phaser-backed central Garden playfield is mounted from React.
- React remains save/content/analytics/HUD owner.
- Phaser emits typed actions and never mutates save directly.
- The first starter-seed loop still works: starter seed -> plant -> tap growth -> harvest -> album reward -> unlock second plot.
- At least two growth-tactility states are visible in canvas, with ready/tap feedback preferred.
- Existing save schema, content JSON schema, analytics event names, and economy numbers are unchanged.
- 360x800 Garden viewport keeps playfield, current CTA, and bottom tabs accessible.
- `npm run check:all` passes, or failures are documented with root cause and follow-up.
- Browser QA evidence is saved under `reports/visual/` when the integrated runtime is available.

## 11. Verification Plan

- `npm run check:all`.
- Import-boundary check showing `src/game/playfield/**` does not import persistence or analytics modules.
- Browser QA with `qaReset=1` through first-session loop.
- Capture 360x800 and desktop visual evidence under `reports/visual/` where possible.
- Confirm shop mock surfaces still only emit existing mock intent analytics and do not navigate externally.

## 12. Risks and Mitigations

- **Phaser 4 compatibility risk:** gate with minimal install/build/mount; fallback to Phaser 3.90.0 if needed.
- **State ownership drift:** enforce typed action boundary and React-derived view model.
- **Mobile viewport crowding:** keep HUD DOM concise and canvas central, with bottom tabs preserved.
- **Art readiness risk:** ship runtime with readable primitives/placeholders while asset prompts progress separately.
