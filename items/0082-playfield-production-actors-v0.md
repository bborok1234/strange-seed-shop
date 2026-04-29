# Playfield production actors v0

Status: completed
Work type: game_ui_runtime
Branch: `codex/0082-playfield-production-actors-v0`
Date: 2026-04-29
Issue: #144

## 문제 / 배경

North Star production bar는 첫 화면에서 생산 엔진이 보여야 한다고 규정한다. 현재 정원은 자동 생산/주문 상태가 action surface와 status badge에는 보이지만, playfield 안의 장면은 여전히 밭 카드 중심이다. 플레이어가 “생명체가 실제로 정원을 움직인다”고 느끼려면 work creature, order crate, 생산/주문 진행이 board 안의 scene element로 보여야 한다.

## Small win

`?qaProductionReady=1` 정원 playfield 안에 말랑잎 포리 work actor, 주문 상자, 주문 진행 chip을 추가해 production engine이 하단 카드가 아니라 정원 장면 안에서 읽히게 한다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route:
  - `game-studio:web-game-foundations`: save/economy state는 App이 소유하고 playfield는 projection만 렌더링한다.
  - `game-studio:game-ui-frontend`: playfield 중심 production lane, HUD density, 짧은 mobile viewport 보호.
  - `game-studio:game-playtest`: first actionable screen, production readability, HUD obstruction screenshot.
  - `game-studio:phaser-2d-game`: Phaser runtime boundary를 유지하고 overlay/input surface를 명확히 한다.
  - `game-studio:sprite-pipeline`: existing work/celebrate/crate/FX assets를 runtime scene use로 연결한다.
- Player verb: 생산 잎 수령, 첫 주문 납품, 다음 생명체 준비.
- Core loop role: 생명체가 정원 생산에 참여 -> 자동 생산 -> 주문 납품 -> 다음 해금 목표.
- Screen moment: `?qaProductionReady=1` 첫 정원 화면과 생산 수령/주문 납품 직후.
- Asset/FX need: `creature_herb_common_001_work`, `ui_order_crate_leaf_001`, existing production/order FX.
- Playtest evidence: mobile 393, short 399x666 screenshot에서 actor lane이 보이고 action surface가 잘리지 않아야 한다.

## Plan

1. `GardenPlayfieldViewModel`에 production scene projection을 추가한다.
2. `App.tsx`에서 production status와 manifest asset path를 playfield view model로 전달한다.
3. `GardenPlayfieldHost`의 React board overlay에 production actor lane을 렌더링한다.
4. 모바일/짧은 viewport CSS를 조정해 actor lane이 plot card와 action surface를 밀어내지 않게 한다.
5. visual gate가 production actor, order crate, short viewport를 검증하게 한다.
6. Browser/in-app evidence 또는 Playwright fallback evidence를 `reports/visual/`에 남긴다.

## 수용 기준

- `?qaProductionReady=1` 정원 playfield 안에 work creature와 order crate가 보인다.
- production lane은 plot card를 가리지 않고 399x666 짧은 viewport에서도 action surface를 탭 뒤로 밀어내지 않는다.
- 보이는 plot card click/tap telemetry는 유지된다.
- 하단 action surface의 생산 수령/주문 납품 CTA는 44px 이상 터치 영역을 유지한다.
- save/economy/content 계약을 바꾸지 않는다.
- `npm run check:visual`, `npm run check:ci`가 통과한다.

## 검증 명령

- `npm run build` PASS
- `npm run check:visual -- --grep "짧은 모바일|모바일 자동 생산과 첫 주문|모바일 성장 밭 탭|모바일 ready 밭 수확"` PASS
- Browser Use in-app tab QA PASS: `reports/visual/p0-playfield-production-actors-v0-browser-use-20260429.png`
- `npm run check:visual` PASS
- `npm run check:ci` PASS

## 안전 범위

- 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음.
- 새 dependency 없음.
- runtime image generation 없음.
- Branch protection 우회 없음.
