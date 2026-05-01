# Lunar seed source playfield planting v0

Status: draft PR / checks pending
Owner: agent
Issue: #254
PR: #255
Branch: `codex/0128-lunar-seed-source-playfield-planting-v0`
Started: 2026-05-01

## 문제 / 배경

Issue #251은 `달빛 온실 조사` 보상 source를 `달방울 씨앗` / `달방울 누누` 목표까지 이어줬다. 하지만 플레이어가 실제로 `달방울 씨앗`을 구매하고 정원에 심는 순간에는 온실 단서 source가 garden playfield 안으로 들어오지 않는다. 즉, 긴 production chain의 보상이 실제 밭에 심긴 달빛 성장 상태로 변하는 화면 payoff가 아직 약하다.

## Game Studio route

- Umbrella: `game-studio:game-studio` — idle collection game의 progression, garden playfield, seed action, visual QA가 함께 걸린 vertical slice다.
- Specialist route: `game-studio:game-ui-frontend`, `game-studio:game-playtest`, `game-studio:web-game-foundations`.
- 북극성/플레이어 동사: 플레이어가 온실 단서로 얻은 `달방울 씨앗`을 구매하고 정원에 심으면, 밭이 달빛 source에서 싹튼 상태로 읽힌다.
- Playfield 보호 또는 UI surface 원칙: 정원 playfield의 plot state와 compact action surface만 강화하고 persistent HUD를 늘리지 않는다.
- Playtest evidence 계획: Browser Use `iab`로 보상 수령 -> 씨앗 구매 -> 정원 심기 -> playfield source state를 확인하고, focused mobile visual regression으로 bottom tab/overflow를 고정한다.

## Issue selection gate

- `player verb`: 달방울 씨앗을 구매하고 정원 밭에 심는다.
- `production/progression role`: 온실 응축기 production chain이 lunar seed planting과 creature collection으로 이어진다.
- `screen moment`: 복귀 후 30초 안에 씨앗 탭에서 구매한 달방울 씨앗이 정원 playfield의 달빛 성장 plot으로 바뀐다.
- `asset/FX`: 신규 generated raster PNG seed icon과 4-frame FX strip을 만든다. gpt-image-2 API를 우선 시도하고, organization verification propagation blocker가 남아 Codex native image generation fallback으로 raster PNG를 생성했다. SVG/vector/code-native asset은 rejected path로 기록하고 manifest accepted asset에서 제외했다.
- `playtest evidence`: Browser Use screenshot, focused Playwright visual test, save-state assertion.
- 경쟁작 production gap: idle 경쟁작은 unlock 보상이 실제 생산/성장 board에 반영되는 순간을 강조한다. 현재는 `달방울 씨앗` 목표가 seed/album에 남지만 garden playfield의 심기 순간은 generic seed planting과 크게 다르지 않다.

## Plan

1. `lunarRewardSource = "greenhouse_mist"` 상태에서 `seed_lunar_001` 구매/심기 flow가 source를 잃지 않도록 planting context를 저장한다.
2. 달방울 씨앗이 온실 source로 심긴 plot에 generated raster seed icon, compact source badge, 달빛 plot state class를 추가한다.
3. 심기 직후 4-frame FX strip과 garden action surface 문구가 온실 source payoff로 읽히도록 추가한다.
4. deterministic QA route를 추가해 `qaGreenhouseLunarSeedPlantReady=1`에서 구매/심기 전 상태를 재현한다.
5. 모바일 visual test를 추가해 씨앗 구매, 정원 이동, 심기, plot source state, bottom tab overlap/body scroll invariant를 검증한다.
6. Browser Use `iab`로 실제 화면 evidence를 저장한다.
7. roadmap/dashboard/control room/heartbeat/GitHub metadata를 갱신한다.

## 수용 기준

- [x] 온실 source로 열린 `달방울 씨앗` 구매/심기 flow가 source를 잃지 않는다.
- [x] 정원 playfield의 심긴 달방울 plot이 `응축기에서 회수한 온실 단서` source state를 보여준다.
- [x] 심기 직후 player action surface가 달빛 성장 다음 행동을 안내한다.
- [x] 모바일 garden panel이 bottom tab과 겹치지 않고 body scroll을 만들지 않는다.
- [x] Browser Use `iab`, focused visual test가 통과하고, asset/style/content/build/`check:ci` gate가 통과한다.

## 검증 명령

- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:asset-alpha`
- `npm run check:content`
- `npm run build`
- `npm run check:visual -- --grep "신규 asset"`
- `npm run check:visual -- --grep "fallback"`
- `npm run check:ci`

## 건드리지 않을 범위

- SVG/vector/code-native game asset acceptance.
- 실제 결제, 광고, 로그인, 외부 배포, 고객 데이터.
- 달방울 씨앗/달방울 누누 보상 수치 변경.


## 검증 결과

- `gpt-image-2` API 재시도: OpenAI까지 도달했으나 organization verification propagation blocker가 계속 반환됨.
- Codex native image generation fallback: `seed_lunar_001_greenhouse_source_icon.png`, `fx_lunar_greenhouse_planting_pulse_001_strip.png` 생성.
- FX strip normalization: generated raster source를 strict `640x160`, 4 frames, 160x160 frame으로 정규화.
- Browser Use `iab`: seed goal image count 1, fallback count 0, purchase/plant 후 source plot 1, source icon 1, static source FX image 0. 첫 탭 후 `tap_growth` spritesheet telemetry 확인.
- 정적 FX strip 오염 회귀 수정: `.playfield-plot-source-fx` DOM 렌더를 제거하고, Phaser scene이 overlay click의 최신 plot을 받아 spritesheet FX를 action feedback으로만 재생한다.
- 통과: `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:asset-alpha`, `npm run check:content`, `npm run build`, `npm run check:visual -- --grep "온실 단서 달방울"`, `npm run check:visual -- --grep "신규 asset"`, `npm run check:visual -- --grep "fallback"`, `npm run check:ci`.
