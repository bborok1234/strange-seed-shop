---
name: seed-brief
description: 이상한 씨앗상회 프로젝트 전용 보고/상황판 모드. 사용자가 `$seed-brief`, 지금 상태, 뭐 했어, 어디까지 됐어, 이슈/PR/CI 요약, 아침 보고를 요청할 때 사용한다. 구현을 새로 시작하지 않고 현재 운영 상태를 증거 중심으로 요약한다.
---

# Seed Brief

## Purpose

사용자가 terminal history나 GitHub 전체를 읽지 않아도 현재 상태를 이해하게 한다.

## Output shape

- 현재 mode와 active mission
- 완료된 small wins
- 열린 issue/PR/CI와 상태
- main branch CI 상태
- visual/playable evidence
- 실패/복구/남은 리스크
- 다음 queue와 사람 결정 필요 여부

## Guardrails

- 보고 중 새 구현을 시작하지 않는다.
- 사실은 GitHub, roadmap, dashboard, reports, local status에서 확인한다.
- 추정은 추정이라고 표시한다.
- 사용자가 `$seed-ops`로 전환하지 않는 한 무한 루프를 시작하지 않는다.
