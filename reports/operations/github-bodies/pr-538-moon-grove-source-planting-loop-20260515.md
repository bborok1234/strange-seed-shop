# 월정 숲 source planting loop

## 요약

`seed_moon_grove_001 source` 획득 후 빈 밭에서 `월정 숲 심기` action을 열고, action 후 source availability를 소비해 `seed_moon_grove_001` planted plot state와 source icon marker를 남깁니다.

## Small win

월정 문 장기 보상이 source 획득에서 멈추지 않고 실제 재배 시작으로 이어집니다.

## 사용자/운영자 가치

- 사용자: `월정 숲 source`를 받자마자 빈 밭에 심어 다음 발견을 기대할 수 있습니다.
- 운영자: source acquisition 이후 planting state가 deterministic checker와 screenshot evidence로 고정되어 후속 harvest/reveal WorkUnit이 안정적으로 이어집니다.

## Before / After 또는 Visual evidence

- Plant action ready: `reports/visual/issue-0538-moon-grove-source-planting-loop/phaser-check-moon-grove-plant-action-393.png`
- Planted plot: `reports/visual/issue-0538-moon-grove-source-planting-loop/phaser-check-moon-grove-planted-393.png`
- Overview: `reports/visual/issue-0538-moon-grove-source-planting-loop/phaser-check-moon-fence-source-overview-393.png`
- Visual report: `reports/visual/issue-0538-moon-grove-source-planting-loop/visual-report-20260515.md`
- Browser Use blocker: `reports/visual/issue-0538-moon-grove-source-planting-loop/browser-use-blocker-20260515.md`

## Playable mode

- Stable main playable mode는 변경하지 않습니다.
- 사람 확인용 main worktree는 기존 계약대로 `npm run play:main` 후 `../strange-seed-shop-play`에서 port `5174`를 사용합니다.
- 이 PR의 실제 변경 확인은 feature branch Phaser checker와 screenshot evidence 기준입니다.

## 작업 checklist

- [x] Game Studio route 기록
- [x] WorkUnit plan-first artifact 갱신
- [x] `moonGroveSourceSeedPlanted`, `moonGroveSourcePlotId` state 추가
- [x] 빈 밭 `월정 숲 심기` action 추가
- [x] source availability 소비 및 planted plot state 추가
- [x] accepted `seed_moon_grove_001_icon` plot marker 연결
- [x] deterministic checker와 screenshots 갱신
- [x] Browser Use current blocker 기록
- [x] ROADMAP/DASHBOARD/control room/heartbeat 갱신

## 검증

- `npm run check:phaser`
- `npm run check:content`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:asset-alpha`
- `npm run check:ci`
- `git diff --check`

## 안전 범위

- Phaser local state/action/render/checker와 운영 evidence 문서만 변경합니다.
- Runtime image generation/API/cache 호출은 추가하지 않습니다.
- 새 asset은 만들지 않고 accepted `seed_moon_grove_001_icon`만 planted marker로 사용합니다.

## 남은 위험

- Browser Use hands-on evidence는 현 세션 도구 미노출로 blocker를 남기고 Playwright fallback으로 대체했습니다.
- `seed_moon_grove_001` harvest/reveal payoff는 후속 WorkUnit입니다.
- 월정 문 주변 badge 밀도는 아직 높은 편이라 후속 visual declutter 후보로 남습니다.

## 연결된 issue

- Closes #538
