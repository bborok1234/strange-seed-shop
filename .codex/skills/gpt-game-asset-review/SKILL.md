---
name: gpt-game-asset-review
description: Review generated static game assets for 이상한 씨앗상회, checking visual consistency, manifest readiness, naming, dimensions, small-size readability, and runtime-generation separation.
---

# GPT Game Asset Review

Review generated static game assets and prepare manifest updates.

## Inputs

- `assets/source/asset_plan.json`
- `assets/source/asset_prompts.json`
- generated files under `public/assets/game/`
- existing `public/assets/manifest/assetManifest.json`, if any

## Output

Write or update:

- `public/assets/manifest/assetManifest.json`
- optional `reports/assets/asset_review_<date>.md`

## Review Checklist

For each asset:

- File exists at expected path.
- Filename matches lowercase snake_case convention.
- Accepted game graphics are generated raster assets, normally PNG. Reject SVG/vector/code-native drawings unless the user explicitly requested a non-game UI vector.
- Asset id is stable and unique.
- Category/family/rarity match the plan.
- Image is readable at intended UI size.
- No text unless requested.
- No watermark.
- No obvious brand/copyright resemblance.
- Style is consistent with accepted batch.
- Dimensions are suitable for the intended use.
- FX/animation assets include sprite sheet or FX strip metadata, including frame count, frame size, intended frame rate, and manifest `animation.binding`.
- Manifest entry points to the workspace file, not Codex cache.

## Manifest Shape

```json
{
  "version": "phase0-v1",
  "assets": {
    "creature_herb_common_001": {
      "path": "/assets/game/creatures/creature_herb_common_001.png",
      "category": "creature",
      "family": "herb",
      "rarity": "common",
      "intended_use": "album_card",
      "width": 1024,
      "height": 1024,
      "status": "accepted"
    }
  }
}
```

## Runtime Separation Check

Confirm no product runtime path depends on:

- Codex native image generation
- GPT-image API calls
- custom OpenAI SDK image runners
- generated image cache locations

## Completion Criteria

- Manifest covers all accepted assets.
- Rejected assets are documented.
- Runtime separation is explicitly checked.
- Follow-up work items are suggested for missing or weak assets.

## Continuation

After completion:

1. Validate manifest JSON parses.
2. Confirm all manifest paths point to existing workspace files.
3. Update `docs/ROADMAP.md`.
4. If the next roadmap action is a safe local scaffold step, continue automatically unless the user asked only for asset review.
5. Stop before actions that require dependency installation, network access, external deployment, credentials, real payments, or a product decision.
