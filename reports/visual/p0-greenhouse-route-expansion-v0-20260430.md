# P0.5 Greenhouse route expansion v0 visual QA

Date: 2026-04-30
Issue: #218
Item: `items/0115-greenhouse-route-expansion-v0.md`
Branch: `codex/0115-greenhouse-route-expansion-v0`

## Scope

`온실 확장 준비` 납품 보상 `재료 2`가 `온실 동선` 성장 선택으로 이어지고, 구매 후 3번 밭이 실제 playfield에 열리는지 확인했다.

## Browser Use evidence

- Tool: Browser Use `iab`
- URL: `http://127.0.0.1:5174/?qaOfflineMinutes=60&qaLunarGuardian=1&qaGreenhouseShelf=1&qaGreenhouseStorage=1&qaReset=1`
- Flow:
  1. 오프라인 복귀 보상 modal 확인
  2. `보상 확인` 클릭
  3. `생산 잎 수령` 클릭
  4. `주문 납품 +70 잎 · +3 꽃가루 · +2 재료` 클릭
  5. `온실 동선` 구매
  6. 3번 밭 개방 확인
- Screenshot: `reports/visual/p0-greenhouse-route-expansion-browser-use-20260430.png`

## Findings

- `온실 동선` 선택지가 `2 재료로 3번 밭 개방`으로 보인다.
- 클릭 후 상단 재화가 `재료 0`이 되고 선택지는 `동선 완료` / `3번 밭 개방 중`으로 전환된다.
- playfield에 `첫 밭`, `2번 밭`, `3번 밭`이 모두 `빈 자리`로 보인다.
- 3번 밭은 action surface에 가려지지 않고 한 화면에서 읽힌다.
- 신규 asset 없이 기존 plot/playfield와 upgrade choice surface를 재사용했다.

## Automated visual gate

- `npm run check:visual -- --grep "온실 동선 확장"`: PASS
- `npm run check:visual -- --grep "온실 확장 준비|온실 동선 확장"`: PASS
- `npm run check:visual`: PASS, 40 passed
- `npm run check:ci`: PASS

## Remaining risk

- PR checks에서 같은 visual/CI gate를 재확인해야 한다.
