# #288 closed WorkUnit mirror consistency report — 2026-05-03

## Source of truth

GitHub issue/PR/main CI state is authoritative. This report only mirrors evidence so deterministic local checks can detect stale roadmap/control-room text.

## Observed closed WorkUnits

| Issue | PR | GitHub state | Merge commit | Main CI |
| --- | --- | --- | --- | --- |
| #284 | #285 | CLOSED / MERGED at 2026-05-03T00:48:04Z | `a4633599d90f7adad1844cd8f3ce8cb5dabf8d35` | `25265967477` success |
| #286 | #287 | CLOSED / MERGED at 2026-05-03T01:03:06Z | `dc7fa42514146291a67f8ce0294d2150da535ee1` | `25266229841` success |

## Regression

After these WorkUnits closed, `docs/ROADMAP.md` still listed #284 and #286 as `review`, and Current Next Action/control room still described #286/#284 as active missions. That stale mirror can mislead queue selection even though it cannot authorize work.

## Preventive rule

`npm run check:closed-workunit-mirrors` reads `reports/operations/closed-workunit-mirror-manifest-20260503.json` and fails when:

- a GitHub-closed WorkUnit remains `review` in the roadmap row,
- required PR/main CI evidence is missing from the roadmap row,
- Current Next Action or control room still uses forbidden active-mission phrases for closed WorkUnits,
- the active WorkUnit mirror does not point to #288 / `items/0146-closed-workunit-mirror-consistency.md`.
