# Asset Style Consistency Gate

## Style anchor

Cute-strange greenhouse collectible, polished 2D mobile idle game art, soft rounded silhouettes, clean alpha-ready edges, warm whimsical mood, slightly odd but friendly plant-creature forms.

## Reference assets

- `creature_herb_common_001`
- `creature_herb_common_002`
- `creature_lunar_common_001`
- `seed_herb_001_icon`
- `seed_lunar_001_icon`
- `ui_order_crate_leaf_001`
- `fx_production_tick_leaf_001`

## Contact sheet

Latest contact sheet: `reports/assets/asset_style_contact_sheet_latest.html`.

## Review checklist

- 48px readability: seed icons and FX silhouettes must still read without text.
- 96px readability: creatures, seed icons, and UI cutouts must keep clean silhouettes.
- same-screen consistency: new assets must be reviewed next to the reference assets, not alone.
- family motif: Herb/Candy/Lunar motifs must match `assets/source/asset_style_bible.json`.
- screen integration: accepted assets need Browser Use or Playwright screenshot evidence in the actual game surface.
- regenerate: any asset with mismatched rendering style, weak alpha edge, wrong family motif, or static-only FX payoff must be rejected and regenerated.

## Current finding

The interim SVG assets for `seed_lunar_001_greenhouse_source_icon` and `fx_lunar_greenhouse_planting_pulse_001` fail this gate because they are vector/code-native game graphics and do not come from Codex native image generation or gpt-image-2/OpenAI image API provenance. They must be replaced by generated PNG assets before #254 can be completed.
