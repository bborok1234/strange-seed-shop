# 0220 - Production slice readiness gate

Status: done
Date: 2026-05-06
Game Studio route: `game-studio:game-studio` -> `game-studio:web-game-foundations` -> `game-studio:game-ui-frontend` -> `game-studio:game-playtest`

## Context

사용자 인터뷰에서 다음 core gameplay 작업은 `Bottleneck-readable production graph`를 첫 readiness 대상이자 blocking gate로 삼기로 결정했다. 사용자는 목표 달성이 더 중요하므로 필요하면 full vertical slice 리빌드를 허용한다고 답했고, 첫 성공 기준은 첫 10분 retention loop로 고정했다.

## Interview Decisions

- 첫 readiness 대상: `Bottleneck-readable production graph`
- 병목 축: `생산 / 보관 / 납품`
- 첫 화면 노출: 요약 1줄 + 상세는 action card
- 통과 기준: 이해 중심
- 업그레이드 구조: 가장 부족한 축 1개 추천 + 다른 2축도 선택 가능
- 업그레이드 결과: 수치와 화면 prop 둘 다 변해야 함
- 첫 병목: 보관 부족 먼저
- 범위: Full vertical slice 리빌드 허용
- 성공 기준: 첫 10분 retention loop
- gate 강도: Blocking Gate
- 실패 처리: PR을 닫지 않고 같은 slice 안에서 보완
- 증거: Scripted QA + screenshot evidence

## Plan

1. `docs/PRODUCTION_SLICE_READINESS.md`를 추가한다.
2. `docs/README.md`, `docs/IDLE_CORE_PRODUCTION_SPEC.md`, `docs/ROADMAP.md`에 readiness gate를 연결한다.
3. 문서/CI 검증을 통과시킨다.

## Acceptance Criteria

- 다음 core gameplay PR은 readiness gate를 통과하지 않으면 merge-ready가 아니라고 명시한다.
- 첫 10분 retention loop 7단계와 증거 계획이 문서화된다.
- full vertical slice 리빌드는 허용하되 Phase 0 금지선은 유지한다.
- 실패 시 부분 merge 금지와 같은 slice 내 보완 원칙이 명시된다.
- `npm run check:docs`, `npm run check:p0-ui-ux`, `npm run check:ci`가 통과한다.

## Evidence

- Added: `docs/PRODUCTION_SLICE_READINESS.md`
- Updated: `docs/README.md`
- Updated: `docs/IDLE_CORE_PRODUCTION_SPEC.md`
- Updated: `docs/ROADMAP.md`

