## Studio GateEvent — #274 migration-backfill

#274 migration/backfill slice is linked to PR #280. This machine-readable event records the GitHub-authoritative migration-backfill transition.

<!-- STUDIO_GATE_EVENT:START -->
{
  "schema_version": "studio-gate-event/v1",
  "event_id": "gate-274-migration-backfill-6528e9a",
  "event_type": "migration-backfill",
  "repo": "bborok1234/strange-seed-shop",
  "issue_number": 274,
  "gate_from": "Intake",
  "gate_to": "Productionization",
  "actor": "codex",
  "timestamp": "2026-05-02T16:43:48.380Z",
  "branch": "codex/0274-v2-ledger-quarantine",
  "head_sha": "6528e9ab620e345c18a848036a1be1611af74860",
  "pr_number": 280,
  "pending_pr_target": null,
  "publication_state": "published",
  "verification_status": "check:ci-pass-local",
  "evidence_refs": [
    "items/0141-v2-ledger-quarantine-backfill.md",
    "reports/operations/studio-v3-migration-backfill-20260503.json",
    "reports/operations/studio-v3-migration-backfill-20260503.md",
    "scripts/check-studio-v3-migration-backfill.mjs"
  ],
  "previous_state_hash": "sha256:8193f16de985f67ca03d3b1602cdf41cb6001f28ba45f7899333266509f38faf",
  "next_state_hash": "sha256:e664d7200cfffac21563443879171fa25df86360e91cf0ac94a7b7682a26e677"
}
<!-- STUDIO_GATE_EVENT:END -->
