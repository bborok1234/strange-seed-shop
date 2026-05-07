# Phaser v1 topology alpha cleanup and runtime integration

## 요약

#442에서 생성한 topology 후보 중 background, plot states, facility states를 alpha-clean runtime asset으로 정리하고 Phaser board에 연결합니다.

## Small win

첫 화면이 Phaser placeholder shape가 아니라 실제 generated raster garden board로 읽힙니다.

## 사용자/운영자 가치

플레이어는 심기/돌보기/수확/수령 상태를 그림으로 먼저 읽고, 운영자는 opaque 후보를 검증 없이 manifest accepted로 올리는 사고를 막을 수 있습니다.

## Before / After 또는 Visual evidence

- Before: #433 foundation은 shape placeholder로 topology를 증명했고, #442는 opaque source candidate만 남겼습니다.
- After: terrain/plot/facility PNG가 Phaser runtime에 보이고, screenshot evidence가 남습니다.

## Playable mode

Phaser app lane을 수정합니다. 사람 플레이 main worktree는 merge 후 `npm run play:main`으로 갱신 가능합니다.

## 검증

- `npm run check:phaser`
- `npm run check:topology-generated-assets`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:asset-alpha`
- `npm run check:ci`

## 안전 범위

- Runtime image generation/API 호출 없음.
- Actor/FX strip 후보는 이번 PR에서 accepted manifest로 올리지 않고 후속 sprite-pipeline normalization으로 분리합니다.
- 결제/광고/외부 배포/고객 데이터 없음.

## 남은 위험

- Alpha cleanup 품질이 낮으면 runtime integration 대신 blocker report로 멈추고 재생성/후처리 WorkUnit으로 분리합니다.
- Browser Use 도구가 노출되지 않으면 Playwright fallback screenshot evidence를 남깁니다.

## 연결된 issue

- Follow-up to #442

## 작업 checklist

- [ ] Alpha-clean runtime PNG 생성
- [ ] Phaser preload/render 연결
- [ ] `check:phaser` runtime image visibility 확장
- [ ] visual evidence 저장
- [ ] roadmap/control room/dashboard/heartbeat 갱신
