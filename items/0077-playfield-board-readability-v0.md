# Playfield board readability v0

Status: completed
Issue: #137
Branch: `codex/0077-playfield-board-readability-v0`
Date: 2026-04-29

## Problem

#135에서 세로줄 artifact를 줄이기 위해 playfield board surface를 강하게 눌렀지만, 그 결과 plot 상태와 생산 status text가 살짝 흐려졌다. 사용자가 지적한 세로줄은 다시 두드러지지 않게 유지하면서, 보드 판독성을 되살릴 필요가 있다.

## Small win

정원 playfield가 밝고 깨끗한 온실 보드처럼 보이면서도 `빈 자리`, locked plot, 생산 status가 모바일 첫 화면에서 읽힌다.

## Plan

1. `src/styles.css`의 host warm surface를 세로줄 억제 최소 강도로 낮춘다.
2. `src/game/playfield/GardenScene.ts`의 board fill, plot pad alpha, status pill contrast를 조정한다.
3. Browser Use in-app QA로 `/?qaProductionReady=1` 화면을 확인하고 screenshot evidence를 저장한다.
4. `npm run check:visual`, `npm run check:all`을 통과시킨다.

## Acceptance Criteria

- [x] Browser Use 화면에서 playfield 세로줄이 다시 두드러지지 않는다.
- [x] plot state text와 생산 status text가 모바일 첫 화면에서 읽힌다.
- [x] bottom tab과 next goal overlap이 없다.
- [x] 저장/content/economy/runtime asset 계약 변경이 없다.

## Evidence

- Issue #137: CLOSED
- Visual report: `reports/visual/p0-playfield-board-readability-20260429.md`
- Browser Use: `reports/visual/p0-playfield-board-readability-browser-use-20260429.png`

## Verification Commands

- Browser Use in-app QA: `http://127.0.0.1:5174/?qaProductionReady=1`
- `npm run check:visual`
- `npm run check:all`

## Risks

- 너무 밝히면 세로줄이 다시 보이고, 너무 누르면 plot이 흐려진다. 이번 PR은 작은 톤/contrast correction으로 제한한다.

## Safety

- 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음
- `ENABLE_AGENT_AUTOMERGE` 변경 없음
- Branch protection 우회 없음
- runtime image generation 없음
- 새 dependency 설치 없음
