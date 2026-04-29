# Operator Continuation Watchdog

Status: active
Issue: #115
Item: `items/0066-operator-continuation-watchdog.md`
Created: 2026-04-29

## 원인

이번 운영 루프는 Issue #109/#111/#113을 각각 PR #110/#112/#114로 merge하고 main CI를 확인했지만, 그 뒤 “완료 리포트”를 내면서 사실상 세션을 닫았다. 사용자가 원한 것은 6~8시간 이상 이어지는 운영사 루프였으므로, 이것은 제품 버그가 아니라 운영 루프의 조기 종료 버그다.

## 재발 방지 규칙

- 완료 보고는 중단 조건이 아니라 체크포인트다.
- 장시간 `$ralph`/운영모드에서는 PR merge와 main CI 확인 후에도 명시 중단, 시간 상한, 외부 승인, 치명적 blocker가 없으면 멈추지 않는다.
- 다음 행동은 “최종 요약 후 종료”가 아니라 다음 issue를 plan-first로 선택하는 것이다.
- 다음 issue는 구현 전에 `items/<id>.md` 또는 동등 문서에 `## Plan`, 수용 기준, 검증 명령, 금지 범위를 남겨야 한다.

## 현재 issue의 small win

Issue #115는 실제 6h/24h 실행을 새로 시작하지 않고, 위 continuation watchdog 규칙을 `docs/AUTONOMOUS_PROJECT_OPERATING_MODEL.md`, `docs/OPERATOR_RUNBOOK.md`, `AGENTS.md`, `scripts/check-operator.mjs`에 고정한다.

## 검증 계획

- `npm run check:operator`
- `npm run check:dashboard`
- `npm run check:all`

## 검증 결과

- `npm run check:operator` — pass, requiredPaths 53, failures 0.
- `npm run check:dashboard` — pass, `docs/DASHBOARD.md` 최신.
- `npm run check:all` — pass, Playwright visual 12개 통과 및 production build 성공.

## 남은 리스크

- 이 규칙은 문서/체커 수준의 방지 장치다. 실제 6h/24h 무중단 운영 품질은 heartbeat daemon, watchdog, PR/CI polling, daily report가 함께 돌아가는 별도 trial에서 계속 검증해야 한다.
- 컨텍스트 한계나 플랫폼 세션 종료는 코드로 완전히 막을 수 없으므로, 종료 전 checkpoint와 next issue 기록을 더 자주 남겨야 한다.
