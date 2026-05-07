# Issue #465 Visual Report

## 범위

Phaser v1 보관 잎 회수 reward motion.

## Browser Use

Browser Use `iab` backend는 현재 세션에서 직접 노출되지 않았다. `tool_search`로 Browser Use와 Node REPL 도구를 확인했지만 Browser Use 실행 도구가 노출되지 않아 Playwright 기반 `npm run check:phaser`를 fallback evidence로 사용했다.

## 검증 결과

- 명령: `npm run check:phaser`
- 결과: pass
- viewport: 393 x 852
- canvas: 1개
- body/document scroll: 없음
- `회수` 후 storage slot 위치에서 existing generated leaf flyout reward motion이 보임
- leaves: `20`
- storedLeaves: `0`
- storage fill ratio: `0`
- receipt: `오프라인 보관 회수 · 잎 +4`

## 스크린샷

- Storage claimed: `reports/visual/issue-0465-storage-claim-reward-motion/phaser-check-storage-claimed-393.png`

## 판정

통과. 보관 바구니 `회수` 후 storage slot 위치에서 leaf flyout reward motion이 보이고, 회수 state/receipt가 유지된다. Runtime image generation/API/cache 호출은 없다.
