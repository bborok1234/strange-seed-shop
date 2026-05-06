## 요약

`docs/PRODUCTION_SLICE_READINESS.md`의 첫 blocking core slice인 `Bottleneck-readable production graph`를 구현합니다.

## Small win

정원 첫 화면에서 플레이어가 `생산 / 보관 / 납품` 중 무엇이 막혔는지 한 줄로 이해하고, action card에서 바로 추천 강화로 이어집니다.

## 사용자/운영자 가치

현재 플레이어 피드백의 핵심은 “화면은 있지만 idle game core가 정적이고 목표가 안 읽힌다”입니다. Egg, Inc. / Idle Miner Tycoon식 생산 병목 가독성을 이 게임의 첫 10분 loop에 맞게 가져와, 다음 행동이 단순 카드 목록이 아니라 생산 그래프의 병목 해결로 읽히게 합니다.

## Before / After 또는 Visual evidence

- Browser Use `iab`: attempted, backend unavailable; blocker recorded in visual report
- Before storage upgrade screenshot: `reports/visual/issue-416-bottleneck-production-graph/before-storage-393.png`
- After storage upgrade screenshot: `reports/visual/issue-416-bottleneck-production-graph/after-storage-393.png`
- Visual report: `reports/visual/issue-416-bottleneck-production-graph/visual-report-20260506.md`

## Playable mode

- URL: `http://127.0.0.1:4173/?qaBottleneckGraphReady=1`

## 작업 checklist

- [x] WorkUnit plan artifact 작성: `items/0221-bottleneck-readable-production-graph.md`
- [x] Game Studio route 기록
- [x] #413 stale sprite WorkUnit defer/close 기록
- [x] production graph 3축 view model 추가
- [x] first screen one-line summary 추가
- [x] action card 상세와 추천 storage upgrade 연결
- [x] storage upgrade numeric+prop payoff 추가
- [x] Browser Use blocker 또는 screenshot evidence 저장
- [x] focused mobile/desktop regression 추가

## 검증

- `npx playwright test --config playwright.config.ts tests/visual/p0-mobile-game-shell.spec.ts --grep "병목|자동 생산과 첫 주문"`: pass
- `npx playwright test --config playwright.config.ts tests/visual/desktop-art-share.spec.ts`: pass
- `npm run build`: pass
- `npm run check:ci`: pass

## 안전 범위

런타임 이미지 생성, 결제, 외부 배포, production user data, accepted SVG/vector game asset 추가는 하지 않습니다. 기존 raster asset과 DOM/playfield prop 상태를 사용합니다.
