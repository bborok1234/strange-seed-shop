# PR #543 이후 main CI dashboard stale 복구

## 상태

- Status: active
- Game Studio route: `game-studio:game-studio -> studio-harness-v3-ci-recovery`
- GitHub issue: #544
- PR: #545 https://github.com/bborok1234/strange-seed-shop/pull/545
- Branch: `codex/0288-main-ci-dashboard-stale-after-pr543`
- 연결: PR #543, main CI run `26427334732`

## 배경

PR #543은 `월정 숲 creature/actor asset plan-prompt`를 squash merge했고 Issue #542를 닫았다. 그러나 merge 후 main CI run `26427334732`의 `Verify game baseline`이 `docs/DASHBOARD.md is stale; run npm run update:dashboard`로 실패했다.

이 작업은 PR #543의 post-merge evidence backfill이 아니다. 닫힌 PR에 merge-blocking evidence를 추가하지 않고, main CI red를 복구하기 위한 별도 harness-defect WorkUnit이다.

## Plan

1. 실패 로그를 현재 WorkUnit에 고정한다.
2. `npm run update:dashboard`로 생성 dashboard만 최신화한다.
3. `npm run check:dashboard`를 먼저 통과시킨다.
4. 영향 범위가 dashboard generated diff로 제한되는지 `git diff --stat`와 `git diff --check`로 확인한다.
5. `npm run check:ci`를 실행해 main CI 실패가 재현/복구되는지 확인한다.
6. GitHub issue와 PR을 게시하고 required checks를 확인한다.
7. merge 후 main CI를 다시 관찰한다.

## 수용 기준

- `docs/DASHBOARD.md`가 현재 roadmap/item 상태와 일치한다.
- `npm run check:dashboard`가 통과한다.
- `npm run check:ci`가 통과한다.
- PR은 #543의 closeout PR이 아니라 main CI red 복구 WorkUnit으로 설명된다.
- PR checks와 merge 후 main CI가 green으로 돌아온다.

## Department Scorecard

| 부서 | 판정 | 근거 |
| --- | --- | --- |
| 기획팀 | approve | 게임 기능 변경 없이 red main을 복구해 다음 월정 숲 asset/runtime slice를 계속 진행할 수 있게 한다. |
| 리서치팀 | approve | 실패 원인은 GitHub Actions 로그의 dashboard stale 메시지로 확인됐다. |
| 아트팀 | approve | asset/FX 생성이나 runtime graphics 변경 없음. |
| 개발팀 | approve | 변경 범위는 generated dashboard 상태 동기화로 제한한다. |
| 검수팀 | approve | `check:dashboard`와 `check:ci`가 acceptance verifier다. |
| 마케팅팀 | approve | 외부 채널/실결제/광고 없음. |
| 고객지원팀 | approve | red main이 장시간 운영 루프를 막는 혼란을 제거한다. |

## Role Debate

필수 debate는 발생하지 않았다. 모든 부서가 approve다.

## Self-evaluation loop

- Claim: main CI red 원인인 dashboard stale 상태가 제거된다.
- Smallest verifier: `npm run check:dashboard`
- Rubric: dashboard checker가 stale failure 없이 통과하고 `npm run check:ci`가 green이어야 한다.
- Artifact path: `docs/DASHBOARD.md`, GitHub Actions run `26427334732`
- Iteration log: stale diff가 남으면 `npm run update:dashboard`를 재실행하고 diff를 다시 확인한다.
- Stop condition: PR checks, merge, main CI green 또는 GitHub/tool outage blocker.

## 검증 명령

- `npm run check:dashboard` - pass
- `npm run check:ops-live` - pass
- `npm run check:seed-ops-queue` - pass
- `npm run check:ci` - pass
- `git diff --check` - pass

## 구현 결과

- `docs/DASHBOARD.md`를 `npm run update:dashboard`로 최신화했다.
- `docs/ROADMAP.md`의 Current Next Action을 #544 main CI 복구 WorkUnit으로 전환하고, #543 이후 다음 Studio Campaign Gate를 유지했다.
- `docs/OPERATOR_CONTROL_ROOM.md`와 operator heartbeat를 현재 브랜치/issue/item으로 갱신했다.
- PR #543 merge 후 red main CI run `26427334732`의 실패 원인을 dashboard stale로 고정하고, local `check:ci`에서 추가로 드러난 ops-live stale 상태까지 같은 복구 PR에서 닫았다.

## 증거

- Failing main CI: `26427334732`
- Failure line: `docs/DASHBOARD.md is stale; run npm run update:dashboard`
- Local recovery: `npm run check:ci` pass
- Whitespace: `git diff --check` pass

## 리스크

- dashboard generated file만 고치면 기능 증거가 늘어나지 않는다. 이 WorkUnit은 의도적으로 main CI 복구만 다루며, 월정 숲 creature/actor PNG 생성과 runtime binding은 다음 WorkUnit으로 이어간다.
