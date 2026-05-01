# Lunar guardian order bridge v0

## 요약

`달방울 누누`가 수확 reveal과 production roster에 합류한 뒤, 그 역할이 바로 다음 주문/납품/보상으로 이어지게 합니다.

## Small win

플레이어가 `달방울 누누`를 얻은 뒤 "이 아이가 밤 온실을 지키며 달빛 주문을 채운다"는 다음 행동을 order crate/reward motion으로 확인합니다.

## Plan-first evidence

- Plan artifact: `items/0137-lunar-guardian-order-bridge-v0.md`
- Campaign source of truth: `P0.5 Idle Core + Creative Rescue`
- Previous slice: `items/0132-lunar-harvest-creature-payoff-v0.md`
- Strategic Jump Check / Title Contract retrospective: `reports/operations/seed-ops-issue-pr-title-retrospective-20260502.md`

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:game-ui-frontend`, `game-studio:game-playtest`, `game-studio:sprite-pipeline`
- 적용 기준: playfield/order crate state, reward motion, Browser Use mobile evidence

## 사용자/운영자 가치

- 게임 가치: lunar creature discovery가 roster badge에서 끝나지 않고 production -> order -> reward loop로 이어집니다.
- 운영사 가치: open issue가 없는 상태에서도 seed-ops가 CI 관찰 루프에 머무르지 않고 campaign source of truth에서 다음 vertical slice를 plan-first로 생성합니다.

## Acceptance Criteria

- [x] After `달방울 누누` is discovered, the player sees a lunar-specific order/progression target rather than only a roster badge.
- [x] The lunar order bridge includes at least one concrete visual/game-feel payoff from `playfield state`, `HUD affordance`, `sprite/FX`, `order crate visual state`, or `reward motion`.
- [x] New accepted game asset or FX provenance is recorded if a new asset is introduced; existing asset reuse alone is explicitly insufficient. N/A - v0 reuses accepted lunar FX strip and adds CSS/runtime order-crate state, no new accepted manifest asset.
- [x] Browser Use evidence shows post-harvest order state and delivery/reward state on mobile.
- [x] UI visual QA confirms no body scroll, bottom-tab overlap, hidden child overflow, or production/order card clipping.
- [x] No runtime image generation, real payment, login, external deployment, customer data, or real GTM action is introduced.

## Visual QA finding

- User-reported blocker: `qaLunarOrderReady=1&qaFxTelemetry=1`에서 `다음 행동` production card의 `달방울 누누` 아래 payoff 영역이 잘려 보였다.
- Second reproduction: roster collapse alone was insufficient. The completed lunar order row still squeezed title/reward/payoff text into an overflow-hidden row.
- Fix contract: DOM text presence is insufficient; completed lunar order QA must check row overflow style, title/payoff bounds, hidden reward-line display, `scrollHeight/clientHeight`, and visible child overflow.
- Browser Use evidence:
  - `reports/visual/lunar-guardian-order-bridge-browser-use-post-harvest-20260502.png`
  - `reports/visual/lunar-guardian-order-current-delivered-browser-use-20260502.png`
  - `reports/visual/lunar-guardian-order-delivered-no-clipping-browser-use-20260502.png`
  - `reports/visual/lunar-guardian-user-defect-delivered-browser-use-20260502.png`
  - `reports/visual/lunar-guardian-order-fixed-browser-use-20260502.png`

## Issue/PR title retrospective

- Checked 114 issues and 156 PRs through `gh`.
- Pattern found: 12 issue titles use bridge/link wording, 52 issue titles use `v0/P0/P0.5`, 27 issue titles are ops/gate/closeout-shaped, and 25 PR titles contain closeout/evidence/main-CI wording.
- Conclusion: the loop drifted toward adjacent implementation fragments and evidence-backfill titles.
- Harness correction: `$seed-ops` and `docs/PROJECT_COMMANDS.md` now require `Strategic Jump Check` and `Title Contract`; `scripts/check-seed-ops-queue-gate.mjs` guards those phrases.

## 검증 계획

- `npm run check:content` - pass
- `npm run check:loop` - pass
- `npm run build` - pass
- `npm run check:visual -- --grep "달빛 보호"` - pass after second clipping fix
- `npm run check:visual -- --grep "달빛"` - pass, 7 tests
- `npm run check:asset-provenance` - pass
- `npm run check:asset-style` - pass
- `npm run check:asset-alpha` - pass
- `npm run check:seed-ops-queue` - pass
- `npm run check:ci` - pass after heartbeat branch/next_action refresh

## 안전 범위

- 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음
- Branch protection 우회 없음
- PR merge/close 이후 main-targeted closeout commit/PR 금지. all merge-blocking evidence must be in the original PR before merge/close.
