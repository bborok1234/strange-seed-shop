## 요약

#342는 #340 follow-up입니다. #340에서 검증한 gpt-image-1 결과는 다른 31개 Codex native 자산 대비 visual quality가 명확히 부족했습니다. organization individual verify가 propagate되어 gpt-image-2 모델 access가 풀렸으나, gpt-image-2는 transparent background를 직접 출력하지 않아 RGB로만 떨어집니다. 본 PR은 `gpt-image-2 (background=opaque)` + `scripts/chroma-key-asset.mjs` (sharp 기반 chroma-key cutout) 조합으로 `seed_lunar_001_greenhouse_source_icon`을 production quality + 진짜 RGBA로 재생성합니다. 운영사 art-team lever는 이제 "동작" → "고품질 자산 자율 생성"으로 한 단계 업그레이드.

## Small win

달빛 온실 source icon이 다른 자산과 동등 이상의 품질 + 진짜 transparent background로 정원 화면에 등장. gpt-image-2 + chroma-key가 future 자산의 default high-quality path로 자리잡습니다.

## 사용자/운영자 가치

- 사용자: lunar greenhouse_mist source plot이 production-quality icon으로 시각화되어 정원 idle production loop가 한 화면에서 더 강하게 읽힘.
- 운영사: gpt-image-2 + chroma-key 조합이 future 자산 생성의 default path로 자리잡아, Codex CLI native 의존 없이도 production-game asset을 자율 생성할 수 있음.

## Before / After

- Before (#340): gpt-image-1 1024x1024 RGBA — 알파 채널은 살아있으나 디테일/색감/스타일이 다른 자산 대비 떨어짐. 정원 화면 visual quality 약화.
- After: gpt-image-2 1024x1024 (background=opaque) → `scripts/chroma-key-asset.mjs --threshold=225 --feather=14` → 1024x1024 RGBA. 73.34% pixels cleared (배경), 3.37% feathered (엣지). 결과: production-quality lunar seed icon (greenhouse pod + crescent + dew drops + leaves + moss base) + 진짜 transparent background.
- Browser Use: current-session iab discovery 실패 기록 `reports/visual/browser-use-blocker-0342-20260504.md`.

## 변경된 운영 lever

- `scripts/chroma-key-asset.mjs` 신규: sharp 기반 chroma-key cutout 도구. CLI 인자(`--input`, `--output`, `--threshold`, `--feather`)로 자산별 튜닝 가능. saturation < 0.04 가드로 subject 내부 light 영역 보호.
- `package.json` / `package-lock.json`: `sharp` dev dependency 추가.
- `assets/source/gpt_image_asset_provenance.json`: lunar source icon record가 `model: gpt-image-2` + `post_processing: [{step: chroma_key_alpha_cutout, params: {threshold: 225, feather: 14}}]` 명시.
- `assets/source/asset_generation_status.json`: lunar source asset 항목과 art-team lever validation note가 gpt-image-2 + chroma-key 경로로 갱신.

## Playable mode

- Local dev: `npm run dev -- --host 127.0.0.1 --port 3000`
- Stable main playable mirror 계약 유지: `npm run play:main` 후 port 5174.

## 검증

- [x] `SEED_ASSET_IMAGE_MODEL=gpt-image-2 SEED_ASSET_IMAGE_BACKGROUND=opaque npm run asset:generate:gpt-image -- --force --asset-id=seed_lunar_001_greenhouse_source_icon` (paid, 1 image)
- [x] `node scripts/chroma-key-asset.mjs --input=public/assets/game/seeds/seed_lunar_001_greenhouse_source_icon.png --threshold=225 --feather=14`
- [x] `npm run check:asset-provenance` — green
- [x] `npm run check:asset-style` — green
- [x] `npm run check:asset-alpha` — green (alphaPassed 30/30)
- [x] `npm run check:asset-normalization` — green
- [x] `npm run build` — green
- [x] `npm run check:ci` — green
- [x] Browser Use iab attempt or blocker: `reports/visual/browser-use-blocker-0342-20260504.md`

## 안전 범위

- runtime image generation 없음 — 빌드/패스 시점에만 실행.
- `OPENAI_API_KEY`는 `.env`에 이미 세팅, git에 commit되지 않음.
- gpt-image-2 호출 1회 추가 (#340 패스 누적 USD < 1).
- `sharp`는 표준 이미지 처리 native binary 라이브러리. dev dependency only — 게임 런타임에 영향 없음.
- 자산 manifest entry는 그대로(1024x1024), PNG만 교체.
- real payment, customer data, external production deployment 없음.

## 남은 위험

- chroma-key 파라미터(threshold=225, feather=14)는 lunar source icon에 검증된 값. 다른 자산에는 자산별 튜닝이 필요할 수 있음. 향후 다른 자산을 gpt-image-2 + chroma-key로 업그레이드할 때 별도 WorkUnit으로 다룸.
- gpt-image-2 출력은 prompt 민감 → 같은 prompt로 재호출 시 결과 다를 수 있음. 본 PR은 freeze된 1회 결과 사용.
- Browser Use iab hands-on QA는 current session backend discovery 실패로 수행하지 못했다. blocker 해소 시 재확인.

## 연결된 issue

Closes #342

## 작업 checklist

- [x] Game Studio route 기록: `game-studio:game-studio` → `game-studio:game-asset-bible` + `game-studio:game-playtest`
- [x] Plan-first artifact: `items/0173-gpt-image-2-quality-upgrade.md`
- [x] Visual evidence 또는 current-session blocker 기록
- [x] 자산 게이트 + build + check:ci 통과
- [x] Routine GitHub publication은 body-file로 수행
