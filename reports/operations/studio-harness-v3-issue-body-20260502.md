## Intent

Make Studio Harness issue/PR-scoped, GitHub-authoritative, and capable of unattended operation through runner/watchdog policy boundaries.

## Plan/Spec

Implement from `docs/STUDIO_HARNESS_V3_AUTONOMOUS_DESIGN.md`.

This issue is about the studio harness, not the game. Do not create gameplay issues, do not modify production game features, and do not advance any campaign gate from local ledger alone.

## Allowed Scope

- Studio docs and skill contracts
- Local mirror schema migration
- Deterministic studio harness checks
- Runner continuity/readiness docs and dry-run evidence
- GitHub issue/PR/body templates
- PublicationBoundary handling for Codex App confirmation limits

## Forbidden Scope

- Production game feature changes
- New gameplay issue creation before v3 gate rules
- Merge/automerge enablement without explicit governance
- Payment, ads, credentials, external deployment, production user data
- Local campaign ledger gate advance without a valid GitHub GateEvent

## Acceptance Criteria

- GitHub issue/PR are operational authority.
- Issue/PR bodies are projection only.
- GateEvent chain and state hash rules are documented and checked.
- Local ledger cannot authorize work.
- Pending publication blocks completion/release claims.
- Runner liveness requires heartbeat TTL, watchdog, branch SHA, PR target, and detached artifact.
- v2 local-only active work is backfilled or quarantined.
- Ralph/Team execution handoff includes preflight, staffing, and verification path.

## Verification

- `npm run check:studio-harness`
- `npm run check:github-metadata`
- `npm run check:project-commands`
- `npm run check:ci`

## Game Studio Route

Harness Auditor + Studio Director. No game production route in this issue.

## Source Spec

- `docs/STUDIO_HARNESS_V3_AUTONOMOUS_DESIGN.md`
