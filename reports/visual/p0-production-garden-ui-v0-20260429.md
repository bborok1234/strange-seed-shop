# P0 production garden UI v0 visual evidence

Status: pass
Owner: agent
Date: 2026-04-29
Issue: #123
Item: `items/0070-production-garden-ui-v0.md`

## Scope

P0.5 idle core creative rescue의 production garden UI v0 검증이다. #121의 자동 생산/첫 주문 UI를 완료 상태에서 compact row로 접어, 다음 수집 목표가 모바일 정원 첫 화면 안에서 함께 읽히는지 확인했다.

## Evidence

- Mobile 393x852 screenshot: `reports/visual/p0-production-garden-ui-v0-mobile-20260429.png`
- Playwright artifact source: `test-results/p0-mobile-game-shell-모바일-자-3ca07-주문은-수령과-납품-CTA를-한-화면에서-검증한다/mobile-production-order-v0-393.png`

## Verification

- `npm run check:loop` — pass
- `npm run build` — pass
- `npm run check:visual` — pass, 13 tests

## Remaining Risk

정원 첫 화면은 더 생산 엔진처럼 읽히지만 아직 새 gameplay asset이 없다. creature work/celebrate 상태, order crate, reward FX는 `Core asset batch v0` 후속 issue에서 다룬다.
