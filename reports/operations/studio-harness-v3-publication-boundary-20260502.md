# Studio Harness v3 Publication Boundary

Status: published
Updated: 2026-05-02

## Boundary

Codex App execution must not hand routine GitHub publication to the human. In this run, GitHub credentials were available and the issue was published by the agent.

## Pending Issue Publication

Title:

```text
Studio Harness v3: GitHub-authoritative source of truth and autonomous runner plane
```

Body file:

```text
reports/operations/studio-harness-v3-issue-body-20260502.md
```

Pending command:

```bash
gh issue create --title "Studio Harness v3: GitHub-authoritative source of truth and autonomous runner plane" --body-file reports/operations/studio-harness-v3-issue-body-20260502.md
```

Published issue:

```text
https://github.com/bborok1234/strange-seed-shop/issues/272
```

## Allowed Local Continuation

- Refine `docs/STUDIO_HARNESS_V3_AUTONOMOUS_DESIGN.md`.
- Prepare Ralph/Team launch prompts.
- Run local validation on docs-only changes.
- Prepare PR body after a branch exists.

## No Longer Blocked By Issue Publication

- A canonical v3 harness WorkUnit now exists as GitHub issue #272.
- Production game work is still forbidden by this issue scope.
- Release/merge claims still require PR/check evidence.
- Treating local campaign ledger as v3 authority remains forbidden.

## Runner Policy Recommendation

Use `autonomous_publish` for the first v3 implementation pass when GitHub credentials remain available. Use `autonomous_local` only if a real tool, credential, or policy blocker appears.
