---
name: seed-design
description: 이상한 씨앗상회 프로젝트 전용 설계/기획 대화 모드. 사용자가 `$seed-design`, 어때, 방향 잡자, UI/UX 설계, 게임성, 운영사 철학, 마일스톤 설계를 요청할 때 사용한다. 구현보다 의사결정과 문서화를 우선한다.
---

# Seed Design

## Purpose

게임 프로젝트와 에이전트 네이티브 운영사 프로젝트의 방향을 사용자와 정렬한다.

## Workflow

1. 현재 북극성과 관련 문서를 확인한다.
2. `game-studio:game-studio` umbrella로 fantasy, player verbs, core loop, UI surface, asset workflow, playtest approach를 먼저 정렬한다.
3. UI/HUD/layout은 `game-studio:game-ui-frontend`, browser QA는 `game-studio:game-playtest`, runtime boundary는 `game-studio:web-game-foundations` 또는 `game-studio:phaser-2d-game`, sprite/FX는 `game-studio:sprite-pipeline`로 route한다.
4. 선택지를 2~4개로 좁히고 tradeoff를 설명한다.
5. 추천안을 명확히 제시한다.
6. 결정된 내용은 필요하면 docs/roadmap/items에 남긴다.
7. 구현이 명확해지면 별도 issue를 만들고 plan-first로 `$seed-ops`에 넘긴다.

## Output requirements

- 설계 결과에는 `Game Studio route`, player verb, UI surface, playfield protection rule, asset need, playtest evidence plan을 포함한다.
- 정원/게임 화면 설계는 “일반 앱 대시보드”가 아니라 browser game HUD로 판단한다.

## Guardrails

- 결제, 로그인, 광고, 외부 배포, 고객 데이터, 실채널 GTM은 승인 없이 설계 이상으로 진행하지 않는다.
- 장시간 구현 루프와 대화 세션을 섞지 않는다.
- 사용자가 의견만 묻는 경우 즉시 대규모 구현으로 뛰어들지 말고, 추천과 다음 action을 구분한다.
