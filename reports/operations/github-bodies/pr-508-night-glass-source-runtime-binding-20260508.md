## 요약

#508에서 #506/#507로 생성된 `seed_rare_001_icon`과 `fx_night_glass_source_unlock_strip_v1`를 manifest accepted asset과 Phaser `밤유리 source` preview runtime에 binding했다.

## Small win

`밤유리 source 보기` 순간이 accepted rare creature silhouette stand-in에서 dedicated source icon + unlock FX로 바뀐다.

## 사용자/운영자 가치

플레이어에게 rare route가 placeholder promise가 아니라 실제 source 보상물로 보이게 한다. 운영자 관점에서는 plan/prompt -> generation/review -> manifest/runtime binding까지 asset/FX pipeline이 issue chain으로 닫힌다.

## Before / After 또는 Visual evidence

- Before: `밤유리 source` preview가 `creature_lunar_rare_001` silhouette tint 중심이었다.
- After: preview가 `seed_rare_001_icon` 중심으로 보이고 `fx_night_glass_source_unlock_strip_v1`를 `night-glass-source-unlock-once` animation으로 재생한다.
- Screenshot: `reports/visual/issue-0508-night-glass-source-runtime-binding/phaser-check-night-glass-source-preview-393.png`
- Browser Use blocker: `reports/visual/issue-0508-night-glass-source-runtime-binding/browser-use-blocker-20260508.md`

## Playable mode

Phaser playable의 `밤유리 source 보기` preview route가 바뀐다. stable main playable command/port 계약은 그대로 유지된다.

## 검증

- `npm run check:phaser`
- `npm run check:content`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:asset-alpha`
- `npm run check:ci`
- `git diff --check`

## 안전 범위

- Runtime image generation/API/cache를 추가하지 않는다.
- SVG/vector/code-native game graphics를 추가하지 않는다.
- 실제 rare acquisition/liveops/payment scope를 열지 않는다.
- Browser Use unavailable 상태는 blocker로 기록하고 Playwright fallback evidence를 사용했다.

## 남은 위험

- FX strip은 runtime에서 보이지만 frame timing의 감성 품질은 후속 tuning 여지가 있다.
- Browser Use가 추후 노출되면 같은 route를 hands-on QA로 재확인해야 한다.

## 연결된 issue

Closes #508

## 작업 checklist

- [x] Game Studio route 기록
- [x] Department Scorecard 기록
- [x] manifest accepted entry 추가
- [x] Phaser preload/render/animation binding
- [x] Browser Use blocker 또는 hands-on evidence 기록
- [x] local verification 통과
- [ ] PR checks 통과
