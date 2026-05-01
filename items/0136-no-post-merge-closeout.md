# No post-merge closeout evidence PR

Status: verified
Owner: agent
Created: 2026-05-02
Updated: 2026-05-02
Work type: ops_harness
Scope-risk: moderate
Issue: local

## Intent

PR #267 merge 이후 main CI evidence를 repo에 backfill하려고 별도 closeout PR #268을 만든 것은 안티패턴이다. `$seed-ops`는 evidence를 해당 PR이 닫히기 전에 PR body/issue body/report에 포함해야 하며, PR merge/close 이후에는 main을 대상으로 closeout commit/PR을 만들지 않는다.

## Plan

1. Close and discard the accidental closeout PR path.
2. Add a checker that fails new `reports/operations/*closeout-body*.md` PR/issue body files.
3. Require seed-ops docs and PR template to state:
   - all merge-blocking evidence must be in the original PR before merge/close;
   - post-merge main CI is observed externally, not backfilled through main-targeted commits;
   - no post-merge closeout PR for the just-merged issue.
4. Add the checker to `check:ci`.
5. Verify with targeted checks and full local CI.

## Acceptance Criteria

- [x] A new closeout body file like `reports/operations/pr-0132-lunar-harvest-closeout-body.md` fails the checker.
- [x] Docs distinguish original-PR evidence from post-merge observation.
- [x] `check:ci` runs the no-post-merge-closeout checker.
- [x] `npm run check:ci` passes.

## Verification

- `npm run check:no-post-merge-closeout` - pass.
- `npm run check:seed-ops-queue` - pass.
- `npm run check:github-metadata` - pass.
- `npm run check:ci` - pass.

## Risks

Historical closeout reports already exist. This first guard blocks the specific body-file pattern used to create a new post-merge closeout PR, while leaving historical reports readable.
