#457 진행 evidence

## 구현 요약

- 두 번째 주문 납품 후 `보관 바구니` 선택 시 `정리 80잎` action이 뜨도록 연결했습니다.
- unlock 시 leaves 80을 소모하고 `facility_storage`를 unlocked/active, level 1로 전환합니다.
- storage capacity test surface를 `12 -> 24`로 올리고, HUD/objective/receipt에 `오프라인 보관 24`를 표시합니다.

## Visual evidence

- Report: `reports/visual/issue-0457-storage-basket-unlock-affordance/visual-report-20260508.md`
- Storage ready: `reports/visual/issue-0457-storage-basket-unlock-affordance/phaser-check-storage-ready-393.png`
- Storage unlocked: `reports/visual/issue-0457-storage-basket-unlock-affordance/phaser-check-storage-unlocked-393.png`

## 검증

- `npm run check:phaser` PASS
- `npm run check:ci` PASS
- `npm run check:control-room` PASS
- `npm run check:ops-live` PASS
- `git diff --check` PASS

## Browser Use

Browser Use `iab` backend는 현재 세션에서 노출되지 않아 Playwright fallback evidence로 대체했습니다.
