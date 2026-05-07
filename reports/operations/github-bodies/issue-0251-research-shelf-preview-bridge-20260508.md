# 연구 선반 preview bridge

## 문제 / 배경

storage/offline reward loop가 닫힌 뒤 다음 장기 목표가 research/discovery로 이어지지 않는다. v1 idle collection tycoon은 생산/보관/주문 다음에 다음 씨앗 단서 surface가 보여야 한다.

## 목표

보관 잎 회수 후 `연구 선반` facility preview를 board에 노출하고, `살펴보기` action으로 다음 씨앗 family clue preview를 확인하게 한다.

## Small win

storage reward 이후 board가 `연구 선반 살펴보기`로 이어져 D1-D7 discovery 방향을 보여준다.

## Campaign source of truth

- `docs/GAME_BIBLE.md`
- `docs/GAME_PRODUCTION_SPEC.md`
- `docs/phaser/REBOOT_FOUNDATION_SPEC.md`
- `items/0251-research-shelf-preview-bridge.md`

## Game Studio Department Signoff

| 부서 | 판정 | 근거 |
| --- | --- | --- |
| 기획팀 | approve | storage reward가 research/discovery로 이어진다. |
| 리서치팀 | approve | incremental/idle progression의 다음 계통 preview gap을 줄인다. |
| 아트팀 | revise | dedicated research shelf raster가 없어 existing workbench raster를 임시 재사용한다. |
| 개발팀 | approve | facility kind/state/action과 verifier만 수정한다. |
| 검수팀 | approve | research ready/inspected screenshot과 telemetry를 남긴다. |
| 마케팅팀 | approve | local/mock gameplay만 다룬다. |
| 고객지원팀 | approve | 다음 목표가 연구 단서로 읽힌다. |

## Subagent/Team Routing

Solo execute. 변경 범위가 runtime state/action과 smoke verifier로 좁다.

## 플레이어 가치

보관 보상을 회수한 뒤 다음 씨앗 단서를 살펴보는 목표가 생겨, 첫날 loop가 단순 수치 보상에서 discovery로 이어진다.

## 수용 기준

- storage claim 후 `facility_research_shelf`가 preview slot으로 보인다.
- research shelf 선택 시 `살펴보기` action이 보인다.
- `살펴보기` 후 receipt에 `연구 선반 살펴보기 · 달빛 씨앗 단서 preview`가 남는다.
- `researchShelfPreviewSeen` telemetry가 true가 된다.
- 기존 plant/order/storage/overview smoke loop가 계속 통과한다.
- `npm run check:phaser`와 `npm run check:ci`가 통과한다.

## Visual evidence 계획

- `reports/visual/issue-0470-research-shelf-preview-bridge/phaser-check-research-shelf-ready-393.png`
- `reports/visual/issue-0470-research-shelf-preview-bridge/phaser-check-research-shelf-inspected-393.png`

## Playable mode 영향

Phaser app의 local state only. save data, legacy app, external systems 변경 없음.

## 안전 범위

- 신규 asset 생성 없음
- runtime image generation/API/cache 호출 없음
- dedicated research shelf asset은 후속 WorkUnit
- 실제 결제, 광고, 외부 배포, credential, 고객 데이터 없음

## 검증 명령

- `npm run check:phaser`
- `npm run check:ci`
- `npm run check:control-room`
- `npm run check:ops-live`
