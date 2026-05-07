# 0228 모모 work/celebrate sprite

## Problem

`?qaResearchExpeditionReady=1` 정원 화면에서 방패새싹 모모는 자동 생산 roster에는 들어와 있지만, 정원 playfield에서는 정적 support portrait처럼 보인다. 포리는 production sprite strip으로 움직이지만 모모는 독립 actor state가 없어서, 플레이어가 수집한 두 번째 생명체가 실제 정원에서 일하고 반응한다는 보상을 받지 못한다.

## Goal

모모를 도감 밖 정원 장면의 독립 support worker로 만든다. 이번 WorkUnit의 목표는 신규 gpt-image-2 raster sprite strip, accepted manifest binding, support worker animation runtime, Browser Use visible QA를 한 번에 닫아 "캐릭터가 정원에서 살아 움직인다"는 production bar를 통과하는 것이다.

## Game Studio Route

- `game-studio:game-studio`: visible gameplay, asset/FX, HUD/playfield quality 작업이다.
- `game-studio:sprite-pipeline`: 신규 모모 work/celebrate strip 생성, alpha, frame consistency, manifest animation binding을 담당한다.
- `game-studio:game-ui-frontend`: support actor anchor, playfield protection, bottom tab/label overlap 방지를 담당한다.
- `game-studio:game-playtest`: Browser Use `iab` screenshot과 interaction evidence를 중심으로 검수한다.

## Studio Deliberation

- Axis: `momo-work-celebrate-sprite`
- Brief: `reports/deliberation/momo-work-celebrate-sprite/brief.md`
- Spec: `reports/deliberation/momo-work-celebrate-sprite/spec.md`
- User review: `reports/deliberation/momo-work-celebrate-sprite/user-review.md`
- Retrospective: `reports/deliberation/momo-work-celebrate-sprite/retrospective.md`

## Role Debate Summary

- Designer: 모모는 도감/카드로 보내지 말고 정원 playfield에서 포리와 별개의 support worker로 보여야 한다.
- Art Director: 정적 portrait pulse는 실패 조건이며, 모모 identity가 읽히는 work/celebrate sprite strip이 필요하다.
- Engineer: asset만 추가하면 화면은 바뀌지 않으므로 `supportWorkers` 런타임 계약에 animation descriptor를 추가해야 한다.
- Senior Critic: work loop만으로는 부족하고, production claim 또는 QA trigger에서 visible celebrate가 실제로 관찰되어야 Go다.

## Plan

1. gpt-image-2 prompt/plan에 `sprite_creature_herb_common_002_work_strip`, `sprite_creature_herb_common_002_celebrate_strip`을 추가한다.
2. gpt-image-2로 두 strip을 생성하고 alpha/normalization을 통과한 workspace PNG로 저장한다.
3. manifest에 두 strip을 accepted spritesheet asset으로 등록하고 provenance/status 문서를 갱신한다.
4. `supportWorkers` view model 계약에 `workAnimation`과 `celebrateAnimation`을 추가한다.
5. `GardenPlayfieldHost` support actor 렌더링을 animation 우선으로 바꾸고 data attributes를 노출한다.
6. production claim 또는 QA state에서 모모 celebrate가 실제 화면에 1회 관찰되게 한다.
7. 모바일/desktop-centered mobile visual tests와 asset checks를 갱신한다.
8. Browser Use `iab` before/after/celebrate screenshot을 `reports/visual/issue-0228-momo-work-celebrate-sprite/`에 남긴다.
9. PR, checks, merge, main CI까지 진행한다.

## Acceptance Criteria

- `sprite_creature_herb_common_002_work_strip`는 6-frame 96x96 raster sprite strip으로 manifest에 accepted 등록되고 `binding.slot=work`, `creatureIds=["creature_herb_common_002"]`를 가진다.
- `sprite_creature_herb_common_002_celebrate_strip`는 6-frame 96x96 raster sprite strip으로 manifest에 accepted 등록되고 `binding.slot=celebrate`, `creatureIds=["creature_herb_common_002"]`를 가진다.
- `qaResearchExpeditionReady=1`에서 support actor는 `data-worker-id="creature_herb_common_002"`, `data-worker-role="support"`, `data-animation-asset="sprite_creature_herb_common_002_work_strip"`, `data-frame-count="6"`를 가진다.
- Browser Use `iab` 393x852 screenshot에서 모모는 원형 portrait/card decoration이 아니라 포리와 별개의 work actor로 읽힌다.
- production claim 또는 QA trigger에서 모모 celebrate state가 실제 화면에 1회 이상 관찰된다.
- 모모 actor는 plot label, resource HUD, production/action surface, bottom tabs와 겹치지 않는다.
- asset provenance/style/alpha/normalization checks와 build가 통과한다.

## Verification Commands

- `npm run check:asset-normalization`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:asset-alpha`
- `npm run build`
- `npx playwright test tests/visual/p0-mobile-game-shell.spec.ts --config playwright.config.ts -g "모바일 생산 roster는 두 번째 생명체를 정원 동료로 보여준다|모모"`
- `npm run check:ci`

## Browser Use QA Plan

- 대상 URL: `http://127.0.0.1:4173/?qaResearchExpeditionReady=1`
- before: 현재 모모가 static support portrait처럼 보이는 상태를 캡처한다.
- after work: 모모가 work strip support actor로 보이는 상태를 캡처한다.
- after celebrate: production claim 또는 QA trigger 후 모모 celebrate가 보이는 상태를 캡처한다.
- desktop: 같은 모바일 frame이 desktop browser에서도 깨지지 않는지 캡처한다.

## Risks

- gpt-image-2 output이 strict strip으로 나오지 않을 수 있다. 실패하면 prompt를 좁혀 재생성하고 accepted manifest 등록 전 normalization check를 먼저 통과시킨다.
- celebrate를 전체 receipt state machine에 연결하면 flake가 생길 수 있다. 이번에는 production claim 또는 QA state 하나에만 묶는다.
- support actor가 작아져 체감 변화가 약할 수 있다. Browser Use에서 48px 이상 silhouette read를 통과하지 못하면 CSS anchor/scale을 조정한다.

## Stop / Blocker Boundaries

- `.env`의 OpenAI Images API 키가 실제 generation에서 거부되면 Codex native image generation fallback으로 전환하되, raster PNG provenance를 남긴다.
- 실결제, 외부 배포, destructive migration, 고객 데이터 작업은 범위 밖이다.

## Evidence

- GitHub issue: https://github.com/bborok1234/strange-seed-shop/issues/430
- PR: https://github.com/bborok1234/strange-seed-shop/pull/431
- Browser Use evidence:
  - `reports/deliberation/momo-work-celebrate-sprite/browser-use-current-garden-20260507.png`
  - `reports/visual/issue-0228-momo-work-celebrate-sprite/browser-use-after-momo-work-loaded-20260507.png`
  - `reports/visual/issue-0228-momo-work-celebrate-sprite/browser-use-after-momo-celebrate-loaded-20260507.png`
  - `reports/visual/issue-0228-momo-work-celebrate-sprite/browser-use-findings-20260507.md`
- Verification:
  - `npm run check:asset-normalization` pass
  - `npm run check:asset-provenance` pass
  - `npm run check:asset-style` pass
  - `npm run check:asset-alpha` pass
  - `npm run build` pass
  - focused mobile visual regression 2 passed
  - focused desktop support actor regression 3 passed
  - `npm run check:ci` pass
