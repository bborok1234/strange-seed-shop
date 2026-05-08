# 밤유리 source icon/FX plan-prompt

## 상태

- Status: planned
- Game Studio route: `game-studio:game-studio -> game-studio:sprite-pipeline -> game-studio:game-ui-frontend -> game-studio:phaser-2d-game -> game-studio:game-playtest`
- GitHub issue: #504
- Branch: `codex/v1-night-glass-source-asset-plan`
- 연결: Issue #502, PR #503, main CI `25543463552`

## 배경

#502에서 루미 reveal 후 `밤유리 source 보기` action, `seed_rare_001` / `research_rare_glass` / `expedition_night_glass` locked promise, accepted `creature_lunar_rare_001` silhouette marker가 들어갔다. 하지만 `items/0267-night-glass-source-preview.md`의 아트팀 판정처럼 전용 `seed_rare_001` source icon과 dedicated route lock FX는 아직 없다.

경쟁작 production gap은 rare source가 장기 목표로 보이더라도 보상 물성의 핵심인 seed icon/FX가 stand-in이면 "언젠가 열릴 실제 목표"가 아니라 placeholder로 읽힌다는 점이다. 이번 slice는 runtime binding이나 actual rare acquisition을 열기 전에 `seed_rare_001_icon`과 `fx_night_glass_source_unlock_strip_v1`을 generation-ready plan/prompt로 고정한다.

## Plan

1. `assets/source/asset_plan.json`에 `seed_rare_001_icon`을 추가한다.
   - category: `seed_icon`
   - family: `lunar`
   - rarity: `rare`
   - intended_use: `night_glass_source_seed_icon`
   - output_path: `public/assets/game/seeds/seed_rare_001_icon.png`
2. `assets/source/asset_plan.json`에 `fx_night_glass_source_unlock_strip_v1`을 추가한다.
   - category: `fx_strip`
   - frame_count: 8
   - frame_size: `96x96`
   - intended_fps: 12
   - animation.binding: `night_glass_source.action.preview_unlock`
3. `assets/source/asset_prompts.json`에 두 asset의 strict prompt와 acceptance를 추가한다.
4. `scripts/check-topology-asset-plan.mjs`의 plan/prompt consistency gate로 id, output_path, prompt coverage를 검증한다.
5. 실제 image generation/runtime manifest acceptance는 후속 WorkUnit으로 분리한다.

## 수용 기준

- `assets/source/asset_plan.json`과 `assets/source/asset_prompts.json`에 두 asset id가 모두 존재한다.
- 두 prompt는 runtime generation을 요구하지 않고 raster PNG output path만 사용한다.
- FX prompt는 horizontal strip, 8 frames, 96x96, 12fps, `night_glass_source.action.preview_unlock` binding을 명시한다.
- `npm run check:topology-asset-plan`, `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:ci`, `git diff --check`가 통과한다.
- Browser Use hands-on QA는 runtime 화면 변경이 아니므로 N/A 사유를 PR에 남긴다.

## Department Scorecard

| 부서 | 판정 | 근거 |
| --- | --- | --- |
| 기획팀 | approve | `밤유리 source`가 실제 rare seed/route 목표로 읽히는 다음 payoff를 준비한다. |
| 리서치팀 | approve | 경쟁작 rare route는 icon/FX로 장기 보상 물성을 고정한다. |
| 아트팀 | approve | dedicated rare seed icon과 unlock FX strip을 generation-ready로 계획한다. |
| 개발팀 | approve | asset source JSON만 변경하고 runtime binding/manifest acceptance는 후속으로 분리한다. |
| 검수팀 | approve | plan/prompt consistency와 asset provenance/style checker로 검증한다. |
| 마케팅팀 | approve | 내부 playable promise이며 외부 채널/실결제/광고 없음. |
| 고객지원팀 | approve | 플레이어가 밤유리 route가 placeholder가 아니라 후속 unlock 목표임을 이해할 수 있다. |

## Subagent/Team Routing

- Solo execute. 변경 범위가 asset plan/prompt와 운영 문서로 좁고 병렬화 이득이 낮다.

## 검증 명령

- `npm run check:topology-asset-plan`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:ci`
- `git diff --check`

## 리스크

- 이번 slice는 plan/prompt만 만들며 PNG 생성, manifest acceptance, Phaser runtime binding은 하지 않는다.
- `seed_rare_001_icon`이 생성되기 전까지 #502 runtime은 계속 accepted `creature_lunar_rare_001` silhouette를 사용한다.
