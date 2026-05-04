## GitHub authority

- Plan artifact (예정): `items/0173-gpt-image-2-quality-upgrade.md`
- Source: #340 follow-up — gpt-image-1로 검증된 lunar source icon이 다른 정적 자산 대비 품질이 부족했고, organization individual verify가 propagate되어 gpt-image-2 모델이 풀린 사실을 발견함
- Campaign source of truth: P0.5 Idle Core + Creative Rescue + 운영사(북극성 B) 자율 자산 파이프라인 검증
- WorkUnit type: production game quality follow-up

## 문제 / 배경

#340에서 OpenAI Images API 경로를 처음 검증한 결과, `gpt-image-1` 출력은 알파 채널은 살아있지만 디테일/색감/스타일 일관성이 다른 31개 Codex native 자산 대비 명확히 떨어졌다. 사용자 GTM 직감대로 production-game asset bar를 충족하지 못하는 수준이었다.

#340 머지 후 individual verification이 propagate되어 `gpt-image-2` 호출이 풀렸으나, gpt-image-2는 transparent background 파라미터를 거부하고 RGB(알파 없음)로만 출력한다. 즉 high-quality + 진짜 알파를 둘 다 얻으려면 추가 파이프라인 단계가 필요하다.

## 목표

gpt-image-2 + chroma-key post-process 조합으로 lunar source icon을 production quality + RGBA로 재생성하고, 운영사 art-team lever를 "고품질 자산을 자율 생성 가능한 path"로 업그레이드한다. 향후 gpt-image-2로 만들어지는 모든 자산이 같은 cutout pipeline을 거쳐 manifest에 통합되도록 도구를 한 자리에 정리한다.

## Small win

`gpt-image-2`로 만든 달빛 온실 source icon이 기존 Codex native 자산과 동등 이상의 visual quality + 진짜 transparent background를 가지며, 게임 정원 화면이 강해진다.

## Studio Campaign Gate

- Player verb: 달빛 온실 source 씨앗이 plot에서 시각화되어 출처가 한 눈에 읽힘 (#340 동일 axis, quality bar 충족 시).
- Production/progression role: greenhouse mist payoff → lunar seed planting의 visible production-readability 강화. visible gameplay axis: playfield state.
- Screen moment: lunar seed가 greenhouse_mist source로 plot에 심어진 직후 plot card에 production-quality source 아이콘 등장.
- Concrete visual/game-feel payoff:
  - Playfield state: gpt-image-2 production-quality lunar seed icon (greenhouse pod + crescent + dew + leaves + moss base)이 plot의 source 표식으로 가시화.
  - Asset/FX axis: 신규 accepted manifest game asset 1점 업그레이드 (gpt-image-2 provenance + chroma-key cutout).
  - 운영사 axis: gpt-image-2 + chroma-key combined pipeline evidence가 future 고품질 자산 생성을 unblock.
- Competition production gap: idle 경쟁작은 자율 high-quality 자산 파이프라인이 누적된다. #340의 gpt-image-1 결과는 그 bar에 못 미쳤다.
- Asset/FX axis commitment: playfield state(seed source icon visible on plot) — gpt-image-2 raster PNG + chroma-key RGBA cutout. SVG/벡터/code-native 그래픽 금지.

## Game Studio Department Signoff

- 기획팀: source icon이 production quality에 못 미치면 정원 화면에서 lunar 흐름이 약해 보인다. 품질 bar가 다른 자산과 align되어야 한다.
- 리서치팀: 자율 자산 lever는 "동작하느냐"가 아니라 "production quality를 만드느냐"가 진짜 검증. gpt-image-1 1차 검증에 이어 gpt-image-2 quality bar를 통과시키는 게 이번 단계.
- 아트팀: gpt-image-2 (background=opaque, no alpha) + chroma-key post-process가 동등 이상 품질을 만든다. 신규 도구: `scripts/chroma-key-asset.mjs` (sharp 기반).
- 개발팀: `scripts/chroma-key-asset.mjs` 추가, `package.json`에 `sharp` dev dependency, `assets/source/gpt_image_asset_provenance.json`에 `post_processing` field, `assets/source/asset_generation_status.json` 갱신, manifest dimensions는 1024x1024 유지.
- 검수팀: `check:asset-provenance/style/alpha/normalization` + `check:visual` + `check:ci` 모두 green.
- 마케팅팀: mock-only player promise. **OpenAI API 1회 추가 호출 비용 발생** (이미 #340 패스에서 1회 + retry로 추가 1회 = 누적 ~3회 호출, USD < 1).
- 고객지원팀: 정원 화면 visual quality 회복.

## 사용자/운영자 가치

- 사용자: lunar greenhouse_mist source plot이 production-quality icon으로 시각화되어 정원의 idle production loop가 한 화면에서 더 강하게 읽힌다.
- 운영사: gpt-image-2 + chroma-key가 future 자산 생성의 default high-quality path로 자리잡아, Codex native에 의존하지 않고도 production-game asset을 자율 생성할 수 있다.

## 수용 기준

- [ ] `seed_lunar_001_greenhouse_source_icon`이 gpt-image-2(background=opaque)로 재생성되고 `scripts/chroma-key-asset.mjs`로 RGBA cutout 처리된다.
- [ ] `gpt_image_asset_provenance.json`의 해당 record에 `post_processing` 필드가 추가되고 chroma-key 파라미터가 기록된다.
- [ ] `asset_generation_status.json`이 gpt-image-2 + chroma-key 경로 + 품질 결정 사유를 note로 남긴다.
- [ ] `npm run check:asset-provenance` + `check:asset-style` + `check:asset-alpha` + `check:asset-normalization` 모두 green.
- [ ] `npm run check:ci` + `npm run build` green.
- [ ] `package.json`에 `sharp` dev dependency가 추가되고 `package-lock.json`이 업데이트된다.
- [ ] Browser Use iab current-session 시도 evidence 또는 blocker 기록.

## Visual evidence 계획

- Browser Use iab target: lunar seed가 greenhouse_mist source로 심어진 plot에서 새 production-quality source 아이콘 visible.
- Fallback screenshot: `reports/visual/issue-NNN-gpt-image-2-quality-upgrade-393.png`.
- Layout invariant: 393px plot card / source 아이콘 / 하단 탭 비충돌, no body scroll.

## Playable mode 영향

- Local dev: `npm run dev -- --host 127.0.0.1 --port 3000`
- Stable main playable mirror: `npm run play:main` + port 5174.

## 안전 범위

- runtime image generation 없음 — 빌드/패스 시점에만 실행.
- `OPENAI_API_KEY`는 `.env`에 이미 세팅, git에 commit되지 않음.
- gpt-image-2 (background=opaque) + chroma-key cutout 조합. 실시간 게임 런타임에서 OpenAI 호출 없음.
- 신규 dev dependency: `sharp` (이미지 처리 표준 라이브러리, native binary 포함).
- real payment, customer data, external production deployment 없음.
- 자산 manifest entry는 그대로(1024x1024), PNG만 교체.

## 검증 명령

- `SEED_ASSET_IMAGE_MODEL=gpt-image-2 SEED_ASSET_IMAGE_BACKGROUND=opaque npm run asset:generate:gpt-image -- --force --asset-id=seed_lunar_001_greenhouse_source_icon`
- `node scripts/chroma-key-asset.mjs --input=public/assets/game/seeds/seed_lunar_001_greenhouse_source_icon.png --threshold=225 --feather=14`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:asset-alpha`
- `npm run check:asset-normalization`
- `npm run build`
- `npm run check:ci`
- `npm run update:dashboard`
- `npm run operator:control-room -- --output docs/OPERATOR_CONTROL_ROOM.md`
- `npm run check:dashboard`
- `npm run check:control-room`
- `npm run check:ops-live`
- `npm run check:github-metadata`
- `npm run check:seed-ops-queue`
- `npm run check:closed-workunit-mirrors`

## 리스크

- chroma-key threshold/feather 파라미터가 다른 자산에는 적합하지 않을 수 있음 — lunar source icon에는 (225, 14)가 잘 동작하나, 향후 자산별 튜닝이 필요할 수 있음. 이번 PR은 lunar source icon 한 점에만 적용.
- chroma-key가 subject 내부의 light 영역(예: 흰색 디테일)을 의도치 않게 깎을 수 있음 — saturation < 0.04 가드로 채도 낮은 거의-흰색만 cutout.
- gpt-image-2 출력 품질이 prompt에 민감 — 동일 prompt로 재호출하면 결과가 달라질 수 있음. 본 PR은 1회 호출 결과를 freeze.

## Subagent/Team Routing

- 기본은 solo execution: 좁은 파일 집합(provenance JSON, status JSON, manifest 변경 없음, 새 script, package.json/lock).
- Codex native subagents/team mode는 다른 자산도 일괄 업그레이드할 때만 사용한다.
