# 연구 선반 raster와 단서 FX plan-prompt

## 문제 / 배경

#470은 storage claim 이후 `연구 선반` preview와 `살펴보기` verb를 열었지만, runtime은 아직 existing workbench raster를 임시 stand-in으로 재사용한다. v1 research/discovery bridge가 production surface로 읽히려면 연구 선반 고유 prop과 단서 확인 FX strip이 generation-ready asset contract에 있어야 한다.

## 목표

`facility_research_shelf_v1`과 `fx_research_clue_glimmer_strip_v1`을 asset plan/prompt/checker에 추가한다.

## Small win

연구 선반이 workbench 재사용 상태에서 벗어날 수 있도록, 다음 generation/runtime integration WorkUnit이 바로 실행 가능한 raster/FX 계약을 갖는다.

## Campaign source of truth

- `docs/GAME_BIBLE.md`
- `docs/GAME_PRODUCTION_SPEC.md`
- `docs/phaser/REBOOT_FOUNDATION_SPEC.md`
- `items/0252-research-shelf-asset-plan-prompt.md`

## Game Studio Department Signoff

| 부서 | 판정 | 근거 |
| --- | --- | --- |
| 기획팀 | approve | #470 gameplay bridge를 research/discovery production surface로 승격한다. |
| 리서치팀 | approve | idle progression reference의 next-system visual preview gap을 줄인다. |
| 아트팀 | approve | dedicated raster와 clue FX strip을 생성 전 계약으로 고정한다. |
| 개발팀 | approve | runtime 변경 없이 plan/prompt/checker만 수정한다. |
| 검수팀 | approve | `check:topology-asset-plan`으로 one-to-one plan/prompt와 animation metadata를 잠근다. |
| 마케팅팀 | approve | local mock/game asset planning only. |
| 고객지원팀 | approve | 연구 선반이 workbench와 헷갈리는 위험을 줄인다. |

## Subagent/Team Routing

Solo execute. JSON plan/prompt 2개와 checker required id 추가로 범위가 좁다.

## 플레이어 가치

플레이어는 다음 WorkUnit 이후 연구 선반을 생산 workbench와 다른 discovery object로 읽을 수 있다.

## 수용 기준

- `facility_research_shelf_v1` plan/prompt가 존재한다.
- `fx_research_clue_glimmer_strip_v1` plan/prompt가 존재한다.
- FX plan에 `frame_count: 8`, `frame_size: "96x96"`, `intended_fps: 12`, `animation.binding: "facility_research_shelf.action.inspect_clue"`가 있다.
- output path는 모두 `public/assets/game/**.png`다.
- `scripts/check-topology-asset-plan.mjs`가 두 id를 필수로 검증한다.
- `npm run check:topology-asset-plan`, `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:ci`가 통과한다.

## Visual evidence 계획

N/A — runtime UI 변경 없이 asset plan/prompt 계약만 추가한다. 다음 generation/runtime integration WorkUnit에서 screenshot evidence가 필요하다.

## Playable mode 영향

영향 없음. runtime gameplay, save data, playable route를 변경하지 않는다.

## 안전 범위

- 실제 image generation 실행 없음
- runtime image generation/API/cache 호출 없음
- accepted manifest game asset 추가 없음
- SVG/vector/code-native game graphics 계획 없음
- 실제 결제, 광고, 외부 배포, credential, 고객 데이터 없음

## 검증 명령

- `npm run check:topology-asset-plan`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:ci`
