# Roadmap closed issue sync v0

Status: completed
Work type: agent_ops
Branch: `codex/0088-roadmap-closed-issue-sync-v0`
Date: 2026-04-29
Issue: #156

## 문제 / 배경

`docs/ROADMAP.md`에 active로 남은 항목 중 GitHub issue가 이미 CLOSED인 항목이 있었다. 이 상태는 `$seed-ops`가 다음 작업을 고를 때 닫힌 issue를 다시 후보처럼 보는 문제를 만든다.

## Small win

다음 issue 선택에서 이미 닫힌 #135/#137/#140/#117/#89가 active 후보처럼 보이지 않는다.

## Plan

1. GitHub에서 active roadmap issue들의 CLOSED/OPEN 상태를 확인한다.
2. CLOSED issue와 연결된 roadmap row를 `done`으로 바꾼다.
3. 연결 item의 `Status`를 `completed`로 바꾸고 evidence/report 링크를 추가한다.
4. `npm run update:dashboard`, `npm run check:ci`로 검증한다.

## 수용 기준

- [x] Issue #135, #137, #140, #117, #89의 GitHub CLOSED 상태를 확인했다.
- [x] 해당 roadmap rows가 더 이상 active가 아니다.
- [x] 연결 item status와 evidence가 완료 상태를 반영한다.
- [x] dashboard가 재생성됐다.
- [x] `npm run check:ci`가 통과한다.

## 검증 명령

- [x] `npm run update:dashboard`
- [x] `npm run check:ci`

## 안전 범위

- runtime code 변경 없음.
- 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음.
- 새 dependency 없음.
- runtime image generation 없음.
