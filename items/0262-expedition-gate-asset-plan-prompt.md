# 첫 원정 문/귀환 상자 asset plan-prompt 만들기

Status: PR open
Owner: agent
Created: 2026-05-08
GitHub issue: #492
GitHub PR: #493
Branch: `codex/v1-expedition-gate-asset-plan-prompt`
Game Studio route: `game-studio:game-studio` -> `game-studio:game-ui-frontend` -> `game-studio:phaser-2d-game` -> `game-studio:game-playtest`
Asset route: `gpt-game-asset-plan` -> `gpt-game-asset-prompt`

## Plan

### 목표

#490 / PR #491에서 첫 원정 route가 `depart -> traveling -> returned crate -> claimed`로 playable해졌다. 남은 blocker는 원정 문과 귀환 상자가 아직 기존 order crate stand-in을 사용해 D7 route의 prop identity가 약하다는 점이다. 이번 WorkUnit은 dedicated raster generation 전에 필요한 정적 asset plan/prompt를 `assets/source/asset_plan.json`과 `assets/source/asset_prompts.json`에 추가한다.

### Campaign source of truth

- Active campaign: P0.5 Idle Core + Creative Rescue
- Game source: `docs/GAME_BIBLE.md`
- Production companion: `docs/GAME_PRODUCTION_SPEC.md`
- Runtime foundation: `docs/phaser/REBOOT_FOUNDATION_SPEC.md`
- 직전 checkpoint: #490 / PR #491 / main CI `25531093879`

### Reference teardown

- Idle Miner Tycoon의 새 shaft/area는 functional placeholder가 아니라 구역 prop silhouette로 읽힌다.
- Cell to Singularity의 다음 node/branch는 unlock 전에도 고유 icon/shape로 기억된다.
- 현재 production gap: 첫 원정 route state는 생겼지만 원정 문/귀환 상자/보상 FX가 order crate fallback에 기대고 있어 screen memory가 약하다.

### Creative brief

- Player verb: `틈새길 보내기`, `귀환 상자 열기`
- Production/progression role: D7 expedition gate identity, return crate reward readability
- Screen moment: 원정 문이 작업대/주문상자와 구분되는 별도 facility로 보이고, 귀환 상자가 원정 보상 prop/FX로 읽히는 장면
- Asset/FX bundle:
  - `facility_expedition_gate_v1`
  - `facility_expedition_return_crate_v1`
  - `fx_expedition_return_reward_strip_v1`
- Generation decision: 이번 PR은 plan/prompt만 만든다. 현재 `OPENAI_API_KEY`와 `SEED_ASSET_IMAGE_MODEL`이 없어 API generation은 blocked이며, 후속 WorkUnit에서 Codex native image generation 또는 API provenance로 raster 파일을 생성한다.

### Candidate issue list

1. 선택: expedition gate/return crate/return reward FX plan-prompt
   - #491의 explicit remaining risk를 직접 제거하는 asset generation 준비 단계다.
2. 보류: runtime manifest integration
   - 실제 PNG가 없으면 accepted manifest entry를 만들 수 없다.
3. 보류: 두 번째 달빛 원정 route
   - 첫 원정 visual identity가 없는 상태에서 route만 늘리면 D7 screen memory가 약해진다.

### Strategic Jump Check

이번 작업은 runtime 기능 추가가 아니라 #491 route의 production identity를 만드는 asset pipeline slice다. visual payoff는 후속 generation/runtime integration에서 완성되지만, 이번 PR은 generation prompt scope를 확정해 다음 agent가 product decision 없이 생성으로 이어갈 수 있게 한다.

### Title Contract

제목은 asset 대상(`원정 문/귀환 상자`), pipeline 단계(`asset plan-prompt`)를 포함한다.

## Department Scorecard

| 부서 | 판정 | 근거 |
| --- | --- | --- |
| 기획팀 | approve | 첫 원정 route의 screen identity와 reward readability를 강화한다. |
| 리서치팀 | approve | idle 경쟁작의 고유 area/return reward prop pattern을 반영한다. |
| 아트팀 | approve | facility, return crate, FX strip 3개 후보와 acceptance를 명시한다. |
| 개발팀 | approve | runtime 변경 없이 plan/prompt JSON과 checker만 다룬다. |
| 검수팀 | revise | 실제 visual QA는 generated PNG 이후 가능하다. 이번에는 JSON/checker validation이 기준이다. |
| 마케팅팀 | approve | 외부 채널/실결제/광고 없음. |
| 고객지원팀 | approve | 후속 runtime에서 원정과 주문 상자 혼동을 줄이는 준비 작업이다. |

## Role Debate

검수팀은 screenshot evidence가 없다고 지적하지만 이번 WorkUnit은 생성 전 plan/prompt 단계다. 아트팀 acceptance와 asset checker를 통과시키고, 생성/리뷰/통합 WorkUnit에서 Browser Use 또는 current blocker + Playwright evidence를 요구한다.

## Subagent/Team Routing

사용하지 않는다. plan/prompt JSON에 3개 asset을 추가하는 작은 pipeline slice라 leader 직접 구현이 적절하다.

## Self-Evaluation Loop

- claim: `assets/source/asset_plan.json`과 `assets/source/asset_prompts.json`에 첫 원정 dedicated asset 3개가 추가되고, FX strip metadata와 prompt acceptance가 generation-ready다.
- smallest verifier: `npm run check:topology-asset-plan`, `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:ci`
- rubric:
  - pass: plan/prompt ids match, JSON parse, output paths are PNG workspace paths, FX strip has frame count/size/fps/animation binding.
  - fail: prompt 누락, SVG/vector output, runtime generation instruction, acceptance/checker 누락.
- artifact path: `assets/source/asset_plan.json`, `assets/source/asset_prompts.json`
- iteration log:
  - 2026-05-08: plan-first artifact 작성.
  - 2026-05-08: `asset_plan.json`/`asset_prompts.json`에 `facility_expedition_gate_v1`, `facility_expedition_return_crate_v1`, `fx_expedition_return_reward_strip_v1` 추가. `npm run check:topology-asset-plan`, `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:ci` pass.
- stop condition: local asset/check CI, GitHub checks, merge, main CI green.

## Acceptance Criteria

- `asset_plan.json`에 expedition gate, expedition return crate, expedition return reward FX strip 3개 asset이 추가된다.
- `asset_prompts.json`에 같은 3개 asset prompt가 추가되고 prompt ids가 plan ids와 일치한다.
- 모든 output path는 `public/assets/game/.../*.png`이다.
- FX strip은 `frame_count`, `frame_size`, `intended_fps`, `animation.binding`, `behavior`를 포함한다.
- prompt는 runtime generation을 요구하지 않고 text/watermark/logo/copyright/living artist imitation을 금지한다.
- `npm run check:topology-asset-plan`, `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:ci`, `npm run check:github-metadata`, `git diff --check`가 통과한다.

## Verification Commands

```bash
npm run check:topology-asset-plan
npm run check:asset-provenance
npm run check:asset-style
npm run check:ci
npm run check:github-metadata
git diff --check
```

## Risks / Non-goals

- 이번 PR에서 PNG를 생성하거나 manifest accepted entry를 만들지 않는다.
- runtime에서 image generation/API/cache를 호출하지 않는다.
- 기존 order crate fallback runtime binding은 후속 generated PNG integration 전까지 유지한다.

## Evidence

- `npm run check:topology-asset-plan` pass: planCount `75`, promptCount `75`
- `npm run check:asset-provenance` pass
- `npm run check:asset-style` pass
- `npm run check:ci` pass
- Draft PR: #493 `https://github.com/bborok1234/strange-seed-shop/pull/493`
- Commit: `ded6820`
- Added plan/prompt ids:
  - `facility_expedition_gate_v1`
  - `facility_expedition_return_crate_v1`
  - `fx_expedition_return_reward_strip_v1`
