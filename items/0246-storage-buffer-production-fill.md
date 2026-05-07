# 0246 Storage buffer production fill

## Problem

#457 unlocks `보관 바구니` and raises storage capacity to 24, but nothing fills the storage buffer yet. v1 needs the storage upgrade to affect the next production claim so the player sees why offline/storage cap matters.

## Goal

After storage unlock, a workbench claim adds a small amount to `오프라인 보관 n/24`, and selecting storage shows the stored amount.

## Reference Teardown

- Idle Miner and Egg, Inc. make storage/cap upgrades visible through a filling buffer, not just a purchased label.
- AdVenture Capitalist shows repeated claim output immediately after a capacity upgrade.
- Rejected alternative: full offline comeback simulation now. The narrow blocker is first storage fill feedback; comeback reward can follow after the buffer exists.

## Creative Brief

The storage basket should begin acting like a buffer right after unlock. The smallest payoff is `포리 작업 수령` also adding `보관 +4/24`, then selecting `보관 바구니` reads `오프라인 보관 4/24`.

## Game Studio Route

- `game-studio:game-studio`: storage cap follow-up WorkUnit selection
- `game-studio:phaser-2d-game`: storage buffer state and workbench claim branch
- `game-studio:game-ui-frontend`: HUD/action rail stored amount affordance
- `game-studio:game-playtest`: storage unlock -> workbench claim -> storage buffer screenshot evidence

## Department Scorecard

| 부서 | 판정 | 근거 artifact |
| --- | --- | --- |
| 기획팀 | approve | Storage unlock now affects the next production verb. |
| 리서치팀 | approve | Idle cap upgrades need visible stored amount feedback. |
| 아트팀 | approve | Uses existing generated facility raster and HUD text; no new accepted asset. |
| 개발팀 | approve | Adds narrow `storedLeaves` state and verifier branch. |
| 검수팀 | approve | `check:phaser` can assert `storedLeaves: 4`. |
| 마케팅팀 | approve | Mock/local gameplay only. |
| 고객지원팀 | approve | Explains what storage actually does. |

## Subagent/Team Routing

Solo execute. The change is bounded to Phaser state/action rail and the existing smoke verifier.

## QA / Playtest Plan

1. Run `npm run check:phaser`.
2. Verify screenshots under `reports/visual/issue-0459-storage-buffer-production-fill/`.
3. Run `npm run check:ci`.
4. Record Browser Use blocker if `iab` is still unavailable.

## Plan

1. Create GitHub issue and plan evidence.
2. Add `storedLeaves` to Phaser state.
3. Workbench claim fills storage when storage is unlocked.
4. Storage selected HUD/action rail shows stored amount.
5. Extend smoke path through storage fill and update evidence.

## Acceptance Criteria

- After storage unlock, a workbench claim adds stored leaves without exceeding capacity.
- Selecting `보관 바구니` shows `오프라인 보관 4/24`.
- Screenshot evidence shows storage buffer after claim.
- Runtime image generation/API/cache remains disabled.
- `npm run check:phaser` and `npm run check:ci` pass.

## Verification Commands

- `npm run check:phaser`
- `npm run check:ci`

## Browser Use

Browser Use `iab`가 노출되면 storage unlock -> workbench claim -> storage selected를 직접 확인한다. 노출되지 않으면 현재 세션 blocker와 Playwright fallback screenshot evidence를 남긴다.

## GitHub

- Issue: https://github.com/bborok1234/strange-seed-shop/issues/459
- Draft PR: https://github.com/bborok1234/strange-seed-shop/pull/460

## Evidence

- `npm run check:phaser` pass
- `npm run check:ci` pass
- `reports/visual/issue-0459-storage-buffer-production-fill/phaser-check-storage-fill-claim-393.png`
- `reports/visual/issue-0459-storage-buffer-production-fill/phaser-check-storage-buffer-393.png`
- `reports/visual/issue-0459-storage-buffer-production-fill/visual-report-20260508.md`
