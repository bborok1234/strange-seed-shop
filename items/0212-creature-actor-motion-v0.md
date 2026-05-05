# WorkUnit — 정원 creature actor motion v0

- ID: `0212`
- Status: planning
- GitHub issue: #405 — https://github.com/bborok1234/strange-seed-shop/issues/405
- Source WorkUnit: `items/0211-garden-plot-marker-runtime.md`
- Source PR: #404
- Game Studio route: `game-studio:game-studio` -> `game-studio:sprite-pipeline` -> `game-studio:phaser-2d-game` -> `game-studio:game-playtest`
- Campaign source: P0.5 Idle Core + Creative Rescue

## Goal

정원 화면의 named creature가 도감 보상 이미지에만 존재하지 않고 playfield에서 살아 움직이는 actor로 보이게 한다. #404의 CSS idle loop는 static pasted-picture 회귀를 줄이는 응급 조치였고, 이번 WorkUnit은 최소 sprite-strip 또는 frame-state 기반 creature actor를 실제 gameplay surface에 붙이는 첫 production slice다.

## Plan

1. 현재 creature runtime 경로를 읽고 `GardenPlayfieldHost`, production actor data, manifest asset binding의 책임 경계를 확인한다.
2. `말랑포 포리` 또는 첫 발견 creature 하나를 v0 대상 actor로 고정한다. 이유: fresh loop 직후 가장 빨리 보는 named creature다.
3. 기존 approved raster asset을 직접 변형하지 않고, 필요한 경우 Codex native image generation 또는 gpt-image-2 provenance로 4-frame transparent PNG sprite strip을 만든다.
4. manifest에 `animation.binding`, `frame_count`, `frame_size`, `fps`, `anchor`, `screen_moment`, `player_verb`, `must_not_obscure`를 기록한다.
5. runtime에서는 actor가 playfield floor에 놓이고, idle/breathe/blink 또는 hop loop가 반복되며, reduced-motion에서는 정지 frame으로 대체된다.
6. Browser Use `iab`로 desktop/mobile garden에서 actor가 보이고 움직이며 밭 marker/action panel을 가리지 않는지 확인한다.
7. Visual regression은 animation binding 존재, actor nonblank, floor bounds, bottom panel overlap, screenshot evidence를 검사한다.

## Acceptance Criteria

- [ ] 첫 발견 creature actor가 playfield에서 static card가 아니라 frame animation 또는 sprite-strip animation으로 보인다.
- [ ] 신규 sprite/FX asset을 만들면 gpt-image-2 또는 Codex native provenance와 manifest accepted entry가 남는다.
- [ ] manifest entry에 `animation.binding`, `frame_count`, `frame_size`, `fps`, `anchor`, `screen_moment`, `player_verb`, `must_not_obscure`가 있다.
- [ ] actor는 desktop/mobile에서 밭 marker, next action panel, bottom tab을 가리지 않는다.
- [ ] Browser Use `iab` screenshot 또는 explicit blocker + fallback evidence가 있다.
- [ ] `npm run check:asset-provenance`
- [ ] `npm run check:asset-style`
- [ ] `npm run check:art-share`
- [ ] focused visual regression for actor motion
- [ ] `npm run check:ci`

## Reference Teardown

- Pokemon/Game Boy의 최소 기준도 overworld나 battle surface에서 캐릭터가 상태를 바꾼다. 이 게임도 도감 이미지만으로 creature game이라고 주장하면 안 된다.
- Egg, Inc./Idle Miner류의 production surface는 생산 주체가 idle loop로 살아 있어야 하고, UI card가 아니라 화면 object로 읽힌다.
- 수집형 idle의 첫 5분은 “얘가 내 정원에 있다”는 감각을 줘야 한다.

## Creative Brief

- Player verb: 첫 수확 후 creature 확인, 자동 생산 관찰, 다음 수확/도감으로 이어가기.
- Production/progression role: named creature가 production roster의 숫자만이 아니라 정원에서 일하는 actor로 보이게 한다.
- Screen moment: fresh first harvest 이후 garden, production active garden, mobile 393x852.
- Asset/FX decision: v0는 4-frame idle/blink/hop strip 또는 equivalent frame-state animation으로 제한한다.
- Game-feel target: 정원 배경 안에서 작은 생명체가 살아 있고, 플레이어가 다음 행동을 기다리는 동안 화면이 죽어 있지 않게 만든다.

## QA / Playtest Plan

- Browser Use `iab`: `http://127.0.0.1:4173/?qaHarvestReveal=1` 또는 equivalent QA state에서 creature actor를 확인한다.
- Browser Use `iab`: fresh reset에서 첫 씨앗 심기 -> 성장 -> 수확 후 actor 등장까지 최소 흐름을 확인한다.
- Visual regression: actor element bounds, animation binding, mobile bottom overlap, playfield obstruction.

## Stop / Blocker Boundaries

- Runtime image generation은 금지한다.
- 결제, 외부 배포, account/login, save migration은 scope 밖이다.
- 신규 asset generation이 quota/model access로 막히면 blocker를 기록하고 기존 accepted raster frame-state fallback을 명시한다. 단, fallback을 “경쟁작급 해결”로 주장하지 않는다.
