# 밤유리 source acquisition route visual report

## 범위

- Issue: #510
- WorkUnit: `items/0271-night-glass-source-acquisition-route.md`
- Route: `밤유리 source 보기 -> 밤유리 조사 보내기 -> 밤유리 귀환 상자 열기 -> seed_rare_001 source 획득`

## Browser Use

- Status: unavailable in current Codex tool surface.
- Blocker: `reports/visual/issue-0510-night-glass-source-acquisition-route/browser-use-blocker-20260508.md`
- Fallback: Playwright smoke via `npm run check:phaser`.

## Evidence

- Preview: `reports/visual/issue-0510-night-glass-source-acquisition-route/phaser-check-night-glass-source-preview-393.png`
- Traveling: `reports/visual/issue-0510-night-glass-source-acquisition-route/phaser-check-night-glass-traveling-393.png`
- Returned: `reports/visual/issue-0510-night-glass-source-acquisition-route/phaser-check-night-glass-returned-393.png`
- Source acquired: `reports/visual/issue-0510-night-glass-source-acquisition-route/phaser-check-night-glass-source-acquired-393.png`

## Findings

- `밤유리 source 보기` 후 action rail에 `밤유리 조사 보내기`가 노출된다.
- 조사 중 상태는 objective, HUD surface, playfield marker에 반영된다.
- 귀환 상태는 `밤유리 귀환 상자 열기` action과 playfield marker로 확인된다.
- claim 후 `seed_rare_001 source 획득`, 잎 `203`, `nightGlassAcquisitionState=claimed`, `nightGlassSourceAcquired=true`가 검증된다.
- source 획득 순간은 기존 accepted `seed_rare_001_icon`과 `fx_night_glass_source_unlock_strip_v1` binding으로 표시된다.

## Remaining risk

- 최종 source 획득 badge는 action rail 위쪽 playfield에 보이나 화면이 매우 밀집되어 있다. 다음 rare seed planting loop에서 source marker 위치/스케일을 다시 볼 필요가 있다.
