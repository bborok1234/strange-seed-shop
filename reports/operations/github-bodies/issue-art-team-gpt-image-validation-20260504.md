## GitHub authority

- Plan artifact (예정): `items/0172-art-team-gpt-image-validation.md`
- Source: Studio Harness v3 dry-run after #338 merge / main CI run `25298953236` success → `production-game-intake-required` (queue empty) + 사용자가 아트팀 동작 점검 요청
- Campaign source of truth: P0.5 Idle Core + Creative Rescue + 운영사 (북극성 B) 자동화 검증
- WorkUnit type: production game quality Intake

## 문제 / 배경

`이상한 씨앗상회`의 33개 정적 자산 중 31개는 Codex CLI native image generation으로 생성된 PNG이며, `npm run asset:generate:gpt-image`(`scripts/generate-gpt-image-assets.mjs`)가 노출하는 OpenAI `gpt-image-2` HTTP API 경로는 **한 번도 실 호출된 적이 없다**. `assets/source/asset_generation_status.json`은 모든 generation_mode를 `codex_native_image_generation`으로 기록하고, `gpt_image_asset_provenance.json`은 비어 있거나 부재한다. 동시에 `seed_lunar_001_greenhouse_source_icon`(달빛 온실 source seed icon)은 SVG 시도가 `check:asset-provenance/style` 게이트에서 거부되어 manifest 참조는 살아 있지만 실제 PNG 파일이 없는 상태로 P0.5 lunar source playfield 표시가 비어 있다.

idle 경쟁작은 source-of-truth asset pipeline이 안정적으로 자율 동작해야 visible gameplay가 production quality로 누적된다. 우리 프로젝트는 그 lever를 켜본 적이 없어 자율 게임 스튜디오 약속이 검증되지 않은 상태다.

## 목표

`npm run asset:generate:gpt-image -- --asset-id=seed_lunar_001_greenhouse_source_icon` 1회 실 호출로 OpenAI `gpt-image-2` API → raster PNG → provenance JSON → 정적 자산 게이트(asset-provenance/style/alpha) → manifest 사용 → 393px 모바일 playfield 표시까지 한 패스에서 끝까지 닫고, 아트팀 자율 자산 생성 lever가 production-game asset을 만들 수 있다는 evidence를 남긴다.

## Small win

달빛 온실 source seed가 plot에 심어질 때 작은 source icon이 처음으로 화면에 등장해 greenhouse mist payoff → lunar seed 흐름이 한 화면에서 읽힌다. 동시에 운영사 입장에서는 future asset generation을 막던 "art team API 실 동작 미검증" blocker가 풀린다.

## Studio Campaign Gate

- Player verb: `달빛 온실 source 씨앗 plot에 심기 → plot에서 source 아이콘으로 출처가 한 눈에 읽힘`
- Production/progression role: greenhouse mist payoff → lunar seed planting 흐름 production-readability 강화. visible gameplay axis: playfield state.
- Screen moment: lunar seed가 greenhouse_mist source로 plot에 심어진 직후 plot card에 source 아이콘 등장.
- Concrete visual/game-feel payoff:
  - Playfield state: `seed_lunar_001_greenhouse_source_icon` PNG가 plot의 source 표식으로 가시화.
  - Asset/FX axis: 신규 accepted manifest game asset 1점(GPT Image API path provenance).
  - 운영사 axis: gpt-image-2 API 자율 호출 evidence + provenance JSON record.
- Competition production gap: idle 경쟁작은 source-of-truth asset pipeline이 자율적으로 visible gameplay를 키운다. 우리는 그 axis를 한 번도 검증하지 않아 production quality 누적이 막혀 있다.
- Asset/FX axis commitment: playfield state(seed source icon visible on plot) — Codex native image generation 또는 gpt-image-2 provenance 둘 다 허용. 이번 PR은 **gpt-image-2** path로 검증한다. SVG/벡터/code-native 그래픽 금지.
- Playtest evidence: Browser Use iab 우선 시도, blocker 시 issue 전용 blocker + 393px focused Playwright regression(plot에 source 아이콘 표시).

## Game Studio Department Signoff

- 기획팀: 달빛 온실 source가 단순 텍스트로만 표시되면 greenhouse mist payoff가 화면 메타에 누적되지 않는다. source 아이콘으로 시각화돼야 한다.
- 리서치팀: idle 경쟁작은 자산 파이프라인 자율 동작이 production loop 누적의 전제다. 한 번도 검증되지 않은 lever는 운영사 약속의 큰 hole이다.
- 아트팀: 신규 accepted manifest game asset 1점(`seed_lunar_001_greenhouse_source_icon`). Codex CLI native image generation 또는 gpt-image-2 API path 모두 허용. 이번 PR은 gpt-image-2 path를 실 호출로 검증한다. style anchor, family_motifs(lunar), reference_asset_ids 일치 필요.
- 개발팀: `scripts/generate-gpt-image-assets.mjs` 실 호출, `assets/source/gpt_image_asset_provenance.json` 갱신, `public/assets/game/seeds/seed_lunar_001_greenhouse_source_icon.png` 새 PNG, manifest는 이미 등록되어 있어 추가 작업 없음. 393px playfield 회귀 추가.
- 검수팀: `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:asset-alpha`, `npm run check:asset-normalization`, `npm run check:visual`, `npm run check:ci` 모두 green이어야 한다. Browser Use iab current-session 시도 → blocker 기록 + 393px Playwright regression.
- 마케팅팀: mock-only player promise. 외부 채널/실결제/광고 없음. 단, **OpenAI API 호출 1회는 실제 비용(약 USD 0.04~0.19/이미지, gpt-image-2 high-quality 1024x1024 추정)이 발생**한다. 사용자 명시 승인 필요.
- 고객지원팀: source seed 출처가 plot에서 한 눈에 읽히지 않는다는 잠재적 혼란을 제거한다.

## 사용자/운영자 가치

- 사용자: 달빛 온실 source seed planting 흐름이 plot 화면에서 source icon으로 시각화돼 greenhouse mist payoff → lunar seed의 idle production loop가 한 화면에서 읽힌다.
- 운영사: gpt-image-2 API path가 실제로 동작한다는 evidence(`gpt_image_asset_provenance.json` + 새 PNG + style/provenance/alpha 게이트 green)가 남아 future asset WorkUnit이 막히지 않게 된다.

## 수용 기준

- [ ] `npm run asset:generate:gpt-image -- --asset-id=seed_lunar_001_greenhouse_source_icon` 실 호출이 PNG를 생성하거나, recoverable blocker(quota/verified/rate limit) 시 `gpt_image_asset_provenance.json`에 blocker record가 남는다.
- [ ] 성공 path: `public/assets/game/seeds/seed_lunar_001_greenhouse_source_icon.png`가 생성되어 `npm run check:asset-provenance` + `npm run check:asset-style` + `npm run check:asset-alpha` + `npm run check:asset-normalization` 모두 통과한다.
- [ ] 성공 path: 393px playfield에서 lunar seed가 greenhouse_mist source로 심어진 plot에 source 아이콘이 표시되며 layout overflow를 만들지 않는다.
- [ ] 성공 path: `assets/source/gpt_image_asset_provenance.json`에 `provider: openai_images_api`, `model: gpt-image-2`, `accepted_output_path` record가 추가된다.
- [ ] Blocker path: `gpt_image_asset_provenance.json`에 `status: blocked` record + blocker 메시지가 남고, PR body에 blocker 원인/회수 계획을 명시한다. 이 경우 manifest entry는 그대로 두고 PNG는 후속 패스로 이월한다.
- [ ] Browser Use iab current-session 시도 evidence 또는 blocker, `npm run check:visual`, `npm run check:ci` 모두 통과한다.

## Visual evidence 계획

- Browser Use iab target: lunar seed가 greenhouse_mist source로 심어진 plot에서 source 아이콘 등장 확인.
- Fallback screenshot: `reports/visual/issue-NNN-art-team-gpt-image-validation-393.png`.
- Layout invariant: 393px plot card / source 아이콘 / 하단 탭 비충돌, no body scroll, no panel masked overflow.

## Playable mode 영향

- Local dev: `npm run dev -- --host 127.0.0.1 --port 3000`
- Stable main playable mirror 계약 유지: `npm run play:main` + port 5174.

## 안전 범위

- **외부 API 비용 1회 발생**: `gpt-image-2` 1024x1024 high-quality 1장(추정 USD 0.04~0.19). 사용자 명시 승인 후에만 호출.
- runtime image generation 없음 — 빌드/패스 시점에만 생성, 게임 런타임에서 OpenAI API 호출 없음.
- `OPENAI_API_KEY`는 `.env`에 이미 세팅. credential 노출 없음(스크립트가 .env 읽고 process.env에 적재). git에는 commit하지 않음.
- 신규 accepted manifest asset 1점은 gpt-image-2 provenance를 만족하므로 next-queue-quality-gate의 SVG/벡터/code-native 금지 조항을 위반하지 않는다.
- real payment, customer data, external production deployment 없음 (OpenAI API는 개발 도구 비용으로 분류).
- 기존 자산/manifest entry 보존: `seed_lunar_001_greenhouse_source_icon` manifest 항목은 변경하지 않고 PNG만 채운다.

## 검증 명령

- `npm run asset:generate:gpt-image -- --dry-run --asset-id=seed_lunar_001_greenhouse_source_icon` (free)
- `npm run asset:generate:gpt-image -- --asset-id=seed_lunar_001_greenhouse_source_icon` (paid, 1 image)
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:asset-alpha`
- `npm run check:asset-normalization`
- `npm run build`
- `npx playwright test --config playwright.config.ts --grep "달빛 온실 source 아이콘|greenhouse-source"`
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

- gpt-image-2 모델이 organization verification 또는 access를 요구할 가능성 있음 → 첫 호출이 403/insufficient_quota로 실패 가능. 스크립트는 이미 이 패턴을 인식해 `gpt_image_asset_provenance.json`에 blocker record를 남기고 종료한다.
- 출력 size 1024x1024 → 자산 contract는 160x160. 빌드 후 size mismatch 시 manifest size constraint를 만족하기 위해 post-process(downscale + alpha clean) 단계가 필요할 수 있다. 만약 그렇다면 같은 패스에 sharp/ImageMagick post-process를 추가하거나 별도 후속 WorkUnit으로 분리한다.
- style 게이트 fail → prompt 재작성 + 재호출(1~3회 비용 추가). 너무 많이 반복하지 않고 명백한 실패면 blocker로 닫는다.
- API key 노출 위험: `.env`만 읽고 process.env에서만 사용. 로그/PR/heartbeat에 절대 노출하지 않는다.

## Subagent/Team Routing

- 기본은 solo execution: 변경 영역이 좁다(스크립트 호출 + provenance JSON + PNG 1점 + regression spec).
- Codex native subagents/team mode는 prompt iteration이 필요할 때만 사용한다.
- gpt-image-2 path 실패 시 fallback은 별도 패스로 분리(이번 PR scope는 path 검증).
