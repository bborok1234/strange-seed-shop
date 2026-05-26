## 문제 / 배경

PR #549는 `월정 숲 새벽이끼` creature/actor/FX를 runtime에 연결했습니다. 하지만 수확 이후 `새벽이끼 미루`가 아직 별도 research/route 역할을 수행하지 않아, named creature가 다음 progression을 여는 원인으로 읽히지 않습니다.

## 목표

월정 숲 수확 후 연구 선반에서 `미루 연구 맡기기` action을 열고, 미루가 연구 선반에 anchor된 researcher actor로 `온실 숲길 단서`와 다음 route preview를 남기게 합니다.

## Small win

새벽이끼 미루가 보상 이미지가 아니라 다음 연구/숲길 progression을 여는 actor로 작동합니다.

## Game Studio route

`game-studio:game-studio -> game-studio:phaser-2d-game -> game-studio:game-ui-frontend -> game-studio:game-playtest`

## Plan

1. `GardenState`에 moon grove research handoff 상태를 추가합니다.
2. 미루 actor role/task를 researcher handoff로 표현합니다.
3. 월정 숲 발견 후 연구 선반에서 `미루 연구 맡기기` action을 제공합니다.
4. action 후 research shelf clue badge, HUD surface, telemetry를 노출합니다.
5. `check-phaser-foundation`과 visual evidence로 action 전후를 검증합니다.
6. PR checks, merge, main CI를 확인합니다.

## 플레이어 가치 또는 운영사 가치

플레이어는 rare creature가 단순 수집 보상이 아니라 정원 연구와 다음 숲길을 여는 존재임을 봅니다. 운영자는 새 creature의 gameplay role을 state/checker/screenshot evidence로 추적합니다.

## 수용 기준

- [ ] 월정 숲 수확 후 연구 선반에 `미루 연구 맡기기` action이 표시됩니다.
- [ ] action 후 `moonGroveResearchHandoffRecorded=true`, `moonGroveResearchNodeId=research_moon_grove_path`, `moonGroveForestPathPreviewVisible=true`.
- [ ] `actor_moon_grove_miru`가 researcher 역할/연구 선반 target으로 업데이트되고 work strip으로 보입니다.
- [ ] Playfield 연구 선반에 온실 숲길 단서 badge 또는 bloom marker가 표시됩니다.
- [ ] HUD/action rail이 `온실 숲길 단서`와 다음 route preview를 표시합니다.
- [ ] `npm run check:phaser`, `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:ci`, `git diff --check` 통과.
- [ ] PR checks, merge, main CI green.

## Visual evidence 계획

Browser Use 우선 QA로 research handoff 화면을 확인하고 `reports/visual/issue-0550-moon-grove-miru-research-handoff/`에 screenshot/report를 남깁니다. Browser Use가 막히면 blocker를 기록하고 Playwright screenshot evidence를 fallback으로 남깁니다.

## Playable mode 영향

Phaser playable의 월정 숲 후속 연구 handoff가 추가됩니다. 사람 플레이용 main worktree 정책은 변경하지 않습니다.

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
