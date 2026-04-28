# Item 0063 — 밭 탭/수확 즉시 피드백 강화

Status: review
Work type: game_ui
Issue: #109
Date: 2026-04-29

## Small win

모바일 정원에서 성장 중 밭을 누르면 “눌렀다”가 즉시 느껴지고, 수확 가능한 밭을 누르면 수확 sparkle/reward pop이 보인다. sprite strip이 로드되지 않거나 binding이 빠져도 fallback feedback이 보여야 한다.

## Plan

1. `src/game/playfield/GardenScene.ts`에서 effect 재생 경로를 보강한다.
   - 기존 harvest/reward bound spritesheet effect는 유지한다.
   - tap spritesheet가 모바일 캡처에서 세로 artifacts를 만들면 tap path는 procedural feedback을 canonical로 사용한다.
   - 모바일 캔버스 캡처에서 세로 artifacts를 만드는 camera shake는 즉시 피드백 역할을 procedural badge/sparkle로 대체한다.
   - effect sprite가 없거나 실패하면 Phaser graphics/text 기반 fallback tap ring, harvest sparkle, reward pop을 그린다.
   - QA용 telemetry는 `qaFxTelemetry=1` URL에서만 window event/counter로 노출한다.
   - Phaser effect가 카메라 shake/animation timing 때문에 캡처에서 약해 보일 수 있으므로 host 레이어에 짧은 action badge도 함께 띄워 모바일에서 즉시 피드백을 보장한다.
2. Playwright visual/spec를 추가한다.
   - `qaSpriteState=growing&qaFxTelemetry=1`에서 canvas를 클릭하고 tap feedback counter가 증가하는지 확인한다.
   - `qaSpriteState=ready&qaFxTelemetry=1`에서 ready plot click 후 harvest feedback counter가 증가하고 reveal까지 이어지는지 확인한다.
3. 모바일 visual evidence를 저장한다.
   - tap feedback mobile 393 또는 360 screenshot.
   - harvest feedback/reveal 연결 screenshot.
4. docs/checker를 갱신한다.
   - `docs/ROADMAP.md`, `docs/BROWSER_QA.md`, `scripts/check-p0-game-ui-ux.mjs`.
5. `npm run check:visual`, `npm run check:p0-ui-ux`, `npm run check:all`을 통과시킨다.

## 수용 기준

- [x] 성장 중 plot tap에 즉시 시각 피드백이 생긴다.
- [x] ready plot harvest에 즉시 sparkle/reward 피드백이 생긴다.
- [x] harvest/reward sprite strip effect는 유지하고 tap path는 procedural fallback을 canonical로 사용한다.
- [x] QA/test가 tap/harvest feedback path를 검증한다.
- [x] mobile visual evidence와 `npm run check:all` 결과가 남는다.

## 금지 범위

저장 구조, 경제 값, 콘텐츠 schema, analytics event 이름, 실제 결제/로그인/광고/외부 배포/runtime image generation은 변경하지 않는다.
