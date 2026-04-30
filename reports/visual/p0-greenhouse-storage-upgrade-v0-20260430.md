# P0.5 Greenhouse storage upgrade v0 visual QA

Date: 2026-04-30
Issue: #212
Item: `items/0113-greenhouse-storage-upgrade-v0.md`
Branch: `codex/0113-greenhouse-storage-upgrade-v0`

## Scope

온실 선반 납품 보상으로 받은 `재료 1`을 `선반 정리` 강화에 쓰고, 강화 뒤 playfield와 다음 복귀 보상에서 보관 보너스가 +20%로 올라가는지 확인했다.

## Browser Use evidence

- Tool: Browser Use `iab`
- URL: `http://127.0.0.1:5174/?qaOfflineMinutes=60&qaLunarGuardian=1&qaGreenhouseShelf=1&qaReset=1`
- Flow:
  1. 오프라인 복귀 보상 modal 확인
  2. `보상 확인` 클릭
  3. `선반 정리` 강화 클릭
  4. playfield와 성장 선택 상태 확인
- Screenshot: `reports/visual/p0-greenhouse-storage-upgrade-browser-use-20260430.png`

## Findings

- `선반 정리`가 `1 재료로 보관 보너스 +20%` 선택지로 보인다.
- 클릭 후 상단 재화가 `재료 0`이 되고 `선반 정리`는 `정리 완료` / `보관 보너스 +20% 가동`으로 전환된다.
- playfield order crate에 `선반 보관 +20%`가 보인다.
- playfield, action surface, bottom tabs가 서로 가리지 않는다.
- 신규 asset 없이 기존 order crate / upgrade choice surface를 재사용했다.

## Automated visual gate

- `npm run check:visual -- --grep "선반 정리 강화"`: PASS
- `npm run check:visual -- --grep "온실 설비는 새 납품 주문"`: PASS after compact completed-card fix
- `npm run check:visual`: PASS, 38 passed
- `npm run check:ci`: PASS

## Remaining risk

- PR checks에서 같은 visual/CI gate를 재확인해야 한다.
