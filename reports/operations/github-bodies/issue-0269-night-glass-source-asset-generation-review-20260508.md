## 문제 / 배경

#504/#505에서 `seed_rare_001_icon`과 `fx_night_glass_source_unlock_strip_v1` plan/prompt가 들어갔지만, 실제 PNG 후보가 아직 없다. 이 상태에서는 #502/#503의 `밤유리 source` preview가 dedicated source icon/FX가 아니라 accepted creature silhouette stand-in에 머문다.

## 목표

`밤유리 source` rare route를 위한 전용 source icon 1개와 unlock FX strip 1개를 `gpt-image-2` provenance가 있는 raster PNG 후보로 생성하고, 후속 manifest/runtime binding 전에 review evidence를 남긴다.

## Small win

플레이어가 `밤유리 source`를 placeholder가 아니라 실제 rare route 보상물로 읽을 수 있도록 dedicated asset 후보가 workspace에 생긴다.

## Campaign source of truth

- `docs/GAME_BIBLE.md`
- `docs/GAME_PRODUCTION_SPEC.md`
- `docs/phaser/REBOOT_FOUNDATION_SPEC.md`
- `docs/IDLE_CORE_CREATIVE_GUIDE.md`
- `items/0269-night-glass-source-asset-generation-review.md`

## Game Studio Department Signoff

- 기획팀: `밤유리 source 보기` 다음 payoff를 dedicated source icon/FX 후보로 고정한다.
- 리서치팀: rare route unlock이 icon/FX 없이 텍스트 promise로만 남는 경쟁작 대비 production gap을 해소한다.
- 아트팀: `seed_rare_001_icon`, `fx_night_glass_source_unlock_strip_v1`를 gpt-image-2 provenance로 생성/검토한다.
- 개발팀: runtime binding 전 generation/review만 수행해 rollback boundary를 파일 추가와 provenance 갱신으로 제한한다.
- 검수팀: file existence, provenance/style/CI, review report로 후보 품질을 판정한다.
- 마케팅팀: mock/internal playable promise만 다루며 외부 채널/실결제/광고 없음.
- 고객지원팀: 플레이어 혼란 위험은 후속 runtime binding에서 dedicated icon/FX가 실제 화면에 뜰 때 재검수한다.

## Subagent/Team Routing

Solo execute. 생성 대상이 2개이고 provenance/report/check가 선형이라 병렬 agent를 쓰지 않는다.

## 플레이어 가치

rare source preview가 placeholder debt에서 실제 unlock target 후보로 전환되어 첫 5분 이후의 수집 욕구와 장기 route 기대감을 강화한다.

## 수용 기준

- `public/assets/game/seeds/seed_rare_001_icon.png`가 생성된다.
- `public/assets/game/fx/fx_night_glass_source_unlock_strip_v1.png`가 생성된다.
- `assets/source/gpt_image_asset_provenance.json`에 두 asset record가 기록된다.
- `assets/source/asset_generation_status.json`에 이번 batch가 기록된다.
- `reports/assets/night_glass_source_asset_review_20260508.md`와 contact sheet가 생성된다.
- `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:ci`, `git diff --check`가 통과한다.

## Visual evidence 계획

Runtime 화면 변경은 없다. PNG 후보 contact sheet와 review report를 visual evidence로 남기고, Browser Use hands-on QA는 후속 Phaser runtime binding PR에서 수행한다.

## Playable mode 영향

이번 PR은 asset candidate generation/review만 수행하므로 playable runtime은 바뀌지 않는다.

## 안전 범위

- Runtime image generation/API 호출을 추가하지 않는다.
- SVG/vector/code-native 그림을 accepted game asset으로 만들지 않는다.
- Manifest acceptance와 Phaser runtime binding은 후속 WorkUnit으로 분리한다.

## 검증 명령

- `npm run asset:generate:gpt-image -- --asset-id=seed_rare_001_icon`
- `npm run asset:generate:gpt-image -- --asset-id=fx_night_glass_source_unlock_strip_v1`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:ci`
- `git diff --check`
