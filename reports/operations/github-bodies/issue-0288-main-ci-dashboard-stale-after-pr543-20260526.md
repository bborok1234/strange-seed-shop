## 문제 / 배경

PR #543 `월정 숲 creature/actor asset plan-prompt`는 2026-05-26에 merge됐지만, merge 후 main CI run `26427334732`의 `Verify game baseline`이 실패했습니다.

실패 원인:

```text
docs/DASHBOARD.md is stale; run npm run update:dashboard
```

이 이슈는 닫힌 PR #543의 post-merge closeout이 아니라, red main을 복구하기 위한 별도 harness-defect WorkUnit입니다.

## 목표

`docs/DASHBOARD.md`를 현재 roadmap/item 상태와 맞춰 main CI를 다시 green으로 돌립니다.

## Small win

Studio Harness v3 루프가 다음 월정 숲 creature/actor asset generation/runtime binding slice로 넘어가기 전에 main red 상태를 제거합니다.

## Campaign source of truth

- `docs/NORTH_STAR.md`
- `docs/PROJECT_COMMANDS.md`
- `docs/OPERATOR_CONTROL_ROOM.md`
- `items/0288-main-ci-dashboard-stale-after-pr543.md`

## Game Studio Department Signoff

- 기획팀: 게임 기능 변경 없이 red main 복구를 우선합니다.
- 리서치팀: 실패 로그가 dashboard stale을 직접 지목합니다.
- 아트팀: asset/FX 생성 없음.
- 개발팀: generated dashboard 동기화만 수행합니다.
- 검수팀: `check:dashboard`, `check:ci`, PR checks, main CI를 검증합니다.
- 마케팅팀: 외부 채널/실결제/광고 없음.
- 고객지원팀: 운영 상황판 불일치로 인한 혼란을 제거합니다.

## 수용 기준

- [ ] `npm run update:dashboard` 결과가 커밋된다.
- [ ] `npm run check:dashboard` 통과.
- [ ] `npm run check:ci` 통과.
- [ ] PR checks 통과.
- [ ] merge 후 main CI green.

## Visual evidence 계획

N/A - dashboard generated document sync only, runtime UI 변화 없음.

## Playable mode 영향

없음. 사람 플레이용 main worktree/port 정책은 변경하지 않습니다.

## 안전 범위

- 게임 런타임 변경 없음
- asset generation 없음
- manifest 변경 없음
- 결제, 광고, 고객 데이터, 외부 배포 없음

## 검증 명령

- `npm run check:dashboard`
- `npm run check:ci`
- `git diff --check`
