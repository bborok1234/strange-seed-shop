# Retrospective — garden-respecting-hud-assets deliberation

- Axis slug: `garden-respecting-hud-assets`
- Date: 2026-05-05
- Workflow: Codex `$studio-deliberate`

## What worked

Phase 2 independence produced real disagreement. Designer chose player-verb plot-first, Art Director widened the visual vocabulary, and Engineer grounded the PR/cost/checker boundaries without reducing the axis to CSS polish.

Senior Critic was load-bearing. The strongest synthesis decisions came from Critic demands: choose one first application moment, define the relationship between PNG overlay and DOM rectangle removal, and record the existing manifest category mismatch instead of ignoring it.

The brief boundary prevented scope drift. No proposal tried to add new creature roster, economy changes, payments, or runtime image generation.

## What was redundant

Some viewport token detail in Art Director's Phase 2 proposal was too wide for this axis. It helped name the visual system but did not need to enter the first implementation cycle.

The proposals repeated asset provenance constraints several times. Future prompts can point to the brief and ask each role to focus on their unique disagreement rather than restating hard rules.

## Persona signal ranking

| Rank | Persona | Reason |
|---|---|---|
| 1 | Senior Critic | Forced the Director to pick plot-first and avoid average decisions |
| 2 | Designer | Kept the axis tied to first 30 seconds / first 5 minutes player verbs |
| 3 | Engineer | Prevented schema, save, Phaser, and category migration from entering the first cycle |
| 4 | Art Director | Defined the contour/token/motion language, but initial scope was wider than the first vertical slice |

## Director synthesis difficulty

The hardest decision was rejecting the broader HUD vocabulary for the first cycle. `resource holder`, `next-action sign`, `vine divider`, and `rail marker` all fit the art direction, but choosing all of them would repeat the prior polish pattern. Plot-first is narrower and easier to prove.

The second hard decision was `ui_frame` vs `ui_decal`. The visual taxonomy wants a new category, but first implementation needs screen payoff, so taxonomy stays in tags/notes until a separate schema cleanup is justified.

## Suggested workflow / persona edits

- Add a prompt reminder for Senior Critic to identify “one first screen moment” whenever an axis risks becoming a broad vocabulary pass.
- Ask Engineer to list exact existing npm script names when verification commands matter.
- Ask Art Director to mark first-cycle assets vs future vocabulary separately.
- Keep standing delegation review as a separate `user-review.md`; do not fold it into `spec.md`.
