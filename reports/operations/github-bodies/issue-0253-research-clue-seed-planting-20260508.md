# 연구 단서 씨앗 심기 bridge

## 문제 / 배경

#470은 research shelf `살펴보기`까지 열었고 #472는 dedicated raster/FX generation contract를 만들었지만, player verb가 아직 “단서를 얻었다”에서 멈춘다. v1 idle collection tycoon은 discovery preview 다음에 즉시 작은 재배 행동으로 이어져야 한다.

## 목표

연구 선반 `살펴보기` 후 `달빛 씨앗 단서`를 확보하고, 빈 밭에서 `단서 심기` action으로 clue seed를 심고 돌보고 수확하는 Phaser bridge를 추가한다.

## Small win

`살펴보기`가 receipt에서 끝나지 않고 `단서 심기 -> 돌보기 -> 수확`으로 이어진다.

## Campaign source of truth

- `docs/GAME_BIBLE.md`
- `docs/GAME_PRODUCTION_SPEC.md`
- `docs/phaser/REBOOT_FOUNDATION_SPEC.md`
- `items/0253-research-clue-seed-planting.md`

## Game Studio Department Signoff

| 부서 | 판정 | 근거 |
| --- | --- | --- |
| 기획팀 | approve | research clue가 즉시 재배 행동으로 이어진다. |
| 리서치팀 | approve | next-system preview 이후 first action gap을 줄인다. |
| 아트팀 | revise | dedicated research shelf/clue FX는 #472 plan-prompt까지 완료, runtime은 generated asset 전까지 기존 plot state를 사용한다. |
| 개발팀 | approve | state/action/telemetry와 verifier만 좁게 수정한다. |
| 검수팀 | approve | research inspect -> clue seed planted/harvested screenshots와 telemetry를 남긴다. |
| 마케팅팀 | approve | local mock gameplay만 다룬다. |
| 고객지원팀 | approve | `살펴보기` 후 다음 행동이 사라지는 혼란을 줄인다. |

## Subagent/Team Routing

Solo execute. 기존 Phaser state/action boundary 안에서 새 player verb를 추가하는 좁은 변경이다.

## 플레이어 가치

플레이어는 보관 보상 이후 연구 선반을 살펴보고 바로 다음 씨앗 단서를 심어볼 수 있다.

## 수용 기준

- research shelf `살펴보기` 후 `researchClueSeedAvailable` telemetry가 true가 된다.
- 빈 unlocked plot 선택 시 `단서 심기` action이 보인다.
- `단서 심기` 후 receipt에 `달빛 단서 씨앗을 심었다`가 남는다.
- clue seed 수확 후 receipt에 `달빛 단서 수확 · 달빛 family clue +1`가 남는다.
- `researchClueHarvested` telemetry가 true가 된다.
- 기존 plant/order/storage/overview/research smoke loop가 계속 통과한다.
- `npm run check:phaser`와 `npm run check:ci`가 통과한다.

## Visual evidence 계획

- `reports/visual/issue-0474-research-clue-seed-planting/phaser-check-research-clue-action-393.png`
- `reports/visual/issue-0474-research-clue-seed-planting/phaser-check-research-clue-planted-393.png`
- `reports/visual/issue-0474-research-clue-seed-planting/phaser-check-research-clue-harvested-393.png`

## Playable mode 영향

Phaser app local state only. legacy app, save data, external systems 변경 없음.

## 안전 범위

- 신규 asset 생성 없음
- runtime image generation/API/cache 호출 없음
- #472 generated asset contract는 사용하지 않고 runtime은 기존 plot state를 사용
- 실제 결제, 광고, 외부 배포, credential, 고객 데이터 없음

## 검증 명령

- `npm run check:phaser`
- `npm run check:ci`
- `npm run check:control-room`
- `npm run check:ops-live`
