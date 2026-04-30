# Comeback plant success nudge v0

Status: completed
Work type: game_loop
Branch: `codex/0100-comeback-plant-success-nudge-v0`
Date: 2026-04-30
Issue: #180

## 문제 / 배경

#178에서 복귀 보상 modal의 `구매하고 심기` CTA가 정원 playfield 성장 상태까지 닫혔다. 하지만 CTA 클릭 후 상단 toast는 여전히 오프라인 보상 수령 문구만 남아 있어, 플레이어가 방금 씨앗을 심었고 밭을 탭해 성장시킬 수 있다는 즉시 피드백이 약하다.

## Small win

`방울새싹 씨앗 구매하고 심기`를 누른 뒤 정원 화면 상단 toast가 `방울새싹 씨앗을 바로 심었어요. 밭을 톡톡 두드려 성장시켜요.`를 보여준다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route:
  - `game-studio:game-ui-frontend`: comeback CTA 후 성공 toast가 다음 player verb를 짧게 안내한다.
  - `game-studio:game-playtest`: Browser Use `iab`와 visual gate로 toast, 정원 복귀, playfield planting state를 확인한다.
- Player verb: 복귀 후 구매하고 심은 씨앗을 바로 탭해 성장시킨다.
- Core loop role: comeback reward -> spend -> replant -> tap growth.
- Screen moment: `?qaOfflineMinutes=60&qaLunarGuardian=1&qaReset=1`.

## Plan

1. `buyAndPlantComebackGoalSeed` 성공 후 offline toast를 심기 성공/탭 성장 안내 문구로 바꾼다.
2. visual test에서 CTA 클릭 후 성공 toast와 정원 playfield를 확인한다.
3. Browser Use `iab`, visual gate, CI, report, roadmap, GitHub evidence를 갱신한다.

## 수용 기준

- [x] `구매하고 심기` 클릭 후 modal이 사라지고 garden 화면이 보인다.
- [x] 상단 toast가 심기 성공과 tap growth 다음 행동을 안내한다.
- [x] Browser Use `iab` evidence가 남는다.
- [x] `npm run check:visual -- --grep "복귀 심기 성공 안내"`가 통과한다.
- [x] `npm run check:ci`가 통과한다.

## 검증 명령

- [x] Browser Use `iab` PASS, session `🔎 0100 comeback plant nudge QA`
- [x] `npm run check:visual -- --grep "복귀 심기 성공 안내"` PASS, 1 test
- [x] `npm run check:visual` PASS, 28 tests
- [x] `npm run update:dashboard && npm run check:dashboard && npm run check:ci` PASS

## Evidence

- Visual report: `reports/visual/p0-comeback-plant-success-nudge-v0-20260430.md`
- Browser Use screenshot: `reports/visual/p0-comeback-plant-success-nudge-browser-use-20260430.png`
- Playwright screenshot: `reports/visual/p0-comeback-plant-success-nudge-playwright-20260430.png`

## 안전 범위

- 새 save schema migration 없음.
- 새 asset 생성 없음.
- seed price, offline reward 수치, offline cap 재튜닝 없음.
- 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음.
