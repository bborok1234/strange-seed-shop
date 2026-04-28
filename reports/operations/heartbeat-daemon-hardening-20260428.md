# Heartbeat Daemon Hardening Report — 2026-04-28

Status: review
Issue: #84
Scope-risk: moderate

## 요약

Issue #53의 4h trial에서 발견된 702.5초 heartbeat gap을 24h run 전 차단하기 위해 heartbeat daemon runner, stale-gap dry-run guard, watchdog stuck-report guard를 추가했다.

## 변경 사항

- `scripts/operator-heartbeat-daemon.mjs`: 별도 process로 즉시 heartbeat를 쓰고, 지정 interval마다 heartbeat JSON/JSONL과 summary/pid 파일을 갱신한다.
- `scripts/operator-trial-dry-run.mjs`: `max_gap_seconds`와 `--max-gap-seconds`를 평가해 600초 초과 gap을 `dry-run-review`로 분류한다.
- `scripts/check-operator-trial-gap-guard.mjs`: 702.5초 gap fixture가 반드시 실패하는지 검증한다.
- `scripts/operator-watchdog.mjs`: stale/missing/invalid heartbeat일 때 `--stuck-output` report를 남긴다.
- `scripts/check-operator-watchdog-stuck-report.mjs`: stale watchdog이 non-zero로 끝나고 stuck report를 쓰는지 검증한다.

## Evidence

- Normal dry-run: `reports/operations/operator-trial-dry-run-20260428.md` — `Status: dry-run-pass`, `Stale gap windows: 0`.
- Stale gap guard: `reports/operations/operator-trial-stale-gap-guard-20260428.md` — `Status: dry-run-review`, `Stale gap windows: 1`, `702.5`.
- Daemon proof: `.omx/logs/heartbeat-daemon-proof.jsonl` — 1초 interval, 2 heartbeat, watchdog fresh.
- Watchdog stuck proof: `.omx/state/watchdog-stuck-guard-report.md` — stale heartbeat age 660s over 600s threshold recorded as `Status: reported`.

## Verification

- `npm run operator:trial:dry-run` PASS
- `npm run operator:trial:gap-guard` PASS
- `npm run operator:watchdog:stuck-guard` PASS
- `npm run check:operator` PASS
- `npm run check:all` PASS

## Safety

- No credentials, customer data, payment, login/account, ads SDK, external deployment, or real GTM channel action.
- `ENABLE_AGENT_AUTOMERGE` remains disabled.
- No branch protection bypass.

## Remaining risk

This does not run a real 24h session. It only makes the next 24h dry run safer by failing stale-gap fixtures and giving the operator a separate heartbeat process to start before long waits.
