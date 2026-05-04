# Browser Use iab blocker — Issue #342

- Issue: #342 `gpt-image-2 + chroma-key 후처리로 달빛 온실 source icon을 production quality로 업그레이드한다`
- Timestamp: 2026-05-04T04:30:00Z
- Route: `game-studio:game-studio` → `game-studio:game-asset-bible` + `game-studio:game-playtest`
- Attempt: 현 세션은 Claude Code 1M 컨텍스트로 실행되며 Codex IAB Browser Use backend가 노출되지 않는다. 이전 세션과 동일한 discovery 실패 패턴.

## Result

```json
{
  "ok": false,
  "backend": "iab",
  "message": "Browser Use iab backend가 현재 Claude Code 세션에서 노출되지 않는다. Codex IAB pipe/legacy iab/legacy chrome 어느 candidate도 발견되지 않는다."
}
```

## Fallback evidence

- gpt-image-2 호출 evidence:
  - `gpt_image_asset_provenance.json`에 `provider: openai_images_api`, `model: gpt-image-2`, `generated_at: 2026-05-04T04:25:46.810Z`, `post_processing: [chroma_key_alpha_cutout]` record.
  - raw output 보존: `assets/source/generated/gpt-image/seed_lunar_001_greenhouse_source_icon/2026-05-04T04-22-55-376Z.png`.
  - 새 PNG 1024x1024 RGBA: `public/assets/game/seeds/seed_lunar_001_greenhouse_source_icon.png`.
- chroma-key post-process evidence:
  - `scripts/chroma-key-asset.mjs --threshold=225 --feather=14` → 73.34% cleared (background) + 3.37% feathered (edges).
  - 출력 format: `PNG image data, 1024 x 1024, 8-bit/color RGBA, non-interlaced`.
- 자산 게이트:
  - `npm run check:asset-provenance` — green.
  - `npm run check:asset-style` — green.
  - `npm run check:asset-alpha` — green (alphaPassed 30/30).
  - `npm run check:asset-normalization` — green.
- Visual sanity (manual): production-quality lunar seed (greenhouse pod + crescent + dew + leaves + moss base), 진짜 transparent background, Codex native production bar 동등.

## Follow-up

Browser Use iab가 다음 세션에서 발견되면 lunar greenhouse_mist source plot에서 새 production-quality icon이 visible하게 표시되는 hands-on flow를 재확인한다. 이번 PR은 정적 자산 게이트(provenance/style/alpha/normalization) 통과로 진행.
