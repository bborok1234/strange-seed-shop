# Autonomous Project Operating Model

## 1. Intent

This project is both a game and an agent-management experiment. The long-term goal is a repository that can move toward a defined destination with minimal human intervention, while keeping evidence, safety, and reversible decisions visible.

The model is inspired by ClawSweeper's structure: a conservative automation system that reviews items, writes durable reports, applies only high-confidence actions, maintains dashboards, and audits drift.

Reference observed from `openclaw/clawsweeper`:

- It keeps one markdown report per open issue or PR.
- Review is proposal-only.
- Apply mutates GitHub only when stored review evidence remains valid.
- Maintainer-authored/protected items are guarded.
- Dashboard and audit health make the system inspectable.
- Scheduled lanes run at different cadences for hot, daily, and weekly work.

## 2. Core Principle

Agents should not be trusted because they are autonomous. They should be trusted because their work is:

- scoped
- reviewable
- evidence-backed
- reversible
- cadence-controlled
- audited

## 3. Repository Operating Surfaces

The project should eventually maintain these directories:

```text
docs/
  PRD_PHASE0.md
  ECONOMY_PHASE0.md
  AUTONOMOUS_PROJECT_OPERATING_MODEL.md

items/
  <id>.md                  # open work records

closed/
  <id>.md                  # completed/rejected/stale records

reports/
  reviews/
  audits/
  playtests/
  economy-sims/

config/
  seeds.json
  creatures.json
  growth_curves.json
  rewards.json
  missions.json
  shop_surfaces.json

public/assets/
  game/
  manifest/assetManifest.json
```

## 4. Work Item Format

Every autonomous task should become a markdown work item before implementation.

Required fields:

```markdown
# <short title>

Status: open | proposed | in_progress | blocked | verified | closed
Owner: agent | human | mixed
Created: YYYY-MM-DD
Updated: YYYY-MM-DD
Scope-risk: narrow | moderate | broad

## Intent
Why this work exists.

## Acceptance Criteria
- Concrete testable criterion

## Evidence
- Links to docs, logs, screenshots, tests, reports

## Proposed Plan
- Steps

## Apply Conditions
Conditions that must remain true before mutation.

## Verification
What proves completion.
```

## 5. Lanes

### Intake Lane

Turns ideas, bugs, playtest notes, and user requests into normalized work items.

It may:

- create `items/<id>.md`
- classify priority
- detect duplicates
- link source docs

It may not:

- modify product code
- close tasks
- change economy values without review

### Review Lane

Proposal-only. Similar to ClawSweeper's review lane.

It may:

- inspect code/docs/config
- propose implementation steps
- propose close/reject/merge decisions
- write reports under `reports/reviews/`

It may not:

- mutate product code
- apply decisions directly
- bypass acceptance criteria

### Apply Lane

Mutation lane. It can edit code/config/docs only when a stored proposal is still valid.

Before applying, it must check:

- work item still open
- relevant files changed since review?
- acceptance criteria still valid?
- proposal scope still narrow enough?
- human-protected areas touched?

### Verify Lane

Runs tests, visual checks, economy sims, and acceptance reviews.

It must:

- produce evidence
- mark pass/fail
- open follow-up items for failures

### Audit Lane

Compares repo state with work records.

It checks:

- open work without reports
- reports without work items
- stale in-progress items
- implemented code without docs
- config missing schema validation
- assets missing manifest entries
- acceptance criteria without tests

## 6. Cadence

Suggested local cadence once automation exists:

| Lane | Cadence | Purpose |
| --- | --- | --- |
| Intake | on demand | normalize new requests |
| Review | daily or per milestone | propose next work |
| Apply | after review approval | mutate repo |
| Verify | after every apply | prove completion |
| Audit | daily during active build, weekly later | detect drift |
| Dashboard | after verify/audit | summarize state |

## 7. Dashboard Contract

Future `README.md` or `docs/DASHBOARD.md` should include:

- Current milestone
- Open work count
- Blocked work count
- Last verification status
- Last economy simulation status
- Asset pipeline status
- Phase 0 acceptance progress
- Next recommended task

## 8. Human Intervention Boundaries

Agents can proceed without asking for:

- creating work items
- updating docs
- adding tests
- implementing accepted narrow tasks
- generating non-final preview assets
- running local verification

Agents must stop or request explicit approval for:

- real payment integration
- external deployment
- public release
- credential use
- destructive data migration
- policy-sensitive monetization changes
- irreversible deletion
- production user data handling

## 9. Game-Specific Autonomous Gates

### Product Gate

No implementation starts unless a PRD section and acceptance criteria exist.

### Economy Gate

No economy value change is accepted unless:

- source/sink impact is described
- 1h/D1/D3/D7 impact is estimated
- tuning lever is identified

### Asset Gate

No asset ships unless:

- it exists in `assetManifest.json`
- it passes visual QA
- it has stable filename and id
- it has no runtime generation dependency

### Monetization Gate

No monetization surface ships unless:

- it is mock-only or payment-reviewed
- it has clear user-facing value
- it avoids hidden odds or misleading urgency
- analytics event exists

## 10. Near-Term Implementation Path

1. Create Phase 0 PRD and economy contract.
2. Create game asset generation skills.
3. Generate first 20 static sample assets.
4. Create config schemas.
5. Build local-only MVP.
6. Add economy simulator.
7. Add verification dashboard.
8. Add work item intake/review/apply scaffolding.
9. Move toward ClawSweeper-style scheduled agent maintenance.

## 11. Definition of Autonomous Enough

This project reaches the first autonomous-management milestone when an agent can:

- read the dashboard
- select the next open item
- inspect linked docs
- propose a plan
- apply a narrow change
- run verification
- update the work item
- create follow-up items for failures

without needing the human to restate project context.
