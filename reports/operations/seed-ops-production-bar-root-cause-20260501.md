# Seed Ops Production Bar Root Cause — 2026-05-01

## 결론

피상적인 기능 개발이 반복된 원인은 북극성이 없어서가 아니라 북극성이 실행 gate로 충분히 컴파일되지 않았기 때문이다. 문서에는 경쟁작 기준 Production Bar, asset/FX, Codex image generation, Browser Use QA가 있었지만 실제 CI는 “JSON 파싱, manifest file exists, 화면 겹침 없음” 수준을 주로 봤다. 그래서 에이전트가 작은 기능을 구현하고도 완료처럼 보이는 경로가 열려 있었다.

## 발생 원인

1. `asset/FX` gate가 “새 visual payoff를 명시”까지만 요구했고, 신규 그래픽 asset의 생성 출처와 형식을 검증하지 않았다.
2. `public/assets/manifest/assetManifest.json` 검사는 파일 존재를 확인했지만 accepted game asset이 Codex native image generation 또는 gpt-image-2 산출물인지 확인하지 않았다.
3. FX/애니메이션 요구가 `sprite/FX`라는 문구에 머물렀고, frame count, frame size, intended frame rate, manifest `animation.binding`을 hard requirement로 만들지 않았다.
4. 아트 일관성 검증이 contact sheet, style bible, 같은 화면 비교, 48px/96px 판독성, screen integration evidence로 자동화되지 않았다.
5. Gastory류 pipeline의 핵심인 project/style/concept/animate/extract/provenance 단계가 우리 repo에서는 skill 문서에는 있었지만 `$seed-ops` issue loop에서 mandatory artifact가 아니었다.

## 재발 방지 조치

- `scripts/generate-gpt-image-assets.mjs`: OpenAI Images API 기반 asset generation 경로를 추가했다. `OPENAI_API_KEY`가 없으면 hard-block 하고, `SEED_ASSET_IMAGE_MODEL`로 `gpt-image-2` 또는 공식 GPT Image 모델을 선택한다.
- `scripts/check-game-asset-provenance.mjs`: accepted game asset이 PNG, prompt/status/manifest output path 일치, generation provenance 존재, SVG/vector/code-native asset 불가, FX strip animation metadata 존재를 검증한다.
- `scripts/check-asset-style-consistency.mjs`: style bible, reference asset ids, contact sheet, 48px/96px, same-screen, family motif, screen integration, regenerate 기준을 요구한다.
- `assets/source/asset_style_bible.json`: 프로젝트 전체 art direction anchor와 reference asset set을 고정했다.
- `$seed-ops`, `PROJECT_COMMANDS`, `AGENTS`, control room, queue checker에 gpt-image/API, provenance, style consistency, animation binding 조건을 중복 고정했다.

## 즉시 남은 blocker

#254에서 임시로 만든 SVG 두 개는 새 gate에서 실패한다. 완료하려면 `OPENAI_API_KEY`를 세팅한 뒤 `asset:generate:gpt-image`로 PNG asset과 FX strip을 생성하고, style consistency/contact sheet review와 Browser Use screen integration evidence를 남겨야 한다.

## 검증 명령

- `npm run check:seed-ops-queue`
- `npm run check:asset-style`
- `npm run check:asset-provenance`
- `npm run check:ci`
