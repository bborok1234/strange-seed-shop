## 요약

#442에서 생성한 actor/FX source candidates를 strict runtime strips로 정규화하고 Phaser board에 연결했습니다.

## Small win

첫 수확 후 포리가 generated actor strip으로 움직이고, care/harvest feedback이 generated FX texture로 보입니다.

## 사용자/운영자 가치

플레이어는 정원 actor와 tap 결과를 그림/움직임으로 이해합니다. 운영자는 gpt-image-2 source candidate -> alpha cleanup -> strict strip normalization -> Phaser runtime smoke evidence 경로를 갖게 됩니다.

## Before / After 또는 Visual evidence

- Before: actor/FX 후보는 1024x1024 source candidate였고 runtime actor는 shape placeholder였습니다.
- After: Pori/Momo/care/harvest source candidates are strict strips; Pori and care/harvest FX are loaded by Phaser.
- Strip contact sheet: `reports/assets/actor_fx_runtime_strip_contact_sheet_20260508.png`
- Visual report: `reports/visual/issue-0446-actor-fx-runtime-strips/visual-report-20260508.md`
- Screenshots:
  - `reports/visual/issue-0446-actor-fx-runtime-strips/phaser-check-fresh-start-393.png`
  - `reports/visual/issue-0446-actor-fx-runtime-strips/phaser-check-after-plant-393.png`
  - `reports/visual/issue-0446-actor-fx-runtime-strips/phaser-check-ready-393.png`
  - `reports/visual/issue-0446-actor-fx-runtime-strips/phaser-check-after-harvest-393.png`
  - `reports/visual/issue-0446-actor-fx-runtime-strips/phaser-check-workbench-claim-393.png`

## Playable mode

Phaser app lane changed. Existing plant/care/harvest/workbench claim smoke remains green. Main playable worktree can be refreshed after merge.

## 검증

- `npm run check:phaser`
- `npm run check:topology-generated-assets`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:asset-alpha`
- `npm run check:ci`

## 안전 범위

- Runtime image generation/API/cache 호출 없음.
- Momo strip is normalized/preloaded but not assigned to a second runtime actor yet.
- 결제/광고/외부 배포/고객 데이터 없음.

## 남은 위험

- Momo carrier task and order reward motion remain next WorkUnit candidates.
- Manifest registration for the normalized strips is still deferred.

## 연결된 issue

- Closes #446

## 작업 checklist

- [x] actor/FX alpha cleanup
- [x] strict strip normalization
- [x] Phaser runtime actor/FX 연결
- [x] visual evidence 저장
- [x] roadmap/control room/dashboard/heartbeat 갱신
