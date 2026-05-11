# 월정 문 준비 납품 material payoff

## 요약

`개방 조건 보기` 이후 player verb `월정 문 준비 납품`을 추가하고, 클릭 후 월정 문 material requirement를 `재료 3/3 ready`로 전환합니다.

- `GardenState`에 prep delivery availability/completed/crate visible/material ready telemetry를 추가했습니다.
- Phaser action rail에 `월정 문 준비 납품`을 연결하고, 실행 후 objective/HUD/receipt에 `월정 문 준비 납품 완료 · 재료 3/3 · 달빛 단서 1/2`을 남깁니다.
- Expedition gate 주변에 compact `준비 상자 · 재료 3/3` chip을 표시합니다.
- `scripts/check-phaser-foundation.mjs`가 requirements action 이후 prep delivery click, telemetry, HUD/objective, screenshot evidence를 검증합니다.

## Small win

월정 문 locked route가 요구 조건 표시에서 멈추지 않고, 부족했던 material `2/3`을 정원 화면 안의 납품 행동으로 `3/3 ready`까지 채웁니다.

## 사용자/운영자 가치

사용자는 `재료는 준비됨, 달빛 단서는 아직 부족`이라는 다음 blocker를 이해할 수 있습니다. 운영자는 월정 문 route unlock 전 단계의 material readiness를 telemetry와 screenshot checker로 회귀 방지할 수 있습니다.

## Before / After 또는 Visual evidence

- Before: #520/#521은 `오로 explorer · 달빛 단서 1/2 · 재료 2/3` requirements surface까지만 제공했습니다.
- After: `월정 문 준비 납품` action 후 `재료 3/3 ready`와 `달빛 단서 1/2` remaining blocker가 HUD/objective/playfield/telemetry에 남습니다.
- Requirements screenshot: `reports/visual/issue-0522-moon-fence-prep-delivery-payoff/phaser-check-moon-fence-requirements-393.png`
- Prep delivery screenshot: `reports/visual/issue-0522-moon-fence-prep-delivery-payoff/phaser-check-moon-fence-prep-delivery-393.png`
- Visual report: `reports/visual/issue-0522-moon-fence-prep-delivery-payoff/visual-report-20260511.md`
- Browser Use blocker: `reports/visual/issue-0522-moon-fence-prep-delivery-payoff/browser-use-blocker-20260511.md`

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
- 새 accepted manifest asset 없이 existing expedition gate/night-glass/crate visual language와 compact chip을 사용합니다.
- 실제 route unlock/spend/economy consume은 후속 slice로 분리합니다.

## 남은 위험

- prep crate chip이 수동 플레이에서 작게 느껴질 수 있습니다. 그러면 후속 WorkUnit에서 dedicated moon-fence prep crate sprite/FX를 분리해야 합니다.
- 이번 PR은 material readiness surface이며, `달빛 단서 2/2` 획득과 실제 `월정 문` unlock 실행은 포함하지 않습니다.

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

Closes #522
