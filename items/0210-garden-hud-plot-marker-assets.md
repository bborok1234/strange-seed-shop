# WorkUnit — Garden HUD plot marker asset vertical slice

- ID: `0210`
- Status: active
- GitHub issue: #401
- Draft PR: #402
- Source spec: `reports/deliberation/garden-respecting-hud-assets/spec.md`
- Game Studio route: `game-studio:game-studio` → `game-studio:game-ui-frontend` + asset pipeline review
- Campaign source: P0.5 Idle Core + Creative Rescue

## Goal

`garden-respecting-hud-assets` spec의 첫 implementation slice를 수행한다. 첫 적용 순간은 `GardenPlotCard`이며, 목표는 plot card의 cream rectangle 시각 주도권을 raster plot marker object로 바꾸는 것이다.

## Plan

1. PR1에서 plot marker asset family를 계획·프롬프트화한다. ✅ 2026-05-05 Codex pass
   - `assets/source/asset_plan.json`
   - `assets/source/asset_prompts.json`
   - provenance/evidence report
2. 첫 batch는 네 asset만 다룬다. ✅ 2026-05-05 Codex native candidates generated
   - `ui_hud_plot_seedbed_empty_001`
   - `ui_hud_plot_seedbed_growing_001`
   - `ui_hud_plot_ready_ribbon_001`
   - `ui_hud_plot_text_plate_001`
3. generation 전 또는 직후 preview composition을 남긴다. 화면 통합 전 reject 가능해야 한다. ✅ `reports/assets/garden-hud-plot-marker-preview-20260505.md`
4. PR2에서 accepted asset만 manifest에 등록하고 `GardenPlotCard` visual surface를 교체한다.
5. Browser Use/screenshot evidence로 desktop default, loaded ready plot, dock-expanded seeds tab, mobile 393x852를 확인한다.

## Acceptance Criteria

- [ ] 새 asset은 runtime generation 없이 pre-produced raster PNG provenance를 남긴다.
- [ ] 각 asset entry에 `screen_moment`, `player_verb`, `state_binding`, `text_safe_zone`, `must_not_obscure`가 기록된다.
- [ ] `GardenPlotCard`의 DOM button, aria-label, click target, disabled empty state가 유지된다.
- [ ] screenshot에서 plot card가 기존 cream rectangle이 아니라 정원 plot marker object로 읽힌다.
- [ ] dock-expanded seeds tab에서 plot card가 dev/player panel에 가리지 않는다.
- [ ] mobile 393x852에서 body scroll, bottom tab overlap, text clipping이 없다.
- [ ] `npm run check:asset-provenance`
- [ ] `npm run check:asset-style`
- [ ] `npm run check:asset-normalization`
- [ ] `npm run check:asset-alpha`
- [ ] `npm run check:art-share`
- [ ] `npm run check:p0-ui-ux`
- [ ] `npm run build`

## Risks

- Generated PNG가 예뻐도 DOM rectangle을 실제로 없애지 못할 수 있다. Preview composition과 PR2 screenshot에서 reject한다.
- `ui_decal` category 욕심이 checker/schema migration으로 번질 수 있다. 첫 slice는 `ui_frame` + role tags로 제한한다.
- Phaser in-canvas UI와 중복될 수 있다. 이번 WorkUnit은 `GardenPlayfieldHost` DOM overlay skinning까지만 다룬다.
- next-action onboarding 약화는 남을 수 있다. 이 WorkUnit 이후 PR3 `next-action sun sign`으로 분리한다.

## Out of Scope

- save schema 변경.
- Phaser `GardenScene.ts` diegetic UI 이관.
- rail/tab marker, vine divider, full dock reskin.
- payment, external deployment, production customer data.

## Verification Notes

Spec synthesis evidence:

- `reports/deliberation/garden-respecting-hud-assets/brief.md`
- `reports/deliberation/garden-respecting-hud-assets/proposals/`
- `reports/deliberation/garden-respecting-hud-assets/critique-*.md`
- `reports/deliberation/garden-respecting-hud-assets/spec.md`
- `reports/deliberation/garden-respecting-hud-assets/user-review.md`
- `reports/deliberation/garden-respecting-hud-assets/retrospective.md`

PR1 candidate evidence:

- GitHub issue: https://github.com/bborok1234/strange-seed-shop/issues/401
- Draft PR: https://github.com/bborok1234/strange-seed-shop/pull/402
- `assets/source/asset_plan.json`
- `assets/source/asset_prompts.json`
- `assets/source/generated/garden-hud-plot-marker-20260505/`
- `assets/source/gpt_image_asset_provenance.json`
- `assets/source/asset_generation_status.json`
- `public/assets/game/ui/ui_hud_plot_seedbed_empty_001.png`
- `public/assets/game/ui/ui_hud_plot_seedbed_growing_001.png`
- `public/assets/game/ui/ui_hud_plot_ready_ribbon_001.png`
- `public/assets/game/ui/ui_hud_plot_text_plate_001.png`
- `reports/assets/garden-hud-plot-marker-preview-20260505.md`
- `reports/assets/garden-hud-plot-marker-preview-20260505.html`
- `reports/visual/garden-hud-plot-marker-preview-20260505.png`

PR1 review decision:

- 네 asset은 manifest accepted가 아니라 `candidate_preview_pending_manifest`다.
- PR2는 `GardenPlotCard` 화면 합성에서 cream rectangle 시각 주도권이 사라지는지 증명해야 한다.
- `ui_hud_plot_text_plate_001`은 가장 panel-like하므로 작은 subordinate label plate로만 써야 한다.

PR1 verification:

- `npm run check:asset-provenance` passed.
- `npm run check:asset-style` passed.
- `npm run check:asset-normalization` passed.
- `npm run check:asset-alpha` passed.
- `npm run check:p0-ui-ux` passed.
- `npm run check:art-share` passed: 12 passed.
- `npm run build` passed.

GitHub loop recovery:

- Issue #401 created from `reports/operations/github-bodies/issue-0210-garden-hud-plot-marker-assets-20260505.md`.
- Branch `codex/0210-garden-hud-plot-marker-pr1` pushed.
- Draft PR #402 created from `reports/operations/github-bodies/pr-401-garden-hud-plot-marker-pr1-20260505.md`.
