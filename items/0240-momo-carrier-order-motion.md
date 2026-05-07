# 0240 Momo carrier and order crate motion

## Problem

#446 normalized and preloaded Momo actor and harvest/care FX strips, but runtime still uses only Pori. The order crate receives progress numerically after workbench claim, yet no carrier actor or order reward motion makes the production chain visible. v1 needs the second actor/facility relationship to read without text.

## Goal

Connect normalized Momo carrier strip to the Phaser board after the first workbench claim and make order crate progress visibly move from workbench/plot toward crate.

## Game Studio Route

- `game-studio:game-studio`: #446 이후 production chain motion WorkUnit 선택
- `game-studio:phaser-2d-game`: actor task path, spritesheet selection, order crate state rendering
- `game-studio:sprite-pipeline`: Momo normalized strip runtime binding
- `game-studio:game-playtest`: workbench claim screenshot and smoke evidence

## Department Scorecard

| 부서 | 판정 | 근거 artifact |
| --- | --- | --- |
| 기획팀 | approve | workbench -> order crate progression이 보여야 production loop가 단순 수확에서 상회 운영으로 확장된다. |
| 리서치팀 | approve | idle/tycoon benchmark는 worker가 생산 node 사이를 움직이며 bottleneck을 설명한다. |
| 아트팀 | approve | #446에서 Momo carrier strip이 normalized source로 준비됐다. |
| 개발팀 | approve | Phaser state/actor rendering만 확장하고 runtime API 호출은 없다. |
| 검수팀 | approve | `check:phaser`가 Momo texture key와 order crate progress screenshot을 확인한다. |
| 마케팅팀 | approve | 외부 채널/실결제/광고 없음. |
| 고객지원팀 | approve | 주문 상자 진행이 보이면 다음 목표 혼란이 줄어든다. |

## Self-Evaluation Loop

Claim: first workbench claim creates a visible Momo carrier task/order motion without breaking plant-care-harvest flow.

Smallest verifier:

- state has Momo actor after claim
- Phaser loads and renders Momo strip
- `npm run check:phaser`
- screenshot after claim shows order crate progress state

## Plan

1. GitHub issue를 생성한다.
2. `claimWorkbenchProduction`이 Momo carrier actor를 추가하고 order crate task를 명확히 남기게 한다.
3. Phaser actor renderer가 role별 spritesheet/animation을 사용한다.
4. Order crate progress/fill feedback을 generated FX로 보강한다.
5. `check:phaser` evidence와 visual report를 갱신한다.

## Acceptance Criteria

- First workbench claim 후 Momo carrier actor가 runtime state/render에 나타난다.
- Pori and Momo use distinct generated strips.
- Order crate progress visual changes after claim.
- `npm run check:phaser` and `npm run check:ci` pass.

## Verification Commands

- `npm run check:phaser`
- `npm run check:ci`

## Browser Use

Browser Use `iab`가 노출되면 workbench claim 후 Momo/order crate motion을 직접 확인한다. 노출되지 않으면 Playwright fallback screenshot evidence를 남긴다.

## GitHub

- Issue: https://github.com/bborok1234/strange-seed-shop/issues/448
- Draft PR: https://github.com/bborok1234/strange-seed-shop/pull/449

## Evidence

- `npm run check:phaser` pass
- `npm run check:ci` pass
- Visual report: `reports/visual/issue-0448-momo-carrier-order-motion/visual-report-20260508.md`
- Screenshots:
  - `reports/visual/issue-0448-momo-carrier-order-motion/phaser-check-workbench-claim-393.png`
- Runtime evidence after workbench claim:
  - actors: `actor_pori`, `actor_momo`
  - order crate progress: `25`
  - receipt includes `모모 운반 시작`
  - leaves: `20`, starter seeds: `0`
- Browser Use `iab` is not exposed in this Codex CLI session; Playwright fallback evidence is recorded in the visual report.
