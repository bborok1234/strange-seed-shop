# Comeback tap feedback countdown v0

Status: completed
Branch: `codex/0105-comeback-tap-feedback-countdown-v0`
Issue: #190

## Game Studio route

- `game-studio:game-studio`
- `game-studio:game-ui-frontend`
- `game-studio:game-playtest`

## Context

Issue #188로 복귀 one-tap plant 후 action copy가 `약 n번 더 톡톡하면 수확 준비`를 보여준다. Issue #186의 tap feedback은 `4초 단축` payoff를 말하지만, tap 이후 남은 횟수는 말하지 않는다. 실제 tap 순간마다 남은 횟수가 줄어드는 느낌을 주면 복귀 후 수확까지의 짧은 반복 목표가 더 분명해진다.

## Plan

1. `GardenPlotView`에 numeric `tapReductionSeconds`를 추가한다.
2. `GardenPlayfieldHost`가 `secondsRemaining`과 `tapReductionSeconds`로 tap 후 남은 횟수를 계산한다.
3. `tap_growth` feedback detail을 `4초 단축 · 약 n번 남음` 형태로 갱신한다.
4. 복귀 tap feedback visual test와 Browser Use evidence로 실제 화면을 확인한다.

## Acceptance

- [x] one-tap plant 후 growing plot을 누르면 feedback에 `4초 단축`이 보인다.
- [x] 같은 feedback에 `약 n번 남음`이 보인다.
- [x] Browser Use `iab` evidence가 남는다.
- [x] 수확 준비 100% 상태에서 production/action surface 카드 내부가 잘리지 않는다.
- [x] focused visual, full visual, CI가 통과한다.

## Verification

- [x] Browser Use `iab`, session `🔎 0105 comeback tap feedback countdown QA`
- [x] Browser Use `iab`, session `🔎 comeback ready clipping QA`
- [x] `npm run check:visual -- --grep "복귀 심기 후 성장 탭 feedback"`
- [x] `npm run check:visual -- --grep "복귀 성장 100%"`
- [x] `npm run check:visual`
- [x] `npm run update:dashboard && npm run check:dashboard && npm run check:ci`

## Evidence

- `reports/visual/p0-comeback-tap-feedback-countdown-v0-20260430.md`
- `reports/visual/p0-comeback-tap-feedback-countdown-browser-use-20260430.png`
- `reports/visual/p0-comeback-tap-feedback-countdown-playwright-20260430.png`
- `reports/visual/p0-comeback-ready-action-surface-fix-20260430.md`
- `reports/visual/p0-comeback-ready-occlusion-browser-use-before-20260430.png`
- `reports/visual/p0-comeback-ready-action-surface-browser-use-after-20260430.png`
- `reports/operations/e2e-architecture-qa-improvement-20260430.md`

## Risks

- feedback overlay 문구가 길어질 수 있다. Browser Use와 visual screenshot에서 overlay width와 playfield 겹침을 확인한다.
