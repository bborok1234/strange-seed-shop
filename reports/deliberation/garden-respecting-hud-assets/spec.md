# Spec — Garden-Respecting HUD Assets

- Axis slug: `garden-respecting-hud-assets`
- Brief: `reports/deliberation/garden-respecting-hud-assets/brief.md`
- Director: Codex main thread
- Date: 2026-05-05
- Status: approved for implementation planning by standing delegation; visible gameplay cycle close still requires evidence review

## Vision

플레이어가 정원 화면을 켜면 HUD가 앱 카드 묶음이 아니라 정원 안의 사물로 읽힌다. 첫 시선은 배경 온실과 밭으로 가고, 밭의 빈 자리·성장 중·수확 가능 상태는 cream card가 아니라 흙 두둑과 낮은 나무 표지, 잎 리본이 붙은 playfield object로 보인다. 자원과 다음 행동은 계속 보이지만 정원 위를 덮는 패널이 아니라 잎 바구니, 작은 표지판, 낮은 리본처럼 reward loop를 닫는 보조 사물로 작동한다.

## Layout Skeleton

본 axis는 Cycle A의 rail/stage/dock 골격을 유지한다. layout 재설계가 아니라 HUD surface vocabulary를 raster asset과 tokenized DOM layer로 바꾸는 축이다.

| Viewport | Grid | Regions |
|---|---|---|
| Mobile | 기존 single column 유지 | `garden-stage`, `playfield-overlay`, `action-ribbon`, `bottom-tabs` 유지. 새 asset은 bottom tab을 침범하지 않는 plot marker/작은 action ribbon family만 허용 |
| Tablet | 기존 mobile-first flow 유지 | `garden-stage` 중심, top/bottom compact HUD. desktop side dock 축소 이식 금지 |
| Desktop | Cycle A 3-column 유지 | `rail`, `garden-stage`, `side-dock`. 첫 적용 순간은 `garden-stage` 안 `playfield-plot-card`이며, dock은 후속 PR에서 낮은 priority HUD object로 전환 |
| Wide desktop | desktop 골격 유지 | plot card 확대 금지. 남는 공간은 art breathing으로 남기고, dock은 `compact` 성격을 유지 |

## Design Tokens

새 token은 asset text-safe zone과 depth만 위해 최소로 둔다. token 값은 `assets/source/asset_style_bible.json`의 herb/sun/greenhouse palette에서 추출하며, spec에는 raw color 값이나 임시 수치를 박지 않는다.

| Token | Type | Value | Used by |
|---|---|---|---|
| `--hud-surface-soil-marker` | color/surface | art-bible soil marker surface | plot marker fallback fill |
| `--hud-surface-sun-ribbon` | color/surface | art-bible warm sun ribbon surface | ready ribbon, later next-action sign |
| `--hud-ink-primary` | color/text | art-bible deep greenhouse ink | plot label, action label |
| `--hud-ink-muted` | color/text | art-bible muted greenhouse ink | passive state text |
| `--hud-inset-text-safe` | spacing | asset text-safe inset | DOM text inside raster marker/sign |
| `--hud-elevation-stage-object` | elevation | low stage-attached shadow | plot marker |
| `--hud-elevation-action` | elevation | single primary action shadow | ready ribbon / next-action sign |
| `--hud-motion-nudge` | motion | short primary affordance nudge | one actionable object only |

Token rule: stage 안 새 opaque cream surface 금지. 새 HUD PNG가 들어가도 fallback DOM 배경이 cream rectangle로 남으면 실패다.

## Component Composition

| Component | Status | Notes |
|---|---|---|
| `GardenStage` | keep | Cycle A art-share 골격 유지 |
| `GardenPlayfieldHost` | skin first | Phaser scene은 건드리지 않고 React overlay plot button에 raster plot marker layer를 붙인다 |
| `GardenPlotCard` | replace visual surface | DOM button, aria, click target은 유지. cream card surface는 `plot seedbed marker` + text-safe DOM layer로 대체 |
| `SideDock` | keep, defer skin | 첫 cycle에서는 plot-first. resource/next-action HUD object는 후속 PR로 적용 |
| `side-dock-next-action` | defer to PR3 | 큰 panel 격상 금지. later `sun ribbon sign`으로 footprint 증가 없이 priority만 상승 |
| `bottom-tabs` / rail | unchanged in first cycle | nav polish asset은 이번 axis 후반 또는 별도 polish로 미룸 |
| `assetManifest` HUD entries | add narrowly | 첫 vertical slice는 plot marker family만 accepted candidate로 시작 |

### First Asset Family

첫 batch는 `plot-first`로 고정한다.

| Asset id | Role | Required binding |
|---|---|---|
| `ui_hud_plot_seedbed_empty_001` | 빈 밭을 “심을 자리”로 읽히게 하는 text-free PNG frame | `screen_moment=fresh_garden`, `player_verb=plant_seed` |
| `ui_hud_plot_seedbed_growing_001` | 성장 중 밭을 “톡톡 누를 자리”로 읽히게 하는 PNG frame | `screen_moment=growing_plot`, `player_verb=tap_growth` |
| `ui_hud_plot_ready_ribbon_001` | 수확 가능 상태의 primary affordance | `screen_moment=ready_plot`, `player_verb=harvest_plot` |
| `ui_hud_plot_text_plate_001` | plot label/progress의 text-safe backing | `screen_moment=all_plot_states`, `must_not_obscure=stage_art` |

후속 asset family는 `ui_hud_next_action_sun_sign_001`, `ui_hud_resource_leaf_basket_001`, `ui_hud_resource_pollen_bottle_001`, `ui_hud_order_crate_state_tag_001` 순서로 검토한다. `ui_hud_leaf_tab_marker_001`, `ui_hud_vine_edge_divider_001`는 첫 cycle에서 제외한다.

## Acceptance Criteria

- [ ] 첫 구현 moment는 plot card다. 첫 UI 적용 PR에서 `side-dock`이나 rail이 아니라 `GardenPlotCard` cream surface가 raster plot marker family로 대체된다.
- [ ] `GardenPlotCard`는 DOM button, aria-label, keyboard/click target, disabled empty state를 유지한다.
- [ ] 새 asset은 runtime generation 없이 pre-produced PNG로 저장되고, `assets/source/asset_plan.json`, `assets/source/asset_prompts.json`, provenance, `public/assets/manifest/assetManifest.json`에 근거가 남는다.
- [ ] 각 HUD asset entry는 `screen_moment`, `player_verb`, `state_binding`, `text_safe_zone`, `must_not_obscure`를 tags 또는 notes에 남긴다.
- [ ] `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:asset-normalization`, `npm run check:asset-alpha` 통과.
- [ ] `npm run check:art-share`, `npm run check:p0-ui-ux`, `npm run build` 통과.
- [ ] Browser Use 또는 동등한 screenshot evidence가 desktop 1280x800, desktop dock-expanded seeds tab, loaded ready plot, mobile 393x852 상태를 남긴다.
- [ ] screenshot review에서 plot card의 시각 주도권이 cream rectangle에서 plot marker object로 넘어간다. 단순 background-image 추가 후 기존 rectangle이 남으면 실패다.
- [ ] mobile은 body scroll 없음, bottom tab overlap 없음, plot/action 텍스트 잘림 없음.
- [ ] 새 motion은 한 화면에 하나의 actionable object만 `--hud-motion-nudge`를 받을 수 있다. ambient `drift`는 첫 implementation cycle에서 금지한다.

## Risks

| Risk | Severity | Mitigation |
|---|---|---|
| PNG를 얹어도 DOM rectangle이 계속 보임 | high | 기존 `.playfield-plot-card` cream fill 제거와 fallback token을 PR acceptance로 둔다 |
| 첫 PR이 asset-only로 끝나 화면 payoff를 검증하지 못함 | high | asset generation PR도 preview composition 또는 screenshot mock을 남기며, 화면 통합 전 reject 가능 상태로 둔다 |
| plot marker가 Cycle B in-canvas UI와 중복됨 | medium | 이번 cycle은 DOM overlay skinning으로 제한하되 asset id/state vocabulary는 canvas 재사용 가능하게 유지 |
| next-action onboarding 약화가 계속 남음 | medium | PR3에서 next-action sign을 별도 구현하되, PR1/PR2는 plot-first로 좁힌다 |
| 새 category 도입이 checker migration으로 번짐 | medium | 첫 cycle은 existing `ui_frame` category + 역할 tags로 처리. `ui_decal` taxonomy는 별도 harness defect 또는 후속 asset schema axis로 분리 |
| asset 장식이 text safe zone을 침범 | high | `--hud-inset-text-safe`와 asset review small/medium readability gate를 acceptance에 포함 |
| motion이 attention 경쟁을 만듦 | medium | `nudge`는 ready plot 또는 next-action 중 하나만. 새 FX strip은 첫 cycle에서 만들지 않음 |

## Implementation Sequence

1. **PR1 — plot HUD asset plan + prompts + preview gate**
   - Files: `assets/source/asset_plan.json`, `assets/source/asset_prompts.json`, provenance/evidence report.
   - Generate or prepare only the first plot marker family.
   - Do not modify runtime code.
   - Acceptance: asset preview composition exists; bad asset can be rejected before manifest acceptance.

2. **PR2 — plot marker manifest + `GardenPlotCard` visual replacement**
   - Files: `public/assets/manifest/assetManifest.json`, `src/App.tsx`, `src/game/playfield/GardenPlayfieldHost.tsx`, `src/styles.css`.
   - Replace plot card visual surface with plot marker PNG layer and text-safe DOM layer.
   - Phaser scene and save schema unchanged.
   - Evidence: desktop default, loaded ready plot, dock-expanded seeds tab, mobile 393x852 screenshots.

3. **PR3 — next-action sun sign, no footprint growth**
   - Files: asset source/provenance/manifest + `src/App.tsx`, `src/styles.css`.
   - Convert `side-dock-next-action` from text card to low-footprint sign/ribbon family.
   - No composite action such as “buy and plant” is introduced; existing actions are only exposed more clearly.

4. **PR4 — resource holder reward destination**
   - Files: asset source/provenance/manifest + `src/App.tsx`, `src/styles.css`.
   - Add leaf basket / pollen bottle holder for resource HUD so harvest/order payoff has a destination anchor.
   - Resource visibility remains, but visual loudness stays below next-action and ready plot.

5. **PR5 — evidence package + checker hardening**
   - Files: `tests/visual/desktop-art-share.spec.ts` or relevant visual checks, `reports/visual/garden-respecting-hud-assets-evidence-<date>/`.
   - Add screenshot/geometry checks for plot marker visible, dock-expanded non-overlap, mobile non-overlap, and garden object readability.
   - This PR packages evidence for user review; it is not a self-declared visual cycle close.

## Decisions Resolved

### Decision 1 — First application moment: plot-first
- **Disagreement:** Designer wanted plot marker first, Art Director proposed broader plot/next-action/resource/divider/rail vocabulary, Engineer proposed asset-only then side dock then plot. Senior Critic required one first moment.
- **Resolution:** 첫 적용 순간은 `GardenPlotCard`다. 첫 visible UI payoff는 plot seedbed marker + ready ribbon이 맡는다.
- **Reasoning:** 사용자의 핵심 불만은 HUD가 정원 art를 누르고, 특히 plot card가 여전히 card처럼 보인다는 점이다. 첫 30초/첫 5분의 primary verb도 plot에서 시작한다.
- **Loser's concession:** next-action onboarding 약화는 PR3로 바로 이어간다. resource holder는 PR4에서 reward destination으로 포함한다. rail/vine divider는 첫 cycle에서 제외한다.

### Decision 2 — Asset-only PR 허용 조건
- **Disagreement:** Engineer는 asset plan/registration PR을 먼저 제안했고, Designer/Art Director/Senior Critic은 화면 통합 전 asset acceptance가 실패를 숨긴다고 지적했다.
- **Resolution:** asset-only 성격의 PR1은 허용하되, manifest accepted 상태로 굳히기 전에 preview composition과 reject gate를 남긴다.
- **Reasoning:** raster asset은 생성과 review가 필요하지만, 본 axis의 실패 조건은 PNG 품질만이 아니라 실제 화면에서 card 언어가 사라지는지다.
- **Loser's concession:** Engineer의 PR 분리는 유지한다. 대신 PR1 산출물은 화면 통합 전 폐기 가능해야 하며, PR2가 첫 true acceptance다.

### Decision 3 — Manifest category: first cycle uses `ui_frame` + role tags
- **Disagreement:** Art Director는 `ui_decal` taxonomy를 원했고, Engineer는 새 category가 checker/type migration으로 번지는 것을 반대했다. Senior Critic은 기존 `ui_order_crate_leaf_001.category = "ui"` mismatch를 그냥 묻지 말라고 요구했다.
- **Resolution:** 첫 cycle은 existing `ui_frame` category를 사용하고, `tags`/`notes`에 `plot-marker`, `action-signpost`, `resource-holder`, `decorative-divider` 역할 taxonomy를 강제한다. 기존 `"ui"` mismatch는 본 axis에서 고치지 않고 별도 harness defect로 분리한다.
- **Reasoning:** 첫 axis의 목적은 manifest schema 정리가 아니라 screen payoff다. category migration을 섞으면 asset 품질, UI 적용, checker migration 실패 원인이 뒤섞인다.
- **Loser's concession:** Art taxonomy는 spec terminology와 manifest metadata에 남긴다. 후속 asset schema axis에서 `ui_decal` 도입 여부를 결정한다.

### Decision 4 — DOM overlay first, in-canvas migration deferred
- **Disagreement:** Designer/Art Director는 plot marker를 playfield object처럼 보이게 하려 했고, Engineer는 Phaser scene을 건드리지 않는 DOM overlay skinning을 주장했다. Senior Critic은 DOM button이면 진짜 diegetic UI가 아니라고 지적했다.
- **Resolution:** 이번 axis는 `GardenPlayfieldHost`의 React DOM overlay를 먼저 skin한다. `GardenScene.ts`와 Phaser in-canvas diegetic UI는 `garden-diegetic-ui` axis로 defer한다.
- **Reasoning:** click/aria/disabled state를 유지하면서 cream rectangle visual surface만 바꾸는 것이 가장 작은 vertical slice다. Phaser 전환까지 묶으면 Cycle B binding과 중복되고 리스크가 커진다.
- **Loser's concession:** asset id와 state vocabulary는 후속 in-canvas 이관이 가능하도록 `plot_seedbed_*`, `ready_ribbon`, `state_binding` 중심으로 잡는다.

### Decision 5 — Next-action clarity without footprint growth
- **Disagreement:** Designer는 next-action을 fresh/returning session에서 격상해야 한다고 했고, Art Director/Engineer는 큰 signboard가 Cycle A obstruction을 되살릴 수 있다고 지적했다.
- **Resolution:** next-action은 PR3에서 `sun sign/ribbon` family로 격상하되, footprint는 키우지 않는다. 면적이 아니라 silhouette, text-safe zone, one-object `nudge`로 priority를 만든다.
- **Reasoning:** onboarding 약화는 실제 known issue지만, 큰 card 복귀는 본 axis의 목적과 충돌한다.
- **Loser's concession:** Fresh save와 ready plot 상태에서 plot-adjacent hint가 필요한지는 PR3 Browser Use screenshot으로 판단한다.

### Decision 6 — Motion budget
- **Disagreement:** Art Director는 `settle/nudge/bloom/drift` vocabulary를 제안했고, Engineer/Senior Critic은 attention 경쟁과 구현 범위 확장을 우려했다.
- **Resolution:** 첫 implementation cycle에서는 `nudge` 하나만 허용한다. 대상은 ready plot 또는 next-action 중 하나로 PR마다 명시한다. `drift`와 새 sprite/FX strip은 금지한다.
- **Reasoning:** 움직이는 HUD 조각이 많아지면 첫 verb가 흐려진다. 현재 axis는 asset vocabulary가 우선이지 motion system 확장이 아니다.
- **Loser's concession:** `bloom`은 resource holder PR4에서 기존 reward FX와 연결 가능성을 검토한다.

### Decision 7 — Success wording: “정원 느낌” 금지
- **Disagreement:** 세 proposal은 모두 정원물 언어에 동의했지만, Senior Critic은 “정원 느낌”이 너무 부드러운 성공 기준이라고 지적했다.
- **Resolution:** acceptance 문장은 “기존 cream rectangle surface의 시각 주도권이 plot/next-action 중 최소 하나에서 사라졌는가”로 쓴다.
- **Reasoning:** 사용자가 비판한 것은 단순 분위기가 아니라 HUD surface가 art와 player verb를 지배하는 구조다.
- **Loser's concession:** screenshot review에는 qualitative garden object readability도 남기되, pass/fail 문장은 concrete surface replacement로 고정한다.

## Open Questions

- PR2 후 screenshot에서 plot marker가 충분히 사물처럼 읽히지 않으면 asset을 재생성할지, CSS fallback을 줄일지 결정한다.
- PR3에서 next-action sign이 dock 안에 남아도 충분한지, fresh save만 plot-adjacent hint가 필요한지 Browser Use evidence 후 결정한다.
- Resource holder 3종을 모두 만들지, leaf basket 1종으로 먼저 reward destination을 증명할지 PR4 planning에서 결정한다.
- Existing manifest `"ui"` category mismatch는 별도 harness defect로 언제 정리할지 다음 operator queue에서 결정한다.
- `ui_decal` category를 도입할지 여부는 plot/next-action/resource HUD family가 최소 2회 화면 적용을 통과한 뒤 다시 논의한다.

## References

- Brief: `reports/deliberation/garden-respecting-hud-assets/brief.md`
- Proposals: `reports/deliberation/garden-respecting-hud-assets/proposals/{designer,art-director,engineer}.md`
- Critiques: `reports/deliberation/garden-respecting-hud-assets/critique-{designer,art-director,engineer,senior-critic}.md`
- Workflow: `docs/studio/DELIBERATION_WORKFLOW.md`
- User preferences: `docs/studio/USER_PREFERENCES.md`
- Handoff: `docs/studio/HANDOFF.md`
- Previous spec: `reports/deliberation/stage-art-first-restructure/spec.md`
- Cycle A evidence: `reports/visual/cycle-A-evidence-20260505/README.md`
- Related code: `src/App.tsx`, `src/styles.css`, `src/game/playfield/GardenPlayfieldHost.tsx`, `src/game/playfield/GardenScene.ts`, `src/types/game.ts`, `src/lib/assetManifest.ts`
- Related assets: `assets/source/asset_style_bible.json`, `assets/source/asset_plan.json`, `assets/source/asset_prompts.json`, `public/assets/manifest/assetManifest.json`

## Changelog

- 2026-05-05: initial Director synthesis from Codex-native Phase 2/3 deliberation. Seven substantive disagreements resolved.
