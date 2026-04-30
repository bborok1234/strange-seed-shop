# Lunar seed harvest bridge v0

Status: completed
Work type: game_loop
Branch: `codex/0093-lunar-seed-harvest-bridge-v0`
Date: 2026-04-30
Issue: #166

## 문제 / 배경

#164에서 `달빛 흔적 찾기` 원정 보상은 `달방울 씨앗`과 `달방울 누누` 다음 목표로 이어졌다. 하지만 보상 후 실제 player verb는 아직 `씨앗 보러가기`에서 멈춘다. 장기 메타가 수집 욕구가 되려면 보상으로 열린 씨앗을 구매하고, 열린 밭에 심고, `달방울 누누`를 수확해 도감 목표가 완료되는 순간까지 검증되어야 한다.

## Small win

`?qaLunarSeedReady=1&qaTab=seeds`에서 `달방울 씨앗`을 구매하고 심은 뒤 즉시 수확 상태로 재현해 `달방울 누누` 발견과 도감 목표 완료를 확인한다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route:
  - `game-studio:web-game-foundations`: 기존 seed purchase, inventory, plot, harvest save contract를 재사용하고 새 save migration은 만들지 않는다.
  - `game-studio:game-ui-frontend`: 씨앗 탭의 달빛 목표 row에 구매/심기 후 다음 행동을 compact하게 보여주며 playfield를 덮지 않는다.
  - `game-studio:game-playtest`: Playwright visual gate와 screenshot으로 구매/심기/수확/도감 전환을 확인한다.
- Player verb: 달빛 씨앗 구매, 열린 밭에 심기, 달방울 누누 수확, 도감 기록 확인.
- Core loop role: 원정 보상 -> 새 씨앗 -> 새 생명체 -> 다음 장기 목표.
- Screen moment: `?qaLunarSeedReady=1&qaTab=seeds`.

## Plan

1. 달빛 씨앗 해금/구매 가능 QA save와 달빛 씨앗 ready-to-harvest QA save를 추가한다.
2. 씨앗 탭의 목표 row가 보유/열린 밭/구매 가능/심기 후 상태를 더 명확히 말하게 한다.
3. 달빛 씨앗 수확 reveal에서 `달방울 누누`가 달빛 보상 후 첫 수집 완료로 읽히게 한다.
4. visual gate에 달빛 씨앗 구매/심기/수확/도감 확인 테스트를 추가한다.
5. visual report, roadmap, dashboard evidence를 갱신한다.

## 수용 기준

- [x] `?qaLunarSeedReady=1&qaTab=seeds`에서 `달방울 씨앗` row가 다음 도감 목표로 보인다.
- [x] `달방울 씨앗`을 구매하면 잎이 차감되고 보유 수량이 증가한다.
- [x] 열린 밭이 있을 때 `심기`가 가능하고 저장된 plot이 `seed_lunar_001`을 가진다.
- [x] `?qaLunarSeedReadyToHarvest=1`에서 수확하면 `달방울 누누` reveal과 도감 발견 상태가 확인된다.
- [x] 수확 후 다음 목표가 `달방울 누누`에 머물지 않고 다음 미발견 목표로 넘어간다.
- [x] visual evidence와 `npm run check:ci`가 통과한다.

## 검증 명령

- [x] `npm run check:visual -- --grep "달빛 씨앗"` PASS, 2 tests
- [x] `npm run check:visual` PASS, 23 tests
- [x] `npm run check:ci` PASS

## Evidence

- Visual report: `reports/visual/p0-lunar-seed-harvest-bridge-v0-20260430.md`
- Purchase/plant screenshot: `reports/visual/p0-lunar-seed-purchase-plant-v0-20260430.png`
- Harvest bridge screenshot: `reports/visual/p0-lunar-seed-harvest-bridge-v0-20260430.png`

## 안전 범위

- 새 save schema migration 없음.
- 새 asset 생성 없음.
- lunar 경제 수치 재튜닝 없음.
- 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음.
