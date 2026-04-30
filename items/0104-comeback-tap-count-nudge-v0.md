# Comeback tap count nudge v0

Status: completed
Branch: `codex/0104-comeback-tap-count-nudge-v0`
Issue: #188

## Game Studio route

- `game-studio:game-studio`
- `game-studio:game-ui-frontend`
- `game-studio:game-playtest`

## Context

Issue #184/#186으로 복귀 one-tap plant 후 action copy와 tap feedback 모두 `4초 단축` payoff를 말한다. 남은 마찰은 플레이어가 “그래서 몇 번 정도 더 누르면 수확 준비인지”를 계산해야 한다는 점이다. 복귀 후 30초 안에 다음 수확 목표를 더 직접적으로 만들려면 남은 tap 횟수 추정치를 copy에 붙인다.

## Plan

1. active plot next-action body에 `Math.ceil(secondsRemaining / tapReductionSeconds)` 기반 남은 tap 횟수를 추가한다.
2. copy는 `약 n번 더 톡톡하면 수확 준비 · 1회 n초 단축`처럼 compact하게 유지한다.
3. 복귀 one-tap plant visual test가 tap count와 1회 단축 copy를 확인하게 한다.
4. Browser Use `iab`, focused visual, full visual, CI evidence를 남긴다.

## Acceptance

- [x] one-tap plant 후 active growth copy에 `약 n번 더 톡톡하면 수확 준비`가 보인다.
- [x] 같은 copy에 `1회 4초 단축`이 보인다.
- [x] Browser Use `iab` evidence가 남는다.
- [x] focused visual, full visual, CI가 통과한다.

## Verification

- [x] Browser Use `iab`, session `🔎 0104 comeback tap count QA`
- [x] `npm run check:visual -- --grep "복귀 심기 후 성장 진행 안내"`
- [x] `npm run check:visual`
- [x] `npm run update:dashboard && npm run check:dashboard && npm run check:ci`

## Evidence

- `reports/visual/p0-comeback-tap-count-nudge-v0-20260430.md`
- `reports/visual/p0-comeback-tap-count-nudge-browser-use-20260430.png`
- `reports/visual/p0-comeback-tap-count-nudge-playwright-20260430.png`

## Risks

- 모바일 compact copy가 길어질 수 있다. Browser Use와 visual screenshot에서 줄바꿈과 playfield 가림을 확인한다.
