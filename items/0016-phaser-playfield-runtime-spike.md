# Phaser central garden playfield transition

Status: verified
Owner: agent
Created: 2026-04-27
Updated: 2026-04-27
Scope-risk: moderate
Source spec: `.omx/specs/deep-interview-game-studio-realignment.md`

## Intent

Phase 0의 핵심 재미 축을 **이름 있는 생명체 수집**으로 고정하고, 중앙 정원을 React DOM 카드 묶음이 아니라 Phaser 기반 2D playfield로 전환한다. 성장 조작감은 독립 목표가 아니라 첫 생명체를 얻는 감정 피크를 강화하는 보조 축이다.

## Background

Deep interview 결과, 현재 UI가 게임처럼 보이지 않는 문제는 CSS polish보다 중앙 playfield/runtime 부재에 있다. `docs/GAME_STUDIO_REVIEW_20260427.md`의 React/Phaser 분리 제안은 “도입 여부 spike”가 아니라 **중앙 garden playfield 전환**으로 유지한다.

## Dependency Decision

Phaser dependency 추가는 이 item의 다음 runtime 구현에서 허용한다.

- 이유: seed idle, tap response, grow/ready, harvest/reward FX를 DOM button/progress가 아닌 game object 상태로 표현해야 한다.
- bundle risk: Phase 0 모바일 초기 로드에 canvas runtime 비용이 추가된다. PR/commit에는 gzip size와 fallback path를 기록한다.
- fallback: React DOM garden loop는 디버그/복구 path로 유지할 수 있지만, user-facing 중심은 Phaser playfield여야 한다.
- 금지: Phaser scene이 save/localStorage/content/economy/analytics 계약을 직접 mutate하지 않는다.

## Acceptance Criteria

- React app은 저장, 콘텐츠, analytics event ownership을 유지한다.
- Phaser scene 또는 동등한 2D scene runtime은 중앙 garden playfield만 담당한다.
- scene은 save를 직접 mutate하지 않고 action callback만 emit한다.
- 첫 starter seed 1종에 대해 seed idle, tap response, grow/ready, harvest/reward feedback 중 핵심 상태가 scene 안에서 보인다.
- 기존 첫 세션 루프가 유지된다: starter seed -> plant -> tap growth -> harvest -> **named creature ownership** -> album reward -> second plot/next collection goal.
- 첫 harvest 결과는 leaves만이 아니라 이름/role/hint가 있는 생명체 소유 사건으로 보인다.
- 저장 데이터 구조, 콘텐츠 JSON schema, analytics event 이름, Phase 0 경제 숫자를 변경하지 않는다.
- 실제 결제, checkout, login/account, ads SDK, external navigation, runtime image generation을 추가하지 않는다.
- 360x800 garden viewport에서 playfield, current CTA, bottom tabs가 한 화면에 들어온다.
- Browser Use 또는 CDP evidence를 `reports/visual/`에 저장한다.
- `npm run check:all`이 통과하거나, 실패 시 실패 원인과 후속 작업을 기록한다.

## Proposed Plan

1. Phaser dependency 추가 PR에는 bundle risk, gzip size, fallback을 기록한다.
2. `GardenPlayfieldHost` boundary를 설계한다.
3. scene 입력 action map을 정의한다: `tap_growth`, `harvest_plot`, 필요 시 `select_plot`, `plant_seed`, `open_creature_detail`.
4. save snapshot을 renderer-friendly view model로 변환하는 helper를 둔다.
5. 첫 seed/plot 상태만 scene에서 렌더링한다.
6. 기존 DOM plot grid는 transition 중 fallback/debug path로 유지하되 첫 화면 focal point가 되지 않게 한다.
7. Browser Use/CDP로 첫 세션 루프와 360x800/1280x900 viewport를 검증한다.
8. sprite-pipeline 첫 batch를 starter 획득 순간 중심으로 실행한다.

## Runtime Boundary

```ts
type GardenPlayfieldAction =
  | { type: "select_plot"; plotId: string }
  | { type: "plant_seed"; plotId: string; seedId?: string }
  | { type: "tap_growth"; plotId: string }
  | { type: "harvest_plot"; plotId: string }
  | { type: "open_creature_detail"; creatureId: string };
```

React may reject invalid actions based on save/content state. Phaser renders disabled/locked state from the view model and never owns economy rules.

## Sprite Pipeline Inputs

첫 runtime batch는 “다양한 예쁜 이미지”보다 “성장 손맛 + 첫 획득 피크”를 목표로 한다.

- `seed_herb_001_idle_strip` — 말랑잎 씨앗 idle/breathing, 4 frames
- `seed_herb_001_tap_strip` — tap squash/response, 4 frames
- `sprout_herb_001_grow_strip` — seed → sprout 성장 loop, 6 frames
- `plot_ready_pulse_strip` 또는 `creature_herb_common_ready_strip` — 수확 가능 상태 pulse, 4 frames
- `fx_harvest_sparkle_strip` — 수확 sparkle, 6 frames
- `fx_leaf_reward_pop_strip` — leaf reward pop, 5 frames
- `creature_owned_name_badge_ui` — 첫 생명체 이름/소유 상태 UI 조각, static/DOM

전 생명체 sprite 완성은 보류한다. starter 획득 순간에 필요한 source/strip만 먼저 만든다.

## Current Checkpoint

- DOM fallback loop now explicitly preserves the required sequence through named creature ownership before album reward and second plot.
- `scripts/check-game-loop.mjs` asserts the first seed maps to a named creature and reports the required loop sequence.
- No images were generated and no missing asset ids were added to `assetManifest.json`.

## Apply Conditions

- 작업 전 `docs/GAME_STUDIO_REVIEW_20260427.md`, `docs/DESIGN_SYSTEM.md`, `docs/PRD_PHASE0.md`, `docs/ECONOMY_PHASE0.md`를 읽는다.
- 새 dependency가 필요하면 package 추가 이유를 PR 본문과 commit trailer에 기록한다.
- save/content/analytics 계약 변경이 필요해 보이면 구현을 중단하고 별도 item으로 분리한다.

## Verification

- Browser Use/CDP: `qaReset=1` 첫 세션 루프 완료.
- Browser Use/CDP: named creature ownership reveal and album reward CTA 확인.
- Browser Use: 하단 5개 탭 유지 확인.
- Browser Use 또는 DOM check: 상점 CTA는 `shop_surface_clicked` 외 흐름 없음.
- CDP: 360x800 garden viewport 캡처.
- CDP: 1280x900 desktop viewport 캡처.
- `npm run check:all`.

## Relationship to 0015

`0015-design-system-foundation`은 UI guardrail과 임시 HUD rescue다. `0016`은 게임 느낌의 핵심 원인인 playfield/runtime 부재를 해결하는 전환 item이다. 0016이 성공하면 0015의 CSS polish는 Phaser host 주변 HUD 규칙으로 축소한다.

## Completion Evidence

- Phaser dependency was added and isolated behind `src/game/playfield/GardenPlayfieldHost.tsx`.
- `GardenPlayfieldHost` lazy-loads `phaser` and `GardenScene`, keeping the initial React shell separate from the Phaser runtime chunk.
- `GardenScene` renders central plot states and emits only `tap_growth` / `harvest_plot` actions back to React.
- React still owns save, content, economy, analytics, HUD, panels, and mock monetization click intent.
- Named creature ownership reveal remains the first harvest reward peak before album reward and second plot.
- Visual evidence: `reports/visual/phaser-playfield-mobile-360-20260427.png`, `reports/visual/phaser-playfield-desktop-1280-20260427.png`, `reports/visual/phaser-playfield-after-loop-20260427.png`.
- Risk evidence: `reports/audits/phaser_risk_resolution_20260427.md`, `reports/visual/phaser-browser-use-fallback-20260427.md`.
- Verification: `npm run build`, `npm run check:browser-qa`, final `npm run check:all`.
