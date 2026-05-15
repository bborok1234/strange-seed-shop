## 요약

월정 숲 source가 planting 상태에서 멈추지 않도록 `seed_moon_grove_001` care -> ready -> `월정 숲 수확` -> `월정 숲 새벽이끼` discovery reveal -> 다음 온실/숲길 preview로 연결했습니다.

## Small win

플레이어가 월정 문 첫 보상을 실제로 키우고 수확해 다음 발견을 봅니다.

## 사용자/운영자 가치

월정 문 보상이 receipt나 inventory promise가 아니라 재배-수확-발견 loop로 닫힙니다. 운영 측면에서는 #540 WorkUnit, Browser Use blocker, Playwright fallback screenshot, local/CI gate가 한 PR에 묶입니다.

## Before / After 또는 Visual evidence

- Before: #539 이후 `seed_moon_grove_001`은 planted growth `26`에서 멈췄습니다.
- After: `월정 숲 수확 준비`, `월정 숲 수확`, `월정 숲 발견`, `discovery_moon_grove_001`, `다음 온실 숲길 preview`가 보입니다.
- Visual report: `reports/visual/issue-0540-moon-grove-harvest-reveal-payoff/visual-report-20260515.md`
- Browser Use blocker: `reports/visual/issue-0540-moon-grove-harvest-reveal-payoff/browser-use-blocker-20260515.md`
- Key screenshots:
  - `reports/visual/issue-0540-moon-grove-harvest-reveal-payoff/phaser-check-moon-grove-ready-393.png`
  - `reports/visual/issue-0540-moon-grove-harvest-reveal-payoff/phaser-check-moon-grove-harvested-393.png`
  - `reports/visual/issue-0540-moon-grove-harvest-reveal-payoff/phaser-check-moon-fence-source-overview-393.png`

## Playable mode

Phaser playable route만 변경합니다. 사람 플레이 main worktree는 `npm run play:main`, port `5174` 계약을 유지합니다.

## 검증

- `npm run check:phaser`
- `npm run check:content`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:asset-alpha`
- `npm run check:ci`
- `git diff --check`

## 안전 범위

- Runtime image generation/API/cache 호출 없음
- 새 accepted manifest asset 없음
- 결제, 광고, 고객 데이터, 외부 배포 없음

## 남은 위험

전용 월정 숲 creature portrait/actor asset은 아직 없습니다. 이번 PR은 source discovery payoff이며, dedicated creature asset generation/review는 후속 WorkUnit 후보입니다.

## 연결된 issue

Closes #540

## 작업 checklist

- [x] Game Studio route 기록
- [x] Plan-first WorkUnit 생성
- [x] Browser Use 우선 시도 및 current blocker 기록
- [x] Playwright fallback screenshot evidence 저장
- [x] Local checks 통과
