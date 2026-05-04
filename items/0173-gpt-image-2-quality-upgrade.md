# WorkUnit #342 — gpt-image-2 + chroma-key 후처리로 달빛 온실 source icon을 production quality로 업그레이드한다

## GitHub authority

- GitHub issue: #342 https://github.com/bborok1234/strange-seed-shop/issues/342
- Branch: `codex/0342-gpt-image-2-quality-upgrade`
- Campaign source of truth: P0.5 Idle Core + Creative Rescue + 운영사(북극성 B) 자율 자산 파이프라인 quality bar 검증
- Runner decision: #340 follow-up — gpt-image-1 결과 품질 부족 + gpt-image-2 access propagated 이후
- Status: plan-first (구현 진행 중)

## 문제 / 배경

#340에서 art-team OpenAI Images API path를 처음 검증했으나 gpt-image-1 출력은 다른 31개 Codex native 자산 대비 품질이 명확히 부족했다. 정원 화면에서 lunar source icon이 약해 보임 → P0.5 production loop visual quality 누적이 깨짐.

#340 머지 후 individual verification propagation으로 gpt-image-2가 풀렸으나, gpt-image-2는 transparent background를 직접 지원하지 않고 RGB로만 출력. high-quality + 진짜 알파를 모두 얻으려면 chroma-key post-process가 필요.

## Reference teardown

- gpt-image-1: 알파 채널 직접 출력 가능, 품질 낮음.
- gpt-image-2: 알파 출력 불가, 품질 high. background=opaque로 near-white 배경 출력 후 chroma-key 가능.
- Codex native (기존 31개 자산): 동일 chroma-key 단계 + Codex CLI 모델 사용. production bar 통과.
- Reject: 알파 부재 RGB PNG를 그대로 게임 자산으로 사용 — 체커보드/배경색이 그대로 보임.

## Creative brief

- Player fun target: 달빛 온실 source 씨앗이 plot에서 production-quality icon으로 시각화되어 정원 idle production loop가 한 화면에서 강하게 읽힘.
- Core loop role: greenhouse mist payoff → lunar seed planting visible production-readability (#340과 동일 axis, 품질 bar만 업그레이드).
- Screen moment: lunar seed가 greenhouse_mist source로 plot에 심어진 직후 plot card에 production-quality source 아이콘 등장.
- Required assets/FX: `seed_lunar_001_greenhouse_source_icon.png` 1점 업그레이드 (gpt-image-2 + chroma-key RGBA).
- Game-feel requirements: 알파 정확도(흰 배경 잔여 없음, subject 내부 light 영역 보존), 다른 자산과 style 일관성.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:game-asset-bible` + `game-studio:game-playtest`
- 적용 규칙: gpt-image-2 raster PNG + chroma-key RGBA cutout, family_motifs(lunar) 일관성, reference_asset_ids 일치.

## Game Studio Department Signoff

- 기획팀: source icon 품질이 다른 자산과 align되어야 정원 화면이 강해진다.
- 리서치팀: 자율 자산 lever는 동작 + production quality 둘 다 필요. gpt-image-2 + chroma-key 조합이 그 두 조건을 모두 만족.
- 아트팀: gpt-image-2 (background=opaque) + `scripts/chroma-key-asset.mjs --threshold=225 --feather=14` 조합으로 RGBA 자산 생성.
- 개발팀: `scripts/chroma-key-asset.mjs` 추가, `package.json`에 `sharp` dev dep, `assets/source/gpt_image_asset_provenance.json`에 `post_processing` 필드, `assets/source/asset_generation_status.json` 갱신.
- 검수팀: `check:asset-provenance/style/alpha/normalization` + `check:visual` + `check:ci` 모두 green.
- 마케팅팀: mock-only player promise. OpenAI API 1회 추가 호출 (USD < 1 누적).
- 고객지원팀: 정원 화면 visual quality 회복.

## Plan

1. `git checkout -b codex/0342-gpt-image-2-quality-upgrade` (완료).
2. `SEED_ASSET_IMAGE_MODEL=gpt-image-2 SEED_ASSET_IMAGE_BACKGROUND=opaque npm run asset:generate:gpt-image -- --force --asset-id=seed_lunar_001_greenhouse_source_icon` 실 호출 (완료, 2026-05-04T04:25:46Z).
3. `npm install --save-dev sharp` (완료).
4. `scripts/chroma-key-asset.mjs` 신규 작성 — sharp 기반 chroma-key cutout, threshold/feather 파라미터화 (완료).
5. `node scripts/chroma-key-asset.mjs --input=public/assets/game/seeds/seed_lunar_001_greenhouse_source_icon.png --threshold=225 --feather=14` 실행 (완료, 73.34% cleared + 3.37% feathered).
6. `gpt_image_asset_provenance.json`의 lunar source record에 `post_processing: [{ step: chroma_key_alpha_cutout, ... }]` 필드 추가 (완료).
7. `asset_generation_status.json`의 lunar source asset 항목과 art-team lever note를 gpt-image-2 + chroma-key 경로로 갱신 (완료).
8. heartbeat을 issue/PR/item field로 동기화하고 dashboard/control-room 갱신.
9. focused checks → 자산 게이트 → check:ci → PR body-file → branch push → PR create/watch/repair → merge when green → main CI observation.

## 수용 기준

- [x] gpt-image-2 + chroma-key 조합으로 RGBA PNG 생성.
- [x] provenance JSON에 post_processing 필드 기록.
- [x] asset_generation_status JSON에 gpt-image-2 + chroma-key 경로 + 품질 결정 사유 기록.
- [x] 자산 게이트(provenance/style/alpha/normalization) green.
- [ ] check:ci + build green (PR 시점에 재검증).
- [ ] heartbeat/dashboard/control-room 동기화.
- [ ] Browser Use iab current-session 시도 evidence 또는 blocker 기록.

## 검증 명령

- `SEED_ASSET_IMAGE_MODEL=gpt-image-2 SEED_ASSET_IMAGE_BACKGROUND=opaque npm run asset:generate:gpt-image -- --force --asset-id=seed_lunar_001_greenhouse_source_icon`
- `node scripts/chroma-key-asset.mjs --input=public/assets/game/seeds/seed_lunar_001_greenhouse_source_icon.png --threshold=225 --feather=14`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:asset-alpha`
- `npm run check:asset-normalization`
- `npm run build`
- `npm run check:ci`

## 리스크

- chroma-key threshold/feather 파라미터가 다른 자산에는 부적합할 수 있음. lunar source icon에 (225, 14) 적합 검증됨; 자산별 튜닝은 향후 별도 WorkUnit.
- chroma-key가 subject 내부의 light 영역을 깎을 위험 → saturation < 0.04 가드로 채도 낮은 거의-흰색만 cutout. 현재 lunar source icon에는 잔재 미발견.
- gpt-image-2 출력은 prompt 민감 → 같은 prompt로 재호출 시 결과 다를 수 있음. 본 PR은 freeze된 1회 결과 사용.

## Subagent/Team Routing

- 기본은 solo execution: 좁은 파일 집합(provenance/status JSON, 새 script, package.json/lock, PNG 1점).
- Codex native subagents/team mode는 다른 자산도 일괄 업그레이드할 때만 사용.
