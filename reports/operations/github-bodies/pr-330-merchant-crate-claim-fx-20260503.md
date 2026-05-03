## 요약

#330은 포장잎 상인 수확 직후 `상인 주문상자`를 실제 보상 수령 동사로 바꾸고, 클릭 시 crate open/claimed state, `+36 잎 · +1 꽃가루`, HUD reward flyout, 다음 납품 목표 affordance를 보여준다.

## Small win

플레이어가 `포장잎 상인`을 만난 뒤 `상인 주문상자 보상 받기`를 눌러 보상이 HUD로 튀는 production moment를 본다.

## 사용자/운영자 가치

- 사용자: named harvest가 정적인 상자 상태에서 끝나지 않고 보상 손맛과 다음 목표로 이어진다.
- 운영자: #326→#328 record-loop chain을 reward-claim gate까지 확장해 P0.5 idle production loop evidence를 강화한다.

## Before / After 또는 Visual evidence

- Before: #328에서 `상인 주문상자`, `보상 포장 완료`, `다음 납품 준비` 정적 payoff까지만 존재.
- After: `상인 주문상자 보상 받기` CTA → `보상 수령 완료` → `상자 열림` → `+36 잎 · +1 꽃가루` → playfield `merchant-claimed` / `HUD 보상 이동`.
- Browser Use: current-session iab discovery 실패 기록 `reports/visual/browser-use-blocker-0330-20260503.md`.
- Screenshot: `reports/visual/issue-330-merchant-crate-claim-fx-393.png`.

## Playable mode

- Local dev: `npm run dev -- --host 127.0.0.1 --port 3000`
- Stable main playable mirror 계약 유지: `npm run play:main` 후 port 5174.

## 검증

- [x] `npm run build`
- [x] `npx playwright test --config playwright.config.ts --grep "상인 주문상자 보상"` — 1 passed
- [x] `npx playwright test --config playwright.config.ts --grep "포장잎 상인 수확|상인 주문상자 보상"` — 2 passed
- [x] `npm run check:visual` — 68 passed
- [x] `npm run check:ci` — pass
- [x] Browser Use iab attempt or blocker: `reports/visual/browser-use-blocker-0330-20260503.md`

## 안전 범위

- 신규 accepted manifest asset 없음.
- runtime image generation/API 호출 없음.
- 결제, 고객 데이터, 외부 배포, 실채널 GTM 없음.
- 저장 schema는 `claimedMerchantCrateRewardIds` 배열 추가와 normalization만 포함한다.

## 남은 위험

- Browser Use iab hands-on QA는 현재 세션 backend discovery 실패로 수행하지 못했다. blocker 해소 시 같은 flow를 재확인한다.
- 상인 주문상자 보상량은 P0.5 tuning 값(`+36 잎 · +1 꽃가루`)이며 장기 경제 밸런싱은 별도 WorkUnit에서 조정 가능하다.

## 연결된 issue

Closes #330

## 작업 checklist

- [x] Game Studio route 기록: `game-studio:game-studio` → `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- [x] Plan-first artifact: `items/0167-merchant-crate-claim-fx.md`
- [x] Visual evidence 또는 current-session blocker 기록
- [x] Focused regression + full visual + CI 통과
- [x] Routine GitHub publication은 body-file로 수행
