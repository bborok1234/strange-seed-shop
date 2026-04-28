# P0 Mobile Tab Card Polish Evidence

Issue: #111
Item: `items/0064-mobile-tab-card-polish.md`
Branch: `p0-mobile-tab-card-polish-111`
Date: 2026-04-29

## Plan-first evidence

Plan artifact: `items/0064-mobile-tab-card-polish.md`

## Small win

모바일 seeds/album 탭의 카드 header, progress chip, target highlight, album next-goal badge를 정리해 full-screen tab이 웹 패널보다 수집 게임 메뉴처럼 읽히게 했다.

## 변경 요약

- seeds 탭: `씨앗 보관함` header + 보유 chip, next collection target banner, target seed card highlight를 강화했다.
- album 탭: `수집 도감` header + 발견 progress chip, next candidate badge, album card frame을 강화했다.
- 기존 full-screen tab policy(body scroll 없음, bottom nav 고정, garden touch 차단)는 유지했다.

## Evidence screenshots

- Seeds tab mobile 393: `reports/visual/p0-mobile-tab-card-polish-seeds-393-20260429.png`
- Album tab mobile 393: `reports/visual/p0-mobile-tab-card-polish-album-393-20260429.png`

## Verification

- `npm run check:visual` — 12 passed.
- `npm run check:p0-ui-ux` — ok.
- `npm run check:all` — pass.

## Remaining visual risk

- expedition/shop 탭은 이번 small win의 직접 범위가 아니며, 다음 pass에서 같은 card language로 확장할 수 있다.
