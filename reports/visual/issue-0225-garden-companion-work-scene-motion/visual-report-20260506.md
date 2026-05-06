# #424 정원 동료 work scene motion Browser Use QA

## Browser Use

- Backend: Browser Use `iab`
- URL: `http://127.0.0.1:4173/?qaResearchExpeditionReady=1`
- Before: `browser-use-before-production-ready-20260506.png`
- After first pass: `browser-use-after-workstage-first-pass-20260506.png`
- After panel removal: `browser-use-after-workstage-final-candidate-20260506.png`
- Final clean: `browser-use-after-workstage-clean-final-20260506.png`
- Final prop pass: `browser-use-after-workstage-prop-pass-20260506.png`

## Findings

- Before: 동료 actor 2명이 하단 card/summary에 갇혀 있고 playfield에는 plot만 남아 있어, 자동 생산이 character-at-work scene으로 읽히지 않았다.
- First pass: workstage actor와 trail은 생겼지만 큰 반투명 panel이 장면을 다시 덮었다.
- Final: 큰 workstage panel을 제거했고, `말랑잎 포리`와 `방패새싹 모모`가 배경 위 plot/crate/workbench anchor에 놓인다.
- Prop pass: 캐릭터 뒤의 이름표/원형 텍스트 칩을 제거하고, 생산 rate/order target은 작은 잎/상자 prop으로 낮춰 HUD처럼 떠 보이는 문제를 줄였다.
- Final DOM: `.playfield-companion-workstage` 1개, `.playfield-workstage-primary-sprite` 1개, `.playfield-workstage-support` 1개, `.playfield-workstage-trail` 2개, `.playfield-workstage-target.target-order img` 1개, workstage name chip 0개.
- Final cleanup: `.playfield-loading` visible node 0개. Phaser loading text가 production scene을 가리지 않는다.

## Remaining Risk

- 이번 slice는 기존 gpt-image-2 work/static assets를 재배치하고 CSS motion을 더한 단계다. 더 큰 leap를 위해서는 다음 slice에서 support actor 전용 work/celebrate strip 또는 station prop을 새로 생성하는 편이 좋다.
