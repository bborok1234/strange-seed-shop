# 월정 숲 source asset generation-review

## 상태

- Status: implemented/local-verified
- Game Studio route: `game-studio:game-studio -> game-studio:sprite-pipeline -> game-studio:phaser-2d-game -> game-studio:game-playtest`
- GitHub issue: #532
- PR: TBD
- Branch: `codex/v1-moon-grove-source-asset-generation-review`
- 연결: Issue #530, PR #531, main CI `25649871624`

## 배경

#530/#531은 `clue_moon_grove_001`에 대응하는 `seed_moon_grove_001_icon`과 `fx_moon_grove_source_reward_strip_v1` plan/prompt를 추가했다. 현재 두 `output_path` 파일은 아직 없어서 후속 runtime binding이 accepted manifest asset을 참조할 수 없다.

이번 slice는 두 asset을 raster PNG workspace file로 생성하고, small-size/readability/style/provenance review를 남겨 manifest registration 가능한 후보로 만든다. Phaser runtime binding은 후속 WorkUnit으로 분리한다.

## Creative brief

- Player verb: `월정 숲 source 보기`
- Production/progression role: 월정 문 첫 원정 보상이 다음 source visual target으로 이어진다.
- Screen moment: `clue_moon_grove_001` reward가 전용 seed icon과 source reward FX로 읽힐 준비를 마친다.
- Asset/FX decision: `seed_moon_grove_001_icon` PNG와 `fx_moon_grove_source_reward_strip_v1` 8-frame strip PNG를 생성/리뷰한다.
- Competition gap: 수집형 idle은 새 지역 보상이 다음 수집 target의 silhouette/icon/FX로 즉시 이어져야 한다. 텍스트 promise만 남으면 D1/D7 장기 목표가 약하다.
- Rejected alternative: prompt만 유지하고 runtime에서 기존 `seed_rare_001_icon`을 재사용. 이유: 월정 숲 source는 밤유리 source와 destination payoff가 달라야 한다.

## Plan

1. `assets/source/asset_prompts.json`의 두 moon-grove prompt를 기준으로 static raster PNG를 생성한다.
2. `public/assets/game/seeds/seed_moon_grove_001_icon.png`와 `public/assets/game/fx/fx_moon_grove_source_reward_strip_v1.png`를 workspace에 저장한다.
3. FX는 8 frames, 96x96, 12fps, `animation.binding=moon_fence.reward.action.claim_source_clue` 조건을 검증한다.
4. generation status, provenance, asset review report/contact sheet를 갱신한다.
5. `docs/ROADMAP.md`, heartbeat, dashboard/control room을 PR-ready evidence로 갱신한다.

## 수용 기준

- 두 output path PNG가 존재하고 비어 있지 않다.
- accepted game graphic은 raster PNG이며 SVG/vector/code-native drawing이 아니다.
- seed icon은 48px/96px에서 moon-grove source seed로 읽히고 `seed_rare_001_icon`, `seed_lunar_002_icon`과 구분된다.
- FX strip은 총 8 frames, 각 96x96, horizontal strip이며 `moon_fence.reward.action.claim_source_clue` binding을 review evidence에 남긴다.
- runtime image generation/API/cache 호출 없음.
- `npm run check:topology-generated-assets`, `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:asset-alpha`, `npm run check:ci`, `git diff --check`가 통과한다.

## Department Scorecard

| 부서 | 판정 | 근거 |
| --- | --- | --- |
| 기획팀 | approve | #531 plan-prompt를 실제 next source visual target으로 진전시킨다. |
| 리서치팀 | approve | 새 지역 보상이 다음 수집 target으로 이어지는 경쟁작 production gap을 해소한다. |
| 아트팀 | approve | seed icon + reward FX strip을 raster PNG 후보로 생성/리뷰한다. |
| 개발팀 | approve | runtime binding 없이 static asset/provenance/review만 다룬다. |
| 검수팀 | approve | dimension/provenance/style/alpha/check:ci gate로 검증한다. |
| 마케팅팀 | approve | 내부 asset prep이며 외부 채널/실결제 promise 없음. |
| 고객지원팀 | approve | 플레이어가 다음 source reward를 시각적으로 이해할 준비를 만든다. |

## 검증 명령

- `npm run check:topology-generated-assets`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:asset-alpha`
- `npm run check:ci`
- `git diff --check`

## Blocker boundary

- Codex native image generation save path가 workspace file로 확보되지 않거나, gpt-image-2 API가 quota/credential/model access로 막히면 blocker report를 남긴다.
- 실제 runtime manifest accepted binding과 Phaser render 연결은 후속 WorkUnit에서 처리한다.

## 구현 결과

- `SEED_ASSET_IMAGE_BACKGROUND=opaque`와 gpt-image-2로 `seed_moon_grove_001_icon` 후보를 생성했다.
- `SEED_ASSET_IMAGE_BACKGROUND=opaque`와 gpt-image-2로 `fx_moon_grove_source_reward_strip_v1` 후보를 생성했다.
- `scripts/postprocess-moon-grove-source-assets.mjs`로 border-connected checkerboard alpha cleanup을 적용했다.
- `fx_moon_grove_source_reward_strip_v1`을 8 frames, 96x96, 12fps, `moon_fence.reward.action.claim_source_clue` strict strip으로 정규화했다.
- Review/contact sheet:
  - `reports/assets/moon_grove_source_asset_review_20260511.md`
  - `reports/assets/moon_grove_source_asset_contact_sheet_20260511.png`

## 검증 결과

- Pass: `npm run check:moon-grove-source-assets`
- Pass: `npm run check:asset-provenance`
- Pass: `npm run check:asset-style`
- Pass: `npm run check:asset-alpha`
- Pass: `npm run check:topology-generated-assets`
- Pass: `npm run check:ci`
- Pass: `git diff --check`
