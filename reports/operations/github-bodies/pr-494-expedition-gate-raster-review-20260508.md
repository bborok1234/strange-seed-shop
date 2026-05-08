# 첫 원정 문/귀환 상자 raster 후보 생성/리뷰

## 요약

첫 원정 route의 prompt-only asset 계약을 실제 generated raster 후보, provenance, review, manifest, Phaser runtime binding까지 연결했습니다. 원정 문, 귀환 상자, 귀환 보상 FX를 전용 PNG로 만들고 order crate stand-in을 제거했습니다.

## Small win

원정 문 preview -> 출발 -> 귀환 상자 -> 보상 claim이 이제 전용 `facility_expedition_gate_v1`, `facility_expedition_return_crate_v1`, `fx_expedition_return_reward_strip_v1`로 보입니다.

## 사용자/운영자 가치

플레이어는 D7 원정 route를 텍스트가 아니라 화면 prop과 보상 움직임으로 이해합니다. 운영자는 `gpt-image-2` raw output, post-processing, status batch, manifest, visual QA evidence를 가진 재현 가능한 asset path를 확보합니다.

## Before / After 또는 Visual evidence

- Before: 원정 문 runtime은 기존 order crate texture를 임시로 사용했습니다.
- After: 전용 원정 문 texture, returned 상태 귀환 상자 overlay, claim 전용 FX strip을 Phaser에서 preload/render합니다.
- Asset contact sheet: `reports/assets/expedition_gate_asset_contact_sheet_20260508.png`
- Asset review: `reports/assets/expedition_gate_asset_review_20260508.md`
- Visual QA: `reports/visual/issue-0494-expedition-gate-raster-review/visual-report-20260508.md`
- Key screenshots:
  - `reports/visual/issue-0494-expedition-gate-raster-review/phaser-check-expedition-gate-preview-393.png`
  - `reports/visual/issue-0494-expedition-gate-raster-review/phaser-check-expedition-returned-393.png`
  - `reports/visual/issue-0494-expedition-gate-raster-review/phaser-check-expedition-claimed-393.png`

## Playable mode

Phaser route. `npm run check:phaser` starts the local Phaser app and captures the full first-loop through expedition claim.

## 작업 checklist

- [x] `facility_expedition_gate_v1` gpt-image-2 생성
- [x] `facility_expedition_return_crate_v1` gpt-image-2 생성
- [x] `fx_expedition_return_reward_strip_v1` gpt-image-2 생성
- [x] transparent background blocker 기록 후 `SEED_ASSET_IMAGE_BACKGROUND=opaque` 재시도
- [x] edge-connected checkerboard alpha cleanup
- [x] FX strict 8x96x96 normalization
- [x] `asset_generation_status.json` batch/provenance/manifest 갱신
- [x] Phaser runtime binding 및 screenshot QA

## 검증

- `npm run check:phaser` — pass
- `npm run check:asset-provenance` — pass
- `npm run check:asset-style` — pass
- `npm run check:asset-alpha` — pass
- `npm run check:topology-asset-plan` — pass
- `npm run check:ci` — pass
- `git diff --check` — pass

## 안전 범위

- Runtime image generation/API/cache 호출 없음.
- 새 파일은 workspace PNG와 raw provenance로만 사용됩니다.
- 실결제/외부 배포/고객 데이터 변경 없음.

## 남은 위험

- Browser Use 도구가 이번 세션에 노출되지 않아 Playwright fallback screenshot과 수동 screenshot inspection으로 검증했습니다.
- 원정 문은 detail-rich asset이라 더 조밀한 board 배치가 생기면 runtime crop/scale 조정이 필요할 수 있습니다.

## 연결된 issue

Closes #494
