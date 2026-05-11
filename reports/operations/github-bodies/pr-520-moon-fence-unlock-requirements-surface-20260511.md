# 월정 문 unlock requirements surface

## 요약

`월정 문 단서 보기` 이후 player verb `개방 조건 보기`를 추가하고, 클릭 후 월정 문 unlock requirements를 playfield/HUD/objective/telemetry/checker에 고정합니다.

- `GardenState`에 월정 문 요구 조건 visibility, inspected, required/current clue/material, required explorer telemetry를 추가했습니다.
- Phaser action rail에 `개방 조건 보기`를 연결하고, 실행 후 `오로 explorer · 달빛 단서 1/2 · 재료 2/3` 상태를 보여줍니다.
- `scripts/check-phaser-foundation.mjs`가 route action 이후 requirements action click, telemetry, HUD/objective, screenshot evidence를 검증합니다.

## Small win

locked route가 단순 잠김 표식에서 멈추지 않고, 플레이어가 다음에 무엇을 모아야 하는지 바로 확인할 수 있습니다.

## 사용자/운영자 가치

사용자는 `월정 문`이 왜 잠겼는지와 다음 목표(`오로 explorer`, 달빛 단서, 재료)를 이해할 수 있습니다. 운영자는 #519 이후 route preview가 progression affordance 없이 멈추는 gap을 telemetry와 screenshot checker로 회귀 방지할 수 있습니다.

## Before / After 또는 Visual evidence

- Before: #519는 `월정 문 단서 보기`와 `expedition_moon_fence_locked` preview까지만 제공했습니다.
- After: `개방 조건 보기` action 후 `오로 explorer · 달빛 단서 1/2 · 재료 2/3` 요구 조건이 objective/HUD/playfield/telemetry에 남습니다.
- Route action screenshot: `reports/visual/issue-0520-moon-fence-unlock-requirements-surface/phaser-check-moon-fence-route-action-393.png`
- Requirements screenshot: `reports/visual/issue-0520-moon-fence-unlock-requirements-surface/phaser-check-moon-fence-requirements-393.png`
- Visual report: `reports/visual/issue-0520-moon-fence-unlock-requirements-surface/visual-report-20260511.md`
- Browser Use blocker: `reports/visual/issue-0520-moon-fence-unlock-requirements-surface/browser-use-blocker-20260511.md`

## Playable mode

- Feature branch 검증: `npm run check:phaser`
- Stable main playable은 별도 worktree 기준으로 유지합니다.
- 권장 확인 경로: `npm run play:main`, `cd ../strange-seed-shop-play`, `npm run dev:legacy -- --host 127.0.0.1 --port 5174`

## 검증

- [x] `npm run build:phaser`
- [x] `npm run check:phaser`
- [x] `npm run check:content`
- [x] `npm run check:asset-provenance`
- [x] `npm run check:asset-style`
- [x] `npm run check:ci`
- [x] `git diff --check`

## 안전 범위

- Phaser local state/action/render/checker 범위입니다.
- Runtime image generation/API/cache 호출을 추가하지 않았습니다.
- 새 accepted manifest asset 없이 existing expedition gate/night-glass FX와 compact requirements chip을 사용합니다.
- 실제 route unlock/spend/economy consume은 후속 slice로 분리합니다.

## 남은 위험

- requirements chip이 수동 플레이에서 좁게 느껴질 수 있습니다. 그러면 후속 WorkUnit에서 dedicated route requirements panel 또는 route marker asset으로 분리해야 합니다.
- 이번 PR은 unlock 조건을 보여주는 surface이며, 실제 `월정 문` unlock 실행은 포함하지 않습니다.

## 작업 checklist

- [x] Game Studio route 기록
- [x] WorkUnit plan-first 완료
- [x] Browser Use 우선 시도 및 현재 세션 blocker 기록
- [x] Playwright fallback screenshot/telemetry evidence 기록
- [x] 로컬 검증 통과
- [ ] PR checks 통과
- [ ] Ready 전환
- [ ] Merge
- [ ] Main CI 관찰

## 연결된 issue

Closes #520
