# Plan 0001 — Game Studio Deliberation Workflow Bootstrap

- Status: draft (awaiting user approval)
- Author: studio kickoff session 2026-05-04
- Trajectory: (b) manual critique pilot → (a) reusable invocation skill → (c) permanent persona system

## Context

22 `studio-operate` passes shipped 21 micro-polish PRs (receipts, indicators, motions) while desktop UI/UX layout was never picked as an axis. Root cause: single-operator linear pipeline with no cross-team critique forcing-function. The user wants a **real game studio structure** — Designer / Art Director / Engineer / Senior Critic propose & critique in parallel, Director synthesizes a final spec before code is written.

This plan bootstraps that structure as **harness-neutral repo assets** (docs + reports), then layers wrappers (Claude Code skill, future Codex tool, etc.) on top.

## Requirements Summary

1. Spin up Phase (b) by running ONE manual deliberation round on the desktop UI redesign axis. 4 specialist personas spawned in parallel as `general-purpose` agents with inline persona prompts. Main thread = Director. Output: `reports/deliberation/desktop-ui-redesign/spec.md` only (no spike, no implementation in this phase).
2. Capture lessons from (b) and codify into a reusable skill `/studio-deliberate` (Phase a) that thinly wraps the canonical persona files + workflow doc — never duplicating the source of truth into tool-specific state.
3. After (a) is exercised on 3+ different axes without major rework, formalize Phase (c): persona files + workflow get richer (responsibilities, KPIs, veto rights, hand-off contracts). Tool-specific shims (`.claude/agents/`, Codex profiles) are added as adapters that delegate to the canonical files.
4. Pause `studio-operate` autonomous loop until (b) ships its spec. Polish PRs cannot accumulate during the pilot.

## Repo Layout (harness-neutral source of truth)

| Path | Purpose | Created in phase |
|---|---|---|
| `docs/studio/DELIBERATION_WORKFLOW.md` | Phase / artifact / exit-criteria spec, harness-agnostic | (b) |
| `docs/studio/personas/director.md` | Director role, voice, hand-off contract | (b) |
| `docs/studio/personas/designer.md` | Game Designer (기획) persona prompt skeleton | (b) |
| `docs/studio/personas/art-director.md` | Art Director persona prompt skeleton | (b) |
| `docs/studio/personas/engineer.md` | Engineer persona prompt skeleton | (b) |
| `docs/studio/personas/senior-critic.md` | Devil's-advocate persona prompt skeleton | (b) |
| `docs/studio/plans/<id>-<slug>.md` | Multi-phase work plans (this file is 0001) | (b) onward |
| `docs/studio/templates/spec.md` | Spec.md template (Vision / Layout / Tokens / Components / Acceptance / Risks / Sequence / Open Questions) | (b) |
| `reports/deliberation/<axis>/` | Per-axis deliberation transcripts + final spec | (b) onward |
| `reports/deliberation/<axis>/spec.md` | Director-synthesized final spec | (b) onward |
| `reports/deliberation/<axis>/proposals/<persona>.md` | Each specialist's first proposal | (b) onward |
| `reports/deliberation/<axis>/critique.md` | Cross-team critique transcript | (b) onward |

**Tool adapters (NOT source of truth):**

| Path | Purpose | Created in phase |
|---|---|---|
| `.claude/skills/studio-deliberate/SKILL.md` | Claude Code wrapper that reads `docs/studio/` and orchestrates agents | (a) |
| `.claude/agents/<role>.md` (optional) | Thin shim delegating to `docs/studio/personas/<role>.md` | (c) |

## Acceptance Criteria

### Phase (b) — manual pilot

- [ ] `docs/studio/DELIBERATION_WORKFLOW.md` exists, < 200 lines, defines: roles, parallel-vs-sequential phases, artifact paths, exit criteria, what the spec.md must contain, how the Director resolves disagreements.
- [ ] 4 persona files exist under `docs/studio/personas/` (designer, art-director, engineer, senior-critic). Each file contains: 1-line identity, 5-bullet responsibility, voice/tone guideline, what they MUST push back on, what they MUST NOT do, hand-off contract.
- [ ] `docs/studio/personas/director.md` exists separately and describes synthesis duty + tie-breaking rules.
- [ ] `docs/studio/templates/spec.md` exists with named sections: Vision, Layout Skeleton, Design Tokens, Component Composition, Acceptance Criteria, Risks, Implementation Sequence, Open Questions.
- [ ] `reports/deliberation/desktop-ui-redesign/` contains: 4 proposals, 1 critique transcript, 1 final spec.md.
- [ ] Final spec.md is concrete enough that an `executor` agent (or human dev) can implement without re-asking design questions. Specifically: Layout Skeleton names the grid columns/rows + breakpoints, Design Tokens section names the variables to introduce, Component Composition lists which existing components stay/move/replace, Implementation Sequence orders the PRs.
- [ ] Spec.md records at least 2 substantive disagreements between specialists and how the Director resolved them — surfaces signal, not hides it.
- [ ] User reviews spec.md and approves (separate gate before any implementation PR).
- [ ] During (b), no `studio-operate` polish PR is merged. Heartbeat marks the loop as paused.

### Phase (a) — codify into skill

- [ ] `/studio-deliberate <axis-brief>` skill exists at `.claude/skills/studio-deliberate/SKILL.md`. Reads `docs/studio/DELIBERATION_WORKFLOW.md` and persona files. Spawns 4 parallel agents. Collects proposals. Runs critique round. Produces `reports/deliberation/<slug>/spec.md`.
- [ ] Skill body is < 300 lines and contains zero duplicated persona prompts — all prompts are loaded from `docs/studio/personas/*.md` at runtime.
- [ ] Skill is dogfooded on 1 second axis (a different one — e.g., mission UX visibility OR 3rd merchant arc). Output spec.md passes the same concreteness bar as Phase (b).
- [ ] Skill does NOT write game studio decisions into `.claude/`, `.omc/`, or `.omx/`. Only its own runtime/cache state, if any, may live there.

### Phase (c) — permanent persona system

- [ ] After 3+ different axes have flowed through the skill without persona rewrites, persona files are upgraded to include: KPI per role, explicit veto domain (e.g., Engineer can veto on perf-budget violations; Art Director can veto on visual hierarchy violations), seniority/tie-breaking order with Director.
- [ ] `.claude/agents/<role>.md` shims may be added; each shim is < 20 lines and only redirects to the canonical `docs/studio/personas/<role>.md`.
- [ ] (Optional) Equivalent shims for Codex / other harnesses use the same canonical files.
- [ ] `docs/studio/DELIBERATION_WORKFLOW.md` upgraded with veto-resolution rules, escalation paths, and how user redirects mid-deliberation.

## Implementation Steps

### Phase (b) — desktop UI redesign pilot (this session, target ≤ 1 day)

1. **Author canonical docs** (this main thread, before spawning anything):
   - Write `docs/studio/DELIBERATION_WORKFLOW.md` (workflow contract).
   - Write `docs/studio/personas/{director,designer,art-director,engineer,senior-critic}.md`.
   - Write `docs/studio/templates/spec.md`.
   - Reference: existing memory files (`feedback_studio_team_critique.md`, `feedback_layout_over_polish.md`, `feedback_harness_neutral_source_of_truth.md`).

2. **Pause autonomous loops**:
   - Append a heartbeat entry to `reports/operations/operator-heartbeat-20260504.jsonl` marking `phase: deliberation-pilot-paused`, `current_command: studio-operate halted for /studio-deliberate pilot`, `next_action: resume after spec.md approval`.
   - Do NOT cancel cron/loops the user owns; just stop invoking the skill manually.

3. **Build the axis brief**:
   - Write `reports/deliberation/desktop-ui-redesign/brief.md` summarizing: current state (single-column mobile stretched to 1920px, 70% empty negative space, screenshot ref), target users, technical constraints (React + Phaser, 5 tabs, existing data layer untouched), 3 prior options sketched (A 2-pane / B 3-column / C canvas-in-game).

4. **Spawn 4 specialist proposals in parallel** (single message, 4 `Agent` calls with `subagent_type: general-purpose`):
   - Each agent gets: persona file content (inlined into prompt), brief.md content (inlined), instruction to write proposal to `reports/deliberation/desktop-ui-redesign/proposals/<persona>.md`.
   - Agents work in isolation, do NOT see each other's drafts in this round.

5. **Cross-team critique round** (parallel, 4 agents again):
   - Each agent re-reads its own proposal + the OTHER 3 proposals + persona file. Writes a critique to `reports/deliberation/desktop-ui-redesign/critique-<persona>.md`. Critique must explicitly call out: where they disagree, what tradeoff the other side missed, what would need to change for them to sign off.

6. **Director synthesis** (this main thread):
   - Read all 4 proposals + 4 critiques. Identify substantive disagreements. Decide on tradeoffs explicitly. Write final `reports/deliberation/desktop-ui-redesign/spec.md` using the template. Section "Decisions Resolved" lists each disagreement and why the Director ruled the way they did.

7. **User review gate**:
   - Surface spec.md to user. User approves, requests changes, or rejects. If changes: re-run step 5-6 with feedback. If approved: spec.md is the contract for the next implementation cycle (NOT executed in this plan).

8. **Capture lessons for Phase (a)**:
   - Append `reports/deliberation/desktop-ui-redesign/retrospective.md`: what worked, what was redundant, which persona produced the most signal, which sections of spec.md were actually used by the Director, time spent.

### Phase (a) — codify into `/studio-deliberate` skill (target ≤ 1 day after (b) approval)

1. Read retrospective.md. Drop redundant phases. Lock the persona-spawning convention.
2. Author `.claude/skills/studio-deliberate/SKILL.md`. Skill takes `<axis-slug> <brief-md-path>` args. Pseudocode:
   - Validate brief exists and slug is filesystem-safe.
   - Read `docs/studio/DELIBERATION_WORKFLOW.md` to get phase order.
   - For each persona in `docs/studio/personas/`, read file content.
   - Spawn 4 `general-purpose` agents in parallel (proposals).
   - Wait, then spawn 4 again (critique).
   - Director synthesis is left to the calling main thread (skill returns paths to all artifacts; main thread writes spec.md).
   - Append heartbeat entry.
3. Dogfood on a second axis (suggest: "mission UX visibility decision" — flagged by past heartbeats as needing resolution).
4. Compare second-axis spec.md quality vs first. If degradation, debug skill before claiming Phase (a) done.

### Phase (c) — permanent persona system (after 3+ axes through (a))

1. Audit persona files for fields that proved load-bearing vs decorative across all axes used. Trim and tighten.
2. Add KPI / veto / seniority sections to each persona file.
3. Add `docs/studio/DELIBERATION_WORKFLOW.md` sections on veto handling and escalation.
4. (Optional) Add `.claude/agents/<role>.md` thin shims pointing to canonical files. Verify they're < 20 lines and stay in sync via doc reference, not duplication.
5. Document the harness-adapter pattern explicitly in the workflow doc so future tools (Codex CLI, Cursor, etc.) follow the same source-of-truth contract.

## Risks and Mitigations

| Risk | Mitigation |
|---|---|
| 4 parallel agents produce 4 vague mutually-similar proposals (echo chamber) | Persona files MUST explicitly state what each role disagrees with the others on. Critique round is mandatory — no shortcut. |
| Director (main thread) under-resolves disagreements, just averages everyone | Spec.md template has required "Decisions Resolved" section. If empty, the deliberation is incomplete. |
| Phase (a) skill drifts into duplicating persona prompts inline | Skill must `Read` persona files at runtime, not embed them. Acceptance criterion explicit. |
| User-facing review gate gets skipped because skill output looks complete | Phase (a) skill stops before writing spec.md. Director synthesis stays in main thread → user always sees it before implementation. |
| Existing studio-operate loop still runs in background (cron/schedule) | Step (b)-2 only writes a marker, doesn't kill external cron. User must manually verify no external schedule fires. |
| Persona prompts written by main thread reflect main thread's biases | Personas should be drafted with deliberate anti-prompts ("you DISAGREE with X by default"). Senior Critic exists specifically to red-team the Director. |
| (c) over-formalization slows down small axes | Small axes may opt out of full deliberation. Define a "skip-deliberation" threshold (e.g., < 30min implementation, no UX surface change). Don't ritualize. |

## Verification Steps

- After (b) docs are written: read each persona file aloud — does it sound like a different person from the others? If two sound the same, redraft.
- After (b) spec.md is written: hand it to a fresh `Agent(general-purpose)` with the prompt "what do you NOT understand about how to implement this?" If response has > 3 questions, the spec is too vague.
- After (a) skill is dogfooded: diff the workflow doc vs the skill code. Any logic in the skill that isn't traceable to the doc is a process leak — move to doc.
- Before (c) starts: count how many times persona files were edited in (a)'s 3+ runs. If > 1 edit per persona per axis, personas are not stable yet — keep iterating before formalizing.
- At all times: run `git grep -l "studio" .omc .omx .claude` and check that anything matching is either runtime state OR a thin adapter — never a spec/decision/persona definition.

## Sequence (visual)

```
(b) docs+brief   →  parallel(4 proposals)  →  parallel(4 critiques)
                                                     ↓
                                       Director synthesis (main thread)
                                                     ↓
                                                  spec.md
                                                     ↓
                                       USER REVIEW GATE  ←─── (b) ends here
                                                     ↓ (approve)
                                       Implementation cycle (separate plan)
                                                     ↓
                                            retrospective.md
                                                     ↓
                              (a) codify lessons → /studio-deliberate skill
                                                     ↓
                              dogfood on axis #2, axis #3
                                                     ↓
                                       (c) formalize personas + adapters
```

## Open Questions (none blocking, raise to user mid-execution)

- Should the heartbeat marker for "loop paused" appear in `reports/operations/operator-heartbeat-*.jsonl` (current path) or move into a new harness-neutral path? Defer to phase (c) audit.
- Spec.md template — do we want a strict schema (e.g., YAML frontmatter for machine readability) or freeform markdown? Defer until 2nd axis to see what natural usage emerges.
- Tie-breaking when Engineer veto conflicts with Art Director veto — define in (c), not now.

## Changelog

- 2026-05-04: initial draft. User confirmed Phase (b) outputs spec.md only, Director = main thread, persona spawn = general-purpose agent + inline prompts. User added harness-neutrality constraint mid-plan; layout adjusted: assets in `docs/studio/` and `reports/deliberation/`, never `.omc/.omx/.claude/`.
- 2026-05-04: Phase (b) ✅ complete — `desktop-ui-redesign` first dogfood, spec + retrospective merged.
- 2026-05-04: Phase (a) ✅ complete — `/studio-deliberate` skill shipped + dogfood verified on `mission-ux-visibility` second axis. PR #388 merged.
- 2026-05-05: Cycle 1 (`desktop-ui-redesign`) implementation 5 PR merged. art-share-gate passed but user critique exposed implementation gap — spec promises violated. Memory `feedback_implementation_critique_gate.md` added.
- 2026-05-05: 3rd axis `stage-art-first-restructure` deliberated + Cycle A 6 PR merged (PR0~PR5 + hotfix). art-share-gate hardened to 12/12 with new "plot card NOT covered" test. Spec § Decisions §4 enforces user-only Cycle close + Director self-restriction.
- 2026-05-05: **Session handoff for Codex** — `docs/studio/USER_PREFERENCES.md` + `docs/studio/HANDOFF.md` 작성. 모든 source-of-truth repo-native, harness-neutral. Cycle B (`garden-diegetic-ui`) binding promise + recommended axis `garden-respecting-hud-assets` 명시.
- Phase (c) → still pending. Recommend after `/studio-deliberate` runs on 1+ more axis (counting `stage-art-first-restructure` = 3 total now).
