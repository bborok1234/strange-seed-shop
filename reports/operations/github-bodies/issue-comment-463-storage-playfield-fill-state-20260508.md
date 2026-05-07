## 구현/검증 evidence

- 구현: 보관 바구니 facility가 unlocked이면 playfield 위에 fill bar/chip을 렌더링한다.
- State: `__seedGardenStorageFillRatio`를 smoke verifier에 노출해 `4/24` before claim, `0` after claim을 검증했다.
- Visual evidence: `reports/visual/issue-0463-storage-playfield-fill-state/phaser-check-storage-buffer-393.png`, `reports/visual/issue-0463-storage-playfield-fill-state/phaser-check-storage-claimed-393.png`
- Visual report: `reports/visual/issue-0463-storage-playfield-fill-state/visual-report-20260508.md`

## 검증

- `npm run check:phaser` PASS
- `npm run check:ci` PASS
- `npm run check:control-room` PASS
- `npm run check:ops-live` PASS
- `git diff --check` PASS

## Browser Use

Browser Use `iab` backend는 현재 세션에서 직접 노출되지 않았다. `tool_search`로 Browser Use/Node REPL 도구를 확인했고, Browser Use 실행 도구가 없어 `npm run check:phaser` Playwright fallback screenshot을 사용했다.

## 남은 위험

보관 바구니는 아직 dedicated storage raster가 아니라 order crate fallback texture를 사용한다. OPENAI_API_KEY/SEED_ASSET_IMAGE_MODEL이 없어 dedicated storage raster generation은 별도 asset WorkUnit에서 처리해야 한다.
