# Comeback next-action bridge v0

Status: completed
Work type: game_loop
Branch: `codex/0096-comeback-next-action-bridge-v0`
Date: 2026-04-30
Issue: #172

## 문제 / 배경

#170에서 오프라인 복귀 보상이 시간, 잎, 달빛 수호 bonus를 보여주는 modal로 승격됐다. 하지만 CTA는 아직 modal을 닫는 `보상 확인`뿐이라, PRD의 "claim and spend comeback rewards in under 30 seconds"까지는 약하다. 복귀 보상 직후 다음 도감 목표 씨앗으로 이동하는 CTA를 붙이면 보상 -> 소비 -> 다음 수집 루프가 닫힌다.

## Small win

`?qaOfflineMinutes=60&qaLunarGuardian=1&qaReset=1`의 복귀 보상 modal에서 실제 `nextCreatureGoal.seed.name` CTA를 누르면 modal이 닫히고 씨앗 탭의 다음 목표 row로 이동한다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route:
  - `game-studio:web-game-foundations`: 기존 next creature goal 계산과 tab state만 사용한다.
  - `game-studio:game-ui-frontend`: comeback modal 안에 primary next-action CTA를 추가하되 보상 확인 보조 CTA를 유지한다.
  - `game-studio:game-playtest`: visual gate로 modal CTA, tab 전환, 목표 row visibility를 확인한다.
- Player verb: 복귀 보상 확인 후 바로 다음 씨앗 행동으로 이동.
- Core loop role: comeback reward -> spend/replant -> next collection.
- Screen moment: `?qaOfflineMinutes=60&qaLunarGuardian=1&qaReset=1`.

## Plan

1. comeback modal에서 `nextCreatureGoal`이 있으면 다음 씨앗 CTA를 보여준다.
2. CTA 클릭 시 modal을 닫고 `seeds` 탭으로 이동한다.
3. visual test에서 CTA 클릭 후 씨앗 탭과 다음 목표 row를 확인한다.
4. report, roadmap, dashboard, GitHub evidence를 갱신한다.

## 수용 기준

- [x] 복귀 보상 modal에 다음 목표 씨앗 CTA가 보인다.
- [x] CTA는 `nextCreatureGoal.seed.name`을 사용한다.
- [x] CTA 클릭 후 modal이 사라지고 seeds 탭이 열린다.
- [x] seeds 탭의 `다음 도감 목표 씨앗` row가 보인다.
- [x] `npm run check:visual -- --grep "복귀 다음 행동"`과 `npm run check:ci`가 통과한다.

## 검증 명령

- [x] `npm run check:visual -- --grep "복귀 다음 행동"` PASS, 1 test
- [x] `npm run check:visual` PASS, 25 tests
- [x] `npm run check:ci` PASS

## Evidence

- Visual report: `reports/visual/p0-comeback-next-action-bridge-v0-20260430.md`
- Screenshot: `reports/visual/p0-comeback-next-action-bridge-v0-20260430.png`

## 안전 범위

- 새 save schema migration 없음.
- 새 asset 생성 없음.
- offline reward 수치와 cap 재튜닝 없음.
- 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음.
