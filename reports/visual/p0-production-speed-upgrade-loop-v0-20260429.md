# P0 Production speed upgrade loop v0

Date: 2026-04-29
Branch: `codex/0084-production-speed-upgrade-loop-v0`
Issue: #148
Route: `game-studio:game-studio` -> `game-studio:web-game-foundations`, `game-studio:game-ui-frontend`, `game-studio:game-playtest`

## 목적

North Star production bar의 “업그레이드 선택이 실제 성장 투자로 이어져야 한다” 기준을 적용했다. 첫 주문 납품 후 `작업 간식 강화`를 구매하면 `productionBoostLevel`이 저장되고 분당 생산량이 7.2에서 9.0으로 상승한다.

## Evidence

- Browser Use current tab QA: `reports/visual/p0-production-speed-upgrade-loop-v0-browser-use-20260429.png`
- Mobile 393 visual gate: `reports/visual/p0-production-speed-upgrade-loop-v0-20260429.png`
- Short 399x666 visual gate: `reports/visual/p0-production-speed-upgrade-loop-v0-short-399x666-20260429.png`

## Game Playtest Findings

- PASS: 첫 주문 납품 전 `생산 속도` 선택은 `첫 납품 후 열림`으로 보인다.
- PASS: 주문 납품 후 `작업 간식 강화`가 활성화된다.
- PASS: 구매 후 `강화 완료`와 `분당 9.0 잎`이 보인다.
- PASS: Browser Use current tab에서 boost 구매 후 `강화 완료`와 `분당 9.0 잎` count가 각각 1이다.
- PASS: 399x666 짧은 viewport에서도 action surface와 bottom tabs가 겹치지 않는다.
- 남은 위험: production speed upgrade는 v0 단일 단계다. 연구/다단계 업그레이드, 비용 곡선, 밸런싱은 후속 issue가 필요하다.

## Verification

- `npm run build` PASS
- `npm run check:visual -- --grep "생산 속도 업그레이드|짧은 모바일|모바일 자동 생산과 첫 주문"` PASS
- Browser Use in-app tab QA PASS (`http://127.0.0.1:5175/?qaProductionReady=1`, boost count 1, speed upgrade count 1)
- `npm run check:visual` PASS (15 passed)
- `npm run check:ci` PASS
