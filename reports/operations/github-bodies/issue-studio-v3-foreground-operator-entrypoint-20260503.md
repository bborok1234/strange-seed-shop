## 요약

Studio Harness v3 전환 목적은 과거 `$seed-ops` 프롬프트 루프를 다시 쓰는 것이 아니라, GitHub issue/PR/GateEvent를 operational truth로 삼아 기획/아트/구현/Browser Use QA/PR/check/merge/다음 WorkUnit까지 계속 도는 AI 네이티브 게임 운영사 하네스를 만드는 것이다.

#290 `studio:v3:runner`는 GitHub queue/PR/CI watcher + decision/heartbeat runner를 만들었지만, 실제 foreground Codex/OMX operator entrypoint는 없었다. 이 공백 때문에 v3 사용법을 다시 `$seed-ops`로 안내하는 중대 회귀가 발생했다.

## Plan

1. v3 native foreground operator entrypoint를 `npm run studio:v3:operate`로 추가한다.
2. 이 명령은 `$seed-ops`를 호출하거나 안내하지 않고, v3 전용 운영 프롬프트/명령을 생성한다.
3. foreground 실행, detached 24h 실행, prompt-only/doctor 모드를 제공한다.
4. 실행 전 GitHub CLI, git repo, Codex/OMX CLI, Browser Use Node REPL MCP(`node_repl`/`js`) readiness를 점검한다.
5. `docs/STUDIO_HARNESS_V3_RUNNER_USAGE.md`를 watcher/decision runner와 foreground operator로 분리해 설명한다.
6. stale `$seed-ops` routing anchor가 v3 entrypoint로 오해되지 않게 `docs/PROJECT_COMMANDS.md`와 checker를 갱신한다.
7. deterministic checker를 추가해 v3 usage doc이 `$seed-ops`를 entrypoint로 안내하지 못하게 막는다.

## 수용 기준

- [x] `npm run studio:v3:operate -- --help`가 사용법을 보여준다.
- [x] `npm run studio:v3:operate -- --doctor --print-command`가 GitHub/Codex/OMX/Browser Use readiness와 실제 foreground/detached 실행 명령을 출력한다.
- [x] 생성되는 v3 operator prompt가 GitHub issue/PR/GateEvent authoritative, queue-empty non-stop, Browser Use iab gate, plan-first, PR/check/merge/main CI observation, no-final continuation을 포함한다.
- [x] v3 usage 문서가 `studio:v3:runner`와 `studio:v3:operate`의 차이를 명확히 설명한다.
- [x] 문서/체커가 `$seed-ops`를 v3 foreground operator entrypoint로 다시 안내하지 못하게 막는다.
- [x] focused checks와 `npm run check:ci`가 통과한다.

## 검증 명령 / 결과

- `npm run studio:v3:operate -- --help` → passed
- `npm run studio:v3:operate -- --doctor --print-command --issue 293` → passed
- `npm run studio:v3:operate -- --prompt-only --issue 293 --max-iterations 1` → passed
- `npm run check:studio-v3-operator` → passed
- `npm run check:project-commands` → passed
- `npm run check:studio-v3-live-runner` → passed
- `npm run check:seed-ops-queue` → passed
- `npm run check:closed-workunit-mirrors` → passed
- `npm run check:ci` → passed

## 안전 범위

- 결제/광고/외부 production deploy/customer data 없음.
- 실제 GitHub issue/PR/comment/branch/merge는 이 repo 운영 계약상 routine agent responsibility다.
- detached 24h operator 실행은 명령을 제공하되, 이번 WorkUnit은 entrypoint 구현과 deterministic 검증까지만 수행한다.

## 남은 위험

- Codex CLI의 in-process tool palette는 현재 세션에서 MCP 추가를 hot reload하지 않을 수 있다. 새 CLI 세션에서는 `node_repl` MCP가 노출되어야 하며, doctor가 이를 점검한다.
- `codex exec`/`omx exec`는 모델 final 또는 context exhaustion에서 종료될 수 있으므로, runner heartbeat/watchdog이 stale 상태를 정확히 표시해야 한다.
