# Project Docs Index

This folder is the durable memory for `이상한 씨앗상회` and the agent-native game studio/operator experiment around it. The two projects currently share one repository but may split later.

## Source Ownership Boundary

이 repo의 root는 더 이상 active game app root가 아니다. root는 npm scripts, CI, Studio/operator, 문서 index를 묶는 orchestrator다.

| Lane | Code | Docs | Evidence | Rule |
| --- | --- | --- | --- | --- |
| Legacy/reference playable | `apps/legacy-react-playable/` | `docs/legacy/README.md`와 기존 P0/P0.5 docs | 기존 `reports/visual/*`, `reports/playtests/*` | 기존 React playable을 보존/검증한다. 신규 Phaser WorkUnit의 active spec이 아니다 |
| Active Phaser greenfield | `apps/seed-garden-phaser/` | `docs/phaser/README.md`, `docs/phaser/VERTICAL_SLICE_SPEC.md` | 신규 `reports/phaser/*` 또는 `reports/visual/phaser-*` | #433 이후 신규 gameplay 구현은 여기서 시작한다 |
| Studio/operator | `.codex/skills/studio-*`, `scripts/studio-*`, `scripts/check-*` | `docs/studio/`, `docs/PROJECT_COMMANDS.md`, `docs/OPERATOR_CONTROL_ROOM.md` | `reports/operations/*` | 게임별 구현 spec이 아니라 cross-game 운영 계층이다 |

호환성을 위해 root `npm run dev`는 `apps/legacy-react-playable/`을 연다. 신규 Phaser 구현은 `npm run dev:phaser`와 `apps/seed-garden-phaser/`를 사용한다.

## Current Source of Truth

Studio Harness v2 기준의 현재 최상위 source of truth는 repo root의 `README.md`, `STUDIO.md`, `GAME_BRIEF.md`, `ROADMAP.md`와 `campaigns/active.json`이다. 이 `docs/` index는 기존 상세 문서와 historical evidence를 찾기 위한 표면이다. `.omx/`는 runtime cache이며 source of truth가 아니다.

### Phase / Spec Hierarchy

Phase 이름은 서로 대체 관계가 아니라 층위다. 새 작업자는 아래 순서로 읽고, 충돌하면 더 높은 active tier를 따른다.

| Tier | 문서 | 역할 | 충돌 시 판단 |
| --- | --- | --- | --- |
| 0 | `NORTH_STAR.md` | 게임/운영사 최상위 방향과 production bar | 항상 우선 |
| 1 | `PRD_PHASE0.md`, `ECONOMY_PHASE0.md` | Phase 0 baseline product/economy/safety contract: 첫 루프, 저장, mock monetization, 결제/로그인/런타임 이미지 생성 금지 | P0.5/P0.6도 이 안전 계약을 넘을 수 없음 |
| 2 | `docs/phaser/README.md`, `docs/phaser/VERTICAL_SLICE_SPEC.md` | 신규 Phaser greenfield active gameplay source-of-truth | #433 이후 신규 Phaser WorkUnit은 이 기준을 우선 적용 |
| 2L | `DESIGN.md`, `ART_HUD_PRODUCTION_SPEC.md`, `IDLE_CORE_PRODUCTION_SPEC.md` | legacy/reference production overlay: 기존 React playable rescue와 경쟁작 리서치 기록 | `docs/phaser/*`에서 명시적으로 import한 기준만 active Phaser spec으로 승격 |
| 3 | `DESIGN_SYSTEM.md`, `GAME_UI_UX_RESEARCH_20260428.md`, `IDLE_CORE_CREATIVE_GUIDE.md` | 구현 위생, 과거 리서치, creative direction, vertical-slice workflow | Tier 2와 충돌하면 Tier 2를 우선하고, 필요한 근거만 가져옴 |
| 4 | `items/`, `reports/` | 특정 WorkUnit의 plan/evidence/history | 해당 issue 범위 안에서만 source of truth |

용어 규칙:

- `Phase 0`: MVP baseline contract다. 오래된 것이 아니라 안전/데이터/첫 루프의 하한선이다.
- `P0 UI/UX rescue`: Phase 0 화면 위생과 모바일/탭/QA 회귀를 정리한 과거 rescue lane이다.
- `P0.5`: 현재 active playable을 production급 idle collection tycoon으로 끌어올리는 overlay다.
- `P0.6`: 아직 확정 milestone이 아니라 `IDLE_CORE_PRODUCTION_SPEC.md`에 적은 다음 후보 core slices 이름이다. Roadmap이 active milestone로 승격하기 전까지는 후보로만 본다.

| Document | Purpose | Read When |
| --- | --- | --- |
| `../STUDIO.md` | Studio Harness v2 gate graph, source authority, role contract | Before autonomous studio/gate work |
| `STUDIO_HARNESS_V3_AUTONOMOUS_DESIGN.md` | GitHub-authoritative Studio Harness v3, GateEvent state model, and no-human runner plane execution spec | Before replacing v2 local ledger authority or launching Ralph/Team for v3 |
| `STUDIO_HARNESS_V3_RUNNER_USAGE.md` | Studio Harness v3 live runner usage: once smoke, 24h run, watchdog, stop/recovery, and production-game intake behavior | Before starting or observing the 24h AI-native game studio runner |
| `../GAME_BRIEF.md` | Game reboot brief and active campaign direction | Before game reboot planning |
| `../ROADMAP.md` | Current concise Studio Harness v2 roadmap | Before choosing current next gate |
| `../campaigns/active.json` | Single active campaign registry | Before `seed-studio` gate transitions |
| `NORTH_STAR.md` | Dual north star for the game and the agent-native studio/operator | Before choosing strategy or roadmap work |
| `ROADMAP.md` | Milestone tracking, next tasks, current status | Before deciding what to do next |
| `PROJECT_COMMANDS.md` | 프로젝트 전용 명령어와 v3 운영 진입점: `npm run studio:v3:operate`, `$seed-brief`, `$seed-design`, `$seed-qa`, `$seed-play`; `$seed-ops`는 deprecated adapter | Before choosing operating/report/design/QA/playable mode |
| `PRD_PHASE0.md` | Phase 0 product requirements and UX contract | Before product or UI work |
| `ECONOMY_PHASE0.md` | Phase 0 economy tables, formulas, tuning levers | Before economy/config work |
| `DESIGN.md` | Game-level UI/UX judgment rules, screen contracts, and production-ready design criteria | Before deciding whether a game screen is good enough |
| `ART_HUD_PRODUCTION_SPEC.md` | Garden art/HUD production spec for plot, actor, label, motion, HUD budget, and visual QA | Before implementing garden, production, order, research, or expedition HUD moments |
| `IDLE_CORE_PRODUCTION_SPEC.md` | Competitor-backed idle core gameplay spec for production loop, bottlenecks, upgrades, offline return, and long meta | Before choosing or implementing core gameplay WorkUnits |
| `phaser/README.md` | 신규 Phaser active lane index와 code/docs/evidence boundary | Before creating greenfield Phaser game WorkUnits |
| `phaser/VERTICAL_SLICE_SPEC.md` | Phaser-first 신규 정원 vertical slice 제작 규격: 기존 앱 visual rewrite 동결, 낮은 관리 카메라, 감상 모드, actor care/carry/reward FX stage plan | Before creating greenfield Phaser game WorkUnits or deciding whether to migrate away from the legacy playable |
| `legacy/README.md` | 기존 React playable/P0/P0.5 docs를 reference로 분류하는 boundary | Before using old design/HUD/core docs as reference |
| `PHASER_GREENFIELD_VERTICAL_SLICE_SPEC.md` | Compatibility alias to `phaser/VERTICAL_SLICE_SPEC.md` | Only for old links; do not treat as the active editing surface |
| `PRODUCTION_SLICE_READINESS.md` | Blocking readiness gate for the next core gameplay slice, starting with bottleneck-readable production graph | Before opening or merging the next core gameplay PR |
| `DESIGN_SYSTEM.md` | Phase 0 UI usage rules, token draft, and visual QA contract | Before UI or visual hierarchy work |
| `UX_REVIEW_20260427.md` | Devil's advocate UX review and Milestone 3.5 guardrails | Before design-system implementation |
| `GAME_STUDIO_REVIEW_20260427.md` | Game Studio 기준 playfield/runtime/sprite 구조 재검토 | Before changing the game runtime or sprite pipeline |
| `GAME_UI_UX_RESEARCH_20260428.md` | P0 게임 UI/UX 리서치, 화면 비율, HUD, CLI visual QA, alpha asset 결정 | Before major UI/visual QA work |
| `IDLE_CORE_CREATIVE_GUIDE.md` | P0.5 idle core, production UI, asset bible, Codex vertical-slice workflow | Before game/content/UI/asset feature work |
| `SESSION_HANDOFF_20260427.md` | 이번 세션의 작업 맥락과 다음 deep interview 시작점 | Before starting a new session |
| `SESSION_HANDOFF_20260429.md` | 최신 운영/게임 방향 전환과 재개 지점 | Before restarting Codex/OMX after this session |
| `AUTONOMOUS_PROJECT_OPERATING_MODEL.md` | ClawSweeper-inspired agent operating model | Before automation/project-management work |
| `OPERATOR_RUNBOOK.md` | 장시간 `$ralph` 운영사의 start, monitor, recover, stop, summarize 절차 | Before supervised 4h/24h operator runs |
| `OPERATOR_CONTROL_ROOM.md` | 사람이 현재 mission, small win, evidence, playable mode를 한눈에 보는 운영 상황판 | Before/while running autonomous sessions |
| `PLAYABLE_MODE.md` | Agent 작업 중에도 사람이 `main` 게임을 별도 worktree/port로 실행하는 절차 | Before manual playtesting during agent work |
| `BROWSER_QA.md` | Browser Use 기반 로컬 브라우저 검증 절차 | Before visual/mobile QA |
| `PR_AUTOMATION.md` | PR 자동 검증과 제한적 자동 머지 정책 | Before CI/PR automation work |
| `AUTOMERGE_GOVERNANCE.md` | 자동 머지 활성화 전 Branch protection과 변수 운영 조건 | Before changing GitHub merge settings |
| `REPORTING.md` | 자율 작업 보고서와 감사 보고서 형식 | Before adding reports/items |
| `APPLY_CONDITIONS.md` | 에이전트 적용 lane의 gate와 중단 조건 | Before applying autonomous changes |
| `DASHBOARD.md` | 현재 상태, 다음 작업, 검증 상태 요약 | At the start/end of each milestone |

## Project-Local Skills

The first asset-production workflow is stored under `.codex/skills/`.

| Skill | Purpose |
| --- | --- |
| `gpt-game-asset-plan` | Creates `assets/source/asset_plan.json` |
| `gpt-game-asset-prompt` | Converts the asset plan into `assets/source/asset_prompts.json` |
| `gpt-game-asset-generate` | Uses Codex native image generation one asset at a time |
| `gpt-game-asset-review` | Reviews assets and prepares `assetManifest.json` |
| `seed-studio` | `$seed-studio`: Studio Harness v2 gate graph and Keep/Kill/Pivot workflow |
| `seed-ops` | `$seed-ops`: deprecated adapter for approved Productionization tasks only; not the Studio Harness v3 entrypoint |
| `seed-brief` | `$seed-brief`: evidence-backed status/reporting mode |
| `seed-design` | `$seed-design`: design/product/operator conversation mode |
| `seed-qa` | `$seed-qa`: practical browser/visual QA mode |
| `seed-play` | `$seed-play`: prepare the playable main worktree/port |
| `studio-deliberate` | `$studio-deliberate`: Codex-native adapter for `docs/studio/DELIBERATION_WORKFLOW.md` with repo-native persona/proposal/critique/spec artifacts |

## Current Product Summary

`이상한 씨앗상회` is a browser-first idle collection game. The Phase 0 loop is:

```text
choose seed -> plant -> tap/wait -> harvest creature -> album/upgrade -> expedition teaser -> offline reward -> repeat
```

Phase 0 validates:

- first creature under 90 seconds
- first meaningful upgrade under 5 minutes
- first expedition under 10 minutes
- offline reward comeback
- mock monetization interest
- static asset pipeline

Current Game Studio direction:

- `apps/legacy-react-playable/`는 React app shell, save/content/analytics, DOM HUD, 기존 Phaser 2D playfield를 포함한 reference playable이다.
- `apps/seed-garden-phaser/`는 신규 Phaser-first 정원의 active runtime lane이다.
- 신규 Stage 1/2/3 작업은 기존 React/CSS rescue가 아니라 `docs/phaser/*`와 `apps/seed-garden-phaser/`에서 시작한다.
- Sprite/FX 작업은 `docs/phaser/VERTICAL_SLICE_SPEC.md`와 신규 app manifest policy에 맞춰 진행한다.

## Current Operating Summary

The operating project should move toward a ClawSweeper-style autonomous model:

- intake lane normalizes work
- review lane writes evidence-backed proposals
- apply lane mutates only when proposals remain valid
- verify lane proves acceptance criteria
- audit lane detects drift

The shared charter is `NORTH_STAR.md`. Until the richer item system exists, `ROADMAP.md` is the tracking surface.

Current PR automation audit evidence is stored in `reports/audits/pr_automation_20260427.md`.

For Studio Harness v3, use `npm run studio:v3:operate` for foreground operation and `npm run studio:v3:runner` for watcher/decision heartbeat. For Studio Harness v2, use `seed-studio` and the active campaign ledger before using Ralph/OMX. `$seed-ops` cannot choose the next issue, cannot serve as the v3 entrypoint, and cannot cite `.omx` as product truth.
