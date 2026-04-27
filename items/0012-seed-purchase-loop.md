# Seed purchase loop

Status: verified

## 목적

씨앗 구매 미션을 실제 플레이에 연결하고, 첫 수확 이후 빈 밭에 새 씨앗을 심을 수 있게 한다.

## 범위

- `src/App.tsx`
- `src/types/game.ts`
- `src/lib/persistence.ts`
- `src/styles.css`
- `scripts/check-game-loop.mjs`

## 완료 조건

- 저장 데이터에 `seedInventory`가 있고 기존 저장도 `normalizeSave`로 보완된다.
- 초기 스타터 선택은 무료로 유지하되, 반복 구매 씨앗은 최소 10 잎을 지불한다.
- 해금된 씨앗을 구매하면 인벤토리에 쌓이고 `daily_buy_3_seeds` 진행도가 올라간다.
- 보유 씨앗은 빈 열린 밭에 심을 수 있다.
- Browser Use로 3회 구매 후 buy-3 미션 보상이 활성화되는 것을 확인한다.

## 검증

- `npm run check:loop`
- `npm run check:browser-qa`
- `npm run check:all`
- Browser Use `iab` backend로 `qaOfflineMinutes=60` 접속 후 씨앗 3회 구매, buy-3 미션 보상 활성화, 심기 버튼 확인

## 비고

무료 스타터 선택과 반복 구매를 분리했다. 반복 구매는 `max(10, seed.costLeaves)` 가격을 사용한다.
