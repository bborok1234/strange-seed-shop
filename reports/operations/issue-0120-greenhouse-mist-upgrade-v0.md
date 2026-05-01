# [Game Feature] 온실 물길 점검 보상이 물안개 강화로 이어진다

## 문제 / 배경

`온실 물길 점검` 주문은 재료 1개와 꽃가루 3개를 보상으로 주지만, 현재 화면에서는 그 보상이 다음 성장 선택으로 바로 이어지지 않는다. P0.5 idle core 기준으로 주문 보상은 다음 시설/복귀/생산 목표로 환류되어야 한다.

## 목표

물길 점검 주문 완료 뒤 `온실 물안개` 강화를 열어, 주문 보상이 오프라인 복귀 보너스 강화로 이어지는 vertical slice를 만든다.

PR: #233

## Small win

플레이어가 `온실 물길 점검` 납품 보상 `재료 1 · 꽃가루 3`을 받아 곧바로 `온실 물안개`를 구매하고, 다음 복귀 보상에서 더 높은 보관 보너스를 확인한다.

## Game Studio route

- `game-studio:game-studio`: 물길 강화 -> 물길 점검 주문 -> 물안개 강화 -> 복귀 보너스 vertical slice.
- `game-studio:game-ui-frontend`: 모바일 정원 action surface가 새 성장 선택을 보여도 playfield와 bottom tabs를 보호한다.
- `game-studio:game-playtest`: 모바일 393px screenshot과 layout invariant로 실제 게임 화면을 검증한다.

## Plan

1. save schema에 `greenhouseMistLevel` 기본값과 normalization을 추가한다.
2. `온실 물길 점검` 완료 뒤 `온실 물안개` upgrade choice를 열고, `재료 1 · 꽃가루 3` 소비와 완료 상태를 구현한다.
3. 오프라인 보상 breakdown에 물안개 보관 보너스를 포함한다.
4. QA seed와 visual regression을 추가한다.
5. roadmap/dashboard/control room과 PR evidence를 갱신한다.

## 플레이어 가치 또는 운영사 가치

- 플레이어 가치: 주문 보상이 다음 시설 강화와 복귀 기대감으로 이어져 “다음에 돌아오면 더 받는다”는 idle hook이 강화된다.
- 운영사 가치: `$seed-ops`가 작은 copy/polish가 아니라 north star vertical slice를 issue -> plan -> 구현 -> 검증 -> PR 루프로 처리한다.

## 수용 기준

- [x] `온실 물길 점검` 완료 뒤 `온실 물안개` 성장 선택이 보인다.
- [x] `재료 1 · 꽃가루 3`으로 구매하면 save의 `greenhouseMistLevel`이 1이 되고 재료/꽃가루가 0이 된다.
- [x] 물안개 완료 뒤 오프라인 복귀 보관 보너스가 기존 선반/정리 보너스보다 +10% 높게 계산된다.
- [x] 모바일 393px에서 playfield, production card, upgrade choice, bottom tabs가 서로 가리지 않고 overflow가 없다.
- [x] `npm run check:ci`가 통과한다.

## Visual evidence 계획

Browser Use `iab`로 직접 확인했다. `보상 확인` -> `생산 잎 수령` -> `주문 납품` -> `온실 물안개` 구매 흐름이 동작했고, `qaGreenhouseMist=1` 복귀 modal에서 `보관 보상 +30%`를 확인했다. Screenshot은 `reports/visual/p0-greenhouse-mist-upgrade-browser-use-20260501.png`에 저장했다.

## Playable mode 영향

사람 플레이용 `main` worktree/port 정책은 변경하지 않는다. 기능은 feature branch에서 검증하고, merge 후 main playable에 반영된다.

## 안전 범위

- 신규 asset 생성 없음.
- 신규 dependency 없음.
- runtime image generation 없음.
- 실제 결제, 로그인, 광고, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음.

## 검증 명령

- `npm run check:loop` — PASS
- `npm run check:content` — PASS
- `npm run build` — PASS
- Browser Use `iab` — PASS, `reports/visual/p0-greenhouse-mist-upgrade-browser-use-20260501.png`
- `npm run check:visual -- --grep "온실 물안개"` — PASS
- `npm run check:ci` — PASS
- PR #233 GitHub checks — PASS (`Check automerge eligibility`, `Verify game baseline`)
- Draft PR #233 생성 완료
