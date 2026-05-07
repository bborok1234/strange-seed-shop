# #434 Phaser 신규 정원 감상 모드와 HUD 접기 visual report

## Summary

Phaser v1 board에 `감상/관리` mode toggle을 추가했다. 감상 모드는 top resource chips와 `관리` 버튼만 남기고 objective/action rail을 접으며, board render layer를 pull-back 배치해 정원과 slot이 더 많이 보이게 한다.

## Evidence

- Fresh start: `reports/visual/issue-0434-phaser-garden-view-mode/phaser-check-fresh-start-393.png`
- Overview mode: `reports/visual/issue-0434-phaser-garden-view-mode/phaser-check-overview-mode-393.png`
- Manage return: `reports/visual/issue-0434-phaser-garden-view-mode/phaser-check-manage-return-393.png`
- Full storage loop final: `reports/visual/issue-0434-phaser-garden-view-mode/phaser-check-storage-claimed-393.png`

## Verification

- `npm run check:phaser`: PASS
- viewport: 393x852
- `overviewMode.viewMode`: `overview`
- `overviewMode.hudCollapsed`: `true`
- `overviewMode.actionRailDisplay`: `none`
- `overviewMode.objectiveDisplay`: `none`
- `manageReturn.viewMode`: `manage`
- `manageReturn.hudCollapsed`: `false`
- body/document scroll: none

## Browser Use

Browser Use execution tool is not exposed in this Codex session. Playwright fallback is used with screenshots and canvas/HUD telemetry.

## Remaining Risk

감상 모드는 아직 decoration editing이나 screenshot/share export를 제공하지 않는다. 이 PR은 low-chrome view mode foundation만 추가한다.
