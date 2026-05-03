# #290 Studio Harness v3 24h live runner 진입점을 만든다

- 상태: `planning`
- GitHub issue: #290 `Studio Harness v3 24h live runner 진입점을 만든다`
- Branch: `codex/0290-studio-v3-24h-live-runner`
- WorkUnit authority: GitHub issue/PR/GateEvent. local docs/reports는 evidence mirror다.
- Game Studio route: N/A — 운영사 runner/workflow 작업. 단, runner가 만드는 다음 게임 WorkUnit은 `game-studio:game-studio`와 specialist route를 plan-first로 요구한다.

## Problem statement

우리의 1차 목표는 fixture checker가 아니라 24시간 돌아가는 AI 네이티브 게임 운영사다. #276은 WorkUnit reconstruction checker를 만들었지만, 사람이 실제로 `Studio Harness v3 runner`를 시작하고 관찰할 runnable entrypoint가 부족하다. Queue empty나 checkpoint 후 멈추지 않고 production 게임 품질 WorkUnit intake로 이어지는 live runner 진입점이 필요하다.

## Plan

1. `scripts/studio-v3-live-runner.mjs`를 추가한다. 기본은 safe `--dry-run`이며 `--once`, `--duration-hours`, `--interval-seconds`, `--max-iterations`, `--allow-create-issue` 옵션을 둔다.
2. runner가 `gh issue list`, `gh pr list`, `git rev-parse origin/main`, `gh run list`를 읽어 GitHub-authoritative queue snapshot을 만든다.
3. runner가 `.omx/state/studio-v3-live-runner.json`, `.omx/state/operator-heartbeat.json`, `reports/operations/studio-v3-live-runner-YYYYMMDD.md`를 남긴다.
4. queue empty는 stop이 아니라 `production-game-intake-required` action으로 분류하고, P0.5/production game quality 조건을 report에 남긴다.
5. `scripts/check-studio-v3-live-runner.mjs`와 `npm run check:studio-v3-live-runner`를 추가해 dry-run state/report/usage doc을 검증하고 `check:ci`에 연결한다.
6. `docs/STUDIO_HARNESS_V3_RUNNER_USAGE.md`에 24h 실행, once smoke, watchdog, 중단/관찰, 실제 mutation policy를 적는다.
7. focused checks와 `npm run check:ci`를 통과한 뒤 PR을 게시하고 merge/main CI까지 관찰한다.

## 수용 기준

- [ ] `npm run studio:v3:runner -- --once --dry-run`이 실행되고 state/report/heartbeat evidence를 남긴다.
- [ ] runner snapshot이 GitHub open issue, open PR, main commit/check 상태를 포함한다.
- [ ] queue empty가 `production-game-intake-required` 또는 동등한 non-stop action으로 분류된다.
- [ ] usage 문서가 24h 실행/관찰/중단/credential boundary를 설명한다.
- [ ] `npm run check:studio-v3-live-runner`와 `npm run check:ci`가 통과한다.

## 검증 명령

- `npm run studio:v3:runner -- --once --dry-run`
- `npm run check:studio-v3-live-runner`
- `npm run check:ci`

## 리스크와 롤백

- 리스크: 실제 24h unattended mutation은 credentials/tooling/branch protection에 묶인다. 기본 runner는 `--dry-run`으로 안전하게 시작하고, `--allow-create-issue` 같은 명시 flag가 있을 때만 issue intake mutation을 허용한다.
- 리스크: runner가 production game work보다 operator hardening만 반복하면 목표에서 벗어난다. Queue empty action은 production game intake를 우선하도록 문서/체커에 박는다.
- 롤백: #290 커밋을 되돌리면 runner entrypoint와 usage/checker가 제거된다.

## Game Studio Department Signoff

- 기획팀: runner의 queue-empty action은 다음 production game WorkUnit intake를 가리켜야 한다.
- 리서치팀: GitHub issue/PR/main CI를 authoritative source로 읽는다.
- 아트팀: N/A — asset/FX 변경 없음. 단 다음 게임 WorkUnit은 asset/FX decision gate를 요구한다.
- 개발팀: script/package/docs/checker만 수정한다.
- 검수팀: dry-run smoke와 deterministic checker, full CI를 검증한다.
- 마케팅팀: N/A — 실채널 action 없음.
- 고객지원팀: 사람이 돌아왔을 때 state/report로 현재 runner 상태와 다음 action을 알 수 있어야 한다.

## Subagent/Team Routing

- 이번 tranche는 solo execute. write scope가 `scripts/package/docs/items/reports`로 강하게 연결되어 있고, 구현과 checker가 같은 state schema를 공유하므로 분리보다 직접 통합이 빠르다.
