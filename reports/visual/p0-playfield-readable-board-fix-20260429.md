# P0 playfield readable board fix

Date: 2026-04-29
Branch: `codex/0078-playfield-readable-board-fix`
Item: `items/0078-playfield-readable-board-fix.md`

## 문제

정원 playfield에 plot 경계와 맞지 않는 애매한 흰 세로 band가 남아 있었다. 이 artifact는 gameplay 의미가 없고 개발용 grid/debug overlay처럼 보였다. 동시에 canvas text가 흐려 `첫 밭`, `빈 자리`, 자동 생산 status의 판독성이 낮았다.

## 수정

- player-visible board/plot/status를 React/CSS overlay로 분리했다.
- Phaser canvas는 입력/이벤트 runtime으로 유지하되 시각 레이어는 보이지 않게 했다.
- locked 3x3 grid를 첫 화면에 렌더링하지 않고 열린 plot만 보여준다.
- board background를 단일 불투명 surface로 고정했다.

## Browser Use evidence

- `reports/visual/p0-playfield-readable-board-fix-browser-use-20260429.png`

## 판정

PASS. Browser Use screenshot 기준으로 애매한 흰 세로 band가 사라졌고, 열린 plot과 자동 생산 status가 읽힌다.

## 검증

- `npm run build` PASS
- `npm run check:ci` PASS
- `npm run check:visual -- --grep "모바일 정원 393px|모바일 성장 밭 탭|모바일 자동 생산과 첫 주문"` PASS
- `npm run check:visual` PASS, 13 passed in 46.6s
