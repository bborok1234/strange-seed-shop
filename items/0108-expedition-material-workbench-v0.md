# Expedition material workbench v0

Status: done
Branch: `codex/0108-expedition-material-workbench-v0`
Issue: #197
PR: #198
Main CI: `25149499763`

## Context

P0.5는 연구/원정/달빛 보상까지 이어졌고, 원정 보상은 이미 `재료`를 지급한다. 하지만 재료는 HUD 숫자로만 남고, 첫 5분 production idle loop 안에서 “원정을 다녀오면 정원이 더 좋아진다”는 사용처가 약하다. 다음 vertical slice는 원정 보상 재료를 정원 작업대 강화로 연결해, 원정이 단순 보상 수령이 아니라 생산 엔진 확장으로 읽히게 만든다.

## Game Studio route

- `game-studio:game-studio`: 원정 보상 -> 재료 사용 -> 정원 생산 보강으로 이어지는 vertical slice.
- `game-studio:web-game-foundations`: saveable progression field를 추가하되 simulation/render/UI boundary를 유지한다.
- `game-studio:game-ui-frontend`: 모바일 정원 action surface와 원정 탭에 compact material workbench surface를 둔다.
- `game-studio:game-playtest`: Browser Use와 visual test로 재료 보상 수령, 작업대 강화, HUD/카드 overflow를 확인한다.

## Vertical slice scoring

- `player verb`: 원정에서 재료를 받아 정원 작업대를 강화한다.
- `production/progression role`: 원정 보상이 생산 엔진/주문 준비 루프의 다음 성장 선택으로 연결된다.
- `screen moment`: 원정 완료 후 보상 수령 화면과 정원 다음 성장 선택에서 `재료` 사용처가 보인다.
- `asset/FX`: 기존 재료 HUD, order crate/workbench copy, reward pulse를 재사용한다. 신규 asset 생성 없음.
- `playtest evidence`: Browser Use `iab`, focused visual, full visual, CI.

## Plan

1. `PlayerSave`에 material workbench progression을 추가하고 기존 save migration 기본값을 유지한다.
2. 원정 보상으로 재료를 받은 상태에서 정원 action surface에 `작업대 강화` 선택지를 추가한다.
3. 작업대 강화가 생산/주문 progression 중 하나에 작지만 실제적인 효과를 주게 한다.
4. 원정 탭/정원 탭에서 재료 수령 -> 사용처 -> 강화 완료가 한 화면 흐름으로 읽히게 한다.
5. `qaResearchExpeditionClaimReady=1` 또는 새 QA state로 material workbench visual regression을 추가한다.
6. Browser Use evidence, visual report, roadmap/dashboard/GitHub evidence를 갱신한다.

## Acceptance

- [x] 원정 보상 수령 후 HUD 재료가 증가하고, 정원 action surface에 재료 사용처가 보인다.
- [x] `작업대 강화`가 재료를 소모하고 save에 완료 상태를 남긴다.
- [x] 강화 완료 후 생산/주문 progression에 실제 효과가 화면 copy와 숫자로 보인다.
- [x] 모바일 393px에서 원정/정원 탭이 body scroll, bottom tab overlap, card overflow 없이 유지된다.
- [x] Browser Use `iab`, focused visual, full visual, CI가 통과한다.

## Evidence

- Browser Use `iab`: `reports/visual/p0-expedition-material-workbench-browser-use-20260430.png`
- Visual report: `reports/visual/p0-expedition-material-workbench-v0-20260430.md`
- Focused visual: `npm run check:visual -- --grep "작업대"` PASS
- Regression visual: `npm run check:visual -- --grep "생산 roster|작업대|복귀 성장 100"` PASS
- Full visual: `npm run check:visual` PASS, 33 passed
- CI: `npm run check:ci` PASS
- PR checks: PR #198 `Verify game baseline` PASS, `Check automerge eligibility` PASS
- Merge: PR #198 squash merge `3c718a9e63e81700638c9bb9e40efa0c971f5887`
- Main CI: `25149499763` PASS

## Risks

- 새 progression field가 기존 save migration을 깨뜨릴 수 있다. persistence fallback과 QA fixture를 함께 갱신한다.
- action surface가 다시 과밀해질 수 있다. 완료/미완료 상태별 compact copy와 overflow assertion을 visual test에 넣는다.
