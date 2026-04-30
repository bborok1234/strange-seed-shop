# Greenhouse storage upgrade v0

Status: done
Branch: `codex/0113-greenhouse-storage-upgrade-v0`
Issue: #212
PR: #213

## Context

#203-#209에서 온실 선반 납품, 오프라인 보관 보너스, playfield 상태까지 연결했다. 하지만 선반 납품 보상으로 받은 `재료 1`은 아직 다음 온실 성장 선택으로 다시 쓰이지 않는다. 다음 vertical slice는 선반 납품 완료 후 `선반 정리` 강화를 열어, 재료를 소비하면 오프라인 보관 보너스가 +10%에서 +20%로 올라가게 만든다.

## Game Studio route

- `game-studio:game-studio`: 선반 납품 보상 재료 -> 선반 정리 강화 -> 다음 복귀 보너스 성장 vertical slice.
- `game-studio:web-game-foundations`: save progression에 `greenhouseStorageLevel`을 추가하고 기존 save normalization을 보존한다.
- `game-studio:game-ui-frontend`: upgrade choice surface가 새 온실 선택지를 보여도 모바일 action surface와 bottom tabs를 가리지 않는다.
- `game-studio:game-playtest`: Browser Use와 visual test로 강화 클릭, playfield label, 복귀 보상 숫자를 확인한다.

## Vertical slice scoring

- `player verb`: 선반 납품 보상으로 받은 재료를 써서 선반 정리를 강화한다.
- `production/progression role`: 온실 시설이 오프라인 보관 보너스를 더 키우는 upgrade path가 된다.
- `screen moment`: 정원 성장 선택에 `선반 정리`, playfield에 `선반 보관 +20%`가 보인다.
- `asset/FX`: 신규 asset 없음. 기존 order crate / upgrade choice surface 재사용.
- `playtest evidence`: Browser Use `iab`, focused visual, full visual, CI.

## Plan

1. `PlayerSave`와 persistence normalization에 `greenhouseStorageLevel`을 추가한다.
2. `선반 정리` upgrade choice를 온실 선반 납품 완료 후 열고, 재료 1개를 소비해 level 1로 올린다.
3. 오프라인 선반 보너스를 기본 +10%, 선반 정리 완료 시 +20%로 계산한다.
4. `qaGreenhouseStorage=1` 경로와 visual regression으로 복귀 보상 105 잎, playfield +20%, 강화 클릭 상태를 검증한다.
5. Browser Use evidence와 roadmap/dashboard/GitHub evidence를 갱신한다.

## Acceptance

- [x] 온실 선반 납품 완료 뒤 `선반 정리` 성장 선택이 보이고 재료 1개로 강화할 수 있다.
- [x] 강화 후 save의 `greenhouseStorageLevel`이 1이 되고 playfield에 `선반 보관 +20%`가 보인다.
- [x] `qaGreenhouseStorage=1` 60분 복귀 경로에서 보관 보상 +20%와 105 잎 보상이 보인다.
- [x] 모바일 393px에서 playfield, action surface, bottom tabs가 서로 가리지 않는다.
- [x] Browser Use `iab`, focused visual, full visual, CI가 통과한다.

## Evidence

- Browser Use `iab`: `reports/visual/p0-greenhouse-storage-upgrade-browser-use-20260430.png`
- Visual report: `reports/visual/p0-greenhouse-storage-upgrade-v0-20260430.md`
- Focused visual: `npm run check:visual -- --grep "선반 정리 강화"` PASS
- Regression fix visual: `npm run check:visual -- --grep "온실 설비는 새 납품 주문"` PASS
- Full visual: `npm run check:visual` PASS, 38 passed
- CI: `npm run check:ci` PASS
- PR checks: #213 PASS (`Check automerge eligibility`, `Verify game baseline`)
- Merge: PR #213 squash-merged to `main`
- Main CI: `25154623494` PASS

## Risks

- 성장 선택 카드가 늘어나 action surface가 다시 높아질 수 있다. 이번 구현에서 온실 완료 production card overflow 회귀가 한 번 잡혔고, 완료 카드 보조 설명을 접어 full visual gate를 다시 통과했다.
