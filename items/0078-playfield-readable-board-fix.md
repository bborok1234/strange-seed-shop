# Playfield readable board fix

Status: active
Work type: game_ui
Branch: `codex/0078-playfield-readable-board-fix`

## 문제 / 배경

#138 이후 정원 playfield에서 밭을 나누지 않는 애매한 흰 세로 band가 남았다. 이 선은 plot 경계도, gameplay affordance도 아니며 개발용 grid/debug overlay처럼 보인다. 또한 canvas 위 text 대비가 낮아 `첫 밭`, `빈 자리`, 자동 생산 status가 QA screenshot에서 읽기 어렵다.

## Small win

정원 첫 화면의 board가 단일한 불투명 게임 판으로 보이고, 열린 밭 2개와 자동 생산 status만 명확히 읽힌다. 애매한 세로/가로 artifact는 보이지 않는다.

## Plan

1. Browser Use로 현재 화면을 직접 확인하고 문제 artifact를 기준으로 잡는다.
2. locked 3x3 grid와 canvas board 장식에 의존하지 않도록 player-visible board를 React/CSS overlay로 분리한다.
3. Phaser canvas는 입력/이벤트 runtime만 유지하고, 제품 화면의 plot/status text는 CSS surface로 명확히 렌더링한다.
4. Browser Use screenshot evidence와 focused visual/build 검증을 남긴다.

## 수용 기준

- 애매한 흰 세로 band가 Browser Use screenshot에서 보이지 않는다.
- 열린 plot 2개가 어떤 밭인지 명확히 보인다.
- `자동 생산 +7.2/분 · 주문 0/12`, `첫 밭`, `2번 밭`, `빈 자리`가 모바일 화면에서 읽힌다.
- Phaser click/telemetry visual test가 계속 통과한다.

## 검증 명령

- Browser Use QA: `http://127.0.0.1:5175/?qaProductionReady=1`
- `npm run build`
- `npm run check:visual -- --grep "모바일 정원 393px|모바일 성장 밭 탭|모바일 자동 생산과 첫 주문"`

## Evidence

- Browser Use screenshot: `reports/visual/p0-playfield-readable-board-fix-browser-use-20260429.png`
- `npm run build` PASS
- `npm run check:ci` PASS
- `npm run check:visual -- --grep "모바일 정원 393px|모바일 성장 밭 탭|모바일 자동 생산과 첫 주문"` PASS
- `npm run check:visual` PASS, 13 passed in 46.6s
