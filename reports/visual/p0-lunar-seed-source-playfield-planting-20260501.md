# P0 Lunar Seed Source Playfield Planting QA — 2026-05-01

## Browser Use evidence

URL: `http://127.0.0.1:5174/?qaGreenhouseLunarSeedPlantReady=1&qaTab=seeds&qaReset=1&qaFxTelemetry=1`

Browser Use `iab` checks:

- seed goal image count: 1
- seed inventory fallback count: 0
- after purchase/plant: `.plot-source-greenhouse-mist` count 1
- `.playfield-plot-source-icon` count 1
- `.playfield-plot-source-fx` count 0
- first tap after planting records `tap_growth` telemetry from `spritesheet`

Observed screen after planting showed the generated raster lunar greenhouse seed icon inside the first plot, source label `온실 단서`, and the garden action copy `온실 단서 달빛 성장`. The FX strip is not rendered as a static plot image; it is bound to tap feedback only.

## Asset generation evidence

- `gpt-image-2` API was attempted after `.env` `OPENAI_API_KEY` was available.
- API reached OpenAI but returned organization verification propagation blocker.
- Codex native image generation fallback produced raster PNG assets, not SVG/vector/code-native drawings.
- `seed_lunar_001_greenhouse_source_icon.png`: generated raster PNG, matte cutout applied, manifest accepted.
- `fx_lunar_greenhouse_planting_pulse_001_strip.png`: generated raster PNG source normalized to strict 4-frame `640x160` FX strip, manifest accepted with `animation.binding`.

## Local gates

- `npm run check:asset-provenance` pass
- `npm run check:asset-style` pass
- `npm run check:asset-alpha` pass
- `npm run check:content` pass
- `npm run build` pass
- `npm run check:visual -- --grep "온실 단서 달방울"` pass
- `npm run check:visual -- --grep "신규 asset"` pass
- `npm run check:visual -- --grep "fallback"` pass
