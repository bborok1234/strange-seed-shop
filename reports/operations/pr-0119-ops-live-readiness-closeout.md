# ops live readiness main CI closeout

## 요약

PR #230 merge 뒤 main CI에서 `check:ops-live`가 committed heartbeat JSONL의 branch를 현재 `main`과 비교해 실패했다. JSONL은 과거 실행 evidence이므로 branch 일치 검사는 `.omx/state/operator-heartbeat.json` live runtime heartbeat에만 적용하도록 고쳤다.

## Small win

- main CI가 committed heartbeat report를 읽을 때도 live readiness gate를 통과할 수 있다.

## Plan-first evidence

- Plan artifact: `items/0119-ops-live-readiness-gate.md`
- Related PR: #230
- Main CI failure: run `25205311514`

## 사용자/운영자 가치

- 운영사 가치: main에서 red CI를 완료로 부르지 않고 원인을 확인해 closeout fix로 복구한다.

## Before / After 또는 Visual evidence

- Before: main CI `check:ops-live`가 `heartbeat branch codex/0119-ops-live-readiness-gate does not match current branch main`로 실패했다.
- After: runtime `.omx/state` heartbeat만 current branch와 비교하고, committed JSONL evidence는 freshness/필드/stop signal만 검사한다.
- N/A 사유: UI/visual 변경 없음.

## 검증

- `npm run check:ops-live`: PASS
- `npm run check:ops-live -- --heartbeat reports/operations/operator-heartbeat-20260501.jsonl`: PASS
- `npm run check:ci`: PASS

## 안전 범위

- 게임 런타임 변경 없음.
- 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음.
- Branch protection 우회 없음.

## 남은 위험

- `check:ops-live`는 CI에서 committed JSONL을 쓸 수 있고, 실제 장시간 runtime freshness는 여전히 `.omx/state`와 `operator:watchdog`가 담당한다.
