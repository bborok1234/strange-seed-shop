# Ralph Stuck Report - 2026-04-28T02:15:27.807Z

Status: reported
Reason: drill-not-stuck
Phase: executing
Scope-risk: narrow

## 감지 신호

- Reason: drill-not-stuck
- Current command: stuck report format drill
- Next action: continue implementation
- Last heartbeat: 2026-04-28T02:15:27.561Z
- Branch: codex/ralph-operator-v0
- Issue: #25
- PR: 

## 표준 복구 절차

1. 현재 명령이 아직 실행 중인지 확인한다.
2. heartbeat가 stale인지 확인한다.
3. GitHub PR check가 red이면 로그를 읽고 원인을 분류한다.
4. 로컬 재현이 가능하면 fix branch에서 수정하고 검증을 다시 실행한다.
5. 3회 이상 같은 실패가 반복되면 blocker report로 전환한다.
6. credential, 결제, 외부 배포, 고객 데이터가 필요하면 즉시 사용자 확인으로 escalation한다.

## 금지 사항

- red CI를 green으로 착각하고 완료 선언하지 않는다.
- 실패 로그를 읽지 않고 재실행만 반복하지 않는다.
- main 자동 merge나 branch protection 우회를 시도하지 않는다.

## Recovery next action

continue implementation
