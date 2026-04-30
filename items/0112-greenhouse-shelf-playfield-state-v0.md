# Greenhouse shelf playfield state v0

Status: done
Branch: `codex/0112-greenhouse-shelf-playfield-state-v0`
Issue: #209
PR: #210

## Context

#206에서 온실 선반 납품 완료가 오프라인 복귀 보상 `온실 선반 보관 +10%`로 이어졌다. 다음 vertical slice는 복귀 modal을 닫고 정원으로 돌아왔을 때도 선반이 production engine 안에 남아 보이게 만든다. 플레이어가 받은 보너스가 일회성 modal 문구가 아니라 정원 playfield의 시설 상태로 읽혀야 한다.

## Game Studio route

- `game-studio:game-studio`: 복귀 보너스 -> 정원 playfield facility state -> 다음 생산 확인 vertical slice.
- `game-studio:web-game-foundations`: completed order state를 playfield view model에 안전하게 노출한다.
- `game-studio:game-ui-frontend`: playfield production lane의 order crate가 모바일 첫 화면을 밀지 않게 compact 상태를 유지한다.
- `game-studio:game-playtest`: Browser Use와 visual test로 comeback modal dismiss 후 정원 화면을 확인한다.

## Vertical slice scoring

- `player verb`: 복귀 보상을 확인한 뒤 정원으로 돌아와 선반 보관 상태를 본다.
- `production/progression role`: 온실 선반 완료 상태가 오프라인 보상과 playfield 생산 장면에 함께 남는다.
- `screen moment`: playfield order crate에 `선반 보관 +10%`가 보인다.
- `asset/FX`: 기존 order crate asset 재사용. 신규 asset 없음.
- `playtest evidence`: Browser Use `iab`, focused visual, full visual, CI.

## Plan

1. `GardenPlayfieldViewModel.productionScene`에 optional storage/시설 상태 label을 추가한다.
2. 온실 선반 주문 완료 상태이면 order crate status를 `온실 선반 보관 +10%`로 표시한다.
3. `qaOfflineMinutes=60&qaLunarGuardian=1&qaGreenhouseShelf=1` 경로에서 복귀 modal 닫기 후 playfield 상태 visual regression을 추가한다.
4. Browser Use evidence와 roadmap/dashboard/GitHub evidence를 갱신한다.

## Acceptance

- [x] 온실 선반 완료 save에서 복귀 modal을 닫으면 playfield production lane에 `선반 보관 +10%`가 보인다.
- [x] order crate는 `온실 선반 납품 완료`와 storage label을 함께 전달한다.
- [x] 모바일 393px에서 playfield, action surface, bottom tabs가 서로 가리지 않는다.
- [x] Browser Use `iab`, focused visual, full visual, CI가 통과한다.

## Evidence

- Browser Use `iab`: `reports/visual/p0-greenhouse-shelf-playfield-state-browser-use-20260430.png`
- Visual report: `reports/visual/p0-greenhouse-shelf-playfield-state-v0-20260430.md`
- Focused visual: `npm run check:visual -- --grep "선반 보관 상태"` PASS
- Full visual: `npm run check:visual` PASS, 37 passed
- CI: `npm run check:ci` PASS
- PR checks: #210 PASS (`Check automerge eligibility`, `Verify game baseline`)
- Merge: PR #210 squash-merged to `main`
- Main CI: `25153332087` PASS

## Risks

- playfield production lane이 이미 밀도가 높다. 새 줄을 추가하지 않고 완료 상태 문구를 `선반 보관 +10%` compact label로 바꿔 유지한다.
