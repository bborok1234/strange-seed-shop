# P0 comeback tap feedback countdown v0 visual QA

Date: 2026-04-30
Issue: #190
Branch: `codex/0105-comeback-tap-feedback-countdown-v0`

## Scope

복귀 보상 modal에서 `방울새싹 씨앗 구매하고 심기` 후 실제 growing plot을 누를 때, playfield feedback이 단축 효과와 tap 후 남은 횟수를 함께 보여주는지 확인했다.

## Browser Use evidence

- Browser Use: `iab`
- Session: `🔎 0105 comeback tap feedback countdown QA`
- URL: `http://127.0.0.1:5173/?qaOfflineMinutes=60&qaLunarGuardian=1&qaReset=1`
- Screenshot: `reports/visual/p0-comeback-tap-feedback-countdown-browser-use-20260430.png`
- Observed feedback: `쑥! +성장` / `4초 단축 · 약 14번 남음`

## Playwright evidence

- Focused visual: `npm run check:visual -- --grep "복귀 심기 후 성장 탭 feedback"` PASS
- Screenshot: `reports/visual/p0-comeback-tap-feedback-countdown-playwright-20260430.png`
- Full visual: `npm run check:visual` PASS, 30 tests

## Correction evidence

사용자 제보로 `현재 100% · 수확할 준비가 됐어요...` 상태의 production/action surface 내부 잘림을 추가 확인했다.

- Before screenshot: `reports/visual/p0-comeback-ready-occlusion-browser-use-before-20260430.png`
- After Browser Use screenshot: `reports/visual/p0-comeback-ready-action-surface-browser-use-after-20260430.png`
- Report: `reports/visual/p0-comeback-ready-action-surface-fix-20260430.md`
- Focused visual: `npm run check:visual -- --grep "복귀 성장 100%"` PASS

## Result

PASS. 실제 tap feedback이 `4초 단축`과 tap 후 남은 횟수 countdown을 함께 보여주고, 수확 준비 100% 상태의 action surface도 내부에서 잘리지 않는다.
