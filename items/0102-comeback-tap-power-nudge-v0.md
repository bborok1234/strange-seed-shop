# Comeback tap power nudge v0

Status: completed
Branch: `codex/0102-comeback-tap-power-nudge-v0`
Issue: #184

## Game Studio route

- `game-studio:game-studio`
- `game-studio:game-ui-frontend`
- `game-studio:game-playtest`

## Context

Issue #182로 복귀 one-tap plant 후 active growth copy가 생산형 패널에서도 보이게 됐다. 이제 copy가 현재 성장률/남은 시간은 말하지만, 탭 한 번의 효용을 숫자로 말하지 않는다. 첫 5분/복귀 30초 안의 반복 행동을 강화하려면 `밭을 톡톡하면 몇 초 줄어드는지`를 바로 보여주는 편이 낫다.

## Plan

1. active plot next-action body에 seed별 tap reduction을 추가한다.
2. `tapPowerLevel`이 있으면 기존 tap growth 계산과 같은 multiplier를 copy에도 반영한다.
3. one-tap plant visual test가 `한 번 톡톡할 때마다 4초 단축`을 확인하게 한다.
4. Browser Use `iab`, focused visual, full visual, CI evidence를 남긴다.

## Acceptance

- [x] one-tap plant 후 active growth copy에 현재 성장률과 남은 시간이 보인다.
- [x] 같은 copy에 `한 번 톡톡할 때마다 4초 단축`이 보인다.
- [x] Browser Use `iab` evidence가 남는다.
- [x] focused visual, full visual, CI가 통과한다.

## Verification

- [x] Browser Use `iab`, session `🔎 0102 comeback tap power QA`
- [x] `npm run check:visual -- --grep "복귀 심기 후 성장 진행 안내"`
- [x] `npm run check:visual`
- [x] `npm run update:dashboard && npm run check:dashboard && npm run check:ci`

## Evidence

- `reports/visual/p0-comeback-tap-power-nudge-v0-20260430.md`
- `reports/visual/p0-comeback-tap-power-nudge-browser-use-20260430.png`
- `reports/visual/p0-comeback-tap-power-nudge-playwright-20260430.png`

## Risks

- 모바일 compact copy가 길어질 수 있다. Browser Use와 visual screenshot에서 action panel 밀도를 확인한다.
