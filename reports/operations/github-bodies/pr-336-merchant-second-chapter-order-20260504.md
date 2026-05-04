## 요약

#336은 #332 `포장잎 상인 단골 납품` follow-up order 완료 직후 `포장잎 상인 두 번째 단골 chapter` 의뢰(`order_merchant_chapter_two_001`)를 production card/playfield에 즉시 노출해 단골 chain을 정기 거래로 확장합니다. follow-up 완료 시점에 chapter reveal motion이 실행되고, playfield crate는 `merchant-second-chapter` → 납품 후 `merchant-second-delivered`로 전환됩니다.

## Small win

단골 납품의 손맛이 일회성으로 끊기지 않고, 같은 화면에서 더 큰 자원/보상을 가진 두 번째 chapter 의뢰가 production loop의 다음 박자로 이어집니다.

## 사용자/운영자 가치

- 사용자: 포장잎 상인이 단발 거래자가 아니라 정기 단골 chain의 actor로 읽혀 수집-생산-주문 루프가 한 박자 더 길어집니다.
- 운영자: #328 → #330 → #332 merchant chain을 두 번째 chapter까지 확장해 P0.5 production loop evidence를 더 닫습니다.

## Before / After 또는 Visual evidence

- Before: #332 `상인 단골 납품` 직후 production card는 `merchant-delivered`만 보여주고 다음 단골 chapter 목표는 같은 화면에 없다.
- After: follow-up 납품 직후 production card에 `.has-merchant-second-chapter` chapter card가 reveal motion과 함께 등장하고, playfield는 `merchant-second-chapter` crate로 전환되며 잎 수령 → 납품 → `merchant-second-delivered` + reward(`+96 잎 · +3 꽃가루 · +2 재료`)로 이어진다.
- Browser Use: current-session iab discovery 실패 기록 `reports/visual/browser-use-blocker-0336-20260503.md`.
- Screenshot: `reports/visual/issue-336-merchant-second-chapter-order-393.png` (focused regression artifact 사본).

## Playable mode

- Local dev: `npm run dev -- --host 127.0.0.1 --port 3000`
- Stable main playable mirror 계약 유지: `npm run play:main` 후 port 5174.

## 검증

- [x] `npm run build`
- [x] `npx playwright test --config playwright.config.ts --grep "단골 두 번째|merchant-second-chapter|상인 두 번째 단골"`
- [x] `npm run check:visual`
- [x] `npm run check:ci`
- [x] Browser Use iab attempt or blocker: `reports/visual/browser-use-blocker-0336-20260503.md`

## 안전 범위

- 신규 accepted manifest asset 없음. existing merchant/order crate asset + DOM/CSS chapter state + reward motion만 사용.
- runtime image generation/API 호출 없음.
- 결제, 고객 데이터, 외부 배포, 실채널 GTM 없음.
- 기존 first/greenhouse/lunar/follow-up order 우선순위 보존: `getCurrentOrder`는 follow-up 완료 + second chapter 미완료일 때만 두 번째 chapter를 라우팅한다.

## 남은 위험

- Browser Use iab hands-on QA는 current session backend discovery 실패로 수행하지 못했다. blocker 해소 시 같은 flow를 재확인한다.
- 두 번째 chapter 자원 요구(잎 36 / 보상 잎 96 + 꽃가루 3 + 재료 2)는 P0.5 tuning 값이며 장기 경제 밸런싱은 별도 WorkUnit에서 조정 가능하다.

## 연결된 issue

Closes #336

## 작업 checklist

- [x] Game Studio route 기록: `game-studio:game-studio` → `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- [x] Plan-first artifact: `items/0170-merchant-second-chapter-order.md`
- [x] Visual evidence 또는 current-session blocker 기록
- [x] Focused regression + full visual + CI 통과
- [x] Routine GitHub publication은 body-file로 수행
