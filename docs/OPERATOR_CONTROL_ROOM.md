# Operator Control Room / 운영 상황판

<!-- OPERATOR_CONTROL_ROOM_SNAPSHOT:START -->
## Live Snapshot

Generated at: 2026-05-07T19:19:43.594Z

## Current mission

현재 작업은 **Phaser v1 repeat order after third plot harvest**이다. #453 third plot seed planting loop는 PR #454로 merge/main CI까지 통과했고, 다음 blocker는 `3번 햇살 밭` 수확과 두 번째 주문 납품이 아직 반복 루프 copy/state로 분명히 구분되지 않는 것이다.

현재 evidence:

- User decision: studio operate로 게임 v1 버전을 끝까지 구현한다.
- Active game source: `docs/GAME_BIBLE.md`
- Production companion: `docs/GAME_PRODUCTION_SPEC.md`
- Phaser foundation: `docs/phaser/REBOOT_FOUNDATION_SPEC.md`
- Completed foundation: Issue #433, PR #439, main CI `25507779300`
- Completed plan/prompt batch: Issue #440, PR #441, main CI `25508532265`
- WorkUnit: `items/0237-topology-asset-generation-review.md`
- Completed generation/review: Issue #442, PR #443, main CI `25511678907`
- Completed topology runtime integration: Issue #444, PR #445, main CI `25512501021`
- Completed actor/FX strip normalization: Issue #446, PR #447, main CI `25513369383`
- Completed Momo carrier/order crate motion: Issue #448, PR #449, main CI `25514108801`
- Completed order crate delivery reward motion: Issue #432, PR #450, main CI `25514890197`
- Completed third plot expansion unlock: Issue #451, PR #452, main CI `25515782343`
- Completed third plot seed planting loop: Issue #453, PR #454, main CI `25516527365`
- WorkUnit: `items/0244-repeat-order-after-third-plot-harvest.md`
- GitHub issue: #455 `Phaser v1 repeat order after third plot harvest`
- Draft PR: #456 `Phaser v1 repeat order after third plot harvest`
- Runtime source: `apps/seed-garden-phaser/src/main.ts`
- State source: `apps/seed-garden-phaser/src/gameState.ts`
- Visual report: `reports/visual/issue-0455-repeat-order-after-third-plot-harvest/visual-report-20260508.md`
- Current validation: `npm run check:phaser` pass, `npm run check:ci` pass
- Heartbeat: `reports/operations/operator-heartbeat-20260507.jsonl`, `.omx/state/operator-heartbeat.json`

즉시 적용할 gate:

1. Studio Campaign Gate: #455는 plot_03 harvest payoff를 repeat order delivery로 다시 순환시킨다.
2. Repeat harvest/order state는 existing generated plot/order crate/FX raster states만 사용하고 runtime image generation/API/cache를 호출하지 않는다.
3. 다음 WorkUnit은 storage unlock, offline/storage cap, Browser Use/playtest evidence 중 최소 하나의 visual/game-feel payoff를 포함해야 한다.
4. Runtime gameplay는 image generation/API/cache를 호출하지 않고 workspace PNG 또는 manifest path만 사용해야 한다.
5. 단순 주문 추가, copy tweak, test-only 작업은 production vertical slice blocker를 제거하고 visual/game-feel payoff를 동반할 때만 허용한다.

## Local state

- Branch: codex/v1-repeat-order-after-third-plot-harvest
- Latest commit: 5d20eb8 반복 주문 PR 증거를 준비한다
- Dirty files: present

## Heartbeat

- Source: .omx/state/operator-heartbeat.json
- Timestamp: 2026-05-07T19:19:35.859Z
- Phase: phaser-v1-repeat-order-after-third-plot-harvest-pr
- Issue: 455
- PR: 456
- Item: items/0244-repeat-order-after-third-plot-harvest.md
- Next action: gate: mark PR #456 ready, watch checks, merge if green

## Open PRs

- #456 draft Phaser v1 repeat order after third plot harvest — https://github.com/bborok1234/strange-seed-shop/pull/456

## Open issues

- #455 Phaser v1 repeat order after third plot harvest — https://github.com/bborok1234/strange-seed-shop/issues/455
- #434 Phaser 신규 정원에 감상 모드와 HUD 접기를 만들기 — https://github.com/bborok1234/strange-seed-shop/issues/434

## Playable mode

- Prepare stable main worktree: `npm run play:main`
- Serve stable main game: `cd ../strange-seed-shop-play && npm run dev:legacy -- --host 127.0.0.1 --port 5174`
- URL: http://127.0.0.1:5174

## Visual evidence rule

- UI/game PR: link before/after screenshots under `reports/visual/`.
- Docs/scripts-only PR: write `N/A — UI 변화 없음` and link check output/report.

## Next stop gate

Stop only after PR required checks, main CI, and local `npm run check:all` are green, or after a written blocker report. The next work queue should name a North Star production vertical slice, not a merely safe small task.

## PR publication boundary

Routine GitHub issue/PR/comment publication is a Studio Harness v3 runner responsibility in this repository. If credentials/tools are available, `gh issue create/edit/comment`, `gh pr create/edit/comment/ready/merge`, branch push, check inspection, and merge are checkpoints, not action-time confirmation waits. This is not a terminal stop: do not send final just to ask for PR creation.

assistant final publication ask is a regression: final로 GitHub 게시 확인을 묻지 않는다. Commentary confirmation wording is also a regression for routine GitHub publication when the tool did not actually block. PublicationBoundary is only for real credential/tool/runtime blockers or destructive/external-production/payment/customer-data boundaries. Routine publication should be represented as `confirmation.channel: preapproved` and the next agent action should be execute/watch/merge, not `await action-time confirmation`.

## Studio Campaign Gate

The next game issue is a child of the active campaign, not a neighbor of the previous issue. Active campaign source of truth: P0.5 Idle Core + Creative Rescue. Before implementation, the next plan artifact must include reference teardown, creative brief, Game Studio Department Signoff, Department Scorecard with approve/revise/block, Role Debate when roles disagree, Subagent/Team Routing decision, and QA/playtest plan.

## Game Studio Department Signoff

- 기획팀: player verb, production/progression role, first 5 minutes moment.
- 리서치팀: 경쟁작 production gap, reference teardown, rejected alternative.
- 아트팀: art direction, gpt-image-2 default/fallback, manifest/animation plan.
- 개발팀: implementation tranche, touched files, rollback boundary.
- 검수팀: Browser Use/playtest evidence, screenshot/report/check list.
- 마케팅팀: mock-only player-facing promise, no real channel action.
- 고객지원팀: first 5 minutes confusion/support risk and FAQ note.

## Department Scorecard

Each department must mark approve/revise/block and cite an artifact. Two or more revise/block decisions require a Role Debate before implementation. Hard gameplay/economy/routing/sprite/QA harness problems require a self-evaluation loop: claim, smallest verifier, rubric, artifact path, iteration log, and stop condition.

## Subagent/Team Routing

Use Codex native subagents or team mode when research, local audit, asset planning, runtime implementation, or QA can produce independent evidence in parallel. If not used, the plan must explain why.

## Asset/FX production bundle

Asset/FX work follows gastory-style style state, prompt/model sidecar, reference image consistency, animation camera/composition lock, frame/GIF/spritesheet extraction, manifest QA, and small-size visual review.

## Goal-bounded stop condition

For the current Studio Harness v3 foreground operator issue run, stop only after the plan acceptance criteria, local verification, PR required checks, merge, and main CI are green, or after a written blocker report.

## Next queue quality gate

The next Studio Harness v3 foreground operator issue must name at least one 경쟁작 production gap (competition-inspired production gap) and at least one asset/FX or sprite-animation decision that creates a concrete visual/game-feel payoff. The asset/FX axis 기존 asset 재사용만으로는 통과하지 않는다; it must commit to at least one of playfield state, HUD affordance, sprite/FX, order crate visual state, reward motion. New accepted manifest game asset work must use Codex native image generation or gpt-image-2 provenance, never SVG/vector/code-native game graphics, and must pass npm run check:asset-provenance and npm run check:asset-style. GPT image/API generation requires OPENAI_API_KEY and SEED_ASSET_IMAGE_MODEL. Sprite/FX payoff must name animation.binding plus frame count, frame size, and intended frame rate. 단순 주문 추가, copy tweak, spacing tweak, or test-only work fails unless it is paired with that payoff and unblocks the vertical slice.
<!-- OPERATOR_CONTROL_ROOM_SNAPSHOT:END -->

Status: v1-live-control-room
Owner: agent
Last updated: 2026-05-07
Applies to: 모든 장시간 `$ralph`, Studio Harness v3 foreground operator issue-to-PR loop, 24h dry run 전 운영

## 왜 필요한가

이 문서는 자동화의 속도를 유지하면서도 사람이 언제든 “지금 무엇을, 왜, 어디까지 했는지”를 이해하게 만드는 control room 계약이다. ClawSweeper식 dashboard 원칙처럼 queue, review, apply, audit health가 한곳에 보여야 하며, GitHub Mission Control처럼 issue/PR/CI로 바로 이동할 수 있어야 한다. Ralph 계열 장시간 루프에서는 phase isolation, heartbeat, stale recovery가 없으면 계속 도는 작업이 사람에게 불투명해진다.

## 한눈에 보는 현재 미션 카드 계약

실제 현재 미션은 문서 상단의 `Live Snapshot`이 소유한다. 아래 표는 상황판이 유지해야 하는 필드 계약이며, 과거 issue/branch 값을 고정하지 않는다.

| 필드 | 현재 값 |
| --- | --- |
| Mission | `Live Snapshot`의 Current mission |
| Issue / PR | GitHub issue, draft PR, merge PR 링크 |
| Small win | 이번 PR이 만드는 가장 작은 승리 |
| Why it matters | 게임 북극성 또는 운영사 북극성과의 연결 |
| Phase | planning / implementing / verifying / PR / merged / blocked |
| Evidence | 테스트, CI, report, screenshot 링크 |
| Visual evidence | before/after screenshot 또는 `N/A — 이유` |
| Playable Mode | `npm run play:main`, port `5174`, 사람 플레이 가능 상태 |
| Next stop gate | 사람이 멈춰도 되는 다음 지점 또는 승인이 필요한 경계 |
| 24h dry run gate | live heartbeat/control-room/readiness gate가 green일 때만 검토 |

## Issue 작성 규칙

Issue는 한국어 우선으로 작성하고, 다음 섹션을 포함한다.

1. 문제 / 배경
2. 목표
3. Small win
4. Campaign source of truth
5. Game Studio Department Signoff
6. Subagent/Team Routing
7. 플레이어 가치 또는 운영사 가치
8. 수용 기준
9. Visual evidence 계획
10. Playable mode 영향
11. 안전 범위
12. 검증 명령

## Playable Mode / 사람 플레이 가능 모드

Agent가 feature branch에서 장시간 작업 중이어도 사람은 main 기준 게임을 별도 worktree로 실행한다.

권장 명령:

```bash
npm run play:main
cd ../strange-seed-shop-play
npm run dev:legacy -- --host 127.0.0.1 --port 5174
```

원칙:

- agent 작업 branch와 사람 플레이 branch를 분리한다.
- 사람 플레이용 worktree는 `origin/main` detached 상태를 기본으로 한다.
- 기본 포트는 agent dev server와 충돌을 피하기 위해 `5174`를 쓴다.

## 운영 리듬

1. Issue 생성: small win과 visual/playable 계획 포함.
2. Studio Campaign Gate: active campaign source of truth와 reference teardown을 기록.
3. Department Signoff: 기획팀, 리서치팀, 아트팀, 개발팀, 검수팀, 마케팅팀, 고객지원팀 산출물과 role-debate note 기록.
4. Subagent/Team Routing: 병렬 리서치/QA/아트/구현 분리가 유효하면 Codex native subagents 또는 team mode 사용.
5. Branch 시작: heartbeat와 control room snapshot 기록.
6. 구현: 작은 단위로 변경.
7. 검증: local checks + visual/playable evidence.
8. PR: required checks 확인.
9. Merge: branch protection 우회 없이 merge.
10. Main 확인: main CI 확인.
