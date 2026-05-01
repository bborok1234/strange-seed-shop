# PR #257 Game Studio Ops Harness

## 요약

`$seed-ops`가 직전 issue 인접 기능을 고르는 단편 loop로 내려가지 않도록 `P0.5 Idle Core + Creative Rescue`를 active campaign source of truth로 고정했다. 새 게임 issue는 Studio Campaign Gate, Game Studio Department Signoff, Subagent/Team Routing, reference teardown, creative brief, QA/playtest plan 없이는 implementation으로 내려가지 못한다.

## Small win

다음 `$seed-ops` 게임 issue는 기획팀, 리서치팀, 아트팀, 개발팀, 검수팀, 마케팅팀, 고객지원팀 signoff와 role-debate note를 plan artifact에 남겨야 한다.

## Plan-first evidence

- Issue #257
- `items/0129-game-studio-ops-harness.md`
- `reports/operations/game-studio-harness-reference-review-20260501.md`

## 사용자/운영자 가치

운영자가 다음 작업을 고를 때 “작고 안전한 기능”이나 “직전 issue의 옆 기능”으로 축소되지 않고, P0.5 campaign 완수 기준에서 기획, 리서치, 아트, 개발, 검수, 마케팅, 고객지원 관점을 먼저 통과한다.

## Before / After 또는 Visual evidence

N/A — 운영 하네스/문서/checker 변경이며 UI 런타임 변화 없음.

## Playable mode

N/A — 게임 런타임 변경 없음. `npm run play:main` 경로는 유지된다.

## 검증

- `npm run check:seed-ops-queue`
- `npm run check:ops-live`
- `npm run check:project-commands`
- `npm run check:operator`
- `npm run check:control-room`
- `npm run check:docs`
- `npm run check:dashboard`
- `npm run check:ci`

## 작업 checklist

- [x] Plan-first artifact 작성
- [x] Game Studio route/campaign gate 반영
- [x] Browser Use 우선 QA 또는 blocker: N/A, UI 변경 없음
- [x] 문서/roadmap/dashboard/report 갱신
- [x] GitHub evidence 갱신

## 안전 범위

문서, 운영 skill, checker, control room snapshot만 수정한다. 게임 runtime, save data, 결제, 로그인, 외부 배포, 실채널 GTM은 건드리지 않는다.

## 남은 위험

다음 실제 gameplay issue에서 이 gate가 강제되는지 장시간 `$seed-ops` run으로 한 번 더 검증해야 한다.

## 연결된 issue

Closes #257
