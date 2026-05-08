## 요약

#512는 `seed_rare_001 source 획득` 이후 보상이 receipt에만 남지 않도록 빈 밭 `밤유리 심기` action, planted telemetry, rare source plot overlay/chip을 Phaser playable loop에 연결합니다.

## Small win

플레이어가 밤유리 귀환 상자를 연 직후 빈 밭을 선택하면 `밤유리 심기`를 눌러 바로 rare source 재배 상태로 진입합니다.

## 사용자/운영자 가치

- 사용자: rare source 획득 후 다음 행동을 잃지 않고 `밤유리 재배 중` 상태를 화면에서 확인합니다.
- 운영자: #510 acquisition route가 다음 WorkUnit의 harvest/reveal 후보로 이어질 수 있도록 source availability 소비와 planted telemetry를 고정합니다.

## Before / After 또는 Visual evidence

- Before: #511 이후 `seed_rare_001 source 획득`은 expedition gate receipt/HUD에 머물고 빈 밭 planting verb가 없었습니다.
- After: `밤유리 심기` action이 빈 밭에 표시되고, 심기 후 `seed_rare_001_icon` overlay와 `밤유리` chip이 plot에 보입니다.
- Plant action: `reports/visual/issue-0512-night-glass-source-planting-loop/phaser-check-night-glass-plant-action-393.png`
- Planted: `reports/visual/issue-0512-night-glass-source-planting-loop/phaser-check-night-glass-planted-393.png`
- Visual report: `reports/visual/issue-0512-night-glass-source-planting-loop/visual-report-20260508.md`
- Browser Use blocker: `reports/visual/issue-0512-night-glass-source-planting-loop/browser-use-blocker-20260508.md`

## Playable mode

- 대상 app: `npm run dev:phaser`
- 직접 확인 흐름: starter loop -> storage/research/expedition -> 초승달순 source harvest -> 밤유리 source 보기 -> 밤유리 조사 보내기 -> 밤유리 귀환 상자 열기 -> 빈 밭 `밤유리 심기`

## 검증

- `npm run build:phaser`
- `npm run check:phaser`
- `npm run check:content`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:ci`
- `git diff --check`

## 안전 범위

- Phaser local state/action/render/checker만 변경합니다.
- 새 runtime image generation/API/cache 호출은 없습니다.
- 새 accepted manifest asset은 추가하지 않고 기존 `seed_rare_001_icon`/`fx_night_glass_source_unlock_strip_v1` binding을 재사용합니다.

## 남은 위험

- 이번 slice는 planting/growing까지만 다룹니다. `seed_rare_001` harvest/reveal과 rare creature payoff는 후속 WorkUnit에서 sprite/FX readability 판단과 함께 다뤄야 합니다.
- Browser Use `iab` callable이 현재 tool surface에 없어 Playwright fallback으로 대체했습니다.

## 작업 checklist

- [x] Plan-first artifact 갱신: `items/0272-night-glass-source-planting-loop.md`
- [x] Game Studio route 기록
- [x] Phaser state/action/HUD/render 연결
- [x] Playwright screenshot/telemetry 회귀 추가
- [x] Browser Use blocker 기록
- [x] Local verification 통과

## 연결된 issue

Closes #512
