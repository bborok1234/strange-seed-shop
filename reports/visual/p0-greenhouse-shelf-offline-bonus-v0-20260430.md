# P0.5 Greenhouse shelf offline bonus v0 visual QA

Date: 2026-04-30
Issue: #206
Item: `items/0111-greenhouse-shelf-offline-bonus-v0.md`
Branch: `codex/0111-greenhouse-shelf-offline-bonus-v0`

## Scope

온실 선반 납품 완료 상태가 오프라인 복귀 보상에 `온실 선반 보관 +10%`로 남고, 달빛 수호자 보너스와 함께 표시되어도 모바일 복귀 modal이 잘리지 않는지 확인했다.

## Browser Use evidence

- Tool: Browser Use `iab`
- URL: `http://127.0.0.1:5174/?qaOfflineMinutes=60&qaLunarGuardian=1&qaGreenhouseShelf=1&qaReset=1`
- Screenshot: `reports/visual/p0-greenhouse-shelf-offline-bonus-browser-use-20260430.png`

## Findings

- 60분 복귀 보상은 `98 잎`으로 표시된다.
- `달빛 보상 +20%`와 `온실 선반 보관` / `보관 보상 +10%`가 같은 복귀 modal에 함께 보인다.
- 주요 CTA `방울새싹 씨앗 구매하고 심기`, `바로 구매`, `보러가기`, `보상 확인`이 viewport 안에 남는다.
- 신규 asset이나 runtime image generation 없이 기존 comeback surface가 확장됐다.

## Automated visual gate

- `npm run check:visual -- --grep "온실 선반 보관"`: PASS
- `npm run check:visual`: PASS, 36 passed
- `npm run check:ci`: PASS

## Remaining risk

- GitHub PR checks에서 기존 복귀 보상 숫자와 modal 밀도 회귀를 재확인해야 한다.
