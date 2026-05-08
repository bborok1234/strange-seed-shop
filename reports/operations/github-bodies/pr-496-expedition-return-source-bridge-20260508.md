# 첫 원정 보상 source preview bridge

## 요약

첫 원정 귀환 상자 claim을 `초승달순 씨앗 source`와 다음 route lock preview로 연결했습니다. `seed_lunar_002` source clue, `초승달순 단서 보기` action, `expedition_moon_fence_locked` telemetry, HUD surface, playfield source/route marker를 추가했습니다.

## Small win

귀환 상자 보상이 이제 잎 수령에서 끝나지 않고, 다음 수집 source와 `달빛 울타리 잠김` 장기 route로 바로 이어집니다.

## 사용자/운영자 가치

플레이어는 첫 원정 보상 뒤 다음에 무엇을 발견해야 하는지 즉시 봅니다. 운영자는 `GAME_BIBLE.md`의 `seed_lunar_002` unlock 조건을 Phaser v1 loop telemetry와 screenshot gate로 검증할 수 있습니다.

## Before / After 또는 Visual evidence

- Before: `귀환 상자 열기` 후 objective/receipt가 `꽃가루 단서 후보` 수준에서 멈췄고 다음 source/route state가 없었습니다.
- After: `초승달순 단서 보기` action으로 `초승달순 씨앗 source`와 `달빛 울타리 잠김` preview가 HUD/playfield/telemetry에 남습니다.
- Visual QA: `reports/visual/issue-0496-expedition-return-source-bridge/visual-report-20260508.md`
- Key screenshots:
  - `reports/visual/issue-0496-expedition-return-source-bridge/phaser-check-expedition-claimed-393.png`
  - `reports/visual/issue-0496-expedition-return-source-bridge/phaser-check-expedition-source-preview-393.png`

## Playable mode

Phaser route. `npm run check:phaser`가 local Phaser app을 띄우고 첫 plant부터 원정 source preview까지 클릭 순서로 검증합니다.

## 작업 checklist

- [x] `GardenState`에 원정 source clue/preview/route id/source seed id 추가
- [x] 귀환 상자 claim이 `seed_lunar_002` source clue를 지급
- [x] `초승달순 단서 보기` action 추가
- [x] HUD action rail에 source preview와 다음 route lock 표시
- [x] 원정 문 playfield 주변에 source marker와 route lock marker 표시
- [x] Phaser smoke에 source preview screenshot/telemetry/assertion 추가

## 검증

- `npm run check:phaser` — pass
- `npm run check:ci` — pass
- `npm run check:dashboard` — pass
- `npm run check:control-room` — pass
- `npm run check:ops-live` — pass
- `npm run check:github-metadata` — pass
- `git diff --check` — pass

## 안전 범위

- Runtime image generation/API/cache 호출 없음.
- 새 generated asset은 만들지 않고 #495 accepted raster/FX를 runtime에서 재사용합니다.
- 실결제/외부 배포/고객 데이터 변경 없음.

## 남은 위험

- Browser Use 도구가 이번 세션에 노출되지 않아 Playwright fallback screenshot과 수동 screenshot inspection으로 검증했습니다.
- dedicated `seed_lunar_002` raster icon과 실제 planting loop는 후속 WorkUnit으로 분리해야 합니다.

## 연결된 issue

Closes #496
