## 요약

PR #543 merge 후 red가 된 main CI를 복구합니다. 실패 원인은 `docs/DASHBOARD.md` stale였고, 로컬 전체 CI에서 추가로 확인된 control room/heartbeat stale 상태까지 현재 #544 WorkUnit으로 갱신했습니다.

## Small win

main을 다시 green으로 돌려 다음 월정 숲 creature/actor asset generation/runtime binding slice를 진행할 수 있게 합니다.

## 사용자/운영자 가치

운영자는 PR merge 후 main CI red를 방치하지 않고 별도 harness-defect issue로 복구합니다. 플레이어 기능은 바꾸지 않지만, Studio Harness v3의 issue-to-PR-to-main-CI 루프 신뢰도를 회복합니다.

## Before / After 또는 Visual evidence

- Before: main CI run `26427334732`의 `Verify game baseline`이 `docs/DASHBOARD.md is stale; run npm run update:dashboard`로 실패했습니다.
- After: dashboard, roadmap Current Next Action, control room, heartbeat가 #544 복구 WorkUnit 기준으로 최신화됐습니다.
- Visual evidence: `N/A - dashboard/control-room/heartbeat sync only, runtime UI 변화 없음`

## Playable mode

Runtime playable 변경 없음. 사람 플레이용 main worktree/port 정책도 변경하지 않습니다.

## 검증

- `npm run check:dashboard` - pass
- `npm run check:ops-live` - pass
- `npm run check:seed-ops-queue` - pass
- `npm run check:ci` - pass
- `git diff --check` - pass

## 안전 범위

- 게임 런타임 변경 없음
- asset generation 없음
- manifest 변경 없음
- 결제, 광고, 고객 데이터, 외부 배포 없음
- 닫힌 PR #543에 evidence를 backfill하지 않고 별도 issue #544로 복구

## 남은 위험

merge 후 main CI를 다시 관찰해야 합니다. green 확인 후 다음 WorkUnit은 월정 숲 creature/actor PNG 생성, review, manifest/runtime binding으로 이어갑니다.

## 연결된 issue

Closes #544

## 작업 checklist

- [x] Plan-first WorkUnit 생성
- [x] GitHub issue #544 생성
- [x] Dashboard 최신화
- [x] Control room/heartbeat 최신화
- [x] Local `check:ci` 통과
