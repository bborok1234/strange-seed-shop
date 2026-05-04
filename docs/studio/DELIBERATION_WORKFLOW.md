# Game Studio Deliberation Workflow

**Status:** v0 (pilot) — to be revised after Phase (b) retrospective.

This document is the **harness-neutral source of truth** for how the studio reaches a decision before any code is written. Any tool (Claude Code skill, Codex tool, future runtime, or a human running a session manually) MUST read this doc and the persona files to execute the workflow. The workflow does not depend on `.claude/`, `.omc/`, `.omx/`, or any plugin specifics.

## Purpose

Replace the "single operator picks a slice and ships it" pipeline with a **5-role parallel deliberation** that surfaces disagreements, forces explicit trade-offs, and produces a Director-synthesized spec before implementation begins.

## Roles

Canonical persona files in `docs/studio/personas/`:

| Role | File | One-line |
|---|---|---|
| Director | `director.md` | Final decision-maker, synthesizes spec, owns "Decisions Resolved" |
| Designer (게임 기획) | `designer.md` | Player verb, session, loop, journey |
| Art Director | `art-director.md` | Visual hierarchy, layout grid, design tokens, motion vocabulary |
| Engineer | `engineer.md` | Technical constraints, performance budget, save migration, PR decomposition |
| Senior Critic | `senior-critic.md` | Devil's advocate, surfaces hidden assumptions, blocks premature consensus |

A workflow run MUST include all 5 roles. Skipping a role invalidates the deliberation.

## Phases (artifact-driven)

Each phase has named input artifacts and named output artifacts. A phase is complete when its outputs exist on disk.

```
Phase 1: Brief
   ↓
Phase 2: Parallel Proposals (4 specialists in parallel — Senior Critic does NOT write a proposal)
   ↓
Phase 3: Cross-Critique Round (all 5 in parallel — Senior Critic writes critique only)
   ↓
Phase 4: Director Synthesis
   ↓
Phase 5: User Review Gate
   ↓
Phase 6: Retrospective
```

### Phase 1 — Brief

- **Owner:** Director (or human kicking off the axis).
- **Input:** the axis description (1-3 sentences from user or owner).
- **Output:** `reports/deliberation/<axis-slug>/brief.md`. Required sections:
  - **Axis** — what is being decided.
  - **Current State** — concrete observations (file paths, screenshots, metrics) of where we are.
  - **Why This Axis Now** — the motivation; what unblocks if we resolve this.
  - **Constraints** — technical, schedule, scope boundaries that are non-negotiable.
  - **Out of Scope** — explicitly named adjacent things this axis does NOT touch.
  - **Reference Artifacts** — links to memory files, prior plans, related code paths.

### Phase 2 — Parallel Proposals

- **Owner:** all specialists (Designer, Art Director, Engineer) execute in parallel. Senior Critic SKIPS this phase by design.
- **Input:** brief.md + the agent's own persona file content (inlined into the prompt).
- **Output (per persona):** `reports/deliberation/<axis-slug>/proposals/<persona>.md`. Required sections per persona file's hand-off contract.
- **Rule:** specialists do NOT see each other's drafts in this phase. Independence is the point.
- **Spawn pattern (harness-neutral):** for each specialist, instantiate an agent with the inlined persona prompt + brief content + clear output path instruction. In Claude Code today this means parallel `Agent` calls with `subagent_type: general-purpose`. In Codex this means parallel sub-process invocations. The contract — inputs, output paths, persona prompt — is identical across harnesses.

### Phase 3 — Cross-Critique Round

- **Owner:** all 5 roles (including Senior Critic for the first time, and the 3 specialists re-engaging to critique others).
- **Input:** brief.md + own persona file + ALL OTHER persona proposals from Phase 2.
- **Output (per persona):** `reports/deliberation/<axis-slug>/critique-<persona>.md`. Required sections:
  - **My disagreements with each other proposal** — at least one substantive disagreement per other proposal, or an explicit "I have no disagreement" with reasoning.
  - **Self-critique of my own proposal** — at least one weakness only the author can see (Senior Critic critiques a hidden assumption they failed to surface in Phase 2 instead).
  - **Cross-cutting risks** — risks visible only by reading multiple proposals together.
- **Rule:** Senior Critic's critique is the only one without a paired proposal. Their voice MUST appear here.

### Phase 4 — Director Synthesis

- **Owner:** Director (in pilot Phase (b), this is the main thread; later may be a separate agent).
- **Input:** brief.md + all 4 proposals + all 5 critiques + persona files (especially `director.md` for tie-breaking rules) + relevant memory entries.
- **Output:** `reports/deliberation/<axis-slug>/spec.md` using the template at `docs/studio/templates/spec.md`. The "Decisions Resolved" section is mandatory and MUST contain at least 2 substantive disagreements with explicit resolution + reasoning. If fewer than 2 are recorded, the deliberation is incomplete — return to Phase 3 and re-prompt for sharper critique.

### Phase 5 — User Review Gate

- **Owner:** user.
- **Input:** spec.md.
- **Output:** approval / change request / rejection. If change request: incorporate feedback into spec.md and (if needed) re-run Phase 3 + Phase 4. If rejection: workflow ends and a new brief must be written.
- **Rule:** code is NOT written before this gate clears. Implementation happens in a separate workflow / plan / PR cycle.

### Phase 6 — Retrospective

- **Owner:** Director (or owner of the workflow tooling).
- **Input:** all artifacts from Phases 1-5 + observation of how the deliberation actually went.
- **Output:** `reports/deliberation/<axis-slug>/retrospective.md`. Required sections:
  - **What worked** — phases / persona instructions that produced load-bearing signal.
  - **What was redundant** — sections / steps that no one used.
  - **Persona signal ranking** — which persona's proposal/critique most influenced the spec, which least.
  - **Director synthesis difficulty** — what was hard to resolve, what tools would help next time.
  - **Suggested workflow / persona edits** — concrete edits to apply BEFORE next axis (or to defer until after N more axes).
- **Rule:** retrospective MUST be written before the next axis starts running through the workflow.

## Exit Criteria

A deliberation is complete when:
1. All 6 phases have their named output artifacts on disk.
2. spec.md "Decisions Resolved" has ≥ 2 entries.
3. User has explicitly approved (Phase 5).
4. retrospective.md exists.

A deliberation is INCOMPLETE if any of these are missing — even if the spec "looks done." Do not proceed to implementation.

## What This Workflow REFUSES

- Single-perspective spec — if only one persona's voice ended up in spec.md, the deliberation didn't happen.
- Averaging — "we'll do a bit of both" is not a decision. Director must pick or explicitly defer with a named tie-breaker.
- Skipping Senior Critic — premature consensus is the failure mode this workflow exists to prevent.
- Inline implementation during deliberation — code edits in `src/` while specialist agents are running invalidate the round.
- Tool-state pollution — workflow MUST NOT write specs / personas / decisions into `.omc/`, `.omx/`, `.claude/`, or plugin caches. Adapter shims that POINT at canonical files are fine; duplication is not.
- Skipping the user review gate — autonomous implementation from spec.md without user approval is forbidden in pilot Phase (b). May be relaxed only after Phase (c) defines automation policy.

## Adapter Pattern (for tooling)

A wrapper (Claude Code skill, Codex tool, shell script) implementing this workflow MUST:
1. Read this document and the persona files at runtime — do not embed.
2. Treat `reports/deliberation/<axis-slug>/` as the source of truth for the run.
3. Stop at Phase 5 (user review gate) and return artifact paths to the caller. Director synthesis (Phase 4) MAY be in the wrapper or in the calling main thread — both are valid as long as the synthesis writes spec.md correctly.
4. Never write game studio decisions into tool-state directories. Heartbeats, run logs, token usage are tool state — those may live in `.omc/` etc.

## Open Questions (resolve in Phase (c) or earlier)

- How does an axis re-enter deliberation if implementation reveals the spec was wrong? (probably: write a new brief referencing the original spec and run a fresh deliberation.)
- Should specialists be allowed to consult each other mid-Phase 2 (paired conversations)? Currently forbidden for independence.
- When a critique is unanswerable in Phase 3, does the spec automatically defer that decision to Open Questions, or does the workflow loop back?
- Do we need a Producer / PM persona for schedule / scope tracking? Currently absorbed into Director — revisit after 3+ axes.
