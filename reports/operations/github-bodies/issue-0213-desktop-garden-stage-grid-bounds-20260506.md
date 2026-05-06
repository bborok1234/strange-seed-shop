## 요약

데스크톱 정원에서 stage가 desktop grid track 밖으로 밀려 rail/dock/action 정보를 덮는 회귀를 복구한다.

## 사용자/운영자 가치

사용자가 `http://127.0.0.1:4173/?qaProductionReady=1` desktop 화면에서 정원이 이상하게 잘리고, 밭/텍스트/action 정보 위치가 어긋난다고 보고했다. 첫 화면 production state가 깨져 보이면 이전 asset/HUD 작업의 의미가 사라진다.

## Before / Visual evidence

- 사용자 in-app browser screenshot
- 로컬 재현: `reports/visual/desktop-garden-weird-before-1280x800-20260506.png`

## Game Studio route

`game-studio:game-studio` -> `game-studio:game-ui-frontend` -> `game-studio:game-playtest`

## Plan

1. Browser Use `iab`로 현재 앱 탭을 reload하고 visible state를 남긴다.
2. desktop viewport에서 `.desktop-shell`, `.bottom-tabs.is-desktop-rail`, `.garden-stage`, `.side-dock`, `.garden-playfield-host` bounds를 재현한다.
3. `.garden-stage`가 playable-focus fixed width를 desktop grid 안에서 유지하는 cascade를 수정한다.
4. `desktop-art-share`에 stage bounds regression을 추가한다.
5. after screenshot과 focused visual regression으로 검증한다.

## 검증

- Browser Use `iab` screenshot
- focused desktop visual regression
- 필요 시 `npm run check:art-share`

## 안전 범위

CSS layout/cascade와 visual regression만 변경한다. 새 asset generation, save migration, payment/external deployment는 scope 밖이다.
