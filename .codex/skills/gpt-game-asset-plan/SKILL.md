---
name: gpt-game-asset-plan
description: Create a structured static game asset plan for 이상한 씨앗상회 or similar games before image generation, including asset ids, families, rarity, intended use, filenames, and manifest fields. Use when planning batches of game assets for Codex native image generation.
---

# GPT Game Asset Plan

Create `asset_plan.json` for static game assets. This skill does not generate images.

## Inputs

- Product/theme document, usually `docs/PRD_PHASE0.md`
- Economy/content document, usually `docs/ECONOMY_PHASE0.md`
- Optional visual bible if one exists
- User-requested batch size or target category

## Output

Write or update `assets/source/asset_plan.json`.

If the project does not have the folder yet, create:

```text
assets/source/
public/assets/game/
public/assets/manifest/
```

## Required JSON Shape

```json
{
  "version": "phase0-v1",
  "visual_bible": {
    "style": "",
    "palette": [],
    "composition_rules": [],
    "avoid": []
  },
  "assets": [
    {
      "id": "creature_herb_common_001",
      "category": "creature",
      "family": "herb",
      "rarity": "common",
      "growth_stage": "complete",
      "intended_use": "album_card",
      "output_path": "public/assets/game/creatures/creature_herb_common_001.png",
      "manifest_tags": ["phase0", "herb", "creature"],
      "notes": ""
    }
  ]
}
```

## Planning Rules

- Keep Phase 0 batches small enough to inspect manually.
- Prefer 20 assets for the first style-validation batch.
- Include a mix of creatures, seed icons, UI shop images, and one background if requested.
- Use stable lowercase snake_case ids.
- Plan final game graphics as generated raster assets, normally `.png`. Do not plan SVG/vector/code-native drawings as accepted game graphics unless the user explicitly asks for a non-game UI vector.
- For FX or animation payoff, plan a sprite sheet or FX strip with frame count, frame size, intended frame rate, loop/yoyo behavior, and expected manifest `animation.binding`.
- Do not include runtime generation instructions.
- Do not include copyrighted character references, brand references, or living artist style imitation.

## Recommended First Batch

- 9 creatures: 3 Herb, 3 Candy, 3 Lunar
- 6 seed icons: 2 per family
- 2 greenhouse backgrounds or panels
- 2 shop/mock monetization images
- 1 album/card frame or UI reward image

## Completion Criteria

- `asset_plan.json` exists.
- Every asset has `id`, `category`, `family`, `rarity`, `intended_use`, and `output_path`.
- Paths are project-local and do not point to Codex cache directories.
- The batch can be converted into prompts without additional product decisions.

## Continuation

After completion:

1. Validate the JSON parses and asset ids are unique.
2. Update `docs/ROADMAP.md`.
3. If `gpt-game-asset-prompt` is the clear next roadmap action, continue automatically instead of stopping for a handoff.
4. Stop only if required product details are missing or the user explicitly asks to stop after planning.
