# P0 Game UI/UX rescue와 CLI 실기 QA 게이트

Status: in_progress
Owner: agent
Created: 2026-04-28
Updated: 2026-04-28
Scope-risk: moderate
Work type: game_feature
Issue: #89
Branch: codex/p0-game-ui-ux-rescue

## Intent

현재 게임은 기능적으로 첫 루프를 수행하지만, 사용자 제공 스크린샷 기준으로 안내 문구와 React 패널이 Phaser 정원을 가리고, debug panel과 배경이 박힌 에셋이 몰입을 깨뜨린다. P0를 “작동하는 앱”이 아니라 “첫 화면이 게임처럼 보이고 자동화가 실기 QA로 회귀를 잡는 상태”로 재정의한다.

## Acceptance Criteria

- `docs/GAME_UI_UX_RESEARCH_20260428.md`에 게임 UI/HUD/Phaser scaling/CLI visual QA/alpha asset 리서치와 프로젝트 결정을 기록한다.
- `docs/ROADMAP.md`에 P0 Game Studio Operating Mode 마일스톤이 추가되고 current next action이 #89로 갱신된다.
- 정원 기본 화면에서 하단/안내 패널이 밭을 가리지 않는다.
- debug panel은 기본 playable 화면에서 숨겨지고 debug mode에서만 나타난다.
- 모바일/데스크톱 visual evidence가 `reports/visual/`에 저장된다.
- asset alpha/background quality checker가 creature/seed/icon의 alpha 필요 조건 또는 명시 예외를 검증한다.
- `npm run check:all` 또는 P0 관련 검증 subset이 통과한다.

## Evidence

- Visual report: `reports/visual/p0-ui-ux-rescue-20260428.md`
- Before mobile: `reports/visual/p0-ui-ux-before-main-mobile-20260428.png`
- After mobile: `reports/visual/p0-ui-ux-after-mobile-20260428.png`
- After desktop: `reports/visual/p0-ui-ux-after-desktop-20260428.png`
- 사용자 제공 screenshot: 정원 overlay/panel overlap, debug panel 노출, checkerboard 배경 에셋 노출.
- Research: `docs/GAME_UI_UX_RESEARCH_20260428.md`
- Context snapshot: `.omx/context/game-ui-ux-p0-rescue-20260428T123300Z.md`

## Proposed Plan

1. 리서치 문서와 roadmap P0 milestone을 추가한다.
2. playable/debug 화면 분리와 정원 panel 축소를 구현한다.
3. Phaser overlay text를 줄이고 plot touch area를 보호한다.
4. CLI visual/layout checker와 asset alpha checker를 추가한다.
5. CDP screenshot before/after evidence를 저장한다.
6. PR을 만들고 CI/검증 결과를 연결한다.

## Apply Conditions

- 저장 데이터 구조, content schema, economy values, analytics event 이름을 바꾸지 않는다.
- 실제 결제/로그인/광고/외부 배포/고객 데이터/런타임 이미지 생성은 범위 밖이다.
- Playwright dependency 설치는 별도 명시 승인 전 하지 않는다.

## Verification

- `npm run check:content`
- `npm run check:loop`
- `npm run check:asset-normalization`
- 신규 layout/visual checker
- `npm run check:browser-qa`
- `npm run build`
- CDP screenshot evidence
