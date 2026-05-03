# GateEvent — WorkUnit #334 운영사 supervisor가 Codex rate-limit/idle에서 Claude로 자동 폴백하게 한다

```json
{
  "schema_version": "studio-gate-event/v1",
  "event_id": "0334-operator-claude-fallback-supervisor-20260503",
  "event_type": "gate-transition",
  "repo": "bborok1234/strange-seed-shop",
  "issue_number": 334,
  "gate_from": "Intake",
  "gate_to": "Productionization",
  "actor": "codex-ralph",
  "timestamp": "2026-05-03T17:45:00Z",
  "branch": "codex/0334-operator-claude-fallback-supervisor",
  "head_sha": null,
  "pr_number": null,
  "pending_pr_target": "draft PR for codex/0334-operator-claude-fallback-supervisor",
  "publication_state": "pending-publication",
  "evidence_refs": [
    "items/0169-operator-claude-fallback-supervisor.md",
    "scripts/studio-v3-operator.mjs",
    "reports/operations/github-bodies/issue-operator-claude-fallback-supervisor-20260503.md",
    "reports/operations/github-bodies/pr-334-operator-claude-fallback-supervisor-20260503.md",
    "reports/operations/studio-v3-operator-20260503.md",
    "reports/operations/operator-heartbeat-20260503.jsonl"
  ],
  "previous_state_hash": null,
  "next_state_hash": null
}
```

## Notes

- Studio Harness v3 runner-plane reliability 단일 backend 회복 불가 회귀를 닫는다.
- 게임 production surface 변경 없음. accepted manifest asset 변경 없음. 결제/외부 배포/customer data 변경 없음.
- 다음 단계: branch push → draft PR → required checks watch → ready/merge → main CI observation → 다음 P0.5 게임 WorkUnit intake.
