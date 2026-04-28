# 브라우저 QA 절차

## 원칙

이 프로젝트의 로컬 브라우저 검증은 Codex Browser Use 플러그인을 1순위로 사용한다.

기본 경로:

1. `browser-use:browser` 스킬을 읽고 따른다.
2. Node REPL에서 Browser Use 런타임을 `iab` backend로 초기화한다.
3. 로컬 앱을 `http://127.0.0.1:3000/`에서 연다.
4. DOM snapshot, 클릭, 스크린샷을 통해 실제 사용자 화면 기준으로 확인한다.
5. 중요한 증거는 `reports/visual/`에 저장하고 로드맵 또는 수용 기준 문서에 연결한다.


## 2026-04-28 P0 실기 QA 운영 결정

사용자 피드백에 따라 P0의 반복 가능한 실기 QA는 Browser Use 단일 의존이 아니라 다층 구조로 운영한다.

1. Browser Use가 세션에 노출되면 우선 사용한다.
2. Browser Use가 차단되면 blocker report를 남기고 Computer Use 또는 Chrome DevTools Protocol 캡처를 fallback으로 사용한다.
3. PR/CI의 반복 게이트는 토큰 효율을 위해 CLI 기반 screenshot/layout checker를 기본으로 한다.
4. 2026-04-28 사용자 승인 후 `@playwright/test`를 도입했고, `npm run check:visual`을 CI의 반복 gate로 사용한다. 현재 gate는 pixel baseline보다 먼저 mobile/desktop layout regression과 screenshot artifact를 고정한다.
5. UI 변경 PR은 최소 mobile/desktop screenshot path, 확인 viewport, 남은 시각 리스크를 PR 본문에 적는다.

Current P0 issue: #95
Research: `docs/GAME_UI_UX_RESEARCH_20260428.md`

## 폴백 기준

Browser Use를 시도하기 전에 별도 Computer Use, macOS `screencapture`를 기본 선택지로 쓰지 않는다. 단, CI/반복 회귀 목적의 Playwright CLI는 사용자 승인된 기본 gate다.

폴백은 아래 중 하나가 명확할 때만 허용한다.

- Browser Use 플러그인 또는 `scripts/browser-client.mjs`가 없다.
- Node REPL `js` 실행 도구가 노출되지 않는다.
- Browser Use 런타임이 로컬 앱에 접근하지 못하며, 에러가 재시도 후에도 재현된다.
- CI처럼 Codex in-app browser가 없는 환경에서 자동 검증이 필요하다.
- 정확한 viewport 크기 지정이 필요한 경우에는 `npm run capture:local -- <url> <output> <width> <height>`로 Chrome DevTools Protocol 캡처를 사용한다.

## 2026-04-28 Browser Use `iab` 복구 진단

Issue #18에서 Browser Use `iab` backend 직접 검증을 다시 시도했다. Browser Use plugin의 `scripts/browser-client.mjs` 파일은 존재하지만, 현재 callable tool 표면에는 skill이 요구하는 Node REPL `js` 실행 tool(`mcp__node_repl__js` 또는 동등 tool)이 노출되지 않았다. 대체로 사용 가능한 `functions.js_repl`은 plugin module import 중 static `node:os` import 제한으로 bootstrap에 실패했다.

따라서 이번 검증은 `reports/visual/browser-use-iab-runtime-diagnostic-20260428.md`에 환경 차단으로 기록하고, CDP fallback 캡처를 최신 Phaser playfield evidence로 저장했다. Browser Use 직접 검증은 Node REPL `js` tool이 노출되거나 Browser Use plugin이 현재 JS REPL 제한과 호환될 때 재시도한다.

- Diagnostic report: `reports/visual/browser-use-iab-runtime-diagnostic-20260428.md`
- CDP fallback mobile: `reports/visual/browser-use-iab-fallback-phaser-mobile-20260428.png`
- CDP fallback desktop: `reports/visual/browser-use-iab-fallback-phaser-desktop-20260428.png`

## 현재 검증 증거

- 2026-04-27: Browser Use `iab` backend로 `http://127.0.0.1:3000/` 접속 확인.
- 2026-04-27: 모바일 폭 스크린샷 저장: `reports/visual/browser-use-mobile-20260427.png`
- 2026-04-27: 페이지 제목 `이상한 씨앗상회` 확인.
- 2026-04-27: 스타터 씨앗 선택, 밭 탭 성장, 첫 수확, 도감 보상, 두 번째 밭 업그레이드, 원정 시작 클릭 플로우 확인.
- 2026-04-27: 클릭 플로우 후속 스크린샷 저장: `reports/visual/browser-use-click-flow-20260427.png`
- 2026-04-27: 개발 전용 `qaOfflineMinutes` URL 파라미터로 오프라인 복귀 보상 Browser Use 검증 완료.
- 2026-04-27: 오프라인 복귀 스크린샷 저장: `reports/visual/browser-use-offline-reward-20260427.png`
- 2026-04-27: Browser Use `iab` backend로 현재 main 앱 접속 재확인: `reports/visual/browser-use-main-20260427.png`
- 2026-04-27: Browser Use `iab` backend로 `qaReset=1` 접속 후 첫 씨앗 심기 미션 보상 수령 확인: `reports/visual/mission-reward-loop-20260427.png`
- 2026-04-27: Browser Use `iab` backend로 `qaOfflineMinutes=60` 접속 후 씨앗 3회 구매, buy-3 미션 보상 수령 확인: `reports/visual/seed-purchase-loop-20260427.png`
- 2026-04-27: Browser Use `iab` backend로 `qaExpeditionReady=1` 접속 후 원정 보상 수령 확인: `reports/visual/expedition-reward-loop-20260427.png`
- 2026-04-27: Browser Use `iab` backend로 하단 탭 전환과 mock 상점 CTA 렌더링 확인: `reports/visual/bottom-tab-surfaces-20260427.png`
- 2026-04-27: Chrome DevTools Protocol로 360x900 viewport 캡처 저장: `reports/visual/chrome-cdp-mobile-360-20260427.png`
- 2026-04-27: Chrome DevTools Protocol로 1280x900 viewport 캡처 저장: `reports/visual/chrome-cdp-desktop-1280-20260427.png`
- 2026-04-27: `npm run check:browser-qa`로 Browser Use 우선 원칙과 시각 QA 증거 파일 존재를 검증하도록 고정했다.
- 2026-04-27: Milestone 3.5 디자인 시스템 기반 UI rescue의 검증 기준을 `docs/DESIGN_SYSTEM.md`, `docs/UX_REVIEW_20260427.md`, `items/0015-design-system-foundation.md`에 고정했다.
- 2026-04-27: Browser Use `iab` backend로 `qaReset=1` 첫 세션 루프를 다시 확인했다. 스타터 씨앗 선택, 탭 성장, 수확, 도감 보상, 두 번째 밭 열기가 유지된다.
- 2026-04-27: Chrome DevTools Protocol로 360x800 garden viewport 캡처 저장: `reports/visual/design-system-mobile-360-20260427.png`
- 2026-04-27: Chrome DevTools Protocol로 1280x900 viewport 캡처 저장: `reports/visual/design-system-desktop-1280-20260427.png`
- 2026-04-27: Browser Use `iab` backend로 하단 5개 탭 전환과 상점 bottom sheet를 확인했다: `reports/visual/design-system-tabs-20260427.png`
- 2026-04-27: Browser Use `iab` backend로 상점 CTA 클릭 후 URL 무변경, 결제/외부 이동/계정 흐름 없음, raw `mock` 텍스트 미노출, 이벤트 카운트 +1을 확인했다: `reports/visual/design-system-shop-click-20260427.md`

- 2026-04-27: Phaser playfield 전환 작업에서는 `browser-use:browser` 스킬을 먼저 읽었으나 현재 도구 표면에 Node REPL `js` 실행 도구가 노출되지 않아 폴백 사유를 기록했다: `reports/visual/phaser-browser-use-fallback-20260427.md`
- 2026-04-27: Chrome DevTools Protocol로 Phaser playfield 360x900 viewport 캡처 저장: `reports/visual/phaser-playfield-mobile-360-20260427.png`
- 2026-04-27: Chrome DevTools Protocol로 Phaser playfield 1280x900 viewport 캡처 저장: `reports/visual/phaser-playfield-desktop-1280-20260427.png`
- 2026-04-27: Chrome DevTools Protocol로 Phaser playfield 첫 loop 이후 캡처 저장: `reports/visual/phaser-playfield-after-loop-20260427.png`

- 2026-04-28: Browser Use `iab` backend 직접 복구를 재시도했으나 Node REPL `js` 실행 tool 미노출과 `functions.js_repl` static `node:os` import 제한으로 환경 차단을 기록했다: `reports/visual/browser-use-iab-runtime-diagnostic-20260428.md`
- 2026-04-28: Chrome DevTools Protocol로 Browser Use fallback Phaser playfield 360x900 캡처 저장: `reports/visual/browser-use-iab-fallback-phaser-mobile-20260428.png`
- 2026-04-28: Chrome DevTools Protocol로 Browser Use fallback Phaser playfield 1280x900 캡처 저장: `reports/visual/browser-use-iab-fallback-phaser-desktop-20260428.png`


- 2026-04-28: P0 UI/UX rescue에서 CDP CLI로 before/after mobile/desktop evidence를 저장했다: `reports/visual/p0-ui-ux-rescue-20260428.md`, `reports/visual/p0-ui-ux-before-main-mobile-20260428.png`, `reports/visual/p0-ui-ux-after-mobile-20260428.png`, `reports/visual/p0-ui-ux-after-desktop-20260428.png`.


- 2026-04-28: P0 asset alpha cutout 후 harvest reveal과 album context에서 체커보드 배경이 사라진 것을 CDP CLI로 확인했다: `reports/visual/p0-alpha-cutout-harvest-reveal-20260428.png`, `reports/visual/p0-alpha-cutout-album-20260428.png`.

- 2026-04-28: Playwright CLI visual/layout regression을 추가했다. `npm run check:visual`은 393x852 모바일 도감 tab screen과 1280x900 데스크톱 in-stage split을 검증하고 screenshot artifact를 남긴다: `reports/visual/p0-mobile-ui-visual-regression-20260428.md`, `reports/visual/p0-mobile-tab-screen-playwright-20260428.png`, `reports/visual/p0-desktop-in-stage-album-playwright-20260428.png`.

- 2026-04-28: 모바일 정원 HUD/action card polish 후 개발 라벨 미노출과 393/375/360px action card 내부 스크롤 없음이 Playwright gate에 추가되었다: `reports/visual/p0-mobile-garden-hud-polish-20260428.md`, `reports/visual/p0-mobile-garden-hud-polish-mobile-20260428.png`, `reports/visual/p0-mobile-garden-hud-polish-mobile-360-20260428.png`, `reports/visual/p0-mobile-garden-hud-polish-desktop-20260428.png`.

- 2026-04-28: Phaser playfield presentation polish 후 ready/locked/empty plot 상태를 더 선명하게 구분한 screenshot evidence를 저장했다: `reports/visual/p0-playfield-presentation-polish-20260428.md`, `reports/visual/p0-playfield-presentation-polish-mobile-393-20260428.png`, `reports/visual/p0-playfield-presentation-polish-mobile-375-20260428.png`, `reports/visual/p0-playfield-presentation-polish-mobile-360-20260428.png`, `reports/visual/p0-playfield-presentation-polish-desktop-20260428.png`.

## 남은 QA

- Browser Use 직접 검증은 Node REPL `js` execution tool이 세션에 노출되면 재시도한다.
- 그 전까지는 Browser Use skill을 먼저 읽고 `reports/visual/` blocker report를 남긴 뒤에만 CDP fallback을 허용한다.
- 다음 QA는 새 게임 시스템, 저장 구조, 콘텐츠 schema, analytics event 이름을 변경하는 작업이 생길 때 갱신한다.
