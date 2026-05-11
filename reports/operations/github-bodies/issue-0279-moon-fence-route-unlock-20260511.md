## 요약

#524/#525 이후 `달빛 단서 2/2 ready`, `재료 3/3 ready`, `오로 explorer`가 모두 준비됐지만 실제 `월정 문 열기` action과 unlocked route state가 없다. `월정 문 열기` action을 추가해 `expedition_moon_fence_unlocked` route preview를 HUD/playfield/telemetry에 고정한다.

## 배경

- 이전 완료: Issue #524, PR #525, main CI `25648527223`
- 현재 gap: requirements-ready state가 unlock route로 전환되지 않는다.
- 경쟁작 production gap: locked requirement 완료 직후 route card와 unlocked marker가 보여야 한다.

## Game Studio route

`game-studio:game-studio -> game-studio:phaser-2d-game -> game-studio:game-ui-frontend -> game-studio:game-playtest`

## Plan

1. `GardenState`에 moon fence unlock availability/route unlocked/route id/marker telemetry를 추가한다.
2. clue/material/explorer ready 이후 action rail에 `월정 문 열기`를 노출한다.
3. action 실행 시 `expedition_moon_fence_unlocked` route preview와 unlocked marker를 표시한다.
4. checker에 unlock click, telemetry, HUD/objective, screenshot assertion을 추가한다.

## 수용 기준

- `달빛 단서 포장` 이후 `월정 문 열기` action이 보인다.
- action 이후 telemetry는 `moonFenceRouteUnlocked=true`, `moonFenceUnlockedRouteId=expedition_moon_fence_unlocked`를 남긴다.
- 화면에는 `월정 문 열림`, `달빛 단서 2/2 ready`, `재료 3/3 ready`, `오로 explorer`가 함께 보인다.
- `npm run check:phaser`, `npm run check:content`, `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:ci`, `git diff --check`가 통과한다.

## Visual evidence 계획

- `reports/visual/issue-0526-moon-fence-route-unlock/phaser-check-moon-fence-route-unlocked-393.png`
- `reports/visual/issue-0526-moon-fence-route-unlock/visual-report-20260511.md`
- Browser Use unavailable 시 current-session blocker report를 같은 폴더에 남긴다.

## 안전 범위

- Phaser local state/action/render/checker와 운영 evidence만 변경한다.
- runtime image generation/API/cache 호출 없음.
- 새 accepted manifest asset은 추가하지 않는다.
- 첫 월정 문 원정 출발/귀환/보상은 후속 slice로 분리한다.
