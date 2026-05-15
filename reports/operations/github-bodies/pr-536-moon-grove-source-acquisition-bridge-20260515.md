# 월정 숲 source acquisition bridge

## 요약

월정 문 첫 원정 보상 이후 `clue_moon_grove_001` promise를 `월정 숲 source 확인` player verb로 닫고, `seed_moon_grove_001 source 획득` 상태를 Phaser state/HUD/playfield/checker에 연결합니다.

## Small win

플레이어가 월정 문 귀환 상자를 연 뒤 source 그림 promise에서 멈추지 않고, 다음 seed source를 실제로 획득했다는 objective/receipt/telemetry를 확인할 수 있습니다.

## 사용자/운영자 가치

- 사용자: `clue_moon_grove_001`이 무엇으로 이어지는지 즉시 이해하고 다음 planting loop로 넘어갈 근거를 얻습니다.
- 운영자: 월정 숲 source acquisition 상태가 deterministic checker와 screenshot evidence로 고정되어 후속 planting/harvest WorkUnit이 안정적으로 이어집니다.

## Before / After 또는 Visual evidence

- Before/action ready: `reports/visual/issue-0536-moon-grove-source-acquisition-bridge/phaser-check-moon-fence-expedition-claimed-393.png`
- After/acquired: `reports/visual/issue-0536-moon-grove-source-acquisition-bridge/phaser-check-moon-grove-source-acquired-393.png`
- Overview: `reports/visual/issue-0536-moon-grove-source-acquisition-bridge/phaser-check-moon-fence-source-overview-393.png`
- Visual report: `reports/visual/issue-0536-moon-grove-source-acquisition-bridge/visual-report-20260515.md`
- Browser Use blocker: `reports/visual/issue-0536-moon-grove-source-acquisition-bridge/browser-use-blocker-20260515.md`

## Playable mode

- Stable main playable mode는 변경하지 않습니다.
- 사람 확인용 main worktree는 기존 계약대로 `npm run play:main` 후 `../strange-seed-shop-play`에서 port `5174`를 사용합니다.
- 이 PR의 실제 변경 확인은 feature branch Phaser checker와 screenshot evidence 기준입니다.

## 작업 checklist

- [x] Game Studio route 기록
- [x] WorkUnit plan-first artifact 갱신
- [x] `GardenState` source acquisition 상태 추가
- [x] `월정 숲 source 확인` action 추가
- [x] accepted source icon/FX marker 연결
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
- 새 asset은 만들지 않고 #532/#533/#535에서 accepted 된 `seed_moon_grove_001_icon`, `fx_moon_grove_source_reward_strip_v1`만 사용합니다.

## 남은 위험

- Browser Use hands-on evidence는 현 세션 도구 미노출로 blocker를 남기고 Playwright fallback으로 대체했습니다.
- `seed_moon_grove_001` planting/harvest loop는 후속 WorkUnit입니다.
- 월정 문 주변 badge 밀도는 아직 높은 편이라 후속 visual declutter 후보로 남습니다.

## 연결된 issue

- Closes #536
