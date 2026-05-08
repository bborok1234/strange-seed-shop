# 밤유리 source icon/FX runtime binding

## 상태

- Status: review
- Game Studio route: `game-studio:game-studio -> game-studio:sprite-pipeline -> game-studio:game-ui-frontend -> game-studio:phaser-2d-game -> game-studio:game-playtest`
- GitHub issue: #508
- PR: #509
- Branch: `codex/v1-night-glass-source-runtime-binding`
- 연결: Issue #506, PR #507, main CI `25545174297`

## 배경

#506에서 `seed_rare_001_icon`과 `fx_night_glass_source_unlock_strip_v1`가 `gpt-image-2` provenance, alpha cleanup, strict 8-frame FX strip까지 갖춘 runtime candidate가 됐다. 하지만 `apps/seed-garden-phaser/src/main.ts`의 `밤유리 source` preview는 아직 accepted `creature_lunar_rare_001` silhouette stand-in을 tint 처리해서 보여주고, `public/assets/manifest/assetManifest.json`에도 dedicated source icon/FX가 accepted runtime asset으로 등록되지 않았다.

경쟁작 production gap은 rare route preview가 실제 보상물 icon과 unlock motion 없이 잠긴 실루엣으로만 보이면 장기 목표라기보다 placeholder로 읽힌다는 점이다. 이번 slice는 전용 source icon과 unlock FX를 manifest와 Phaser preview 화면에 binding해 `밤유리 source 보기` 순간의 visual/game-feel payoff를 만든다.

## Plan

1. `public/assets/manifest/assetManifest.json`에 `seed_rare_001_icon`과 `fx_night_glass_source_unlock_strip_v1`을 accepted asset으로 등록한다.
2. `apps/seed-garden-phaser/src/main.ts`의 `TOPOLOGY_ASSETS`에 night glass source icon/FX texture를 추가하고 preload/animation을 연결한다.
3. `renderNightGlassSourcePreview`에서 기존 rare creature silhouette 중심 표현을 dedicated seed icon 중심으로 교체하고, unlock FX strip을 preview 순간에 재생한다.
4. HUD/action surface에는 `seed_rare_001` route 정보가 유지되되, runtime telemetry에는 dedicated asset key가 포함되게 한다.
5. `scripts/check-phaser-foundation.mjs`에 required asset key와 screenshot/telemetry assertions를 추가하고 `reports/visual/issue-0508-night-glass-source-runtime-binding/`에 evidence를 남긴다.
6. Browser Use hands-on QA를 우선 시도한다. 현재 Codex tool surface에는 Browser Use `iab`가 노출되지 않았으므로 blocker를 기록하고 Playwright fallback screenshot으로 검증한다.

## 수용 기준

- manifest에 `seed_rare_001_icon`과 `fx_night_glass_source_unlock_strip_v1`이 accepted asset으로 존재한다.
- Phaser preload/topology telemetry에 두 dedicated asset key가 포함된다.
- `밤유리 source 보기` 후 playfield preview가 `creature_lunar_rare_001` stand-in이 아니라 `seed_rare_001_icon` 중심으로 읽힌다.
- unlock FX strip은 `night_glass_source.action.preview_unlock`, 8 frames, 96x96, 12fps로 animation binding된다.
- `npm run check:phaser`, `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:ci`, `git diff --check`가 통과한다.
- Browser Use가 unavailable이면 `reports/visual/issue-0508-night-glass-source-runtime-binding/browser-use-blocker-20260508.md`와 Playwright screenshot evidence를 남긴다.

## Department Scorecard

| 부서 | 판정 | 근거 |
| --- | --- | --- |
| 기획팀 | approve | `밤유리 source 보기` player verb가 dedicated rare source visual payoff로 닫힌다. |
| 리서치팀 | approve | rare route preview가 icon/FX 없이 locked silhouette에 머무르는 경쟁작 대비 production gap을 해소한다. |
| 아트팀 | approve | #506의 gpt-image-2 provenance PNG와 strict FX strip을 accepted runtime candidate로 binding한다. |
| 개발팀 | approve | manifest, Phaser preload/render, deterministic checker만 수정하고 runtime image generation은 추가하지 않는다. |
| 검수팀 | approve | Browser Use 우선, 현재 unavailable blocker 기록, Playwright fallback screenshot과 `check:phaser` assertion으로 검증한다. |
| 마케팅팀 | approve | 내부 playable promise이며 외부 채널/실결제/광고 없음. |
| 고객지원팀 | approve | 플레이어가 다음 rare source가 무엇인지 icon과 잠금 FX로 이해할 수 있다. |

## Subagent/Team Routing

- Solo execute. 변경 범위가 manifest + Phaser preview binding + focused checker로 좁고, Browser Use unavailable 여부는 현재 tool surface에서 즉시 확인됐다.

## 검증 명령

- `npm run check:phaser`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:ci`
- `git diff --check`

## 구현 Evidence

- `public/assets/manifest/assetManifest.json`에 `seed_rare_001_icon`과 `fx_night_glass_source_unlock_strip_v1` accepted entry를 추가했다.
- `apps/seed-garden-phaser/src/main.ts`의 `TOPOLOGY_ASSETS`에 dedicated source icon/FX를 추가하고 preload/animation에 연결했다.
- `renderNightGlassSourcePreview`를 accepted rare creature silhouette 중심에서 `seed_rare_001_icon` + `night-glass-source-unlock-once` 중심으로 교체했다.
- telemetry에 `__seedGardenNightGlassSourceRenderedAssetKey`와 `__seedGardenNightGlassSourceFxKey`를 추가했다.
- `scripts/check-phaser-foundation.mjs`가 `seed_rare_001_icon`, `fx_night_glass_source_unlock_strip_v1`, rendered asset key, FX key를 검증한다.
- Browser Use: 현재 tool surface에서 `browser-use:browser`/`iab` callable이 노출되지 않아 `reports/visual/issue-0508-night-glass-source-runtime-binding/browser-use-blocker-20260508.md`를 남겼다.
- Playwright fallback: `npm run check:phaser` 통과, screenshot `reports/visual/issue-0508-night-glass-source-runtime-binding/phaser-check-night-glass-source-preview-393.png`에서 dedicated icon/FX preview를 확인했다.

## 리스크

- FX strip은 생성 후보를 정규화한 것이므로 실제 Phaser animation에서 frame 밀도와 timing이 약하면 follow-up tuning이 필요하다.
- Browser Use가 계속 노출되지 않으면 visual QA는 blocker report + Playwright fallback으로만 남는다.
