# 월정 숲 source runtime binding

## 요약

#532/#533에서 생성/리뷰한 `seed_moon_grove_001_icon`과 `fx_moon_grove_source_reward_strip_v1`을 manifest accepted asset과 Phaser reward/source promise 화면에 연결합니다. 현재 `clue_moon_grove_001`은 텍스트 promise에 머물러 있어 다음 source target이 시각적으로 보이지 않습니다.

## Small win

월정 문 첫 원정 보상이 전용 월정 숲 seed icon/FX로 읽힙니다.

## 사용자/운영자 가치

- 사용자: `월정 문 귀환 상자 열기` 후 다음 source 목표를 그림과 FX로 이해할 수 있습니다.
- 운영자: 후속 acquisition/planting loop가 accepted manifest asset key와 telemetry를 기준으로 이어집니다.

## Before / After 또는 Visual evidence

- Before: `clue_moon_grove_001 source promise` 텍스트만 표시되고 dedicated seed icon/FX는 runtime에 없음.
- After target: `seed_moon_grove_001_icon`, `fx_moon_grove_source_reward_strip_v1` manifest accepted + Phaser render/telemetry.
- Visual evidence: Browser Use 우선 QA 또는 current-session blocker + Playwright checker screenshot을 남길 예정.

## Playable mode

- Phaser app: `npm run dev:phaser`
- Stable main playable remains separate: `npm run play:main`

## 검증

- `npm run check:phaser`
- `npm run check:content`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:asset-alpha`
- `npm run check:ci`
- `git diff --check`

## 안전 범위

- Runtime image generation/API/cache 호출 없음.
- 실제 acquisition/planting/harvest loop는 후속 issue로 분리합니다.
- 실결제/외부 채널/production user data 변경 없음.

## 남은 위험

- 이 PR은 source promise visual binding만 닫습니다. `seed_moon_grove_001` 획득/심기/수확 loop는 후속 PR이 필요합니다.

## 작업 checklist

- [ ] WorkUnit plan-first artifact 고정
- [ ] GitHub issue 번호를 WorkUnit/ROADMAP/heartbeat에 반영
- [ ] manifest accepted entry 추가
- [ ] Phaser preload/render/FX/telemetry binding 추가
- [ ] Browser Use 또는 blocker + Playwright evidence
- [ ] local checks 통과
- [ ] PR checks와 main CI 관찰

## 연결된 issue

Follows #532 and #533.
