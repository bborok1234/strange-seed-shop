# Comeback reward breakdown v0

Status: completed
Work type: game_loop
Branch: `codex/0095-comeback-reward-breakdown-v0`
Date: 2026-04-30
Issue: #170

## 문제 / 배경

#168에서 `달방울 누누` 발견 상태가 오프라인 복귀 보상 bonus와 toast 문구로 이어졌다. 하지만 PRD의 첫 복귀 계약은 15분 이상 이탈 후 시간, 획득 잎, 추가 보상, 추천 다음 행동을 보여주는 comeback modal이다. 현재는 toast 한 줄이라 복귀 순간의 보상감과 다음 행동 연결이 약하다.

## Small win

`?qaOfflineMinutes=60&qaLunarGuardian=1&qaReset=1`에서 `오프라인 복귀 보상` 화면이 시간, 잎 보상, 달빛 수호 bonus, 다음 행동 CTA를 보여준다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route:
  - `game-studio:web-game-foundations`: 기존 offline reward 계산 결과를 UI summary로 전달하고 save schema migration은 만들지 않는다.
  - `game-studio:game-ui-frontend`: 복귀 순간에만 뜨는 compact modal로 구성하고 확인 후 playfield를 돌려준다.
  - `game-studio:game-playtest`: mobile viewport screenshot과 visual gate로 modal readability, CTA, playfield 복귀를 확인한다.
- Player verb: 돌아와 보상 확인, 수호자 bonus 이해, 정원 행동으로 복귀.
- Core loop role: comeback hook -> 보상감 -> 다음 행동.
- Screen moment: `?qaOfflineMinutes=60&qaLunarGuardian=1&qaReset=1`.

## Plan

1. offline reward result에 away time label과 guardian summary를 포함할 수 있게 한다.
2. 기존 toast와 별도로 15분 이상 reward를 compact comeback modal로 표시한다.
3. modal CTA는 보상을 닫고 정원 action surface/playfield를 다시 보게 한다.
4. visual gate에 달빛 guardian comeback modal test를 추가한다.
5. report, roadmap, dashboard, GitHub evidence를 갱신한다.

## 수용 기준

- [x] `?qaOfflineMinutes=60&qaLunarGuardian=1&qaReset=1`에서 `오프라인 복귀 보상` modal이 보인다.
- [x] modal은 `1시간`, `90 잎`, `달방울 누누`, `+20%`를 보여준다.
- [x] `보상 확인`을 누르면 modal이 사라지고 정원 playfield가 다시 보인다.
- [x] 일반 offline QA의 보상 계산은 기존 기준을 유지한다.
- [x] `npm run check:visual -- --grep "복귀 보상"`과 `npm run check:ci`가 통과한다.

## 검증 명령

- [x] `npm run check:visual -- --grep "복귀 보상"` PASS, 1 test
- [x] `npm run check:visual` PASS, 24 tests
- [x] `npm run check:ci` PASS

## Evidence

- Visual report: `reports/visual/p0-comeback-reward-breakdown-v0-20260430.md`
- Screenshot: `reports/visual/p0-comeback-reward-breakdown-v0-20260430.png`

## 안전 범위

- 새 save schema migration 없음.
- 새 asset 생성 없음.
- offline reward 수치와 cap 재튜닝 없음.
- 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음.
