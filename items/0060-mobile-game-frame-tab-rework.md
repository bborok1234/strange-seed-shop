# Item 0060 — 모바일 게임 프레임과 탭 화면 전면 리워크

Status: active
Issue: #104
Date: 2026-04-28

## Small win

모바일에서 도감/씨앗/원정/상점이 밭 위 half overlay나 오른쪽 패널처럼 보이지 않고, 하단 탭으로 전환되는 독립 game screen처럼 보이도록 고정한다.

## 범위

- `src/App.tsx`: 플레이어 탭 panel과 debug panel을 class/aria 수준에서 분리하고, 모바일 탭 화면 header를 추가한다.
- `src/styles.css`: 모바일 player panel을 fixed full-screen surface로 고정하고 정원 HUD/playfield를 숨긴다.
- `tests/visual/p0-mobile-game-shell.spec.ts`: panel top/left/right/bottom, body scroll, top hit-test, top-bar visibility를 자동 검증한다.
- `docs/DESIGN_SYSTEM.md`, `docs/GAME_UI_UX_RESEARCH_20260428.md`: mobile game frame contract를 문서화한다.

## 수용 기준

- [ ] 393/360px 모바일 non-garden 탭은 viewport top부터 bottom nav 위까지 고정된다.
- [ ] body/document scroll은 실패하고, 긴 목록은 tab screen 내부에서만 스크롤한다.
- [ ] 하단 탭은 48px 이상 터치 영역과 active state를 유지한다.
- [ ] 정원 HUD/playfield는 non-garden 탭 뒤에 비치거나 터치되지 않는다.
- [ ] screenshot evidence와 `npm run check:all` 결과를 남긴다.

## 제약

저장 구조, 경제 값, 콘텐츠 schema, analytics event 이름, 실제 결제/로그인/광고/외부 배포/runtime image generation은 변경하지 않는다.
