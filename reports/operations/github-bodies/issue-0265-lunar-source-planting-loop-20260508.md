# 초승달순 source planting loop

## 요약

#497 이후 첫 원정 보상이 `초승달순 씨앗 source`와 다음 route lock preview까지 이어졌지만, 아직 player가 그 source를 실제 빈 밭에 심을 수 없다. 이번 WorkUnit은 accepted `seed_lunar_002_icon`을 Phaser에 runtime binding하고 `초승달순 심기` action을 추가해 source preview를 planting loop로 연결한다.

## Small win

`초승달순 단서 보기` 다음에 바로 `초승달순 심기`가 생기고, plot playfield에 일반 말랑잎/달빛 새싹과 구분되는 source seed state가 보인다.

## 사용자/운영자 가치

플레이어는 첫 원정 보상이 다음 수집 루프로 실제 전환되는 순간을 본다. 운영자는 `seed_lunar_002` unlock path를 source preview telemetry에서 planting telemetry까지 검증한다.

## Before / After 또는 Visual evidence

- Before: source preview 후 `seed_lunar_002`는 telemetry id로만 남고 planting action이 없다.
- After: source preview 후 source seed inventory가 생기며 빈 plot에서 `초승달순 심기` action이 보인다.
- Visual evidence 예정:
  - `reports/visual/issue-0498-lunar-source-planting-loop/visual-report-20260508.md`
  - `reports/visual/issue-0498-lunar-source-planting-loop/phaser-check-lunar-source-planted-393.png`

## Playable mode

Phaser route. `npm run check:phaser`가 local Phaser app을 띄우고 첫 plant부터 source preview, source planting까지 클릭 순서로 검증한다.

## 작업 checklist

- [ ] `GardenState`에 source seed inventory/planting state 추가
- [ ] `previewExpeditionSourceClue()`가 `seed_lunar_002` source seed를 지급
- [ ] 빈 unlocked plot에 `초승달순 심기` action 추가
- [ ] `seed_lunar_002_icon` Phaser preload/render binding
- [ ] source planting HUD/playfield state 추가
- [ ] Phaser smoke screenshot/telemetry/assertion 추가

## 검증

- `npm run check:phaser`
- `npm run check:ci`
- `git diff --check`

## 안전 범위

- 새 이미지 생성 없음. 기존 accepted raster `seed_lunar_002_icon`만 runtime binding한다.
- 실제 650잎 구매/22분 성장/수확 reward는 후속 WorkUnit으로 분리한다.
- 실결제/외부 배포/고객 데이터 변경 없음.

## 남은 위험

- Browser Use 도구가 세션에 노출되지 않으면 Playwright fallback screenshot으로 검증한다.
- plot overlay가 label을 가리지 않는지 mobile screenshot 확인이 필요하다.
