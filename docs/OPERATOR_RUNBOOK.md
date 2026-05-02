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
3. Create or update the issue plan artifact before implementation:
   - `items/<id>.md` 또는 `.omx/plans/*`에 `## Plan`을 작성한다.
   - Plan에는 small win, 구현 단계, 수용 기준, 검증 명령, 금지 범위를 포함한다.
   - 게임 issue라면 먼저 `Studio Campaign Gate`를 적용해 `P0.5 Idle Core + Creative Rescue` 같은 active campaign source of truth를 고정하고 `Game Studio Department Signoff`와 `Subagent/Team Routing decision`을 적는다.
   - Plan에는 reference teardown, creative brief, QA/playtest plan을 포함한다.
   - 기획팀, 리서치팀, 아트팀, 개발팀, 검수팀, 마케팅팀, 고객지원팀 중 관련 부서가 맡는 산출물과 role-debate note를 적는다.
   - Plan artifact가 없으면 branch 구현, 제품 코드 수정, 운영 문서 수정으로 넘어가지 않는다.
4. Create or reuse a context snapshot under `.omx/context/` with:
   - task statement
   - desired outcome
   - known facts/evidence
   - constraints
   - unknowns/open questions
   - likely touchpoints
5. Run readiness checks:
   - `npm run operator:trial:readiness`
   - `npm run check:operator`
   - `npm run check:all`
6. Write initial heartbeat:
   - `node scripts/write-operator-heartbeat.mjs --issue '#<n>' --item items/<id>.md --phase executing --iteration 1 --command '<current command>' --next '<next action>' --context <snapshot>`
7. Classify Ralph runner state before claiming long-run autonomy:
   - prompt-side `$ralph` activation can seed `.omx/state/sessions/<id>/ralph-state.json`, but `active:true`, `current_phase:"starting"`, `iteration:0`, and no runner metadata means `prompt-side-only`.
   - Live long runner evidence requires detached `omx ralph`/`omx exec` runner artifact, heartbeat source, and watchdog source.
   - Lifecycle 판단은 assistant message 문구 감지가 아니라 structured state, heartbeat, watchdog, runner artifact를 기준으로 한다.
8. For 4h+ or 24h dry-run windows, start an independent heartbeat daemon before long PR/CI waits:
   - `npm run operator:heartbeat:daemon -- --issue '#<n>' --item items/<id>.md --interval-seconds 300 --heartbeat .omx/state/operator-heartbeat.json --report .omx/logs/operator-<run>.jsonl --summary .omx/state/operator-heartbeat-daemon-summary.json`
9. Announce/record start only after the plan artifact, heartbeat, daemon summary, runner classification, and readiness checks exist.

## Monitor procedure

During a supervised run:

- Studio run is infinite by default. Once the operator/studio runner starts, issue creation, PR creation, merge, Release, Retro, daily report, and recovery report are checkpoints inside the loop, not terminal states.
- Studio Harness v3 runner reconstructs each WorkUnit from GitHub issue/PR/GateEvent surfaces before mutation. GitHub issue/PR/GateEvent is operational truth; issue/PR body text is projection, and local campaign ledger may mirror evidence but must not authorize gates.
- Never authorize work from local campaign ledger alone. Treat local `campaigns/**`, `.omx/**`, recovery stash/branch, and local reports as read model/runtime cache unless backfilled to a GitHub WorkUnit.
- routine git/GitHub actions(branch push, PR create/update, issue/comment update, GitHub checks 확인, merge when green)는 agent/runner 책임이다. Do not turn ordinary GitHub publication into human handoff unless credentials, destructive policy, or external-production boundary blocks every safe local continuation.
- Queue empty is not a stop condition. If no legal WorkUnit is ready, reconcile GitHub/local state, open or update an Intake WorkUnit, repair stale PR/check state, harden deterministic contracts, refresh evidence, or write a retry heartbeat.
- Write heartbeat at least once per iteration and at least every 5 minutes during multi-hour trials.
- During long PR/CI waits, the independent heartbeat daemon owns the 5-minute liveness signal; the foreground agent still records meaningful phase transitions.
- `$ralph` prompt-side state without detached runner metadata is `prompt-side-only`, not live long runner evidence.
- Run watchdog against the current heartbeat source:
  - `npm run operator:watchdog -- --heartbeat <path> --max-age-seconds 600 --report <report-path>`
  - add `--stuck-output <stuck-report-path>` when the watchdog should write the stale report automatically.
- Keep every issue-to-PR loop evidence-backed:
  - issue/work item
  - plan artifact with `## Plan`
  - game issue이면 campaign source of truth, Game Studio Department Signoff, Subagent/Team Routing decision
  - branch
  - commits
  - local checks
  - PR URL
  - GitHub checks
  - architect/reviewer verdict when Ralph requires it
  - merge or blocker state
- Prefer small, reversible PRs over one large overnight diff.
- In `$seed-ops` or ongoing operator mode, remote publication is part of the issue loop: push the branch, open/update a draft PR, verify GitHub checks, merge when gates are green, and verify main CI unless a stop rule applies. Do not pause only because the user did not repeat a remote publishing instruction.
- all merge-blocking evidence must be in the original PR before merge/close. post-merge main CI is observation-only: observe the GitHub run, but do not create a post-merge closeout PR or main-targeted closeout commit for the just-merged issue.
- When visual work changes UI, follow Browser Use first policy and save visual evidence under `reports/visual/`.
- When asset/FX work changes gameplay visuals, require gpt-image-2 default or Codex native fallback provenance, gastory-style style state/prompt-model sidecar/reference consistency/animation camera-composition lock/frame-spritesheet plan, manifest QA, and small-size visual review before calling it complete.
- Asset/FX 증거에는 exact bundle field도 남긴다: prompt/model sidecar, reference image consistency, animation camera/composition lock, frame/GIF/spritesheet extraction.
- When research, asset planning, local audit, or QA can run independently, use Codex native subagents or team mode; if not used, record why in Subagent/Team Routing.
- Treat every issue completion as a continuation checkpoint: **완료 보고는 중단 조건이 아니라 체크포인트**다.
- If the user has asked for an ongoing operator run and no stop rule is active, immediately choose the next issue를 plan-first로 선택하고 `## Plan` artifact를 만든 뒤 다음 loop를 시작한다.
- No-final continuation gate: in `$seed-ops`, `final response is terminal`. Stop rule이 없으면 final 응답 대신 commentary checkpoint를 남기고, `next issue plan artifact exists` 상태를 만든다. `left the next queue candidate is not continuation`: 다음 후보를 적어두기만 한 것은 continuation이 아니다.
- PR publication confirmation boundary: Codex App에서 PR/issue/comment 게시가 action-time confirmation을 요구해도 This is not a terminal stop. do not send final just to ask for PR creation. assistant final publication ask is a regression: final로 GitHub 게시 확인을 묻지 않는다. confirmation wording, if unavoidable, must be commentary, not final. write heartbeat before any publication ask를 먼저 수행하고, same-turn local continuation action으로 heartbeat/control room/report/checker/next plan 중 하나를 실제 tool action으로 남긴다. 같은 final publication ask가 반복되면 open a harness-defect fix instead of stopping. Commentary checkpoint로 pending external-publication gate를 남기고, branch/commit/PR body file/pending command/confirmation/next local safe work를 `reports/operations/` 또는 현재 `items/<id>.md`에 기록한 뒤, `next issue plan artifact exists` 상태를 만들고 destructive/external이 아닌 local safe work를 계속한다.
- PR/CI wait continuation is represented by heartbeat phase and watchdog source, not assistant final summaries, completion wording, or publication confirmation wording.

## Recover procedure

When something goes wrong, do not continue silently.

| State | Required action |
| --- | --- |
| Red CI | Inspect `gh run view --log`, write cause/fix attempt, rerun checks, or file blocker report. |
| Stale heartbeat | Run watchdog with `--stuck-output`, write stuck report, restart only after recording the stale state. |
| Merge conflict | Stop the merge, inspect conflict, rebase/resolve on a branch, rerun local checks. |
| Browser Use blocked | Read `browser-use:browser` skill, record direct blocker, use accepted fallback only with evidence. |
| External credential needed | Stop and mark blocked; do not ask the human to paste secrets into reports. |
| Scope touches payment/login/ads/customer data/real GTM/deploy | Stop for explicit approval. |
| Same failure repeats 3+ times | Create blocker report and narrow the next issue. |

## Interruption procedure

Studio/Operator runs do not normally stop. They are interrupted only when one of these is true:

- token/context limit or model runtime exhaustion
- network, GitHub, tool, filesystem, or machine outage prevents further safe action
- the user explicitly says stop/cancel/abort, closes the session, or interrupts the run
- destructive, credential-gated, payment, external-production, or materially branching boundary is required and no safe local continuation remains
- machine sleep, shutdown, crash, or other force majeure

Do not stop only because a PR was merged, a local report was written, an issue was created, a queue was emptied, or a “completed work” summary is ready. Those are checkpoints. The runner must continue to the next legal local action.

`$seed-ops`와 `$seed-studio`에서는 assistant `final` 응답도 interruption으로 취급한다. `final response is terminal`이므로, final을 보내기 전 반드시 interruption evidence가 있어야 한다. `left the next queue candidate is not continuation`: 다음 후보를 적어두기만 한 것은 continuation이 아니다.

Final report requires local main. Before any final user-facing completion/blocker report, the foreground workspace must be back on `main` with clean status, or all remaining work must be preserved in a named recovery stash, branch, or PR and the active shell must still be on `main`.

Codex App의 PR publication confirmation boundary는 단독 stop 사유가 아니다. action-time confirmation이 필요한 representational communication이면 pending external-publication gate를 보고서로 고정하고 로컬 연속 작업을 먼저 찾는다. assistant final publication ask is a regression: final로 GitHub 게시 확인을 묻지 않는다. confirmation wording, if unavoidable, must be commentary, not final. write heartbeat before any publication ask를 먼저 수행하고, same-turn local continuation action을 남긴다. do not send final just to ask for PR creation; 로컬 safe work가 전혀 없을 때만 blocker report로 종료한다.

Before stopping, record:

1. Final heartbeat.
2. Final watchdog status.
3. Open PRs and their checks.
4. Open issues and next queue.
5. Failed work and recovery attempts.
6. Main branch CI status if anything merged.
7. Daily operating report.

## Work completion documentation checklist

Every issue-level loop, including planning-only work, must update durable source of truth before PR publication or completion.

Always update:

1. `items/<id>.md` — status, small win, plan progress, verification, PR/CI evidence.
2. `docs/ROADMAP.md` — milestone row status and `Current Next Action`.
3. `docs/DASHBOARD.md` — generated with `npm run update:dashboard`, then checked with `npm run check:dashboard`.
4. GitHub issue/PR — acceptance criteria, verification, evidence, risk, and visual evidence or `N/A`.

Update conditionally:

- `docs/README.md` and `scripts/check-docs-index.mjs` when a new source-of-truth document is added.
- `docs/PROJECT_COMMANDS.md`, this runbook, `docs/AUTONOMOUS_PROJECT_OPERATING_MODEL.md`, and minimal `AGENTS.md` when operating rules change.
- `docs/NORTH_STAR.md`, `docs/PRD_PHASE0.md`, `docs/IDLE_CORE_CREATIVE_GUIDE.md`, and `docs/DESIGN_SYSTEM.md` when game direction, design, or asset standards change.
- `reports/visual/` and `npm run check:visual` when UI/visual behavior changes.
- `reports/operations/` when an operator run, stuck recovery, or completion checkpoint occurs.

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
- Heartbeat daemon hardening report exists and `npm run operator:trial:gap-guard` plus `npm run operator:watchdog:stuck-guard` pass.
- Red-CI recovery drill or blocker drill evidence still current.
- Browser Use fallback status current.
- No real credentials or external channel actions required.
- Explicit approval if any production/external boundary changes.
