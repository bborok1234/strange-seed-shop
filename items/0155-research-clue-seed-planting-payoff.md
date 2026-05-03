# WorkUnit #306 — 연구 단서 씨앗 구매가 도감 목표 심기 payoff로 이어지게 만든다

- GitHub issue: #306 https://github.com/bborok1234/strange-seed-shop/issues/306
- Campaign source of truth: P0.5 Idle Core + Creative Rescue
- Status: verification-ready
- Branch: `codex/0306-research-clue-seed-planting-payoff`
- Created: 2026-05-03

## Plan

1. 현재 `qaResearchComplete=1` 씨앗 탭 목표 row, 씨앗 구매, 정원 복귀/심기 흐름을 매핑한다.
2. 연구 단서 목표 씨앗 구매 또는 심기 직후 `연구 단서 씨앗` receipt, playfield actor/order state, next creature card/seed CTA 강조를 DOM/CSS reward motion으로 구현한다.
3. 393px 모바일에서 목표 씨앗 row, receipt/playfield state, bottom-tab overlap, action-surface overflow를 검증하는 focused Playwright assertion과 screenshot을 추가한다.
4. Browser Use iab를 현재 세션에서 먼저 시도하고, 실패 시 #306 전용 blocker를 `reports/visual/`에 남긴다.
5. 검증 evidence를 item/roadmap/GitHub body/GateEvent에 반영하고 PR checks/merge/main CI까지 진행한다.

## 수용 기준

- [x] 연구 완료 후 목표 씨앗 row에서 구매/심기 player verb가 명확하다.
- [x] 목표 씨앗 구매 또는 심기 직후 `연구 단서 씨앗` reward motion/HUD affordance가 visible하다.
- [x] garden playfield가 연구 단서 씨앗 심기/준비 state를 보여준다.
- [x] 신규 manifest asset 없이 DOM/CSS reward motion으로 구현하고 runtime image generation/API를 호출하지 않는다.
- [x] 393px 모바일에서 receipt/CTA가 bottom tab과 겹치지 않고 action surface overflow를 만들지 않는다.
- [x] focused Playwright screenshot, `npm run check:visual`, `npm run check:ci`가 통과한다.

## 검증 명령

- `npm run build`
- `npx playwright test --config playwright.config.ts --grep "연구 단서 씨앗"`
- `npm run check:visual`
- `npm run check:ci`
- `npm run update:dashboard`
- `npm run operator:control-room -- --output docs/OPERATOR_CONTROL_ROOM.md`
- `npm run check:dashboard`
- `npm run check:control-room`
- `npm run check:ops-live`
- `npm run check:github-metadata`
- `npm run check:seed-ops-queue`
- `npm run check:closed-workunit-mirrors`

## 리스크

- 목표 씨앗 구매/심기 CTA가 garden/seeds/comeback surface에 흩어져 있어 좁은 scope를 유지해야 한다.
- 연구 단서 receipt와 기존 seed purchase/planting feedback이 겹치면 모바일 overflow가 발생할 수 있다.
- Browser Use iab backend는 이번 세션에서 반복 실패했다. 그래도 #306에서 새로 시도하고 blocker/evidence를 남긴다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist: `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- Sprite/asset route: 신규 accepted manifest asset 없음. DOM/CSS reward motion과 HUD affordance로 제한한다. 새 sprite/FX가 필요하면 별도 `game-studio:sprite-pipeline` + asset skills WorkUnit으로 분리한다.

## Studio Campaign Gate

- Player verb: `연구 단서 목표 씨앗 구매/심기`
- Production/progression role: 연구 메타 보상 → 씨앗 구매/심기 → 다음 생명체 수집 루프
- Screen moment: `qaResearchComplete=1` 이후 씨앗 탭 목표 row 또는 정원 seed shop에서 목표 씨앗을 구매/심기하는 순간
- Concrete visual/game-feel payoff: `연구 단서 씨앗` receipt, playfield seed clue state, next creature/seed CTA glow, reward motion
- Competition production gap: Cell to Singularity식 연구 unlock은 다음 node action으로 즉시 이어지고, Egg/Idle Miner식 구매/업그레이드는 결과가 화면에 남는다. 현재는 연구 단서가 수집 행동으로 닫히는 payoff가 약하다.
- Playtest evidence: Browser Use iab 우선, blocker 시 Playwright screenshot + layout invariant.

## Game Studio Department Signoff

- 기획팀: 연구 완료가 실제 씨앗 구매/심기로 닫혀 “하나만 더” 수집 욕구를 강화한다.
- 리서치팀: 경쟁작은 메타 unlock 이후 다음 node/action을 시각적으로 연결한다. 단서 표시만 하고 행동 payoff가 없는 대안은 reject한다.
- 아트팀: 신규 manifest asset 없이 note/seed tag DOM motion으로 제한한다. 새 asset 요구는 별도 provenance gate로 분리한다.
- 개발팀: `src/App.tsx`, `src/styles.css`, `tests/visual/p0-mobile-game-shell.spec.ts` 중심의 좁은 tranche.
- 검수팀: Browser Use iab current-session 시도, 393px screenshot, overflow/bottom-tab invariant 필수.
- 마케팅팀: mock-only promise. 외부 채널/실결제 없음.
- 고객지원팀: “연구 단서를 보고 뭘 해야 하는지 모르겠다”를 목표 씨앗 payoff로 줄인다.

## Reference teardown / rejected alternative

- Reference: Cell to Singularity의 연구 node 완료는 다음 node 구매/진행으로 화면 흐름이 이어진다.
- Reference: Egg/Idle Miner류의 upgrade purchase는 숫자/상태/motion으로 즉시 결과가 남는다.
- Rejected: 씨앗 탭 copy만 바꾸기 — production payoff와 player verb 결과가 부족하다.
- Rejected: 신규 asset batch 즉시 생성 — 현재 목표는 gameplay chain payoff이며 asset provenance는 별도 WorkUnit 규모다.

## Subagent/Team Routing

- 현재는 단일 React/CSS/visual regression tranche이므로 native subagent/team은 사용하지 않는다.
- 필요 시 분리 기준: asset generation이 필요해지면 asset pipeline subtask, Browser Use 복구가 필요하면 QA/verifier subtask로 분리한다.

## 구현 evidence

- `src/App.tsx`: `ResearchSeedReceipt` state를 추가하고 연구 단서 목표 씨앗 구매/심기 후 receipt, telemetry `research_clue_seed_*`, playfield `도감 목표 심기`/`연구 단서` state를 연결했다.
- `src/styles.css`: 신규 manifest asset 없이 CSS/DOM seed tag reward motion, next creature compact glow, 393px overflow 방지 규칙을 추가했다.
- `tests/visual/p0-mobile-game-shell.spec.ts`: 연구 단서 목표 씨앗 구매/심기, playfield state, next creature CTA, bottom-tab invariant, lunar seed regression을 검증한다.

## QA/playtest evidence

- Browser Use blocker: `reports/visual/browser-use-blocker-0306-20260503.md`
- Playwright screenshot: `reports/visual/issue-306-research-clue-seed-planting-payoff-393.png`
- `npm run build` → pass
- `npx playwright test --config playwright.config.ts --grep "연구 단서 씨앗"` → 1 passed
- `npx playwright test --config playwright.config.ts --grep "연구 단서 씨앗|달빛 씨앗은 구매와 심기"` → 2 passed
- `npm run check:visual` → 56 passed
- `npm run check:ci` → pass
