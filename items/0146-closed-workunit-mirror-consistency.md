# #288 닫힌 WorkUnit이 roadmap review 상태로 남는 회귀를 checker로 막는다

- 상태: `ready-for-pr`
- GitHub issue: #288 `닫힌 WorkUnit이 roadmap review 상태로 남는 회귀를 checker로 막는다`
- Branch: `codex/0288-closed-workunit-mirror-consistency`
- WorkUnit authority: GitHub issue/PR/GateEvent. local docs/reports는 evidence mirror다.
- Game Studio route: N/A — 운영사 하네스/문서/체커 작업이며 visible gameplay, HUD, playfield, asset 변경 없음.

## Problem statement

#284/#285와 #286/#287은 GitHub 기준으로 CLOSED/MERGED/main CI 관찰까지 끝났지만, `docs/ROADMAP.md` row와 Current Next Action / `docs/OPERATOR_CONTROL_ROOM.md` snapshot이 stale `review`/active mission 상태를 유지했다. 이미 닫힌 PR에 post-merge closeout commit을 만들 수 없으므로, 새 plan-first harness defect WorkUnit으로 local mirror stale 회귀를 처리한다.

## Plan

1. GitHub CLI로 #284/#285, #286/#287 close/merge/main CI evidence를 수집해 manifest/report로 남긴다.
2. `docs/ROADMAP.md`에서 #284와 #286 row를 `done`으로 갱신하고 Current Next Action을 #288의 mirror-consistency 작업으로 교체한다.
3. `docs/OPERATOR_CONTROL_ROOM.md`와 `docs/DASHBOARD.md`를 갱신해 stale active mission/review count를 제거한다.
4. `scripts/check-closed-workunit-mirrors.mjs`와 `npm run check:closed-workunit-mirrors`를 추가하고 `check:ci`에 연결한다.
5. focused checks와 `npm run check:ci`를 통과한 뒤 body-file 기반 issue/PR/GateEvent publication을 수행한다.

## 수용 기준

- [x] #284/#285, #286/#287의 GitHub CLOSED/MERGED/main CI evidence가 manifest/report에 있다.
- [x] #284/#286 roadmap row가 `done`이며 main CI evidence를 포함한다.
- [x] Current Next Action과 control room은 #286/#284를 active mission으로 표시하지 않는다.
- [x] `npm run check:closed-workunit-mirrors`가 stale `review` 또는 active mission 회귀를 실패시킨다.
- [x] `npm run check:ops-live`, `npm run check:dashboard`, `npm run check:ci`가 통과한다.

## 검증 명령

- `npm run check:closed-workunit-mirrors`
- `npm run check:ops-live`
- `npm run check:dashboard`
- `npm run check:ci`

## 리스크와 롤백

- 리스크: local mirror checker가 GitHub authority를 대체하면 안 된다. Manifest는 GitHub 관찰 evidence이며 권한 source가 아니다.
- 롤백: #288 커밋을 되돌리면 기존 docs/dashboard/check:ci 상태로 돌아간다. 단, #284/#286 stale mirror 회귀는 다시 보일 수 있다.

## Game Studio Department Signoff

- 기획팀: N/A — player verb 변경 없음.
- 리서치팀: GitHub issue/PR/main CI state를 authority로 확인한다.
- 아트팀: N/A — asset/FX 없음.
- 개발팀: checker + docs mirror update만 수정한다.
- 검수팀: local deterministic checks와 GitHub PR checks로 검증한다.
- 마케팅팀: N/A — 실채널 action 없음.
- 고객지원팀: stale 운영 상태로 사람이 다음 작업을 오해하는 support risk를 줄인다.

## Subagent/Team Routing

- 사용하지 않음. 단일 docs/scripts checker slice라 write scope가 강하게 겹치고, 병렬 subagent가 오히려 stale mirror 충돌을 만들 수 있다.

## 구현 evidence

- GitHub 관찰 manifest: `reports/operations/closed-workunit-mirror-manifest-20260503.json`
- Human-readable report: `reports/operations/closed-workunit-mirror-report-20260503.md`
- 신규 checker: `scripts/check-closed-workunit-mirrors.mjs` / `npm run check:closed-workunit-mirrors`
- `docs/ROADMAP.md`에서 #284/#286 row를 `done` + PR/main CI evidence로 갱신했다.
- Current Next Action/control room/dashboard를 #288 active WorkUnit으로 갱신했다.

## 검증 evidence

- `npm run check:seed-ops-queue` → passed
- `npm run check:closed-workunit-mirrors` → passed
- `npm run check:ops-live` → passed
- `npm run check:dashboard` → passed
- `npm run check:ci` → passed
