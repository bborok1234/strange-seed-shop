# Greenhouse route expansion v0

Status: done
Branch: `codex/0115-greenhouse-route-expansion-v0`
Issue: #218
PR: #219

## Context

#215에서 `선반 정리` 이후 `온실 확장 준비` 주문을 열고, 납품 보상으로 `재료 2`를 지급했다. 하지만 그 재료를 다시 정원 성장에 쓰는 선택지가 아직 없다. 다음 vertical slice는 `온실 동선 확장`을 열어 재료 2개를 소비하면 3번 밭이 열리게 만든다. 주문 보상이 실제 재배 용량 증가로 이어져야 한다.

## Reference teardown

- `docs/NORTH_STAR.md`: 생산/주문/업그레이드 목표가 한 화면에서 이어져야 하고, 다음 해금 목표가 계속 보여야 한다.
- `docs/IDLE_CORE_CREATIVE_GUIDE.md`: order/commission 보상은 새 씨앗/연구/탐험/시설 목표로 이어져야 한다.
- `docs/PROJECT_COMMANDS.md`: 다음 issue 선택은 safe/small이 아니라 `player verb + production/progression role + screen moment + asset/FX + playtest evidence` 기준이다.

## Game Studio route

- `game-studio:game-studio`: 온실 확장 주문 보상 -> 온실 동선 확장 -> 3번 밭 개방 vertical slice.
- `game-studio:web-game-foundations`: `plotCount` progression을 기존 save와 안전하게 연결한다.
- `game-studio:game-ui-frontend`: 3번 밭이 playfield/action surface/bottom tabs를 가리지 않게 모바일 밀도를 검증한다.
- `game-studio:game-playtest`: Browser Use와 visual regression으로 구매 전/후 밭 개방을 확인한다.

## Creative brief

`온실 동선 확장`은 정리된 선반과 확장 준비 주문 뒤 정원 동료들이 이동 통로를 넓혀 새 밭 하나를 더 쓰는 장면이다. 새 asset 없이 기존 plot/playfield와 upgrade choice surface를 쓰되, 화면에서는 `3번 밭 개방`이 분명해야 한다.

## Vertical slice scoring

- `player verb`: 온실 확장 주문 보상 재료로 `온실 동선 확장`을 구매한다.
- `production/progression role`: 주문 납품 보상이 재배 용량과 오프라인 생산 기반으로 환류된다.
- `screen moment`: 성장 선택에 `온실 동선`, playfield에 3번 밭이 빈 자리로 보인다.
- `asset/FX`: 신규 asset 없음. 기존 plot/playfield와 upgrade choice surface 재사용.
- `playtest evidence`: Browser Use `iab`, focused visual, full visual, CI.

## Plan

1. save에 `greenhouseRouteLevel`을 추가하고 기존 save normalization 기본값 0을 보존한다.
2. `GREENHOUSE_EXPANSION_ORDER` 완료 후 `온실 동선` upgrade choice를 열고, `재료 2`를 소비해 `plotCount`를 3으로 올린다.
3. QA 경로 `qaGreenhouseRoute=1` 또는 visual flow에서 확장 주문 완료 상태와 구매 후 3번 밭 개방을 재현한다.
4. Browser Use evidence와 roadmap/dashboard/GitHub evidence를 갱신한다.

## Acceptance

- [x] `온실 확장 준비` 납품 완료 뒤 `온실 동선` 성장 선택이 보인다.
- [x] `재료 2`로 구매하면 save의 `greenhouseRouteLevel`이 1, `plotCount`가 3이 된다.
- [x] 구매 후 playfield에서 3번 밭이 `빈 자리`로 열려 보인다.
- [x] 모바일 393px에서 playfield, action surface, bottom tabs가 서로 가리지 않는다.
- [x] Browser Use `iab`, focused visual, full visual, CI가 통과한다.

## Evidence

- Browser Use `iab`: `reports/visual/p0-greenhouse-route-expansion-browser-use-20260430.png`
- Visual report: `reports/visual/p0-greenhouse-route-expansion-v0-20260430.md`
- Focused visual: `npm run check:visual -- --grep "온실 동선 확장"` PASS
- Regression focused visual: `npm run check:visual -- --grep "온실 확장 준비|온실 동선 확장"` PASS
- Full visual: `npm run check:visual` PASS, 40 passed
- CI: `npm run check:ci` PASS
- PR checks: #219 PASS (`Check automerge eligibility`, `Verify game baseline`)
- Main CI: `25157053868` PASS

## Risks

- 3번 밭 개방으로 playfield 밀도와 action surface가 동시에 바뀐다. Browser Use에서 3번 밭 부분 가림을 발견해 3열 compact 배치와 third-plot overlap gate를 추가했고, 완료 카드 overflow는 route choice/complete compact filter로 통과시켰다.
- 남은 follow-up blocker 없음.
