# Studio Harness v3 Autonomous Design

Status: approved planning spec
Owner: Studio Director agent
Updated: 2026-05-02

## 목적

Studio Harness v3는 `이상한 씨앗상회` 운영사가 로컬 campaign ledger에 갇히지 않고, GitHub issue와 PR을 기준으로 사람이 개입하지 않아도 계속 진행되는 게임사 하네스가 되기 위한 설계다.

이 문서는 구현 문서가 아니라 실행 전 계획/스펙이다. 이 문서가 승인되기 전에는 Studio Harness v3 관련 코드, 스크립트, skill, gate-state, 게임 구현을 수정하지 않는다.

## ADR

Decision: GitHub-only가 아니라 GitHub-authoritative로 간다.

Drivers:

- 로컬 ledger만으로 gate를 전진시키면 GitHub issue/PR evidence가 끊기고, 운영사가 로컬 전용 반쪽짜리가 된다.
- GitHub issue body와 PR body는 사람이 쉽게 수정할 수 있는 markdown projection이므로 단독 canonical state가 될 수 없다.
- 사람이 매 세션 지시하지 않아도 runner가 issue queue, PR, CI, heartbeat를 보고 계속 진행해야 한다.
- `.omx`와 prompt-side runtime state는 실행 캐시일 뿐 제품/운영 판단의 source of truth가 될 수 없다.

Rejected:

- Local-ledger authoritative v2 | gate-state가 로컬에서만 전진해 GitHub issue/PR 운영 단위가 사라진다.
- GitHub body-only truth | issue/PR body가 mutable text라 삭제, 편집, 파싱 실패, stale checklist를 감지하기 어렵다.
- Prompt-side Ralph only | 장시간 운영을 주장할 근거가 structured runner artifact, heartbeat, watchdog 없이 assistant message에 의존한다.

Consequences:

- 모든 Studio work unit은 GitHub issue를 canonical id로 가진다.
- 모든 repo mutation과 verification evidence는 PR 또는 pending PR boundary에 묶인다.
- local campaign ledger는 GitHub state의 read model mirror이며 work authorization을 할 수 없다.
- Git/GitHub 조작은 사람 handoff가 아니라 agent/runner 책임이다. credentials, branch protection, destructive policy, external deployment 같은 hard boundary가 아닐 때 사람에게 명령어 실행을 떠넘기지 않는다.
- GitHub publication이 tool/credential/policy boundary에 막히면 pending-publication으로 기록하고, 완료/Release를 주장하지 않는다.

## 권위 계층

1. Constitution docs: `README.md`, `STUDIO.md`, `GAME_BRIEF.md`, `ROADMAP.md`, 이 v3 설계 문서. 정책과 운영 계약을 소유한다.
2. GitHub issue: work unit, plan/spec, gate state, queue priority의 operational truth다.
3. GitHub PR: implementation scope, review, CI, visual evidence, release readiness의 operational truth다.
4. GitHub structured surfaces: labels, Projects v2 field 또는 fallback structured labels, machine-readable GateEvent comments, PR checks/statuses.
5. Local ledger/reports: GitHub state를 재생성 가능한 read model로 mirror하고 evidence file path를 묶는다.
6. `.omx`: runtime cache, runner session cache, prompt-side state만 담당한다.

Rule: local ledger may summarize GitHub, but must never authorize work.

## Canonical Data Model

### WorkUnit

GitHub issue 하나가 WorkUnit 하나다.

Required fields:

- `repo`
- `issue_number`
- `issue_url`
- `title`
- `objective`
- `campaign_id`
- `gate`
- `scope`
- `non_goals`
- `acceptance_criteria`
- `verification_requirements`
- `game_studio_route`
- `linked_branch`
- `linked_pr` 또는 `pending_pr_target`
- `current_state_hash`
- `runner_policy`

Issue body는 위 내용을 읽기 쉽게 보여주는 projection이다. canonical parser는 issue body만 믿지 않는다.

### GateEvent

GateEvent는 GitHub issue comment에 남기는 machine-readable transition record다. 완전한 append-only log가 아니라 tamper-evident log로 취급한다.

Required fields:

```json
{
  "schema_version": "studio-gate-event/v1",
  "event_id": "uuid-or-stable-id",
  "event_type": "gate-transition | migration-backfill | publication-boundary | reconciliation",
  "repo": "owner/repo",
  "issue_number": 0,
  "gate_from": "Intake",
  "gate_to": "Research",
  "actor": "agent-or-human",
  "timestamp": "2026-05-02T00:00:00Z",
  "branch": "codex/example",
  "head_sha": "git-sha-or-null",
  "pr_number": null,
  "pending_pr_target": null,
  "publication_state": "published | pending-publication | blocked",
  "evidence_refs": [],
  "previous_state_hash": "sha256:...",
  "next_state_hash": "sha256:..."
}
```

Event parsing rules:

- GitHub issue body is projection only.
- Latest valid GateEvent chain plus GitHub fields/checks reconstructs current state.
- Edited machine event, missing predecessor hash, label mismatch, impossible transition, stale runner heartbeat, or missing PR after Productionization marks state as `tainted/reconciliation-required`.
- Deleted comments cannot always be proven, so missing predecessor or hash gap is enough to block authorization.

### State Hash

`current_state_hash` is `sha256` over a canonical JSON object.

Canonicalization rules:

- Include: repo, issue number, current gate, coarse labels, typed project fields or fallback gate labels, linked branch, linked PR number, head SHA, latest valid GateEvent id, verification status, publication state.
- Exclude: markdown body text, comment render order outside GateEvent chain, human prose, timestamps except latest GateEvent timestamp, PR check run ids that change on rerun.
- Sort object keys lexicographically.
- Sort arrays lexicographically unless sequence is semantically meaningful.
- Normalize nulls explicitly.

### PublicationBoundary

PublicationBoundary records external GitHub actions that cannot be completed in the current app/runtime without confirmation or credentials.

Required fields:

- `boundary_type`: issue-publication, pr-publication, comment-publication, merge, external-deploy
- `target`
- `body_file`
- `pending_command`
- `required_confirmation`
- `blocked_external_action`
- `allowed_local_continuation_actions`
- `created_at`
- `expires_at`

Pending publication is not completion. Release, merge readiness, or Productionization done cannot be claimed while a boundary is unresolved.

PublicationBoundary is an exception path, not the normal operating path. If `gh`, GitHub app tools, or an authenticated detached runner can perform the publication safely, the agent must execute it and record the result instead of asking the human to run git or GitHub commands.

### RunContinuity

RunContinuity proves that a runner is live, not merely that a prompt once said it would keep going.

Required fields:

- `issue_number`
- `branch`
- `pr_number` 또는 `pending_pr_target`
- `runner_id`
- `runner_kind`: ralph, team, cron, heartbeat, native-agent
- `detached_artifact`
- `heartbeat_timestamp`
- `watchdog_timestamp`
- `ttl_seconds`
- `last_github_sync_hash`
- `branch_head_sha`
- `current_phase`

If heartbeat TTL expires, branch HEAD no longer matches, PR target disappears, or detached artifact is missing, the runner is stale and cannot be cited as live operation.

## Gate Graph

Canonical graph:

```text
Intake
-> Research
-> Creative Direction
-> Prototype Plan
-> Throwaway Prototype
-> Playtest
-> Keep / Kill / Pivot
-> Productionization
-> Release
-> Retro
-> Intake
```

Global gate rules:

- Intake requires a GitHub issue anchor or a pending issue-publication boundary.
- Research, Creative Direction, Prototype Plan, Throwaway Prototype, Playtest are issue-scoped.
- Any repo artifact mutation after planning requires a branch and PR target, even if the artifact is disposable.
- Keep decision requires Playtest evidence and an explicit GateEvent.
- Productionization requires Keep or Productionization-approved GateEvent plus linked PR or pending PR target.
- Release requires PR checks/status, review/merge readiness, and no unresolved publication boundary.
- Retro must write issue/PR evidence before selecting the next Intake.

No gate may advance solely because `campaigns/<id>/gate-state.json` changed.

## Reconciliation State Machine

States:

- `synced`: GitHub fields, latest GateEvent chain, PR metadata, and local mirror hashes agree.
- `pending-publication`: local body/command exists but GitHub publication is blocked by confirmation, credentials, or external policy.
- `partial-transition`: some GitHub surfaces updated but GateEvent, labels, PR, checks, or local mirror did not all converge.
- `tainted/reconciliation-required`: hash mismatch, edited machine event, missing predecessor, stale heartbeat, illegal transition, or missing required PR/check.
- `quarantined`: v2 local-only state or migration residue cannot authorize work.

Recovery rules:

- `pending-publication` can continue only safe local planning, dry-run validation, and body preparation.
- `partial-transition` must reconcile GitHub surfaces before implementation continues.
- `tainted/reconciliation-required` blocks code mutation until a reconciliation GateEvent is posted.
- `quarantined` work must be backfilled to a GitHub issue or explicitly killed.

## Autonomous Runner Plane

The runner plane makes the studio keep operating without a human restarting every session.

### Components

- Queue Manager: reads GitHub issue queue, labels, Projects field, stale runner state, and selects the next legal WorkUnit.
- Plan Gate: blocks implementation unless the linked issue has plan/spec, acceptance criteria, forbidden scope, verification, and Game Studio route.
- Gate Runner: executes exactly one legal gate transition at a time.
- PR Manager: creates or updates branch/PR body after the gate legally allows repo mutation.
- CI Repair Runner: reads failing PR checks, fixes within scope, pushes updates, and rechecks.
- Browser/Playtest Runner: uses Browser Use `iab` for visual/playtest gates and stores evidence.
- Watchdog: detects stale heartbeat, partial transition, red CI, missing PR, or stuck queue.
- Reporter: writes GitHub comments/check summaries and updates local mirrors.

### Runner Loop

```text
read GitHub queue
-> reconstruct WorkUnit from GateEvent chain and GitHub fields
-> verify local mirror is non-authoritative and synced
-> select next legal gate
-> run gate-specific worker
-> write GateEvent
-> update issue/PR projection
-> update local mirror
-> run focused checks
-> if PR exists, observe/update CI
-> heartbeat
-> continue forever
```

The loop does not stop at checkpoint summaries. A summary is an evidence event, not a terminal condition.

### Infinite Run Contract

Studio run is infinite by default. Once `$seed-studio` or the Studio Harness v3 runner starts, it continues operating until the process is physically unable to continue. Issue creation, PR creation, merge, Release, Retro, daily report, queue refresh, and recovery report are loop events, not completion states.

Allowed interruption causes are intentionally narrow:

- token/context limit or model runtime exhaustion
- network, GitHub, tool, filesystem, or machine outage that prevents further safe action
- user explicitly stops, closes, interrupts, or cancels the run
- destructive/credential/payment/external-production boundary where no safe local continuation exists
- machine sleep, shutdown, crash, or other force majeure

Queue empty is not a stop condition. If no legal WorkUnit is ready, the runner must reconcile GitHub/local state, open or update an Intake WorkUnit, repair stale PR/check state, harden deterministic contracts, refresh evidence, or write a heartbeat that names the next retry. It must not send a final report merely because the current issue/PR/checkpoint finished.

Checkpoint is not completion. The runner may emit commentary checkpoints and GitHub/report evidence, then immediately continue to the next legal local action. A final user-facing report is allowed only when one interruption cause above is active or when the user explicitly asks for a status-only answer.

Final report requires local main. Before sending any final user-facing completion/blocker report, the foreground workspace must be back on `main` with a clean status or with all remaining work preserved in a named recovery stash, branch, or PR. Ending on a feature/recovery branch is a Studio contract failure.

### Autonomy Policy

`autonomous_local`:

- Allowed: local planning, dry-run, body file preparation, local checks.
- Not allowed: posting issue/PR/comment, pushing branch, merging.
- Use only when GitHub credentials/tools are unavailable or policy intentionally restricts publication.

`autonomous_publish`:

- Allowed: issue/PR/comment publication and branch push with configured GitHub credentials.
- Not allowed: merge, external deploy, payment/ads/production data changes.
- This is the default target policy for a real studio runner. Routine GitHub work must not be handed to the human.

`autonomous_merge`:

- Allowed only if branch protection, required checks, approval policy, and automerge governance are explicitly configured.
- Still blocked for destructive migrations, credentials, payment, ads, external deployment, and production user data.

Codex App confirmation prompts are PublicationBoundary events only when the app/tooling actually blocks publication. If credentials and tools are available, issue creation, branch creation, push, PR creation/update, PR comments, and CI inspection are runner responsibilities. A detached OMX runner with configured credentials is required for unattended operation across sessions, but a foreground agent must still execute safe GitHub actions it is authorized to perform.

## Local Mirror Contract

Local files that may remain:

- `campaigns/active.json`
- `campaigns/<id>/gate-state.json`
- `campaigns/<id>/decisions/*.md`
- `reports/visual/*`
- `reports/operations/*`
- `docs/DASHBOARD.md`

They must be read models. Required mirror fields:

- GitHub issue/PR URL
- latest valid GateEvent id
- current state hash
- sync timestamp
- mirror status
- reconciliation status
- evidence paths

Forbidden mirror behavior:

- selecting next work without GitHub queue
- advancing gate without GateEvent
- claiming Keep, Productionization, Release, or Retro from local state alone
- treating `.omx` state as product direction or gate authority

## Migration Plan

1. Freeze v2 local-only authorization.
2. Inventory active campaigns, decisions, reports, branches, and PRs.
3. For each active work item, map to an existing GitHub issue or prepare issue-publication boundary.
4. Backfill past v2 events as `migration-backfill`, not new approval transitions.
5. Mark unmapped Productionization or Release work as `migration-quarantine`.
6. Regenerate local mirrors from GitHub state.
7. Run v3 checks and compare regenerated mirror with expected active graph.

Migration acceptance:

- Every active WorkUnit has a GitHub issue or is quarantined.
- Unmapped Productionization work is not executable.
- Local ledger can be deleted and regenerated from GitHub.
- Existing dashboard/roadmap point to GitHub authoritative state.
- v2 local-only authorization path fails deterministic checks.

## Deterministic Checks

`check:studio-harness-v3` or an upgraded `check:studio-harness` must fail on:

- local-only gate advance
- code/repo mutation without issue plan/spec
- issue body-only canonical state
- missing or invalid GateEvent chain
- state hash mismatch
- Productionization without linked PR or pending PR target
- Release while pending-publication exists
- stale heartbeat cited as live runner
- local mirror treated as authority
- `.omx` used as product source of truth

Verification sequence:

```bash
npm run check:studio-harness
npm run check:github-metadata
npm run check:project-commands
npm run check:ci
```

After v3 checker exists, `check:ci` must include it.

## Execution Handoff

Execution handoff means the runner owns git and GitHub operations inside policy. The human should not have to create branches, push, open issues, open PRs, or watch checks manually for ordinary harness work.

### Ralph path

Use Ralph when one persistent owner should implement the v3 harness sequentially and keep repairing until verification passes.

Recommended lanes:

- executor, medium: docs/spec integration and local mirror schema migration
- build-fixer, high: deterministic checker and CI integration
- verifier, high: local-only authority regression tests and migration dry-run evidence
- architect, high: final source-authority review

Launch shape:

```bash
omx ralph "Implement Studio Harness v3 from docs/STUDIO_HARNESS_V3_AUTONOMOUS_DESIGN.md. Studio run is infinite by default. The runner owns routine git/GitHub operations: create/update the GitHub issue, create a branch, push, open/update a draft PR, inspect checks, and repair CI when credentials and policy allow. Record a PublicationBoundary only when tooling, credentials, branch protection, destructive scope, external deployment, or policy actually blocks automation. Do not modify game production code. Do not advance any gate from local ledger alone. Checkpoints are not completion. Queue empty is not a stop condition. Interrupt only for token/context exhaustion, network/tool/machine outage, user stop/close/interrupt, force majeure, or destructive/credential/payment/external-production boundary with no safe local continuation."
```

### Team path

Use Team when the implementation should split docs/schema/checks/runner-readiness in parallel.

Recommended staffing:

- 1 architect: source authority, GateEvent hash spec, reconciliation state machine
- 1 executor: docs and skill contract updates
- 1 executor: schema/checker implementation
- 1 test-engineer or verifier: migration dry-run, local-only regression tests, `check:ci`

Launch shape:

```bash
omx team 4:executor "Implement Studio Harness v3 from docs/STUDIO_HARNESS_V3_AUTONOMOUS_DESIGN.md with separate docs, schema/checker, runner-readiness, and verification lanes. The team owns routine git/GitHub operations: issue updates, branches, pushes, draft PRs, PR comments, check inspection, and CI repair when credentials and policy allow. Every lane must preserve GitHub-authoritative source of truth and must not modify game production code."
```

Team runtime preflight:

```bash
tmux -V
test -n "$TMUX"
command -v omx
```

If this Codex App session is not inside tmux, do not pretend `$team` is already running. Prepare the command and execute it from an OMX/tmux runtime.

## First Implementation Issue Body Seed

Title:

```text
Studio Harness v3: GitHub-authoritative source of truth and autonomous runner plane
```

Body sections:

```md
## Intent
Make Studio Harness issue/PR-scoped, GitHub-authoritative, and capable of unattended operation through runner/watchdog policy boundaries.

## Plan/Spec
Implement from docs/STUDIO_HARNESS_V3_AUTONOMOUS_DESIGN.md.

## Allowed Scope
- Studio docs and skill contracts
- Local mirror schema migration
- Deterministic studio harness checks
- Runner continuity/readiness docs and dry-run evidence
- GitHub issue/PR/body templates

## Forbidden Scope
- Production game feature changes
- New gameplay issue creation before v3 gate rules
- Merge/automerge enablement without explicit governance
- Payment, ads, credentials, external deployment, production user data

## Acceptance Criteria
- GitHub issue/PR are operational authority.
- Issue/PR bodies are projection only.
- GateEvent chain and state hash rules are documented and checked.
- Local ledger cannot authorize work.
- Pending publication blocks completion/release claims.
- Runner liveness requires heartbeat TTL, watchdog, branch SHA, PR target, and detached artifact.
- v2 local-only active work is backfilled or quarantined.

## Verification
- npm run check:studio-harness
- npm run check:github-metadata
- npm run check:project-commands
- npm run check:ci

## Game Studio Route
Harness Auditor + Studio Director. No game production route in this issue.
```

## Ready Criteria

This plan is ready for Ralph or Team only when:

- this document is linked from `docs/README.md`;
- a GitHub issue exists, or the runner has attempted to publish it and recorded a real tool/credential/policy blocker;
- the runner policy is chosen, with `autonomous_publish` as the default target for real studio operation;
- the executor agrees not to modify game production code in the v3 harness issue;
- the first implementation step is docs/spec/checker work, not gameplay work.
