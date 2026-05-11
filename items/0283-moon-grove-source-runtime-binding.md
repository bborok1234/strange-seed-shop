# 월정 숲 source runtime binding

## 상태

- Status: planned
- Game Studio route: `game-studio:game-studio -> game-studio:phaser-2d-game -> game-studio:game-ui-frontend -> game-studio:game-playtest`
- GitHub issue: #534
- PR: TBD
- Branch: `codex/v1-moon-grove-source-runtime-binding`
- 연결: Issue #532, PR #533, main CI `25650492343`

## 배경

#532/#533은 `seed_moon_grove_001_icon.png`와 `fx_moon_grove_source_reward_strip_v1.png`를 생성/리뷰했다. 하지만 아직 `public/assets/manifest/assetManifest.json` accepted entry와 Phaser preload/render/telemetry가 없어 `clue_moon_grove_001` 보상이 텍스트 promise로만 보인다.

이번 slice는 월정 문 첫 원정 보상 claim 이후 `clue_moon_grove_001` source promise가 전용 seed icon과 reward FX로 보이게 연결한다. 실제 planting/acquisition loop는 후속 WorkUnit으로 분리한다.

## Creative brief

- Player verb: `월정 숲 source 확인`
- Production/progression role: 월정 문 첫 원정 보상이 다음 source target으로 시각 연결된다.
- Screen moment: `월정 문 귀환 상자 열기` 후 expedition gate 주변에 월정 숲 seed icon과 dedicated reward FX가 보인다.
- Asset/FX decision: `seed_moon_grove_001_icon`, `fx_moon_grove_source_reward_strip_v1` accepted manifest entry와 Phaser binding을 추가한다.
- Competition gap: 새 지역 보상이 텍스트 promise에서 끝나면 수집 목표가 약하다. 보상 직후 dedicated icon/FX가 다음 collect target을 약속해야 한다.
- Rejected alternative: existing `fx_expedition_return_reward_strip_v1`만 유지. 이유: return crate 보상 FX와 source clue unlock FX는 다른 의미라서 구분해야 한다.

## Plan

1. `public/assets/manifest/assetManifest.json`에 두 asset을 accepted entry로 등록한다.
2. `apps/seed-garden-phaser/src/main.ts`의 `TOPOLOGY_ASSETS`에 `moonGroveSource` seed와 `moonGroveSourceReward` FX를 추가한다.
3. Phaser preload/animation/render path를 추가해 `moonFenceNextClueVisible` 상태에서 seed icon과 source FX가 보이게 한다.
4. `window.__seedGardenMoonGroveSourceRenderedAssetKey`, `window.__seedGardenMoonGroveSourceFxKey` telemetry를 추가한다.
5. `scripts/check-phaser-foundation.mjs`에 manifest/topology/telemetry/screenshot assertion을 추가한다.
6. Browser Use `iab`를 우선 시도하고, unavailable이면 current-session blocker와 Playwright fallback screenshot evidence를 남긴다.

## 수용 기준

- manifest accepted entry가 두 asset의 실제 PNG path/dimensions/animation binding을 정확히 반영한다.
- Phaser topology asset key에 `seed_moon_grove_001_icon`, `fx_moon_grove_source_reward_strip_v1`가 포함된다.
- `월정 문 귀환 상자 열기` 후 source promise surface에서 dedicated seed icon과 source reward FX가 보인다.
- telemetry:
  - `moonGroveSourceRenderedAssetKey=seed_moon_grove_001_icon`
  - `moonGroveSourceFxKey=fx_moon_grove_source_reward_strip_v1`
- runtime image generation/API/cache 호출 없음.
- `npm run check:phaser`, `npm run check:content`, `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:asset-alpha`, `npm run check:ci`, `git diff --check`가 통과한다.

## Department Scorecard

| 부서 | 판정 | 근거 |
| --- | --- | --- |
| 기획팀 | approve | 월정 문 보상이 다음 source target으로 이어진다. |
| 리서치팀 | approve | 보상 직후 다음 수집 target을 시각화하는 production gap을 해소한다. |
| 아트팀 | approve | #532에서 생성/리뷰한 raster PNG와 strict FX strip을 runtime에 바인딩한다. |
| 개발팀 | approve | manifest + Phaser render/checker만 변경하고 acquisition/planting loop는 후속으로 분리한다. |
| 검수팀 | approve | Browser Use 우선 QA 또는 current-session blocker + Playwright checker screenshot으로 검증한다. |
| 마케팅팀 | approve | mock/internal runtime payoff이며 외부 promise 없음. |
| 고객지원팀 | approve | 플레이어가 `clue_moon_grove_001`의 의미를 다음 source icon으로 이해할 수 있다. |

## 검증 명령

- `npm run check:phaser`
- `npm run check:content`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:asset-alpha`
- `npm run check:ci`
- `git diff --check`

## Blocker boundary

- Browser Use plugin이 현재 세션에 없으면 blocker report를 남기고 Playwright checker screenshot으로 fallback한다.
- 실제 `seed_moon_grove_001` acquisition/planting/harvest loop는 후속 WorkUnit으로 분리한다.
