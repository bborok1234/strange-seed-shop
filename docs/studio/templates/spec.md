# Spec — <Axis Title>

- Axis slug: `<slug>`
- Brief: `reports/deliberation/<slug>/brief.md`
- Director: <name or session id>
- Date: <YYYY-MM-DD>
- Status: draft / approved / superseded

> Template instructions (delete before publishing): every section below is required. If a section is empty, the deliberation is incomplete. Replace placeholder text in `<angle brackets>`.

## Vision

One paragraph. After this axis ships, what does a player notice about the game that they did not notice before? Write in present tense as if the change is already live. No "we will" — only "the player sees / the screen does / the system enforces".

## Layout Skeleton

For each viewport (mobile ≤ 480px, tablet 481–1024px, desktop ≥ 1025px) describe the grid: column count, row pattern, gutter, breakpoints. Name regions (e.g., `nav`, `garden-canvas`, `side-dock`, `hud-bar`). If the axis does not change layout, state that explicitly and explain why.

| Viewport | Grid | Regions |
|---|---|---|
| Mobile | <e.g., single col, fluid> | <nav-bottom, content-stack, hud-top> |
| Tablet | <e.g., 2 col 60/40> | <...> |
| Desktop | <e.g., 12 col, 2 sticky cols + 1 fluid> | <...> |

## Design Tokens

List the named tokens this axis introduces or modifies. NEVER raw hex / px in the spec — token names only. Owner: Art Director.

| Token | Type | Value | Used by |
|---|---|---|---|
| `color.surface.warm` | color | `#…` | side-dock, garden-panel |
| `spacing.lg` | spacing | `24px` | section gutters |
| `motion.snap.in` | motion | `180ms ease-out` | reveal cards |

If the axis does not introduce tokens, state explicitly that all token usage is inherited.

## Component Composition

Existing components: which stay, which move (with target region), which are replaced or removed. New components: name + 1-line responsibility. Owner: Designer + Art Director jointly.

| Component | Status | Notes |
|---|---|---|
| `BottomTabs` | move → mobile only | hidden on desktop, replaced by `SideNav` |
| `GardenStage` | resize → desktop fills 8/12 cols | mobile unchanged |
| `SideDock` | new | resource HUD + next-action chip + active expedition strip |

## Acceptance Criteria

Concrete, testable, verifiable. Each criterion must be evaluable by reading the rendered UI or running a script. No "feels better" / "improved" without a metric.

- [ ] Desktop viewport (≥ 1280px) shows `garden-canvas` ≥ 60% of viewport width.
- [ ] No region is empty negative space larger than `spacing.3xl` x `spacing.3xl` on desktop without a documented reason in this spec.
- [ ] `npm run build` passes.
- [ ] All design tokens introduced are referenced ≥ 1 time in `src/styles.css`.
- [ ] Mobile layout (≤ 480px) renders without horizontal scroll.
- [ ] `npm run check:ci` passes.

## Risks

| Risk | Severity | Mitigation |
|---|---|---|
| <e.g., desktop layout breaks Phaser scene resize> | high | <add resize listener in GardenScene.create> |

## Implementation Sequence

PR-by-PR breakdown. Each PR small enough to review in < 30 min. Owner: Engineer.

1. **PR <n>** — design tokens extraction. Files: `src/styles.css` → `src/styles/tokens.css`.
2. **PR <n+1>** — layout skeleton with empty regions. No content moved yet.
3. **PR <n+2>** — `BottomTabs` → `SideNav` adapter for desktop, mobile unchanged.
4. ...

## Decisions Resolved

This section is **mandatory** and MUST contain at least 2 substantive disagreements that surfaced in Phase 3 critique. If empty, the deliberation is incomplete.

### Decision 1 — <topic>
- **Disagreement:** <Designer wanted X for verb-first; Art Director wanted Y for visual hierarchy>
- **Resolution:** <Y, with concession Z>
- **Reasoning:** <reference to brief constraint, persona principle, or trade-off>
- **Loser's concession:** <what does the disagreeing party get? Often a follow-up axis or a token override option>

### Decision 2 — <topic>
- ...

## Open Questions

Things deliberately deferred. Each must have a trigger that says when to revisit (after another axis, after data, after user input, etc.).

- <Question> — defer until <trigger>.

## References

- Brief: `reports/deliberation/<slug>/brief.md`
- Proposals: `reports/deliberation/<slug>/proposals/{designer,art-director,engineer}.md`
- Critiques: `reports/deliberation/<slug>/critique-{designer,art-director,engineer,senior-critic,director}.md`
- Memory entries consulted: <list>
- Related code: <file paths>

## Changelog

- <YYYY-MM-DD>: initial draft from deliberation.
- <YYYY-MM-DD>: user review feedback applied.
