# 0256 도감 기록 스탬프 FX plan-prompt

## Problem

#478은 도감 기록 직후 `달빛 단서 기록됨`과 다음 씨앗 목표를 HUD surface로 남겼지만, 기록 순간 자체는 아직 텍스트 전환과 receipt 중심이다. collection record는 “저장됐다”는 작은 시각적 확정감이 필요하며, 후속 runtime 구현 전에 FX strip의 binding/spec/prompt를 먼저 고정해야 한다.

## Goal

`fx_album_record_stamp_strip_v1`을 generation-ready asset plan/prompt에 추가한다. 이 FX는 `album.clue_record.action.record` binding으로 도감 기록 버튼 직후 한 번 재생될 8-frame 96x96 horizontal strip이다.

## Reference Teardown

- Cell to Singularity류 progression surface는 새 node/record가 저장될 때 짧은 flash/stamp로 상태 전환을 확정한다.
- 수집형 idle game은 도감 기록/collection insert 순간에 작은 seal, sparkle, card ping을 사용해 반복 수집의 촉감을 만든다.
- Rejected alternative: runtime에서 기존 harvest FX를 재사용한다. 수확 보상과 기록 저장 순간이 같은 motion language가 되어 collection meta payoff가 흐려진다.

## Creative Brief

도감 기록 버튼을 누르면 작은 달빛 도장/잎 스파클이 하단 rail 근처에서 한 번 찍히는 느낌이어야 한다. full album screen이나 큰 폭발이 아니라, `달빛 단서 기록됨` surface 위에 얹을 수 있는 compact “record confirmed” FX strip로 설계한다.

## Game Studio Route

- `game-studio:game-studio`: collection record moment의 production gap 선택
- `game-studio:sprite-pipeline`: 8-frame 96x96 horizontal strip spec 고정
- `game-studio:phaser-2d-game`: 후속 runtime binding을 위한 `animation.binding` 결정
- `game-studio:game-playtest`: 후속 WorkUnit에서 record -> FX -> goal surface screenshot 검증

## Strategic Jump Check

선택한 후보는 `player verb: 도감 기록`, `production/progression role: collection meta 저장 확정`, `screen moment: 도감 기록 버튼 직후`, `asset/FX: dedicated record stamp strip`, `playtest evidence: 후속 runtime screenshot gate`를 충족한다.

## Department Scorecard

| 부서 | 판정 | 근거 artifact |
| --- | --- | --- |
| 기획팀 | approve | 기록 순간을 다음 목표 surface와 분리된 payoff로 만든다. |
| 리서치팀 | approve | collection record 후 짧은 확정 motion은 경쟁작 progression surface의 기본 피드백이다. |
| 아트팀 | approve | dedicated FX strip plan/prompt를 먼저 고정하고 runtime 임시 벡터를 만들지 않는다. |
| 개발팀 | approve | `asset_plan`, `asset_prompts`, topology checker만 좁게 수정한다. |
| 검수팀 | approve | `check:topology-asset-plan`, `check:asset-provenance`, `check:asset-style`, `check:ci`로 검증한다. |
| 마케팅팀 | approve | local mock asset planning만 다루며 외부 채널/결제 없음. |
| 고객지원팀 | approve | 도감 기록 저장 여부 혼란을 줄일 후속 runtime 근거를 만든다. |

## Subagent/Team Routing

Solo execute. JSON plan/prompt와 checker 갱신만 다루는 좁은 asset planning WorkUnit이다.

## Hard Problem Self-Evaluation Loop

- claim: 도감 기록 FX가 generation-ready plan/prompt와 animation metadata를 갖는다.
- smallest verifier: `npm run check:topology-asset-plan`.
- rubric: plan/prompt 양쪽에 동일 id가 있고, `frame_count`, `frame_size`, `intended_fps`, `animation.binding`, horizontal prompt direction이 있다.
- artifact path: `assets/source/asset_plan.json`, `assets/source/asset_prompts.json`.
- iteration log: runtime integration은 후속 WorkUnit으로 분리한다.
- stop condition: local checks, PR checks, merge, main CI green.

## Plan

1. GitHub issue를 만들고 plan artifact에 연결한다.
2. #478 row는 done/main CI evidence로 다음 plan commit 안에서 정리한다.
3. `fx_album_record_stamp_strip_v1` plan entry를 추가한다.
4. 같은 id의 strict image prompt를 추가한다.
5. topology checker required/sprite id 목록에 추가한다.
6. local checks, PR checks, merge, main CI까지 진행한다.

## Acceptance Criteria

- `fx_album_record_stamp_strip_v1`이 `asset_plan.json`에 있다.
- prompt batch에 같은 asset id와 output path가 있다.
- plan metadata가 `frame_count: 8`, `frame_size: 96x96`, `intended_fps: 12`, `animation.binding: album.clue_record.action.record`, `behavior: once`를 포함한다.
- prompt가 horizontal strip, no text/watermark/logo, no baked UI/card, compact rail-safe motion을 명시한다.
- `npm run check:topology-asset-plan`, `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:ci`가 통과한다.

## Verification Commands

- `npm run check:topology-asset-plan`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:ci`

## Browser Use

이 WorkUnit은 runtime UI 변화가 없는 plan/prompt 작업이다. 후속 runtime FX 연결 WorkUnit에서 Browser Use 또는 Playwright screenshot evidence를 남긴다.

## Evidence

- Issue: #480 `도감 기록 스탬프 FX plan-prompt` - https://github.com/bborok1234/strange-seed-shop/issues/480
- `npm run check:topology-asset-plan`: pass (`requiredCount: 19`, `planCount: 72`, `promptCount: 72`)
- `npm run check:asset-provenance`: pass
- `npm run check:asset-style`: pass
- `npm run check:ci`: pass
- PR: pending
