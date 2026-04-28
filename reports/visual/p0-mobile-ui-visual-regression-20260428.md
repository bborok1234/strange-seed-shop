# P0 Mobile UI + Playwright Visual Regression Evidence — 2026-04-28

Issue: #95

## 문제 재현

사용자 실기 스크린샷에서 모바일 도감 탭이 정원 밭 위에 어중간한 half overlay로 떠 있고, 화면 전체가 모바일 게임 tab screen처럼 읽히지 않는 문제가 확인되었다.

## 변경된 기준

- 모바일 하단 탭은 **정원 위 floating panel**이 아니라 **한 화면 tab screen**으로 전환한다.
- 모바일 body/document scroll은 금지한다. 긴 목록은 탭 screen 내부에서만 스크롤한다.
- 데스크톱은 외부 대시보드 오른쪽 패널이 아니라 `.garden-stage` 내부 split surface로만 탭 상세를 표시한다.
- Playwright CLI가 393x852 mobile garden + seeds/album/expedition/shop tab screen, 1280x900 desktop layout regression을 CI에서 검증한다.

## Fresh evidence

- Mobile garden Playwright screenshot: `reports/visual/p0-mobile-garden-playfield-playwright-20260428.png`
- Mobile tab Playwright screenshot: `reports/visual/p0-mobile-tab-screen-playwright-20260428.png`
- Desktop Playwright screenshot: `reports/visual/p0-desktop-in-stage-album-playwright-20260428.png`
- Command: `npm run check:visual`
- Result: 6 passed

## Remaining visual risk

- 도감 card art direction과 micro-interaction polish는 아직 P0 quality target에 비해 부족하다. 이번 PR은 먼저 모바일 screen architecture와 회귀 게이트를 잠그는 작업이다.
- 다음 루프는 Phaser playfield/캐릭터 presentation, 탭별 game UI skinning, mobile first CTA hierarchy를 더 강하게 다듬어야 한다.
