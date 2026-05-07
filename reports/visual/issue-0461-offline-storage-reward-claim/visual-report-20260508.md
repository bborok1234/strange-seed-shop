# Issue #461 Visual Report

## 범위

Phaser v1 보관 바구니 오프라인 잎 회수.

## Browser Use

Browser Use `iab` backend는 현재 세션에서 직접 노출되지 않았다. `tool_search`로 Browser Use와 Node REPL 도구를 확인했지만 Browser Use 실행 도구가 노출되지 않아 Playwright 기반 `npm run check:phaser`를 fallback evidence로 사용했다.

## 검증 결과

- 명령: `npm run check:phaser`
- 결과: pass
- viewport: 393 x 852
- canvas: 1개
- body/document scroll: 없음
- leaves: `20`
- completedDeliveries: `2`
- orderCrateProgress: `25`
- storageCapacity: `24`
- storedLeaves: `0`
- objective: `보관 잎 회수 완료 · 오프라인 보관 0/24`
- receipts: `오프라인 보관 회수 · 잎 +4`, `보관 +4/24`

## 스크린샷

- Storage buffer selected: `reports/visual/issue-0461-offline-storage-reward-claim/phaser-check-storage-buffer-393.png`
- Storage claimed: `reports/visual/issue-0461-offline-storage-reward-claim/phaser-check-storage-claimed-393.png`

## 판정

통과. Storage buffer가 `오프라인 보관 4/24`에서 `회수` action을 통해 잎으로 이전되고, 회수 후 `오프라인 보관 0/24` 상태가 보인다. Runtime image generation/API/cache 호출은 없다.
