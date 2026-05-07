#459 진행 evidence

## 구현 요약

- `storedLeaves`를 추가하고 storage unlock 이후 작업대 수령이 `보관 +4/24`를 쌓도록 연결했습니다.
- Storage 선택 HUD/objective가 `오프라인 보관 4/24`를 보여줍니다.
- smoke verifier가 storage unlock -> workbench claim -> storage selected buffer까지 확인합니다.

## Visual evidence

- Report: `reports/visual/issue-0459-storage-buffer-production-fill/visual-report-20260508.md`
- Fill claim: `reports/visual/issue-0459-storage-buffer-production-fill/phaser-check-storage-fill-claim-393.png`
- Buffer selected: `reports/visual/issue-0459-storage-buffer-production-fill/phaser-check-storage-buffer-393.png`

## 검증

- `npm run check:phaser` PASS
- `npm run check:ci` PASS
- `npm run check:control-room` PASS
- `npm run check:ops-live` PASS
- `git diff --check` PASS

## Browser Use

Browser Use `iab` backend는 현재 세션에서 노출되지 않아 Playwright fallback evidence로 대체했습니다.
