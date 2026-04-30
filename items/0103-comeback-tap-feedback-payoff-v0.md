# Comeback tap feedback payoff v0

Status: completed
Branch: `codex/0103-comeback-tap-feedback-payoff-v0`
Issue: #186

## Game Studio route

- `game-studio:game-studio`
- `game-studio:game-ui-frontend`
- `game-studio:game-playtest`

## Context

Issue #184로 복귀 one-tap plant 후 action copy가 `한 번 톡톡할 때마다 4초 단축됩니다.`를 보여준다. 하지만 실제로 plot을 누른 순간의 playfield feedback은 아직 `n번 밭이 반응했어요`만 말한다. 사전 안내와 즉시 feedback이 같은 payoff를 말하면 복귀 후 tap growth loop가 더 선명해진다.

## Plan

1. `GardenPlotView`에 plot별 `tapReductionLabel`을 추가한다.
2. `buildGardenPlayfieldViewModel`에서 seed별 tap reduction과 tap power multiplier를 계산해 전달한다.
3. `GardenPlayfieldHost`의 `tap_growth` feedback detail이 `4초 단축`을 보여주게 한다.
4. 복귀 one-tap plant visual test에서 실제 growing plot tap 후 feedback copy를 확인한다.
5. Browser Use `iab`, focused visual, full visual, CI evidence를 남긴다.

## Acceptance

- [x] one-tap plant 후 growing plot을 누르면 feedback에 `4초 단축`이 보인다.
- [x] 기존 growth telemetry/visual test는 유지된다.
- [x] Browser Use `iab` evidence가 남는다.
- [x] focused visual, full visual, CI가 통과한다.

## Verification

- [x] Browser Use `iab`, session `🔎 0103 comeback tap feedback QA`
- [x] `npm run check:visual -- --grep "복귀 심기 후 성장 탭 feedback"`
- [x] `npm run check:visual`
- [x] `npm run update:dashboard && npm run check:dashboard && npm run check:ci`

## Evidence

- `reports/visual/p0-comeback-tap-feedback-payoff-v0-20260430.md`
- `reports/visual/p0-comeback-tap-feedback-payoff-browser-use-20260430.png`
- `reports/visual/p0-comeback-tap-feedback-payoff-playwright-20260430.png`

## Risks

- feedback overlay가 짧은 모바일 화면에서 playfield 정보와 겹치지 않는지 Browser Use와 visual screenshot으로 확인한다.
