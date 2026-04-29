---
name: seed-ops
description: 이상한 씨앗상회 프로젝트 전용 무한 운영모드. 사용자가 `$seed-ops`, 계속 운영, 게임사 운영모드, 북극성까지 계속 달려, 밤새/장시간 돌아가라고 말할 때 사용한다. issue intake -> plan-first -> 구현 -> 검증 -> PR -> CI -> merge -> 다음 issue 반복을 수행한다.
---

# Seed Ops

이 skill은 `$ralph` 같은 범용 지속 실행 엔진 위에 이 프로젝트의 운영사 계약을 얹는다.

## Mode contract

- 목표: 게임 북극성과 에이전트 네이티브 운영사 북극성을 향해 계속 진행한다.
- 기본 루프: issue 선택/생성 -> `## Plan` artifact -> branch -> 구현 -> 로컬 검증 -> PR -> GitHub checks -> merge -> main CI -> 다음 issue.
- 완료 보고는 중단 조건이 아니라 checkpoint다.
- 각 issue는 작은 승리, 수용 기준, 검증 명령, evidence, 남은 리스크를 남긴다.
- issue 종료 전 GitHub issue 본문의 `## 수용 기준` 체크박스를 실제 검증 결과로 갱신한다. `Closes #id`는 issue를 닫을 뿐 체크박스를 채우지 않으므로 빈 체크박스가 남으면 완료 gate 실패다.

## Before implementation

1. `docs/README.md`, `docs/ROADMAP.md`, `docs/PROJECT_COMMANDS.md`, `docs/NORTH_STAR.md`를 확인한다.
2. 게임 기능/UI/HUD/playfield/asset/QA issue는 `game-studio:game-studio`로 먼저 분류하고 specialist route를 고정한다.
3. UI/HUD/layout은 `game-studio:game-ui-frontend`, browser-game QA는 `game-studio:game-playtest`, Phaser runtime은 `game-studio:phaser-2d-game`, simulation/render/UI boundary는 `game-studio:web-game-foundations`, 2D sprite/FX는 `game-studio:sprite-pipeline` 기준을 적용한다.
4. 새 issue/work item은 구현 전에 `items/<id>.md` 또는 동등 문서에 `## Plan`과 `## Game Studio route`를 만든다.
5. stop rule이 없는 한 완료 후 다음 issue를 plan-first로 선택한다.
6. 다음 issue로 넘어가기 전 닫힌 issue/PR metadata를 확인해 acceptance checkbox, 작업 checklist, Browser Use/visual evidence, main CI 링크가 비어 있지 않은지 검증한다.

## Product-quality gates

- UI/visual 작업은 `docs/GAME_UI_UX_RESEARCH_20260428.md`, `docs/IDLE_CORE_CREATIVE_GUIDE.md`, `docs/DESIGN_SYSTEM.md`, Game Studio route를 acceptance criteria에 연결한다.
- “viewport 안에 있음”, “겹치지 않음”, “DOM text visible”만으로 UI 작업을 통과시키지 않는다.
- 정원 첫 화면은 game-playtest 관점에서 첫 actionable screen, player verb, playfield obstruction, HUD weight를 확인한다.
- 디자인/북극성 gate가 실패하면 CI가 green이어도 PR을 완료로 부르지 않는다.

## Stop rules

멈추는 경우는 다음뿐이다.

- 사용자가 stop/cancel/abort를 명시한다.
- 시간 상한이 도달했고 final heartbeat/watchdog/daily report가 남았다.
- 결제, 로그인, 광고, 외부 배포, 고객 데이터, 실채널 GTM, credential, destructive boundary가 필요하다.
- 치명적 blocker가 있고 복구 경로가 없다.
- 사용자의 제품 결정이 필요한 materially branching 선택지가 있다.
