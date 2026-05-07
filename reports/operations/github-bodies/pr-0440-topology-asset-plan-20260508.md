## 요약

#433 Phaser garden board foundation 다음 단계로, v1 topology runtime을 실제 raster asset/sprite/FX generation으로 넘길 수 있는 plan/prompt batch를 추가했습니다.

## Small win

`assets/source/asset_plan.json`과 `assets/source/asset_prompts.json`이 67/67 exact match 상태가 되었고, 신규 topology asset 14개가 product decision 없이 바로 generation 단계로 넘어갈 수 있습니다.

## 사용자/운영자 가치

사용자 가치는 다음 화면에서 plot/facility/actor/FX 상태가 텍스트나 placeholder shape가 아니라 실제 mobile-readable game asset으로 보이는 기반을 만드는 것입니다.

운영자 가치는 Studio가 #433 merge 이후 다음 blocker를 자동으로 찾아 #440 issue, plan, prompt, verifier, CI evidence까지 남긴 것입니다.

## Before / After 또는 Visual evidence

Before:

- #433 runtime은 Phaser placeholder shape로 topology만 증명했습니다.
- `asset_prompts.json`에 과거 alias prompt 2개가 plan 없이 남아 있었습니다.

After:

- `bg_garden_terrain_open_v1`
- plot state 5개
- workbench/order crate state 3개
- Pori/Momo actor strips 2개
- care/harvest FX strips 2개
- soft shadow utility 1개
- compatibility alias plan 2개

이 PR은 plan/prompt-only라 새 visual screenshot은 없습니다. Generation/review WorkUnit에서 Browser Use/small-size visual evidence를 남깁니다.

## Playable mode

Playable runtime 변경 없음. `apps/seed-garden-phaser`는 #433 merged foundation 상태를 유지합니다.

## 검증

- `node scripts/update-topology-asset-plan.mjs` — pass
- `npm run check:topology-asset-plan` — pass
- `npm run check:asset-provenance` — pass
- `npm run check:asset-style` — pass
- `npm run check:ci` — pass

## 안전 범위

- 실제 PNG generation 없음
- manifest accepted asset 등록 없음
- runtime image generation 없음
- SVG/vector/code-native accepted game graphics 없음
- 결제, 로그인, 광고, 외부 배포 없음

## 남은 위험

다음 WorkUnit에서 실제 generation이 필요합니다. `OPENAI_API_KEY`/`SEED_ASSET_IMAGE_MODEL` 경로가 막히면 Codex native image generation fallback으로 raster PNG workspace outputs를 만들어야 합니다.

## 연결된 issue

Closes #440

## 작업 checklist

- [x] Plan-first WorkUnit 작성
- [x] GitHub Issue #440 생성
- [x] Department Scorecard 작성
- [x] Asset plan 14개 추가
- [x] Prompt batch 14개 추가
- [x] Plan/prompt exact match 검증 추가
- [x] `check:ci`에 topology asset plan gate 추가
- [x] Issue checkpoint comment 게시
