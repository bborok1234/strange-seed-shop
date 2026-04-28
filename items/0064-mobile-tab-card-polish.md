# Item 0064 — 모바일 탭 화면 수집 게임 카드 UI polish

Status: active
Work type: game_ui
Issue: #111
Date: 2026-04-29

## Small win

모바일 seeds/album 탭이 단순 웹 패널이 아니라 “수집 게임 안 메뉴”처럼 읽히도록 카드 헤더, 목표 CTA, 발견/잠금 카드의 hierarchy와 장식을 정리한다. full-screen tab 정책과 body scroll 없음은 유지한다.

## Plan

1. 현재 탭 UI 구조를 확인한다.
   - `src/App.tsx`의 `renderSeedsPanel`, `renderAlbumPanel`, player-panel markup을 읽는다.
   - `src/styles.css`의 `.player-panel`, seed/album/card 관련 selector를 확인한다.
2. 변경 범위를 모바일 탭 카드 presentation으로 제한한다.
   - 저장 구조, 경제 값, 콘텐츠 schema, analytics event 이름은 변경하지 않는다.
   - 탭 화면 layout policy(상단부터 bottom nav 위까지 fixed full-screen, body scroll 없음, garden pointer-events 차단)는 유지한다.
3. seeds/album 탭의 게임 UI 감각을 개선한다.
   - 상단 header를 “메뉴 title + 진행/목표 chip” 구조로 더 선명하게 한다.
   - next-goal/CTA card를 더 prominent하게 하고 collection cue를 강화한다.
   - locked/discovered 카드에는 soft frame, rarity/family chip, silhouette/portrait treatment를 정리한다.
4. Playwright visual gate와 evidence를 갱신한다.
   - 기존 tab screen regression은 유지한다.
   - 393px seeds/album screenshot artifact를 evidence로 저장한다.
   - 필요한 경우 `scripts/check-p0-game-ui-ux.mjs`에 item/report/screenshot phrase를 추가한다.
5. 검증을 실행한다.
   - `npm run check:visual`
   - `npm run check:p0-ui-ux`
   - `npm run check:all`

## 수용 기준

- [x] 모바일 seeds 탭이 한눈에 “씨앗 주머니/다음 수집 목표”로 읽힌다.
- [x] 모바일 album 탭이 발견/미발견 collection board처럼 읽힌다.
- [x] body scroll 없음, full tab screen, bottom nav 고정, garden touch 차단이 유지된다.
- [x] mobile visual evidence와 `npm run check:all` 결과가 남는다.

## 금지 범위

저장 구조, 경제 값, 콘텐츠 schema, analytics event 이름, 실제 결제/로그인/광고/외부 배포/runtime image generation/credential은 변경하지 않는다.
