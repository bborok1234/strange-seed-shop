# P0 Comeback Plant Success Nudge v0 — 2026-04-30

## Summary

오프라인 복귀 보상 modal에서 `구매하고 심기`를 누른 뒤 정원 화면의 toast가 심기 성공과 다음 tap growth 행동을 안내하는지 확인했다.

## Game Studio route

- `game-studio:game-studio`: comeback reward -> spend -> replant -> tap growth vertical slice.
- `game-studio:game-ui-frontend`: comeback CTA 후 성공 toast가 다음 player verb를 짧게 안내한다.
- `game-studio:game-playtest`: Browser Use `iab`와 visual gate로 toast, 정원 복귀, playfield planting state를 확인했다.

## Visual gate

- Browser Use: `iab` PASS, session `🔎 0100 comeback plant nudge QA`, URL `http://127.0.0.1:5173/?qaOfflineMinutes=60&qaLunarGuardian=1&qaReset=1`.
- Browser Use screenshot: `reports/visual/p0-comeback-plant-success-nudge-browser-use-20260430.png`
- Focused: `npm run check:visual -- --grep "복귀 심기 성공 안내"` PASS, 1 test.
- Full visual: `npm run check:visual` PASS, 28 tests.
- Playwright screenshot: `reports/visual/p0-comeback-plant-success-nudge-playwright-20260430.png`
- CI: `npm run check:ci` PASS.

## Findings

- PASS: Browser Use `iab`에서 `방울새싹 씨앗 구매하고 심기` 버튼이 정확히 1개 보였다.
- PASS: CTA 클릭 후 modal count가 0이 되고 `.garden-playfield-host`가 visible 상태가 됐다.
- PASS: toast가 `방울새싹 씨앗을 바로 심었어요. 밭을 톡톡 두드려 성장시켜요.`를 보여준다.
- PASS: 재화 표시가 `잎 75`로 유지되고 playfield가 성장 중인 `방울새싹 씨앗`을 보여준다.

## Remaining risk

- 성공 toast는 즉시 성장 tap을 안내하지만 자동으로 tap을 수행하지 않는다.
- next-action 우선순위는 여전히 단일 `nextCreatureGoal` 기준이며 주문/연구/원정 완료 신호와의 우선순위는 별도 설계가 필요하다.
