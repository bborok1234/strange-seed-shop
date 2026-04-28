# P0 Asset Alpha Cutout Review

Status: review
Issue: #91
Branch: codex/p0-asset-alpha-cutout
Date: 2026-04-28

## Scope

`assets/source/asset_alpha_exceptions.json`에 기록된 16개 RGB PNG 예외 asset을 대상으로 local edge-connected matte cutout을 적용했다. 외부 이미지 생성/API 호출, runtime image generation, 새 dependency 설치는 하지 않았다.

## Method

- Local Python + Pillow 환경을 사용했다. 새 dependency는 설치하지 않았다.
- 각 PNG의 border/corner에서 low-saturation matte palette를 추정했다.
- 이미지 edge와 연결된 background/checkerboard/matte 영역만 flood-fill로 탐색해 alpha 0으로 변환했다.
- 한 픽셀 fringe는 background palette 거리 기준으로 soft alpha를 적용했다.
- 원본 id/path/manifest dimensions는 유지했다.

Machine-readable record: `reports/assets/asset_alpha_cutout_20260428.json`

## Result

- Processed assets: 16
- Alpha-required assets checked by gate: 22
- Alpha passed: 22
- Remaining alpha exceptions: 0

## Visual evidence

- Harvest reveal: `reports/visual/p0-alpha-cutout-harvest-reveal-20260428.png`
- Album/reveal context: `reports/visual/p0-alpha-cutout-album-20260428.png`

## Remaining risks

- 자동 cutout은 기존 이미지를 보존하는 응급 복구다. 고품질 production asset은 Codex native image generation 기반 transparent cutout/remaster batch로 다시 만드는 것이 더 안전하다.
- 일부 가장자리 halo는 남을 수 있으므로 다음 asset batch review에서 small-size readability와 edge cleanliness를 다시 봐야 한다.
