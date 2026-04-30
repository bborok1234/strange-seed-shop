# P0.5 Greenhouse facility order v0 visual QA

Date: 2026-04-30
Issue: #203
Item: `items/0110-greenhouse-facility-order-v0.md`
Branch: `codex/0110-greenhouse-facility-order-v0`

## Scope

온실 설비 완료 후 새 `온실 선반 납품` 주문이 열리고, 생산 잎 수령 -> 주문 준비 완료 -> 납품 보상까지 한 화면 흐름으로 이어지는지 확인했다.

## Browser Use evidence

- Tool: Browser Use `iab`
- URL: `http://127.0.0.1:5174/?qaResearchExpeditionClaimReady=1&qaTab=expedition&qaReset=1`
- Flow:
  1. 원정 보상 수령
  2. 정원 탭 이동
  3. 작업대 강화 완료
  4. 온실 설비 완료
  5. 생산 잎 수령
  6. `온실 선반 납품` 납품
- Screenshot: `reports/visual/p0-greenhouse-facility-order-browser-use-20260430.png`

## Findings

- 온실 설비 완료 직후 생산 카드에 `온실 선반 납품`, `0/36 잎 납품 준비`가 등장한다.
- 생산 잎 수령 후 `36/36 잎 납품 준비`가 되고, `주문 납품 +42 잎 · +2 꽃가루 · +1 재료` CTA가 활성화된다.
- 납품 후 `온실 선반 납품 완료`, `+42 잎 · +2 꽃가루 · +1 재료`가 실제 화면에 보인다.
- 모바일 action surface는 bottom tabs와 겹치지 않고, production card 내부 overflow가 없다.

## Automated visual gate

- `npm run check:visual -- --grep "새 납품"`: PASS
- `npm run check:visual -- --grep "온실 설비"`: PASS
- `npm run check:visual`: PASS, 35 passed
- `npm run check:ci`: PASS

## Remaining risk

- GitHub PR checks에서 동일 gate를 재확인해야 한다.
