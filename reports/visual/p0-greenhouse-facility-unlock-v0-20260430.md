# P0.5 Greenhouse facility unlock v0 visual QA

Date: 2026-04-30
Issue: #200
Item: `items/0109-greenhouse-facility-unlock-v0.md`
Branch: `codex/0109-greenhouse-facility-unlock-v0`

## Scope

작업대 강화 완료 후 정원 action surface에 첫 `온실 설비` 목표가 등장하고, 잎+재료를 써서 설비 완료 상태와 생산률 상승이 화면에 보이는지 확인했다.

## Browser Use evidence

- Tool: Browser Use `iab`
- URL: `http://127.0.0.1:5174/?qaResearchExpeditionClaimReady=1&qaTab=expedition&qaReset=1`
- Flow:
  1. 원정 보상 수령
  2. 정원 탭 이동
  3. `작업대 강화` 완료
  4. `온실 설비` 완료
- Screenshot: `reports/visual/p0-greenhouse-facility-unlock-browser-use-20260430.png`

## Findings

- 작업대 강화 후 `설비 준비 / 온실 설비 / 80 잎 · 1 재료로 선반 설치`가 실제 화면에 보인다.
- 설비 완료 후 `설비 완료 / 온실 설비 / 온실 선반 +10% 가동`이 실제 화면에 보인다.
- HUD는 `재료 0`으로 줄고, 생산률은 `분당 15.3 잎`으로 상승한다.
- 모바일 action surface는 bottom tabs와 겹치지 않고, visible child overflow가 없다.

## Automated visual gate

- `npm run check:visual -- --grep "온실 설비"`: PASS
- `npm run check:visual`: PASS, 34 passed
- `npm run check:ci`: PASS

## Remaining risk

- GitHub PR checks에서 동일 gate를 재확인해야 한다.
