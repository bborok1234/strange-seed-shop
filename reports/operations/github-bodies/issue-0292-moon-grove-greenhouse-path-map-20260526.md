## 문제 / 배경

PR #551은 `새벽이끼 미루`를 연구 선반 researcher actor로 연결하고 `온실 숲길 단서`를 남겼습니다. 하지만 단서가 아직 HUD 텍스트와 telemetry에 가까워, 플레이어가 직접 다음 연구/숲길 map을 펼쳐 보는 screen moment가 없습니다.

## 목표

미루 연구 handoff 후 연구 선반에서 `숲길 지도 펼치기` action을 열고, action 후 `research_moon_grove_path -> route_moon_grove_greenhouse_path -> 물안개 source silhouette` 3-node clue map을 HUD/playfield/telemetry에 남깁니다.

## Small win

연구 단서가 receipt 문구에서 끝나지 않고, 다음 collection route를 보여주는 visual map으로 바뀝니다.

## Game Studio route

`game-studio:game-studio -> game-studio:phaser-2d-game -> game-studio:game-ui-frontend -> game-studio:game-playtest`

## Plan

1. `GardenState`에 moon grove clue map open/record state와 next node ids를 추가합니다.
2. 미루 연구 handoff 이후 연구 선반에 `숲길 지도 펼치기` action을 제공합니다.
3. action 후 clue map telemetry, objective/receipt, HUD surface, playfield marker를 노출합니다.
4. `check-phaser-foundation`에 action 전후 assertion과 393px screenshot evidence를 추가합니다.
5. PR checks, merge, main CI를 확인합니다.

## 플레이어 가치 또는 운영사 가치

플레이어는 rare creature 연구 결과가 다음 숲길/물안개 목표를 실제로 여는 장면을 봅니다. 운영자는 research map progression을 state/checker/screenshot evidence로 추적합니다.

## 수용 기준

- [ ] 미루 연구 handoff 후 연구 선반에 `숲길 지도 펼치기` action이 표시됩니다.
- [ ] action 후 `moonGroveClueMapOpened=true`, `moonGroveClueMapCurrentNodeId=research_moon_grove_path`, `moonGroveClueMapNextNodeId=route_moon_grove_greenhouse_path`.
- [ ] HUD/action rail이 `온실 숲길 지도`와 다음 `물안개 source silhouette`를 표시합니다.
- [ ] Playfield 연구 선반에 clue map marker 또는 3-node chip이 표시됩니다.
- [ ] `actor_moon_grove_miru`가 researcher 역할/연구 선반 target으로 유지됩니다.
- [ ] `npm run check:phaser`, `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:ci`, `git diff --check` 통과.
- [ ] PR checks, merge, main CI green.

## Visual evidence 계획

Browser Use 우선 QA로 clue map action 전후를 확인하고 `reports/visual/issue-0552-moon-grove-greenhouse-path-map/`에 screenshot/report를 남깁니다. Browser Use가 막히면 blocker를 기록하고 Playwright screenshot evidence를 fallback으로 남깁니다.

## Playable mode 영향

Phaser playable의 연구 선반 후속 map action이 추가됩니다. 사람 플레이용 main worktree 정책은 변경하지 않습니다.

## 안전 범위

- 새 image generation 없음
- runtime image generation 없음
- 기존 accepted asset overwrite 없음
- 결제, 광고, 고객 데이터, 외부 배포 없음
- Phaser state/action/render/checker/visual evidence 범위로 제한

## 검증 명령

- `npm run check:phaser`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:ci`
- `git diff --check`
