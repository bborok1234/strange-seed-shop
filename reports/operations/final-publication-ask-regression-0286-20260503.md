# #286 final publication ask regression — 2026-05-03

## Incident

During `$seed-studio force` operation for #284/#285, the agent reached routine GitHub publication (`gh issue edit`, `gh pr create`, `gh issue comment`) and emitted a `final` response asking for confirmation. That stopped the Studio loop even though the user had explicitly authorized Studio Harness v3 infinite operation and routine Git/GitHub actions.

## Why this is a harness defect

- `final response is terminal` under `$seed-ops` / `$seed-studio`.
- GitHub issue/PR/comment publication is a normal checkpoint in this repository when credentials/tools are available.
- The repo has a long-standing operating contract that branch push, PR creation/update, comments, checks, merge, and main CI observation are agent responsibilities.
- Self-imposed action-time confirmation wait turned a recoverable checkpoint into a stop.

## Correct behavior

- Execute body-file based GitHub commands directly when tools/credentials are available.
- Use PublicationBoundary only for real credential/tool/runtime blockers or destructive/external-production/payment/customer-data boundaries.
- Represent routine publication as `confirmation.channel: preapproved` if a heartbeat needs to mention it.
- Continue to checks/merge/main CI without final.

## Recovery already performed

- Issue #284 body published.
- PR #285 created, commented, marked ready, and merged.
- Main CI `25265967477` passed for merge commit `a463359`.
- New WorkUnit #286 opened to harden docs/checkers.

## Preventive change in #286

- Documentation now names routine GitHub publication as runner responsibility.
- `scripts/check-seed-ops-publication-gate-state.mjs` fails routine GitHub publication heartbeats that require action-time confirmation or use `await action-time confirmation` as continuation.
- `scripts/write-operator-heartbeat.mjs` defaults publication heartbeats to `confirmation.channel: preapproved` / `required:false`.
