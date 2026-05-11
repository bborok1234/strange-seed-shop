# 월정 문 source asset plan-prompt

## 요약

#529 이후 `clue_moon_grove_001 source promise`가 asset pipeline 없이 멈추는 blocker를 해소하기 위해 `seed_moon_grove_001_icon`과 `fx_moon_grove_source_reward_strip_v1`을 generation-ready plan/prompt에 추가했습니다.

## Small win

월정 문 첫 원정 보상이 다음 source seed icon/FX 후보로 이어집니다.

## 사용자/운영자 가치

- 사용자: 후속 생성/바인딩 slice에서 밤유리 source와 구분되는 월정 숲 보상을 볼 수 있는 준비가 됩니다.
- 운영자: generation/review/runtime binding issue가 stable asset id, output path, frame spec, animation binding을 기준으로 진행할 수 있습니다.

## Before / After 또는 Visual evidence

- Before: `clue_moon_grove_001`은 reward promise telemetry만 있고 전용 source seed icon/FX plan-prompt가 없었습니다.
- After: `assets/source/asset_plan.json`과 `assets/source/asset_prompts.json`에 `seed_moon_grove_001_icon`, `fx_moon_grove_source_reward_strip_v1`을 추가했습니다.
- Visual evidence: N/A - 이번 PR은 generation-ready prompt/plan 문서 slice이며 runtime 화면 변경이나 새 PNG 생성은 없습니다.

## Playable mode

N/A - runtime 화면 변경 없음. 후속 PR에서 image generation/review, manifest accepted 등록, Phaser runtime binding을 분리합니다.

## 검증

- [x] `git diff --check`
- [x] `npm run check:topology-asset-plan`
- [x] `npm run check:asset-provenance`
- [x] `npm run check:asset-style`
- [x] `npm run check:ci`
- [x] `npm run check:dashboard`
- [x] `npm run check:ops-live`

## 안전 범위

- Runtime image generation/API/cache 호출 없음.
- 새 accepted manifest game asset 등록 없음.
- Phaser runtime binding 없음.
- 실제 PNG 생성과 asset review는 후속 issue로 분리했습니다.

## 남은 위험

- 이 PR만으로는 새 asset이 화면에 표시되지 않습니다.
- 후속 generation/review PR에서 Codex native image generation 또는 gpt-image-2 provenance, alpha/style/provenance gate, accepted manifest binding이 필요합니다.

## 작업 checklist

- [x] WorkUnit plan-first artifact 고정
- [x] GitHub issue #530 고정
- [x] asset plan/prompt 추가
- [x] local checks 통과
- [ ] PR checks 관찰
- [ ] merge 후 main CI 관찰

## 연결된 issue

Closes #530
