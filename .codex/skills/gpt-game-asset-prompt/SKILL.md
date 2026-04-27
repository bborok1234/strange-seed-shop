---
name: gpt-game-asset-prompt
description: Convert a static game asset plan into strict per-asset image-generation prompts for Codex native image generation, preserving style, family, rarity, and intended in-game use.
---

# GPT Game Asset Prompt

Convert `assets/source/asset_plan.json` into `assets/source/asset_prompts.json`.

This skill writes prompts only. It does not generate images.

## Inputs

- `assets/source/asset_plan.json`
- Visual bible from the plan or project docs
- Optional user constraints

## Output

Write `assets/source/asset_prompts.json`.

## Required JSON Shape

```json
{
  "version": "phase0-v1",
  "generation_mode": "codex_native_image_generation",
  "prompts": [
    {
      "asset_id": "creature_herb_common_001",
      "output_path": "public/assets/game/creatures/creature_herb_common_001.png",
      "prompt": "Use case: stylized-concept\nAsset type: idle web game creature album card...",
      "acceptance": [
        "transparent or clean removable background",
        "readable at 96px",
        "matches Herb family style"
      ]
    }
  ]
}
```

## Prompt Rules

Each prompt must include:

- Use case
- Asset type
- Primary request
- Subject
- Style/medium
- Composition/framing
- Color palette
- Constraints
- Avoid

For game assets, usually request:

- centered subject
- generous padding
- no text unless explicitly needed
- no watermark
- no logos
- no background clutter
- readable silhouette at small size

## Style Baseline

Unless overridden by a visual bible, use:

```text
Cute-strange greenhouse collectible style, polished 2D game art, soft rounded shapes, crisp readable silhouette, subtle painterly texture, bright but not neon colors, mobile idle game asset, clean edges, no text, no watermark.
```

## Family Notes

- Herb: leafy, fresh, round, friendly, green with warm accent colors.
- Candy: glossy, sweet, playful, pastel candy colors, avoid sticky realism.
- Lunar: pale glow, crescent motifs, soft blue/silver/purple accents, avoid dark horror.

## Completion Criteria

- Prompt count equals asset count.
- Every prompt maps to exactly one `asset_id`.
- Every prompt includes acceptance checks.
- No prompt asks for runtime generation.
- No prompt relies on copyrighted characters, brands, or living artist imitation.

## Continuation

After completion:

1. Validate JSON parses.
2. Confirm prompt ids exactly match `asset_plan.json`.
3. Update `docs/ROADMAP.md`.
4. If `gpt-game-asset-generate` is the clear next roadmap action, continue automatically instead of stopping for a handoff.
5. Stop only if image generation is unavailable, blocked, or the user explicitly asks to stop before generation.
