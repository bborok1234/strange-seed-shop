# 첫 원정 보상 source preview bridge visual QA

- WorkUnit: `items/0264-expedition-return-source-bridge.md`
- GitHub issue: #496
- Branch: `codex/v1-expedition-return-source-bridge`
- Generated at: 2026-05-08T03:38:08Z
- Game Studio route: `game-studio:game-studio -> game-studio:web-game-foundations -> game-studio:game-ui-frontend -> game-studio:phaser-2d-game -> game-studio:game-playtest`

## QA Surface

- Browser Use blocker: 현재 Codex 세션에 Browser Use MCP/tool surface가 노출되지 않아 `iab` 직접 조작을 실행할 수 없었다.
- Fallback: `npm run check:phaser`의 Playwright smoke를 사용해 mobile 393x852 viewport에서 실제 클릭 순서와 screenshot/telemetry를 검증했다.
- 검증 URL: `http://127.0.0.1:4183/`

## Scenario

1. 첫 plant/care/harvest로 Pori actor를 만든다.
2. 주문 상자 납품, 3번 밭, 보관 바구니, 연구 선반, 달빛 family reveal을 통과한다.
3. `원정 문 단서 보기`로 첫 원정 route를 연다.
4. `틈새길 보내기` 후 귀환 상태를 기다린다.
5. `귀환 상자 열기`로 잎 보상과 `seed_lunar_002` source clue를 받는다.
6. `초승달순 단서 보기`로 source preview와 다음 route lock을 연다.

## Evidence

- `npm run check:phaser`: pass, `failures: []`
- `npm run check:ci`: pass
- `git diff --check`: pass
- Final telemetry:
  - `expeditionState`: `claimed`
  - `expeditionSourceClueAvailable`: `true`
  - `expeditionSourcePreviewVisible`: `true`
  - `nextExpeditionRoutePreviewId`: `expedition_moon_fence_locked`
  - `lunarSourceSeedId`: `seed_lunar_002`
- Final objective: `초승달순 씨앗 source 발견 · 다음 route: 달빛 울타리 잠김`

## Screenshots

- Claim state: `reports/visual/issue-0496-expedition-return-source-bridge/phaser-check-expedition-claimed-393.png`
- Source preview state: `reports/visual/issue-0496-expedition-return-source-bridge/phaser-check-expedition-source-preview-393.png`

## Visual Verdict

- 통과: claim 직후 action rail에 `초승달순 단서 보기`가 보인다.
- 통과: source preview 후 HUD에 `초승달순 씨앗 source`와 `달빛 울타리 잠김`이 표시된다.
- 통과: playfield 원정 문 주변에 초승달 source marker와 다음 route lock marker가 추가된다.
- 통과: mobile 393x852 viewport에서 body/document scroll이 발생하지 않는다.
- 남은 위험: 이번 slice는 새 `seed_lunar_002` raster icon을 생성하지 않는다. dedicated seed/source icon과 planting loop는 후속 WorkUnit으로 분리해야 한다.
