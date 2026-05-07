## 문제 / 배경

#484에서 `seed_lunar_sprout_001` 수확이 `달빛 새싹 발견 준비` 상태로 이어졌다. 하지만 아직 player verb는 없다. action rail이 `다음 발견 준비 완료`를 보여주지만 플레이어가 눌러서 family reveal을 확정하고 연구 선반 상태로 남기는 흐름이 없다.

## 목표

달빛 새싹 수확 후 `발견 확인` action을 추가하고, 클릭하면 연구 선반에 달빛 family reveal surface와 telemetry를 남긴다.

## Small win

플레이어가 수확 직후 `발견 확인`을 눌러 다음 연구 family가 열렸다는 persistent 상태를 본다.

## Campaign source of truth

- Active campaign: P0.5 Idle Core + Creative Rescue
- Game source: `docs/GAME_BIBLE.md`
- 직전 checkpoint: #484 / PR #485 / main CI `25526399609`

## Game Studio Department Signoff

Route: `game-studio:game-studio` -> `game-studio:game-ui-frontend` -> `game-studio:phaser-2d-game` -> `game-studio:game-playtest`

- 기획팀: reveal-ready를 `발견 확인` player verb로 닫는다.
- 리서치팀: discovery node 확인과 unlocked state를 축소 구현한다.
- 아트팀: 새 asset 없이 research shelf chips/HUD surface로 visual payoff를 만든다.
- 개발팀: `GardenState`, HUD/action, checker 변경으로 제한한다.
- 검수팀: Browser Use blocker를 기록하고 Playwright fallback screenshot을 저장한다.
- 마케팅팀: 외부 채널/실결제/광고 없음.
- 고객지원팀: 다음 행동 의미를 버튼과 receipt로 설명한다.

## Subagent/Team Routing

사용하지 않는다. 변경 범위가 좁고 leader 직접 구현/검증이 빠르다.

## 플레이어 가치

달빛 새싹 수확이 `준비 완료` 안내에서 끝나지 않고, 연구 선반의 새로운 family reveal 상태로 남아 장기 메타 기대감을 만든다.

## 수용 기준

- `발견 확인` action이 달빛 새싹 수확 후 표시된다.
- 클릭 후 `researchLunarFamilyRevealed=true`, `researchNextGoalRevealReady=false`가 된다.
- 연구 선반 선택/화면에서 달빛 family reveal 상태가 보인다.
- `npm run check:phaser`가 discovery confirm screenshot과 assertion을 포함한다.

## Visual evidence 계획

- Browser Use: 현재 세션에서 execution tool이 노출되지 않아 blocker를 보고서에 기록한다.
- Fallback: Playwright smoke screenshot을 `reports/visual/issue-0486-lunar-sprout-discovery-confirm/` 아래 저장한다.

## Playable mode 영향

main playable contract는 유지한다. feature branch에서 검증한 뒤 PR/merge/main CI까지 확인한다.

## 안전 범위

runtime image generation/API/cache 호출 없음. 새 asset 생성 없음. 결제/광고/외부 배포/고객 데이터 없음.

## 검증 명령

```bash
npm run check:phaser
npm run check:ci
npm run check:control-room
npm run check:ops-live
npm run check:github-metadata
git diff --check
```
