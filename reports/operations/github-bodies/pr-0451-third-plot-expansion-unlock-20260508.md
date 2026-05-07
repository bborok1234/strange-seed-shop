## 요약

#450 이후 첫 주문 납품 보상을 `3번 밭 확장` action으로 연결했습니다.

## Small win

주문 납품 reward가 새 usable plot으로 즉시 보입니다.

## 사용자/운영자 가치

플레이어는 첫 production chain 보상이 정원 capacity 성장으로 이어진다는 감각을 얻습니다. 운영자는 delivery reward -> board expansion progression을 deterministic smoke evidence로 검증합니다.

## Before / After 또는 Visual evidence

- Before: `3번 확장 자리`는 preview였고 unlock action이 없었습니다.
- After: delivery 후 `확장 60잎` action이 나오고, 확장 후 `3번 햇살 밭` empty plot entity가 생성됩니다.
- Visual report: `reports/visual/issue-0451-third-plot-expansion-unlock/visual-report-20260508.md`
- Screenshot evidence:
  - `reports/visual/issue-0451-third-plot-expansion-unlock/phaser-check-expand-ready-393.png`
  - `reports/visual/issue-0451-third-plot-expansion-unlock/phaser-check-third-plot-expanded-393.png`

## Playable mode

Phaser app lane changed. Merge 후 main playable worktree refresh 대상입니다. Legacy playable lane은 수정하지 않았습니다.

## 검증

- `npm run check:phaser`
- `npm run check:ci`

## 안전 범위

- Runtime image generation/API/cache 호출 없음.
- 기존 generated raster plot states만 Phaser에서 preload/render합니다.
- 결제/광고/외부 배포/고객 데이터 없음.
- plot_03 seed purchase/planting loop는 후속 WorkUnit입니다.

## 남은 위험

- 세 번째 plot은 unlock까지만 연결됐고 새 씨앗 공급/plant action은 다음 WorkUnit에서 연결해야 합니다.
- Browser Use `iab` hands-on QA는 이번 Codex CLI 세션에서 tool 미노출로 blocked이며, Playwright fallback evidence를 사용했습니다.

## 연결된 issue

- Closes #451

## 작업 checklist

- [x] third plot expansion state/action
- [x] delivery reward -> expansion cost/result
- [x] usable empty third plot state
- [x] `check:phaser` expansion branch
- [x] visual report
