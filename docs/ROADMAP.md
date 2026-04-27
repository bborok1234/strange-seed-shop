# Roadmap

Status values:

- `todo`: not started
- `active`: currently being worked
- `blocked`: cannot proceed without a decision or external dependency
- `review`: work exists and needs verification
- `done`: completed with evidence

## Current Milestone

**Milestone 0: Planning and Autonomous Project Backbone**

Goal: make the project understandable to future agents, then produce enough asset and product scaffolding to start the Phase 0 MVP without re-planning.

| Step | Status | Output | Evidence |
| --- | --- | --- | --- |
| Define Phase 0 product contract | done | `docs/PRD_PHASE0.md` | Product flow, screens, analytics, acceptance criteria documented |
| Define Phase 0 economy contract | done | `docs/ECONOMY_PHASE0.md` | Seed table, currencies, formulas, tuning levers documented |
| Define autonomous operating model | done | `docs/AUTONOMOUS_PROJECT_OPERATING_MODEL.md` | Intake/review/apply/verify/audit lanes documented |
| Create project-local asset skills | done | `.codex/skills/gpt-game-asset-*` | Four skill surfaces created |
| Create docs index and agent guide | done | `AGENTS.md`, `docs/README.md`, `docs/ROADMAP.md` | Current file |

## Next Milestone

**Milestone 1: Static Asset Pipeline Proof**

Goal: prove that Codex native image generation can repeatedly produce usable game assets and store them as project-local static files.

| Step | Status | Output | Acceptance Criteria |
| --- | --- | --- | --- |
| Create first asset plan | done | `assets/source/asset_plan.json` | 20 planned assets with stable ids, categories, families, output paths; JSON parsed successfully |
| Create first prompt batch | done | `assets/source/asset_prompts.json` | 20 prompts created; all map to planned assets with acceptance checks |
| Generate first sample assets | done | `public/assets/game/**` | 20 generated assets saved in workspace, not only Codex cache; generation status recorded |
| Review generated assets | done | `reports/assets/asset_review_20260427.md` | 20 accepted, 0 rejected; follow-up optimization risks documented |
| Create asset manifest | done | `public/assets/manifest/assetManifest.json` | 20 accepted assets registered with path, category, family, rarity, dimensions |

## Milestone 2: Phase 0 Game Scaffold

Goal: create the playable browser foundation.

| Step | Status | Output | Acceptance Criteria |
| --- | --- | --- | --- |
| Choose frontend stack and scaffold app | done | Vite/React app | `npm run build` succeeds and app shell renders the garden screen |
| Add content config schemas | done | `src/data/*.json` | Seeds, creatures, growth curves, rewards, expeditions, missions, shop surfaces load from config |
| Add local persistence | done | `src/lib/persistence.ts` | Local save interface and first-save creation stub exist |
| Add asset manifest loading | done | `src/lib/assetManifest.ts` | UI renders static assets by manifest id |

## Milestone 3: First Playable Loop

Goal: implement the minimum game loop from first seed to first comeback.

| Step | Status | Output | Acceptance Criteria |
| --- | --- | --- | --- |
| Starter seed flow | done | Garden onboarding | Starter seed selection implemented in app state |
| Plant/grow/tap/harvest | done | Core garden loop | First seed growth is 30s; tap acceleration and harvest implemented |
| Album and first upgrade | done | Album + upgrade UI | First harvest + album reward can buy first upgrade |
| Expedition teaser | done | Expedition screen | First expedition duration is 5 minutes and can be started after discovery |
| Offline reward | done | Comeback reward modal | 15+ minute local comeback reward calculation implemented |

## Milestone 4: Economy and Verification

Goal: make the game measurable and tunable.

| Step | Status | Output | Acceptance Criteria |
| --- | --- | --- | --- |
| Economy simulator | done | `scripts/simulate-economy.mjs` | 1h/D1/D3/D7 projections exist and run with `npm run simulate:economy` |
| Analytics event log | done | `src/lib/analytics.ts` | Required first-loop events are tracked to localStorage |
| Acceptance test checklist | done | `docs/ACCEPTANCE_PHASE0.md` | PRD and economy criteria are listed with verification commands |
| Visual/mobile QA | blocked | screenshots/report | Browser screenshot automation not yet available in this session |

## Milestone 5: Autonomous Project Management Scaffold

Goal: make the project increasingly self-managing.

| Step | Status | Output | Acceptance Criteria |
| --- | --- | --- | --- |
| Create `items/` work records | todo | `items/*.md` | Roadmap tasks can be represented as item records |
| Create review report format | todo | `reports/reviews/*.md` | Agents can propose changes without applying them |
| Create apply conditions | todo | docs/scripts | Mutations require valid proposal + acceptance criteria |
| Create audit report | todo | `reports/audits/*.md` | Drift between docs, items, code, assets is detectable |
| Create dashboard | todo | `docs/DASHBOARD.md` | Current status, next item, verification health visible |

## Current Next Action

Milestone 4 is complete except visual/mobile screenshot QA, which is blocked until browser screenshot automation is available.

1. Either run visual/mobile QA with a browser screenshot tool.
2. Or start Milestone 5 autonomous project-management scaffold.

Do not start the React/Vite implementation until Milestone 1 has at least one accepted asset batch or the user explicitly asks to use placeholder assets.
