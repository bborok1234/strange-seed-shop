# P0 Comeback One-Tap Seed Spend v0 — 2026-04-30

## Summary

오프라인 복귀 보상 modal에서 다음 도감 목표 씨앗을 바로 구매하고, seeds 탭 목표 row가 심기 준비 상태로 이어지는지 확인했다.

## Game Studio route

- `game-studio:game-studio`: comeback reward -> spend -> replant setup -> next collection vertical slice.
- `game-studio:web-game-foundations`: 기존 `buySeed` guard, seed price, save schema를 그대로 사용했다.
- `game-studio:game-ui-frontend`: comeback modal primary CTA를 `씨앗 바로 구매`로 승격하고 기존 보기/확인 CTA를 유지했다.
- `game-studio:game-playtest`: focused visual gate로 modal purchase, tab 전환, leaf/inventory state, 목표 row status를 확인했다.

## Visual gate

- Browser Use: `iab` PASS, session `🔎 0097 comeback one-tap QA`, URL `http://127.0.0.1:5176/?qaOfflineMinutes=60&qaLunarGuardian=1&qaReset=1`.
- Focused: `npm run check:visual -- --grep "복귀 보상 씨앗 바로 구매"` PASS, 1 test.
- Full visual: `npm run check:visual` PASS, 26 tests.
- CI: `npm run check:ci` PASS.
- Browser Use screenshot: `reports/visual/p0-comeback-one-tap-seed-spend-browser-use-20260430.png`
- Screenshot: `reports/visual/p0-comeback-one-tap-seed-spend-v0-20260430.png`

## Findings

- PASS: Browser Use `iab`에서 복귀 보상 modal의 `방울새싹 씨앗 바로 구매` 버튼이 정확히 1개 보였다.
- PASS: Browser Use 클릭 후 modal count가 0이 되고 `.dev-panel.player-panel.tab-seeds`가 visible 상태가 됐다.
- PASS: 복귀 보상 modal에 `방울새싹 씨앗 바로 구매` CTA가 보인다.
- PASS: CTA 클릭 후 modal이 사라지고 seeds 탭이 열린다.
- PASS: 저장 상태가 `leaves: 75`, `seed_herb_002: 1`로 바뀐다.
- PASS: 목표 row가 `보유 1개`와 `열린 밭에 바로 심을 수 있어요`를 보여주고 `심기` 버튼이 활성화된다.

## Remaining risk

- 바로 구매 후 즉시 심기까지 한 번에 수행하는 CTA는 아직 없다.
- next-action 우선순위는 여전히 단일 `nextCreatureGoal` 기준이며 주문/연구/원정 완료 신호와의 우선순위는 별도 설계가 필요하다.
