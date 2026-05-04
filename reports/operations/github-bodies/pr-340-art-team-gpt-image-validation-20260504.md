## 요약

#340은 `npm run asset:generate:gpt-image`의 OpenAI Images API 경로를 한 번도 실 호출되지 않은 상태에서 끝까지 검증합니다. `gpt-image-2` 모델은 현재 org tier에 없는 것으로 확인되었고(verification은 완료), `SEED_ASSET_IMAGE_MODEL=gpt-image-1` 오버라이드로 호출하면 `seed_lunar_001_greenhouse_source_icon`(달빛 온실 lunar 씨앗 source 아이콘)이 1024x1024 raster PNG로 정상 생성됩니다. 새 PNG는 manifest 1024x1024로 동기화되어 `check:asset-provenance/style/alpha/normalization` 모두 green이며, `gpt_image_asset_provenance.json`에 `provider: openai_images_api`, `model: gpt-image-1`, `accepted_output_path` record가 추가됩니다. 운영자 측 자동화 lever인 아트팀 자율 자산 생성 path가 production-game asset 1점을 만든다는 evidence를 남깁니다.

## Small win

달빛 온실 source 씨앗이 plot에서 처음으로 시각화되고, 동시에 운영사 입장에서 future asset WorkUnit을 막던 "art team API 실 동작 미검증" blocker가 해소됩니다.

## 사용자/운영자 가치

- 사용자: lunar greenhouse_mist source 흐름이 plot 화면에서 작은 source icon으로 시각화되어 greenhouse mist payoff → lunar seed의 idle production loop가 한 화면에서 읽힙니다.
- 운영사: gpt-image-1 API path가 실제로 동작한다는 evidence(`gpt_image_asset_provenance.json` + 새 PNG + 자산 게이트 green)가 남아 future asset 생성 WorkUnit이 막히지 않습니다.

## Before / After 또는 Visual evidence

- Before: gpt-image-2 모델은 org tier 부재로 거부되고, 자산은 Codex native fallback(1254x1254)으로만 채워져 있었음. OpenAI Images API path는 한 번도 production-game asset을 만든 적이 없음.
- After: gpt-image-1 1024x1024 PNG가 정상 생성되어 manifest와 동기화. 자산 게이트(provenance/style/alpha/normalization) 모두 green. Visual sanity: pale 달빛 씨앗 + 크레센트 하이라이트 + 작은 그린하우스 새싹 + 응결 글로우 ─ 프롬프트와 일치, checkerboard/흰 배경 노출 없음.
- Browser Use: current-session iab discovery 실패 기록 `reports/visual/browser-use-blocker-0340-20260504.md`.
- Provenance: `assets/source/gpt_image_asset_provenance.json`에 새 record (`provider: openai_images_api`, `model: gpt-image-1`).

## Playable mode

- Local dev: `npm run dev -- --host 127.0.0.1 --port 3000`
- Stable main playable mirror 계약 유지: `npm run play:main` 후 port 5174.

## 검증

- [x] `npm run asset:generate:gpt-image -- --dry-run --asset-id=seed_lunar_001_greenhouse_source_icon` (free) — green
- [x] `SEED_ASSET_IMAGE_MODEL=gpt-image-1 npm run asset:generate:gpt-image -- --asset-id=seed_lunar_001_greenhouse_source_icon --force` (paid 1 image, gpt-image-1)
- [x] `npm run check:asset-provenance` — green (manifest 1024x1024 ↔ PNG 1024x1024 일치 후)
- [x] `npm run check:asset-style` — green
- [x] `npm run check:asset-alpha` — green
- [x] `npm run check:asset-normalization` — green
- [x] `npm run build` — green
- [x] `npm run check:ci` — green
- [x] Browser Use iab attempt or blocker: `reports/visual/browser-use-blocker-0340-20260504.md`

## 변경된 운영 lever

- `scripts/check-game-asset-provenance.mjs`의 `allowedGenerationModes` set이 `gpt-image-1`과 `hybrid_codex_native_and_openai_images_api`를 허용하도록 확장. `gpt-image-2`는 미래 호환을 위해 그대로 유지.
- `assets/source/asset_generation_status.json`의 `generation_mode`가 `hybrid_codex_native_and_openai_images_api`로 갱신되고, `art_team_api_lever_validated_2026-05-04` note가 추가됨.
- `assets/source/asset_generation_status.json`의 `p0_5_lunar_source_playfield_assets`가 lunar source icon의 provider를 `openai_images_api`/`model: gpt-image-1`로 갱신.

## 안전 범위

- runtime image generation 없음 — 빌드/패스 시점에만 실행.
- `OPENAI_API_KEY`는 `.env`에 이미 세팅되어 있으며 git에 commit되지 않음 (`.gitignore`).
- `SEED_ASSET_IMAGE_MODEL=gpt-image-1` 오버라이드는 inline 환경 변수 또는 `.env` 갱신으로 적용. 본 PR은 `.env`에 손대지 않고, 검증 명령에 inline 오버라이드를 명시.
- 기존 자산/manifest 보존: lunar source icon 외에는 변경 없음. lunar source icon manifest dimensions는 1254x1254 → 1024x1024(실 PNG와 일치)로 동기화.
- real payment, customer data, external production deployment 없음. OpenAI API 1회 호출은 개발 도구 비용으로 분류.

## 남은 위험

- Browser Use iab hands-on QA는 current session backend discovery 실패로 수행하지 못했다. blocker 해소 시 lunar greenhouse_mist source plot에서 source 아이콘이 visible하게 표시되는 hands-on flow를 재확인한다.
- gpt-image-1 출력 1024x1024를 작은 화면에서 사용 시 downscale 비용은 브라우저에 위임. 향후 manifest size constraint를 더 엄격히 가져갈 경우 sharp/post-process 단계가 필요할 수 있다(별도 WorkUnit).
- FX strip(`fx_lunar_greenhouse_planting_pulse_001_strip.png`)은 여전히 Codex native path. 4-frame 640x160 layout은 gpt-image-1 단일 출력으로 직접 생성 불가하므로 별도 post-process WorkUnit으로 분리.

## 연결된 issue

Closes #340

## 작업 checklist

- [x] Game Studio route 기록: `game-studio:game-studio` → `game-studio:game-asset-bible` + `game-studio:game-playtest`
- [x] Plan-first artifact: `items/0172-art-team-gpt-image-validation.md`
- [x] Visual evidence 또는 current-session blocker 기록
- [x] 자산 게이트 + build + check:ci 통과
- [x] Routine GitHub publication은 body-file로 수행
