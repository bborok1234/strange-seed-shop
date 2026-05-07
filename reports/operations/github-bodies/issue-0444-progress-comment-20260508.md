## 진행 상황

Phaser v1 topology runtime integration 1차 구현을 완료했습니다.

## 변경 요약

- `node scripts/postprocess-topology-runtime-assets.mjs` 추가
  - plot/facility/shadow 후보 9개를 edge-connected checkerboard alpha cleanup으로 RGBA 처리
  - provenance/status에 `edge_connected_checkerboard_alpha_cleanup` 기록
- Phaser runtime에서 generated topology PNG preload/render
  - terrain background
  - plot empty/sprout/growing/ready/locked-preview states
  - workbench
  - order crate empty/filled source states
  - soft grounding shadow
- action rail stretch 회귀 수정
  - playfield를 덮던 큰 반투명 panel을 하단 rail로 고정

## Visual evidence

- Alpha contact sheet: `reports/assets/topology_runtime_alpha_contact_sheet_20260508.png`
- Visual report: `reports/visual/issue-0444-topology-runtime-integration/visual-report-20260508.md`
- Screenshots:
  - `reports/visual/issue-0444-topology-runtime-integration/phaser-check-fresh-start-393.png`
  - `reports/visual/issue-0444-topology-runtime-integration/phaser-check-after-plant-393.png`
  - `reports/visual/issue-0444-topology-runtime-integration/phaser-check-ready-393.png`
  - `reports/visual/issue-0444-topology-runtime-integration/phaser-check-workbench-claim-393.png`

## 검증

- `npm run check:phaser` — pass
- `npm run check:topology-generated-assets` — pass
- `npm run check:asset-provenance` — pass
- `npm run check:asset-style` — pass
- `npm run check:asset-alpha` — pass
- `npm run check:ci` — pass

## 남은 위험

- Actor/FX source candidates are still not strict spritesheets. 다음 WorkUnit에서 actor/FX normalization 또는 order reward motion으로 분리해야 합니다.
