## 요약

#518은 #517의 `밤유리 오로 합류 · expedition_moon_fence_locked preview`가 route id 문구에서 멈추지 않도록, player verb `월정 문 단서 보기`와 locked route preview state를 Phaser playable loop에 연결합니다.

## Small win

플레이어가 밤유리 오로 발견 후 곧바로 `월정 문 단서 보기`를 눌러 다음 expedition route가 잠겨 있다는 장기 목표를 확인할 수 있습니다.

## 사용자/운영자 가치

- 사용자: rare creature 발견이 다음 route 확인 행동으로 이어져 “다음에 뭘 하지?”가 줄어듭니다.
- 운영자: `expedition_moon_fence_locked`가 HUD 문구가 아니라 action, objective, playfield marker, telemetry로 고정되어 다음 route unlock/asset WorkUnit을 안정적으로 이어갈 수 있습니다.

## Before / After 또는 Visual evidence

- Before: #517 이후 오로 actor와 route id는 보였지만 직접 누르는 route action은 없었습니다.
- After: `월정 문 단서 보기` action을 누르면 `월정 문 단서 확인 · expedition_moon_fence_locked locked`가 objective/HUD/playfield에 남습니다.
- Handoff before action: `reports/visual/issue-0518-night-glass-oro-moon-fence-route-action/phaser-check-night-glass-oro-handoff-393.png`
- Route action after click: `reports/visual/issue-0518-night-glass-oro-moon-fence-route-action/phaser-check-moon-fence-route-action-393.png`
- Visual report: `reports/visual/issue-0518-night-glass-oro-moon-fence-route-action/visual-report-20260511.md`
- Browser Use blocker: `reports/visual/issue-0518-night-glass-oro-moon-fence-route-action/browser-use-blocker-20260511.md`

## Playable mode

- 대상 app: `npm run dev:phaser`
- 직접 확인 흐름: starter loop -> storage/research/expedition -> 초승달순 source harvest -> 밤유리 source 보기 -> 밤유리 조사 보내기 -> 밤유리 귀환 상자 열기 -> 빈 밭 `밤유리 심기` -> `돌보기` -> `밤유리 수확` -> `월정 문 단서 보기`

## 검증

- `npm run build:phaser`
- `npm run check:phaser`
- `npm run check:content`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:ci`
- `npm run check:ops-live`
- `npm run check:dashboard`
- `git diff --check`

## 안전 범위

- Phaser local state/action/render/checker와 운영 evidence 문서만 변경합니다.
- 새 runtime image generation/API/cache 호출은 없습니다.
- 새 accepted manifest asset은 추가하지 않고 기존 `facility_expedition_gate_v1`, `creature_lunar_rare_001`, `fx_night_glass_source_unlock_strip_v1`을 route action feedback에 재사용합니다.

## 남은 위험

- `월정 문` locked route marker가 existing expedition gate art에 기대고 있어 전용 `facility_moon_fence_locked_v1` asset이 필요할 수 있습니다.
- 하단 HUD/action rail은 장기 progression surface가 누적되어 밀도가 높습니다.
- Browser Use `iab` callable이 현재 tool surface에 없어 Playwright fallback으로 대체했습니다.

## 작업 checklist

- [x] Plan-first artifact 갱신: `items/0275-night-glass-oro-moon-fence-route-action.md`
- [x] Game Studio route 기록
- [x] Phaser state/action/HUD/render 연결
- [x] Route action click/telemetry 회귀 추가
- [x] Playwright screenshot/telemetry 회귀 추가
- [x] Browser Use blocker 기록
- [x] Local verification 통과

## 연결된 issue

Closes #518
