# Comeback one-tap plant v0

Status: completed
Work type: game_loop
Branch: `codex/0099-comeback-one-tap-plant-v0`
Date: 2026-04-30
Issue: #178

## 문제 / 배경

#174에서 복귀 보상 modal에서 다음 목표 씨앗을 바로 구매할 수 있게 됐다. 하지만 플레이어는 아직 seeds 탭 목표 row에서 `심기`를 한 번 더 눌러야 한다. 복귀 후 30초 안에 다음 행동을 시작시키려면, 열린 밭이 있을 때 명시적인 `구매하고 심기` CTA로 보상 -> 소비 -> 재심기까지 이어질 수 있어야 한다.

## Small win

`?qaOfflineMinutes=60&qaLunarGuardian=1&qaReset=1`의 복귀 보상 modal에서 `방울새싹 씨앗 구매하고 심기`를 누르면 잎이 차감되고 `방울새싹 씨앗`이 열린 밭에 심긴 뒤 정원 화면으로 돌아온다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route:
  - `game-studio:web-game-foundations`: 기존 `buySeed`/`plantOwnedSeed` guard와 동일한 조건을 단일 transaction으로 적용한다.
  - `game-studio:game-ui-frontend`: comeback modal primary CTA를 명시적 `구매하고 심기` 행동으로 승격하고 보기/구매 fallback을 유지한다.
  - `game-studio:game-playtest`: Browser Use `iab`와 visual gate로 modal CTA, 정원 복귀, plot planting state를 확인한다.
- Player verb: 복귀 보상으로 다음 씨앗을 바로 사고 심는다.
- Core loop role: comeback reward -> spend -> replant -> next collection timer.
- Screen moment: `?qaOfflineMinutes=60&qaLunarGuardian=1&qaReset=1`.

## Plan

1. 다음 목표 씨앗을 구매하고 심을 수 있는지 계산한다.
2. 구매 가능하고 열린 밭이 있으면 comeback modal에 `구매하고 심기` primary CTA를 보여준다.
3. CTA 클릭 시 하나의 commit에서 잎 차감, seed inventory 증가/소비, 열린 밭 planting을 수행한다.
4. Browser Use `iab`, visual gate, CI, report, roadmap, GitHub evidence를 갱신한다.

## 수용 기준

- [x] 복귀 보상 modal에 `방울새싹 씨앗 구매하고 심기` CTA가 보인다.
- [x] CTA 클릭 시 modal이 사라지고 garden 화면이 보인다.
- [x] Browser Use에서 잎이 75가 되고 playfield가 `방울새싹 씨앗` 성장 상태를 보여준다.
- [x] Browser Use `iab` evidence가 남았다.
- [x] `npm run check:visual -- --grep "복귀 보상 씨앗 구매하고 심기"`가 통과한다.
- [x] `npm run check:visual`이 통과한다.
- [x] `npm run check:ci`가 통과한다.

## 검증 명령

- [x] Browser Use `iab` PASS, session `🔎 0099 comeback one-tap plant QA`
- [x] `npm run check:visual -- --grep "복귀 보상 씨앗 구매하고 심기"` PASS, 1 test
- [x] `npm run check:visual` PASS, 27 tests
- [x] `npm run update:dashboard && npm run check:dashboard && npm run check:ci` PASS

## Evidence

- Visual report: `reports/visual/p0-comeback-one-tap-plant-v0-20260430.md`
- Browser Use screenshot: `reports/visual/p0-comeback-one-tap-plant-browser-use-20260430.png`
- Playwright screenshot: `reports/visual/p0-comeback-one-tap-plant-playwright-20260430.png`

## 안전 범위

- 새 save schema migration 없음.
- 새 asset 생성 없음.
- seed price, offline reward 수치, offline cap 재튜닝 없음.
- 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음.
