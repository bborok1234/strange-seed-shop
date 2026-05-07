# 연구 단서 도감 기록 bridge

## 문제 / 배경

#474는 research shelf에서 얻은 `달빛 단서 씨앗`을 심고 수확하게 했지만, 수확한 family clue가 아직 도감/collection meta에 저장되지 않는다.

## 목표

clue seed 수확 후 `도감 기록` action을 열고, 실행 시 `달빛 family clue`가 도감 단서로 저장됐다는 state/receipt/objective/telemetry를 남긴다.

## Small win

단서 수확이 receipt에서 끝나지 않고 collection meta 저장으로 이어진다.

## Campaign source of truth

- `docs/GAME_BIBLE.md`
- `docs/GAME_PRODUCTION_SPEC.md`
- `docs/phaser/REBOOT_FOUNDATION_SPEC.md`
- `items/0254-research-clue-album-record.md`

## Game Studio Department Signoff

| 부서 | 판정 | 근거 |
| --- | --- | --- |
| 기획팀 | approve | clue harvest가 collection meta로 저장된다. |
| 리서치팀 | approve | discovery reward가 persistent collection surface로 이어진다. |
| 아트팀 | revise | dedicated album/record animation은 후속 asset/FX 후보이며 이번엔 HUD/action bridge만 다룬다. |
| 개발팀 | approve | state/action/telemetry와 verifier만 좁게 수정한다. |
| 검수팀 | approve | clue harvest -> album record screenshot과 telemetry를 남긴다. |
| 마케팅팀 | approve | local mock gameplay만 다룬다. |
| 고객지원팀 | approve | “단서가 어디 갔는지” 혼란을 줄인다. |

## Subagent/Team Routing

Solo execute. 기존 Phaser state/action boundary 안에서 post-harvest action 하나를 추가하는 좁은 변경이다.

## 플레이어 가치

플레이어는 단서 씨앗 수확 후 그 단서가 도감/collection meta에 저장되는 피드백을 받는다.

## 수용 기준

- clue seed harvest 후 `researchClueRecordReady` telemetry가 true가 된다.
- action rail에 `도감 기록` action이 보인다.
- `도감 기록` 후 receipt에 `달빛 단서 도감 기록 · 다음 씨앗 목표 저장`이 남는다.
- `researchClueAlbumRecorded` telemetry가 true가 된다.
- 기존 plant/order/storage/research/clue seed smoke loop가 계속 통과한다.
- `npm run check:phaser`와 `npm run check:ci`가 통과한다.

## Visual evidence 계획

- `reports/visual/issue-0476-research-clue-album-record/phaser-check-research-clue-record-ready-393.png`
- `reports/visual/issue-0476-research-clue-album-record/phaser-check-research-clue-recorded-393.png`

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
