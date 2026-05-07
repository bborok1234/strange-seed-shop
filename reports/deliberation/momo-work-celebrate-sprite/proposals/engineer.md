# Engineer Proposal — 모모 work/celebrate sprite 계약

## 결론

이 spec은 **조건부 구현 가능**하다. 조건은 신규 모모 sprite strip을 accepted raster PNG로 만들고, `supportWorkers`에 primary actor와 같은 animation descriptor 계약을 붙이는 것이다. 정원 layout 전체 재설계나 save migration 없이 한 PR로 넣을 수 있지만, asset 생성/정규화/manifest 검증까지 포함하므로 시각 QA 실패 시 같은 PR 안에서 1회 조정 여지는 남겨야 한다.

## Files Touched

- `assets/source/asset_plan.json`: `sprite_creature_herb_common_002_work_strip`, `sprite_creature_herb_common_002_celebrate_strip` asset plan 추가.
- `assets/source/asset_prompts.json`: 두 strip의 gpt-image-2 생성 prompt와 acceptance 추가.
- `public/assets/game/sprites/production/creature_herb_common_002_work_strip.png`: 모모 작업 loop. 권장 6 frames, 96x96 frame, total 576x96, 10fps, repeat -1.
- `public/assets/game/sprites/production/creature_herb_common_002_celebrate_strip.png`: 모모 보상/납품 반응. 권장 6 frames, 96x96 frame, total 576x96, 12fps, repeat 0.
- `public/assets/manifest/assetManifest.json`: 두 asset을 `category=sprite_strip`, `status=accepted`, `animation.kind=spritesheet`, `animation.binding.target=actor`, `animation.binding.creatureIds=["creature_herb_common_002"]`로 등록.
- `src/types/game.ts`: 필요하면 `PlayfieldAnimationBinding`에 `actorRole?: "primary" | "support"`를 추가할 수 있지만, v1은 `creatureIds`만으로 충분하므로 타입 변경은 보류한다.
- `src/game/playfield/types.ts`: `supportWorkers[]`에 `workAnimation?: { assetId; path; frames; frameRate }`와 선택적 `celebrateAnimation?: { assetId; path; frames; frameRate }` 추가.
- `src/App.tsx`: `getProductionWorkAnimationAssetId`를 creature id 매핑 함수로 확장하고, support worker map에서 `workAnimation`을 채운다. celebrate는 reward/claim receipt가 있을 때만 쓰려면 별도 `getProductionCelebrateAnimationAssetId`가 필요하다.
- `src/game/playfield/GardenPlayfieldHost.tsx`: support worker static image 렌더링을 primary actor와 동일한 sprite wrapper로 바꾸고 `data-animation-asset`, `data-frame-count`, `data-worker-role="support"`, `data-worker-id`를 유지한다.
- `src/styles.css`: `.playfield-workstage-support .playfield-production-actor-sprite` 크기를 54px workstage에 맞추고 기존 `workstage-support-bob`과 strip `steps()`가 중첩되어도 흔들림/프레임 이동이 깨지지 않게 scope를 분리한다.
- `tests/visual/p0-mobile-game-shell.spec.ts`: 기존 “정원 동료” test에 animation attribute, frame count, bounding box, tab overlap assertion 추가.
- `tests/visual/desktop-art-share.spec.ts`: desktop workstage support actor도 static portrait가 아니라 sprite binding을 가진다는 assertion 추가.

## Estimated PR Decomposition

권장 PR은 1개다. 변경 규모는 asset/source/manifest 5개 파일 + runtime/test 5개 파일로 약 250~450줄 수준이며, 기존 production actor 계약을 재사용하면 rollback 비용도 낮다.

분리해야 하는 조건은 asset 생성이 실패하거나 strip 정규화가 2회 이상 흔들리는 경우다. 그때는 PR A를 “runtime support-worker animation binding + fallback + tests”로 만들고, PR B를 “모모 accepted strip manifest integration”으로 분리한다. 단, PR A만 머지하면 정적 asset fallback으로 남기 때문에 사용자가 지적한 production payoff는 미완이다.

## Runtime Contract

`GardenPlayfieldViewModel.productionScene.supportWorkers[]`는 다음 계약을 가져야 한다.

```ts
supportWorkers?: Array<{
  id: string;
  name: string;
  roleLabel: string;
  family: "herb" | "candy" | "lunar";
  assetId: string;
  assetPath?: string;
  workAnimation?: {
    assetId: string;
    path: string;
    frames: number;
    frameRate: number;
  };
  celebrateAnimation?: {
    assetId: string;
    path: string;
    frames: number;
    frameRate: number;
  };
}>;
```

렌더링 우선순위는 `worker.workAnimation` -> `worker.assetPath` -> fallback text다. celebrate는 이번 PR에서 항상 재생 상태까지 넣기보다, `orderRewardMotion` 또는 claim receipt가 활성화된 순간에 `data-celebrate-animation-asset`만 노출하고 실제 one-shot state machine은 다음 PR로 넘기는 편이 안전하다. 이유는 현재 `ProductionScene`은 receipt 상태와 actor animation slot을 분리하지 않고 있고, one-shot 재생을 React state로 추가하면 side-effect 있는 timer/useEffect chain이 생긴다.

## Manifest Fields

모모 work strip manifest 예시는 다음 형태가 최소 계약이다.

```json
"sprite_creature_herb_common_002_work_strip": {
  "path": "/assets/game/sprites/production/creature_herb_common_002_work_strip.png",
  "category": "sprite_strip",
  "family": "herb",
  "rarity": "common",
  "intended_use": "production_support_actor_work_strip",
  "width": 576,
  "height": 96,
  "status": "accepted",
  "tags": ["phase0_5", "sprite_strip", "support_actor", "work", "gpt-image-2", "screen_moment:production_garden", "player_verb:watch_auto_production"],
  "notes": "strict_strip=true; frames=6; frame_width=96; frame_height=96; intended_frame_rate=10; loop=true; source_reference_asset_id=creature_herb_common_002",
  "animation": {
    "kind": "spritesheet",
    "key": "sprite_creature_herb_common_002_work_strip",
    "frames": 6,
    "frameWidth": 96,
    "frameHeight": 96,
    "frameRate": 10,
    "repeat": -1,
    "sourceAssetIds": ["creature_herb_common_002"],
    "binding": {
      "target": "actor",
      "slot": "work",
      "creatureIds": ["creature_herb_common_002"]
    }
  }
}
```

celebrate strip은 `slot=celebrate`, `frameRate=12`, `repeat=0`, `screen_moment:harvest_or_order_reward`, `player_verb:claim_reward`로 둔다. `binding.target`은 새 target을 만들지 말고 기존 `"actor"`를 유지한다. support 여부는 runtime roster 위치가 결정하므로 manifest schema를 늘리지 않는 편이 안전하다.

## Fallback Behavior

manifest에 모모 strip이 없거나 `animation.kind !== "spritesheet"`이면 현재처럼 `creature_herb_common_002.png` 정적 portrait를 보여준다. 이 fallback은 production continuity용이지 acceptance 통과 조건이 아니다. QA query에서 `qaResearchExpeditionReady=1`인 경우에는 `data-worker-id="creature_herb_common_002"`를 가진 support actor가 `data-animation-asset="sprite_creature_herb_common_002_work_strip"`를 가져야 통과로 본다.

## Data Attributes / Test Hooks

- `.playfield-workstage-support[data-worker-id="creature_herb_common_002"]`
- `data-worker-role="support"`
- `data-asset-id="creature_herb_common_002"`
- `data-animation-asset="sprite_creature_herb_common_002_work_strip"`
- `data-frame-count="6"`
- `data-work-anchor="plot-2-order-crate"`
- 선택: `data-celebrate-animation-asset="sprite_creature_herb_common_002_celebrate_strip"`

테스트는 CSS animation 이름만 보지 말고 DOM binding과 bounding box를 같이 봐야 한다. 기존 desktop/mobile tests는 support actor가 보이는지만 확인하므로, 정적 portrait 회귀를 잡지 못한다.

## Save Migration Plan

save migration은 필요 없다. `PlayerSave`에는 discovered creature ids만 있고, animation state는 manifest + derived view model에서 계산된다. 새 필드를 save에 저장하지 않는 것이 맞다. support worker가 늘어나도 `discoveredCreatureIds`와 기존 production worker 계산을 그대로 사용한다.

## Performance Budget Impact

런타임 비용은 낮다. 576x96 PNG 2개는 압축 후 대략 수십~수백 KB 범위로 예상되며, React render frequency는 현재 `viewModel` 갱신 주기를 넘지 않는다. CSS `steps()` animation 1개가 support actor에 추가되지만 이미 primary actor와 bob animation이 있으므로 모바일 393x852에서 frame budget 위험은 낮다. 단, 1254px 원본 portrait를 support actor에 그대로 쓰는 현재 fallback보다 strip이 훨씬 runtime 친화적이어야 하므로 정규화 실패로 큰 PNG가 들어오면 `check:asset-normalization`에서 반드시 막아야 한다.

## Verification Commands

- `npm run check:asset-normalization`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:asset-alpha`
- `npm run build`
- `npx playwright test tests/visual/p0-mobile-game-shell.spec.ts --config playwright.config.ts -g "모바일 생산 roster는 두 번째 생명체를 정원 동료로 보여준다"`
- `npx playwright test tests/visual/desktop-art-share.spec.ts --config playwright.config.ts -g "production actor와 support actor"`
- Browser Use `iab` visible QA: `http://127.0.0.1:4173/?qaResearchExpeditionReady=1`에서 393x852와 desktop 1216x900 screenshot을 `reports/visual/issue-0228-momo-work-celebrate-sprite/`에 저장하고, support actor가 plot/order target 안쪽에서 움직이는지 확인한다.

## Disagreements I Anticipate

- Designer가 celebrate를 즉시 보상 순간에 one-shot으로 보이길 원할 수 있다. 나는 v1에서 work loop를 먼저 runtime 계약으로 고정하고, celebrate는 manifest와 data hook까지 넣은 뒤 claim/order event state machine은 다음 PR로 분리하는 쪽을 권한다.
- Art Director는 workstage에서 포리와 모모가 같은 96px strip이면 캐릭터 위계가 약하다고 볼 수 있다. 구현상 support actor는 CSS에서 54px viewport로 downscale하고 anchor만 다르게 두면 되므로 asset 자체는 같은 frame size로 통일해야 정규화와 sprite code가 단순하다.
- Senior Critic은 “또 바뀐 게 작다”고 비판할 수 있다. 이 PR은 화면 전체 혁신이 아니라 캐릭터가 도감 밖 정원에서 실제로 일한다는 production bar를 통과시키는 foundation이며, 이후 creature별 role motion을 반복 가능하게 만드는 첫 계약이다.

## Open Questions

- gpt-image-2 생성이 이번 세션에서 바로 가능한지, 아니면 Codex native fallback을 써야 하는지 확인이 필요하다. 둘 다 provenance를 남길 수 있지만, accepted manifest에는 실제 생성 경로와 blocker 이력을 정확히 써야 한다.
- celebrate strip을 이번 PR에서 화면에 실제 one-shot으로 노출할지, 아니면 accepted asset + manifest + data hook까지만 둘지 Director 결정이 필요하다. 엔지니어 관점에서는 work loop shipping을 우선한다.
- `PlayfieldAnimationBinding`에 `actorRole`을 추가할지 여부는 보류한다. 지금은 `creatureIds`와 roster position으로 충분하며 schema 확장은 다음 creature 3종 이상으로 반복될 때가 적절하다.
