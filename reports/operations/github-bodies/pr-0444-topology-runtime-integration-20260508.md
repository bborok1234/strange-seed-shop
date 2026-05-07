## 요약

#442에서 만든 topology 후보 중 background/plot/facility/shadow를 Phaser runtime에 실제로 연결했습니다.

## Small win

Phaser v1 first screen이 placeholder shape가 아니라 generated raster garden board로 읽힙니다.

## 사용자/운영자 가치

플레이어는 심기/돌보기/수확 상태를 generated plot art 변화로 보고, 운영자는 opaque/checkerboard source candidate를 alpha-clean 후 runtime에 투입하는 경로를 검증할 수 있습니다.

## Before / After 또는 Visual evidence

- Before: #433 runtime board는 Phaser shape placeholder였고, #442 후보는 opaque source candidate였습니다.
- After: terrain, plot state, workbench, order crate image가 Phaser board에 preload/render됩니다.
- Alpha contact sheet: `reports/assets/topology_runtime_alpha_contact_sheet_20260508.png`
- Visual report: `reports/visual/issue-0444-topology-runtime-integration/visual-report-20260508.md`
- Screenshots:
  - `reports/visual/issue-0444-topology-runtime-integration/phaser-check-fresh-start-393.png`
  - `reports/visual/issue-0444-topology-runtime-integration/phaser-check-after-plant-393.png`
  - `reports/visual/issue-0444-topology-runtime-integration/phaser-check-ready-393.png`
  - `reports/visual/issue-0444-topology-runtime-integration/phaser-check-workbench-claim-393.png`

## Playable mode

Phaser app lane changed. Existing plant/care/harvest/workbench claim smoke remains green. Main playable worktree can be refreshed after merge.

## 검증

- `npm run check:phaser`
- `npm run check:topology-generated-assets`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:asset-alpha`
- `npm run check:ci`

## 안전 범위

- Runtime image generation/API/cache 호출 없음.
- Actor/FX source candidates are not registered as accepted spritesheets.
- 결제/광고/외부 배포/고객 데이터 없음.

## 남은 위험

- Actor/FX 후보는 여전히 1024x1024 source candidate이며 다음 sprite-pipeline normalization이 필요합니다.
- Order reward motion은 아직 static crate state 수준입니다.

## 연결된 issue

- Closes #444

## 작업 checklist

- [x] Alpha-clean runtime PNG 생성
- [x] Phaser preload/render 연결
- [x] `check:phaser` runtime image visibility 확장
- [x] visual evidence 저장
- [x] roadmap/control room/dashboard/heartbeat 갱신
