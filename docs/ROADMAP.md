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
| Mission reward loop | review | `src/App.tsx`, `items/0011-mission-reward-loop.md` | First-loop actions advance missions and completed missions pay leaves once |

## Milestone 4: Economy and Verification

Goal: make the game measurable and tunable.

| Step | Status | Output | Acceptance Criteria |
| --- | --- | --- | --- |
| Economy simulator | done | `scripts/simulate-economy.mjs` | 1h/D1/D3/D7 projections exist and run with `npm run simulate:economy` |
| Analytics event log | done | `src/lib/analytics.ts` | Required first-loop events are tracked to localStorage |
| Acceptance test checklist | done | `docs/ACCEPTANCE_PHASE0.md` | PRD and economy criteria are listed with verification commands |
| Visual/mobile QA | done | `reports/visual/browser_use_qa_20260427.md` | Browser Use 오프라인 복귀 QA, 360px 모바일 캡처, 1280px 데스크톱 캡처까지 확인 |

## Milestone 5: Autonomous Project Management Scaffold

Goal: make the project increasingly self-managing.

| Step | Status | Output | Acceptance Criteria |
| --- | --- | --- | --- |
| Create `items/` work records | done | `items/0001-pr-automation-trial.md` | 첫 자동화 작업이 item record로 표현되고 검증 기록이 남음 |
| Create PR verification scaffold | review | `.github/workflows/ci.yml`, `.github/workflows/agent-automerge.yml`, `docs/PR_AUTOMATION.md` | 로컬 검증 통과; GitHub Actions 실행 증거는 push/PR 이후 필요 |
| Create review report format | review | `docs/REPORTING.md`, `reports/reviews/README.md` | Agents can propose changes without applying them |
| Create apply conditions | review | `docs/APPLY_CONDITIONS.md`, `scripts/check-apply-conditions.mjs` | Mutations require valid proposal + acceptance criteria |
| Create audit report | review | `reports/audits/audit_20260427.md`, `scripts/check-docs-index.mjs` | Drift between docs, items, code, assets is detectable |
| Create dashboard | review | `docs/DASHBOARD.md`, `scripts/update-dashboard.mjs` | Current status, next item, verification health visible and checkable |
| Document automerge governance | review | `docs/AUTOMERGE_GOVERNANCE.md`, `scripts/check-governance.mjs` | Branch protection, required checks, and `ENABLE_AGENT_AUTOMERGE` operating rules are checkable |
| Accumulate PR automation audit | review | `reports/audits/pr_automation_20260427.md`, `scripts/check-audit-reports.mjs` | PR #1-#5 automation results are preserved and checkable |
| Audit Branch protection status | review | `reports/audits/branch_protection_20260427.md` | `main.protected=false` and Branch protection access limit are recorded |
| Generate PR automation audit | review | `scripts/update-pr-automation-audit.mjs`, `reports/audits/pr_automation_20260427.md` | PR automation audit can be regenerated from `gh pr list`; `check:audit` validates snapshot consistency instead of forcing endless self-refresh |
| Browser Use QA gate | review | `scripts/check-browser-qa.mjs`, `reports/visual/browser-use-main-20260427.png` | Browser Use first policy and visual evidence are checked by `npm run check:browser-qa` |

## Current Next Action

Browser Use 기반 스크린샷 자동화, 핵심 클릭 플로우, 오프라인 복귀, 모바일/데스크톱 캡처가 확인됐다.

1. Mission reward loop 브랜치를 PR로 올려 GitHub Actions의 PR 이벤트 검증을 확인한다.
2. 자동 머지 trial을 통해 main에 반영한다.
3. Browser Use로 미션 보상 UI를 클릭 검증하고 다음 게임 기능 작업을 `items/` 단위로 등록한다.
