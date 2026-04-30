# P0 Comeback Reward Breakdown v0 — 2026-04-30

## Summary

15분 이상 오프라인 복귀 시 기존 toast 한 줄 대신 시간, 잎 보상, 달빛 수호 bonus, 다음 행동 CTA를 보여주는 compact comeback reward modal을 확인했다.

## Game Studio route

- `game-studio:game-studio`: comeback hook -> 보상감 -> 다음 행동 vertical slice.
- `game-studio:web-game-foundations`: 기존 offline reward result를 UI summary로 전달하고 save schema는 변경하지 않았다.
- `game-studio:game-ui-frontend`: 복귀 순간에만 뜨는 compact modal로 구성하고 확인 후 playfield로 돌아간다.
- `game-studio:game-playtest`: focused visual gate로 modal readability, CTA, playfield 복귀를 확인했다.

## Visual gate

- Focused: `npm run check:visual -- --grep "복귀 보상"` PASS, 1 test.
- Full: `npm run check:visual` PASS, 24 tests.
- CI: `npm run check:ci` PASS.
- Screenshot: `reports/visual/p0-comeback-reward-breakdown-v0-20260430.png`

## Findings

- PASS: `?qaOfflineMinutes=60&qaLunarGuardian=1&qaReset=1`에서 `오프라인 복귀 보상` modal이 보인다.
- PASS: modal은 `1시간`, `90 잎`, `달방울 누누`, `+20%`를 보여준다.
- PASS: `보상 확인`을 누르면 modal이 사라지고 정원 playfield가 다시 보인다.
- PASS: 일반 60분 offline QA는 기존 50잎 보상, 최종 60잎 기준을 유지한다.

## Remaining risk

- full comeback breakdown은 아직 pollen/material/growth completed 항목까지 확장하지 않았다.
- modal은 현재 reward 발생 직후 한 번만 뜨며, 재열기 history surface는 없다.
