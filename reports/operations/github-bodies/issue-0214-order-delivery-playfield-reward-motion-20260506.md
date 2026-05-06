## 문제 / 배경

`?qaProductionReady=1`에서 첫 주문 납품은 panel receipt와 텍스트로는 확인되지만, 정원 playfield 안 주문상자 자체가 보상 motion으로 반응하는 감각이 약하다. 경쟁작 idle game은 생산/납품 object가 즉시 반응해 보상 순간을 화면 안에서 만든다.

## 목표

주문 납품 직후 playfield order crate 근처에서 accepted `fx_order_delivery_burst_001` strip을 재생해 “상자가 열리고 보상이 발생했다”는 장면을 만든다.

## Small win

첫 주문 납품 버튼 클릭 후 정원 playfield의 주문상자가 burst/reward motion으로 반응한다.

## Campaign source of truth

P0.5 Idle Core + Creative Rescue

## Game Studio Department Signoff

- 기획팀: `주문 납품` verb를 first 5 minutes의 보상 순간으로 강화한다.
- 리서치팀: Egg, Inc./Idle Miner류의 production object reaction gap을 닫는다.
- 아트팀: 새 그래픽 생성 없이 accepted raster FX strip의 manifest animation binding을 runtime에 연결한다.
- 개발팀: playfield view model과 host 렌더링, CSS animation, focused regression을 수정한다.
- 검수팀: Browser Use `iab` before/after + Playwright focused checks.
- 마케팅팀: 외부 게시 없음, mock-only promise.
- 고객지원팀: 주문 납품 후 보상 의미를 더 명확히 해 first 5m confusion을 낮춘다.

## Subagent/Team Routing

사용하지 않는다. 단일 runtime path라 직접 구현과 Browser Use 검증이 더 안전하다.

## 수용 기준

- playfield order crate 근처에 `fx_order_delivery_burst_001` animation binding이 표시된다.
- 4-frame strip metadata가 data attribute로 노출된다.
- FX가 playfield bounds와 bottom tab을 침범하지 않는다.
- Browser Use `iab` before/after evidence가 있다.
- focused mobile order regression, `npm run check:art-share`, `npm run build`가 통과한다.

## Visual evidence 계획

- Before: `reports/visual/issue-0214-order-reward-motion-before-browseruse-20260506.png`
- After: `reports/visual/issue-0214-order-reward-motion-after-browseruse-20260506.png`

## Playable mode 영향

로컬 playable URL: `http://127.0.0.1:4173/?qaProductionReady=1`

## 안전 범위

새 asset generation, 런타임 이미지 생성, 결제, 외부 배포, save migration은 scope 밖이다.

## 검증 명령

- focused mobile order regression
- `npm run check:art-share`
- `npm run build`
