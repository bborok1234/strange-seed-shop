# 월정 숲 source asset generation-review

## 요약

#530/#531에서 `clue_moon_grove_001`의 source seed icon/FX plan-prompt를 추가했지만, 아직 실제 PNG workspace asset은 없습니다. 이번 issue는 `seed_moon_grove_001_icon`과 `fx_moon_grove_source_reward_strip_v1`을 생성/리뷰해 runtime binding 가능한 후보로 만듭니다.

## Small win

월정 문 첫 원정 보상이 다음 source visual asset 후보까지 이어집니다.

## 사용자/운영자 가치

- 사용자: 후속 runtime binding에서 월정 숲 source를 밤유리 source와 구분되는 보상으로 볼 수 있습니다.
- 운영자: manifest/runtime PR이 생성된 PNG, provenance, review evidence를 기준으로 진행됩니다.

## Before / After 또는 Visual evidence

- Before: `assets/source/asset_plan.json`, `assets/source/asset_prompts.json`에는 plan/prompt만 있고 `public/assets/game/seeds/seed_moon_grove_001_icon.png`, `public/assets/game/fx/fx_moon_grove_source_reward_strip_v1.png`가 없음.
- After target: 두 PNG가 workspace에 저장되고 generation/review evidence가 남음.
- Visual evidence: 생성 asset contact sheet/review report를 남길 예정.

## Playable mode

N/A - 이번 slice는 static asset generation/review이며 Phaser runtime binding은 후속 issue로 분리합니다.

## 검증

- `npm run check:topology-generated-assets`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:asset-alpha`
- `npm run check:ci`
- `git diff --check`

## 안전 범위

- Runtime image generation/API/cache 호출 없음.
- 실결제/외부 채널/production user data 변경 없음.
- Phaser runtime binding과 accepted manifest registration은 후속 PR로 분리합니다.

## 남은 위험

- Codex native image generation save path나 gpt-image-2 API access가 막히면 blocker report가 필요합니다.
- 생성 후보가 small-size readability나 style consistency를 통과하지 못하면 regeneration이 필요합니다.

## 작업 checklist

- [ ] WorkUnit plan-first artifact 고정
- [ ] GitHub issue 번호를 WorkUnit/ROADMAP/heartbeat에 반영
- [ ] seed icon PNG 생성/저장
- [ ] FX strip PNG 생성/저장
- [ ] generation/review evidence 갱신
- [ ] local checks 통과
- [ ] PR checks와 main CI 관찰

## 연결된 issue

Follows #530 and #531.
