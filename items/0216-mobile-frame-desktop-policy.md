# 0216 모바일 game frame 데스크톱 강제 정책

Status: review
Owner: Codex
Date: 2026-05-06
Issue: #414 — https://github.com/bborok1234/strange-seed-shop/issues/414

## 문제 / 배경

사용자 제보 화면에서 데스크톱 정원은 별도 rail/dock shell 때문에 실제 게임 화면이 깨졌다. 모바일 정원은 같은 콘텐츠가 상대적으로 낫지만 밭 marker, plot label, 자동 생산 actor 배치가 아직 한 장면의 게임 화면으로 덜 읽힌다.

별도 데스크톱 shell은 현재 production bar를 통과하지 못한다. 모바일 세로 game frame을 단일 UI/UX 기준으로 삼고, 데스크톱 브라우저에서도 중앙 모바일 프레임으로 렌더해 유지보수와 QA 표면을 줄인다.

## Plan

1. Game Studio route: `game-studio:game-ui-frontend` + `game-studio:game-playtest`.
2. 데스크톱 전용 rail/dock 렌더링을 끄고, 모든 playable viewport에서 같은 bottom tabs와 garden stage를 사용한다.
3. 1280px 이상에서도 `.desktop-shell`을 중앙 모바일 frame으로 제한하고 side dock/top-bar desktop hide 규칙을 무효화한다.
4. 모바일 frame 내부에서 plot label 가독성, plot row floor 위치, 자동 생산 support actor 배치를 조정한다.
5. `desktop-art-share` 회귀 테스트를 “데스크톱 전용 shell 보존”이 아니라 “데스크톱도 모바일 game frame 강제”로 갱신한다.
6. Browser Use `iab`를 먼저 시도하고, 연결 실패 시 blocker를 기록한 뒤 Playwright screenshot/regression으로 보조 검증한다.

## 수용 기준

- 1280/1600/1920 desktop viewport에서 `.desktop-shell` 폭이 모바일 frame 폭으로 제한된다.
- 데스크톱에서 `.side-dock`과 `.bottom-tabs.is-desktop-rail`이 보이지 않는다.
- 데스크톱에서도 5개 bottom tab이 모바일과 같은 위치/폭으로 보인다.
- `qaResearchExpeditionReady=1` 정원 화면에서 production lane, plot row, bottom action surface가 frame 안에서 겹치지 않는다.
- 모바일 393/360 기준에서 plot label이 marker 안에서 읽히고 support worker actor가 production card 밖으로 과하게 떠 보이지 않는다.

## 검증 명령

- Browser Use `iab` before/after screenshot: blocker 기록 (`reports/visual/issue-414-mobile-frame-desktop-policy/README.md`)
- `npx playwright test tests/visual/desktop-art-share.spec.ts` — 15 passed
- `npx playwright test tests/visual/p0-mobile-game-shell.spec.ts --grep "모바일 정원 (393|360)|모바일 생산 roster|짧은 모바일 브라우저에서도 생산 actor"` — 6 passed
- `npm run build` — pass

## Evidence

- `reports/visual/issue-414-mobile-frame-desktop-policy/playwright-desktop-1280-after-wait-20260506.png`
- `reports/visual/issue-414-mobile-frame-desktop-policy/playwright-mobile-393-after-wait-20260506.png`
- `reports/visual/issue-414-mobile-frame-desktop-policy/README.md`

## 안전 범위

- CSS/React viewport policy와 visual regression만 변경한다.
- 게임 경제, save schema, asset manifest는 변경하지 않는다.
- 결제/배포/고객 데이터 없음.
