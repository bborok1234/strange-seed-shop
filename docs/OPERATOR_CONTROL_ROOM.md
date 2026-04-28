# Operator Control Room / 운영 상황판

Status: v0-control-room
Owner: agent
Last updated: 2026-04-28
Applies to: 모든 장시간 `$ralph`, issue-to-PR loop, 24h dry run 전 운영

## 왜 필요한가

4h trial은 자동화가 실제로 issue → branch → PR → CI → merge → report를 반복할 수 있음을 증명했다. 하지만 사람이 중간에 돌아왔을 때 “지금 무엇을, 왜, 어디까지 했는지”를 한눈에 보기 어려웠다. 이 문서는 자동화의 속도를 유지하면서도 사람이 언제든 이해·검수·플레이할 수 있게 만드는 control room 계약이다.

## 한눈에 보는 현재 미션

| 필드 | 현재 값 |
| --- | --- |
| 운영 북극성 | 에이전트가 안전하게 오래 일하되, 사람이 즉시 이해하고 멈출 수 있는 게임 스튜디오 |
| 게임 북극성 | 첫 5분 안에 “귀엽다, 하나만 더 키우자”를 만드는 수집 idle game |
| 현재 milestone | 24h dry run 전 운영 가시성 보강 |
| Active issue | #87 — Operator Control Room + Playable Mode |
| Active branch | `codex/operator-control-room` |
| 이번 small win | 사람이 퇴근/복귀/중간 확인 시 현재 작업·결과·증거·게임 실행법을 한 화면에서 파악한다 |
| 플레이어 가치 | 자동화가 UI/게임을 계속 바꿔도 사람은 main 기준 게임을 열고 재미/귀여움/혼란을 직접 확인할 수 있다 |
| 다음 안전 정지점 | PR green + main CI green + `npm run check:all` PASS |
| 24h dry run gate | 이 control room PR이 merge되기 전 24h dry run 금지 |

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
| Next safe stop | 사람이 멈춰도 되는 다음 지점 |
| Next queue | 이 작업 이후의 안전한 다음 작업 |

## Issue 작성 규칙

Issue는 한국어 우선으로 작성하고, 다음 섹션을 포함한다.

1. 문제 / 배경
2. 목표
3. Small win
4. 플레이어 가치 또는 운영사 가치
5. 수용 기준
6. Visual evidence 계획
7. Playable mode 영향
8. 안전 범위
9. 검증 명령

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
2. Branch 시작: heartbeat와 control room snapshot 기록.
3. 구현: 작은 단위로 변경.
4. 검증: local checks + visual/playable evidence.
5. Draft PR: control room 형식의 PR 본문.
6. Ready/merge: required checks 통과 후 branch protection 우회 없이 merge.
7. Main 확인: main CI + local `npm run check:all`.
8. Dashboard/roadmap 갱신: 다음 safe queue를 명시.

## 관련 리서치에서 가져온 원칙

- ClawSweeper: dashboard는 장식이 아니라 queue/review/apply/audit health를 보여주는 운영 표면이다.
- GitHub Mission Control: agent task는 한 곳에서 시작·추적·PR jump가 가능해야 한다.
- Ralph 계열: phase isolation, progress file, stale recovery가 없으면 “계속 도는 loop”가 사람에게 불투명해진다.
- Agentic PR 연구: 작은 작업, green CI, reviewer engagement, 명확한 scope가 merge 가능성을 높인다.
