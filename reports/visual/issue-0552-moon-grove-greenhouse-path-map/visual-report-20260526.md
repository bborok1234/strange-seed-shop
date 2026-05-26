# 온실 숲길 clue map v0 visual report

- Issue: #552
- WorkUnit: `items/0292-moon-grove-greenhouse-path-map.md`
- Route: `game-studio:game-studio -> game-studio:phaser-2d-game -> game-studio:game-ui-frontend -> game-studio:game-playtest`
- Viewport: 393px mobile fallback smoke

## 확인 결과

- `미루 연구 맡기기` 이후 연구 선반에 `숲길 지도 펼치기` action이 표시된다.
- action 후 HUD objective가 `온실 숲길 지도 펼침 · 물안개 source silhouette`로 바뀐다.
- 연구 선반 HUD surface가 `research_moon_grove_path -> route_moon_grove_greenhouse_path -> source_mist_greenhouse_silhouette`를 표시한다.
- telemetry:
  - `moonGroveClueMapAvailable=false`
  - `moonGroveClueMapOpened=true`
  - `moonGroveClueMapCurrentNodeId=research_moon_grove_path`
  - `moonGroveClueMapNextNodeId=route_moon_grove_greenhouse_path`
  - `moonGroveClueMapLockedNodeId=source_mist_greenhouse_silhouette`
- `actor_moon_grove_miru`는 `researcher`로 연구 선반에 유지된다.
- `lastFxKind=moonGroveClueMap`, `lastFxKey=fx_research_clue_glimmer_strip_v1`로 검증됐다.

## 스크린샷

- `phaser-check-moon-grove-miru-research-ready-393.png`
- `phaser-check-moon-grove-miru-research-handoff-393.png`
- `phaser-check-moon-grove-clue-map-opened-393.png`
- `phaser-check-moon-fence-source-overview-393.png`

## Asset note

`fx_research_clue_glimmer_strip_v1.png`는 prompt/plan에는 존재했지만 workspace PNG가 없었다. `OPENAI_API_KEY`도 없어 새 gpt-image-2 생성을 할 수 없었기 때문에, 이번 로컬 slice에서는 accepted gpt-image-2 provenance가 있는 `fx_moon_grove_discovery_bloom_strip_v1.png`를 strict 8x96x96 runtime strip derivative로 복제해 missing texture crash를 제거했다. 전용 clue glimmer art generation/review는 후속 asset WorkUnit 후보로 남긴다.

## 검증

- `npm run check:phaser` 통과
- `npm run check:asset-provenance` 통과
- `npm run check:asset-style` 통과
- `git diff --check` 통과
- `npm run check:ci` 통과
