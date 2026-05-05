---
name: studio-operate
description: Codex-native Studio Harness v3 in-session operator pass for 이상한 씨앗상회. Use when the user asks to run studio-operate in Codex, continue the operator, keep working on the Studio loop, or wants a bounded Ralph-style pass without a detached 24h supervisor.
---

# Studio Harness v3 — Codex In-Session Operator

This skill is the Codex counterpart to Claude Code `/studio-operate`. It runs a bounded in-session operator pass using the same repo-native Studio v3 contract, without pretending that a detached Ralph runner exists.

## Use When

- The user says `studio-operate`, `Codex에서 studio-operate`, `계속 운영`, `ralph로 어느 정도 돌려`, or asks for a bounded Studio pass.
- The task should continue from `docs/ROADMAP.md`, `docs/OPERATOR_CONTROL_ROOM.md`, and current `items/`.
- The user wants lower overhead than `npm run studio:v3:operate -- --detached`.

## Hard Rules

- Do not call `$seed-ops` as the v3 entrypoint. It is deprecated.
- Do not claim prompt-side `$ralph` is a live long runner. It is state and workflow guidance only.
- If the user invoked `$ralph`, create or reuse a context snapshot under `.omx/context/` before execution work.
- For visible gameplay/HUD/playfield/assets/QA, use Browser Use `iab` first. Playwright is a repeatable regression gate, not a replacement for hands-on Browser Use evidence.
- When GitHub credentials/tools are available, do not execute or stop a substantive implementation slice as local-only. If the chosen WorkUnit only exists locally, promote it to a GitHub issue before implementation or publication, then create/update a draft PR before moving to the next WorkUnit.
- Stop only for explicit user stop, destructive/credential/payment/external-production/customer-data boundary, real tool outage, or a written blocker.

## Bounded Codex Pass

1. Read the current control surfaces:
   - `docs/ROADMAP.md`
   - `docs/OPERATOR_CONTROL_ROOM.md`
   - `docs/NORTH_STAR.md`
   - `docs/IDLE_CORE_CREATIVE_GUIDE.md`
   - `docs/PROJECT_COMMANDS.md`
2. If `$ralph` is active, write/update the prompt-side Ralph state with:
   - context snapshot path;
   - iteration;
   - current phase;
   - active item/spec path.
3. Run `npm run studio:v3:runner -- --once --dry-run` to inspect the GitHub-authoritative queue when GitHub access is needed.
4. Pick or create one WorkUnit. For the current `garden-respecting-hud-assets` branch, prefer `items/0210-garden-hud-plot-marker-assets.md`.
   - If this WorkUnit is local-only and `gh` is authenticated, create/promote the matching GitHub issue before implementation continues.
5. Ensure the WorkUnit has:
   - `## Plan`;
   - Game Studio route;
   - acceptance criteria;
   - verification commands;
   - Browser Use QA plan for visible changes;
   - stop/blocker boundaries.
6. Execute one bounded slice through implementation and focused verification.
7. If GitHub is available and the slice changed repo files, create/update a draft PR and record the PR URL in the WorkUnit, heartbeat, and operation report before moving on.
8. Leave heartbeat/evidence in `reports/operations/` and `reports/visual/`.
9. If stop rules are not active, prepare the next plan artifact or next actionable checkpoint instead of sending a terminal-style “done” claim.

## Relationship To Detached Supervisor

Use the detached supervisor only when the user explicitly wants background operation:

```bash
npm run studio:v3:operate -- --detached --duration-hours 24 --interval-seconds 300 --axis garden-respecting-hud-assets --cycle-a-approved
```

The in-session skill is preferred when the user wants Claude Code-like `/studio-operate` behavior in Codex: one bounded pass, then another pass can be requested or looped by the surrounding client.

## Verification For Skill Or Operator Changes

Run:

```bash
npm run check:studio-v3-operator
npm run check:project-commands
npm run check:studio-deliberation-ralph-loop
```
