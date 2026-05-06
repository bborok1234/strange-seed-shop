# WorkUnit — 데스크톱 정원 stage grid overflow 복구

- ID: `0213`
- Status: review
- GitHub issue: #407 — https://github.com/bborok1234/strange-seed-shop/issues/407
- Draft PR: pending
- Source feedback: 사용자 in-app browser screenshot, `http://127.0.0.1:4173/?qaProductionReady=1`
- Game Studio route: `game-studio:game-studio` -> `game-studio:game-ui-frontend` -> `game-studio:game-playtest`
- Campaign source: P0.5 Idle Core + Creative Rescue

## Goal

데스크톱 정원에서 rail 옆 stage가 자기 grid track 밖으로 밀려나 dock/action 정보를 덮거나 잘리지 않게 한다. 사용자가 보고한 화면은 background art가 크게 잘리고, stage가 desktop shell을 넘어서면서 실제 진행 정보와 정원 객체가 이상한 위치로 보이는 회귀였다.

## Plan

1. Browser Use `iab`로 현재 in-app browser URL을 reload하고 visible state를 확인한다.
2. 사용자 screenshot과 같은 desktop breakpoint는 Playwright viewport로 재현해 `.desktop-shell`, `.bottom-tabs.is-desktop-rail`, `.garden-stage`, `.side-dock`, `.garden-playfield-host` 좌표를 기록한다.
3. CSS cascade에서 `.app-shell.playable-focus .garden-stage`의 fixed desktop width가 grid item width를 덮어쓰는 원인을 제거한다.
4. `desktop-art-share` visual regression에 stage/right-bound invariant를 추가해 rail, stage, dock 사이 overflow를 차단한다.
5. Browser Use screenshot과 desktop after screenshot을 evidence로 저장한다.

## Acceptance Criteria

- [x] desktop garden에서 `.garden-stage` left는 rail right 이후에 시작한다.
- [x] `.garden-stage` right는 `.desktop-shell` right를 넘지 않는다.
- [x] `.garden-playfield-host`도 stage bounds 안에 남는다.
- [x] `?qaProductionReady=1`에서 background/plot marker/production actor/action dock이 desktop에서 visible하다.
- [x] Browser Use `iab` reload + screenshot evidence가 있다.
- [x] focused desktop visual regression passes.
- [x] `npm run check:art-share`
- [x] `npm run build`

## Verification Notes

- Browser Use `iab` screenshot: `reports/visual/desktop-garden-weird-after-browseruse-20260506.png`
- Desktop before screenshot: `reports/visual/desktop-garden-weird-before-1280x800-20260506.png`
- Desktop after screenshot: `reports/visual/desktop-garden-weird-after-1280x800-wait-20260506.png`
- Desktop after metrics at 1280x800: shell right 1230, rail right 231, stage 231-947.4, dock 947.4-1229.
- `npx playwright test tests/visual/desktop-art-share.spec.ts --grep "desktop garden stage stays inside|production actor has visible idle motion|garden plot marker replaces" --config playwright.config.ts`: 9 passed.
- `npm run check:art-share`: 24 passed.
- `npm run build`: passed.

## Stop / Blocker Boundaries

- 새 asset generation은 scope 밖이다.
- 결제, 외부 배포, save migration은 scope 밖이다.
- 현재 수정은 layout/cascade + regression gate에 한정한다.
