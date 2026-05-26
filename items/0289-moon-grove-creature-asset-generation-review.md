# 월정 숲 creature/actor asset generation-review

## 상태

- Status: active
- Game Studio route: `game-studio:game-studio -> game-studio:sprite-pipeline -> game-studio:game-playtest -> game-studio:phaser-2d-game`
- GitHub issue: #546
- PR: pending
- Branch: `codex/0289-moon-grove-creature-asset-generation-review`
- 연결: Issue #542, PR #543, Issue #546, recovery Issue #544/PR #545, main CI `26427781203`

## 배경

#542/#543은 `월정 숲 새벽이끼` discovery를 위한 plan/prompt를 추가했다. 그러나 아직 실제 PNG workspace asset이 없어서 후속 manifest/runtime binding은 전용 creature portrait, actor strip, discovery bloom FX를 참조할 수 없다. 현재 playable의 rare discovery는 여전히 source badge와 텍스트 payoff에 기대므로, 경쟁작 idle collection에서 기대되는 "새 생명체가 화면에 남는" production payoff가 부족하다.

이번 slice는 이미 추가된 4개 prompt를 실제 raster asset 후보로 생성하고, 후속 runtime binding이 바로 accepted manifest entry를 추가할 수 있도록 review evidence와 provenance를 남긴다.

## Creative brief

- Player verb: `월정 숲 수확` 이후 `새벽이끼 미루 확인/배치` 후속 payoff 준비
- Production/progression role: rare source harvest가 이름 있는 creature ownership과 playfield actor participation으로 확장될 준비를 만든다.
- Screen moment: harvest reveal portrait, 도감/album card, playfield idle actor, work actor, discovery bloom FX.
- Asset/FX decision:
  - `creature_moon_grove_001`: reveal/album portrait PNG
  - `actor_moon_grove_miru_idle_strip_v1`: 8 frames, 96x96, 8fps, `moon_grove.discovery.actor.idle`
  - `actor_moon_grove_miru_work_strip_v1`: 8 frames, 96x96, 10fps, `moon_grove.discovery.actor.work`
  - `fx_moon_grove_discovery_bloom_strip_v1`: 8 frames, 96x96, 12fps, `moon_grove.discovery.action.reveal`
- Competition gap: rare discovery가 텍스트/아이콘 promise에서 끝나면 collection desire가 약하다. Cell to Singularity/Egg, Inc.식 장기 목표 surface처럼 새 entity silhouette와 motion payoff가 화면에 남아야 한다.
- Rejected alternative: 기존 `seed_moon_grove_001_icon`과 `fx_moon_grove_source_reward_strip_v1` 재사용. 이유: source asset은 named creature ownership과 actor participation을 대신할 수 없다.

## Plan

1. GitHub issue를 게시하고 issue 번호를 이 WorkUnit/roadmap/heartbeat에 반영한다.
2. `npm run asset:generate:gpt-image -- --dry-run`으로 4개 target prompt와 output path를 확인한다.
3. `SEED_ASSET_IMAGE_BACKGROUND=opaque`와 `SEED_ASSET_IMAGE_MODEL` 기준으로 4개 asset을 하나씩 생성한다.
4. 생성 raw output과 workspace output을 검사한다. portrait는 alpha-ready cleanup, actor/FX는 strict 8x96x96 horizontal strip으로 normalize한다.
5. `assets/source/gpt_image_asset_provenance.json`과 `assets/source/asset_generation_status.json`에 issue batch evidence를 추가한다.
6. `reports/assets/moon_grove_creature_asset_review_20260526.md`와 contact sheet를 작성한다.
7. asset provenance/style/alpha와 전체 CI를 검증한다.
8. PR을 게시하고 checks, merge, main CI를 관찰한다.

## 수용 기준

- `public/assets/game/creatures/creature_moon_grove_001.png`가 존재하고 64px/128px에서 creature portrait로 읽힌다.
- `public/assets/game/actors/actor_moon_grove_miru_idle_strip_v1.png`가 8 frames, 96x96, 8fps intended strip으로 정규화된다.
- `public/assets/game/actors/actor_moon_grove_miru_work_strip_v1.png`가 8 frames, 96x96, 10fps intended strip으로 정규화된다.
- `public/assets/game/fx/fx_moon_grove_discovery_bloom_strip_v1.png`가 8 frames, 96x96, 12fps intended reveal FX strip으로 정규화된다.
- gpt-image-2 또는 Codex native image generation provenance가 workspace path와 연결된다.
- review report와 contact sheet가 생성되고 runtime generation separation을 명시한다.
- `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:asset-alpha`, `npm run check:ci`, `git diff --check`가 통과한다.

## Department Scorecard

| 부서 | 판정 | 근거 |
| --- | --- | --- |
| 기획팀 | approve | `월정 숲 새벽이끼`가 source badge가 아니라 named creature로 이어지는 후속 플레이어 verb를 준비한다. |
| 리서치팀 | approve | rare discovery가 텍스트 payoff에 머무는 production gap을 새 silhouette/motion evidence로 해소한다. |
| 아트팀 | approve | gpt-image-2 opaque 생성, alpha cleanup, strict strip normalization, contact sheet review를 묶는다. |
| 개발팀 | approve | 이번 slice는 asset 후보와 review/provenance를 만들고 runtime binding은 후속 WorkUnit으로 분리한다. |
| 검수팀 | approve | asset provenance/style/alpha와 전체 CI가 acceptance verifier다. |
| 마케팅팀 | approve | 내부 asset pipeline이며 외부 채널/실결제/광고 없음. |
| 고객지원팀 | approve | 후속 playable에서 플레이어가 rare discovery를 새 creature로 이해할 근거를 만든다. |

## Role Debate

필수 debate는 발생하지 않았다. 모든 부서가 approve다. 아트팀은 portrait만 생성하면 runtime payoff가 약하므로 idle/work actor strip과 reveal FX를 같은 batch에서 생성해야 한다고 권고했다.

## Self-evaluation loop

- Claim: 월정 숲 discovery는 dedicated creature/actor/FX workspace asset 후보와 review evidence를 가진다.
- Smallest verifier: 각 output path의 PNG 존재와 metadata 검사.
- Rubric: no text/watermark, readable silhouette, strict strip dimensions, provenance source, runtime separation, style consistency.
- Artifact path: `public/assets/game/`, `reports/assets/moon_grove_creature_asset_review_20260526.md`, `assets/source/asset_generation_status.json`
- Iteration log: 생성 실패나 strip dimension mismatch가 있으면 같은 WorkUnit에서 regenerate 또는 normalize 후 재검증한다.
- Stop condition: PR checks, merge, main CI가 green이거나 API/quota/tool blocker가 written blocker로 고정됨.

## Subagent/Team Routing

- Solo execute. 생성 대상 4개가 같은 prompt batch와 postprocess/report를 공유하므로 병렬 write scope를 나누면 provenance 충돌 위험이 더 크다.

## 검증 명령

- `npm run asset:generate:gpt-image -- --dry-run --asset-id=creature_moon_grove_001` - pass
- `npm run asset:generate:gpt-image -- --dry-run --asset-id=actor_moon_grove_miru_idle_strip_v1` - pass
- `npm run asset:generate:gpt-image -- --dry-run --asset-id=actor_moon_grove_miru_work_strip_v1` - pass
- `npm run asset:generate:gpt-image -- --dry-run --asset-id=fx_moon_grove_discovery_bloom_strip_v1` - pass
- `SEED_ASSET_IMAGE_BACKGROUND=opaque npm run asset:generate:gpt-image -- --asset-id=creature_moon_grove_001` - pass
- `SEED_ASSET_IMAGE_BACKGROUND=opaque npm run asset:generate:gpt-image -- --asset-id=actor_moon_grove_miru_idle_strip_v1` - pass
- `SEED_ASSET_IMAGE_BACKGROUND=opaque npm run asset:generate:gpt-image -- --asset-id=actor_moon_grove_miru_work_strip_v1` - pass
- `SEED_ASSET_IMAGE_BACKGROUND=opaque npm run asset:generate:gpt-image -- --asset-id=fx_moon_grove_discovery_bloom_strip_v1` - pass
- `node scripts/postprocess-moon-grove-creature-assets.mjs` - pass
- `npm run check:moon-grove-creature-assets` - pass
- `npm run check:asset-provenance` - pass
- `npm run check:asset-style` - pass
- `npm run check:asset-alpha` - pass
- `npm run check:ci` - pass
- `git diff --check` - pass

## 리스크

- `gpt-image-2` transparent background은 과거 blocker가 있었으므로 `SEED_ASSET_IMAGE_BACKGROUND=opaque` 경로를 기본으로 사용한다.
- Strip 생성 결과가 strict 8x96x96 layout으로 나오지 않을 가능성이 높아 normalize step이 필요하다.
- 이번 PR은 runtime binding을 하지 않는다. 후속 WorkUnit에서 manifest accepted entry와 Phaser preload/render/telemetry를 연결해야 한다.

## 구현 결과

- `creature_moon_grove_001` portrait를 gpt-image-2 opaque 후보에서 alpha-cleaned `1024x1024` PNG로 저장했다.
- `actor_moon_grove_miru_idle_strip_v1`을 `768x96`, 8 frames, 96x96, 8fps, `moon_grove.discovery.actor.idle` strip으로 정규화했다.
- `actor_moon_grove_miru_work_strip_v1`을 `768x96`, 8 frames, 96x96, 10fps, `moon_grove.discovery.actor.work` strip으로 정규화했다.
- `fx_moon_grove_discovery_bloom_strip_v1`을 `768x96`, 8 frames, 96x96, 12fps, `moon_grove.discovery.action.reveal` strip으로 정규화했다.
- `assets/source/gpt_image_asset_provenance.json`과 `assets/source/asset_generation_status.json`에 `issue_0546_moon_grove_creature_asset_generation_review` batch evidence를 추가했다.
- `reports/assets/moon_grove_creature_asset_review_20260526.md`와 `reports/assets/moon_grove_creature_asset_contact_sheet_20260526.png`를 생성했다.

## 증거

- Review: `reports/assets/moon_grove_creature_asset_review_20260526.md`
- Contact sheet: `reports/assets/moon_grove_creature_asset_contact_sheet_20260526.png`
- Asset checker: `npm run check:moon-grove-creature-assets` pass, checked `4`, failures `[]`
