# Operator Trial Report Template

Status: template
Scope-risk: moderate
Applies to: Milestone 7 supervised multi-hour operator trial

## Trial metadata

- Trial id:
- Started at:
- Ended at:
- Operator branch:
- Related issues:
- Related PRs:
- Human-approved budget:

## Heartbeat coverage

| Window | Expected heartbeat count | Observed heartbeat count | Freshness result | Evidence |
| --- | ---: | ---: | --- | --- |
| 0-30m | TBD | TBD | TBD | `reports/operations/operator-heartbeat-*.jsonl` |

## Completed work

| Item | Status | Evidence |
| --- | --- | --- |
| TBD | TBD | TBD |

## Failures and recovery attempts

| Failure | Detection source | Recovery attempt | Result | Follow-up |
| --- | --- | --- | --- | --- |
| TBD | watchdog / CI / stuck report | TBD | TBD | TBD |

## CI status

| PR | Check | Result | URL |
| --- | --- | --- | --- |
| TBD | Verify game baseline | TBD | TBD |
| TBD | Check automerge eligibility | TBD | TBD |

## Stop rules observed

- Stop for credential/payment/customer data/external deployment need.
- Stop for repeated failure class after 3 recovery attempts.
- Stop when heartbeat is stale and watchdog cannot recover safely.
- Stop when human explicitly interrupts.

## Next queue

- TBD
