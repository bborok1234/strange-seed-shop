# Repeat order v0

Status: completed
Work type: game_economy_ui_runtime
Branch: `codex/0085-repeat-order-v0`
Date: 2026-04-29
Issue: #150

## 문제 / 배경

#148까지 production engine, upgrade choice, production speed upgrade가 연결됐지만 주문은 첫 주문 하나로 끝난다. production loop가 idle game처럼 이어지려면 첫 주문 완료 후 다음 주문 목표가 즉시 나타나야 한다.

## Small win

첫 주문 납품 후 current order가 `연구 준비 잎 묶음`으로 바뀌고, 다음 생산 수령이 새 주문 진행률을 채운다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route:
  - `game-studio:web-game-foundations`: order definitions와 current order resolver를 추가하고 기존 save 구조를 유지한다.
  - `game-studio:game-ui-frontend`: playfield crate/action surface가 같은 current order를 보여주게 한다.
  - `game-studio:game-playtest`: 첫 주문 납품 -> 다음 주문 등장 -> 생산 수령 진행률 증가를 Browser Use와 visual gate로 검증한다.
- Player verb: 주문 납품, 다음 주문 확인, 생산 수령으로 새 주문 채우기.
- Core loop role: 주문 완료 -> 다음 주문 목표 -> 추가 생산/성장 투자.
- Screen moment: `?qaProductionReady=1` 첫 주문 납품 직후와 다음 생산 수령 직후.
- Asset/FX need: 기존 order crate/work actor.
- Playtest evidence: Browser Use current tab QA, mobile 393, short 399x666 visual gate.

## Plan

1. order definition을 배열로 확장하고 두 번째 주문 `연구 준비 잎 묶음`을 추가한다.
2. `getCurrentOrder(save)` resolver를 추가한다.
3. `getProductionStatus`가 current order의 progress/completed를 반환하게 한다.
4. `claimProductionLeaves`가 current order에 pending leaves를 더하게 한다.
5. order delivery action이 current order를 완료 처리하고 reward를 지급하게 한다.
6. visual gate와 Browser Use QA가 첫 주문 후 다음 주문으로 넘어가는 흐름을 확인하게 한다.

## 수용 기준

- 첫 주문 납품 전에는 `말랑잎 첫 납품`이 보인다.
- 첫 주문 납품 후 현재 주문이 `연구 준비 잎 묶음`으로 바뀐다.
- 다음 생산 수령은 새 주문 진행률을 증가시킨다.
- playfield order crate와 action surface가 같은 current order를 보여준다.
- 기존 save는 migration 없이 정상 동작한다.
- 399x666 짧은 viewport에서 panel internal scroll과 bottom tab overlap이 없다.
- `npm run check:visual`, `npm run check:ci`가 통과한다.

## 검증 명령

- `npm run build` PASS
- Browser Use in-app QA PASS: `reports/visual/p0-repeat-order-v0-browser-use-20260429.png`
- `npm run check:visual -- --grep "반복 주문|짧은 모바일|모바일 자동 생산과 첫 주문"` PASS
- `npm run check:visual` PASS
- `npm run check:ci` PASS

## 안전 범위

- 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음.
- 새 dependency 없음.
- runtime image generation 없음.
- Branch protection 우회 없음.
