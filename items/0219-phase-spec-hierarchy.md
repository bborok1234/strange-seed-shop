# 0219 - Phase/spec hierarchy clarification

Status: done
Date: 2026-05-06
Game Studio route: `game-studio:game-studio` -> `game-studio:web-game-foundations` -> `game-studio:game-ui-frontend`

## Context

`docs/DESIGN.md`, `docs/ART_HUD_PRODUCTION_SPEC.md`, `docs/IDLE_CORE_PRODUCTION_SPEC.md`가 추가되면서 기존 Phase 0 문서, P0 UI/UX rescue 문서, P0.5 creative guide, P0.6 후보 slice 사이의 우선순위가 모호해질 수 있다. 다음 작업자가 오래된 P0 문서를 근거로 active production bar를 우회하거나, 반대로 P0.5/P0.6 문서를 Phase 0 안전 계약보다 위로 해석하면 안 된다.

## Plan

1. `docs/README.md`에 phase/spec hierarchy를 명시한다.
2. `docs/DESIGN.md`와 `docs/IDLE_CORE_PRODUCTION_SPEC.md`에 precedence note를 추가한다.
3. `docs/ROADMAP.md`의 P0.5 섹션에 Phase naming rule을 추가한다.
4. 문서 검사와 CI를 통과시킨다.

## Acceptance Criteria

- Phase 0은 baseline product/economy/safety contract로 남는다.
- P0.5는 현재 playable production rescue overlay로 정의된다.
- P0.6은 아직 active milestone이 아니라 다음 candidate slice 묶음으로 정의된다.
- 새 visible gameplay/HUD/core work는 `DESIGN.md`, `ART_HUD_PRODUCTION_SPEC.md`, `IDLE_CORE_PRODUCTION_SPEC.md`를 active 기준으로 사용한다.
- 과거 리서치/가이드 문서는 근거와 히스토리로 읽되, active spec과 충돌하면 active spec을 우선한다.

## Evidence

- Updated: `docs/README.md`
- Updated: `docs/DESIGN.md`
- Updated: `docs/IDLE_CORE_PRODUCTION_SPEC.md`
- Updated: `docs/ROADMAP.md`

