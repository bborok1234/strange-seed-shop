# Phaser v1 topology asset generation and review

## 요약

#440에서 고정한 topology asset plan/prompt batch를 실제 PNG 후보로 생성하고, provenance/style/alpha/review evidence를 남깁니다.

## Small win

Phaser garden board가 shape placeholder에서 raster art integration으로 넘어갈 수 있는 14개 후보를 확보합니다.

## 사용자/운영자 가치

플레이어는 plot/facility/worker state를 텍스트 없이도 읽을 수 있어야 합니다. 운영자는 generated raster provenance와 review evidence가 있는 asset만 runtime manifest에 넣을 수 있어야 합니다.

## Before / After 또는 Visual evidence

- Before: #433 foundation은 runtime topology와 actor task를 증명했지만 visual layer는 Phaser placeholder shape입니다.
- After: terrain, plot states, workbench, order crate states, actor strips, FX strips, soft shadow 후보 PNG와 review report가 남습니다.

## Playable mode

이번 이슈는 static asset generation/review입니다. Playable integration과 Browser Use playtest는 다음 runtime integration 이슈에서 수행합니다.

## 검증

- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:asset-alpha`
- `npm run check:ci`

## 안전 범위

- Runtime은 image generation API를 호출하지 않습니다.
- 새 산출물은 workspace PNG와 provenance JSON에 한정합니다.
- `gpt-image-2`가 transparent background를 거부하면 opaque 후보로 생성하고, manifest 투입 전 review report에서 후처리/재생성 필요 여부를 판정합니다.

## 남은 위험

- Opaque 생성물은 actor/FX/utility shadow manifest 투입 전에 alpha 또는 배경 제거가 필요할 수 있습니다.
- Sprite strip 후보가 실제 horizontal frame strip으로 읽히지 않으면 재생성 또는 sprite-pipeline 후처리가 필요합니다.

## 연결된 issue

- Follow-up to #440

## 작업 checklist

- [ ] 14개 PNG 후보 생성
- [ ] provenance/style/alpha gate 실행
- [ ] asset review report 작성
- [ ] roadmap/control room/dashboard/heartbeat 갱신
