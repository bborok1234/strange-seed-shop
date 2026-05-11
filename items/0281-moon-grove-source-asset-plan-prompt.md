# 월정 문 source asset plan-prompt

## 상태

- Status: implemented/local-verified
- Game Studio route: `game-studio:game-studio -> game-studio:sprite-pipeline -> game-studio:phaser-2d-game -> game-studio:game-playtest`
- GitHub issue: #530
- PR: #531
- Branch: `codex/v1-moon-grove-source-asset-plan-prompt`
- 연결: Issue #528, PR #529, main CI `25649482785`

## 배경

#528은 `월정 문 귀환 상자 열기` 이후 `clue_moon_grove_001 source promise`까지 열었다. 하지만 이 clue는 아직 `assets/source/asset_plan.json`과 `assets/source/asset_prompts.json`에 대응하는 source seed icon/FX 후보가 없어 다음 source loop로 구현하기 어렵다.

이번 slice는 `clue_moon_grove_001`을 다음 concrete source path로 승격하기 위한 static raster asset plan/prompt를 추가한다. 실제 이미지 생성, manifest accepted 등록, Phaser runtime binding은 후속 generation/review/runtime WorkUnit으로 분리한다.

## Creative brief

- Player verb: `월정 숲 source 보기`
- Production/progression role: 월정 문 첫 원정 보상이 다음 seed/source asset pipeline으로 이어진다.
- Screen moment: `clue_moon_grove_001` 보상 promise가 전용 source seed icon과 reward FX 후보로 읽힌다.
- Asset/FX decision: `seed_moon_grove_001_icon`과 `fx_moon_grove_source_reward_strip_v1`을 plan/prompt에 추가한다.
- Rejected alternative: existing `seed_rare_001_icon` 재사용. 이유: 월정 문 보상은 밤유리 source와 다른 destination payoff로 보여야 한다.

## Plan

1. `assets/source/asset_plan.json`에 `seed_moon_grove_001_icon`과 `fx_moon_grove_source_reward_strip_v1`을 추가한다.
2. FX plan은 `frame_count=8`, `frame_size=96x96`, `intended_fps=12`, `animation.binding=moon_fence.reward.action.claim_source_clue`로 고정한다.
3. `assets/source/asset_prompts.json`에 두 asset의 Codex native/gpt-image-ready prompt와 acceptance를 추가한다.
4. roadmap과 heartbeat를 PR-ready 상태로 갱신한다.

## 수용 기준

- asset plan과 prompt JSON이 parse된다.
- prompt ids가 plan ids와 정확히 매칭된다.
- 새 asset은 raster PNG output path만 사용하고 SVG/vector/code-native game graphic을 요구하지 않는다.
- runtime generation/API/cache 호출 없음.
- `npm run check:topology-asset-plan`, `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:ci`, `git diff --check`가 통과한다.

## Department Scorecard

| 부서 | 판정 | 근거 |
| --- | --- | --- |
| 기획팀 | approve | #528 reward promise를 다음 source path로 이어준다. |
| 리서치팀 | approve | route reward는 다음 수집 target의 전용 visual affordance가 필요하다. |
| 아트팀 | approve | seed icon + FX strip으로 generation-ready bundle을 정의한다. |
| 개발팀 | approve | plan/prompt만 변경하고 runtime binding은 후속으로 분리한다. |
| 검수팀 | approve | JSON/checker gate로 prompt-plan integrity를 검증한다. |
| 마케팅팀 | approve | mock/internal asset prep이며 외부 promise 없음. |
| 고객지원팀 | approve | 다음 source가 무엇인지 설명 가능한 visual 후보를 만든다. |

## 검증 명령

- `npm run check:topology-asset-plan`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:ci`
- `git diff --check`

## 구현 결과

- `assets/source/asset_plan.json`에 `seed_moon_grove_001_icon`과 `fx_moon_grove_source_reward_strip_v1`을 추가했다.
- `fx_moon_grove_source_reward_strip_v1`은 8 frames, 96x96, 12fps, `animation.binding=moon_fence.reward.action.claim_source_clue`로 고정했다.
- `assets/source/asset_prompts.json`에 두 asset의 generation-ready prompt와 acceptance를 추가했다.

## 검증 결과

- Pass: `git diff --check`
- Pass: `npm run check:topology-asset-plan` (`planCount=79`, `promptCount=79`)
- Pass: `npm run check:asset-provenance`
- Pass: `npm run check:asset-style`
- Pass: `npm run check:ci`

## PR evidence

- Draft PR: #531 `월정 문 source asset plan-prompt`
