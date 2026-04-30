# P0 Lunar Seed Harvest Bridge v0 — 2026-04-30

## Summary

`moon_hint` 원정 보상으로 해금된 `달방울 씨앗`이 실제 구매, 심기, 수확, 도감 목표 전환까지 이어지는지 확인했다.

## Game Studio route

- `game-studio:game-studio`: 원정 보상 -> 새 씨앗 -> 새 생명체 -> 다음 목표 vertical slice.
- `game-studio:web-game-foundations`: 기존 seed inventory, plot, harvest save contract를 재사용했다.
- `game-studio:game-ui-frontend`: 씨앗 탭 목표 row에 구매/심기 상태 문구를 추가하고 정원 playfield를 덮지 않았다.
- `game-studio:game-playtest`: focused Playwright visual gate와 screenshot으로 구매/심기/수확 상태를 확인했다.

## Visual gate

- Focused: `npm run check:visual -- --grep "달빛 씨앗"` PASS, 2 tests.
- Full: `npm run check:visual` PASS, 23 tests.
- CI: `npm run check:ci` PASS.
- Purchase/plant screenshot: `reports/visual/p0-lunar-seed-purchase-plant-v0-20260430.png`
- Harvest bridge screenshot: `reports/visual/p0-lunar-seed-harvest-bridge-v0-20260430.png`

## Findings

- PASS: `?qaLunarSeedReady=1&qaTab=seeds`에서 `달방울 씨앗`이 다음 도감 목표로 보이고 구매 가능 상태를 말한다.
- PASS: 구매 후 잎은 492 -> 192로 차감되고 `seed_lunar_001` 보유 수량은 1이 된다.
- PASS: 심기 후 보유 수량은 0이 되고 열린 plot에 `seed_lunar_001`이 저장된다.
- PASS: `?qaLunarSeedReadyToHarvest=1`에서 수확하면 `달방울 누누` reveal과 `달빛 수집 완료` 메시지가 보인다.
- PASS: 수확 후 다음 도감 목표는 `달방울 누누`가 아니라 `젤리콩 통통`으로 넘어간다.

## Remaining risk

- 달빛 계열 전용 playfield sprite/FX는 아직 없다.
- 달빛 생명체가 오프라인 보상에 주는 고유 역할은 아직 수치화하지 않았다.
