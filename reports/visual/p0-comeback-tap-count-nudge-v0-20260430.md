# P0 comeback tap count nudge v0 visual QA

Date: 2026-04-30
Issue: #188
Branch: `codex/0104-comeback-tap-count-nudge-v0`

## Scope

복귀 보상 modal에서 `방울새싹 씨앗 구매하고 심기`를 누른 뒤, active growth copy가 수확 준비까지 남은 톡톡 횟수 추정치와 1회 단축 효과를 함께 보여주는지 확인했다.

## Browser Use evidence

- Browser Use: `iab`
- Session: `🔎 0104 comeback tap count QA`
- URL: `http://127.0.0.1:5173/?qaOfflineMinutes=60&qaLunarGuardian=1&qaReset=1`
- Screenshot: `reports/visual/p0-comeback-tap-count-nudge-browser-use-20260430.png`
- Observed copy: `현재 1% · 약 60초 남음. 약 15번 더 톡톡하면 수확 준비 · 1회 4초 단축.`

## Playwright evidence

- Focused visual: `npm run check:visual -- --grep "복귀 심기 후 성장 진행 안내"` PASS
- Screenshot: `reports/visual/p0-comeback-tap-count-nudge-playwright-20260430.png`
- Full visual: `npm run check:visual` PASS, 30 tests

## Result

PASS. 복귀 one-tap plant 이후 active growth copy가 남은 시간, 남은 tap 횟수, 1회 단축 효과를 compact하게 보여준다.
