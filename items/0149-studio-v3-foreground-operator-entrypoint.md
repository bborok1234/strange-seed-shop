# #293 Studio Harness v3 foreground operator entrypoint를 seed-ops 없이 구현한다

- 상태: `ready-for-pr`
- Issue: #293
- GitHub issue: #293 `Studio Harness v3 foreground operator entrypoint를 seed-ops 없이 구현한다`
- Branch: `codex/0293-studio-v3-foreground-operator-entrypoint`
- WorkUnit authority: GitHub issue/PR/GateEvent. local docs/reports는 evidence mirror다.
- Game Studio route: N/A — 운영사 하네스/runner 작업. 단 v3 operator가 선택/생성하는 visible gameplay WorkUnit은 `game-studio:game-studio`와 specialist route, Browser Use iab evidence를 요구한다.

## Problem statement

#290 `npm run studio:v3:runner`는 GitHub queue/PR/CI watcher + decision/heartbeat runner를 만들었다. 하지만 사용자가 요구한 실제 AI 네이티브 게임 운영사는 기획/아트 판단/구현/Browser Use QA/PR/check/merge/다음 WorkUnit까지 foreground Codex/OMX 루프에서 계속 수행해야 한다. 이 entrypoint가 없어서 v3 전환 목적과 반대로 `$seed-ops`를 다시 사용법으로 안내하는 중대 회귀가 발생했다.

## Plan

1. `scripts/studio-v3-operator.mjs`와 `npm run studio:v3:operate`를 추가한다.
2. `--help`, `--doctor`, `--print-command`, `--prompt-only`, `--detached`, `--duration-hours`, `--interval-seconds`, `--issue`, `--worktree`, `--yolo` 옵션을 제공한다.
3. operator prompt는 `$seed-ops`를 호출하지 않고 v3 native contract를 직접 포함한다: GitHub authoritative WorkUnit, plan-first, branch/implementation/checks, Browser Use iab gate, PR/check/merge/main CI, no-final continuation, queue-empty non-stop.
4. doctor는 `gh`, `git`, `codex`, `omx`, `codex mcp get node_repl`, Browser Use CLI readiness를 점검한다.
5. docs는 `studio:v3:runner`(watcher/decision)와 `studio:v3:operate`(foreground operator)를 분리한다.
6. `docs/PROJECT_COMMANDS.md`와 checker에서 v3 운영을 `$seed-ops`로 route하는 stale anchor를 제거/격리한다.
7. `scripts/check-studio-v3-operator.mjs`와 `npm run check:studio-v3-operator`를 추가하고 `check:ci`에 연결한다.

## 수용 기준

- [x] `npm run studio:v3:operate -- --help`가 사용법을 보여준다.
- [x] `npm run studio:v3:operate -- --doctor --print-command`가 readiness와 실제 foreground/detached 실행 명령을 출력한다.
- [x] 생성되는 v3 operator prompt가 GitHub issue/PR/GateEvent authoritative, queue-empty non-stop, Browser Use iab gate, plan-first, PR/check/merge/main CI observation, no-final continuation을 포함한다.
- [x] v3 usage 문서가 `studio:v3:runner`와 `studio:v3:operate`의 차이를 명확히 설명한다.
- [x] 문서/체커가 `$seed-ops`를 v3 foreground operator entrypoint로 다시 안내하지 못하게 막는다.
- [x] focused checks와 `npm run check:ci`가 통과한다.

## 검증 명령

- `npm run studio:v3:operate -- --help`
- `npm run studio:v3:operate -- --doctor --print-command`
- `npm run check:studio-v3-operator`
- `npm run check:project-commands`
- `npm run check:ci`

## 리스크와 롤백

- 리스크: `codex exec`/`omx exec`는 모델 final/context exhaustion에서 종료될 수 있다. operator는 실행 명령과 prompt, heartbeat/state evidence를 남기고 watcher/checker가 stale 상태를 감지해야 한다.
- 리스크: 현재 Codex CLI 세션은 MCP 추가를 hot reload하지 않을 수 있다. doctor는 현재 session hot reload와 새 session readiness를 구분해야 한다.
- 롤백: #293 커밋을 되돌리면 v3 operator entrypoint, checker, usage doc 변경이 제거된다.

## Game Studio Department Signoff

- 기획팀: v3 operator는 production game quality WorkUnit을 queue-empty fallback으로 생성/선택해야 한다.
- 리서치팀: GitHub issue/PR/GateEvent/check 상태를 operational truth로 사용한다.
- 아트팀: operator 자체는 asset 변경 없음. 다음 visible gameplay WorkUnit은 asset/FX decision gate를 요구한다.
- 개발팀: script/package/docs/checker만 수정한다.
- 검수팀: doctor/print-command/checker/CI를 검증한다.
- 마케팅팀: 실채널 GTM 없음.
- 고객지원팀: 사용자가 돌아왔을 때 `studio:v3:operate` 사용법과 live/stale 상태를 혼동하지 않아야 한다.

## Subagent/Team Routing

- explorer subagent: 현재 v3 runner/seed-ops stale anchor 매핑을 병렬 조회한다.
- leader: script/docs/checker 구현과 검증 통합을 담당한다.

## 구현 evidence

- Operator entrypoint: `scripts/studio-v3-operator.mjs` / `npm run studio:v3:operate`
- Operator checker: `scripts/check-studio-v3-operator.mjs` / `npm run check:studio-v3-operator`
- Usage doc: `docs/STUDIO_HARNESS_V3_RUNNER_USAGE.md`
- v3 command routing docs: `docs/PROJECT_COMMANDS.md`, `docs/README.md`, `AGENTS.md`
- Deprecated adapter notice: `.codex/skills/seed-ops/SKILL.md`
- Readiness report: `reports/operations/studio-v3-operator-20260503.md`
- Closed WorkUnit mirror update: `reports/operations/closed-workunit-mirror-manifest-20260503.json`

## 검증 evidence

- `npm run studio:v3:operate -- --help` → passed
- `npm run studio:v3:operate -- --doctor --print-command --issue 293` → passed; git/gh/codex/omx/node_repl readiness all ok in local CLI
- `npm run studio:v3:operate -- --prompt-only --issue 293 --max-iterations 1` → passed
- `npm run check:studio-v3-operator` → passed
- `npm run check:project-commands` → passed
- `npm run check:studio-v3-live-runner` → passed
- `npm run check:seed-ops-queue` → passed
- `npm run check:closed-workunit-mirrors` → passed
- `npm run check:ci` → passed
