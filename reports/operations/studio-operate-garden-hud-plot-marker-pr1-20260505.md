# Studio Operate — Garden HUD Plot Marker PR1

## Summary

- Command surface: `$studio-operate`
- WorkUnit: `items/0210-garden-hud-plot-marker-assets.md`
- GitHub issue: #401
- Draft PR: #402
- Axis: `garden-respecting-hud-assets`
- Bounded slice: PR1 plot HUD asset plan + prompts + Codex native candidate generation + preview gate
- Runtime code: 변경 없음

## Queue / Runner Evidence

`npm run studio:v3:runner -- --once --dry-run` returned `production-game-intake-required` with `stop=false`, so local continuation was valid. Existing local WorkUnit `items/0210-garden-hud-plot-marker-assets.md` matched the selected axis and was used instead of creating a duplicate intake item.

After the user flagged that the issue/PR loop had gone quiet, the local WorkUnit was promoted to GitHub issue #401 before draft PR publication. This restores the Studio Harness v3 operational surface for the current slice.

## Output

- Updated `assets/source/asset_plan.json` to include four `ui_frame` plot HUD candidates.
- Updated `assets/source/asset_prompts.json` with screen moment, player verb, state binding, text-safe zone, and obstruction constraints.
- Generated and saved four Codex native raster PNG candidates:
  - `public/assets/game/ui/ui_hud_plot_seedbed_empty_001.png`
  - `public/assets/game/ui/ui_hud_plot_seedbed_growing_001.png`
  - `public/assets/game/ui/ui_hud_plot_ready_ribbon_001.png`
  - `public/assets/game/ui/ui_hud_plot_text_plate_001.png`
- Preserved raw workspace copies under `assets/source/generated/garden-hud-plot-marker-20260505/`.
- Recorded provenance in `assets/source/gpt_image_asset_provenance.json` and `assets/source/asset_generation_status.json`.
- Added preview gate: `reports/assets/garden-hud-plot-marker-preview-20260505.md`.
- Added preview composition: `reports/assets/garden-hud-plot-marker-preview-20260505.html`.
- Rendered preview screenshot: `reports/visual/garden-hud-plot-marker-preview-20260505.png`.

## Review Notes

The empty and growing seedbed assets are strong PR2 candidates. The ready ribbon is readable but must be scaled so it does not compete with labels or bottom tabs. The text plate is useful for Korean label readability but is the most panel-like asset, so PR2 should keep it subordinate and reject it if it recreates the cream rectangle problem.

## Browser Evidence

Browser Use `iab` was not exposed by tool discovery in this Codex App turn. Node REPL + Playwright rendered the local preview HTML as fallback evidence and saved `reports/visual/garden-hud-plot-marker-preview-20260505.png`.

## Verification

- `npm run check:asset-provenance` passed.
- `npm run check:asset-style` passed.
- `npm run check:asset-normalization` passed.
- `npm run check:asset-alpha` passed.
- `npm run check:p0-ui-ux` passed.
- `npm run check:art-share` passed: 12 passed.
- `npm run check:studio-v3-operator` passed.
- `npm run check:project-commands` passed.
- `npm run check:studio-deliberation-ralph-loop` passed.
- `npm run build` passed.

## Next Checkpoint

Draft PR #402 now holds the PR1 recovery/asset-preview slice. After #402 checks/review are handled, PR2 should register only accepted candidates in `public/assets/manifest/assetManifest.json`, replace the `GardenPlotCard` visual surface in `src/game/playfield/GardenPlayfieldHost.tsx` and `src/styles.css`, and capture desktop/mobile screenshots proving the plot card no longer reads as a cream rectangle.
