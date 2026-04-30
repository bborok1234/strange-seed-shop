# P0 comeback growth progress nudge v0 visual QA

Date: 2026-04-30
Issue: #182
Branch: `codex/0101-comeback-growth-progress-nudge-v0`

## Scope

복귀 보상 modal에서 `방울새싹 씨앗 구매하고 심기`를 누른 뒤, 정원 `다음 행동` 패널이 active plot의 현재 성장률과 남은 시간을 compact copy로 보여주는지 확인했다.

## Browser Use evidence

- Browser Use: `iab`
- Session: `🔎 0101 comeback growth progress QA`
- URL: `http://127.0.0.1:5173/?qaOfflineMinutes=60&qaLunarGuardian=1&qaReset=1`
- Screenshot: `reports/visual/p0-comeback-growth-progress-nudge-browser-use-20260430.png`

### Findings

1. 첫 Browser Use pass에서 production형 action panel CSS가 `다음 행동` 제목과 copy를 숨기고 있어 copy가 실제로 보이지 않는 문제가 확인됐다.
2. `active-growth-copy` compact line을 추가한 뒤 재검증했다.
3. 재검증 결과 `.active-growth-copy`는 visible이며, `현재 n% · 약 n초 남음. 밭을 톡톡하면 성장 시간이 줄어듭니다.` 패턴이 확인됐다.

## Playwright evidence

- Focused visual: `npm run check:visual -- --grep "복귀 심기 후 성장 진행 안내"` PASS
- Screenshot: `reports/visual/p0-comeback-growth-progress-nudge-playwright-20260430.png`
- Full visual: `npm run check:visual` PASS, 29 tests

## Result

PASS. 복귀 one-tap plant 이후 다음 행동 copy가 생산 패널에서도 보이고, visual regression gate가 통과했다.
