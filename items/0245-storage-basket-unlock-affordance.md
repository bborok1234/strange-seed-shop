# 0245 Storage basket unlock affordance

## Problem

#455 ends at `2번째 주문 납품 완료 · 보관 바구니 준비`, but `facility_storage` is still locked and has no player action. v1 needs the next bottleneck decision to appear in the board, even before a dedicated storage raster batch lands.

## Goal

After two deliveries, let the player select `보관 바구니`, spend leaves, unlock the storage slot, and see a clear storage/offline-cap affordance in the HUD and receipts.

## Reference Teardown

- Egg, Inc. and Idle Miner expose the next bottleneck immediately after production/order growth.
- AdVenture Capitalist keeps upgrades lightweight but makes the next multiplier/cap decision visible at the moment the player can afford it.
- Rejected alternative: generate a new storage basket asset inside this issue. Current v1 blocker is the unlock/action affordance; dedicated storage raster art should be a follow-up asset WorkUnit with provenance.

## Creative Brief

The player should read `보관 바구니` as the next operational upgrade after repeat delivery. The visual/game-feel payoff is an on-board storage slot changing from locked preview to selected/unlocked facility, with `정리 80잎` and storage-cap receipt.

## Game Studio Route

- `game-studio:game-studio`: storage bottleneck WorkUnit selection
- `game-studio:phaser-2d-game`: storage unlock state/action and smoke path
- `game-studio:game-ui-frontend`: action rail affordance and receipt copy
- `game-studio:game-playtest`: second delivery -> storage unlock screenshot evidence

## Game Studio Department Signoff

- 기획팀: player verb is `보관 바구니 정리`; production role is next bottleneck after order.
- 리서치팀: competitive gap is immediate post-order cap upgrade visibility.
- 아트팀: uses existing generated facility raster as temporary runtime visual; dedicated storage asset is follow-up.
- 개발팀: narrow state/action/verifier change, no persistence migration.
- 검수팀: `check:phaser` asserts storage slot unlocked, leaves spent, screenshot evidence.
- 마케팅팀: no real channel/payment promise.
- 고객지원팀: reduces confusion after `보관 바구니 준비` objective.

## Department Scorecard

| 부서 | 판정 | 근거 artifact |
| --- | --- | --- |
| 기획팀 | approve | Order loop now hands off to storage bottleneck. |
| 리서치팀 | approve | Idle references show cap upgrade right after throughput growth. |
| 아트팀 | approve | No new accepted asset; follow-up storage raster remains explicit. |
| 개발팀 | approve | Storage slot/action is already modeled in Phaser state. |
| 검수팀 | approve | Smoke path can extend to storage unlock. |
| 마케팅팀 | approve | Local mock gameplay only. |
| 고객지원팀 | approve | Objective and action copy align. |

## Subagent/Team Routing

Solo execute. The change is a small state/action extension and verifier update; no independent subtask is needed.

## QA / Playtest Plan

1. Run `npm run check:phaser`.
2. Verify screenshots under `reports/visual/issue-0457-storage-basket-unlock-affordance/`.
3. Run `npm run check:ci`.
4. Record Browser Use blocker if `iab` is still unavailable.

## Plan

1. Create GitHub issue and plan evidence.
2. Add storage unlock cost/action after second delivery.
3. Update Phaser action rail and test surfaces for storage state.
4. Extend smoke path through storage unlock.
5. Update visual report, roadmap, dashboard, control room, heartbeat, issue comment, and PR.

## Acceptance Criteria

- After two deliveries, selecting `보관 바구니` offers `정리 80잎`.
- Unlocking storage spends leaves and marks `facility_storage` unlocked/active.
- HUD/objective/receipt show storage/offline-cap payoff.
- Screenshot evidence shows storage selected after unlock.
- Runtime image generation/API/cache remains disabled.
- `npm run check:phaser` and `npm run check:ci` pass.

## Verification Commands

- `npm run check:phaser`
- `npm run check:ci`

## Browser Use

Browser Use `iab`가 노출되면 second delivery -> storage unlock을 직접 확인한다. 노출되지 않으면 현재 세션 blocker와 Playwright fallback screenshot evidence를 남긴다.

## GitHub

- Issue: https://github.com/bborok1234/strange-seed-shop/issues/457
- Draft PR: https://github.com/bborok1234/strange-seed-shop/pull/458

## Evidence

- `npm run check:phaser` pass
- `npm run check:ci` pass
- `reports/visual/issue-0457-storage-basket-unlock-affordance/phaser-check-storage-ready-393.png`
- `reports/visual/issue-0457-storage-basket-unlock-affordance/phaser-check-storage-unlocked-393.png`
- `reports/visual/issue-0457-storage-basket-unlock-affordance/visual-report-20260508.md`
