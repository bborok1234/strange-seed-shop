# 운영사 보고서

이 디렉터리는 에이전트 네이티브 운영사 프로젝트의 실행 증거를 저장한다. 목표는 “오래 돌았다”는 주장을 로그와 report로 검증 가능하게 만드는 것이다.

## 파일 종류

| 파일 | 목적 |
| --- | --- |
| `operator-heartbeat-YYYYMMDD.jsonl` | Ralph/session heartbeat ledger. timestamp, phase, branch, issue, PR, current command, next action을 JSONL로 누적한다. |
| `operator-loop-YYYYMMDD.md` | issue-to-PR loop report. issue, branch, commits, local checks, GitHub checks, follow-up evidence를 요약한다. |
| `operator-completion-gate-YYYYMMDD.md` | 작업 완료 gate report. issue, draft PR, verification, audit/follow-up 링크가 완료 선언 전에 모두 존재하는지 기록한다. |
| `stuck-*.md` / `stuck-drill-*.md` | stuck report. `collab: Wait`, stale tmux, red CI, timeout, orphan process가 완료로 오인되지 않게 한다. |
| `operator-trial-*.md` | Milestone 7 이후 다시간 trial report. heartbeat coverage, completed work, recovery attempts를 기록한다. |

## 최소 증거 기준

- heartbeat는 iteration마다 한 번 이상 기록한다.
- red CI는 `CI repair` 절차에 따라 로그 URL, 원인 가설, 수정 시도, 재검증 또는 blocker report를 남긴다.
- issue-to-PR 루프는 main merge 여부와 무관하게 PR URL과 GitHub check 상태를 남긴다.
- 작업 완료 gate는 draft PR, 검증 명령, visual evidence 또는 N/A 사유, 남은 위험, follow-up issue/audit 링크를 한 report에 함께 남긴다.
- 실제 고객 데이터, credential, 결제, 실채널 GTM 증거는 이 디렉터리에 저장하지 않는다.
