# 연구 단서 목표 surface

## 문제 / 배경

#476은 `달빛 family clue`를 도감 기록 state로 저장했지만, 기록 이후 플레이어가 다음에 무엇을 해야 하는지 보는 목표 surface가 아직 없다.

## 목표

`researchClueAlbumRecorded` 이후 Phaser HUD/action rail에 `달빛 단서 기록됨`과 다음 씨앗 목표 preview를 보여주는 lightweight collection goal surface를 추가한다.

## Small win

도감 기록 이후 다음 수집 목표가 화면 안에 남는다.

## Campaign source of truth

- `docs/GAME_BIBLE.md`
- `docs/GAME_PRODUCTION_SPEC.md`
- `docs/phaser/REBOOT_FOUNDATION_SPEC.md`
- `items/0255-research-clue-goal-surface.md`

## Game Studio Department Signoff

| 부서 | 판정 | 근거 |
| --- | --- | --- |
| 기획팀 | approve | recorded clue가 다음 seed goal로 이어진다. |
| 리서치팀 | approve | collection reward 이후 next target gap을 줄인다. |
| 아트팀 | revise | dedicated album card/record FX는 후속 후보이며 이번은 HUD surface만 다룬다. |
| 개발팀 | approve | runtime state/HUD/verifier만 좁게 수정한다. |
| 검수팀 | approve | record 후 goal surface screenshot과 telemetry를 남긴다. |
| 마케팅팀 | approve | local mock gameplay만 다룬다. |
| 고객지원팀 | approve | 기록 이후 다음 행동 혼란을 줄인다. |

## Subagent/Team Routing

Solo execute. 기존 Phaser HUD/action rail과 smoke verifier를 좁게 확장한다.

## 플레이어 가치

플레이어는 단서를 도감에 기록한 뒤 다음 씨앗 목표를 바로 볼 수 있다.

## 수용 기준

- `researchClueAlbumRecorded` 이후 goal surface가 보인다.
- surface text에 `달빛 단서 기록됨`과 `다음 씨앗 목표`가 포함된다.
- telemetry가 goal surface visible 상태를 제공한다.
- 기존 plant/order/storage/research/clue record smoke loop가 계속 통과한다.
- `npm run check:phaser`와 `npm run check:ci`가 통과한다.

## Visual evidence 계획

- `reports/visual/issue-0478-research-clue-goal-surface/phaser-check-research-clue-goal-surface-393.png`

## Playable mode 영향

Phaser app local state only. legacy app, save data, external systems 변경 없음.

## 안전 범위

- 신규 asset 생성 없음
- runtime image generation/API/cache 호출 없음
- 실제 결제, 광고, 외부 배포, credential, 고객 데이터 없음

## 검증 명령

- `npm run check:phaser`
- `npm run check:ci`
- `npm run check:control-room`
- `npm run check:ops-live`
