# Garden action surface v0

Status: active
Work type: game_ui
Branch: `codex/0080-garden-action-surface-v0`
Date: 2026-04-29
Issue: #140

## 문제 / 배경

정원 기본 화면의 하단 `starter-panel`은 생산 카드, 주문 카드, 다음 생명체 카드, 씨앗 행동, 힌트, 소유 카드, 업그레이드 CTA를 한 작은 패널에 쌓는다. 모바일에서는 이것이 “작은 영역을 스크롤해서 게임하는” 구조로 읽히며, `docs/GAME_UI_UX_RESEARCH_20260428.md`의 Playfield first, One immediate action, low persistent HUD 원칙과 `docs/IDLE_CORE_CREATIVE_GUIDE.md`의 Production UI Bar를 만족하지 못한다.

## Small win

정원 기본 화면의 하단 패널을 “다음 행동 설명 박스”가 아니라 현재 한 가지 게임 동사를 수행하는 action surface로 바꾼다. 자동 생산/첫 주문/다음 생명체 정보는 모바일 첫 화면에서 읽히되, playfield와 CTA를 밀어내는 긴 스크롤 카드가 되지 않게 한다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route:
  - `game-studio:game-ui-frontend`: HUD density, action dock, playfield protection, mobile game frame
  - `game-studio:game-playtest`: first actionable screen, main verbs, HUD readability, playfield obstruction
  - `game-studio:web-game-foundations`: React HUD/surface와 Phaser playfield boundary 유지
- 북극성/플레이어 동사: 심기, 수확, 생산 잎 수령, 주문 납품, 다음 생명체 준비가 “한 화면에서 무슨 행동을 해야 하는지”로 읽혀야 한다.
- Playfield 보호 또는 UI surface 원칙: 하단 surface는 playfield를 덮거나 내부 스크롤을 만들지 않고, 단일 primary CTA와 보조 상태 chip 중심으로 구성한다.
- Playtest evidence 계획: Browser Use로 `?qaProductionReady=1` 모바일 화면을 확인하고, `npm run check:visual`로 body scroll, panel scroll, CTA/readability regression을 검증한다.

## Plan

1. `src/App.tsx`의 `starter-panel` 내용을 primary action surface 구조로 재배치한다.
2. 생산/주문 상태에서 가장 중요한 CTA를 하나의 primary action으로 노출하고, 다음 생명체/도감 목표는 compact goal strip으로 낮춘다.
3. 모바일 CSS에서 `starter-panel` 내부 스크롤 의존을 제거하고, panel 높이/밀도/텍스트 줄 수를 안정화한다.
4. visual test가 `starter-panel`의 scrollHeight/clientHeight뿐 아니라 primary CTA visibility와 production/goal compact surface를 검증하게 한다.
5. Browser Use screenshot과 `reports/visual/` evidence를 남긴다.

## 수용 기준

- 모바일 정원 기본 화면에서 `starter-panel` 내부 스크롤이 생기지 않는다.
- `?qaProductionReady=1`에서 자동 생산/첫 주문 상태가 흐린 작은 카드가 아니라 action surface의 주 동사로 읽힌다.
- 정원 첫 화면에서 primary CTA가 하나 이상 44px 이상 터치 영역으로 보인다.
- 다음 생명체 목표는 보조 compact strip으로 보이며 playfield와 CTA를 밀어내지 않는다.
- Phaser playfield의 input/runtime 계약과 save/economy/content 계약을 바꾸지 않는다.
- Browser Use evidence와 `npm run check:visual`, `npm run check:ci`가 통과한다.

## 검증 명령

- Browser Use: `http://127.0.0.1:5175/?qaProductionReady=1`
- `npm run check:visual`
- `npm run check:ci`

## 안전 범위

- 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음
- 새 dependency 없음
- runtime image generation 없음
- Branch protection 우회 없음
