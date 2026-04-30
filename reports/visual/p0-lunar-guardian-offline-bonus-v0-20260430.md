# P0 Lunar Guardian Offline Bonus v0 — 2026-04-30

## Summary

`달방울 누누` 발견 상태가 오프라인 복귀 보상에 실제 수호자 bonus와 문구로 반영되는지 확인했다.

## Game Studio route

- `game-studio:game-studio`: 달빛 생명체 수집 -> comeback 보상 기대감 강화 vertical slice.
- `game-studio:web-game-foundations`: 기존 local save offline reward 계산에 guardian multiplier를 추가했다.
- `game-studio:game-ui-frontend`: 기존 toast surface 안에서만 bonus 문구를 추가해 playfield를 가리지 않았다.
- `game-studio:game-playtest`: focused visual gate로 일반 offline QA와 lunar guardian offline QA의 보상/문구 차이를 확인했다.

## Visual gate

- Focused: `npm run check:visual -- --grep "달빛 오프라인"` PASS, 1 test.
- Full: `npm run check:visual` PASS, 24 tests.
- CI: `npm run check:ci` PASS.
- Screenshot: `reports/visual/p0-lunar-guardian-offline-bonus-v0-20260430.png`

## Findings

- PASS: 일반 `?qaOfflineMinutes=60&qaReset=1`은 기존 60분 보상 50잎, 최종 60잎을 유지한다.
- PASS: `?qaOfflineMinutes=60&qaLunarGuardian=1&qaReset=1`은 `달방울 누누` 발견 상태를 포함한다.
- PASS: 달빛 수호자 상태에서는 60분 보상이 90잎, 최종 100잎으로 상승한다.
- PASS: toast가 `달방울 누누가 달빛 보상 +20%를 지켜줬어요`를 표시한다.

## Remaining risk

- guardian bonus는 Phase 0 v0 수치인 생명체당 +20%로 고정되어 있고, 장기 밸런스는 별도 economy tuning 대상이다.
- full comeback modal은 아직 toast보다 풍부한 보상 breakdown을 보여주지 않는다.
