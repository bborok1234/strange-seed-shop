## 요약

#518/#519 이후 `expedition_moon_fence_locked`가 단순 locked preview로 멈추지 않도록, `개방 조건 보기` action과 월정 문 unlock requirements surface를 Phaser playable loop에 연결한다.

## 배경

- 이전 완료: Issue #518, PR #519, main CI `25647140548`
- 현재 gap: `월정 문 단서 확인` 후 어떤 조건을 모아야 열리는지 화면 state와 telemetry가 없다.
- 경쟁작 production gap: idle/collection game은 locked region을 보여준 뒤 요구 조건과 부족분을 바로 보여준다. 잠김 표식만 남으면 다음 수집/생산 목표가 약하다.

## Game Studio route

`game-studio:game-studio -> game-studio:phaser-2d-game -> game-studio:game-ui-frontend -> game-studio:game-playtest`

## Plan

1. `GardenState`에 moon fence requirements telemetry를 추가한다.
2. 월정 문 route inspection 이후 action rail에 `개방 조건 보기`를 노출한다.
3. action 실행 시 required explorer/clue/material values, objective, receipt, HUD surface를 갱신한다.
4. checker에 requirements action click, telemetry, screenshot assertion을 추가한다.
5. Browser Use unavailable 시 blocker report와 Playwright fallback evidence를 남긴다.

## 수용 기준

- route inspection 후 `개방 조건 보기` action이 보인다.
- action 이후 `moonFenceRequirementSurfaceVisible=true`, `moonFenceRequirementsInspected=true` telemetry가 남는다.
- 화면에는 `오로 explorer`, `달빛 단서 2`, `재료 3` 요구 조건과 현재 부족 상태가 보인다.
- `npm run check:phaser`, `npm run check:content`, `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:ci`, `git diff --check`가 통과한다.

## 안전 범위

- Phaser local state/action/render/checker와 운영 evidence만 변경한다.
- runtime image generation/API/cache 호출 없음.
- 새 accepted manifest asset은 추가하지 않는다.

## 리스크

- requirements chip이 HUD 밀도를 높일 수 있다. 필요하면 후속 UI density slice 또는 dedicated marker asset으로 분리한다.
