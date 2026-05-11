# Operator Control Room / 운영 상황판

<!-- OPERATOR_CONTROL_ROOM_SNAPSHOT:START -->
## Live Snapshot

Generated at: 2026-05-11T04:08:06.097Z

## Current mission

현재 작업은 **월정 문 source asset plan-prompt**다. #528/#529는 `월정 문 원정 보내기`, 귀환 상자, reward claim, `clue_moon_grove_001 source promise`까지 merge/main CI `25649482785`로 통과했다. 다음 blocker는 `clue_moon_grove_001`이 아직 concrete source seed icon/FX plan-prompt로 승격되지 않은 점이다.

현재 evidence:

- User decision: studio operate로 게임 v1 버전을 끝까지 구현한다.
- Active game source: `docs/GAME_BIBLE.md`
- Production companion: `docs/GAME_PRODUCTION_SPEC.md`
- Phaser foundation: `docs/phaser/REBOOT_FOUNDATION_SPEC.md`
- Completed moon fence first expedition payoff: Issue #528, PR #529, main CI `25649482785`
- WorkUnit: `items/0281-moon-grove-source-asset-plan-prompt.md`
- GitHub issue: #530 `월정 문 source asset plan-prompt`
- Draft PR: #531
- Branch: `codex/v1-moon-grove-source-asset-plan-prompt`
- Runtime binding: N/A - asset plan/prompt only
- Visual evidence: N/A - generation-ready prompt/plan document slice
- Current validation: #529 merge/main CI observed; #530 asset plan/prompt local verification passed (`git diff --check`, `npm run check:topology-asset-plan`, `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:ci`); Draft PR #531 publication complete, PR checks pending
- Heartbeat: `reports/operations/operator-heartbeat-20260511.jsonl`, `.omx/state/operator-heartbeat.json`

즉시 적용할 gate:

0. Studio Campaign Gate: 다음 slice는 #529 이후 source promise가 asset pipeline 없이 멈추는 production gap을 해소한다.
1. Intake gate: GitHub issue #530을 생성하고 WorkUnit/ROADMAP/heartbeat에 issue 번호를 고정했다.
2. Implementation gate: `assets/source/asset_plan.json`, `assets/source/asset_prompts.json`에 moon-grove source seed icon/FX 후보를 추가했다.
3. Local verification gate: `npm run check:topology-asset-plan`, `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:ci`, `git diff --check`를 통과했다.
4. PR publication gate: Draft PR #531을 게시했다. checks를 감시한다.
5. PR checks가 green이면 ready/merge 후 main CI를 관찰한다.
6. runtime generation 지시가 없어야 하며 Browser Use가 계속 unavailable이면 blocker report + Playwright fallback evidence를 유지한다.

다음 Studio Harness v3 foreground operator issue는 경쟁작 production gap과 concrete visual/game-feel payoff를 함께 명시해야 한다. 기존 asset 재사용만으로는 통과하지 않는다; 최소 하나의 playfield state, HUD affordance, sprite/FX, order crate visual state, reward motion 중 하나를 player verb와 연결해야 한다. 새 accepted manifest game asset은 Codex native image generation 또는 gpt-image-2 provenance를 남기고 `OPENAI_API_KEY`, `SEED_ASSET_IMAGE_MODEL` 조건과 `npm run check:asset-provenance`, `npm run check:asset-style` gate를 통과해야 한다. Sprite/FX payoff는 `animation.binding`과 frame count/size/rate를 명시한다. 단순 주문 추가, copy tweak, test-only 작업은 이 payoff를 동반하고 vertical slice blocker를 제거할 때만 선택한다.

## Local state

- Branch: codex/v1-moon-grove-source-asset-plan-prompt
- Latest commit: f41baa7 월정 문 source PR evidence를 남긴다
- Dirty files: present

## Heartbeat

- Source: .omx/state/operator-heartbeat.json
- Timestamp: 2026-05-11T04:08:04.509Z
- Phase: phaser-v1-moon-grove-source-asset-plan-prompt-pr-checks
- Issue: 530
- PR: 531
- Item: items/0281-moon-grove-source-asset-plan-prompt.md
- Next action: PR checks gate: watch #531 checks, mark ready, merge, and observe main CI

## Open PRs

- #531 draft 월정 문 source asset plan-prompt — https://github.com/bborok1234/strange-seed-shop/pull/531

## Open issues

- #530 월정 문 source asset plan-prompt — https://github.com/bborok1234/strange-seed-shop/issues/530

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
