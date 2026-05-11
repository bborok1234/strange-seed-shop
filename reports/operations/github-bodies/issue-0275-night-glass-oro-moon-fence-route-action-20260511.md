## 요약

#516/#517 이후 `밤유리 오로 합류`가 preview 문구에서 멈추지 않도록, 플레이어가 직접 누르는 `월정 문 단서 보기` action과 `expedition_moon_fence_locked` locked route preview state를 Phaser playable loop에 연결한다.

## 배경

- 이전 완료: Issue #516, PR #517, main CI `25646641343`
- 현재 gap: `밤유리 오로 합류`와 다음 route id는 보이지만, 오로에게 다음 길을 묻거나 월정 문 단서를 확인하는 player verb가 없다.
- 경쟁작 production gap: idle/collection game은 rare 발견 이후 새 지역/탐사 단서를 직접 눌러 확인하게 만든다. route id preview에서 멈추면 D7/D30 progression silhouette가 약하다.

## Game Studio route

`game-studio:game-studio -> game-studio:phaser-2d-game -> game-studio:game-ui-frontend -> game-studio:game-playtest`

## Plan

1. `GardenState`에 moon fence route action/preview telemetry를 추가한다.
2. 오로 actor handoff 이후 action rail에 `월정 문 단서 보기`를 노출한다.
3. action 실행 시 locked route preview state, objective, receipt, HUD surface를 갱신한다.
4. checker에 route action click, telemetry, screenshot assertion을 추가한다.
5. Browser Use unavailable 시 blocker report와 Playwright fallback evidence를 남긴다.

## 수용 기준

- 오로 합류 후 `월정 문 단서 보기` action이 보인다.
- action 이후 `moonFenceRoutePreviewVisible=true`, `moonFenceRouteInspected=true`, `nightGlassOroRouteActionAvailable=false` telemetry가 남는다.
- 화면에는 `expedition_moon_fence_locked` locked route preview와 오로 handoff 맥락이 함께 보인다.
- `npm run check:phaser`, `npm run check:content`, `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:ci`, `git diff --check`가 통과한다.

## 안전 범위

- Phaser local state/action/render/checker와 운영 evidence만 변경한다.
- runtime image generation/API/cache 호출 없음.
- 새 accepted manifest asset은 추가하지 않는다.

## 리스크

- existing expedition gate art만으로 locked moon fence route가 약하면 dedicated route marker asset WorkUnit이 필요하다.
