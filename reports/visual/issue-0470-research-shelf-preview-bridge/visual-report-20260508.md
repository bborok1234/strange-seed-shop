# #470 연구 선반 preview bridge visual report

## Summary

storage claim 이후 `연구 선반` preview slot과 `살펴보기` action을 추가했다. `살펴보기` 후에는 달빛 씨앗 단서 preview receipt와 research telemetry가 남는다.

## Evidence

- Research ready: `reports/visual/issue-0470-research-shelf-preview-bridge/phaser-check-research-shelf-ready-393.png`
- Research inspected: `reports/visual/issue-0470-research-shelf-preview-bridge/phaser-check-research-shelf-inspected-393.png`
- Storage claimed: `reports/visual/issue-0470-research-shelf-preview-bridge/phaser-check-storage-claimed-393.png`

## Verification

- `npm run check:phaser`: PASS
- `researchShelfPreviewSeen`: `true`
- `previewSlotIds`: includes `facility_research_shelf`
- research facility state: `kind=research_shelf`, `visualState=preview`
- receipt: `연구 선반 살펴보기 · 달빛 씨앗 단서 preview`
- body/document scroll: none

## Browser Use

Browser Use execution tool is not exposed in this Codex session. Playwright fallback is used with screenshots and telemetry.

## Remaining Risk

`facility_research_shelf` currently reuses existing generated workbench raster as a temporary runtime stand-in. Dedicated research shelf raster/provenance remains a follow-up asset WorkUnit.
