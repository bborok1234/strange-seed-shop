## 구현/검증 evidence

- 구현: `claimStoredLeaves`가 `storedLeaves`를 잎으로 이전하고 storage를 0으로 비운다.
- UI/HUD: 보관 바구니 selected action rail에 `회수` action을 추가했다.
- Visual evidence: `reports/visual/issue-0461-offline-storage-reward-claim/phaser-check-storage-claimed-393.png`
- Visual report: `reports/visual/issue-0461-offline-storage-reward-claim/visual-report-20260508.md`

## 검증

- `npm run check:phaser` PASS
- `npm run check:ci` PASS
- `npm run check:control-room` PASS
- `npm run check:ops-live` PASS
- `git diff --check` PASS

## Browser Use

Browser Use `iab` backend는 현재 세션에서 직접 노출되지 않았다. `tool_search`로 Browser Use/Node REPL 도구를 확인했고, Browser Use 실행 도구가 없어 `npm run check:phaser` Playwright fallback screenshot을 사용했다.

## 남은 위험

보관 바구니는 아직 dedicated storage raster가 아니라 order crate fallback texture를 사용한다. 다음 WorkUnit에서 dedicated storage raster 또는 storage claim FX를 우선 후보로 둔다.
