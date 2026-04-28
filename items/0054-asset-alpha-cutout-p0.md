# P0 생명체/씨앗 에셋 투명 배경 cutout

Status: in_progress
Owner: agent
Created: 2026-04-28
Updated: 2026-04-28
Scope-risk: moderate
Work type: game_content
Issue: #91
Branch: codex/p0-asset-alpha-cutout

## Intent

P0 UI/UX rescue에서 alpha 없는 RGB PNG 에셋이 reveal/card UI에 체커보드 또는 배경 사각형으로 노출되는 문제가 확인되었다. 기존 static asset을 프로젝트 로컬에서 보존하면서 배경 연결 영역을 투명화해, 생명체 수집 화면의 몰입을 개선한다.

## Acceptance Criteria

- `assets/source/asset_alpha_exceptions.json`의 예외가 제거되거나 명확한 잔여 사유만 남는다.
- creature/seed/icon/ui alpha 필요 asset이 `scripts/check-asset-alpha-quality.mjs`를 통과한다.
- cutout 전/후 visual evidence가 `reports/visual/` 또는 `reports/assets/`에 저장된다.
- `npm run check:asset-alpha`, `npm run check:content`, `npm run check:all`가 통과한다.

## Evidence

- Cutout review: `reports/assets/asset_alpha_cutout_20260428.md`
- Cutout machine record: `reports/assets/asset_alpha_cutout_20260428.json`
- Harvest reveal visual: `reports/visual/p0-alpha-cutout-harvest-reveal-20260428.png`
- Album visual: `reports/visual/p0-alpha-cutout-album-20260428.png`
- Source issue: #91
- Prior policy: `docs/GAME_UI_UX_RESEARCH_20260428.md`
- Alpha exception list: `assets/source/asset_alpha_exceptions.json`

## Proposed Plan

1. 예외 asset을 백업/보고서에 기록한다.
2. 로컬 PIL 기반 flood-fill cutout으로 edge-connected checkerboard/background 영역을 alpha 0으로 변환한다.
3. 결과 PNG가 RGBA alpha를 갖는지 검사한다.
4. reveal/card visual evidence를 캡처한다.
5. 불안정한 asset은 예외에 남기고 후속 image generation remaster로 분리한다.

## Apply Conditions

- runtime image generation을 추가하지 않는다.
- 새 dependency를 설치하지 않는다.
- manifest id/path/content schema는 바꾸지 않는다.

## Verification

- `npm run check:asset-alpha`
- `npm run check:content`
- `npm run check:p0-ui-ux`
- `npm run check:all`
