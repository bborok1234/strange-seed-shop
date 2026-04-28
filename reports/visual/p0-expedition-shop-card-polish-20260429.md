# P0 Expedition/Shop Card Polish Evidence

Issue: #113
Item: `items/0065-expedition-shop-card-polish.md`
Branch: `p0-expedition-shop-card-polish-113`
Date: 2026-04-29

## Plan-first evidence

Plan artifact: `items/0065-expedition-shop-card-polish.md`

## Small win

모바일 expedition/shop 탭도 seeds/album 탭과 같은 게임 메뉴 카드 언어를 공유하도록 section heading, status chip, reward/mock safety chip, CTA hierarchy를 정리했다.

## 변경 요약

- expedition 탭: `원정 준비소` heading, 시작 가능/진행/완료 chip, reward preview card, unlock/progress card를 강화했다.
- shop 탭: `모의 상점` heading, `결제 없음` safety chip, 상품 card와 mock shop chip을 강화했다.
- 실제 결제/로그인/광고/외부 배포/credential 없이 mock click-intent만 유지했다.
- 기존 full-screen tab policy(body scroll 없음, bottom nav 고정, garden touch 차단)는 유지했다.

## Evidence screenshots

- Expedition tab mobile 393: `reports/visual/p0-expedition-shop-card-polish-expedition-393-20260429.png`
- Shop tab mobile 393: `reports/visual/p0-expedition-shop-card-polish-shop-393-20260429.png`

## Verification

- `npm run check:visual` — 12 passed.
- `npm run check:p0-ui-ux` — ok.
- `npm run check:all` — pass.

## Remaining visual risk

- P0 탭 카드 언어는 맞춰졌지만, 다음 단계에서는 아이콘/배지 전용 static art를 추가하면 상점과 원정의 게임성이 더 강해진다.
