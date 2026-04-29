# Upgrade choice surface v0

Status: completed
Work type: game_ui_runtime
Branch: `codex/0083-upgrade-choice-surface-v0`
Date: 2026-04-29
Issue: #146

## 문제 / 배경

North Star production bar는 첫 화면에 production engine뿐 아니라 upgrade choice가 있어야 한다고 규정한다. 현재 두 번째 밭 업그레이드는 하단 support stack 끝의 단일 버튼이라, 생산/주문 보상이 다음 성장 선택으로 이어지는 idle tycoon 감각이 약하다.

## Small win

`?qaProductionReady=1` 정원 action surface에 compact upgrade choice 영역을 추가해 플레이어가 “다음 투자는 밭 확장, 생산 속도, 주문 준비 중 무엇인가”를 한눈에 읽게 한다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route:
  - `game-studio:web-game-foundations`: 신규 save/economy 계약 없이 existing upgrade/production/order state를 projection한다.
  - `game-studio:game-ui-frontend`: production CTA 아래 compact upgrade choices를 구성하고 short mobile viewport를 보호한다.
  - `game-studio:game-playtest`: first actionable screen에서 upgrade readability와 tap target, viewport fit을 screenshot으로 검증한다.
- Player verb: 생산 잎 수령, 첫 주문 납품, 두 번째 밭 열기, 다음 성장 선택.
- Core loop role: 생산/주문 보상 -> upgrade choice -> 반복 속도 상승.
- Screen moment: `?qaProductionReady=1` 첫 정원 화면과 첫 주문 완료 직후.
- Asset/FX need: 새 asset 없음. leaf/pollen/plot 텍스트 token으로 충분하다.
- Playtest evidence: Browser Use current tab QA, mobile 393, short 399x666 visual gate.

## Plan

1. `App.tsx`에서 upgrade choice projection을 만든다.
2. 정원 action surface에 compact upgrade choice row를 추가한다.
3. 기존 두 번째 밭 primary button은 duplicate가 되지 않게 upgrade choice로 통합한다.
4. mobile/short CSS에서 production card, upgrade choice, next creature strip이 internal scroll 없이 보이게 한다.
5. visual gate가 upgrade choice와 short viewport fit을 검증하게 한다.
6. Browser Use QA와 visual/CI evidence를 report에 남긴다.

## 수용 기준

- `?qaProductionReady=1` 정원 action surface에 `다음 성장 선택` upgrade choice 영역이 보인다.
- 두 번째 밭 업그레이드는 가능/부족/완료 상태가 명확히 읽힌다.
- production rate/order progress와 upgrade choice가 한 흐름으로 읽힌다.
- 399x666 짧은 viewport에서 starter panel internal scroll이 생기지 않고 bottom tabs와 겹치지 않는다.
- save/economy/content 계약을 바꾸지 않는다.
- `npm run check:visual`, `npm run check:ci`가 통과한다.

## 검증 명령

- `npm run build` PASS
- Browser Use in-app QA PASS: `reports/visual/p0-upgrade-choice-surface-v0-browser-use-20260429.png`
- `npm run check:visual -- --grep "업그레이드 선택|짧은 모바일|모바일 자동 생산과 첫 주문"` PASS
- `npm run check:visual` PASS
- `npm run check:ci` PASS

## 안전 범위

- 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음.
- 새 dependency 없음.
- runtime image generation 없음.
- Branch protection 우회 없음.
