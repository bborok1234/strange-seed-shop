---
name: studio-deliberate
description: Run Codex-native 이상한 씨앗상회 studio deliberation for a non-trivial game/UI/HUD/asset/operator axis. Use when the user invokes `$studio-deliberate axis-slug`, asks Codex to port or run Claude Code `/studio-deliberate`, requests five-role Designer/Art Director/Engineer/Senior Critic deliberation, or when Studio Harness v3/Ralph foreground loops need a repo-native deliberation pass before implementation.
---

# Studio Deliberate — Codex Adapter

## Overview

Run the repo-native studio deliberation workflow from Codex without copying persona or workflow source of truth into tool-state directories. This skill is a thin adapter around `docs/studio/DELIBERATION_WORKFLOW.md`, `docs/studio/personas/*.md`, and `reports/deliberation/<axis-slug>/`.

## Hard Rules

- Read the canonical docs at runtime. Do not inline-copy persona bodies, spec templates, or game studio decisions into this skill.
- Keep all deliberation artifacts in `reports/deliberation/<axis-slug>/`; never write source-of-truth decisions to `.claude/`, `.omc/`, `.omx/`, or plugin cache.
- Use Codex native subagents only when the user or operator prompt explicitly requested deliberation, parallel agent work, or Studio/Ralph autonomous operation.
- Do not modify game/product code during Phase 2 or Phase 3.
- Do not treat prompt-side `$ralph` as a live long runner. Long-run claims require `studio:v3:operate` state, heartbeat, watchdog/runner artifacts, or an attached OMX runner.

## Required Inputs

- `axis-slug`: kebab-case slug, for example `garden-respecting-hud-assets`.
- `reports/deliberation/<axis-slug>/brief.md`: create it first if missing.
- Canonical files:
  - `docs/studio/DELIBERATION_WORKFLOW.md`
  - `docs/studio/USER_PREFERENCES.md`
  - `docs/studio/personas/director.md`
  - `docs/studio/personas/designer.md`
  - `docs/studio/personas/art-director.md`
  - `docs/studio/personas/engineer.md`
  - `docs/studio/personas/senior-critic.md`
  - `docs/studio/templates/spec.md`

Reject the run if a required source file is missing. Do not synthesize fallback persona text.

## Workflow

1. Validate `axis-slug` and required files.
2. Create `reports/deliberation/<axis-slug>/proposals/`.
3. Write a heartbeat with `actor=codex-studio-deliberate`, `phase=deliberation-phase-2-spawn`, and the axis.
4. Phase 2: spawn three independent Codex subagents in parallel:
   - Designer writes `proposals/designer.md`.
   - Art Director writes `proposals/art-director.md`.
   - Engineer writes `proposals/engineer.md`.
   Senior Critic does not write a proposal.
5. Phase 3: after all proposals exist, spawn four critique subagents in parallel:
   - Designer writes `critique-designer.md`.
   - Art Director writes `critique-art-director.md`.
   - Engineer writes `critique-engineer.md`.
   - Senior Critic writes `critique-senior-critic.md`.
6. Phase 4: the main Codex thread acts as Director. Read `director.md`, the brief, all proposals, all critiques, and `docs/studio/templates/spec.md`; then write `reports/deliberation/<axis-slug>/spec.md`.
7. Phase 5: record user review. In foreground Ralph/Studio autonomous mode, a repo-native standing delegation entry or direct user message may satisfy this gate only when `docs/studio/DELIBERATION_WORKFLOW.md` and `docs/studio/USER_PREFERENCES.md` allow it for the current axis.
8. Phase 6: write `reports/deliberation/<axis-slug>/retrospective.md` before starting another axis.
9. Write a closing heartbeat with `phase=deliberation-complete` or `phase=deliberation-awaiting-review`.

## Subagent Prompt Contract

Each subagent prompt must point to files, not paste persona content. The prompt must include:

- persona file path
- brief path
- workflow path
- output path
- "read relevant code/assets, but do not modify anything"
- "write in Korean"
- a four-sentence maximum return summary

For critique agents, include all Phase 2 proposal paths and forbid editing proposals. Senior Critic receives no own proposal path.

## Ralph / Studio Loop Use

When invoked from `npm run studio:v3:operate` or another explicit autonomous Studio/Ralph prompt:

- Treat issue/PR/merge/report as checkpoints, not final stopping points.
- If the selected axis has no brief, create the brief from `docs/studio/HANDOFF.md`, `docs/studio/USER_PREFERENCES.md`, and the current user decision.
- If standing delegation exists for the axis, record it in `reports/deliberation/<axis-slug>/user-review.md` and continue to implementation planning after spec synthesis.
- If no standing delegation exists, do not ask in `final`; write heartbeat/report state and continue safe local work such as evidence packaging, checker hardening, or next-axis brief preparation.
- Never claim "Cycle complete" for visible gameplay without the approval evidence required by current user preferences.

## Verification

After editing this skill or the Studio loop, run:

```bash
python3 /Users/mirlim/.codex/skills/.system/skill-creator/scripts/quick_validate.py .codex/skills/studio-deliberate
npm run check:studio-deliberation-ralph-loop
```
