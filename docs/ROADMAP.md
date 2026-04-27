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
| Choose frontend stack and scaffold app | todo | Vite/React app or equivalent | App runs locally and shows the garden screen |
| Add content config schemas | todo | `config/*.json` or `src/data/*.json` | Seeds, creatures, growth curves, rewards load from config |
| Add local persistence | todo | local save layer | Refresh preserves player state |
| Add asset manifest loading | todo | manifest loader | UI renders static assets by manifest id |

## Milestone 3: First Playable Loop

Goal: implement the minimum game loop from first seed to first comeback.

| Step | Status | Output | Acceptance Criteria |
| --- | --- | --- | --- |
| Starter seed flow | todo | Garden onboarding | Starter seed selected under 20 seconds |
| Plant/grow/tap/harvest | todo | Core garden loop | First creature acquired under 90 seconds |
| Album and first upgrade | todo | Album + upgrade UI | First meaningful upgrade under 5 minutes |
| Expedition teaser | todo | Expedition screen | First expedition can start under 10 minutes |
| Offline reward | todo | Comeback reward modal | 15-minute and cap-length absences calculate correctly |

## Milestone 4: Economy and Verification

Goal: make the game measurable and tunable.

| Step | Status | Output | Acceptance Criteria |
| --- | --- | --- | --- |
| Economy simulator | todo | script or spreadsheet-like config simulator | 1h/D1/D3/D7 projections exist |
| Analytics event log | todo | local event logger | Required PRD events captured |
| Acceptance test checklist | todo | test docs or automated tests | PRD and economy criteria can be verified |
| Visual/mobile QA | todo | screenshots/report | 360px mobile viewport has no primary UI clipping |

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

Milestone 1 is complete. Start Milestone 2 unless the user requests another asset batch.

1. Scaffold the Phase 0 browser app.
2. Add content config schemas.
3. Add local persistence.
4. Add asset manifest loading.

Do not start the React/Vite implementation until Milestone 1 has at least one accepted asset batch or the user explicitly asks to use placeholder assets.
