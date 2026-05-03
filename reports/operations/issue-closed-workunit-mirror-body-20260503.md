# 닫힌 WorkUnit이 roadmap review 상태로 남는 회귀를 checker로 막는다

## 문제 / 배경

#284/#285와 #286/#287은 GitHub 기준으로 merge/close와 main CI 관찰까지 끝났지만, local mirror인 `docs/ROADMAP.md`와 control room snapshot에는 `review` 상태와 active mission 문구가 남아 있다. Studio Harness v3에서는 GitHub issue/PR/GateEvent가 authority이고 local docs/reports는 evidence mirror이므로, 닫힌 WorkUnit을 닫힌 PR 이후 main-targeted closeout으로 backfill하지 말고 다음 plan-first harness defect로 처리해야 한다.

## 목표

GitHub에서 CLOSED/MERGED로 확인된 WorkUnit의 local mirror가 `review` 또는 active mission으로 남지 않게 deterministic manifest/checker를 추가한다. 이번 작업은 #284와 #286의 stale mirror를 정리하고, 이후 같은 회귀를 CI가 잡게 만드는 작은 operator slice다.

## Small win

- 이번 issue가 만들 가장 작은 승리: `npm run check:closed-workunit-mirrors`가 #284/#286처럼 closed WorkUnit이 ROADMAP에서 `review`로 남거나 control room current mission으로 남는 경우 실패한다.

## Game Studio route

- Umbrella: N/A — 운영사 하네스/문서/체커 작업이며 visible gameplay/HUD/playfield/asset 변경 없음.
- Specialist route: N/A
- Playtest evidence 계획: N/A — UI/visual 변경 없음.

## Plan

- 구현 전 plan artifact: `items/0146-closed-workunit-mirror-consistency.md`
- Branch: `codex/0288-closed-workunit-mirror-consistency`

## 플레이어 가치 또는 운영사 가치

- 운영사 가치: GitHub-authoritative 완료 상태가 local mirror에 뒤늦게 엇갈려 다음 queue selection을 오염시키는 회귀를 막는다.
- 게임 가치: queue empty 상태에서 stale review 문서 때문에 production vertical slice 선택이 지연되지 않는다.

## 수용 기준

- [ ] #284/#285, #286/#287의 GitHub CLOSED/MERGED/main CI evidence를 manifest/report에 남긴다.
- [ ] `docs/ROADMAP.md`의 해당 row와 Current Next Action이 GitHub truth와 맞게 갱신된다.
- [ ] `docs/OPERATOR_CONTROL_ROOM.md`와 `docs/DASHBOARD.md`가 stale active mission/review count를 남기지 않는다.
- [ ] `npm run check:closed-workunit-mirrors`가 stale `review`/active mission 회귀를 실패시킨다.
- [ ] `npm run check:ci`가 통과한다.

## Visual evidence 계획

- N/A — docs/scripts-only harness change. Browser Use 대상이 아니다.

## Playable mode 영향

- 런타임 게임 코드/asset/economy 변경 없음. `npm run play:main` 흐름을 변경하지 않는다.

## 안전 범위

- 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음.
- closed PR에 post-merge closeout commit을 만들지 않고, 새 WorkUnit으로만 처리한다.

## 검증 명령

- `npm run check:closed-workunit-mirrors`
- `npm run check:ops-live`
- `npm run check:dashboard`
- `npm run check:ci`
