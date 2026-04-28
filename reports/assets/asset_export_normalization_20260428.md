# Asset export and strip normalization path — 2026-04-28

Status: ready-for-next-production-batch
Issue: #22
Work item: `items/0028-asset-export-normalization-path.md`

## 목적

Codex native image generation 산출물이 다음 production sprite batch에서 `generated output -> normalized strip -> manifest -> checker`까지 재현 가능하게 이동하는 절차를 고정한다. 이 문서는 실제 새 이미지를 생성하지 않고, export/normalization/provenance/review gate를 정의한다.

## Golden path

```text
asset_prompts.json
  -> Codex native image generation one asset at a time
  -> raw workspace copy under assets/source/generated/<batch>/<asset_id>/raw_*.png
  -> frame extraction or manual frame selection under assets/source/generated/<batch>/<asset_id>/frames/frame_###.png
  -> normalized 96x96 frame grid strip under public/assets/game/sprites/<family>/<asset_id>.png or public/assets/game/fx/<asset_id>.png
  -> public/assets/manifest/assetManifest.json animation + binding metadata
  -> npm run check:asset-normalization
  -> npm run check:sprite-batch
```

## Export rules

- Use Codex native image generation only; do not use a custom OpenAI SDK runner for this project.
- Generate one asset at a time from `assets/source/asset_prompts.json`.
- Do not leave final project assets only in Codex cache. Copy or save every selected output to a workspace path immediately.
- Raw generated files are immutable evidence and live under `assets/source/generated/<batch>/<asset_id>/raw_*.png`.
- Accepted runtime files live under `public/assets/game/**` and are referenced only through `public/assets/manifest/assetManifest.json`.
- Manifest paths must never point to `/tmp`, local browser cache, Codex cache, external URLs, or generated image cache locations.
- Runtime image generation remains disabled: `runtime_generation_allowed=false`.

## Normalization checklist

Until a dedicated image normalization tool is approved, production sprite batches must pass this checklist before manifest registration.

1. Select or crop source frames from raw output into `frames/frame_###.png` files.
2. Each frame uses a transparent 96x96 canvas.
3. The subject stays within an 88x88 safe area with consistent center-bottom anchor.
4. Scale and silhouette remain stable across frames; no text, watermark, logo, or brand/copyright resemblance.
5. Build a horizontal strip with strict Phaser slicing:
   - `expectedWidth = margin * 2 + frameWidth * frames + spacing * (frames - 1)`
   - `expectedHeight = margin * 2 + frameHeight`
   - default `margin=0`, `spacing=0`, `frameWidth=96`, `frameHeight=96`
6. Save normalized strips under `public/assets/game/sprites/<family>/` or `public/assets/game/fx/`.
7. Add manifest `animation` metadata and `animation.binding` for `seedId + plot state + action` selection.
8. Run `npm run check:asset-normalization` and `npm run check:sprite-batch`.

## Provenance ledger

Each future production sprite batch must include a provenance JSON derived from:

- `assets/source/sprite_normalization_provenance.example.json`

Required provenance links:

- `asset_id`
- `prompt_id`
- `source_prompt_path`
- `raw_outputs`
- `selected_raw_output`
- `frame_sources`
- `normalized_output_path`
- `manifest_asset_id`
- `normalization.frameWidth`, `normalization.frameHeight`, `normalization.frames`, `normalization.expectedWidth`, `normalization.expectedHeight`
- `checker`
- `reviewer`
- `rejected_outputs` with reason, when applicable

## Review report requirements

`reports/assets/<batch>_review_YYYYMMDD.md` must include:

- raw workspace paths
- normalized output paths
- manifest asset ids
- slicing dimensions and frame count
- no text/watermark/logo/brand issue check
- runtime-generation separation check
- checker commands and pass/fail result
- rejected raw outputs and rejection reasons

## Current bridge from sprite_batch_001

`sprite_batch_001` used deterministic static PNG strips to prove Phaser slicing. The next production sprite batch should replace that approximation with Codex native output copied to `assets/source/generated/**`, then normalized through the checklist above, while keeping the same manifest/checker contract.

## Stop conditions

Stop and report instead of accepting an asset if:

- the output cannot be copied into the workspace;
- frame boundaries or anchor drift cannot be normalized to 96x96 safely;
- provenance cannot link raw output to normalized strip and manifest id;
- runtime code would need image generation, remote fetch from generation cache, or credentials;
- the asset resembles a copyrighted character, logo, brand, or living artist style request.
