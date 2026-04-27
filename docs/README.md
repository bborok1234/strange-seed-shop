# Project Docs Index

This folder is the durable memory for `이상한 씨앗상회` and the autonomous project-management experiment around it.

## Current Source of Truth

| Document | Purpose | Read When |
| --- | --- | --- |
| `ROADMAP.md` | Milestone tracking, next tasks, current status | Before deciding what to do next |
| `PRD_PHASE0.md` | Phase 0 product requirements and UX contract | Before product or UI work |
| `ECONOMY_PHASE0.md` | Phase 0 economy tables, formulas, tuning levers | Before economy/config work |
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

## Current Operating Summary

The project should move toward a ClawSweeper-style autonomous model:

- intake lane normalizes work
- review lane writes evidence-backed proposals
- apply lane mutates only when proposals remain valid
- verify lane proves acceptance criteria
- audit lane detects drift

Until the richer item system exists, `ROADMAP.md` is the tracking surface.
