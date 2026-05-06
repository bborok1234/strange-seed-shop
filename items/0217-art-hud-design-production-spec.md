# 0217 - Art/HUD design production spec

Status: done
Date: 2026-05-06
Game Studio route: `game-studio:game-studio` -> `game-studio:game-ui-frontend` -> `game-studio:game-playtest`

## Context

사용자 피드백에서 데스크톱/모바일 정원 화면의 plot 위치, 텍스트 가독성, 떠다니는 actor 위치, 시작 직후 진행 불가능 상태, 정적인 화면 문제가 반복 확인되었다. 직전 작업에서 desktop browser도 모바일 game frame을 강제하는 정책은 적용했지만, 앞으로 같은 문제가 다시 생기지 않으려면 UI/UX 판단 기준과 정원 아트/HUD 제작 규격을 문서로 고정해야 한다.

## Plan

1. 기존 `NORTH_STAR`, `GAME_UI_UX_RESEARCH_20260428`, `IDLE_CORE_CREATIVE_GUIDE`, `DESIGN_SYSTEM`을 기준으로 상위 디자인 원칙을 정리한다.
2. 최신 공식 스토어/Steam 표면에서 경쟁작 레퍼런스를 재확인하고, 가져올 점과 금지할 점을 분리한다.
3. `docs/DESIGN.md`를 추가해 게임 전체 UI/UX 판단 기준을 정의한다.
4. `docs/ART_HUD_PRODUCTION_SPEC.md`를 추가해 정원/생산 화면의 plot, actor, HUD, label, motion, QA 수용 기준을 정의한다.
5. `docs/README.md`와 `docs/ROADMAP.md`에 새 문서를 연결한다.

## Acceptance Criteria

- `docs/DESIGN.md`가 UI/UX 상위 기준, 화면별 판단 기준, 검수 질문, 문서 위계를 포함한다.
- `docs/ART_HUD_PRODUCTION_SPEC.md`가 HUD 예산, plot/actor/text/motion 기준, QA 프로토콜, production-ready 판정을 포함한다.
- 두 문서는 `DESIGN_SYSTEM.md`와 역할이 겹치지 않는다.
- 경쟁작 레퍼런스는 공식/스토어/Steam URL을 문서에 남긴다.
- `npm run check:docs`와 `npm run check:p0-ui-ux`가 통과한다.

## Evidence

- Added: `docs/DESIGN.md`
- Added: `docs/ART_HUD_PRODUCTION_SPEC.md`
- Updated: `docs/README.md`
- Updated: `docs/ROADMAP.md`

## Risk

이 작업은 기준 문서화라서 화면을 직접 고치지는 않는다. 다음 visual/gameplay issue는 이 문서의 수용 기준을 plan-first에 끌어와야 한다.

