# 프로젝트 에이전트 가이드

## 언어 규칙

- 이 프로젝트의 문서, 작업 보고, 로드맵 업데이트, 리뷰 보고서, 커밋 메시지는 기본적으로 한국어로 작성한다.
- 영어는 코드 식별자, 파일명, API/라이브러리 고유명, 외부 도구 명령, 또는 원문 인용이 필요한 경우에만 사용한다.
- 기존 문서에 영어가 남아 있더라도 새로 추가하거나 수정하는 내용은 한국어 우선으로 작성하고, 필요할 때 점진적으로 한국어화한다.
- 한영 병기는 명확성이 크게 좋아질 때만 사용한다. 반복적인 이중 표기는 피한다.

## Project Intent

This repository is an experimental autonomous-agent-managed game project.

The product goal is to build **이상한 씨앗상회**, a browser-first idle collection game where players grow strange seeds into collectible plant-creatures, claim offline rewards, upgrade a greenhouse, and eventually expand into light expedition and liveops systems.

The operating goal is to evolve this repository toward a ClawSweeper-style autonomous project system: agents should be able to inspect the current state, choose the next scoped item, propose changes, apply safe changes, verify results, and leave durable evidence without the human restating context every time.

## Required Reading Order

Before substantial work, read these files in order:

1. `docs/README.md` - document index and current source of truth
2. `docs/ROADMAP.md` - milestone status and next work
3. `docs/PRD_PHASE0.md` - Phase 0 product contract
4. `docs/ECONOMY_PHASE0.md` - Phase 0 economy contract
5. `docs/AUTONOMOUS_PROJECT_OPERATING_MODEL.md` - agent-management model

For image asset work, also read the relevant project-local skill:

- `.codex/skills/gpt-game-asset-plan/SKILL.md`
- `.codex/skills/gpt-game-asset-prompt/SKILL.md`
- `.codex/skills/gpt-game-asset-generate/SKILL.md`
- `.codex/skills/gpt-game-asset-review/SKILL.md`

## Product Direction

- Build Phase 0 first; do not jump to full live-service scope.
- Keep the first playable loop narrow: plant, tap, harvest, collect, upgrade, expedition teaser, offline reward.
- Runtime gameplay must not call image generation tools or APIs.
- Static assets should be produced ahead of time through Codex native image generation skills by default.
- GPT-image-2 API or CLI batch generation is optional and only for explicit model-controlled, separately billed production runs.
- Monetization in Phase 0 is mock/click-intent only. No real payment integration without explicit approval.

## Autonomous Operating Rules

- Track meaningful work in `docs/ROADMAP.md` until a richer `items/` system exists.
- Use evidence-backed docs and reports rather than implicit memory.
- Separate proposal from mutation for risky work.
- Keep changes scoped, reversible, and tied to acceptance criteria.
- When adding new implementation work, update the roadmap with status and verification evidence.
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
5. Stop only when the next action is ambiguous, risky, destructive, externally gated, or explicitly paused by the user.

## Documentation Discipline

- `docs/README.md` owns the document index.
- `docs/ROADMAP.md` owns milestone tracking.
- `docs/PRD_PHASE0.md` owns product scope.
- `docs/ECONOMY_PHASE0.md` owns economy values and formulas.
- `docs/AUTONOMOUS_PROJECT_OPERATING_MODEL.md` owns agent workflow and safety gates.

When these documents disagree, prefer the most specific document for the task and update the stale document in the same change.
