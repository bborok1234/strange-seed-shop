---
name: gpt-game-asset-generate
description: Generate static game assets one by one from asset_prompts.json using Codex native image generation, inspect each result, and save selected outputs into the workspace with stable filenames.
---

# GPT Game Asset Generate

Generate static game assets sequentially from `assets/source/asset_prompts.json` using Codex native image generation.

## Hard Rules

- Use Codex native image generation by default.
- Do not use a custom OpenAI SDK runner.
- Do not batch unrelated prompts into one image-generation call.
- Do not create SVG/vector/code-native drawings as final game graphics. Final accepted game graphics must be generated raster assets saved to the requested workspace path, normally PNG.
- Generate one asset at a time.
- Inspect each output before accepting it.
- Save accepted outputs into the workspace path specified by `output_path`.
- Do not leave final project assets only in Codex's generated image cache.
- Do not overwrite existing accepted assets unless the user explicitly requests replacement.
- Do not add runtime image generation to the game.
- Do not end the turn with a final response while requested assets remain ungenerated unless blocked by a real tool, permission, or safety issue.
- A progress report is not completion. If some assets are done and others remain, continue generating instead of stopping.
- If interrupted or resumed, skip existing workspace files and continue with missing `output_path` files.

## Workflow

1. Read `assets/source/asset_prompts.json`.
2. Confirm prompt count and output paths.
3. For each prompt in order:
   - skip the asset if `output_path` already exists and is non-empty
   - call Codex native image generation
   - inspect the result
   - verify acceptance checks
   - copy or move selected output into `output_path`
   - record the saved file path
4. If an image fails, regenerate with one targeted correction.
5. Stop after all requested assets are saved.
6. Report generated paths and any rejected/regenerated assets.

## Progress Ledger

Maintain `assets/source/asset_generation_status.json` after completion or before any unavoidable stop.

Required fields:

```json
{
  "source_prompts": "assets/source/asset_prompts.json",
  "total": 20,
  "completed": 20,
  "missing": [],
  "blocked": false,
  "notes": []
}
```

Only send a final completion response when `missing` is empty or `blocked` is true with a concrete blocker.

## Per-Asset Verification

Check:

- subject matches requested family/category
- readable silhouette at small size
- no unwanted text or watermark
- no obvious copyrighted character/brand resemblance
- suitable padding for UI crop
- consistent style with prior accepted assets
- file saved in the requested workspace path

## Output Naming

Use the exact `output_path` unless it would overwrite an unrelated file. If preserving an existing file, append a version suffix:

```text
creature_herb_common_001_v2.png
```

Then update the report so the manifest can use the final path.

## Completion Criteria

- Every generated asset has a workspace path.
- Failed assets are listed with reason.
- Accepted assets are ready for manifest registration.
- `assets/source/asset_generation_status.json` shows zero missing assets, unless a concrete blocker is recorded.
