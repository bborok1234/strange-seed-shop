# Operator continuation watchdog

Status: active
Work type: agent_ops
Issue: #115
Owner: agent
Created: 2026-04-29
Updated: 2026-04-29
Scope-risk: narrow

## Intent

이번 `$ralph` 루프는 PR/CI/main merge를 성공적으로 반복했지만, 완료 리포트를 내면서 장시간 운영을 계속하지 않고 약 1시간 수준에서 멈췄다. 운영사 북극성은 “완료 보고”가 아니라 “다음 issue를 스스로 선택하고 plan-first로 이어가는 반복”이므로, 완료 보고 후 조기 종료를 운영 버그로 고정한다.

## Small win

완료 보고는 중단 조건이 아니라 checkpoint이며, 명시 중단·시간 상한·외부 승인·치명적 blocker가 없으면 다음 issue를 plan-first로 선택해야 한다는 규칙을 문서와 checker가 검증한다.

## Plan

1. 운영 모델에 completion checkpoint / continuation watchdog 규칙을 추가한다.
2. runbook의 stop/summarize 절차에 “보고 후 다음 issue 자동 진입”과 “stop 조건 외 종료 금지”를 명시한다.
3. `reports/operations/operator-continuation-watchdog-20260429.md`에 원인, 재발 방지, 검증 증거를 남긴다.
4. `scripts/check-operator.mjs`가 이 item/report/docs 문구를 필수 검증하도록 갱신한다.
5. roadmap/dashboard를 Issue #115 기준으로 갱신하고, 로컬 검증 후 PR/CI/main merge까지 진행한다.

## Acceptance Criteria

- `docs/AUTONOMOUS_PROJECT_OPERATING_MODEL.md`에 “완료 보고는 중단 조건이 아니라 체크포인트”와 “다음 issue를 plan-first로 선택” 규칙이 들어간다.
- `docs/OPERATOR_RUNBOOK.md`가 stop 조건 외에는 장시간 운영을 종료하지 않고 다음 루프를 시작하도록 명시한다.
- `reports/operations/operator-continuation-watchdog-20260429.md`가 이번 1시간 조기 종료의 원인과 방지 규칙을 기록한다.
- `npm run check:operator`와 `npm run check:all`이 통과한다.

## Evidence

- Issue: #115
- Report: `reports/operations/operator-continuation-watchdog-20260429.md`
- Verification:
  - `npm run check:operator` — pass
  - `npm run check:dashboard` — pass
  - `npm run check:all` — pass

## Apply Conditions

- 실제 6h/24h 실행을 이 issue 안에서 새로 시작하지 않는다.
- 제품 UI/게임 로직은 이번 issue에서 변경하지 않는다.
- 결제, 로그인, 광고, 외부 배포, 고객 데이터, 실채널 GTM은 건드리지 않는다.

## Verification

- `npm run check:operator`
- `npm run check:dashboard`
- `npm run check:all`
