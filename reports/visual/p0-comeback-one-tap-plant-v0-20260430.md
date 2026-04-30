# P0 Comeback One-Tap Plant v0 — 2026-04-30

## Summary

오프라인 복귀 보상 modal에서 다음 도감 목표 씨앗을 바로 구매하고 열린 밭에 심은 뒤 정원 화면으로 돌아오는지 확인했다.

## Game Studio route

- `game-studio:game-studio`: comeback reward -> spend -> replant -> next collection timer vertical slice.
- `game-studio:web-game-foundations`: 기존 seed price, unlocked seed guard, open plot guard, save schema를 유지했다.
- `game-studio:game-ui-frontend`: comeback modal primary CTA를 명시적 `구매하고 심기` 행동으로 승격하고 `바로 구매` / `보러가기` fallback을 유지했다.
- `game-studio:game-playtest`: Browser Use `iab`로 modal CTA, 정원 복귀, currency, playfield planting state를 확인했다.

## Visual gate

- Browser Use: `iab` PASS, session `🔎 0099 comeback one-tap plant QA`, URL `http://127.0.0.1:5173/?qaOfflineMinutes=60&qaLunarGuardian=1&qaReset=1`.
- Browser Use screenshot: `reports/visual/p0-comeback-one-tap-plant-browser-use-20260430.png`
- Focused: `npm run check:visual -- --grep "복귀 보상 씨앗 구매하고 심기"` PASS, 1 test.
- Full visual: `npm run check:visual` PASS, 27 tests.
- Playwright screenshot: `reports/visual/p0-comeback-one-tap-plant-playwright-20260430.png`
- CI: `npm run check:ci` PASS.

## Findings

- PASS: Browser Use `iab`에서 복귀 보상 modal의 `방울새싹 씨앗 구매하고 심기` 버튼이 정확히 1개 보였다.
- PASS: Browser Use 클릭 후 modal count가 0이 되고 `.garden-playfield-host`가 visible 상태가 됐다.
- PASS: 재화 표시가 `잎 75`로 바뀌었다.
- PASS: playfield가 `방울새싹 씨앗` 성장 상태를 보여준다.

## Remaining risk

- 구매하고 심기 후 즉시 수확까지 이어지는 shortcut은 없다.
- next-action 우선순위는 여전히 단일 `nextCreatureGoal` 기준이며 주문/연구/원정 완료 신호와의 우선순위는 별도 설계가 필요하다.
