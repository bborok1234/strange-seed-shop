## 문제 / 배경

#482에서 도감 기록 후 `다음 씨앗 목표`가 실제 `목표 씨앗 받기`와 `목표 심기`로 이어졌다. 하지만 `seed_lunar_sprout_001`을 심은 다음 수확하면 아직 일반 수확 branch로 떨어져 목표 씨앗의 의미와 다음 발견 payoff가 사라진다.

## 목표

`달빛 새싹`을 성장/수확하면 일반 말랑잎 수확이 아니라 다음 발견/reveal-ready 상태로 전환되게 한다.

## Small win

플레이어가 `목표 심기` 이후 `돌보기`와 `수확`을 끝냈을 때 `달빛 새싹 발견 준비` receipt/objective/telemetry를 보고 다음 collection progression을 이해한다.

## Campaign source of truth

- Active campaign: P0.5 Idle Core + Creative Rescue
- Game source: `docs/GAME_BIBLE.md`
- 직전 checkpoint: #482 / PR #483 / main CI `25525693860`

## Game Studio Department Signoff

Route: `game-studio:game-studio` -> `game-studio:game-ui-frontend` -> `game-studio:phaser-2d-game` -> `game-studio:game-playtest`

- 기획팀: `돌보기` -> `수확` -> `다음 발견` player verb를 닫는다.
- 리서치팀: Cell to Singularity식 발견 node 기대감을 작은 Phaser board state로 축소한다.
- 아트팀: 기존 generated plot/harvest FX를 재사용하고 dedicated reveal FX는 후속 asset WorkUnit으로 분리한다.
- 개발팀: `GardenState`, HUD telemetry, deterministic smoke checker만 변경한다.
- 검수팀: Browser Use blocker를 기록하고 Playwright fallback screenshot을 저장한다.
- 마케팅팀: 외부 채널/실결제/광고 없음.
- 고객지원팀: 수확 후 다음 행동 의미를 receipt/objective로 설명한다.

## Subagent/Team Routing

사용하지 않는다. 변경 범위가 좁고 leader 직접 구현/검증이 빠르다.

## 플레이어 가치

연구 단서가 단순 텍스트 목표가 아니라 실제 다음 씨앗 성장과 발견 준비로 이어져, “하나만 더 키워볼까?”가 끊기지 않는다.

## 수용 기준

- `seed_lunar_sprout_001` 수확이 일반 말랑잎 수확이 아니라 별도 branch로 처리된다.
- `researchNextGoalSeedHarvested`, `researchNextGoalRevealReady` telemetry가 true가 된다.
- objective/receipt/action rail이 `달빛 새싹`과 `다음 발견`을 설명한다.
- `npm run check:phaser`가 목표 씨앗 planting 이후 성장/수확 screenshot과 assertion을 포함한다.

## Visual evidence 계획

- Browser Use: 현재 세션에서 execution tool이 노출되지 않아 blocker를 보고서에 기록한다.
- Fallback: Playwright smoke screenshot을 `reports/visual/issue-0484-lunar-sprout-growth-reveal/` 아래 저장한다.

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
