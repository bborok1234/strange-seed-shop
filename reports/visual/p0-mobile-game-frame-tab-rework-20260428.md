# P0 Mobile Game Frame Tab Rework Evidence

Issue: #104
Item: `items/0060-mobile-game-frame-tab-rework.md`
Branch: `p0-mobile-game-frame-104`
Date: 2026-04-28

## 사용자 피드백

모바일 도감 화면이 밭 위에 어정쩡하게 겹치고, 세로로 길어진 패널/오른쪽 패널 감각이 남아 실제 모바일 게임 UI처럼 느껴지지 않는다는 피드백을 받았다.

## 적용한 변경

- 플레이어 탭 surface와 debug surface를 class/aria 수준에서 분리했다: `player-panel`, `debug-panel`.
- 모바일 non-garden 탭은 fixed full-screen surface로 고정했다: viewport top부터 bottom nav 위까지.
- non-garden 탭이 열리면 정원 top bar/playfield/background overlay는 hidden + pointer-events none 처리한다.
- 탭 화면에 compact game-screen header와 `정원 보기` CTA를 추가했다.
- Playwright visual gate가 panel top/left/right/bottom, body scroll, top hit-test, top-bar visibility를 검증한다.

## Evidence screenshots

- Mobile garden 360 no body scroll: `reports/visual/p0-mobile-game-frame-garden-360-20260428.png`
- Mobile album full-screen tab 393: `reports/visual/p0-mobile-game-frame-album-393-20260428.png`
- Mobile seeds full-screen tab 393: `reports/visual/p0-mobile-game-frame-seeds-393-20260428.png`
- Desktop in-stage album: `reports/visual/p0-mobile-game-frame-desktop-album-20260428.png`

## Verification

- `npm run check:visual` — 8 passed.

## Remaining visual risk

- 도감/씨앗 카드의 미려함은 아직 “기능 UI”에 가깝다. 이번 small win은 먼저 모바일 화면 구조와 회귀 게이트를 바로잡는 것이다.
- #103 첫 수확 reveal 보상감 polish와 별도 후속 UI art pass에서 카드 장식/모션/수집 보상감을 더 올린다.
