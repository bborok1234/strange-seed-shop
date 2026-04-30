# Greenhouse shelf offline bonus v0

Status: done
Branch: `codex/0111-greenhouse-shelf-offline-bonus-v0`
Issue: #206
PR: #207

## Context

#203에서 온실 설비 완료가 `온실 선반 납품` 주문으로 이어졌다. 다음 vertical slice는 선반 납품 완료가 단순 완료 row에서 끝나지 않고, 오프라인 복귀 보상에 `온실 선반 보관` 보너스로 남게 만든다. 경쟁작 기준 production idle loop에서 시설은 생산량뿐 아니라 돌아왔을 때의 보상 기대를 키워야 한다.

## Game Studio route

- `game-studio:game-studio`: 온실 주문 완료 -> 오프라인 복귀 보너스 -> 다음 씨앗 행동 vertical slice.
- `game-studio:web-game-foundations`: order completion state를 offline reward 계산에 안전하게 연결한다.
- `game-studio:game-ui-frontend`: comeback modal에 guardian bonus와 시설 bonus가 함께 있어도 모바일 화면과 CTA가 가려지지 않게 한다.
- `game-studio:game-playtest`: Browser Use와 visual test로 offline comeback modal을 확인한다.

## Vertical slice scoring

- `player verb`: 온실 선반 납품을 완료한 뒤 게임을 나갔다 돌아와 보관 보너스를 확인한다.
- `production/progression role`: 시설 주문 완료가 오프라인 보상 multiplier로 돌아온다.
- `screen moment`: 복귀 modal에 `온실 선반 보관 +10%`가 보인다.
- `asset/FX`: 신규 asset 없음. 기존 복귀 modal surface를 확장한다.
- `playtest evidence`: Browser Use `iab`, focused visual, full visual, CI.

## Plan

1. `OfflineRewardResult`에 시설 보관 보너스 percent/label을 추가한다.
2. `calculateOfflineReward`가 `order_greenhouse_shelf_001` 완료 시 오프라인 잎 보상에 +10%를 곱하게 한다.
3. 복귀 modal에 guardian bonus와 별개로 `온실 선반 보관` bonus row를 노출한다.
4. QA save flag로 온실 선반 완료 상태의 60분 복귀 경로를 만들고 visual regression을 추가한다.
5. Browser Use evidence와 roadmap/dashboard/GitHub evidence를 갱신한다.

## Acceptance

- [x] 온실 선반 납품 완료 save에서 60분 복귀 보상이 기본/수호자 보상보다 높게 계산된다.
- [x] 복귀 modal에 `온실 선반 보관 +10%`가 보인다.
- [x] guardian bonus와 shelf bonus가 함께 있어도 393px 모바일에서 CTA와 summary가 가려지지 않는다.
- [x] Browser Use `iab`, focused visual, full visual, CI가 통과한다.

## Evidence

- Browser Use `iab`: `reports/visual/p0-greenhouse-shelf-offline-bonus-browser-use-20260430.png`
- Visual report: `reports/visual/p0-greenhouse-shelf-offline-bonus-v0-20260430.md`
- Focused visual: `npm run check:visual -- --grep "온실 선반 보관"` PASS
- Full visual: `npm run check:visual` PASS, 36 passed
- CI: `npm run check:ci` PASS
- PR checks: #207 PASS (`Check automerge eligibility`, `Verify game baseline`)
- Merge: PR #207 squash-merged to `main`
- Main CI: `25152516010` PASS

## Risks

- 기존 offline reward 숫자 테스트가 깨질 수 있다. 새 QA flag가 없는 기존 경로는 기존 숫자를 유지한다.
- 복귀 modal 밀도가 다시 높아질 수 있다. bonus row를 compact하게 유지하고 overflow gate를 추가한다.
