## 요약

#348은 첫 GREENHOUSE_ORDER("온실 선반 납품") 납품 직후 production card에 기존 `.order-dispatch-receipt` 모션(1.8초)을 띄우고 playfield order crate에 신규 `greenhouse-shelf-delivered` 메달 variant를 같은 1.8초 동안 표시합니다. 이전까지 GREENHOUSE_ORDER 납품 분기는 `setOrderDeliveryReceipt(null)`로 떨어져 silent했고, chain handoff(#344) → entry reveal(#346) arc의 다음 호흡(첫 출하)이 시각적으로 비어 있었습니다.

## Small win

chain handoff → 작업대 강화 → 달빛 온실 설립 → 온실 선반 첫 출하까지 따라온 손맛이 출하 receipt sparkle + playfield 메달 crate variant로 마무리됩니다.

## 사용자/운영자 가치

- 사용자: 온실 선반 첫 납품이 merchant 납품과 같은 reveal 무게로 마무리되어 chain handoff(#344) → entry reveal(#346)의 다음 호흡이 끊기지 않는다.
- 운영자: #336 → #338 → #344 → #346 chain handoff arc를 facility-greenhouse 진입의 두 번째 reveal moment로 닫아 P0.5 Idle Core + Creative Rescue의 production loop continuity를 한 칸 더 채운다.

## Before / After 또는 Visual evidence

- Before: 첫 GREENHOUSE_ORDER 납품 후 `productionStatus.orderCompleted` flag만 true가 되고 production card는 정적인 `production-complete-row`로 떨어진다. merchant 납품과 달리 `.order-dispatch-receipt` chip + sparkle motion이 나오지 않고 playfield crate도 기본 상태에 머문다.
- After: GREENHOUSE_ORDER 납품 직후 production card에 `.order-dispatch-receipt` chip이 1.8초 sparkle motion으로 등장한다. 카피는 "상자 출하 완료 / 온실 선반 납품 / +42 잎 · +2 꽃가루 · +1 재료 / 다음 주문: …". playfield order crate가 같은 1.8초 동안 `greenhouse-shelf-delivered` variant(초록 burst + 메달/리본 medal-spin)로 표시된 뒤 다음 priority crate variant로 자연스럽게 전환된다.
- Browser Use: current-session iab discovery 실패 기록 `reports/visual/browser-use-blocker-0348-20260504.md`.
- Screenshot: focused regression artifact `mobile-greenhouse-facility-order-v0-393.png`(receipt + 메달 variant 포함).

## Playable mode

- Local dev: `npm run dev -- --host 127.0.0.1 --port 3000`
- Stable main playable mirror 계약 유지: `npm run play:main` 후 port 5174.

## 검증

- [x] `npm run build`
- [x] `npx playwright test --config playwright.config.ts --grep "온실 설비는 새 납품 주문으로 이어진다"`
- [x] `npm run check:ci`
- [x] `npm run check:ops-live`
- [x] `npm run check:dashboard`
- [x] `npm run check:control-room`
- [x] `npm run check:closed-workunit-mirrors`
- [x] `npm run check:github-metadata`
- [x] Browser Use iab attempt or blocker: `reports/visual/browser-use-blocker-0348-20260504.md`

## 안전 범위

- 신규 accepted manifest asset 없음. existing greenhouse/order crate asset + DOM/CSS receipt + sparkle/medal keyframe만 사용.
- runtime image generation/API 호출 없음.
- 결제, 고객 데이터, 외부 배포, 실채널 GTM 없음.
- save 호환: 신규 state는 transient receipt에 한정, save schema 변경 없음.
- 기존 first/greenhouse/lunar/follow-up/second-chapter 우선순위 보존. economy 변동 없음. 신규 변경은 시각적 reveal에 한정.

## 남은 위험

- Browser Use iab hands-on QA는 current session backend discovery 실패로 수행하지 못했다. blocker 해소 시 같은 flow를 재확인한다.
- 후속 greenhouse 단계(GREENHOUSE_EXPANSION_ORDER, GREENHOUSE_ROUTE_SUPPLY_ORDER 등)도 같은 silent 패턴이 있다. 이번 PR은 첫 GREENHOUSE_ORDER 한 beat에 한정하고, 후속 단계는 별도 WorkUnit으로 추적한다.

## 연결된 issue

Closes #348

## 작업 checklist

- [x] Game Studio route 기록: `game-studio:game-studio` → `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- [x] Plan-first artifact: `items/0176-greenhouse-shelf-delivery-receipt.md`
- [x] Visual evidence 또는 current-session blocker 기록
- [x] Focused regression + CI/ops/mirror gates 통과
- [x] Routine GitHub publication은 body-file로 수행
