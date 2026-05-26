# 월정 숲 creature/actor asset plan-prompt

## 상태

- Status: review
- Game Studio route: `game-studio:game-studio -> game-studio:sprite-pipeline -> game-studio:phaser-2d-game -> game-studio:game-playtest`
- GitHub issue: #542
- PR: #543 https://github.com/bborok1234/strange-seed-shop/pull/543
- Branch: `codex/v1-moon-grove-creature-asset-plan-prompt`
- 연결: Issue #540, PR #541, main CI `25903872186`

## 배경

#540/#541은 `seed_moon_grove_001`을 `월정 숲 수확`과 `월정 숲 새벽이끼` discovery reveal로 닫았다. 하지만 전용 월정 숲 creature portrait/actor/sprite가 없어서 reveal 감정은 source badge와 FX에 머문다. 첫 5분/장기 메타 북극성은 이름 있는 생명체가 정원 경제에 참여해야 하므로, 다음 slice는 이미지 생성 전 plan/prompt를 고정한다.

이번 WorkUnit은 이미지를 생성하지 않는다. `assets/source/asset_plan.json`과 `assets/source/asset_prompts.json`에 generation-ready raster/sprite/FX 후보를 추가하고, 후속 generation/review WorkUnit이 바로 이어질 수 있게 한다.

## Creative brief

- Player verb: `월정 숲 발견` 이후 `미루 배치/작업` 후속 payoff 준비
- Production/progression role: 월정 문 rare discovery가 이름 있는 creature와 정원 actor로 확장될 준비를 만든다.
- Screen moment: harvest reveal HUD, 도감/album card, playfield actor idle/work, discovery bloom FX.
- Asset/FX decision:
  - `creature_moon_grove_001`: reveal/album portrait
  - `actor_moon_grove_miru_idle_strip_v1`: playfield idle actor strip, 8 frames, 96x96, 8fps
  - `actor_moon_grove_miru_work_strip_v1`: greenhouse work actor strip, 8 frames, 96x96, 10fps
  - `fx_moon_grove_discovery_bloom_strip_v1`: reveal bloom FX strip, 8 frames, 96x96, 12fps
- Competition gap: Cell to Singularity/Egg, Inc.식 장기 목표는 rare discovery가 텍스트가 아니라 새 entity silhouette/actor/FX로 화면에 남아야 한다.
- Rejected alternative: 기존 `seed_moon_grove_001_icon`을 계속 reveal surrogate로 사용. 이유: source icon만으로는 이름 있는 생명체 소유감과 actor participation을 만들 수 없다.

## Plan

1. `assets/source/asset_plan.json`에 월정 숲 creature portrait, idle strip, work strip, reveal FX strip 4개를 추가한다.
2. 각 strip은 frame count, frame size, intended fps, `animation.binding`, behavior를 명시한다.
3. `assets/source/asset_prompts.json`에 1:1 prompt를 추가한다.
4. Prompt에는 use case, asset type, subject, style, composition, palette, constraints, avoid, acceptance checks를 포함한다.
5. JSON parse, id uniqueness, plan/prompt parity, topology asset plan checker를 검증한다.
6. 이미지 생성은 후속 WorkUnit으로 남긴다.

## 수용 기준

- asset plan에 월정 숲 creature/actor/FX 4개가 추가된다.
- prompts에 동일 asset_id 4개가 추가되고 prompt count와 plan count가 일치한다.
- 모든 output path는 `public/assets/game/` 하위 `.png`다.
- actor/FX strip은 frame count/size/fps/animation.binding을 가진다.
- prompt는 runtime generation을 요구하지 않고 SVG/vector/code-native output을 금지한다.
- `npm run check:topology-asset-plan`, `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:ci`, `git diff --check`가 통과한다.

## Department Scorecard

| 부서 | 판정 | 근거 |
| --- | --- | --- |
| 기획팀 | approve | `월정 숲 새벽이끼` discovery를 named creature/actor로 확장하는 준비다. |
| 리서치팀 | approve | rare discovery가 텍스트 surface로 끝나는 production gap을 asset pipeline으로 해소한다. |
| 아트팀 | approve | generation 전 raster/sprite/FX spec, prompt, acceptance를 명시한다. |
| 개발팀 | approve | 이번 slice는 source plan/prompt만 변경하고 runtime binding은 후속 generation/review 이후로 분리한다. |
| 검수팀 | approve | JSON/checker 검증 중심이며 visual runtime QA는 generation/binding WorkUnit에서 수행한다. |
| 마케팅팀 | approve | 내부 asset pipeline이며 외부 채널/실결제/광고 없음. |
| 고객지원팀 | approve | 후속 playable에서 플레이어가 discovery 의미를 creature/actor로 이해할 수 있게 하는 선행 작업이다. |

## Role Debate

필수 debate는 발생하지 않았다. 모든 부서가 approve다. 아트팀은 portrait만 생성하면 actor participation이 늦어지므로 idle/work strip과 reveal FX를 같은 prompt batch에 포함하라고 권고했다.

## Self-evaluation loop

- Claim: 월정 숲 discovery는 dedicated creature/actor/FX generation을 시작할 수 있는 plan/prompt contract를 가진다.
- Smallest verifier: `npm run check:topology-asset-plan`
- Rubric: 4 assets present, prompts parity, no SVG, no runtime generation, strip metadata complete, unique ids.
- Artifact path: `assets/source/asset_plan.json`, `assets/source/asset_prompts.json`
- Iteration log: checker failure나 prompt parity 문제가 있으면 같은 WorkUnit에서 수정 후 재검증한다.
- Stop condition: local gates, PR checks, merge, main CI가 green이거나 asset generation authority blocker가 문서화됨.

## Subagent/Team Routing

- Solo execute. 변경 범위가 JSON plan/prompt와 운영 문서로 좁고, 병렬 write scope가 없다.

## 검증 명령

- `npm run check:topology-asset-plan` - pass
- `npm run check:asset-provenance` - pass
- `npm run check:asset-style` - pass
- `npm run check:ci` - pass
- `git diff --check` - pass

## 구현 결과

- `assets/source/asset_plan.json`에 월정 숲 discovery 후속 asset 4개를 추가했다.
  - `creature_moon_grove_001`
  - `actor_moon_grove_miru_idle_strip_v1`
  - `actor_moon_grove_miru_work_strip_v1`
  - `fx_moon_grove_discovery_bloom_strip_v1`
- actor/FX strip 3개는 `frame_count=8`, `frame_size=96x96`, `intended_fps`, `animation.binding`, `behavior`를 명시했다.
- `assets/source/asset_prompts.json`에 동일 asset_id 4개 prompt와 acceptance checks를 추가했다.
- 모든 output path는 `public/assets/game/` 하위 `.png`이며 SVG/vector/code-native accepted output을 금지한다.

## 증거

- `npm run check:topology-asset-plan`: plan count `83`, prompt count `83`, failures `[]`
- `npm run check:asset-provenance`: pass
- `npm run check:asset-style`: pass
- `npm run check:ci`: pass
- `git diff --check`: pass

## 리스크

- 이 PR은 이미지를 생성하지 않는다. `gpt-game-asset-generate` 또는 gpt-image-2 generation/review WorkUnit이 바로 이어져야 runtime binding이 가능하다.
