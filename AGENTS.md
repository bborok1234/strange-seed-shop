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
- If Browser Use or Node REPL `js` is not initially visible, search for the Node REPL `js` execution tool before declaring Browser Use unavailable.
- Do not fall back to separate Playwright scripts, Computer Use, or macOS screenshots until Browser Use has been tried and the blocker is recorded.
- Past Browser Use blocker reports are historical evidence only; they cannot justify fallback for a new UI/visual task.
- Playwright CLI is a repeatable regression gate, not a replacement for Browser Use hands-on QA evidence.
- User-reported screenshots are source-of-truth reproduction states. Before claiming a UI fix, reproduce the same URL, viewport, and action sequence, save a before/after screenshot, and add a regression check for the exact failure mode.
- For mobile visual QA, text/DOM presence is insufficient. Visible panels and cards must also pass layout invariants: no body scroll, no bottom-tab overlap, no visible child with `scrollHeight > clientHeight`, and no `overflow: hidden` masking important content.
- Persist important visual QA evidence under `reports/visual/`.

For game work, use the Game Studio plugin as the product-quality routing layer before treating the task like ordinary web UI:

- Start mixed game work with `game-studio:game-studio`, then route immediately to the relevant specialist: `game-studio:game-ui-frontend` for HUD/menu/layout, `game-studio:game-playtest` for browser-game QA and screenshot review, `game-studio:phaser-2d-game` for Phaser runtime work, `game-studio:web-game-foundations` for simulation/render/UI boundaries, and `game-studio:sprite-pipeline` for 2D sprite animation workflow.
- Game/UI issues must state their Game Studio route in the issue/plan and PR body. If a task touches visible gameplay, HUD, playfield, assets, or QA and no Game Studio route is recorded, the plan is incomplete.
- For UI/HUD changes, `game-studio:game-ui-frontend` rules are blocking: protect the playfield, keep persistent HUD low-density, collapse secondary panels, and avoid generic dashboard layouts.
- For production-ready claims, `game-studio:game-playtest` style evidence is required: first actionable screen, main verbs, HUD readability, playfield obstruction, screenshot evidence, and findings in severity order. DOM/layout assertions alone are not enough.

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
- New game graphics assets must come from OpenAI Images API `gpt-image-2` or Codex native image generation provenance. Do not create or accept SVG/vector/code-native drawings as an accepted manifest game asset in `public/assets/manifest/assetManifest.json`.
- gpt-image/API generation uses `OPENAI_API_KEY` and `SEED_ASSET_IMAGE_MODEL`; without the key, the generation step is a hard blocker rather than a reason to invent local vector art.
- If gpt-image-2 API is blocked by credit/quota/rate limit/organization verification/model access, fall back to Codex native image generation, still saving raster PNG workspace files only.
- If an issue claims an asset/FX payoff, it must leave `gpt-game-asset-plan -> gpt-game-asset-prompt -> gpt-game-asset-generate -> gpt-game-asset-review` evidence, or explicit gpt-image-2 API provenance, and must pass `npm run check:asset-provenance` and `npm run check:asset-style`.
- Animation/FX work cannot be satisfied by a static icon alone. Sprite/FX candidates must specify a sprite sheet or FX strip, frame count, frame size, intended frame rate, manifest `animation.binding`, and Browser Use/playtest observation.
- Monetization in Phase 0 is mock/click-intent only. No real payment integration without explicit approval.

## Autonomous Operating Rules

- Track meaningful work in `docs/ROADMAP.md` until a richer `items/` system exists.
- 프로젝트 전용 명령어는 `docs/PROJECT_COMMANDS.md`를 따른다. `$seed-ops`는 무한 운영모드, `$seed-brief`는 보고/상황판, `$seed-design`은 설계 대화, `$seed-qa`는 실기 QA, `$seed-play`는 사람 플레이 준비다.
- Issue/work-item 단위 작업은 반드시 plan-first로 시작한다. 새 issue를 선택하면 코드/문서 구현 전에 `items/<id>.md` 또는 동등한 plan artifact에 `## Plan`, 수용 기준, 검증 명령, 리스크를 적고 그 plan에 맞춰 branch 작업을 시작한다.
- 다음 issue 선택은 "안전하고 작은 작업" 우선이 아니라 `docs/NORTH_STAR.md`의 경쟁작 기준 Production Bar와 `docs/IDLE_CORE_CREATIVE_GUIDE.md`의 vertical slice workflow 우선이다. safety는 금지/승인/복구 gate일 뿐 우선순위 기준이 아니다.
- `$seed-ops`가 새 게임 issue를 고를 때는 `player verb + production/progression role + screen moment + asset/FX + playtest evidence` 중 최소 3개가 있는 후보를 먼저 고른다. `asset/FX` 축은 기존 asset 재사용만으로는 통과하지 않는다. 새 후보는 `playfield state`, `HUD affordance`, `sprite/FX`, `order crate visual state`, `reward motion` 중 최소 하나의 concrete visual/game-feel payoff와 경쟁작 production gap을 명시해야 한다. 색/여백/문구/단순 주문 추가/copy tweak/test-only 작업은 production vertical slice blocker를 제거하고 위 visual payoff를 동반할 때만 선택한다.
- 게임 기능/UI/에셋/QA issue는 plan-first 전에 Game Studio route를 고정한다. 최소 `game-studio:game-studio` umbrella 판단과 specialist route(`game-ui-frontend`, `game-playtest`, `phaser-2d-game`, `web-game-foundations`, `sprite-pipeline` 등)를 기록한다.
- UI/visual acceptance는 `docs/GAME_UI_UX_RESEARCH_20260428.md`, `docs/IDLE_CORE_CREATIVE_GUIDE.md`, `docs/DESIGN_SYSTEM.md`의 북극성과 Game Studio rules를 기준으로 삼는다. “겹치지 않음”만으로는 통과가 아니며, 첫 화면이 게임 장면으로 읽히고 즉시 행동이 명확해야 한다.
- UI/visual 회귀는 사용자 화면 기준이다. DOM에 텍스트가 있거나 Playwright assertion이 통과해도, 스크린샷에서 카드 내부가 잘리거나 하단 탭에 가리면 실패로 처리하고 source-of-truth 문서와 테스트를 같이 고친다.
- Use evidence-backed docs and reports rather than implicit memory.
- Separate proposal from mutation for risky work.
- Keep changes scoped, reversible, and tied to acceptance criteria.
- When adding new implementation work, update the roadmap with status and verification evidence.
- `$ralph` prompt-side activation과 실제 장시간 runner를 분리한다. `.omx/state/sessions/<id>/ralph-state.json`이 `active:true`, `current_phase:"starting"`, `iteration:0`이고 runner metadata가 없으면 `prompt-side-only`이며, 4h/6h/overnight 운영은 detached `omx ralph`/`omx exec` runner artifact, heartbeat source, watchdog source가 있을 때만 주장한다. Lifecycle 판단은 assistant message 문구 감지가 아니라 structured state, heartbeat, watchdog, runner artifact를 기준으로 한다.
- 장시간 `$ralph`/운영모드에서 완료 보고는 중단 조건이 아니라 체크포인트다. 명시 중단, 시간 상한, 외부 승인, 치명적 blocker가 없으면 다음 issue를 plan-first로 선택하고 계속 진행한다.
- No-final continuation gate: `$seed-ops`에서 assistant `final` 응답은 terminal action이다. `final response is terminal`을 전제로, stop rule이 없으면 final 대신 commentary checkpoint를 남기고 `next issue plan artifact exists` 상태를 만든다. `left the next queue candidate is not continuation`.
- `$seed-ops` 또는 명시적 장시간 운영모드에서는 branch push, draft PR 생성/갱신, GitHub checks 확인, merge, main CI 확인까지가 issue loop의 완료 조건이다. 사용자가 원격 게시를 한 번 더 말하지 않았다는 이유만으로 확인 질문을 하지 않는다. credential, 외부 배포, 결제/광고/고객 데이터, destructive boundary, 실채널 GTM은 stop/approval gate를 우선한다.
- all merge-blocking evidence must be in the original PR before merge/close. post-merge main CI is observation-only: merge 후 main CI는 GitHub run으로 관찰하고, 닫힌 PR/issue evidence를 repo에 backfill하기 위한 main-targeted closeout commit을 만들지 않는다. do not create a post-merge closeout PR; 누락이 있으면 다음 plan-first harness defect issue로 분리한다.
- Codex App에서 GitHub PR/issue/comment 게시가 action-time confirmation을 요구하면 `PR publication confirmation boundary`로 취급한다. This is not a terminal stop; do not send final just to ask for PR creation. assistant final publication ask is a regression: final로 GitHub 게시 확인을 묻지 않는다. confirmation wording, if unavoidable, must be commentary, not final. write heartbeat before any publication ask를 먼저 수행하고, same-turn local continuation action으로 heartbeat/control room/report/checker/next plan 중 하나를 실제 tool action으로 남긴다. 같은 final publication ask가 반복되면 open a harness-defect fix instead of stopping. Commentary checkpoint와 `reports/operations/` 또는 현재 `items/<id>.md`에 pending external-publication gate, branch/commit/PR body file/pending command/confirmation/next local safe work를 기록하고, `next issue plan artifact exists` 상태를 만든 뒤 destructive/external이 아닌 local safe work를 계속한다.
- Issue 종료 전 `items/<id>.md`, `docs/ROADMAP.md`, `docs/DASHBOARD.md`(`npm run update:dashboard`), GitHub issue/PR evidence를 갱신한다. 세부 규칙은 `docs/PROJECT_COMMANDS.md`와 `docs/OPERATOR_RUNBOOK.md`를 따른다.
- GitHub issue/PR/comment 본문은 운영사 evidence surface다. `gh issue create/edit`, `gh pr create/edit`, `gh issue comment`, `gh api .../comments`를 사용할 때 본문은 반드시 markdown 파일로 작성하고 `--body-file` 또는 API file payload로 제출한다. 셸 인자 안에 `\n`을 넣어 본문을 만들지 않는다.
- PR/issue/comment는 기존 `.github` 템플릿의 `요약`, `Small win`, `사용자/운영자 가치`, `Before / After 또는 Visual evidence`, `Playable mode`, `검증`, `안전 범위`, `남은 위험`, `연결된 issue` 수준을 유지한다. 짧은 PR도 해당 없음 사유를 적고 섹션을 삭제하지 않는다.
- PR 본문의 `작업 checklist`는 삭제하지 않는다. UI/visual 변경이면 Browser Use 우선 QA evidence 또는 blocker를 남기고, Playwright/CDP는 fallback으로만 기록한다.
- Do not stop at a milestone boundary when `docs/ROADMAP.md` names a clear North Star vertical slice candidate and the next action is non-destructive and not externally gated.
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
4. If the updated `Current Next Action` names a clear North Star vertical slice candidate and no stop rule applies, continue automatically.
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
