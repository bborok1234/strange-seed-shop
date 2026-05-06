## 요약

데스크톱 정원에서 `.garden-stage`가 desktop grid track 밖으로 밀려 rail/dock/action 정보를 덮던 회귀를 복구했습니다.

## Small win

`?qaProductionReady=1` desktop garden에서 stage가 rail 오른쪽에서 시작하고 dock 왼쪽에서 끝나며, background/plot marker/production actor/action 정보가 동시에 보입니다.

## 사용자/운영자 가치

사용자가 보고한 desktop screenshot은 정원 asset과 HUD를 추가했는데도 위치/텍스트/진행 affordance가 망가져 보이는 상태였습니다. 이 PR은 stage가 shell 밖으로 overflow하는 원인을 고정하고 같은 화면을 자동 회귀로 막습니다.

## Before / After 또는 Visual evidence

- Before: `reports/visual/desktop-garden-weird-before-1280x800-20260506.png`
- After desktop: `reports/visual/desktop-garden-weird-after-1280x800-wait-20260506.png`
- Browser Use `iab`: `reports/visual/desktop-garden-weird-after-browseruse-20260506.png`
- Report: `reports/visual/issue-0213-desktop-garden-stage-grid-bounds-20260506.md`

## Playable mode

- URL: `http://127.0.0.1:4173/?qaProductionReady=1`
- Browser Use `iab` current tab reload로 확인했습니다.

## 작업 checklist

- [x] WorkUnit plan artifact 작성: `items/0213-desktop-garden-stage-grid-bounds.md`
- [x] Game Studio route 기록: `game-studio:game-studio` -> `game-studio:game-ui-frontend` -> `game-studio:game-playtest`
- [x] CSS cascade root cause 수정
- [x] desktop stage bounds visual regression 추가
- [x] Browser Use `iab` evidence 저장
- [x] desktop after screenshot/metrics 저장

## 검증

- Browser Use `iab` reload + screenshot: passed.
- Desktop after metrics at 1280x800: shell right 1230, rail right 231, stage 231-947.4, dock 947.4-1229.
- `npx playwright test tests/visual/desktop-art-share.spec.ts --grep "desktop garden stage stays inside|production actor has visible idle motion|garden plot marker replaces" --config playwright.config.ts`: 9 passed.
- `npm run check:art-share`: 24 passed.
- `npm run build`: passed.

## 안전 범위

CSS layout/cascade, visual regression, WorkUnit/report/roadmap evidence만 변경했습니다. 새 asset generation, save migration, payment/external deployment는 없습니다.

## 남은 위험

전체 `npm run check:ci`는 이번 좁은 layout hotfix에서 돌리지 않았습니다. `check:art-share`와 `build`로 desktop visual bounds와 타입/프로덕션 빌드는 확인했습니다.

## 연결된 issue

Closes #407
