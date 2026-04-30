# Comeback growth progress nudge v0

Status: completed
Branch: `codex/0101-comeback-growth-progress-nudge-v0`
Issue: #182

## Game Studio route

- `game-studio:game-studio`
- `game-studio:game-ui-frontend`
- `game-studio:game-playtest`

## Context

Issue #180으로 복귀 one-tap plant 직후 심기 성공 toast는 최신 player action을 말하게 되었다. 다음 작은 마찰은 정원 `다음 행동` 패널이 active plot을 “성장 중”으로만 말하고, 현재 성장률과 남은 시간을 수치로 보여주지 않는 점이다. 복귀 후 30초 안의 다음 행동을 강화하려면 재심기 직후 `밭을 톡톡하면 성장 시간이 줄어든다`는 사실이 패널 안에서 바로 읽혀야 한다.

## Plan

1. `getNextAction`이 active plot의 seed, progress, remaining seconds를 계산하도록 확장한다.
2. active plot copy를 `현재 n% · 약 n초 남음. 밭을 톡톡하면 성장 시간이 줄어듭니다.` 형태로 갱신한다.
3. one-tap plant QA route에서 다음 행동 패널 copy를 focused visual test로 고정한다.
4. Browser Use `iab`로 실제 화면을 확인하고 `reports/visual/`에 screenshot/report evidence를 저장한다.
5. full visual, CI, dashboard 검증을 통과시킨다.

## Acceptance

- [x] one-tap plant 직후 `다음 행동` 패널에 `방울새싹 씨앗 성장 중`이 보인다.
- [x] 같은 패널 copy에 현재 성장률과 남은 시간이 보인다.
- [x] Browser Use `iab` evidence가 남는다.
- [x] focused visual, full visual, CI가 통과한다.

## Verification

- [x] Browser Use `iab`, session `🔎 0101 comeback growth progress QA`
- [x] `npm run check:visual -- --grep "복귀 심기 후 성장 진행 안내"`
- [x] `npm run check:visual`
- [x] `npm run update:dashboard && npm run check:dashboard && npm run check:ci`

## Evidence

- `reports/visual/p0-comeback-growth-progress-nudge-v0-20260430.md`
- `reports/visual/p0-comeback-growth-progress-nudge-browser-use-20260430.png`
- `reports/visual/p0-comeback-growth-progress-nudge-playwright-20260430.png`

## Risks

- 모바일 action panel 문구가 길어져 playfield 아래 정보를 밀 수 있다. Browser Use와 visual screenshot에서 첫 화면 밀도를 확인한다.
