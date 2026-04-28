# Project Docs Index

This folder is the durable memory for `이상한 씨앗상회` and the agent-native game studio/operator experiment around it. The two projects currently share one repository but may split later.

## Current Source of Truth

| Document | Purpose | Read When |
| --- | --- | --- |
| `NORTH_STAR.md` | Dual north star for the game and the agent-native studio/operator | Before choosing strategy or roadmap work |
| `ROADMAP.md` | Milestone tracking, next tasks, current status | Before deciding what to do next |
| `PRD_PHASE0.md` | Phase 0 product requirements and UX contract | Before product or UI work |
| `ECONOMY_PHASE0.md` | Phase 0 economy tables, formulas, tuning levers | Before economy/config work |
| `DESIGN_SYSTEM.md` | Phase 0 UI usage rules, token draft, and visual QA contract | Before UI or visual hierarchy work |
| `UX_REVIEW_20260427.md` | Devil's advocate UX review and Milestone 3.5 guardrails | Before design-system implementation |
| `GAME_STUDIO_REVIEW_20260427.md` | Game Studio 기준 playfield/runtime/sprite 구조 재검토 | Before changing the game runtime or sprite pipeline |
| `SESSION_HANDOFF_20260427.md` | 이번 세션의 작업 맥락과 다음 deep interview 시작점 | Before starting a new session |
| `AUTONOMOUS_PROJECT_OPERATING_MODEL.md` | ClawSweeper-inspired agent operating model | Before automation/project-management work |
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

## Current Operating Summary

The operating project should move toward a ClawSweeper-style autonomous model:

- intake lane normalizes work
- review lane writes evidence-backed proposals
- apply lane mutates only when proposals remain valid
- verify lane proves acceptance criteria
- audit lane detects drift

The shared charter is `NORTH_STAR.md`. Until the richer item system exists, `ROADMAP.md` is the tracking surface.

Current PR automation audit evidence is stored in `reports/audits/pr_automation_20260427.md`.
