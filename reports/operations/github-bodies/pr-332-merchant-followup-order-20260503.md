## 요약

#332는 #330 상인 주문상자 보상 수령 이후 `포장잎 상인 단골 납품` follow-up order를 열고, 생산 잎 수령으로 progress를 채운 뒤 `상인 단골 납품` reward motion으로 닫습니다.

## Small win

포장잎 상인이 일회성 보상 상자가 아니라 다음 단골 주문을 가져오는 정원 경제 actor로 읽힙니다.

## 사용자/운영자 가치

- 사용자: 보상 수령 후 바로 다음 주문 목표와 납품 손맛이 생깁니다.
- 운영자: #328→#330 merchant chain을 follow-up order까지 연결해 P0.5 production loop evidence를 강화합니다.

## Before / After 또는 Visual evidence

- Before: #330 claim 이후 `다음 납품 목표 확인` affordance는 있었지만 실제 order progress/납품 CTA는 없었습니다.
- After: `포장잎 상인 단골 납품` → `생산 잎 수령` → `18/18` → `상인 단골 납품 +54 잎 · +2 꽃가루 · +1 재료` → playfield `merchant-delivered`.
- Browser Use: current-session iab discovery 실패 기록 `reports/visual/browser-use-blocker-0332-20260503.md`.
- Screenshot: `reports/visual/issue-332-merchant-followup-order-393.png`.

## Playable mode

- Local dev: `npm run dev -- --host 127.0.0.1 --port 3000`
- Stable main playable mirror 계약 유지: `npm run play:main` 후 port 5174.

## 검증

- [x] `npm run build`
- [x] `npx playwright test --config playwright.config.ts --grep "상인 주문상자 보상은 단골"` — 1 passed
- [x] `npx playwright test --config playwright.config.ts --grep "상인 주문상자 보상|상인 단골 납품"` — 2 passed
- [x] `npm run check:visual` — 69 passed
- [x] `npm run check:ci` — pass
- [x] Browser Use iab attempt or blocker: `reports/visual/browser-use-blocker-0332-20260503.md`

## 안전 범위

- 신규 accepted manifest asset 없음.
- runtime image generation/API 호출 없음.
- 결제, 고객 데이터, 외부 배포, 실채널 GTM 없음.
- 주문 정의/선택 로직은 merchant reward claimed 상태에서만 follow-up order를 노출한다.

## 남은 위험

- Browser Use iab hands-on QA는 현재 세션 backend discovery 실패로 수행하지 못했다. blocker 해소 시 같은 flow를 재확인한다.
- `포장잎 상인 단골 납품` 보상량/필요량은 P0.5 tuning 값이며 장기 경제 밸런싱은 별도 WorkUnit에서 조정 가능하다.

## 연결된 issue

Closes #332

## 작업 checklist

- [x] Game Studio route 기록: `game-studio:game-studio` → `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- [x] Plan-first artifact: `items/0168-merchant-followup-order.md`
- [x] Visual evidence 또는 current-session blocker 기록
- [x] Focused regression + full visual + CI 통과
- [x] Routine GitHub publication은 body-file로 수행
