# Item 0065 — 원정/상점 탭 게임 메뉴 카드 UI polish

Status: active
Work type: game_ui
Issue: #113
Date: 2026-04-29

## Small win

모바일 expedition/shop 탭도 seeds/album 탭과 같은 “게임 안 메뉴” 카드 언어를 공유한다. 원정은 보상/진행/잠금 상태가 명확하게 읽히고, 상점은 실제 결제가 아닌 mock intent임을 유지하면서 카드 hierarchy가 게임 상점처럼 보인다.

## Plan

1. 현재 expedition/shop 탭 markup과 스타일을 확인한다.
   - `src/App.tsx`의 `activeTab === "expedition"`, `activeTab === "shop"` 블록을 읽는다.
   - `src/styles.css`의 `.expedition-card`, `.expedition-preview`, `.shop-list`, `.shop-card`, `.mock-shop-note` 관련 selector를 확인한다.
2. 변경 범위를 presentation으로 제한한다.
   - 저장 구조, 경제 값, 콘텐츠 schema, analytics event 이름을 변경하지 않는다.
   - 실제 결제/로그인/광고/외부 배포/credential은 건드리지 않는다.
   - mock shop safety copy는 유지한다.
3. expedition/shop 탭을 #111의 tab card language와 맞춘다.
   - section heading/progress chip을 추가한다.
   - expedition reward/progress/locked card를 더 선명한 game card로 다듬는다.
   - shop card의 mock intent chip, CTA hierarchy, disabled/safety tone을 정리한다.
4. Playwright evidence를 저장한다.
   - 393px expedition/shop full-screen tab screenshot artifact를 `reports/visual/`에 저장한다.
   - `scripts/check-p0-game-ui-ux.mjs`, `docs/ROADMAP.md`, `docs/BROWSER_QA.md`를 갱신한다.
5. 검증을 실행한다.
   - `npm run check:visual`
   - `npm run check:p0-ui-ux`
   - `npm run check:all`

## 수용 기준

- [x] 모바일 expedition 탭이 보상/필요 조건/진행 상태 중심의 게임 카드로 읽힌다.
- [x] 모바일 shop 탭이 mock/click-intent 안전성을 유지하면서 게임 상점 카드로 읽힌다.
- [x] body scroll 없음, full tab screen, bottom nav 고정, garden touch 차단이 유지된다.
- [x] mobile visual evidence와 `npm run check:all` 결과가 남는다.

## 금지 범위

저장 구조, 경제 값, 콘텐츠 schema, analytics event 이름, 실제 결제/로그인/광고/외부 배포/runtime image generation/credential은 변경하지 않는다.
