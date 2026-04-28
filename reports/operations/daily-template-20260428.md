# Daily Operating Report Template

Status: template
Issue: #51
Run date: YYYY-MM-DD
Time window: `<start UTC>` → `<end UTC>`
Operator mode: `$ralph` supervised / dry-run / manual recovery
Branch base: `main`
Main CI status: unknown until filled

## Executive summary

- What changed:
- Why it matters for the game north star:
- Why it matters for the operator north star:
- Overall status: green / yellow / red

## Completed work

| Issue | PR | Branch | Area | Verification | Merge/main status |
| --- | --- | --- | --- | --- | --- |
| # | # | `codex/...` | game_feature / agent_ops / feedback / GTM mock | local + GitHub checks | merged / open / blocked |

## Failed or blocked work

| Work | Failure mode | Evidence | Recovery attempt | Next action |
| --- | --- | --- | --- | --- |
| N/A | N/A | N/A | N/A | N/A |

## Open PRs

| PR | Head | Required checks | Blocking decision | Owner |
| --- | --- | --- | --- | --- |
| N/A | N/A | N/A | N/A | agent |

## Red checks

| Run/check | URL | Cause hypothesis | Action taken | Current status |
| --- | --- | --- | --- | --- |
| N/A | N/A | N/A | N/A | green |

## Decisions made

- Decision:
  - Reason:
  - Evidence:
  - Rejected alternatives:

## Stop rules observed

- No credential access.
- No customer data storage.
- No payment/login/account/ads SDK/external deployment.
- No real GTM publishing.
- `ENABLE_AGENT_AUTOMERGE` was not enabled unless explicitly approved.
- Red CI was not called complete.

## Verification evidence

- Local checks:
  - `npm run check:operator`
  - `npm run check:all`
- GitHub checks:
  - Verify game baseline:
  - Check automerge eligibility:
- Main CI after merge:
- Architect/reviewer verdict:

## Next queue

1. Next safe item:
2. Blocked item needing human decision:
3. Follow-up issue to open:
