## 문제 / 배경

#486에서 달빛 family reveal이 연구 선반에 남았다. 하지만 다음 장기 route인 원정 문은 아직 text promise에 머문다. 플레이어가 다음 구역/장기 목표를 board에서 볼 수 없다.

## 목표

달빛 family reveal 이후 `원정 문 단서 보기` action을 추가하고, 클릭하면 board/HUD에 preview-only 원정 문 route state를 남긴다.

## Small win

플레이어가 연구 선반에서 다음 장기 목표인 원정 문 preview를 실제 board state로 본다.

## Campaign source of truth

- Active campaign: P0.5 Idle Core + Creative Rescue
- Game source: `docs/GAME_BIBLE.md`
- 직전 checkpoint: #486 / PR #487 / main CI `25526968559`

## Game Studio Department Signoff

Route: `game-studio:game-studio` -> `game-studio:game-ui-frontend` -> `game-studio:phaser-2d-game` -> `game-studio:game-playtest`

- 기획팀: research -> expedition route preview를 만든다.
- 리서치팀: locked next area preview pattern을 축소 구현한다.
- 아트팀: 새 asset 없이 preview silhouette/HUD state로 visual payoff를 만든다.
- 개발팀: preview-only slot/facility/action/checker 변경으로 제한한다.
- 검수팀: Browser Use blocker를 기록하고 Playwright fallback screenshot을 저장한다.
- 마케팅팀: 외부 채널/실결제/광고 없음.
- 고객지원팀: 다음 장기 목표가 board에 보여 혼란을 줄인다.

## Subagent/Team Routing

사용하지 않는다. 변경 범위가 좁고 leader 직접 구현/검증이 빠르다.

## 플레이어 가치

달빛 family reveal이 다음 연구 문구에서 끝나지 않고, 원정 문 preview로 이어져 장기 메타의 실루엣을 만든다.

## 수용 기준

- `원정 문 단서 보기` action이 달빛 family reveal 후 표시된다.
- 클릭 후 `expeditionGatePreviewVisible=true`와 preview slot/facility state가 남는다.
- board/HUD/objective/receipt가 원정 문 preview를 설명한다.
- `npm run check:phaser`가 preview screenshot과 assertion을 포함한다.

## Visual evidence 계획

- Browser Use: 현재 세션에서 execution tool이 노출되지 않아 blocker를 보고서에 기록한다.
- Fallback: Playwright smoke screenshot을 `reports/visual/issue-0488-expedition-gate-preview-route/` 아래 저장한다.

## Playable mode 영향

main playable contract는 유지한다. feature branch에서 검증한 뒤 PR/merge/main CI까지 확인한다.

## 안전 범위

runtime image generation/API/cache 호출 없음. 새 asset 생성 없음. 실제 원정 timer/reward 없음. 결제/광고/외부 배포/고객 데이터 없음.

## 검증 명령

```bash
npm run check:phaser
npm run check:ci
npm run check:control-room
npm run check:ops-live
npm run check:github-metadata
git diff --check
```
