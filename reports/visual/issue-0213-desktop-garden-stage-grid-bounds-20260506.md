# 데스크톱 정원 stage grid overflow 복구 — 2026-05-06

## Route

- Game Studio route: `game-studio:game-studio` -> `game-studio:game-ui-frontend` -> `game-studio:game-playtest`
- Source URL: `http://127.0.0.1:4173/?qaProductionReady=1`
- Source feedback: 사용자 in-app browser screenshot

## Problem

데스크톱 breakpoint에서 `.app-shell.playable-focus .garden-stage`가 `width: min(1180px, calc(100vw - 48px))`를 유지해 grid item의 실제 track 폭을 무시했다. 그 결과 rail 뒤에서 stage가 desktop shell 오른쪽 밖으로 밀리고 dock/action 정보가 덮이거나 잘렸다.

## Fix

desktop grid media 안에서 playable shell의 `.garden-stage`를 grid track 기준으로 되돌렸다.

- `.app-shell.playable-focus .desktop-shell .garden-stage { width: auto; min-width: 0; max-width: 100%; }`
- `desktop-art-share`에 stage/rail/shell/host bounds regression을 추가했다.

## Evidence

- Before: `reports/visual/desktop-garden-weird-before-1280x800-20260506.png`
- Browser Use current tab after reload: `reports/visual/desktop-garden-weird-after-browseruse-20260506.png`
- Desktop after: `reports/visual/desktop-garden-weird-after-1280x800-wait-20260506.png`

## Metrics

1280x800 after:

- shell: left 50, right 1230, width 1180
- rail: left 51, right 231, width 180
- stage: left 231, right 947.4, width 716.4
- dock: left 947.4, right 1229, width 281.6
- playfield host: left 384.4, right 794, width 409.6

## Verification

- `npx playwright test tests/visual/desktop-art-share.spec.ts --grep "desktop garden stage stays inside|production actor has visible idle motion|garden plot marker replaces" --config playwright.config.ts`: 9 passed.
- `npm run check:art-share`: 24 passed.
- `npm run build`: passed.
