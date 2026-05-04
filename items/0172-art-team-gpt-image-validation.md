# WorkUnit #340 — 아트팀 gpt-image-2 파이프라인을 달빛 온실 lunar 씨앗 source 아이콘 생성으로 끝까지 검증한다

## GitHub authority

- GitHub issue: #340 https://github.com/bborok1234/strange-seed-shop/issues/340
- Branch: `codex/0340-art-team-gpt-image-validation`
- Campaign source of truth: P0.5 Idle Core + Creative Rescue + 운영사(북극성 B) 자율 자산 파이프라인 검증
- Runner decision: `production-game-intake-required` after #338 main CI `25298953236` success + 사용자 직접 요청
- Status: plan-first

## 문제 / 배경

`npm run asset:generate:gpt-image`가 노출하는 OpenAI `gpt-image-2` HTTP API 경로는 한 번도 실 호출된 적이 없다. 31/33 자산은 Codex CLI native image generation으로 만든 정적 PNG이고, `gpt_image_asset_provenance.json`은 비어 있거나 부재한다. 동시에 `seed_lunar_001_greenhouse_source_icon`은 SVG 시도가 게이트에서 거부되어 manifest 참조는 살아 있지만 실제 PNG 파일이 없는 상태로 P0.5 lunar source playfield 표시가 비어 있다.

## Reference teardown

- Egg, Inc. / Idle Miner Tycoon: 자산 파이프라인이 안정적으로 자율 동작해야 visible gameplay가 production quality로 누적된다.
- 우리 프로젝트: 자산 파이프라인 자율 lever를 켜본 적이 없어 future asset WorkUnit이 막혀 있다.
- Reject: SVG/벡터/code-native 그래픽 — `check:asset-provenance/style` 게이트가 거부.

## Creative brief

- Player fun target: 달빛 온실 source 씨앗이 plot에 심어졌을 때 출처가 한 눈에 읽히는 저밀도 아이콘.
- Core loop role: greenhouse mist payoff → lunar seed planting visible production-readability.
- Screen moment: lunar seed가 greenhouse_mist source로 plot에 심어진 직후 plot card에 source 아이콘 등장.
- Required assets/FX: `seed_lunar_001_greenhouse_source_icon.png` 1점(gpt-image-2 provenance, raster PNG, 투명 배경).
- Game-feel requirements: source 아이콘 등장 즉시 plot에서 출처가 읽히고, layout overflow를 만들지 않는다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:game-asset-bible` + `game-studio:game-playtest`
- 적용 규칙: gpt-image-2 raster PNG only, 투명 배경, family_motifs(lunar) 일치, reference_asset_ids 일관성, 393px playfield 게이트.

## Game Studio Department Signoff

- 기획팀: lunar greenhouse source 흐름이 plot에서 시각화돼야 production loop가 한 화면에서 누적된다.
- 리서치팀: 자산 파이프라인 자율 동작이 운영사 약속의 큰 hole. 한 번 검증해야 future WorkUnit이 막히지 않는다.
- 아트팀: 신규 accepted manifest game asset 1점, gpt-image-2 provenance, style anchor + lunar family motifs + reference_asset_ids 일치.
- 개발팀: `scripts/generate-gpt-image-assets.mjs` 호출, `gpt_image_asset_provenance.json` 갱신, `public/assets/game/seeds/seed_lunar_001_greenhouse_source_icon.png` 생성. manifest는 이미 등록되어 있어 추가 작업 없음. 393px playfield 회귀 추가.
- 검수팀: `check:asset-provenance/style/alpha/normalization` + `check:visual` + `check:ci` 모두 green.
- 마케팅팀: mock-only player promise. **OpenAI API 1회 호출 비용 발생**(추정 USD 0.04~0.19). 사용자 명시 승인 후 실행.
- 고객지원팀: source 출처 혼란 감소.

## Plan

1. `git checkout -b codex/0340-art-team-gpt-image-validation` (완료).
2. `npm run asset:generate:gpt-image -- --dry-run --asset-id=seed_lunar_001_greenhouse_source_icon` 으로 prompt 로딩/포맷 sanity 확인 (free).
3. **사용자 명시 승인 후** `npm run asset:generate:gpt-image -- --asset-id=seed_lunar_001_greenhouse_source_icon` 실 호출 (paid, 1 image).
4. 성공 path:
   - `public/assets/game/seeds/seed_lunar_001_greenhouse_source_icon.png` 생성 확인.
   - `assets/source/gpt_image_asset_provenance.json` provenance record 추가 확인.
   - `npm run check:asset-provenance` + `check:asset-style` + `check:asset-alpha` + `check:asset-normalization` 통과.
   - 출력 size가 1024x1024라면 sharp 또는 동등 도구로 160x160 downscale + alpha clean post-process(필요 시 같은 패스 안에서 처리).
   - 393px playfield Playwright regression: lunar seed가 greenhouse_mist source로 plot에 심어졌을 때 source 아이콘이 표시되는지 확인.
5. Blocker path (quota / verified / rate limit / 모델 미존재 등):
   - `gpt_image_asset_provenance.json`에 자동 기록되는 blocker record 확인.
   - PR body에 blocker 원인 + 회수 계획(예: 모델 ID 변경, organization verification 신청, Codex native fallback)을 명시.
   - manifest entry는 그대로 두고 PNG 생성은 후속 패스로 이월.
   - check:asset-provenance가 blocker record를 인정하는지 확인(가능하면 게이트 통과; 아니면 본 PR은 art-team validation evidence 자체를 commit하고 manifest 동작은 follow-up).
6. focused checks → 필요한 full checks → PR body-file → branch push → PR create/watch/repair → merge when green → main CI observation.
7. heartbeat에 issue/PR/item field 동기화. dashboard/control-room 갱신.

## 수용 기준

- [ ] `npm run asset:generate:gpt-image -- --dry-run --asset-id=seed_lunar_001_greenhouse_source_icon`이 prompts/style bible 로드 성공 + 1개 prompt match 출력.
- [ ] 사용자 명시 승인 후 실 호출 1회 실행.
- [ ] 성공 path: PNG 생성 + provenance record + 모든 자산 게이트 green + 393px playfield 회귀 추가.
- [ ] Blocker path: provenance record에 blocker 메시지 기록 + PR body에 회수 계획 명시.
- [ ] Browser Use iab current-session 시도 evidence 또는 blocker, `check:visual`, `check:ci` 모두 통과.
- [ ] heartbeat/dashboard/control-room 동기화.

## 검증 명령

- `npm run asset:generate:gpt-image -- --dry-run --asset-id=seed_lunar_001_greenhouse_source_icon`
- `npm run asset:generate:gpt-image -- --asset-id=seed_lunar_001_greenhouse_source_icon`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:asset-alpha`
- `npm run check:asset-normalization`
- `npm run build`
- focused Playwright: `--grep "달빛 온실 source 아이콘|greenhouse-source"`
- `npm run check:visual`
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

- gpt-image-2 모델 미존재/access 거부 → 첫 호출이 403/insufficient_quota로 실패. blocker provenance + PR로 evidence 남기고 후속 패스로 이월.
- 출력 size 1024x1024 vs 자산 contract 160x160 → sharp/ImageMagick post-process 필요. 같은 패스 또는 별도 후속 WorkUnit으로 분리.
- style 게이트 실패 → prompt re-iterate 1~3회. 비용 누적되면 blocker로 닫는다.
- API key 노출 금지: `.env`만 읽고 process.env에서만 사용. 로그/PR/heartbeat/commit에 절대 노출하지 않는다.

## Subagent/Team Routing

- 기본은 solo execution: 변경 영역이 좁다(스크립트 호출, provenance JSON, PNG 1점, regression spec).
- Codex native subagents/team mode는 prompt iteration이 필요할 때만 사용한다.
- gpt-image-2 path 실패 시 fallback(Codex native image generation)은 별도 패스로 분리.
