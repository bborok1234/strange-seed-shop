# 월정 문 두 번째 달빛 단서 payoff

## 요약

`월정 문 준비 납품` 이후 player verb `달빛 단서 포장`을 추가하고, 클릭 후 clue requirement를 `달빛 단서 2/2 ready`로 전환합니다.

- `GardenState`에 second clue availability/packaged/stamp visible/clue ready telemetry를 추가했습니다.
- Phaser action rail에 `달빛 단서 포장`을 연결하고, 실행 후 objective/HUD/receipt에 `달빛 단서 포장 완료 · 단서 2/2 · 재료 3/3 · 월정 문 열기 대기`를 남깁니다.
- Expedition gate 주변에 compact `단서 도장 · 2/2` chip을 표시합니다.
- `scripts/check-phaser-foundation.mjs`가 prep delivery 이후 second clue click, telemetry, HUD/objective, screenshot evidence를 검증합니다.

## Small win

월정 문 route unlock 전 마지막 missing requirement인 `달빛 단서 1/2`가 정원 화면의 행동으로 `2/2 ready`까지 채워집니다.

## 사용자/운영자 가치

사용자는 `단서와 재료가 모두 준비됨, 다음은 월정 문 열기`라는 unlock 직전 상태를 이해할 수 있습니다. 운영자는 route unlock 전 readiness state를 telemetry와 screenshot checker로 회귀 방지할 수 있습니다.

## Before / After 또는 Visual evidence

- Before: #522/#523은 `재료 3/3 ready`와 `달빛 단서 1/2` blocker까지만 제공했습니다.
- After: `달빛 단서 포장` action 후 `달빛 단서 2/2 ready`와 `재료 3/3 ready`가 HUD/objective/playfield/telemetry에 남습니다.
- Prep delivery screenshot: `reports/visual/issue-0524-moon-fence-second-clue-payoff/phaser-check-moon-fence-prep-delivery-393.png`
- Second clue screenshot: `reports/visual/issue-0524-moon-fence-second-clue-payoff/phaser-check-moon-fence-second-clue-393.png`
- Visual report: `reports/visual/issue-0524-moon-fence-second-clue-payoff/visual-report-20260511.md`
- Browser Use blocker: `reports/visual/issue-0524-moon-fence-second-clue-payoff/browser-use-blocker-20260511.md`

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
- 새 accepted manifest asset 없이 existing expedition gate/night-glass/moonburst visual language와 compact chip을 사용합니다.
- 실제 route unlock/spend/economy consume은 후속 slice로 분리합니다.

## 남은 위험

- clue stamp chip이 수동 플레이에서 작게 느껴질 수 있습니다. 그러면 후속 WorkUnit에서 dedicated moon-fence clue stamp sprite/FX를 분리해야 합니다.
- 이번 PR은 clue readiness surface이며, 실제 `월정 문` unlock 실행은 포함하지 않습니다.

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

Closes #524
