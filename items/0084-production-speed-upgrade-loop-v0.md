# Production speed upgrade loop v0

Status: completed
Work type: game_economy_ui_runtime
Branch: `codex/0084-production-speed-upgrade-loop-v0`
Date: 2026-04-29
Issue: #148

## 문제 / 배경

#146에서 `다음 성장 선택` UI는 생겼지만 `생산 속도`는 아직 실제 구매 루프가 아니다. North Star production bar 기준으로는 첫 주문 보상이 다음 성장 투자로 이어져야 하므로, 첫 생산 speed upgrade를 실제 state/economy loop로 닫아야 한다.

## Small win

첫 주문 납품 후 받은 꽃가루와 잎으로 `작업 간식 강화`를 구매하면 `productionBoostLevel`이 저장되고 분당 생산량이 상승한다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route:
  - `game-studio:web-game-foundations`: save schema migration과 production rate formula를 작게 확장한다.
  - `game-studio:game-ui-frontend`: upgrade choice card에서 가능/부족/완료 상태와 구매 CTA를 명확히 한다.
  - `game-studio:game-playtest`: 첫 주문 납품 -> speed upgrade 구매 -> rate 상승을 screenshot/DOM/telemetry로 확인한다.
- Player verb: 생산 수령, 주문 납품, 작업 간식 강화 구매, 상승한 production rate 확인.
- Core loop role: 주문 보상 -> 성장 투자 -> 자동 생산량 상승.
- Screen moment: `?qaProductionReady=1` 생산 수령/주문 납품/업그레이드 구매 직후.
- Asset/FX need: 새 asset 없음.
- Playtest evidence: Browser Use current tab QA, mobile 393, short 399x666 visual gate.

## Plan

1. `PlayerSave`에 `productionBoostLevel`을 추가하고 persistence normalize 기본값을 둔다.
2. `createNewSave`와 QA saves가 새 필드를 자연스럽게 갖게 한다.
3. `getProductionRatePerSecond`에 boost multiplier를 반영한다.
4. `buyProductionBoost` 액션을 추가해 leaves/pollen 비용을 지불하고 level을 1 올린다.
5. upgrade choice projection에서 production speed choice가 구매 가능/부족/완료 상태와 CTA를 갖게 한다.
6. visual gate에서 주문 납품 후 `작업 간식 강화` 구매와 rate 상승을 검증한다.
7. Browser Use QA와 `reports/visual/` evidence를 남긴다.

## 수용 기준

- 첫 주문 납품 전에는 생산 속도 업그레이드가 부족/진행 상태로 보인다.
- 첫 주문 납품 후 재화가 충분하면 `작업 간식 강화`를 구매할 수 있다.
- 구매 후 `productionBoostLevel`이 저장되고 production rate가 상승한다.
- 구매 완료 상태가 action surface에서 읽힌다.
- 기존 save는 migration을 통해 정상 로드된다.
- 399x666 짧은 viewport에서 panel internal scroll과 bottom tab overlap이 없다.
- `npm run check:visual`, `npm run check:ci`가 통과한다.

## 검증 명령

- `npm run build` PASS
- Browser Use in-app QA PASS: `reports/visual/p0-production-speed-upgrade-loop-v0-browser-use-20260429.png`
- `npm run check:visual -- --grep "생산 속도 업그레이드|짧은 모바일|모바일 자동 생산과 첫 주문"` PASS
- `npm run check:visual` PASS
- `npm run check:ci` PASS

## 안전 범위

- 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음.
- 새 dependency 없음.
- runtime image generation 없음.
- Branch protection 우회 없음.
