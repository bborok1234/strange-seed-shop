## 요약

`월정 숲 새벽이끼` discovery가 source badge에 머물지 않도록 전용 creature portrait, idle/work actor strips, discovery bloom FX의 generation-ready plan/prompt를 추가했습니다.

## Small win

후속 generation/review WorkUnit이 바로 월정 숲 creature/actor/FX 4개를 생성할 수 있습니다.

## 사용자/운영자 가치

플레이어 관점에서는 rare discovery가 이름 있는 생명체와 정원 actor로 확장될 준비가 생깁니다. 운영 관점에서는 asset generation 전에 id, output path, frame metadata, prompt acceptance를 고정해 후속 작업의 모호성을 줄입니다.

## Before / After 또는 Visual evidence

- Before: `월정 숲 새벽이끼` reveal은 source badge/FX 중심이었고 dedicated creature/actor asset pipeline이 없었습니다.
- After: `creature_moon_grove_001`, `actor_moon_grove_miru_idle_strip_v1`, `actor_moon_grove_miru_work_strip_v1`, `fx_moon_grove_discovery_bloom_strip_v1`이 plan/prompt에 추가됐습니다.
- Visual evidence: `N/A - plan/prompt only, runtime UI 변화 없음`

## Playable mode

Runtime playable 변경 없음. 후속 generation/review 및 runtime binding WorkUnit에서 Phaser 화면 증거를 남깁니다.

## 검증

- `npm run check:topology-asset-plan`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:ci`
- `git diff --check`

## 안전 범위

- 이미지 생성 없음
- Runtime image generation/API/cache 호출 없음
- 새 accepted manifest asset 등록 없음
- 결제, 광고, 고객 데이터, 외부 배포 없음

## 남은 위험

실제 PNG 생성, asset review, manifest accepted 등록, Phaser runtime binding은 후속 WorkUnit에서 닫아야 합니다.

## 연결된 issue

Closes #542

## 작업 checklist

- [x] Game Studio route 기록
- [x] Plan-first WorkUnit 생성
- [x] Asset plan 4개 추가
- [x] Prompt batch 4개 추가
- [x] Local checks 통과
