# Research expedition start v0

Status: completed
Work type: game_loop
Branch: `codex/0091-research-expedition-start-v0`
Date: 2026-04-29
Issue: #162

## 문제 / 배경

#160에서 연구 완료 후 `달빛 흔적 찾기` 연구 원정 preview가 보이지만, 조건을 만족했을 때 실제로 시작하는 player verb는 아직 없다. 장기 메타는 preview만으로는 약하고, 시작 가능한 상태에서 action으로 닫혀야 한다.

## Small win

`?qaResearchExpeditionReady=1&qaTab=expedition`에서 `달빛 흔적 찾기 시작`을 눌러 `moon_hint` 원정을 active expedition으로 만들 수 있다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route:
  - `game-studio:web-game-foundations`: 기존 `activeExpedition` save 구조로 연구 원정을 시작한다.
  - `game-studio:game-ui-frontend`: 원정 탭 안에만 start verb를 추가해 playfield를 보호한다.
  - `game-studio:game-playtest`: Browser Use와 visual gate로 시작 전/후 상태를 검증한다.
- Player verb: 연구 원정 시작, 진행 상태 확인.
- Core loop role: 연구 완료 -> 두 번째 생명체 발견 -> 장기 원정 시작.
- Screen moment: `?qaResearchExpeditionReady=1&qaTab=expedition`.

## Plan

1. `startExpedition`을 expedition id를 받을 수 있는 helper로 확장한다.
2. `moon_hint` 조건을 만족하면 연구 원정 start button을 표시한다.
3. `qaResearchExpeditionReady=1` save를 추가한다.
4. visual gate와 Browser Use evidence를 남긴다.
5. roadmap/dashboard를 갱신한다.

## 수용 기준

- [x] `?qaResearchExpeditionReady=1&qaTab=expedition`에서 `달빛 흔적 찾기`가 시작 가능 상태로 보인다.
- [x] `달빛 흔적 찾기 시작`을 누르면 active expedition이 `moon_hint`로 저장되고 진행 상태가 보인다.
- [x] 기존 첫 원정 시작/진행/완료 상태가 깨지지 않는다.
- [x] Browser Use evidence와 visual report가 `reports/visual/`에 남는다.
- [x] `npm run check:ci`가 통과한다.

## 검증 명령

- [x] Browser Use QA: `http://127.0.0.1:5175/?qaResearchExpeditionReady=1&qaTab=expedition`
- [x] `npm run check:visual -- --grep "연구 원정 시작"`
- [x] `npm run check:visual`
- [x] `npm run check:ci`

## Evidence

- Browser Use screenshot: `reports/visual/p0-research-expedition-start-v0-browser-use-20260429.png`
- Visual report: `reports/visual/p0-research-expedition-start-v0-20260429.md`
- Playwright screenshot: `reports/visual/p0-research-expedition-start-v0-20260429.png`

## 안전 범위

- save schema migration 없음.
- reward tuning 변경 없음.
- assets 변경 없음.
- 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음.
