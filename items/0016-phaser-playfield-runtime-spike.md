# Phaser playfield runtime spike

Status: proposed
Owner: agent
Created: 2026-04-27
Updated: 2026-04-27
Scope-risk: moderate

## Intent

현재 UI가 게임처럼 보이지 않는 문제를 CSS polish가 아니라 playfield 구조 관점에서 검증한다. 중앙 정원을 Phaser 기반 2D scene으로 분리할 수 있는지 작은 spike로 확인하고, React DOM HUD와 저장/콘텐츠/analytics 계약은 유지한다.

## Background

`docs/GAME_STUDIO_REVIEW_20260427.md`는 현재 화면이 dashboard처럼 보이는 주된 이유를 중앙 playfield 부재와 sprite state 부재로 판단했다. 이 item은 전체 리라이트가 아니라 가장 작은 runtime proof를 만든다.

## Acceptance Criteria

- React app은 저장, 콘텐츠, analytics event ownership을 유지한다.
- Phaser scene 또는 동등한 2D scene runtime은 중앙 garden playfield만 담당한다.
- scene은 save를 직접 mutate하지 않고 action callback만 emit한다.
- 첫 starter seed 1종에 대해 seed idle, tap response, harvest-ready feedback 중 최소 2개가 scene 안에서 보인다.
- 기존 첫 세션 루프가 유지된다: starter seed -> plant -> tap growth -> harvest -> album reward -> unlock second plot.
- 저장 데이터 구조, 콘텐츠 JSON schema, analytics event 이름, Phase 0 경제 숫자를 변경하지 않는다.
- 실제 결제, checkout, login/account, ads SDK, external navigation, runtime image generation을 추가하지 않는다.
- 360x800 garden viewport에서 playfield, current CTA, bottom tabs가 한 화면에 들어온다.
- Browser Use 또는 CDP evidence를 `reports/visual/`에 저장한다.
- `npm run check:all`이 통과하거나, 실패 시 실패 원인과 후속 작업을 기록한다.

## Proposed Plan

1. dependency decision을 먼저 기록한다. Phaser를 추가할 경우 이유, bundle risk, fallback을 문서화한다.
2. `GardenPlayfieldHost` boundary를 설계한다.
3. scene 입력 action map을 정의한다: `tap_growth`, `harvest_plot`, 필요 시 `select_plot`.
4. save snapshot을 renderer-friendly view model로 변환하는 helper를 둔다.
5. 첫 seed/plot 상태만 scene에서 렌더링한다.
6. 기존 DOM plot grid는 spike 중 fallback 또는 hidden path로 유지한다.
7. Browser Use로 첫 세션 루프를 검증한다.
8. 360x800/1280x900 캡처를 저장한다.
9. sprite-pipeline 다음 batch를 확정한다.

## Sprite Pipeline Inputs

첫 runtime spike는 완성 asset batch가 아니라 상태 전이를 보여주는 최소 sprite set만 요구한다.

- `seed_herb_001_icon` 기준 frame
- `seed_herb_001_idle_strip`
- `seed_herb_001_tap_strip`
- `sprout_herb_001_grow_strip`
- `creature_herb_common_ready_strip`
- `fx_harvest_sparkle_strip`
- `fx_leaf_reward_pop_strip`

## Apply Conditions

- 이 item은 proposed 상태여야 한다.
- 작업 전 `docs/GAME_STUDIO_REVIEW_20260427.md`, `docs/DESIGN_SYSTEM.md`, `docs/PRD_PHASE0.md`, `docs/ECONOMY_PHASE0.md`를 읽는다.
- 새 dependency가 필요하면 package 추가 이유를 PR 본문과 commit trailer에 기록한다.
- save/content/analytics 계약 변경이 필요해 보이면 구현을 중단하고 별도 item으로 분리한다.

## Verification

- Browser Use: `qaReset=1` 첫 세션 루프 완료.
- Browser Use: 하단 5개 탭 유지 확인.
- Browser Use 또는 DOM check: 상점 CTA는 `shop_surface_clicked` 외 흐름 없음.
- CDP: 360x800 garden viewport 캡처.
- CDP: 1280x900 desktop viewport 캡처.
- `npm run check:all`.

## Relationship to 0015

`0015-design-system-foundation`은 UI guardrail과 임시 HUD rescue다. `0016-phaser-playfield-runtime-spike`는 게임 느낌의 핵심 원인인 playfield/runtime 부재를 검증한다. 0016이 성공하면 0015의 CSS polish는 Phaser host 주변 HUD 규칙으로 축소한다.
