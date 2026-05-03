# Project Docs Index

This folder is the durable memory for `이상한 씨앗상회` and the agent-native game studio/operator experiment around it. The two projects currently share one repository but may split later.

## Current Source of Truth

Studio Harness v2 기준의 현재 최상위 source of truth는 repo root의 `README.md`, `STUDIO.md`, `GAME_BRIEF.md`, `ROADMAP.md`와 `campaigns/active.json`이다. 이 `docs/` index는 기존 상세 문서와 historical evidence를 찾기 위한 표면이다. `.omx/`는 runtime cache이며 source of truth가 아니다.

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

- React remains the app shell, save/content/analytics owner, DOM HUD, and secondary panel layer.
- The central garden now uses a Phaser 2D playfield boundary for plot state, tap feedback, ready state, and harvest input.
- Phaser is lazy-loaded into a separate runtime chunk; dense HUD/panels stay in DOM.
- Sprite work should now shift from static card art toward state strips: seed idle, tap response, growth, harvest-ready, and reward FX.
- Studio Harness v2 now treats this implementation as reusable evidence, not an obligation. The next game reboot starts through the active campaign gate ledger before production code changes.

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
