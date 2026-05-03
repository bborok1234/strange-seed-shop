# GateEvent — #290 Studio v3 live runner ready

- WorkUnit: #290 `Studio Harness v3 24h live runner 진입점을 만든다`
- Branch: `codex/0290-studio-v3-24h-live-runner`
- Gate: local verification → PR publication

## Evidence

- Plan artifact: `items/0147-studio-v3-24h-live-runner.md`
- Runner: `scripts/studio-v3-live-runner.mjs`
- Usage: `docs/STUDIO_HARNESS_V3_RUNNER_USAGE.md`
- Checker: `scripts/check-studio-v3-live-runner.mjs`
- Smoke report: `reports/operations/studio-v3-live-runner-20260503.md`

## Checks

- `npm run studio:v3:runner -- --once --dry-run --issue 290 --item items/0147-studio-v3-24h-live-runner.md` → passed
- `npm run check:studio-v3-live-runner` → passed
- `npm run check:studio-v3-bot-runner` → passed
- `npm run check:ops-live` → passed
- `npm run check:ci` → passed

## Next state

Publish PR evidence, watch GitHub checks, merge when green, then observe main CI only. After merge, the next legal WorkUnit should use the live runner path to intake or select a production game quality issue.
