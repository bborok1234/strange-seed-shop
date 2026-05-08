# #490 첫 원정 출발/귀환 crate visual QA

## 범위

- Game Studio route: `game-studio:game-studio` -> `game-studio:game-ui-frontend` -> `game-studio:phaser-2d-game` -> `game-studio:game-playtest`
- 대상: Phaser v1 scripted path, 393x852 mobile viewport
- 핵심 claim: 원정 문 preview 이후 `뒷마당 틈새길`이 `traveling -> returned -> claimed` 상태로 이어진다.

## Browser Use

현재 Codex 세션에서 Browser Use `iab` 실행 도구가 노출되지 않았다. 프로젝트 규칙에 따라 blocker를 기록하고 Playwright fallback smoke로 screenshot/telemetry evidence를 남겼다.

## Playwright Fallback Evidence

- Command: `npm run check:phaser`
- Result: pass
- Viewport: 393x852
- URL: local Phaser dev server `http://127.0.0.1:4183/`

## Key Screenshots

- `phaser-check-expedition-gate-preview-393.png` — 원정 문 preview와 `틈새길 보내기`
- `phaser-check-expedition-traveling-393.png` — route id `expedition_backyard_gap`, state `traveling`, reward leaves `35`
- `phaser-check-expedition-returned-393.png` — state `returned`, `귀환 상자 열기`, gate progress `100`
- `phaser-check-expedition-claimed-393.png` — state `claimed`, leaves `95`, reward receipt

## Telemetry Assertions

- `expeditionGatePreviewVisible=true`
- `expeditionState=ready -> traveling -> returned -> claimed`
- `activeExpeditionRouteId=expedition_backyard_gap`
- `expeditionRewardLeaves=35` while traveling/returned, `0` after claim
- final leaves `95`
- final objective includes `첫 원정 완료`

## Findings

- Blocker: dedicated expedition gate raster/return crate FX asset은 아직 없다.
- Risk: current route uses existing crate/shadow/actor strip as runtime stand-in. 전용 raster/FX asset plan-prompt가 다음 후보 WorkUnit이다.
