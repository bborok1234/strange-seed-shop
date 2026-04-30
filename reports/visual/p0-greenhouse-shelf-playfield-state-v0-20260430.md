# P0.5 Greenhouse shelf playfield state v0 visual QA

Date: 2026-04-30
Issue: #209
Item: `items/0112-greenhouse-shelf-playfield-state-v0.md`
Branch: `codex/0112-greenhouse-shelf-playfield-state-v0`

## Scope

온실 선반 보관 보너스를 받은 뒤 복귀 modal을 닫았을 때, 정원 playfield production lane의 order crate가 `온실 선반 납품 완료`와 `선반 보관 +10%` 상태를 계속 보여주는지 확인했다.

## Browser Use evidence

- Tool: Browser Use `iab`
- URL: `http://127.0.0.1:5174/?qaOfflineMinutes=60&qaLunarGuardian=1&qaGreenhouseShelf=1&qaReset=1`
- Flow:
  1. 오프라인 복귀 보상 modal 확인
  2. `보상 확인` 클릭
  3. 정원 playfield production lane 확인
- Screenshot: `reports/visual/p0-greenhouse-shelf-playfield-state-browser-use-20260430.png`

## Findings

- playfield order crate에 `온실 선반 납품 완료`, `36/36 잎`, `선반 보관 +10%`가 함께 보인다.
- `선반 보관 +10%`는 줄임표 없이 화면 안에서 읽힌다.
- playfield, action surface, bottom tabs가 서로 가리지 않는다.
- 신규 asset 없이 기존 order crate surface를 재사용했다.

## Automated visual gate

- `npm run check:visual -- --grep "선반 보관 상태"`: PASS
- `npm run check:visual`: PASS, 37 passed
- `npm run check:ci`: PASS

## Remaining risk

- GitHub PR checks에서 기존 comeback/order/playfield 회귀를 재확인해야 한다.
