# P0.5 Greenhouse expansion order v0 visual QA

Date: 2026-04-30
Issue: #215
Item: `items/0114-greenhouse-expansion-order-v0.md`
Branch: `codex/0114-greenhouse-expansion-order-v0`

## Scope

`선반 정리` 완료 뒤 `온실 확장 준비` 주문이 열리고, 생산 수령과 납품 보상이 다음 온실 재료 확보로 이어지는지 확인했다.

## Browser Use evidence

- Tool: Browser Use `iab`
- URL: `http://127.0.0.1:5174/?qaOfflineMinutes=60&qaLunarGuardian=1&qaGreenhouseShelf=1&qaGreenhouseStorage=1&qaReset=1`
- Flow:
  1. 오프라인 복귀 보상 modal 확인
  2. `보상 확인` 클릭
  3. `온실 확장 준비` 주문 확인
  4. `생산 잎 수령` 클릭
  5. `주문 납품 +70 잎 · +3 꽃가루 · +2 재료` 클릭
- Screenshot: `reports/visual/p0-greenhouse-expansion-order-browser-use-20260430.png`

## Findings

- 선반 정리 완료 save에서 playfield와 production card가 `온실 확장 준비` / `0/60 잎`을 보여준다.
- 생산 수령 후 `60/60 잎 납품 준비`가 되고 납품 버튼이 활성화된다.
- 납품 후 상단 재화는 `꽃가루 3`, `재료 2`가 되며 playfield는 `온실 확장 준비 완료`를 보여준다.
- playfield, action surface, bottom tabs가 서로 가리지 않는다.
- 신규 asset 없이 기존 order crate / production FX surface를 재사용했다.

## Automated visual gate

- `npm run check:visual -- --grep "온실 확장 준비"`: PASS
- `npm run check:visual`: PASS, 39 passed
- `npm run check:ci`: PASS

## Remaining risk

- PR checks에서 같은 visual/CI gate를 재확인해야 한다.
