# 첫 원정 보상 source preview bridge

## 상태

- Status: review
- Game Studio route: `game-studio:game-studio -> game-studio:web-game-foundations -> game-studio:game-ui-frontend -> game-studio:phaser-2d-game -> game-studio:game-playtest`
- GitHub issue: #496
- Branch: `codex/v1-expedition-return-source-bridge`
- 연결: Issue #494, PR #495, main CI `25534928297`

## 배경

#495에서 첫 원정 문/귀환 상자/보상 FX가 전용 raster로 연결됐다. 하지만 귀환 상자 claim 이후 상태는 `첫 원정 완료 · 다음 달빛 route 실루엣`과 `꽃가루 단서 후보` receipt에서 멈춘다. `docs/GAME_BIBLE.md`의 v1 seed plan은 `seed_lunar_002`의 unlock을 `first expedition return`으로 지정하므로, 첫 원정 보상이 다음 씨앗 source와 다음 route preview로 이어져야 한다.

경쟁작 production gap은 Cell to Singularity식 discovery map/long-meta route가 “보상 받음”에서 끝나지 않고 다음 node/source silhouette를 즉시 보여줘야 한다는 점이다. 이번 slice는 첫 원정 보상을 초승달순 씨앗 source preview와 다음 원정 route 잠금 상태로 연결한다.

## Plan

1. `GardenState`에 첫 원정 source preview 상태를 추가한다.
   - `expeditionSourceClueAvailable`
   - `expeditionSourcePreviewVisible`
   - `nextExpeditionRoutePreviewId`
   - 필요 시 `lunarSourceSeedId`
2. `claimBackyardGapExpeditionReward()`가 잎 보상과 함께 source clue를 지급하도록 한다.
3. 원정 문 선택 상태에서 `초승달순 단서 보기` 또는 동등한 action을 제공한다.
4. action 후 HUD/action rail에 다음 source preview를 표시한다.
   - `초승달순 씨앗 source`
   - `다음 route: 달빛 울타리 잠김`
   - `첫 원정 보상에서 발견`
5. Playfield에는 기존 `facility_expedition_gate_v1` 주변에 작은 source/chip/route lock state를 표시한다. 새 generated asset은 이번 slice에서 만들지 않고, #495의 accepted raster gate/FX를 source reveal motion으로 재사용하되, 기존 asset 재사용만으로 끝내지 않도록 source preview state, HUD affordance, route lock screen moment를 함께 만든다.
6. `scripts/check-phaser-foundation.mjs`에 source preview telemetry/screenshot/assertion을 추가한다.

## 수용 기준

- [x] 첫 원정 claim 후 `expeditionSourceClueAvailable === true`가 된다.
- [x] claim 직후 player가 수행할 수 있는 `초승달순 단서 보기` action이 보인다.
- [x] action 후 `expeditionSourcePreviewVisible === true`와 `nextExpeditionRoutePreviewId`가 telemetry로 검증된다.
- [x] HUD/action rail이 초승달순 씨앗 source와 다음 route lock을 표시한다.
- [x] Playfield 원정 문이 source preview/route lock 상태를 world object로 보여준다.
- [x] `npm run check:phaser`가 source preview screenshot을 저장한다.
- [x] `npm run check:ci`와 `git diff --check`가 통과한다.

## 검증 명령

- [x] `npm run check:phaser`
- [x] `npm run check:ci`
- [x] `git diff --check`

## 구현 결과

- `GardenState`에 첫 원정 source preview 상태를 추가했다.
  - `expeditionSourceClueAvailable`
  - `expeditionSourcePreviewVisible`
  - `nextExpeditionRoutePreviewId`
  - `lunarSourceSeedId`
- `claimBackyardGapExpeditionReward()`가 잎 보상과 함께 `seed_lunar_002` source 단서를 지급한다.
- `초승달순 단서 보기` action이 source preview를 열고 `expedition_moon_fence_locked` route lock telemetry를 남긴다.
- HUD/action rail은 `초승달순 씨앗 source`와 `첫 원정 보상 · 다음 route: 달빛 울타리 잠김`을 표시한다.
- Playfield 원정 문은 초승달 source marker와 달빛 울타리 잠김 world state를 표시한다.
- Browser Use plugin tool은 현재 세션에 노출되지 않아 Playwright 기반 `npm run check:phaser`를 fallback evidence로 사용했다.

## Evidence

- Visual report: `reports/visual/issue-0496-expedition-return-source-bridge/visual-report-20260508.md`
- Source preview screenshot: `reports/visual/issue-0496-expedition-return-source-bridge/phaser-check-expedition-source-preview-393.png`
- Phaser smoke result: `npm run check:phaser` pass, `failures: []`
- Full gate: `npm run check:ci` pass
- Whitespace: `git diff --check` pass

## 리스크

- 새 source preview가 seed inventory까지 열어버리면 scope가 커진다. 이번 slice는 source preview/next route lock까지만 구현하고 실제 `seed_lunar_002` planting은 후속 WorkUnit으로 분리한다.
- 새 generated seed icon 없이 source를 표현하므로, visual payoff는 원정 문 주변 source chip과 기존 return reward FX 재사용에 의존한다. 이후 dedicated `seed_lunar_002` icon/FX plan-prompt가 필요할 수 있다.
- HUD가 다시 텍스트 카드처럼 길어질 수 있으므로 mobile screenshot에서 bottom action rail overlap을 확인한다.
