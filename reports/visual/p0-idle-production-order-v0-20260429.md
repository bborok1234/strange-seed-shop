# P0 idle production + order v0 visual evidence

Status: pass
Owner: agent
Date: 2026-04-29
Issue: #121
Item: `items/0069-idle-production-order-v0.md`

## Scope

P0.5 idle core creative rescue의 첫 구현 slice로, 첫 수확 이후 생명체 자동 생산과 첫 주문 납품 CTA가 모바일 정원 화면에서 겹치지 않고 읽히는지 검증했다.

## Evidence

- Mobile 393x852 screenshot: `reports/visual/p0-idle-production-order-v0-mobile-20260429.png`
- Playwright artifact source: `test-results/p0-mobile-game-shell-모바일-자-3ca07-주문은-수령과-납품-CTA를-한-화면에서-검증한다/mobile-production-order-v0-393.png`

## Verification

- `npm run check:visual` — pass, 13 tests
- New gate: `qaProductionReady=1`에서 `생산 잎 수령` -> `첫 잎 주문 납품` -> `납품 완료`까지 검증

## Remaining Risk

이번 slice는 새 정적 에셋 없이 기존 portrait와 procedural UI만 사용한다. 생명체 work/celebrate 상태, 주문 상자, reward FX asset batch는 후속 issue에서 다룬다.
