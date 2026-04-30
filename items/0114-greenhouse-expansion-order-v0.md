# Greenhouse expansion order v0

Status: done
Branch: `codex/0114-greenhouse-expansion-order-v0`
Issue: #215
PR: #216

## Context

#203-#214에서 온실 설비, 선반 납품, 오프라인 보관 보너스, `선반 정리` +20% 강화까지 연결했다. 하지만 선반 정리 이후 production lane은 다시 `온실 선반 납품 완료` 상태에 머물러 다음 납품/확장 목표가 없다. 다음 vertical slice는 `선반 정리` 완료 뒤 `온실 확장 준비` 주문을 열어, 강화한 보관 시설이 다시 주문 루프로 이어지게 만든다.

## Reference teardown

- `docs/NORTH_STAR.md`: production bar는 생명체 actor, 주문/업그레이드, 다음 해금 목표가 항상 보여야 한다.
- `docs/IDLE_CORE_CREATIVE_GUIDE.md`: order/commission slice는 납품 progress와 보상이 보이고, 보상은 다음 씨앗/연구/탐험/시설 목표로 이어져야 한다.
- `docs/PROJECT_COMMANDS.md`: 다음 issue 선택은 safe/small이 아니라 `player verb + production/progression role + screen moment + asset/FX + playtest evidence` 기준이다.

## Game Studio route

- `game-studio:game-studio`: 선반 정리 완료 -> 새 온실 확장 주문 -> 다음 시설 재료 확보 vertical slice.
- `game-studio:web-game-foundations`: order definition/state progression이 기존 save와 order progress를 깨지 않게 확장한다.
- `game-studio:game-ui-frontend`: 새 주문이 모바일 action surface와 playfield crate에서 읽히되 bottom tabs를 가리지 않는다.
- `game-studio:game-playtest`: Browser Use와 visual regression으로 선반 정리 후 새 주문, 생산 수령, 납품 보상을 확인한다.

## Creative brief

`온실 확장 준비`는 선반 정리를 마친 뒤 정원 동료들이 더 큰 온실 동선을 준비하는 주문이다. 새 asset 없이 기존 order crate를 쓰되, 화면 문구는 "확장 준비"가 분명해야 한다. 보상은 잎/꽃가루/재료를 주어 다음 온실 시설 단계의 전제처럼 읽힌다.

## Vertical slice scoring

- `player verb`: 선반 정리 완료 후 새 확장 주문을 채우고 납품한다.
- `production/progression role`: +20% 보관 강화가 주문 반복과 다음 온실 재료 확보로 이어진다.
- `screen moment`: playfield/order card에 `온실 확장 준비`, `0/60 잎`, 납품 후 `+70 잎 · +3 꽃가루 · +2 재료`가 보인다.
- `asset/FX`: 신규 asset 없음. 기존 order crate / production FX 재사용.
- `playtest evidence`: Browser Use `iab`, focused visual, full visual, CI.

## Plan

1. `GREENHOUSE_EXPANSION_ORDER`를 추가하고 order progression 순서를 선반 정리 완료 뒤 새 주문으로 확장한다.
2. `qaGreenhouseStorage=1` 경로에서 새 주문이 열리도록 QA save를 보강한다.
3. 생산 수령/납품 후 재료 보상이 저장되고 playfield/order card가 완료 상태를 보이도록 visual test를 추가한다.
4. Browser Use evidence와 roadmap/dashboard/GitHub evidence를 갱신한다.

## Acceptance

- [x] `greenhouseStorageLevel=1` save에서 현재 주문이 `온실 확장 준비`로 전환된다.
- [x] 새 주문은 `60 잎` 요구량과 `+70 잎 · +3 꽃가루 · +2 재료` 보상을 보여준다.
- [x] 생산 수령 후 주문 납품이 가능하고, 납품 뒤 save에 재료 보상이 반영된다.
- [x] 모바일 393px에서 playfield, action surface, bottom tabs가 서로 가리지 않는다.
- [x] Browser Use `iab`, focused visual, full visual, CI가 통과한다.

## Evidence

- Browser Use `iab`: `reports/visual/p0-greenhouse-expansion-order-browser-use-20260430.png`
- Visual report: `reports/visual/p0-greenhouse-expansion-order-v0-20260430.md`
- Focused visual: `npm run check:visual -- --grep "온실 확장 준비"` PASS
- Full visual: `npm run check:visual` PASS, 39 passed
- CI: `npm run check:ci` PASS
- PR checks: #216 PASS (`Check automerge eligibility`, `Verify game baseline`)
- Merge: PR #216 squash-merged to `main`
- Main CI: `25155573462` PASS

## Risks

- 주문 정의가 늘어나면서 기존 `GREENHOUSE_ORDER` 완료 상태 테스트 기대값이 흔들릴 수 있다. `greenhouseStorageLevel=1`에서만 새 주문을 여는 방식으로 기존 선반 완료 경로를 보존했고 full visual 39개로 재확인했다.
