# #467 이후 storage asset generation blocker

## 상태

#467은 `facility_storage_basket_v1`과 `fx_storage_claim_leaf_flyout_strip_v1`의 plan/prompt를 PR #468로 main에 병합했고, main CI `25521182658`가 green이다.

## blocker

현재 세션 환경에서 API 기반 generation에 필요한 값이 없다.

- `OPENAI_API_KEY`: missing
- `SEED_ASSET_IMAGE_MODEL`: unset

또한 이 Codex surface에서는 Codex native image generation 결과를 workspace PNG 경로로 저장하는 안정적인 tool path가 노출되지 않았다. 프로젝트 계약상 accepted game graphics는 `public/assets/game/**`에 저장된 raster PNG여야 하며, Codex generated image cache에만 남길 수 없다.

## 결정

storage asset generation/review는 다음 조건 중 하나가 충족될 때 별도 WorkUnit으로 재개한다.

- `OPENAI_API_KEY`와 `SEED_ASSET_IMAGE_MODEL`이 준비되어 `gpt-image-2` provenance를 남길 수 있다.
- Codex native image generation 결과를 workspace PNG로 저장할 수 있는 tool path가 확인된다.

## 이번 run의 continuation

generation blocker를 이유로 멈추지 않고, v1 vertical slice의 다음 non-blocked candidate인 #434 `Phaser 신규 정원에 감상 모드와 HUD 접기`를 진행한다.
