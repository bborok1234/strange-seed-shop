# Operator Control Room / 운영 상황판

<!-- OPERATOR_CONTROL_ROOM_SNAPSHOT:START -->
## Live Snapshot

Generated at: 2026-05-03T04:26:06.605Z

## Current mission

현재 작업은 GitHub-authoritative open WorkUnit #304 **연구 완료 보상이 도감 단서 기록 motion으로 다음 씨앗 목표까지 이어지게 만든다**이다. #302는 PR #303 merge와 main CI `25269728128` success로 닫혔고, runner dry-run은 queue-empty를 종료가 아니라 production-game-intake-required로 판단했다. 지금은 #304 plan-first gate다.

현재 evidence:

- GitHub issue: #304 `연구 완료 보상이 도감 단서 기록 motion으로 다음 씨앗 목표까지 이어지게 만든다`
- Plan artifact: `items/0154-research-complete-clue-motion.md`
- Branch: `codex/0304-research-complete-clue-motion`
- Game Studio route: `game-studio:game-studio` → `game-studio:game-ui-frontend` + `game-studio:game-playtest`; 신규 manifest asset 없음, DOM/CSS reward motion + HUD affordance
- Campaign source of truth: `P0.5 Idle Core + Creative Rescue`
- Player verb: `새싹 기록법 연구 완료하기`
- Production role: 두 번째 주문 보상 → 연구 완료 → 도감 단서/다음 씨앗 목표
- Screen moment: research CTA를 누른 직후 393px 정원 첫 화면
- Concrete payoff: `도감 단서 기록` receipt, playfield `연구 노트 저장` state, seed/research CTA glow, reward motion
- Competition production gap: Cell to Singularity식 연구/해금 feedback처럼 메타 진행이 즉시 보이고, Idle Miner/Egg식 보상 수령 motion처럼 다음 행동이 명확해야 함

즉시 적용할 gate:

1. GitHub issue/PR/GateEvent만 WorkUnit authority로 사용한다. local docs/reports는 evidence mirror다.
2. 구현 전 plan artifact의 수용 기준, Game Studio route, Department Signoff, Subagent/Team Routing을 유지한다.
3. Browser Use iab current-session 시도를 반복하고, blocker면 `reports/visual/`에 이번 issue용 blocker를 새로 남긴다.
4. 393px 모바일 visual regression은 research completion receipt, next seed/research CTA, action-surface overflow, bottom-tab overlap을 함께 검증한다.
5. 남은 checkpoint는 plan-first commit, implementation, focused/full checks, PR publication, GitHub checks, merge, main CI 관찰이다. Stop rule이 없으므로 merge 후 GitHub-authoritative 다음 WorkUnit으로 계속 진행한다.
6. Studio Campaign Gate: 다음 게임 WorkUnit 선택도 `P0.5 Idle Core + Creative Rescue` campaign source of truth에서 출발하며, 기획팀/리서치팀/아트팀/개발팀/검수팀/마케팅팀/고객지원팀 signoff, role-debate note, reference teardown, creative brief, QA/playtest plan을 plan-first에 남긴다.
7. Subagent/Team Routing: Codex native subagents 또는 team mode는 독립 evidence가 병렬로 필요할 때만 쓰고, 이번 #304는 단일 React/CSS/visual regression tranche라 plan artifact에 미사용 사유를 기록했다.
8. 단순 주문 추가, copy tweak, spacing tweak, test-only 작업은 production blocker를 제거하고 concrete visual/game-feel payoff를 동반할 때만 허용한다.

## Local state

- Branch: codex/0304-research-complete-clue-motion
- Latest commit: 3043315 #302 두 번째 주문 보상을 연구 노트 unlock으로 보이게 만든다
- Dirty files: present

## Heartbeat

- Source: .omx/state/operator-heartbeat.json
- Timestamp: 2026-05-03T04:25:30Z
- Phase: issue-304-plan-first
- Issue: 304
- PR: 
- Item: items/0154-research-complete-clue-motion.md
- Next action: implementation gate: inspect research completion flow, implement clue reward motion, verify visual/ci, publish PR

## Open PRs

- unavailable or none

## Open issues

- #304 연구 완료 보상이 도감 단서 기록 motion으로 다음 씨앗 목표까지 이어지게 만든다 — https://github.com/bborok1234/strange-seed-shop/issues/304

## Playable mode

- Prepare stable main worktree: `npm run play:main`
- Serve stable main game: `cd ../strange-seed-shop-play && npm run dev -- --host 127.0.0.1 --port 5174`
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
Last updated: 2026-05-01
Applies to: 모든 장시간 `$ralph`, Studio Harness v3 foreground operator issue-to-PR loop, 24h dry run 전 운영

## 왜 필요한가

4h trial은 자동화가 실제로 issue → branch → PR → CI → merge → report를 반복할 수 있음을 증명했다. 하지만 사람이 중간에 돌아왔을 때 “지금 무엇을, 왜, 어디까지 했는지”를 한눈에 보기 어려웠다. 이 문서는 자동화의 속도를 유지하면서도 사람이 언제든 이해·검수·플레이할 수 있게 만드는 control room 계약이다.

## 한눈에 보는 현재 미션 카드 계약

실제 현재 미션은 문서 상단의 `Live Snapshot`이 소유한다. 아래 표는 상황판이 유지해야 하는 필드 계약이며, 과거 issue/branch 값을 고정하지 않는다.

| 필드 | 현재 값 |
| --- | --- |
| 운영 북극성 | 에이전트가 안전하게 오래 일하되, 사람이 즉시 이해하고 멈출 수 있는 게임 스튜디오 |
| 게임 북극성 | 첫 5분 안에 “귀엽다, 하나만 더 키우자”를 만드는 수집 idle game |
| 현재 milestone | `Live Snapshot`의 Current mission |
| Active issue | `Live Snapshot`의 Heartbeat issue 또는 open issue queue |
| Active branch | `Live Snapshot`의 Local state branch |
| 이번 small win | 현재 issue/item의 가장 작은 승리 |
| 플레이어 가치 | 게임 북극성 또는 운영사 북극성과의 연결 |
| 다음 안전 정지점 | goal-bounded stop condition 또는 blocker report |
| 24h dry run gate | live heartbeat/control-room/readiness gate가 green일 때만 검토 |

## Control Room 카드 형식

모든 active mission은 아래 필드를 가져야 한다.

| 필드 | 설명 |
| --- | --- |
| Mission | 사람이 읽는 한 줄 목표 |
| Milestone | `docs/ROADMAP.md`의 어느 단계인지 |
| Issue / PR | GitHub issue, draft PR, merge PR 링크 |
| Small win | 이번 PR이 만드는 가장 작은 승리 |
| Why it matters | 게임 북극성 또는 운영사 북극성과의 연결 |
| Phase | planning / implementing / verifying / PR / merged / blocked |
| Evidence | 테스트, CI, report, screenshot 링크 |
| Visual delta | before/after screenshot 또는 `N/A — 이유` |
| Playable status | main 게임 실행 가능 여부와 명령 |
| Next stop gate | 사람이 멈춰도 되는 다음 지점 또는 승인이 필요한 경계 |
| Next vertical slice queue | 이 작업 이후의 북극성 vertical slice 후보 |
| Campaign source of truth | 현재 issue가 속한 campaign. 지금 기본값은 `P0.5 Idle Core + Creative Rescue` |
| Game Studio Department Signoff | 기획팀/리서치팀/아트팀/개발팀/검수팀/마케팅팀/고객지원팀 중 필요한 부서 산출물 |
| Subagent/Team Routing | Codex native subagents 또는 team mode 사용 여부와 이유 |

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

## PR 작성 규칙

PR은 사람이 60초 안에 리뷰 방향을 잡을 수 있어야 한다.

필수 섹션:

- 요약
- Small win
- 사용자/운영자 가치
- Before / After 또는 Visual evidence
- Playable mode
- 검증
- 안전 범위
- 남은 위험
- 연결된 issue

UI/게임 변경 PR은 `reports/visual/`의 before/after screenshot을 연결한다. 문서·스크립트만 바꾸는 PR은 `N/A — UI 변화 없음`처럼 이유를 쓴다.

## Playable Mode / 사람 플레이 가능 모드

Agent가 feature branch에서 장시간 작업 중이어도 사람은 main 기준 게임을 별도 worktree로 실행한다.

권장 명령:

```bash
npm run play:main
# dependencies가 없으면 한 번만:
npm run play:main:install
cd ../strange-seed-shop-play
npm run dev -- --host 127.0.0.1 --port 5174
```

원칙:

- agent 작업 branch와 사람 플레이 branch를 분리한다.
- 사람 플레이용 worktree는 `origin/main` detached 상태를 기본으로 한다.
- 기본 포트는 agent dev server와 충돌을 피하기 위해 `5174`를 쓴다.
- 플레이용 worktree가 dirty이면 script는 기본적으로 멈추고 덮어쓰지 않는다.
- 사람이 플레이 중이면 agent는 같은 port를 점유하지 않는다.

## Visual evidence 계약

| 변경 유형 | Evidence |
| --- | --- |
| 게임 UI/UX | mobile 360px after screenshot + 가능하면 before screenshot |
| desktop 영향 | desktop 1280px screenshot |
| Phaser/playfield | Browser Use 우선, 차단 시 CDP fallback 이유와 screenshot |
| 문서/운영 스크립트 | `N/A — UI 변화 없음`, 대신 report/check output |
| Playable mode | 실행 명령과 port/worktree 상태 |

## 운영 리듬

1. Issue 생성: small win과 visual/playable 계획 포함.
2. Studio Campaign Gate: `P0.5 Idle Core + Creative Rescue` 같은 active campaign source of truth와 reference teardown을 기록.
3. Department Signoff: 기획팀, 리서치팀, 아트팀, 개발팀, 검수팀, 마케팅팀, 고객지원팀 산출물과 role-debate note를 기록.
4. Subagent/Team Routing: 병렬 리서치/QA/아트/구현 분리가 유효하면 Codex native subagents 또는 team mode를 사용하고, 사용하지 않으면 이유를 남김.
5. Branch 시작: heartbeat와 control room snapshot 기록.
6. 구현: 작은 단위로 변경.
7. 검증: local checks + visual/playable evidence.
8. Draft PR: control room 형식의 PR 본문.
9. Ready/merge: required checks 통과 후 branch protection 우회 없이 merge.
10. Main 확인: main CI + local `npm run check:all`.
11. Dashboard/roadmap 갱신: 다음 vertical slice queue와 stop gate를 분리해 명시.

## 관련 리서치에서 가져온 원칙

- ClawSweeper: dashboard는 장식이 아니라 queue/review/apply/audit health를 보여주는 운영 표면이다.
- ClawSweeper: review lane은 proposal-only이고 apply lane만 mutation을 수행한다. Seed ops도 부서 signoff와 apply mutation gate를 분리한다.
- gastory: asset/FX는 project style state, prompt/model sidecar, reference consistency, animation camera/composition lock, frames/spritesheet extraction까지 bundle로 관리한다.
- GitHub Mission Control: agent task는 한 곳에서 시작·추적·PR jump가 가능해야 한다.
- Ralph 계열: phase isolation, progress file, stale recovery가 없으면 “계속 도는 loop”가 사람에게 불투명해진다.
- Agentic PR 연구: 작은 작업, green CI, reviewer engagement, 명확한 scope가 merge 가능성을 높인다.
