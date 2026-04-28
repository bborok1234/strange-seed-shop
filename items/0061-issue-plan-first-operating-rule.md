# Item 0061 — 이슈 단위 plan-first 운영 규칙

Status: active
Work type: agent_ops
Issue: #106
Date: 2026-04-29

## 사용자 지침

자동 루프에서 무조건 이슈 단위 작업을 할 때는 plan 과정을 거친 뒤 개발을 진행한다. P0가 끝나도 이 규칙은 북극성을 향한 운영사 루프의 기본 규칙으로 유지한다.

## Plan

1. `AGENTS.md`의 자율 운영 규칙에 issue/work-item 단위 plan-first gate를 추가한다.
2. `docs/AUTONOMOUS_PROJECT_OPERATING_MODEL.md`의 자동 루프 순서를 `issue -> plan -> branch -> work item -> implementation -> verification -> PR`로 바꾼다.
3. `docs/OPERATOR_RUNBOOK.md`에 시작 절차와 반복 규칙을 추가해 새 issue를 집은 직후 plan artifact를 만들게 한다.
4. PR/Issue 템플릿 또는 operator checker가 `Plan` 문구를 검증하게 한다.
5. `docs/ROADMAP.md`와 dashboard를 갱신해 #103 전 선행 규칙 적용을 기록한다.

## 수용 기준

- [ ] 운영 문서 2곳 이상에 plan-first 규칙이 명시된다.
- [ ] `items/` work item에는 `## Plan` 섹션이 들어가야 한다는 규칙이 생긴다.
- [ ] `npm run check:operator`가 plan-first 문구를 검증한다.
- [ ] `npm run check:all`이 통과한다.

## 제약

제품 코드, 저장 구조, 경제 값, 콘텐츠 schema, analytics event 이름은 변경하지 않는다.
