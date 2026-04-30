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
- UI/visual 작업은 Browser Use `iab` 실기 QA를 먼저 시도한다. Node REPL `js` tool이 처음 보이지 않으면 fallback 전에 `tool_search`로 노출을 재확인한다.
- 다음 issue 선택은 "safe small item"이 아니라 `docs/NORTH_STAR.md` 경쟁작 기준 Production Bar와 `docs/IDLE_CORE_CREATIVE_GUIDE.md` vertical slice workflow를 우선한다. safety는 stop/approval gate이고, 제품 우선순위 기준이 아니다.

## Before implementation

1. `docs/README.md`, `docs/ROADMAP.md`, `docs/PROJECT_COMMANDS.md`, `docs/NORTH_STAR.md`를 확인한다.
2. 게임 기능/UI/HUD/playfield/asset/QA issue는 `game-studio:game-studio`로 먼저 분류하고 specialist route를 고정한다.
3. UI/HUD/layout은 `game-studio:game-ui-frontend`, browser-game QA는 `game-studio:game-playtest`, Phaser runtime은 `game-studio:phaser-2d-game`, simulation/render/UI boundary는 `game-studio:web-game-foundations`, 2D sprite/FX는 `game-studio:sprite-pipeline` 기준을 적용한다.
4. 새 issue/work item은 구현 전에 `items/<id>.md` 또는 동등 문서에 `## Plan`과 `## Game Studio route`를 만든다.
5. stop rule이 없는 한 완료 후 다음 production vertical slice 후보를 plan-first로 선택한다.
6. 다음 issue로 넘어가기 전 닫힌 issue/PR metadata를 확인해 acceptance checkbox, 작업 checklist, Browser Use/visual evidence, main CI 링크가 비어 있지 않은지 검증한다.

## Issue selection gate

다음 게임 issue 후보는 아래 5개 축 중 최소 3개를 명시해야 한다.

1. `player verb`: 플레이어가 새로 하거나 더 명확히 이해하는 행동.
2. `production/progression role`: 생산 엔진, 주문/납품, 업그레이드, 오프라인 복귀, 연구/원정, 수집 progression 중 연결되는 위치.
3. `screen moment`: 첫 5분 또는 복귀 후 30초 안에서 보이는 실제 화면 순간.
4. `asset/FX`: 필요한 생명체/주문/자원/피드백 asset 또는 기존 asset 활용 계획.
5. `playtest evidence`: Browser Use/visual QA/수치 검증으로 확인할 사용자 관찰 포인트.

색, 여백, 문구, 테스트-only, 문서-only 작업은 위 vertical slice를 막는 blocker를 제거하거나 명확한 slice 일부일 때만 고른다. `safe`, `local`, `작다`는 선택 이유가 될 수 없고, 오직 승인/파괴/외부 권한 gate를 통과했다는 조건으로만 사용한다.

## Product-quality gates

- UI/visual 작업은 `docs/GAME_UI_UX_RESEARCH_20260428.md`, `docs/IDLE_CORE_CREATIVE_GUIDE.md`, `docs/DESIGN_SYSTEM.md`, Game Studio route를 acceptance criteria에 연결한다.
- `npm run check:visual`은 반복 회귀 gate이지 Browser Use 실기 QA의 대체재가 아니다. Browser Use evidence 또는 현재 세션 blocker 없이 Playwright 결과만으로 UI/visual 작업을 완료 처리하지 않는다.
- 과거 Browser Use blocker report는 현재 세션의 fallback 근거가 아니다. fallback을 쓰려면 현재 세션에서 Browser Use를 다시 시도하고 blocker를 새로 기록한다.
- “viewport 안에 있음”, “겹치지 않음”, “DOM text visible”만으로 UI 작업을 통과시키지 않는다.
- 사용자 screenshot으로 제보된 visual bug는 그 screenshot의 URL, viewport, action sequence를 재현한 뒤 before/after evidence와 자동 회귀 gate를 같은 PR에 추가한다.
- 모바일 panel/card QA는 `scrollHeight/clientHeight`, body scroll, bottom-tab overlap, visible child overflow를 함께 확인한다. DOM text가 있어도 `overflow: hidden`으로 중요한 내용이 가려지면 실패다.
- 정원 첫 화면은 game-playtest 관점에서 첫 actionable screen, player verb, playfield obstruction, HUD weight를 확인한다.
- 디자인/북극성 gate가 실패하면 CI가 green이어도 PR을 완료로 부르지 않는다.

## Stop rules

멈추는 경우는 다음뿐이다.

- 사용자가 stop/cancel/abort를 명시한다.
- 시간 상한이 도달했고 final heartbeat/watchdog/daily report가 남았다.
- 결제, 로그인, 광고, 외부 배포, 고객 데이터, 실채널 GTM, credential, destructive boundary가 필요하다.
- 치명적 blocker가 있고 복구 경로가 없다.
- 사용자의 제품 결정이 필요한 materially branching 선택지가 있다.
