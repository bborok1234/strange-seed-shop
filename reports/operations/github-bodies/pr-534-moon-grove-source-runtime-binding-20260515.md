## 요약

#534에서 #532/#533으로 생성/리뷰한 `seed_moon_grove_001_icon`과 `fx_moon_grove_source_reward_strip_v1`을 manifest accepted asset과 Phaser 월정 문 reward/source promise runtime에 binding했습니다.

## Small win

`월정 문 귀환 상자 열기` 보상이 `clue_moon_grove_001` 텍스트 promise에서 끝나지 않고 dedicated 월정 숲 seed icon + reward FX로 다음 source target을 보여줍니다.

## 사용자/운영자 가치

- 사용자: 월정 문 첫 원정 보상 직후 다음 수집 목표를 그림과 FX로 이해할 수 있습니다.
- 운영자: plan/prompt -> generation/review -> manifest/runtime binding까지 월정 숲 source asset pipeline이 issue chain으로 닫힙니다.

## Before / After 또는 Visual evidence

- Before: `clue_moon_grove_001 source promise` 텍스트만 표시되고 dedicated seed icon/FX는 runtime에 없었습니다.
- After: `seed_moon_grove_001_icon`, `fx_moon_grove_source_reward_strip_v1`가 accepted manifest asset, Phaser topology asset, reward/source promise render, telemetry에 연결됩니다.
- Visual report: `reports/visual/issue-0534-moon-grove-source-runtime-binding/visual-report-20260515.md`
- Screenshot: `reports/visual/issue-0534-moon-grove-source-runtime-binding/phaser-check-moon-fence-source-overview-393.png`
- Browser Use blocker: `reports/visual/issue-0534-moon-grove-source-runtime-binding/browser-use-blocker-20260515.md`

## Playable mode

Phaser playable의 월정 문 첫 원정 reward claim 후 source promise 화면이 바뀝니다. stable main playable command/port 계약은 그대로 유지됩니다.

## 검증

- `npm run check:phaser` - PASS
- `npm run check:content` - PASS
- `npm run check:asset-provenance` - PASS
- `npm run check:asset-style` - PASS
- `npm run check:asset-alpha` - PASS
- `npm run check:ci` - PASS
- `git diff --check` - PASS

## 안전 범위

- Runtime image generation/API/cache를 추가하지 않습니다.
- SVG/vector/code-native game graphics를 추가하지 않습니다.
- 실제 `seed_moon_grove_001` acquisition/planting/harvest loop는 후속 WorkUnit으로 분리합니다.
- 실결제, 외부 배포, 고객 데이터, 실채널 GTM 변경 없음.

## 남은 위험

- 오른쪽 월정 문 주변 badge 밀도는 아직 높습니다. 이번 PR은 accepted source icon/FX runtime binding을 닫고, acquisition/planting loop와 playfield badge declutter는 후속 vertical slice 후보로 분리합니다.
- Browser Use가 추후 노출되면 같은 route를 hands-on QA로 재확인해야 합니다.

## 연결된 issue

Closes #534

## 작업 checklist

- [x] Game Studio route 기록
- [x] Department Scorecard 기록
- [x] manifest accepted entry 추가
- [x] Phaser preload/render/animation/telemetry binding
- [x] Browser Use blocker 또는 hands-on evidence 기록
- [x] local verification 통과
- [ ] PR checks 통과
