# P0.5 Expedition material workbench v0 visual QA

Date: 2026-04-30
Issue: #197
Item: `items/0108-expedition-material-workbench-v0.md`
Branch: `codex/0108-expedition-material-workbench-v0`

## Scope

원정 보상으로 받은 `재료`가 정원 action surface의 `작업대 강화`로 이어지고, 강화 완료 후 자동 생산률이 화면 숫자와 카드 상세로 보이는지 확인했다.

## Browser Use evidence

- Tool: Browser Use `iab`
- URL: `http://127.0.0.1:5174/?qaResearchExpeditionClaimReady=1&qaTab=expedition&qaReset=1`
- Flow:
  1. 원정 탭에서 `원정 보상 받기` 클릭
  2. 정원 탭 이동
  3. `작업대 강화` 클릭
  4. 완료 상태와 생산률 확인
- Screenshot: `reports/visual/p0-expedition-material-workbench-browser-use-20260430.png`

## Findings

- 보상 수령 후 HUD는 `재료 3`을 보여준다.
- 작업대 강화 전 카드가 `재료 사용 / 작업대 강화 / 2 재료로 자동 생산 +15%`를 실제 화면에 표시한다.
- 강화 완료 후 HUD는 `재료 1`로 줄고, 카드가 `강화 완료 / 작업대 강화 / 재료 작업대 +15% 가동`을 실제 화면에 표시한다.
- 생산 카드와 playfield는 `분당 14.3 잎`, `정원 동료 2명 작업 중`을 보여준다.
- 모바일 compact 높이에서도 업그레이드 카드의 상세 줄이 `display: none`으로 숨지지 않는다.

## Automated visual gate

- `npm run check:visual -- --grep "작업대"`: PASS
- `npm run check:visual -- --grep "생산 roster|작업대|복귀 성장 100"`: PASS
- `npm run check:visual`: PASS, 33 passed
- `npm run check:ci`: PASS
- 회귀 assertion:
  - workbench detail `<small>` visible
  - material save state `{ materials: 1, materialWorkbenchLevel: 1 }`
  - body scroll 없음
  - starter panel bottom tab overlap 없음
  - action panel child overflow 없음

## Remaining risk

- 남은 risk 없음. PR GitHub checks에서 동일 gate를 재확인한다.
