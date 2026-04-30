# Comeback one-tap seed spend v0

Status: completed
Work type: game_loop
Branch: `codex/0097-comeback-one-tap-seed-spend-v0`
Date: 2026-04-30
Issue: #174

## 문제 / 배경

#172에서 복귀 보상 modal의 다음 씨앗 CTA가 seeds 탭 목표 row로 이동하게 됐다. 하지만 복귀 직후 플레이어가 충분한 잎을 갖고 있어도 아직 구매 버튼을 다시 찾아 눌러야 한다. 보상 -> 소비 전환을 더 짧게 만들려면 modal 안에서 다음 목표 씨앗을 바로 구매할 수 있어야 한다.

## Small win

`?qaOfflineMinutes=60&qaLunarGuardian=1&qaReset=1`의 복귀 보상 modal에서 `방울새싹 씨앗 바로 구매`를 누르면 보상 modal이 닫히고 seeds 탭 목표 row가 `보유 1개`와 `열린 밭에 바로 심을 수 있어요` 상태로 이어진다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route:
  - `game-studio:web-game-foundations`: 기존 seed purchase guard와 save schema를 재사용한다.
  - `game-studio:game-ui-frontend`: comeback modal primary CTA를 행동형 spend CTA로 승격하고 fallback 보기 CTA를 유지한다.
  - `game-studio:game-playtest`: visual gate로 modal purchase, tab 전환, leaf/inventory state, 목표 row status를 확인한다.
- Player verb: 복귀 보상으로 바로 다음 씨앗을 산다.
- Core loop role: comeback reward -> spend -> replant setup -> next collection.
- Screen moment: `?qaOfflineMinutes=60&qaLunarGuardian=1&qaReset=1`.

## Plan

1. comeback modal에서 다음 목표 씨앗을 구매할 수 있는지 계산한다.
2. 구매 가능하면 primary CTA를 `씨앗 바로 구매`로 표시하고 기존 `buySeed` guard를 재사용한다.
3. 구매 후 modal을 닫고 `seeds` 탭으로 이동해 목표 row의 보유/심기 가능 상태를 보여준다.
4. visual test, report, roadmap, dashboard, GitHub evidence를 갱신한다.

## 수용 기준

- [x] 복귀 보상 modal에 구매 가능한 다음 목표 씨앗 primary CTA가 보인다.
- [x] CTA 클릭 시 기존 seed purchase logic을 통해 잎이 차감되고 seed inventory가 증가한다.
- [x] CTA 클릭 후 modal이 사라지고 seeds 탭이 열린다.
- [x] seeds 탭의 목표 row가 `보유 1개`와 `열린 밭에 바로 심을 수 있어요`를 보여준다.
- [x] `npm run check:visual -- --grep "복귀 보상 씨앗 바로 구매"`와 `npm run check:ci`가 통과한다.

## 검증 명령

- [x] Browser Use `iab` PASS, session `🔎 0097 comeback one-tap QA`
- [x] `npm run check:visual -- --grep "복귀 보상 씨앗 바로 구매"` PASS, 1 test
- [x] `npm run check:visual` PASS, 26 tests
- [x] `npm run update:dashboard && npm run check:dashboard && npm run check:ci` PASS

## Evidence

- Visual report: `reports/visual/p0-comeback-one-tap-seed-spend-v0-20260430.md`
- Browser Use screenshot: `reports/visual/p0-comeback-one-tap-seed-spend-browser-use-20260430.png`
- Screenshot: `reports/visual/p0-comeback-one-tap-seed-spend-v0-20260430.png`

## 안전 범위

- 새 save schema migration 없음.
- 새 asset 생성 없음.
- seed price, offline reward 수치, offline cap 재튜닝 없음.
- 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음.
