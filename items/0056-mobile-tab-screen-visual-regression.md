# P0 모바일 tab screen과 Playwright visual regression

Status: in_progress
Owner: agent
Created: 2026-04-28
Updated: 2026-04-28
Scope-risk: moderate
Work type: game_feature
Issue: #95
Branch: p0-mobile-ui-visual-regression

## Intent

사용자 실기 스크린샷에서 도감 탭이 모바일 정원 위에 어중간한 half overlay로 떠 있고, 밭/탭/목록이 서로 다른 게임 화면처럼 정리되지 않는 문제가 확인되었다. P0는 모바일 게임이므로 하단 탭은 웹 대시보드 패널이 아니라 한 viewport 안에서 전환되는 game tab screen이어야 한다. 이 회귀를 사람이 다시 screenshot으로 발견하기 전에 Playwright CLI가 잡도록 한다.

## Acceptance Criteria

- `@playwright/test`와 `npm run check:visual`이 추가된다.
- CI가 Playwright Chromium을 설치하고 full check 안에서 visual/layout regression을 실행한다.
- 모바일 393x852 씨앗/도감/원정/상점 탭에서 body/document scroll이 없고, 하단 nav 위의 tab screen 내부에서만 목록이 스크롤된다.
- 모바일 non-garden 탭에서 `.garden-panel`은 보이지 않고 pointer event를 받지 않는다.
- 데스크톱 1280x900에서 탭 상세는 `.garden-stage` 내부 split surface이며 외부 dashboard column이 아니다.
- mobile/desktop screenshot evidence와 visual report가 `reports/visual/`에 저장된다.

## Evidence

- Visual report: `reports/visual/p0-mobile-ui-visual-regression-20260428.md`
- Mobile garden: `reports/visual/p0-mobile-garden-playfield-playwright-20260428.png`
- Mobile tab: `reports/visual/p0-mobile-tab-screen-playwright-20260428.png`
- Desktop: `reports/visual/p0-desktop-in-stage-album-playwright-20260428.png`
- Test: `tests/visual/p0-mobile-game-shell.spec.ts`
- Context snapshot: `.omx/context/p0-mobile-ui-visual-regression-20260428T000000Z.md`

## Apply Conditions

- 실제 결제/로그인/광고/외부 배포/런타임 이미지 생성은 범위 밖이다.
- Playwright pixel snapshot baseline은 OS/font 안정화 후 별도 iteration으로 추가한다.
- 이번 작업은 tab screen architecture와 regression gate를 먼저 고정한다.

## Verification

- `npm run check:visual` (garden + seeds/album/expedition/shop + desktop split)
- `npm run check:p0-ui-ux`
- `npm run check:all`
