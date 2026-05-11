# 월정 문 source asset plan-prompt

## 요약

#528/#529 이후 `clue_moon_grove_001 source promise`는 열렸지만, 다음 source seed icon과 reward FX 후보가 asset plan/prompt에 없습니다. 이번 issue는 `seed_moon_grove_001_icon`과 `fx_moon_grove_source_reward_strip_v1`을 generation-ready plan/prompt로 추가합니다.

## Small win

월정 문 첫 원정 보상이 다음 source visual pipeline으로 이어집니다.

## 사용자/운영자 가치

- 사용자: 다음 source가 밤유리와 구분되는 월정 숲 보상으로 읽힐 준비가 됩니다.
- 운영자: 후속 generation/review/runtime binding issue가 stable asset id와 prompt를 기준으로 진행할 수 있습니다.

## Before / After 또는 Visual evidence

- Before: `clue_moon_grove_001`은 telemetry/source promise만 있고 asset plan/prompt가 없음.
- After target: `seed_moon_grove_001_icon`, `fx_moon_grove_source_reward_strip_v1` plan/prompt 추가.
- Visual evidence: N/A - 이번 slice는 generation-ready prompt/plan 문서 작업이며 runtime 화면 변경 없음.

## Playable mode

- N/A - runtime 화면 변경 없음.

## 검증

- `npm run check:topology-asset-plan`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:ci`
- `git diff --check`

## 안전 범위

- Runtime image generation/API/cache 호출 없음.
- 실제 image generation, manifest accepted 등록, Phaser runtime binding은 후속 issue로 분리합니다.

## 남은 위험

- 이 PR만으로는 새 asset PNG가 생성되지 않습니다.
- generation/review 이후 alpha/style/provenance gate를 통과해야 runtime accepted asset으로 사용할 수 있습니다.

## 작업 checklist

- [ ] WorkUnit plan-first artifact 고정
- [ ] GitHub issue 번호를 WorkUnit/ROADMAP/heartbeat에 반영
- [ ] asset plan/prompt 추가
- [ ] local checks 통과
- [ ] PR checks와 main CI 관찰

## 연결된 issue

Follows #528 and #529.
