# Lunar guardian offline bonus v0

Status: completed
Work type: game_loop
Branch: `codex/0094-lunar-guardian-offline-bonus-v0`
Date: 2026-04-30
Issue: #168

## 문제 / 배경

#166에서 `달방울 씨앗` 구매/심기/수확은 `달방울 누누` 발견까지 이어졌다. 하지만 `달방울 누누`의 도감 단서인 "달빛 아래에서 오프라인 보상을 지켜준다"는 아직 실제 복귀 보상이나 문구에 반영되지 않는다. Economy contract에는 guardian role이 offline efficiency/cap 보너스를 줄 수 있다고 되어 있으므로, 달빛 생명체 획득이 comeback hook을 강화하도록 최소 수치와 QA evidence를 추가한다.

## Small win

`?qaOfflineMinutes=60&qaLunarGuardian=1`에서 일반 60분 오프라인 보상보다 높은 잎 보상과 `달방울 누누` 보호 문구가 보인다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route:
  - `game-studio:web-game-foundations`: 기존 local save offline reward 계산에 guardian multiplier를 추가하고 새 schema migration은 만들지 않는다.
  - `game-studio:game-ui-frontend`: toast 문구만 보강해 playfield와 persistent HUD를 가리지 않는다.
  - `game-studio:game-playtest`: visual gate로 일반 offline QA와 lunar guardian offline QA의 보상/문구 차이를 확인한다.
- Player verb: 게임을 닫고 돌아와 오프라인 보상을 받는다.
- Core loop role: 달빛 생명체 수집 -> comeback 보상 기대감 강화.
- Screen moment: `?qaOfflineMinutes=60&qaLunarGuardian=1`.

## Plan

1. guardian role 보유 시 offline reward multiplier를 계산하는 helper를 추가한다.
2. `달방울 누누` 발견 QA save를 오프라인 복귀 파라미터와 조합할 수 있게 한다.
3. 오프라인 toast에 달빛 보호 bonus 문구를 추가한다.
4. visual test로 일반 60분 보상과 lunar guardian 60분 보상의 차이를 검증한다.
5. report, roadmap, dashboard, issue/PR evidence를 갱신한다.

## 수용 기준

- [x] 일반 `?qaOfflineMinutes=60&qaReset=1` 보상은 기존 기준을 유지한다.
- [x] `?qaOfflineMinutes=60&qaLunarGuardian=1&qaReset=1`은 `달방울 누누` 발견 상태를 포함한다.
- [x] lunar guardian 상태의 offline leaves가 일반 상태보다 높다.
- [x] 오프라인 toast가 `달방울 누누` 또는 달빛 보호 bonus를 명확히 말한다.
- [x] `npm run check:visual -- --grep "달빛 오프라인"`과 `npm run check:ci`가 통과한다.

## 검증 명령

- [x] `npm run check:visual -- --grep "달빛 오프라인"` PASS, 1 test
- [x] `npm run check:visual` PASS, 24 tests
- [x] `npm run check:ci` PASS

## Evidence

- Visual report: `reports/visual/p0-lunar-guardian-offline-bonus-v0-20260430.md`
- Screenshot: `reports/visual/p0-lunar-guardian-offline-bonus-v0-20260430.png`

## 안전 범위

- 새 save schema migration 없음.
- 새 asset 생성 없음.
- 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음.
- Offline cap 자체 변경 없음.
