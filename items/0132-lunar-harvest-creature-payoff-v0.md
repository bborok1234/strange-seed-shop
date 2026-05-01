# Lunar harvest creature payoff v0

Status: planned
Owner: agent
Created: 2026-05-01
Updated: 2026-05-01
Work type: game_feature
Scope-risk: moderate
Issue: pending

## Intent

`달방울 씨앗` 수확이 단순 도감 reveal로 끝나지 않고, `달방울 누누`가 온실 production actor로 합류해 “새 생명체가 정원을 실제로 움직인다”는 P0.5 감정 payoff를 만든다.

## Studio Campaign Gate

Campaign source of truth: `P0.5 Idle Core + Creative Rescue`

Reference audit:

- `reports/operations/p05-studio-campaign-audit-20260501.md`
- Browser Use captures:
  - `reports/visual/p05-campaign-audit-greenhouse-lunar-plant-browser-use-20260501.png`
  - `reports/visual/p05-campaign-audit-lunar-ready-harvest-browser-use-20260501.png`
  - `reports/visual/p05-campaign-audit-lunar-harvest-reveal-browser-use-20260501.png`

This issue is a child of the campaign, not a neighbor task. It must close a concrete production gap: lunar creature discovery currently updates the roster, but the runtime visual language still leans on herb starter work/order assets.

## Game Studio Route

- Umbrella: `game-studio:game-studio`
- UI/HUD/playfield: `game-studio:game-ui-frontend`
- Browser QA/playtest: `game-studio:game-playtest`
- Asset/FX: `game-studio:sprite-pipeline` + project-local `gpt-game-asset-*`

## Reference Teardown

- Egg, Inc.: new workers and machines should make production feel more alive immediately after unlock.
- Idle Miner Tycoon: a new worker/manager should imply a clear production role, not just a collection badge.
- Cell to Singularity: a discovery should point toward the next long-term silhouette or branch.
- Gastory-style asset ops: style state, prompt/model sidecar, reference consistency, animation camera/composition lock, frame extraction, manifest QA, and small-size review are part of the asset bundle.

## Creative Brief

The player has traced a moonlit greenhouse clue, planted `달방울 씨앗`, and harvests `달방울 누누`. The payoff should read as:

> “밤사이 보상을 지켜주는 달빛 수호자가 정원 일꾼으로 합류했다.”

The screen must show a named creature birth, a lunar harvest/reward motion, and a production roster/work-state change.

## Game Studio Department Signoff

| 부서 | 산출물 |
| --- | --- |
| 기획팀 | Player verb: `달방울 씨앗을 수확하고 누누가 일하는 것을 본다`. Production role: lunar guardian / offline reward / production roster bridge. First 5 minutes or comeback moment: lunar seed ready harvest and reveal. |
| 리서치팀 | Production gap: worker variation and discovery payoff. Rejected alternative: order board choice first, because actor fantasy is weaker than the next order surface. |
| 아트팀 | Asset plan: `creature_lunar_common_001_work`, `fx_lunar_harvest_moonburst_001` 6-frame 160x160 strip, optional `fx_lunar_reward_drop_001` 5-frame 160x160 strip. gpt-image-2 default, Codex native fallback if blocked. |
| 개발팀 | Implementation tranche: manifest entries, typed asset lookup/binding, harvest/reveal/playfield/production card integration. Touch likely `assets/source/*`, `public/assets/manifest/assetManifest.json`, `src/App.tsx`, `src/game/playfield/*`, visual tests. Rollback boundary: no save schema change unless unavoidable. |
| 검수팀 | Browser Use `iab` mobile and desktop captures. Verify first actionable screen, main verbs, HUD readability, playfield obstruction, bottom tab overlap, visible overflow, asset fallback count, and harvest/reveal state. |
| 마케팅팀 | Mock-only promise: `달방울 누누가 밤사이 온실 보상을 지켜준다`. No real channel action. |
| 고객지원팀 | Confusion risk: harvest reveal tells a story, but next action may still point to generic workbench/order. Add player-facing note or CTA only if it clarifies the next action without adding a panel. |

## Role-Debate Note

The campaign audit found two credible paths:

- Full `Creature work-state roster v0`: stronger systemic direction, but larger asset/runtime scope.
- `Lunar harvest creature payoff v0`: narrower, follows the latest greenhouse-lunar thread, and creates a concrete work-state proof for one named creature.

Selected: `Lunar harvest creature payoff v0`.

Rejected for now: full roster batch and order board choice. They should follow after one lunar creature proves the asset/runtime contract.

## Subagent/Team Routing

Use Codex native subagents if this moves into implementation:

- Asset lane: produce/review prompt/model sidecar and manifest/animation plan.
- Runtime lane: integrate manifest ids and playfield/production card state.
- QA lane: prepare Browser Use/playtest checklist and visual regression assertions.

Do not split write scopes until the asset list is final. Avoid parallel edits to `public/assets/manifest/assetManifest.json`.

## Plan

1. Extend the asset plan/prompt batch for lunar harvest payoff assets.
2. Attempt gpt-image-2 generation with `OPENAI_API_KEY` and `SEED_ASSET_IMAGE_MODEL`; if blocked, record blocker and use Codex native image generation fallback.
3. Normalize generated FX strips to fixed PNG spritesheets:
   - `fx_lunar_harvest_moonburst_001`: 6 frames, 160x160, 960x160, 12fps, one-shot.
   - `fx_lunar_reward_drop_001`: optional 5 frames, 160x160, 800x160, 12fps, one-shot.
4. Register accepted assets in manifest with `animation.binding`:
   - `target: "effect"`, `slot: "harvest_fx"` or `slot: "reward_fx"`.
   - `seedIds: ["seed_lunar_001"]`.
   - `creatureIds: ["creature_lunar_common_001"]`.
   - `actions: ["harvest_plot"]`.
5. Integrate `creature_lunar_common_001_work` into production card/playfield state so the roster no longer reads as herb starter-only after lunar harvest.
6. Add or update QA state for `qaLunarSeedReadyToHarvest=1` and post-harvest roster/payoff.
7. Capture Browser Use mobile/desktop evidence and run local gates.

## Acceptance Criteria

- [ ] `달방울 씨앗` ready harvest has a lunar-specific harvest/reward visual payoff, not only generic ready text.
- [ ] `달방울 누누` has an accepted raster work-state asset or documented fallback candidate and appears as a production actor after harvest.
- [ ] Manifest entries include `animation.binding`, frame count, frame size, frame rate, intended action, and source reference ids for any FX strip.
- [ ] `gpt-image-2` default attempt or blocker plus Codex native fallback provenance is recorded.
- [ ] Browser Use `iab` evidence shows before harvest, harvest reveal, and post-harvest production roster/playfield state.
- [ ] Mobile visual QA confirms no body scroll, bottom-tab overlap, hidden child overflow, or production card clipping.
- [ ] No runtime image generation, real payment, login, external deployment, customer data, or real GTM action is introduced.

## Verification

- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:asset-alpha`
- `npm run check:content`
- `npm run check:loop`
- `npm run check:visual -- --grep "달방울"`
- `npm run check:ci`

## Risks

- gpt-image-2 may remain blocked by organization verification. Mitigation: Codex native fallback is allowed, but it must produce raster PNG workspace files and update provenance.
- FX strip normalization can drift from the approved portrait. Mitigation: use one strip pass, fixed frame dimensions, and small-size review before manifest acceptance.
- Adding more visual feedback can crowd the mobile action surface. Mitigation: keep persistent HUD unchanged and use transient harvest/reward motion.
