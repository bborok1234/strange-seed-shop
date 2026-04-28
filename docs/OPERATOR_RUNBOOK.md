# Operator Runbook

Status: draft-v0
Owner: agent
Last updated: 2026-04-28
Applies to: supervised 4h trial, future 24h dry run, and any overnight `$ralph` operator session

## Purpose

이 runbook은 에이전트 네이티브 게임 스튜디오/운영사가 “오래 켜져 있었다”가 아니라 “안전하게 시작하고, 살아 있음을 증명하고, 실패를 복구하고, 사람이 깨면 바로 이해할 수 있게 요약했다”를 검증하게 만드는 절차다.

## Non-negotiable boundaries

- No credential access.
- No customer data collection or storage.
- No real GTM channel posting, email sending, SNS publishing, store/community publishing, or ads action.
- No payment, login/account, ads SDK, external deployment, or production user-data changes.
- No runtime image generation inside gameplay.
- Do not enable `ENABLE_AGENT_AUTOMERGE` without explicit approval and branch-protection evidence.
- Do not call red CI, stale heartbeat, merge conflict, or blocked Browser Use state “complete”.

## Start procedure

Before any supervised 4h or 24h run:

1. Confirm clean base:
   - `git status --short --branch`
   - `gh issue list --state open`
   - `gh pr list --state open`
2. Choose a single active operator issue and work item.
3. Create or reuse a context snapshot under `.omx/context/` with:
   - task statement
   - desired outcome
   - known facts/evidence
   - constraints
   - unknowns/open questions
   - likely touchpoints
4. Run readiness checks:
   - `npm run operator:trial:readiness`
   - `npm run check:operator`
   - `npm run check:all`
5. Write initial heartbeat:
   - `node scripts/write-operator-heartbeat.mjs --issue '#<n>' --item items/<id>.md --phase executing --iteration 1 --command '<current command>' --next '<next action>' --context <snapshot>`
6. Announce/record start only after the heartbeat and readiness checks exist.

## Monitor procedure

During a supervised run:

- Write heartbeat at least once per iteration and at least every 5 minutes during multi-hour trials.
- Run watchdog against the current heartbeat source:
  - `npm run operator:watchdog -- --heartbeat <path> --max-age-seconds 600 --report <report-path>`
- Keep every issue-to-PR loop evidence-backed:
  - issue/work item
  - branch
  - commits
  - local checks
  - PR URL
  - GitHub checks
  - architect/reviewer verdict when Ralph requires it
  - merge or blocker state
- Prefer small, reversible PRs over one large overnight diff.
- When visual work changes UI, follow Browser Use first policy and save visual evidence under `reports/visual/`.

## Recover procedure

When something goes wrong, do not continue silently.

| State | Required action |
| --- | --- |
| Red CI | Inspect `gh run view --log`, write cause/fix attempt, rerun checks, or file blocker report. |
| Stale heartbeat | Run watchdog, write stuck report, restart only after recording the stale state. |
| Merge conflict | Stop the merge, inspect conflict, rebase/resolve on a branch, rerun local checks. |
| Browser Use blocked | Read `browser-use:browser` skill, record direct blocker, use accepted fallback only with evidence. |
| External credential needed | Stop and mark blocked; do not ask the human to paste secrets into reports. |
| Scope touches payment/login/ads/customer data/real GTM/deploy | Stop for explicit approval. |
| Same failure repeats 3+ times | Create blocker report and narrow the next issue. |

## Stop procedure

Stop a long-running operator session only when one of these is true:

- The planned trial time is reached and the final heartbeat/watchdog evidence is recorded.
- A destructive, credential-gated, external-production, or materially branching decision is required.
- A hard blocker has a written report and no safe recovery path remains.
- The user explicitly says stop/cancel/abort.

Before stopping, record:

1. Final heartbeat.
2. Final watchdog status.
3. Open PRs and their checks.
4. Open issues and next queue.
5. Failed work and recovery attempts.
6. Main branch CI status if anything merged.
7. Daily operating report.

## Summarize procedure

Every multi-hour or overnight run must produce a daily operating report under `reports/operations/daily-*.md` with these sections:

- Status
- Time window
- Executive summary
- Completed work
- Failed or blocked work
- Open PRs
- Red checks
- Decisions made
- Stop rules observed
- Verification evidence
- Next queue

A human should be able to answer these questions from the report without reading the whole terminal history:

1. What shipped?
2. What failed?
3. Is main green?
4. Are there open PRs or red checks?
5. What decisions need a human?
6. What should the operator do next?

## 4h supervised trial readiness checklist

The next 4h trial may start only after:

- Issue #33’s 2h trial report is merged.
- This runbook is merged.
- A daily operating report template exists.
- `npm run check:operator` and `npm run check:all` pass on main.
- Open PR list is empty or intentionally documented.
- Stop deadline and heartbeat interval are declared.
- Safety boundary is repeated in the issue and start comment.

## 24h dry-run readiness checklist

The future 24h dry run additionally requires:

- 4h supervised trial report merged.
- Daily report produced from a real multi-hour run.
- Red-CI recovery drill or blocker drill evidence still current.
- Browser Use fallback status current.
- No real credentials or external channel actions required.
- Explicit approval if any production/external boundary changes.
