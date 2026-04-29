# 프로젝트 에이전트 가이드

## 언어 규칙

- 이 프로젝트의 문서, 작업 보고, 로드맵 업데이트, 리뷰 보고서, 커밋 메시지는 기본적으로 한국어로 작성한다.
- 영어는 코드 식별자, 파일명, API/라이브러리 고유명, 외부 도구 명령, 또는 원문 인용이 필요한 경우에만 사용한다.
- 기존 문서에 영어가 남아 있더라도 새로 추가하거나 수정하는 내용은 한국어 우선으로 작성하고, 필요할 때 점진적으로 한국어화한다.
- 한영 병기는 명확성이 크게 좋아질 때만 사용한다. 반복적인 이중 표기는 피한다.

## Project Intent

This repository currently contains two related projects that may later split: the game **이상한 씨앗상회** and the agent-native game studio/operator that builds and runs it.

The product goal is to build **이상한 씨앗상회**, a browser-first idle collection game where players grow strange seeds into collectible plant-creatures, claim offline rewards, upgrade a greenhouse, and eventually expand into light expedition and liveops systems.

The operating goal is to evolve this repository toward a ClawSweeper-style autonomous project system: agents should be able to inspect the current state, choose the next scoped item, propose changes, apply safe changes, verify results, recover failures, create draft PRs, and leave durable evidence without the human restating context every time.

The shared north star for both projects is documented in `docs/NORTH_STAR.md`. Treat it as the top-level product/operating charter before choosing roadmap work.

## Required Reading Order

Before substantial work, read these files in order:

1. `docs/README.md` - document index and current source of truth
2. `docs/NORTH_STAR.md` - dual north star for the game and agent-native studio/operator
3. `docs/ROADMAP.md` - milestone status and next work
4. `docs/PROJECT_COMMANDS.md` - project-specific mode commands (`$seed-ops`, `$seed-brief`, `$seed-design`, `$seed-qa`, `$seed-play`)
5. `docs/PRD_PHASE0.md` - Phase 0 product contract
6. `docs/ECONOMY_PHASE0.md` - Phase 0 economy contract
7. `docs/AUTONOMOUS_PROJECT_OPERATING_MODEL.md` - agent-management model

For image asset work, also read the relevant project-local skill:

- `.codex/skills/gpt-game-asset-plan/SKILL.md`
- `.codex/skills/gpt-game-asset-prompt/SKILL.md`
- `.codex/skills/gpt-game-asset-generate/SKILL.md`
- `.codex/skills/gpt-game-asset-review/SKILL.md`

For browser visual QA, use the Codex Browser Use plugin first:

- `browser-use:browser` with the in-app browser `iab` backend is the default path for local browser inspection, DOM snapshots, clicks, and screenshots.
- Do not fall back to separate Playwright scripts, Computer Use, or macOS screenshots until Browser Use has been tried and the blocker is recorded.
- Persist important visual QA evidence under `reports/visual/`.

## North Star Direction

- This repo currently hosts both the game project and the agent-native studio/operator project. Preserve the boundary so they can split later.
- Game north star: make players feel “얘 귀엽다. 하나만 더 키워볼까?” within the first 5 minutes.
- Operator north star: make agents safely progress from issue intake to implementation, verification, draft PR, CI recovery, and follow-up evidence without the human restating context.
- Before attempting long-running autonomy again, prefer building Ralph-session reliability: heartbeat, watchdog, stuck recovery, CI repair, and daily evidence reports.

## Product Direction

- Build Phase 0 first; do not jump to full live-service scope.
- Keep the first playable loop narrow: plant, tap, harvest, collect, upgrade, expedition teaser, offline reward.
- Runtime gameplay must not call image generation tools or APIs.
- Static assets should be produced ahead of time through Codex native image generation skills by default.
- GPT-image-2 API or CLI batch generation is optional and only for explicit model-controlled, separately billed production runs.
- Monetization in Phase 0 is mock/click-intent only. No real payment integration without explicit approval.

## Autonomous Operating Rules

- Track meaningful work in `docs/ROADMAP.md` until a richer `items/` system exists.
- 프로젝트 전용 명령어는 `docs/PROJECT_COMMANDS.md`를 따른다. `$seed-ops`는 무한 운영모드, `$seed-brief`는 보고/상황판, `$seed-design`은 설계 대화, `$seed-qa`는 실기 QA, `$seed-play`는 사람 플레이 준비다.
- Issue/work-item 단위 작업은 반드시 plan-first로 시작한다. 새 issue를 선택하면 코드/문서 구현 전에 `items/<id>.md` 또는 동등한 plan artifact에 `## Plan`, 수용 기준, 검증 명령, 리스크를 적고 그 plan에 맞춰 branch 작업을 시작한다.
- Use evidence-backed docs and reports rather than implicit memory.
- Separate proposal from mutation for risky work.
- Keep changes scoped, reversible, and tied to acceptance criteria.
- When adding new implementation work, update the roadmap with status and verification evidence.
- 장시간 `$ralph`/운영모드에서 완료 보고는 중단 조건이 아니라 체크포인트다. 명시 중단, 시간 상한, 외부 승인, 치명적 blocker가 없으면 다음 issue를 plan-first로 선택하고 계속 진행한다.
- Do not stop at a milestone boundary when `docs/ROADMAP.md` names a clear next action and the next action is safe, local, and non-destructive.
- A progress report is not a handoff. Continue through the current roadmap chain until the next step is blocked, destructive, requires credentials/network approval, or needs a product decision.
- If a task touches payments, external deployment, credentials, policy-sensitive monetization, destructive migration, or production user data, stop for explicit approval.

## Current Recommended Sequence

1. Create first static asset plan: `assets/source/asset_plan.json`
2. Create first prompt batch: `assets/source/asset_prompts.json`
3. Generate 20 sample assets using Codex native image generation
4. Review assets and create `public/assets/manifest/assetManifest.json`
5. Scaffold the Phase 0 React/Vite browser game
6. Implement the first loop and local persistence
7. Add economy simulation and acceptance verification
8. Add work-item/report/audit scaffolding for autonomous project management

## Continuation Contract

When executing roadmap work:

1. Complete the requested step.
2. Verify its acceptance criteria.
3. Update `docs/ROADMAP.md`.
4. If the updated `Current Next Action` is clear and safe, continue automatically.
5. In long-running operator mode, treat summaries as checkpoints and immediately choose the next issue with a `## Plan`.
6. Stop only when the next action is ambiguous, risky, destructive, externally gated, timeboxed, blocked, or explicitly paused by the user.

## Documentation Discipline

- `docs/README.md` owns the document index.
- `docs/NORTH_STAR.md` owns the shared game/operator north star and split-ready strategy.
- `docs/ROADMAP.md` owns milestone tracking.
- `docs/PRD_PHASE0.md` owns product scope.
- `docs/ECONOMY_PHASE0.md` owns economy values and formulas.
- `docs/AUTONOMOUS_PROJECT_OPERATING_MODEL.md` owns agent workflow and safety gates.

When these documents disagree, prefer the most specific document for the task and update the stale document in the same change.
