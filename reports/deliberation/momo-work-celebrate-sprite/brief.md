# Brief — Momo Work/Celebrate Sprite

## Axis

`방패새싹 모모`가 정원 생산 장면에서 단순 support portrait가 아니라 독립 work/celebrate actor로 읽히게 할 것인가, 한다면 어떤 sprite/FX 범위와 runtime binding으로 구현할 것인가를 결정한다.

## Current State

- Browser Use `iab` capture: `reports/deliberation/momo-work-celebrate-sprite/browser-use-current-garden-20260507.png`.
- 현재 URL: `http://127.0.0.1:4173/?qaResearchExpeditionReady=1`.
- 현재 화면에서 포리와 모모가 workstage에 보이지만, 포리는 production actor sprite 계열이 있고 모모는 `supportWorkers`의 정적 asset 표시로 보인다.
- `GardenPlayfieldHost.tsx`의 `ProductionScene`은 primary actor에 `workAnimation`을 연결하지만 `supportWorkers`는 `assetPath` 이미지만 렌더링한다.
- Manifest에는 `creature_herb_common_001`의 production idle/work/celebrate strip이 있으나 `creature_herb_common_002`는 portrait/static 중심이다.

## Why This Axis Now

사용자가 반복해서 지적한 핵심은 “캐릭터가 도감에만 존재하고 게임 장면에서 움직이지 않는다”는 점이다. 최근 PR들이 HUD affordance와 row 정보 설계를 고쳤지만, 다음 production bar는 생명체가 실제 정원 actor로 일하고 반응하는 장면이다. 모모는 두 번째 생명체로 이미 production roster에 참여하므로, 모모의 work/celebrate state를 잡으면 수집 보상과 생산 엔진이 더 직접적으로 연결된다.

## Constraints

- Game Studio route는 `game-studio:game-studio` -> `game-studio:sprite-pipeline` -> `game-studio:game-playtest`로 본다.
- 신규 accepted game graphics는 raster PNG만 허용한다. SVG/vector/code-native game asset은 금지한다.
- 신규 sprite/FX가 들어가면 manifest `animation.binding`, frame count, frame size, intended frame rate, provenance, Browser Use evidence가 필요하다.
- Browser Use `iab`는 visible QA의 기본 경로다.
- Phase 0 금지 영역인 실제 결제, 외부 배포, 런타임 이미지 생성은 건드리지 않는다.
- 한 PR에서 asset generation, manifest integration, runtime support-worker animation, visual regression을 모두 넣을 수 있는지 Engineer가 분할 판단한다.

## Out of Scope

- 전체 정원 layout 재설계.
- 새 경제 시스템 또는 새 주문 chain 추가.
- 모든 creature의 full animation bible 완성.
- 실제 유료 API batch를 지금 즉시 대량 실행하는 것. 필요한 경우 이번 axis는 최소 모모 work/celebrate strip 또는 Codex native fallback 범위로 제한한다.

## Reference Artifacts

- `docs/NORTH_STAR.md`
- `docs/IDLE_CORE_CREATIVE_GUIDE.md`
- `docs/ART_HUD_PRODUCTION_SPEC.md`
- `docs/DESIGN.md`
- `public/assets/manifest/assetManifest.json`
- `src/game/playfield/GardenPlayfieldHost.tsx`
- `src/game/playfield/types.ts`
- `src/App.tsx`
- `src/styles.css`
- `tests/visual/p0-mobile-game-shell.spec.ts`
- `reports/deliberation/momo-work-celebrate-sprite/browser-use-current-garden-20260507.png`
