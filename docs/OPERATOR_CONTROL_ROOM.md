# Operator Control Room / 운영 상황판

<!-- OPERATOR_CONTROL_ROOM_SNAPSHOT:START -->
## Live Snapshot

Generated at: 2026-05-07T14:54:16.397Z

## Current mission

현재 작업은 **이상한 씨앗상회 전체 게임 바이블 리디자인**이다. `items/0234-game-bible-full-redesign.md`와 `docs/GAME_BIBLE.md`가 기존 P0/P0.5/Phaser Stage 기획을 하위 참고로 내리고, 컨셉만 유지한 전체 게임 source-of-truth를 만든다.

현재 evidence:

- User decision: 부분 UI/Phaser foundation 설계가 아니라 게임 자체를 처음부터 끝까지 다시 설계한다.
- Active game bible: `docs/GAME_BIBLE.md`
- Reboot foundation spec: `docs/phaser/REBOOT_FOUNDATION_SPEC.md`
- Superseded spec: `docs/phaser/VERTICAL_SLICE_SPEC.md`
- Legacy app lane: `apps/legacy-react-playable/`
- Phaser app lane: `apps/seed-garden-phaser/`
- Game bible item: `items/0234-game-bible-full-redesign.md`
- Reboot item: `items/0233-phaser-reboot-foundation-design.md`
- Blocked old item: `items/0229-phaser-care-stage-foundation.md`
- Blocked old item: `items/0230-phaser-garden-view-mode.md`
- Blocked old item: `items/0231-phaser-carry-claim-reward-fx.md`
- Codex skill: `game-studio:game-studio`
- Current validation: `npm run check:docs` pass, `npm run check:dashboard` pass, `npm run check:app-boundaries` pass, `npm run check:seed-ops-queue` pass, `npm run check:closed-workunit-mirrors` pass, `npm run check:ci` pass
- Heartbeat: `reports/operations/operator-heartbeat-20260507.jsonl`, `.omx/state/operator-heartbeat.json`

즉시 적용할 gate:

1. Studio Campaign Gate: `docs/GAME_BIBLE.md`를 게임 설계 최상위 source-of-truth로 등록한다.
2. 기존 P0/P0.5/Phaser Stage 문서는 reference/historical로 내리고, 새 구현 판단은 `GAME_BIBLE.md`를 먼저 따른다.
3. 다음 WorkUnit은 `garden board topology scaffold`이지만, `GAME_BIBLE.md` 검증이 green인 뒤에만 시작한다.
4. asset generation은 topology scaffold 이후에 시작한다. blank terrain, modular plot tile, facility prop, actor seed frame, sprite strip normalization 순서로 진행한다.
5. Browser Use `iab` visual/gameplay evidence 없이는 Phaser visual/gameplay 완료를 주장하지 않는다.
6. 단순 주문 추가, copy tweak, test-only 작업은 이번 greenfield campaign에서 금지한다. 다음 WorkUnit은 world topology, actor task, asset/FX, Browser Use playtest 중 하나 이상의 concrete visual/game-feel payoff를 포함해야 한다.

## Local state

- Branch: codex/phaser-care-stage-foundation
- Latest commit: e532cdb 기존 React 앱을 legacy lane으로 분리한다
- Dirty files: present

## Heartbeat

- Source: .omx/state/operator-heartbeat.json
- Timestamp: 2026-05-07T14:53:50.811Z
- Phase: game-bible-full-redesign-verified
- Issue: game-bible
- PR: 
- Item: items/0234-game-bible-full-redesign.md
- Next action: gate: split next issue into garden board topology scaffold

## Open PRs

- unavailable or none

## Open issues

- #434 Phaser 신규 정원에 감상 모드와 HUD 접기를 만들기 — https://github.com/bborok1234/strange-seed-shop/issues/434
- #433 Phaser 신규 정원을 낮은 관리 카메라와 actor loop로 시작하기 — https://github.com/bborok1234/strange-seed-shop/issues/433
- #432 Phaser 신규 정원 수확을 나르기와 보상 FX로 연결하기 — https://github.com/bborok1234/strange-seed-shop/issues/432

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

The next game issue is a child of the active campaign, not a neighbor of the previous issue. Active campaign source of truth: P0.5 Idle Core + Creative Rescue. Before implementation, the next plan artifact must include reference teardown, creative brief, Game Studio Department Signoff, role-debate note when roles disagree, Subagent/Team Routing decision, and QA/playtest plan.

## Game Studio Department Signoff

- 기획팀: player verb, production/progression role, first 5 minutes moment.
- 리서치팀: 경쟁작 production gap, reference teardown, rejected alternative.
- 아트팀: art direction, gpt-image-2 default/fallback, manifest/animation plan.
- 개발팀: implementation tranche, touched files, rollback boundary.
- 검수팀: Browser Use/playtest evidence, screenshot/report/check list.
- 마케팅팀: mock-only player-facing promise, no real channel action.
- 고객지원팀: first 5 minutes confusion/support risk and FAQ note.

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
