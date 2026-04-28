# Roadmap

Status values:

- `todo`: not started
- `active`: currently being worked
- `blocked`: cannot proceed without a decision or external dependency
- `review`: work exists and needs verification
- `done`: completed with evidence


## Strategic North Star / 전략적 북극성

이 저장소는 현재 하나의 레포 안에 두 프로젝트를 함께 담고 있다.

1. **게임 프로젝트**: `이상한 씨앗상회` — 첫 5분 안에 “얘 귀엽다. 하나만 더 키워볼까?”를 만들고, 이름 있는 생명체 수집과 오프라인 복귀 욕구를 검증한다.
2. **운영사 프로젝트**: 에이전트 네이티브 게임 스튜디오/운영사 — 에이전트가 issue intake, 우선순위 선정, 구현, 검증, draft PR, CI 복구, follow-up issue까지 안전하게 반복하는 운영 계층을 만든다.

공통 헌장은 `docs/NORTH_STAR.md`가 소유한다. 게임 작업은 재미와 수집 욕구를, 운영사 작업은 장시간 자율성과 증거 기반 복구 능력을 개선해야 한다.

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

## Milestone 0.1: Dual North Star + Split-Ready Strategy

Goal: make the game project and the agent-native studio/operator project explicit, while they still share one repository.

| Step | Status | Output | Acceptance Criteria |
| --- | --- | --- | --- |
| Define dual north star | review | `docs/NORTH_STAR.md`, `items/0018-dual-north-star-agent-studio.md` | Game north star and operator north star are written as separate but connected charters |
| Index north star for agents | review | `AGENTS.md`, `docs/README.md`, `scripts/check-docs-index.mjs` | Required reading order and docs index point to `docs/NORTH_STAR.md`; `npm run check:docs` validates it |
| Add split-ready milestone ladder | review | `docs/ROADMAP.md`, `docs/AUTONOMOUS_PROJECT_OPERATING_MODEL.md` | Roadmap distinguishes Ralph-session operator, watchdog, queue, feedback/GTM, 24h operator, and future split |

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
| Seed purchase loop | review | `src/App.tsx`, `items/0012-seed-purchase-loop.md` | Unlocked seeds can be bought into inventory, planted into open plots, and advance the buy-3 mission |
| Expedition reward loop | review | `src/App.tsx`, `items/0013-expedition-reward-loop.md` | Ready expeditions can be claimed for configured rewards and verified through Browser Use |
| Bottom tab surfaces | review | `src/App.tsx`, `items/0014-bottom-tab-surfaces.md` | Bottom tabs switch panel content for garden, seeds, album, expedition, and mock shop surfaces |

## Milestone 3.5: Design System + First 5 Minutes UX Rescue

Goal: improve the first 5 minutes without adding new game systems, while preserving the existing save/content/analytics contracts.

| Step | Status | Output | Acceptance Criteria |
| --- | --- | --- | --- |
| Devil's advocate UX review | review | `docs/UX_REVIEW_20260427.md` | Current UI risks are recorded by severity with allowed/forbidden change boundaries |
| Design system foundation | review | `docs/DESIGN_SYSTEM.md`, `items/0015-design-system-foundation.md` | Usage rules precede tokens; first-session loop, bottom tabs, mock shop safety, and Browser Use evidence requirements are explicit |
| Mobile HUD rescue implementation | review | `src/App.tsx`, `src/styles.css` | 360x800 garden viewport, 1280x900 desktop, 하단 5개 탭, 상점 CTA 안전성이 `reports/visual/design-system-*-20260427.*`로 검증됨 |
| Creature attachment copy v0 | review | `items/0024-creature-attachment-v0.md`, `src/data/creatures.json`, `src/App.tsx` | 첫 수확 reveal, 첫 생명체 카드, 도감 카드가 성격/취향/인사말을 노출하고 `npm run check:content`, `npm run check:loop`가 첫 생명체 애착 문구를 검증함 |

## Milestone 3.6: Phaser Playfield Runtime + Sprite Pipeline Spike

Goal: prove whether the garden must become a real 2D playfield, instead of continuing React DOM dashboard polish.

| Step | Status | Output | Acceptance Criteria |
| --- | --- | --- | --- |
| Game Studio structure review | done | `docs/GAME_STUDIO_REVIEW_20260427.md`, `.omx/specs/deep-interview-game-studio-realignment.md` | CSS-only polish limits, Phaser playfield boundary, and sprite state needs are recorded |
| Phaser central garden playfield transition | done | `items/0016-phaser-playfield-runtime-spike.md`, `src/game/playfield/GardenPlayfieldHost.tsx`, `src/game/playfield/GardenScene.ts`, `vite.config.ts`, `reports/visual/phaser-playfield-*-20260427.png` | React owns save/HUD/panels; Phaser owns central garden playfield; first loop preserves named creature ownership -> album reward -> second plot/next collection goal; Phaser runtime is lazy-loaded into a separate chunk |
| Phaser risk closure and PR readiness | review | `reports/audits/phaser_risk_resolution_20260427.md`, `reports/visual/phaser-browser-use-fallback-20260427.md` | Bundle warning, Browser Use fallback reason, and team shutdown risk are recorded before draft PR publication |
| Starter seed sprite-pipeline first batch | review | `items/0017-starter-seed-sprite-pipeline-first-batch.md`, `public/assets/game/sprites/starter/**`, `public/assets/game/fx/**`, `scripts/check-sprite-batch.mjs` | 6개 starter strip, manifest animation metadata, GardenScene spritesheet loader, sprite batch QA evidence가 `npm run check:all`에 포함됨 |

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
| Audit Branch protection status | done | `reports/audits/branch_protection_20260427.md` | `main.protected=true`; required checks `Verify game baseline`, `Check automerge eligibility` are enforced |
| Generate PR automation audit | review | `scripts/update-pr-automation-audit.mjs`, `reports/audits/pr_automation_20260427.md` | PR automation audit can be regenerated from `gh pr list`; `check:audit` validates snapshot consistency instead of forcing endless self-refresh |
| Browser Use QA gate | review | `scripts/check-browser-qa.mjs`, `reports/visual/browser-use-main-20260427.png` | Browser Use first policy and visual evidence are checked by `npm run check:browser-qa` |

## Milestone 6: Ralph-Session Operating Company v0

Goal: before claiming overnight autonomy again, make a single `$ralph`/Codex session behave like a small operating company that can keep working, prove liveness, and recover from obvious stalls.

| Step | Status | Output | Acceptance Criteria |
| --- | --- | --- | --- |
| Create operator work item schema | review | `items/0019-ralph-session-operating-company-v0.md`, `reports/operations/README.md` | Work items distinguish game feature, game content, agent ops, feedback, GTM mock, and safety-gated tasks |
| Add heartbeat ledger | review | `.omx/state/operator-heartbeat.json`, `reports/operations/operator-heartbeat-20260428.jsonl`, `scripts/write-operator-heartbeat.mjs` | A running session writes timestamp, phase, branch, PR, current command, and next action at least once per iteration |
| Add Ralph stuck report procedure | review | `docs/AUTONOMOUS_PROJECT_OPERATING_MODEL.md`, `reports/operations/stuck-drill-20260428.md`, `scripts/report-operator-stuck.mjs` | `collab: Wait`, stale tmux, orphan process, red CI, and timeout states produce explicit reports instead of false completion |
| Add CI repair loop contract | review | `docs/PR_AUTOMATION.md`, `reports/operations/operator-loop-20260428.md` | PR checks are polled; red checks trigger log inspection, fix attempt, re-run, or blocker report |
| Prove one closed loop | done | Issue #25, PR #26, Issue #27, `reports/operations/operator-loop-20260428.md` | One issue/work item reached branch -> commit -> PR -> local checks -> GitHub checks -> follow-up issue/comment without main auto-merge |

## Milestone 7: Supervised Multi-Hour Operator

Goal: run for multiple hours under supervision with budget, safety gates, and restart behavior before attempting 24-hour operation.

| Step | Status | Output | Acceptance Criteria |
| --- | --- | --- | --- |
| Build watchdog runner | review | `scripts/operator-watchdog.mjs`, `reports/operations/watchdog-fresh-drill-20260428.md`, `reports/operations/watchdog-stale-drill-20260428.md` | Runner detects stale heartbeat and records a reportable state before supervised restart behavior |
| Add iteration budget and stop rules | review | `docs/AUTONOMOUS_PROJECT_OPERATING_MODEL.md`, `reports/operations/operator-trial-template-20260428.md` | Time, branch, risk, and network/credential stop conditions are explicit before long-running trials |
| Create supervised trial dry-run | review | `scripts/operator-trial-dry-run.mjs`, `reports/operations/operator-trial-dry-run-20260428.md` | Trial lifecycle report is generated from fixtures without real 2h/4h/24h execution |
| Add 2h supervised trial readiness gate | review | `reports/operations/operator-trial-readiness-20260428.md`, `scripts/check-operator-trial-readiness.mjs` | Time, token/context, branch, network, credential, heartbeat, CI, and automerge stop rules are checked before any real 2h run |
| Run 2-hour supervised trial | todo | `reports/operations/operator-trial-*.md` | Heartbeat coverage, work completed, failures, CI status, and recovery attempts are recorded |
| Run 4-hour supervised trial | todo | `reports/operations/operator-trial-*.md` | At least one complete issue-to-PR loop or an honest blocker report exists; no red PR is called complete |

## Milestone 8: Feedback + GTM Mock Intake

Goal: make the operating company ingest player/customer/GTM signals safely before touching real external accounts.

| Step | Status | Output | Acceptance Criteria |
| --- | --- | --- | --- |
| Create feedback intake format | review | `reports/playtests/README.md`, `reports/playtests/playtest-intake-sample-20260428.md`, `items/0025-feedback-intake-and-fun-rubric-v0.md` | Playtest/customer notes become normalized items with severity, product axis, evidence, duplicate links, and recommended next item |
| Add game fun rubric | review | `docs/NORTH_STAR.md`, `scripts/check-playtest-intake.mjs` | First 5 minutes, cuteness, collection desire, comeback hook, and confusion are scored consistently by `npm run check:playtest-intake` |
| Add GTM mock lane | todo | `reports/gtm/` | Bot can draft devlog/release note/community post proposals without publishing or using credentials |
| Add approval gates for real channels | todo | `docs/APPLY_CONDITIONS.md` | Email/SNS/ads/store listing/payment/customer data actions require explicit human approval |

## Milestone 9: 24-Hour Agent-Native Studio Prototype

Goal: only after Milestones 6-8 are proven, attempt a 24-hour bot that behaves like a cautious junior game studio operator.

| Step | Status | Output | Acceptance Criteria |
| --- | --- | --- | --- |
| Create 24h runbook | todo | `docs/OPERATOR_RUNBOOK.md` | Start, monitor, recover, stop, and summarize procedures are explicit |
| Add daily operating report | todo | `reports/operations/daily-*.md` | Human can wake up and see completed work, failed work, open PRs, red checks, decisions, and next queue |
| Run 24h dry run without external credentials | todo | `reports/operations/operator-24h-*.md` | No production side effects; heartbeat, CI repair, issue/PR loop, and escalation behavior are evidenced |
| Prepare split-ready operator package | todo | docs/scripts package plan | Operator surfaces that should move to a future separate repo are inventoried |

## Current Next Action

`docs/NORTH_STAR.md`가 게임 프로젝트와 에이전트 네이티브 운영사 프로젝트의 공통 헌장으로 추가되었다. 현재 운영사 쪽은 Issue #33의 supervised 2h trial을 heartbeat/watchdog 증거와 함께 실행 중이며, feedback lane은 Issue #36으로 플레이테스트 intake와 첫 5분 fun rubric을 고정한다.

1. Starter sprite batch evidence는 `items/0017-starter-seed-sprite-pipeline-first-batch.md`와 `scripts/check-sprite-batch.mjs`에 고정되어 있으며, 게임 작업은 계속 **이름 있는 생명체 수집**과 첫 5분 재미를 우선한다.
2. 첫 loop는 starter seed -> plant -> tap growth -> harvest -> named creature ownership -> album reward -> second plot/next collection goal 순서를 보존한다.
3. Issue #25/PR #26, Issue #27/PR #28, Issue #29/PR #30, Issue #31/PR #32로 운영사 루프, watchdog, trial dry-run, readiness gate가 닫혔고, 현재 후속 작업은 Issue #33의 실제 2h trial 증거를 완성하는 것이다.
4. Issue #34 / PR #35는 merge 완료되어 생명체의 성격/취향/인사말을 수확 reveal·소유 카드·도감에 노출한다.
5. Issue #36 / `items/0025-feedback-intake-and-fun-rubric-v0.md`는 실제 고객 데이터나 외부 채널 없이 플레이테스트 신호를 severity/product axis/evidence/duplicate/fun rubric/next item으로 정규화하는 안전한 feedback 작업이다.
6. 24시간 봇, 고객 피드백 실채널, GTM 실게시, 광고/결제/계정/credential 사용은 Milestone 6-8의 안전 장치와 명시 승인이 생기기 전까지 금지한다.
7. 실제 결제, 로그인/account, ads SDK, external navigation, runtime image generation은 계속 제외한다.
