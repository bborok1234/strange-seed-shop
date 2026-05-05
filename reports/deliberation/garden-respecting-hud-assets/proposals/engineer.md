# Engineer Proposal — garden-respecting-hud-assets

## Files Touched

결론: **이 조건이면 구현 가능**. 첫 구현 cycle은 save schema를 건드리지 않고, HUD를 manifest 기반 정적 raster asset slot으로 연결해야 한다. `PlayerSave`에 HUD skin 상태를 넣거나 런타임 이미지 생성을 붙이는 안은 본 axis에서는 거절한다.

예상 수정 범위:

| 영역 | 파일 | 예상 변경 | 리스크 |
|---|---|---:|---|
| asset source-of-truth | `assets/source/asset_plan.json`, `assets/source/asset_prompts.json`, `assets/source/gpt_image_asset_provenance.json` 또는 Codex native generation evidence | HUD frame/decal PNG 후보 6~8개 추가 | provenance 누락 시 `check:asset-provenance` 실패 |
| manifest | `public/assets/manifest/assetManifest.json` | `ui_frame` category 중심으로 accepted asset 등록 | 새 category를 만들면 `src/types/game.ts`와 checker까지 확장 필요 |
| asset typing | `src/types/game.ts` | 가능하면 변경 없음. 새 category가 반드시 필요하면 `AssetCategory` 확장 | 현재 manifest에는 `ui_order_crate_leaf_001.category = "ui"`가 있어 TS union과 불일치. 새 자산은 `ui_frame`으로 피하는 것이 안전 |
| main UI composition | `src/App.tsx` | `getAssetPath`로 side dock / next-action / resource plaque / plot HUD asset path를 준비하고 props로 전달 | 현재 5,727줄 단일 파일이라 작은 변경도 review 비용이 큼 |
| playfield DOM overlay | `src/game/playfield/GardenPlayfieldHost.tsx` | `GardenHudAssets` 같은 local prop 추가, `GardenPlotCard`에 frame/ribbon/decal image layer 삽입 | plot click target, aria-label, disabled state 회귀 가능 |
| playfield types | `src/game/playfield/types.ts` | viewModel에 넣기보다 host prop local type 선호. 필요 시 optional `hudAssets`만 추가 | viewModel에 넣으면 `buildGardenPlayfieldViewModel` 재계산 범위 증가 |
| styles | `src/styles.css` | cream rectangle 배경을 alpha-aware + raster layer로 교체. desktop/mobile media invariant 유지 | 이미 7,958줄. hardcoded hex/px 추가가 누적되기 쉬움 |
| checks | `tests/visual/desktop-art-share.spec.ts` 또는 기존 visual check script | dock/plot card asset layer presence와 overlap guard 추가 | DOM 존재만 보면 실패를 놓침. screenshot/geometry 측정 필요 |

권장 asset slot은 기술 인터페이스 기준으로만 정의한다. 실제 톤·색·형태는 Art Director가 결정한다.

- `ui_hud_resource_plaque_001`: side dock 자원 card의 배경/모서리 장식.
- `ui_hud_next_action_sign_001`: 다음 행동 card의 나무 표지판/리본 계층.
- `ui_hud_plot_seedbed_frame_001`: DOM plot card의 바탕 frame. 기존 `.playfield-plot-card` cream fill을 대체.
- `ui_hud_plot_ready_ribbon_001`: ready 상태 강조. 텍스트는 DOM으로 유지하고 이미지는 장식만 담당.
- `ui_hud_dock_vine_divider_001`: side dock 카드 간 visual grouping.
- `ui_hud_feedback_sun_pill_001`: `playfield-action-feedback`의 capsule 배경 후보.

## Estimated PR Decomposition

한 PR로 asset 생성, manifest, App, playfield, CSS, visual tests까지 밀어 넣는 안은 거절한다. 500줄 초과와 5+ 파일 변경 가능성이 높고, 실패 시 원인이 asset 품질인지 layout wiring인지 분리되지 않는다.

1. **PR1 — HUD asset vocabulary 생성/등록**
   - 수정: `assets/source/asset_plan.json`, `assets/source/asset_prompts.json`, provenance/evidence, `public/assets/manifest/assetManifest.json`.
   - 구현 코드 수정 없음.
   - acceptance: 새 PNG가 6~8개, 모두 text/logo/watermark 없음, `runtime_generation_allowed: false`, `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:asset-normalization`, `npm run check:asset-alpha` 통과.
   - 예상 변경량: JSON/evidence 중심 120~220줄 + PNG 파일.

2. **PR2 — side dock resource/next-action asset skin**
   - 수정: `src/App.tsx`, `src/styles.css`, visual gate.
   - 목표: `.side-dock-card`의 cream-on-cream을 raster plaque/sign/decal slot으로 바꾸되 dock 폭·scroll 동작은 유지.
   - acceptance: desktop 1280/1600/1920에서 dock 카드가 garden-stage를 침범하지 않고, `data-dock-expanded=false` 기본 garden 화면에서 다음 행동이 여전히 보임.
   - 예상 변경량: 120~220줄. `App.tsx`에는 asset path helper와 최소 markup만 추가.

3. **PR3 — plot card seedbed frame + ready ribbon**
   - 수정: `src/App.tsx`, `src/game/playfield/GardenPlayfieldHost.tsx`, `src/styles.css`, visual gate.
   - 목표: `.playfield-plot-card`의 solid cream/yellow rectangle을 raster seedbed frame으로 대체. Phaser scene 자체는 건드리지 않는다.
   - acceptance: click target 유지, disabled empty plot 유지, ready/growing 상태 텍스트 가독성 유지, dock 확장 시 plot card dev-panel overlap 0.
   - 예상 변경량: 180~300줄. `GardenPlayfieldHost.tsx` 변경은 prop wiring + image layer 정도로 제한.

4. **PR4 — feedback pill / onboarding hot-state 보강**
   - 수정: `src/App.tsx`, `src/styles.css`, 필요 시 visual report.
   - 목표: `playfield-action-feedback`와 side dock `nextAction` hot-state를 asset-backed로 강화. 첫 세션 진입점 약화 문제를 회복.
   - acceptance: mobile bottom tab overlap 없음, desktop art-share 12/12 PASS 유지, screenshot review에서 next action이 작은 chip으로만 묻히지 않음.
   - 예상 변경량: 100~180줄.

5. **PR5 — checker hardening / evidence package**
   - 수정: visual test와 `reports/visual/...`.
   - 목표: Cycle A measurement gap 재발 방지. DOM presence가 아니라 screenshot/geometry로 plot/dock/HUD asset layer가 실제 보이는지 검증.
   - 예상 변경량: 80~160줄.

## Save Migration Plan

save migration은 **없어야 한다**. 본 axis의 기본 산출물은 visual HUD skin이고, `PlayerSave`의 resource/economy/growth/order 필드와 무관하다.

금지할 변경:

- `PlayerSave`에 `hudSkinId`, `seenHudAssetIntro`, `selectedTheme` 같은 필드 추가.
- `localSaveStore`에 UI preference를 섞는 변경.
- asset generation/provenance 상태를 save에 기록하는 변경.

허용할 변경:

- `AssetManifest.assets`에 새 정적 PNG entry 추가.
- `getAssetPath(manifest, assetId)`로 실패 시 기존 CSS/텍스트 fallback 유지.
- `GardenPlayfieldHost`에 optional prop으로 asset path 전달. manifest가 로드되지 않았거나 asset이 깨져도 gameplay action은 유지.

따라서 `src/lib/persistence.ts`와 `src/types/game.ts`의 `PlayerSave`는 변경하지 않는 것이 원칙이다. 단, 새 asset category를 만들기로 Director가 결정하면 `AssetCategory` union과 asset checker를 같이 수정해야 하므로 별도 PR로 분리한다. 첫 cycle에서는 `ui_frame` category + `tags: ["hud", "decal", ...]`로 충분하다.

## Performance Budget Impact

런타임 성능은 통제 가능하지만 asset 크기 제한을 spec에 박아야 한다.

- Bundle size: PNG가 `public/assets`에서 로드되므로 Vite JS bundle에는 직접 포함되지 않는다. JS 증가는 props/helper 정도로 1~3KB 수준이어야 한다.
- Image network/memory: HUD PNG 6~8개를 모두 1024~1254px로 만들면 낭비다. frame/decal은 256~512px 기준, 개별 PNG compressed 150KB 이하, 총 신규 HUD PNG 900KB 이하를 budget으로 둔다. 1MB+ 단일 HUD asset은 거절.
- React render: `getAssetPath` 결과는 manifest 기준으로 안정적이므로 `useMemo`로 묶거나 상수 객체로 전달한다. `now` 1초 tick마다 asset object identity가 바뀌면 `GardenPlayfieldHost` props diff가 커질 수 있으므로 asset path object는 `useMemo([manifest])`가 필요하다.
- Phaser: PR2~PR4에서는 Phaser scene을 새로 그리지 않는다. plot card는 React DOM overlay이므로 `GardenScene.ts` 변경을 피한다. in-canvas diegetic UI는 별도 `garden-diegetic-ui` axis에서 다루는 것이 맞다.
- Motion/tween: 새 raster HUD는 정적이어야 한다. ready ribbon/feedback pill motion은 기존 CSS animation 또는 기존 Phaser FX 재사용. 새 동시 tween 체인을 추가하지 않는다.
- Layout: desktop 기본 stage art-share 75% 이상, Cycle A gate 12/12 PASS 유지. mobile은 기존 하단 탭과 body scroll invariant를 깨지 않아야 한다.

## Verification Commands

개발 PR별 최소 검증:

```bash
npm run check:asset-provenance
npm run check:asset-style
npm run check:asset-normalization
npm run check:asset-alpha
npm run check:art-share
npm run check:p0-ui-ux
npm run build
```

merge 전 넓은 검증:

```bash
npm run check:ci
npm run check:visual
```

asset-only PR은 `check:asset-*` + manifest JSON review가 핵심이고, UI 적용 PR부터 `check:art-share`, `check:p0-ui-ux`, Browser Use screenshot evidence가 필요하다. 특히 다음 케이스는 screenshot으로 남겨야 한다.

- garden desktop 1280x800, 1600x900, 1920x1180.
- seeds tab desktop dock-expanded 상태에서 plot card가 dev-panel에 가리지 않는지.
- mobile 393x852에서 body scroll 없음, bottom tab overlap 없음, plot/next-action 텍스트 잘림 없음.
- manifest asset broken fallback 상태에서도 gameplay action 가능.

## Disagreements I Anticipate

- Designer가 “다음 행동을 더 크게” 요구할 가능성: 기능적으로 동의하되, stage 중앙에 새 큰 panel을 되살리는 방식은 반대한다. side dock hot-state 또는 plot-adjacent ribbon으로 해결해야 Cycle A의 art-share 회복을 보존한다.
- Art Director가 많은 장식 asset을 요구할 가능성: asset vocabulary는 찬성하지만 첫 cycle은 6~8개 slot으로 제한해야 한다. decorative-only 15개 이상은 review와 loading budget을 먼저 망가뜨린다.
- Director가 `garden-diegetic-ui`까지 한 번에 묶으려 할 가능성: 반대한다. DOM HUD skin과 Phaser in-canvas UI는 리스크가 다르다. 이번 axis는 DOM/manifest 연결로 끝내고, in-canvas는 별도 spec이 필요하다.
- “category를 `ui_decal`로 새로 만들자”는 안: 장기적으로는 가능하지만 첫 PR에서는 반대한다. `AssetCategory`, checker, manifest convention까지 바뀌어 asset 품질 검증과 UI 적용 검증이 섞인다.
- cost-only 축소안: 단순히 CSS alpha만 낮추거나 카드 border만 바꾸는 안은 사용자의 핵심 불만을 해소하지 못한다. 비용을 줄이더라도 raster HUD asset slot 자체는 도입해야 한다.

## Open Questions

1. HUD asset slot 6~8개 중 PR1 필수 최소 세트는 어디까지인가: resource plaque / next-action sign / plot seedbed frame / ready ribbon 4개면 첫 vertical slice로 충분한가?
2. 새 HUD PNG의 기준 해상도와 alpha 품질 기준은 Art Director가 256/512/1024 중 무엇으로 고정할 것인가?
3. `ui_order_crate_leaf_001.category = "ui"` 기존 불일치를 이번 axis에서 정리할 것인가, 아니면 새 HUD asset은 `ui_frame`만 사용하고 별도 harness defect로 분리할 것인가?
4. plot card skin은 DOM overlay에 먼저 적용할 것인가, 아니면 `garden-diegetic-ui`와 맞춰 Phaser canvas 쪽으로 넘길 것인가?
5. 첫 세션 onboarding 회복은 side dock next-action hot-state만으로 충분한가, 아니면 plot-adjacent prompt ribbon까지 포함해야 하는가?
