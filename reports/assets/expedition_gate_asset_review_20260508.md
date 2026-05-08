# 첫 원정 문/귀환 상자 asset review

## 범위

- Issue: #494
- WorkUnit: `items/0263-expedition-gate-raster-review.md`
- Contact sheet: `reports/assets/expedition_gate_asset_contact_sheet_20260508.png`
- 생성 경로: `gpt-image-2`, `SEED_ASSET_IMAGE_BACKGROUND=opaque`
- 후처리: `scripts/postprocess-expedition-gate-assets.mjs`

## 결과 요약

| asset_id | 파일 | 판정 | 근거 |
| --- | --- | --- | --- |
| `facility_expedition_gate_v1` | `public/assets/game/facilities/facility_expedition_gate_v1.png` | accepted manifest/runtime candidate | 1024x1024 RGBA. 달빛 문/식물/발판 silhouette가 96px에서도 원정 문으로 읽히고, 텍스트/워터마크가 없다. 기존 order crate/workbench와 구분된다. |
| `facility_expedition_return_crate_v1` | `public/assets/game/facilities/facility_expedition_return_crate_v1.png` | accepted manifest/runtime candidate | 1024x1024 RGBA. 천 묶음, 목재 crate, 달빛 tag가 보상 cargo로 읽히며 order delivery crate와 구분된다. 텍스트/워터마크가 없다. |
| `fx_expedition_return_reward_strip_v1` | `public/assets/game/fx/fx_expedition_return_reward_strip_v1.png` | accepted normalized FX strip candidate | 768x96 RGBA. 8 frames, 96x96, 14fps, `facility_expedition_gate.action.claim_return_crate` 계약에 맞게 strict strip으로 정규화됐다. |

## 생성/후처리 evidence

- 최초 transparent 요청은 `Transparent background is not supported for this model.`로 거부됐다.
- 3개 후보는 `SEED_ASSET_IMAGE_BACKGROUND=opaque`로 생성됐다.
- 시설 후보는 edge-connected checkerboard alpha cleanup을 적용했다.
- FX 후보는 edge-connected checkerboard alpha cleanup 후 strict 8x96x96 strip으로 정규화했다.
- `assets/source/gpt_image_asset_provenance.json`에 raw output과 accepted output을 기록했다.
- `assets/source/asset_generation_status.json`에 `issue_0494_expedition_gate_raster_review` batch를 기록했다.

## Runtime Separation

게임 runtime은 생성 API나 Codex native image generation을 호출하지 않는다. Phaser runtime은 workspace PNG만 preload/render한다.

## 남은 위험

- 원정 문은 64px에서 장식이 많아 작은 슬롯에서는 크게 렌더링해야 한다.
- 귀환 상자는 prop overlay 크기가 너무 작으면 보상 cargo가 아니라 장식으로 보일 수 있다.
- FX는 생성본에서 추출한 strict strip이므로, runtime claim 위치와 bottom action rail overlap은 `npm run check:phaser` screenshot으로 확인해야 한다.
