# WorkUnit #328 — 포장잎 상인 수확을 주문상자 payoff로 닫는다

- GitHub issue: #328 https://github.com/bborok1234/strange-seed-shop/issues/328
- Campaign source of truth: P0.5 Idle Core + Creative Rescue
- Status: planned
- Branch: `codex/0328-merchant-harvest-crate-payoff`
- Created: 2026-05-03

## Plan

1. #326 flow 이후 `젤리콩 씨앗 → 포장잎 상인` target row에서 구매/심기/성장/수확이 현재 어떤 reveal/receipt를 내는지 매핑한다.
2. 수확 reveal이 `포장잎 상인`을 명확히 보여주고 record-loop source를 설명하도록 state/copy/HUD affordance gap을 고친다.
3. 포장잎 상인이 “상인”으로 읽히는 order crate visual state와 reward motion/다음 행동을 DOM/CSS/기존 portrait로 추가한다. 신규 accepted manifest asset/runtime image generation은 쓰지 않는다.
4. Browser Use iab를 현재 세션에서 먼저 시도하고, 실패 시 #328 전용 blocker를 `reports/visual/`에 남긴다.
5. focused Playwright screenshot과 layout invariant를 추가한 뒤 `check:visual`, `check:ci`, 운영 mirror checks를 통과시킨다.

## 수용 기준

- [ ] #326 라미 저장 후 `젤리콩 씨앗 → 포장잎 상인` target row에서 구매/심기/성장/수확 flow가 재현된다.
- [ ] 수확 reveal이 `포장잎 상인`을 명확히 보여주고 `새 기록 재순환` 또는 동등한 record-loop source를 설명한다.
- [ ] reveal/receipt 또는 정원 HUD가 merchant/order crate visual state와 reward motion/다음 행동을 보여준다.
- [ ] 신규 accepted manifest asset 없이 existing portrait + DOM/CSS HUD/CTA/reward motion으로 구현하고 runtime image generation/API를 호출하지 않는다.
- [ ] 393px 모바일에서 reveal/receipt/order crate/하단 탭이 겹치지 않고 overflow를 만들지 않는다.
- [ ] Browser Use iab current-session 시도 evidence 또는 blocker, focused Playwright screenshot, `npm run check:visual`, `npm run check:ci`가 남는다.

## 검증 명령

- `npm run build`
- `npx playwright test --config playwright.config.ts --grep "포장잎 상인|주문상자|다음 기록 목표"`
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

- 포장잎 상인의 다음 행동이 주문상자/order crate로 자연스럽지 않으면 copy-only가 아니라 reward motion/HUD affordance를 조정해야 한다.
- 새 sprite/FX가 필요해지면 이번 WorkUnit 범위를 넘기고 gpt-image-2/Codex native provenance WorkUnit으로 분리한다.
- Browser Use iab backend는 최근 세션에서 반복 실패했다. 그래도 #328에서 새로 시도하고 blocker/evidence를 남긴다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist: `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- Sprite/asset route: 신규 accepted manifest asset 없음. existing `포장잎 상인` portrait와 DOM/CSS order crate visual state/reward motion으로 제한한다. 새 sprite/FX가 필요하면 별도 asset provenance WorkUnit으로 분리한다.

## Studio Campaign Gate

- Player verb: `젤리콩 씨앗을 심어 포장잎 상인을 수확하고 상인 주문상자를 확인하기`
- Production/progression role: 라미 저장 다음 목표 → 젤리콩 씨앗 target row → planting/growth → 포장잎 상인 reveal → order crate/reward motion → 다음 행동
- Screen moment: #326 seeds target row에서 구매/심기 이후 정원 harvest reveal과 주문상자 상태
- Concrete visual/game-feel payoff: `포장잎 상인` harvest reveal, merchant/order crate visual state, reward motion/receipt, playfield state, bottom-tab/overflow-safe 393px screenshot
- Competition production gap: collection idle games는 next target row가 실제 named reveal과 production reward로 닫힐 때 반복 수집 신뢰가 강해진다. target row에서 멈추는 대안은 reject한다.
- Playtest evidence: Browser Use iab 우선, blocker 시 issue 전용 blocker + Playwright screenshot + layout invariant.

## Game Studio Department Signoff

- 기획팀: “하나만 더” 목표가 `포장잎 상인` reveal과 reward/order crate payoff로 닫혀야 한다.
- 리서치팀: reference collection/progression games는 target acquisition 뒤 reward container/receipt를 같은 loop에 연결한다.
- 아트팀: 신규 accepted manifest asset은 이번 WorkUnit 기본 범위가 아니다. 기존 포장잎 상인 portrait를 쓰되 DOM/CSS order crate visual state, reward motion, HUD affordance로 asset/FX payoff를 만든다. 새 sprite/FX 필요 시 별도 provenance WorkUnit.
- 개발팀: `src/App.tsx`, `src/styles.css`, `tests/visual/p0-mobile-game-shell.spec.ts` 중심의 좁은 tranche. 필요하면 playfield telemetry만 추가한다.
- 검수팀: Browser Use iab current-session 시도, 393px screenshot, no body scroll/bottom-tab overlap, order crate visual state를 확인한다.
- 마케팅팀: mock-only promise. 외부 채널/실결제 없음.
- 고객지원팀: “포장잎 상인을 수확하면 뭘 해야 하나요?”를 reward/order crate CTA로 줄인다.

## Reference teardown / rejected alternative

- Reference: collection idle games는 target acquisition 이후 named reveal과 reward container/receipt를 같은 loop에서 제공한다.
- Reference: progression tree류 게임은 node completion 이후 다음 production reward source를 시각적으로 강조한다.
- Rejected: 포장잎 상인 target row에서 멈춤 — #326 promise가 실제 harvest payoff로 닫히지 않는다.
- Rejected: 신규 sprite/FX 즉시 생성 — DOM/CSS order crate/reward motion으로 vertical slice를 먼저 검증하고, 필요 시 별도 provenance WorkUnit으로 분리한다.

## Subagent/Team Routing

- 현재는 단일 React/CSS/visual regression tranche이므로 Codex native subagents/team mode는 사용하지 않는다.
- 필요 시 분리 기준: order crate visual state 설계가 앱 state와 분리되면 designer/verifier subtask, 신규 FX asset이 필요하면 asset pipeline subtask로 분리한다.
