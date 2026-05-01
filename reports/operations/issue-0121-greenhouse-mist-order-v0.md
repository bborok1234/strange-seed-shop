# [Game Feature] 물안개 복귀 보상이 새 납품 주문으로 이어진다

## 문제 / 배경

`온실 물안개` 완료 뒤 복귀 보관 보너스는 커지지만, 그 payoff가 다음 주문 목표로 바로 이어지지 않는다. P0.5 idle core 기준에서 오프라인 수익은 다음 objective completion과 연결되어야 재방문 이유가 강해진다.

## 목표

물안개 완료 뒤 `물안개 응축 납품` 주문을 열어, 복귀 보너스로 받은 잎이 새 납품과 `재료 1 · 꽃가루 2` 보상으로 이어지는 vertical slice를 만든다.

Issue: #235
PR: #236

## Small win

플레이어가 물안개 완료 후 돌아와 `보관 보상 +30%`를 확인하고, 받은 잎으로 곧바로 `물안개 응축 납품`을 완료한다.

## Game Studio route

- `game-studio:game-studio`: 물안개 강화 -> 복귀 보너스 -> 새 납품 주문 -> 다음 온실 재료 보상 vertical slice.
- `game-studio:game-ui-frontend`: 모바일 정원 action surface가 새 주문을 보여도 playfield와 bottom tabs를 보호한다.
- `game-studio:game-playtest`: Browser Use iab와 모바일 393px screenshot/invariant로 실제 게임 화면을 검증한다.

## Plan

1. `GREENHOUSE_MIST_RETURN_ORDER`를 추가하고 물안개 완료 뒤 active order로 선택한다.
2. 주문 요구 잎/보상 재료/꽃가루를 기존 주문 루프에 연결한다.
3. QA seed와 visual regression을 추가한다.
4. Browser Use iab로 복귀 modal -> 생산 수령 -> 주문 납품을 확인한다.
5. roadmap/dashboard/control room과 PR evidence를 갱신한다.

## 플레이어 가치 또는 운영사 가치

- 플레이어 가치: 복귀 보너스가 숫자 증가에서 끝나지 않고 바로 새 납품 완료감으로 이어진다.
- 운영사 가치: `$seed-ops`가 merge 후 다음 production vertical slice를 자동으로 선택하고 plan-first evidence를 남긴다.

## 수용 기준

- [x] `온실 물안개` 완료 뒤 active order가 `물안개 응축 납품`으로 전환된다.
- [x] 복귀 보너스 후 생산 잎을 수령하면 새 주문 진행률이 채워진다.
- [x] 주문 납품 시 `재료 1 · 꽃가루 2`가 지급되고 completedOrderIds에 새 주문 id가 저장된다.
- [x] 모바일 393px에서 comeback modal, production card, order crate, bottom tabs가 서로 가리지 않고 overflow가 없다.
- [x] Browser Use iab evidence와 `npm run check:visual -- --grep "물안개 응축"`가 통과한다.
- [x] `npm run check:ci`가 통과한다.

## Visual evidence 계획

Browser Use `iab`로 `qaGreenhouseMist=1` 복귀 상태에서 `보상 확인` -> `생산 잎 수령` -> `물안개 응축 납품` 완료 흐름을 확인한다. 보강으로 Playwright mobile 393px screenshot을 `reports/visual/`에 저장한다.

## Playable mode 영향

사람 플레이용 `main` worktree/port 정책은 변경하지 않는다. 기능은 feature branch에서 검증하고, merge 후 main playable에 반영된다.

## 안전 범위

- 신규 asset 생성 없음.
- 신규 dependency 없음.
- runtime image generation 없음.
- 실제 결제, 로그인, 광고, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음.

## 검증 명령

- Browser Use `iab`
- Browser Use `iab` — PASS, `reports/visual/p0-greenhouse-mist-return-order-v0-20260501.md`
- `npm run check:visual -- --grep "물안개 응축"` — PASS
- `npm run check:loop` — PASS
- `npm run check:content` — PASS
- `npm run build` — PASS
- `npm run check:ci` — PASS
