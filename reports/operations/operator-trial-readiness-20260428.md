# Operator 2h Trial Readiness Gate - 2026-04-28

Status: ready-gated
Scope-risk: moderate
Issue: #31
Mode: readiness-only

## 목적

실제 2시간 supervised operator trial을 시작하기 전에, 실행 예산과 중단 조건을 검증 가능한 checklist로 고정한다. 이 report는 trial을 시작하지 않으며, readiness만 판정한다.

## Gate checklist

| Gate | Status | Evidence |
| --- | --- | --- |
| Time budget | pass | 2h hard cap, 10m stale heartbeat recovery check |
| Token/context budget | pass | 80% context 이상이면 checkpoint 후 축소/중단 |
| Branch hygiene | pass | trial work starts from dedicated `codex/` branch, no direct main commit |
| Network boundary | pass | GitHub issue/PR/check polling only; no external product deployment |
| Credential boundary | pass | no secrets, customer data, payment, login, ads SDK, real GTM channels |
| Heartbeat monitoring | pass | `npm run operator:watchdog -- --heartbeat <path> --max-age-seconds 600` |
| Verification commands | pass | `npm run check:operator`, `npm run check:all` |
| Required reports | pass | heartbeat JSONL, stuck report if stale, trial report, PR comment evidence |
| CI repair loop | pass | red check -> log inspect -> local reproduce -> fix -> rerun -> blocker after 3 repeats |
| Automatic merge boundary | pass | `ENABLE_AGENT_AUTOMERGE` remains off unless separately approved |

## Go / no-go decision

- Readiness outcome: `ready-for-supervised-start`
- Automatic immediate 2h run: `no-go-in-this-slice`
- Next action: create a dedicated supervised trial issue/PR that starts only after recording live monitor command, branch, stop deadline, and initial heartbeat.

## Monitor command draft

```bash
npm run operator:watchdog -- --heartbeat reports/operations/operator-heartbeat-YYYYMMDD.jsonl --max-age-seconds 600
```

## Stop rules

- Stop if heartbeat is stale for more than 10 minutes and watchdog cannot classify recovery safely.
- Stop if the same CI failure class repeats 3 times.
- Stop before any credential, customer data, external deployment, real GTM, payment/login/ads SDK action.
- Stop if branch diverges from the intended trial branch or requires direct main mutation.
- Stop and checkpoint if context budget exceeds 80% or evidence cannot be persisted.
