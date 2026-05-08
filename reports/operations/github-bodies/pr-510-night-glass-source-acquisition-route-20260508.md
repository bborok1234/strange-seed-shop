## 요약

#510은 `밤유리 source`가 dedicated icon/FX preview에서 멈추던 상태를 `밤유리 조사 보내기 -> 밤유리 귀환 상자 열기 -> seed_rare_001 source 획득` route로 연결한다.

## Small win

플레이어가 rare route를 잠긴 힌트가 아니라 실제 조사/귀환/source 획득 흐름으로 본다.

## 사용자/운영자 가치

- 사용자: `밤유리 source`가 장기 목표 teaser가 아니라 다음 획득 목표로 이해된다.
- 운영자: v1 rare route의 다음 planting/reveal WorkUnit을 deterministic telemetry와 screenshot evidence 위에서 이어갈 수 있다.

## Before / After 또는 Visual evidence

- Before: #509 이후 `밤유리 source 보기`는 `expedition_night_glass 조사 준비` preview에서 멈춤.
- After:
  - `reports/visual/issue-0510-night-glass-source-acquisition-route/phaser-check-night-glass-source-preview-393.png`
  - `reports/visual/issue-0510-night-glass-source-acquisition-route/phaser-check-night-glass-traveling-393.png`
  - `reports/visual/issue-0510-night-glass-source-acquisition-route/phaser-check-night-glass-returned-393.png`
  - `reports/visual/issue-0510-night-glass-source-acquisition-route/phaser-check-night-glass-source-acquired-393.png`
- Visual report: `reports/visual/issue-0510-night-glass-source-acquisition-route/visual-report-20260508.md`
- Browser Use blocker: `reports/visual/issue-0510-night-glass-source-acquisition-route/browser-use-blocker-20260508.md`

## Playable mode

- Phaser playable path만 변경.
- 외부 API, runtime image generation, 결제, 광고, 배포 없음.

## 검증

- [x] `npm run check:phaser`
- [x] `npm run check:content`
- [x] `npm run check:asset-provenance`
- [x] `npm run check:asset-style`
- [x] `npm run check:ci`
- [x] `git diff --check`

## 안전 범위

- 기존 accepted `seed_rare_001_icon`과 `fx_night_glass_source_unlock_strip_v1`을 새 gameplay binding으로 사용한다.
- 새 manifest asset, SVG/vector game asset, runtime image generation은 추가하지 않는다.
- rare seed planting/reveal은 다음 WorkUnit으로 남긴다.

## 남은 위험

- 최종 source 획득 badge는 화면이 밀집되어 있어 다음 rare seed planting loop에서 marker 위치/스케일을 다시 볼 필요가 있다.
- Browser Use `iab`가 현재 Codex tool surface에 노출되지 않아 Playwright fallback으로 검증했다.

## 작업 checklist

- [x] WorkUnit plan-first artifact 작성
- [x] GitHub issue #510 생성
- [x] Phaser state/action/render/HUD 연결
- [x] deterministic checker와 visual evidence 갱신
- [x] local verification 통과

## 연결된 issue

Closes #510
