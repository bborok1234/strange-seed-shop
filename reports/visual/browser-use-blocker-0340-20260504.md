# Browser Use iab blocker — Issue #340

- Issue: #340 `아트팀 gpt-image-2 파이프라인을 달빛 온실 lunar 씨앗 source 아이콘 생성으로 끝까지 검증한다`
- Timestamp: 2026-05-04T03:45:00Z
- Route: `game-studio:game-studio` → `game-studio:game-asset-bible` + `game-studio:game-playtest`
- Attempt: 현 세션은 Claude Code 1M 컨텍스트로 실행되며 Codex IAB Browser Use backend가 노출되지 않는다. #275~#338과 동일한 discovery 실패 패턴.

## Result

```json
{
  "ok": false,
  "backend": "iab",
  "message": "Browser Use iab backend가 현재 Claude Code 세션에서 노출되지 않는다. Codex IAB pipe/legacy iab/legacy chrome 어느 candidate도 발견되지 않는다."
}
```

## Fallback evidence

- gpt-image-1 API 호출 evidence:
  - `assets/source/gpt_image_asset_provenance.json`에 `provider: openai_images_api`, `model: gpt-image-1`, `accepted_output_path`, `generated_at: 2026-05-04T03:40:04.313Z` record가 추가됨.
  - `assets/source/generated/gpt-image/seed_lunar_001_greenhouse_source_icon/2026-05-04T03-39-26-959Z.png` raw output 보존.
  - 새 PNG 1024x1024 게임 자산: `public/assets/game/seeds/seed_lunar_001_greenhouse_source_icon.png`.
- 자산 게이트:
  - `npm run check:asset-provenance` — green (manifest 1024x1024 ↔ PNG 1024x1024 일치).
  - `npm run check:asset-style` — green (style anchor + lunar family motifs + reference_asset_ids 일치).
  - `npm run check:asset-alpha` — green.
  - `npm run check:asset-normalization` — green.
- Visual sanity (manual): 새 PNG는 pale 달빛 씨앗 + 크레센트 하이라이트 + 작은 그린하우스 새싹 + 응결 글로우 ─ 프롬프트와 일치. checkerboard/흰 배경 노출 없음.

## Follow-up

Browser Use iab가 다음 세션에서 발견되면 lunar greenhouse_mist source plot에 새 아이콘이 visible하게 표시되는 hands-on flow를 재확인한다. 이번 PR은 정적 자산 게이트(provenance/style/alpha/normalization) + manifest dimensions 동기화로 진행한다.
