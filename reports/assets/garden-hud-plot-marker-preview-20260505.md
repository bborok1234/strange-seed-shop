# Garden HUD Plot Marker Asset Preview Gate — 2026-05-05

## Scope

- WorkUnit: `items/0210-garden-hud-plot-marker-assets.md`
- GitHub issue: #401
- Spec: `reports/deliberation/garden-respecting-hud-assets/spec.md`
- Route: `game-studio:game-studio` -> `game-studio:game-ui-frontend` + asset pipeline review
- PR slice: PR1 asset plan + prompt + candidate preview gate
- Runtime code: 변경 없음

## Candidate Assets

| Asset | State binding | Player verb | Output | Candidate status |
| --- | --- | --- | --- | --- |
| `ui_hud_plot_seedbed_empty_001` | `plot.state=empty` | `plant_seed` | `public/assets/game/ui/ui_hud_plot_seedbed_empty_001.png` | PR1 candidate; manifest acceptance deferred |
| `ui_hud_plot_seedbed_growing_001` | `plot.state=growing` | `tap_growth` | `public/assets/game/ui/ui_hud_plot_seedbed_growing_001.png` | PR1 candidate; manifest acceptance deferred |
| `ui_hud_plot_ready_ribbon_001` | `plot.state=ready` | `harvest_plot` | `public/assets/game/ui/ui_hud_plot_ready_ribbon_001.png` | PR1 candidate; manifest acceptance deferred |
| `ui_hud_plot_text_plate_001` | `plot.state=empty\|growing\|ready` | `read_plot_state` | `public/assets/game/ui/ui_hud_plot_text_plate_001.png` | PR1 candidate; manifest acceptance deferred |

## Generation And Provenance

- Provider: Codex native image generation.
- Cache root: `/Users/mirlim/.codex/generated_images/019df866-ee92-7880-be6f-3441c94a474e/`
- Workspace raw copies: `assets/source/generated/garden-hud-plot-marker-20260505/`
- Workspace output copies: `public/assets/game/ui/`
- Post-processing: `scripts/chroma-key-asset.mjs --threshold=205 --feather=18`
- Runtime generation: disabled; no product runtime file was changed.
- Provenance ledger: `assets/source/gpt_image_asset_provenance.json`
- Generation ledger: `assets/source/asset_generation_status.json`

## Preview Review

- Preview composition: `reports/assets/garden-hud-plot-marker-preview-20260505.html`
- Rendered preview screenshot: `reports/visual/garden-hud-plot-marker-preview-20260505.png`
- Browser Use note: Browser Use `iab` was not exposed by tool discovery in this Codex App turn; Node REPL + Playwright rendered the local preview HTML as the recorded fallback evidence.

- `ui_hud_plot_seedbed_empty_001`: strong seedbed object read, broad center safe zone, good candidate for replacing cream plot surface. Risk: large sign silhouette may need crop/scale in PR2.
- `ui_hud_plot_seedbed_growing_001`: strongest candidate for planted state; sprout and mound make `tap_growth` readable. Risk: center fill is warm and may need opacity/size control so DOM progress remains dominant.
- `ui_hud_plot_ready_ribbon_001`: clear harvest affordance and distinct from seedbed. Risk: visually loud; PR2 must keep one actionable nudge only and avoid covering plot label/source label.
- `ui_hud_plot_text_plate_001`: readable text backing but closest to a panel. Use only as a small subordinate label plate, not the primary plot surface.

## Reject Gate For PR2

Do not accept these assets into `public/assets/manifest/assetManifest.json` unless PR2 screenshot composition proves:

- `GardenPlotCard` no longer reads as a cream rectangle.
- DOM button, aria-label, click target, disabled empty state, and keyboard/focus affordance remain intact.
- The text plate is subordinate to seedbed/ribbon and does not recreate a dashboard panel.
- Desktop default, dock-expanded seeds tab, loaded ready plot, and mobile 393x852 screenshots show no bottom-tab overlap or plot text clipping.

## Verification

- `asset_plan.json` and `asset_prompts.json` parse.
- Four candidate PNGs exist under `public/assets/game/ui/`.
- Four candidate PNGs have RGBA alpha after chroma-key post-processing.
- Manifest was intentionally not updated in this PR1 slice.
- Preview screenshot rendered at 1280x900 with all four candidate images loaded at natural size 1536x1024.
- `npm run check:asset-provenance` passed.
- `npm run check:asset-style` passed.
- `npm run check:asset-normalization` passed.
- `npm run check:asset-alpha` passed.
- `npm run check:p0-ui-ux` passed.
- `npm run check:art-share` passed: 12 passed.
- `npm run build` passed.
