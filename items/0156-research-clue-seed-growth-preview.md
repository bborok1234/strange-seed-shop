# WorkUnit #308 — 연구 단서 씨앗 성장 중 다음 생명체 수확 예고가 보이게 만든다

- GitHub issue: #308 https://github.com/bborok1234/strange-seed-shop/issues/308
- Campaign source of truth: P0.5 Idle Core + Creative Rescue
- Status: verification-ready
- Branch: `codex/0308-research-clue-seed-growth-preview`
- Created: 2026-05-03

## Plan

1. #306 이후 연구 단서 source plot이 growing 상태일 때 정원 playfield/action surface/next creature card가 어떻게 보이는지 매핑한다.
2. 연구 단서 씨앗 성장 중 `연구 단서 추적`, `수확 예고`, 다음 생명체 힌트가 visible한 HUD affordance와 DOM/CSS reward motion을 추가한다.
3. 393px 모바일에서 source plot, next creature card, action surface overflow, bottom-tab overlap을 검증하는 focused Playwright assertion과 screenshot을 추가한다.
4. Browser Use iab를 현재 세션에서 먼저 시도하고, 실패 시 #308 전용 blocker를 `reports/visual/`에 남긴다.
5. 검증 evidence를 item/roadmap/GitHub body/GateEvent에 반영하고 PR checks/merge/main CI까지 진행한다.

## 수용 기준

- [x] 연구 단서 source plot이 일반 성장 밭과 구분되는 `연구 단서`/`수확 예고` 상태를 보여준다.
- [x] action surface 또는 next creature card가 다음 생명체 목표와 수확 기대를 한 화면에서 설명한다.
- [x] 신규 manifest asset 없이 DOM/CSS HUD affordance/reward motion으로 구현하고 runtime image generation/API를 호출하지 않는다.
- [x] 393px 모바일에서 source plot/CTA가 bottom tab과 겹치지 않고 action surface overflow를 만들지 않는다.
- [x] focused Playwright screenshot, `npm run check:visual`, `npm run check:ci`가 통과한다.

## 검증 명령

- `npm run build`
- `npx playwright test --config playwright.config.ts --grep "연구 단서 성장"`
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

- 연구 단서 source plot과 기존 lunar/greenhouse source 표시가 충돌할 수 있다.
- action surface가 이미 compact하므로 393px overflow 회귀를 우선 검증해야 한다.
- Browser Use iab backend는 이번 세션에서 반복 실패했다. 그래도 #308에서 새로 시도하고 blocker/evidence를 남긴다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist: `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- Sprite/asset route: 신규 accepted manifest asset 없음. DOM/CSS HUD affordance와 reward motion으로 제한한다. 새 sprite/FX가 필요하면 별도 asset provenance WorkUnit으로 분리한다.

## Studio Campaign Gate

- Player verb: `연구 단서 씨앗 성장시키기`
- Production/progression role: 연구 단서 씨앗 심기 → 성장 추적 → 다음 생명체 수확 기대
- Screen moment: #306 flow 이후 정원 첫 화면에서 연구 단서 source plot이 성장 중인 순간
- Concrete visual/game-feel payoff: source plot `연구 단서`, next creature 수확 예고, action surface HUD affordance, reward motion
- Competition production gap: Egg/Idle Miner류는 성장/업그레이드 중에도 다음 보상이 계속 보이고, Cell to Singularity는 다음 node 기대를 잃지 않는다. 현재는 심은 뒤 성장 중 payoff가 약하다.
- Playtest evidence: Browser Use iab 우선, blocker 시 Playwright screenshot + layout invariant.

## Game Studio Department Signoff

- 기획팀: 연구 단서로 심은 씨앗이 다음 생명체 기대를 유지해야 한다.
- 리서치팀: 경쟁작은 진행 중 상태에서도 다음 보상을 명확히 예고한다. 일반 성장 copy만 유지하는 대안은 reject한다.
- 아트팀: 신규 manifest asset 없이 seed tag/note glow DOM motion으로 제한한다.
- 개발팀: `src/App.tsx`, `src/styles.css`, `tests/visual/p0-mobile-game-shell.spec.ts` 중심의 좁은 tranche.
- 검수팀: Browser Use iab current-session 시도, 393px screenshot, overflow/bottom-tab invariant 필수.
- 마케팅팀: mock-only promise. 외부 채널/실결제 없음.
- 고객지원팀: “단서 씨앗을 심었는데 다음에 뭘 기대해야 하는지 모르겠다”를 성장 예고로 줄인다.

## Reference teardown / rejected alternative

- Reference: Egg/Idle Miner는 진행 중인 생산/업그레이드가 다음 보상과 숫자 기대를 계속 표시한다.
- Reference: Cell to Singularity는 node unlock 이후 다음 node/branch 방향을 잃지 않게 한다.
- Rejected: source label만 추가 — action surface/next creature 기대가 부족하다.
- Rejected: 신규 asset batch 즉시 생성 — gameplay payoff 검증을 먼저 끝낸 뒤 별도 provenance gate로 분리한다.

## Subagent/Team Routing

- 현재는 단일 React/CSS/visual regression tranche이므로 native subagent/team은 사용하지 않는다.
- 필요 시 분리 기준: asset generation이 필요해지면 asset pipeline subtask, Browser Use 복구가 필요하면 QA/verifier subtask로 분리한다.


## 구현 Evidence

- Implementation: `src/App.tsx`, `src/styles.css`, `tests/visual/p0-mobile-game-shell.spec.ts`
- Next creature card: 연구 단서 source plot이 growing 상태일 때 `수확 예고: <씨앗> 수확 예고 · <생명체> 단서 추적 중` pill을 표시한다.
- Playfield/source state: #306의 `research` source plot 상태와 `연구 단서 씨앗 심기` receipt를 유지하면서 성장 중 다음 수확 기대를 compact card에 연결했다.
- Asset/FX boundary: 신규 accepted manifest asset 없음. DOM/CSS HUD affordance와 작은 sparkle marker만 사용했고 runtime image generation/API 호출 없음.

## QA / Playtest Evidence

- Browser Use blocker: `reports/visual/browser-use-blocker-0308-20260503.md` — 현 Codex 세션 iab backend discovery 실패를 새로 기록했다.
- Screenshot: `reports/visual/issue-308-research-clue-seed-growth-preview-393.png`
- `npm run build` — pass
- `npx playwright test --config playwright.config.ts --grep "연구 단서 씨앗|연구 단서 성장"` — 2 passed
- `npm run check:visual` — 57 passed
- `npm run check:ci` — pass

## PR Gate

- Status: PR publication ready
- Prepared at: 2026-05-03T05:30:21Z
- Next gate: GitHub issue body update → branch push → draft PR create/update → GitHub checks watch/repair → ready/merge when green → main CI observation → next WorkUnit plan-first.
- Stop rule: none
