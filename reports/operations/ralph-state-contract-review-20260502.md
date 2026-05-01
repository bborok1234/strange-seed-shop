# Ralph state contract review

Date: 2026-05-02
Item: `items/0134-seed-ops-final-publication-ask-regression.md`
Scope-risk: narrow

## 결론

문구 감지는 `$ralph`/장시간 운영 하네스의 주된 방식이 아니다. 기존 Ralph 계열은 자연어 응답을 모두 예측하지 않고, 상태 파일과 heartbeat JSON의 phase, timestamp, branch, item, next_action, watchdog result를 읽어 continuation과 stuck 상태를 판정한다.

따라서 seed-ops publication boundary 회귀도 “어떤 문장을 출력했는가”가 아니라 다음 구조화 상태로 검사해야 한다.

```json
{
  "phase": "external-publication-gate",
  "publication_gate": {
    "active": true,
    "kind": "representational_communication",
    "target": "github_pr",
    "pending_command": "gh pr create --body-file ...",
    "branch": "codex/...",
    "commit": "..."
  },
  "confirmation": {
    "required": true,
    "channel": "commentary"
  },
  "continuation": {
    "action": "write next issue plan",
    "artifact_path": "items/....md",
    "safe_local_work": "..."
  },
  "stop_rule": "none"
}
```

## `$ralph` skill 구조

`/Users/mirlim/.codex/skills/ralph/SKILL.md`는 다음 상태 전이를 명시한다.

- 시작: `state_write({mode: "ralph", active: true, current_phase: "executing"})`
- 반복: `state_write({mode: "ralph", iteration: <current>, current_phase: "executing"})`
- 검증/수정: `current_phase: "verifying"` 또는 `"fixing"`
- 완료: `active: false`, `current_phase: "complete"`

또한 `.omx/state/{scope}/ralph-progress.json`에 progress/verdict를 남기고, completion 전 fresh verification과 architect verification을 요구한다.

## 현재 `$ralph` 사용 상태

이번 사용자 메시지의 `$ralph`는 hook에 의해 prompt-side activation만 수행했다.

- Session state: `.omx/state/sessions/019de3f6-4472-7cd1-a549-aa9eb399c536/ralph-state.json`
- State: `active: true`, `current_phase: "starting"`, `iteration: 0`
- Skill active state: `.omx/state/sessions/019de3f6-4472-7cd1-a549-aa9eb399c536/skill-active-state.json`
- Note: developer routing context도 “Prompt-side `$ralph` activation seeds Ralph workflow state only; it does not invoke `omx ralph`”라고 명시했다.

즉, 지금 Codex App 안에서는 `$ralph` 스킬 지침과 상태 파일은 활성화되지만, 예전 장시간 CLI runner 자체가 자동으로 시작되는 것은 아니다.

## 예전 장시간 루프 구조

예전 4시간 이상 동작은 `.omx/tasks/overnight-ralph-driver-20260427T1515.sh` 같은 shell driver가 담당했다.

- `while` loop로 시간 상한까지 `omx exec ...`를 반복 실행
- 각 iteration log와 final output file을 `.omx/logs/`에 저장
- 별도 operator trial runner가 5분 간격으로 `scripts/write-operator-heartbeat.mjs`를 호출
- `scripts/operator-watchdog.mjs`가 heartbeat JSON/JSONL을 읽고 fresh/stale/missing/invalid를 판정

이 방식은 LLM 응답 문구가 아니라 machine-readable heartbeat를 기준으로 loop liveness를 본다.

## 외부 reference check

다른 durable agent/workflow 문서도 같은 방향이다.

- LangGraph persistence는 graph state를 checkpoint로 저장하고, human-in-the-loop, time travel debugging, fault-tolerant execution을 checkpoint 기반으로 지원한다. 핵심은 “문장 감지”가 아니라 thread/checkpoint/state snapshot이다. Source: [LangGraph Persistence](https://docs.langchain.com/oss/python/langgraph/persistence)
- mcp-agent의 Temporal durable agents는 long-lived MCP workflows에 durable state, automatic retries, pause/resume semantics를 붙인다. Temporal engine은 workflow state machine을 뒤에서 지속하고 run handle로 resume/result를 관리한다. Source: [mcp-agent Durable Agents](https://docs.mcp-agent.com/mcp-agent-sdk/advanced/durable-agents)
- Cloudflare long-running agents 문서는 long-running agent를 항상 켜진 process가 아니라 durable identity/state로 설명한다. 살아남는 것은 SQLite state, schedules, fiber checkpoints이고, in-memory variable/timer/fetch는 사라진다고 구분한다. Source: [Cloudflare Long-running agents](https://developers.cloudflare.com/agents/concepts/long-running-agents/)

이 reference들은 모두 “생성된 자연어가 특정 문구를 포함하는지”보다 durable state, checkpoint, replay/recovery, plan/current step 같은 구조화 상태를 liveness와 recovery의 기준으로 삼는다.

## 이번 하네스 수정 방향

- `scripts/write-operator-heartbeat.mjs`에 `publication_gate`, `confirmation`, `continuation`, `stop_rule` 필드를 추가했다.
- `scripts/check-seed-ops-publication-gate-state.mjs`는 fixture 기반으로 다음 실패를 구조적으로 잡는다.
  - `confirmation.channel === "final"`
  - `continuation` 누락
  - `continuation.artifact_path` 없음 또는 파일 없음
  - `publication_gate.pending_command`/`branch`/`commit` 누락
- `scripts/check-ops-live.mjs`는 현재 heartbeat가 `external-publication-gate`이면 같은 구조를 검사한다.
- `scripts/check-seed-ops-queue-gate.mjs`는 publication boundary 자연어 문구 검사가 아니라 package script 등록과 기존 queue 품질 gate를 확인한다.

## 남은 한계

Repo script는 이미 전송된 assistant `final` 자체를 사후에 직접 차단할 수 없다. 대신 다음 실행 전에 heartbeat가 `confirmation.channel: "final"` 또는 continuation 누락 상태이면 CI/ops-live가 실패하도록 만들어, 상태 기반으로 같은 failure class를 추적한다.
