# WorkUnit #310 — 연구 단서 씨앗 수확 순간 다음 생명체 발견 연출을 보이게 만든다

- GitHub issue: #310 https://github.com/bborok1234/strange-seed-shop/issues/310
- Campaign source of truth: P0.5 Idle Core + Creative Rescue
- Status: planned
- Branch: `codex/0310-research-clue-harvest-reveal`
- Created: 2026-05-03

## Plan

1. #308 이후 연구 단서 source plot을 수확할 때 receipt/action surface/next creature card가 어떤 상태로 전환되는지 매핑한다.
2. 연구 단서 씨앗 수확 시 일반 수확과 구분되는 `단서 생명체 발견` receipt, `도감 단서 기록` HUD affordance, reward motion을 추가한다.
3. 다음 생명체 목표가 발견/도감 기억 저장으로 전환되는 copy를 정원 첫 화면에서 읽히게 하되 신규 manifest asset/runtime image generation은 쓰지 않는다.
4. Browser Use iab를 현재 세션에서 먼저 시도하고, 실패 시 #310 전용 blocker를 `reports/visual/`에 남긴다.
5. 393px 모바일 focused Playwright screenshot과 layout invariant를 추가한 뒤 `check:visual`, `check:ci`, 운영 mirror checks를 통과시킨다.

## 수용 기준

- [ ] 연구 단서 source plot 수확 시 일반 수확과 구분되는 `단서 생명체 발견`/`도감 단서 기록` receipt가 보인다.
- [ ] next creature card 또는 action surface가 수확한 생명체 이름과 다음 목표 전환을 한 화면에서 설명한다.
- [ ] 신규 accepted manifest asset 없이 DOM/CSS reward motion/HUD affordance로 구현하고 runtime image generation/API를 호출하지 않는다.
- [ ] 393px 모바일에서 receipt/action surface/next creature card가 bottom tab과 겹치지 않고 overflow를 만들지 않는다.
- [ ] Browser Use iab current-session 시도 evidence 또는 blocker, focused Playwright screenshot, `npm run check:visual`, `npm run check:ci`가 남는다.

## 검증 명령

- `npm run build`
- `npx playwright test --config playwright.config.ts --grep "연구 단서 수확|단서 생명체"`
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

- 연구 단서 수확 reward가 기존 harvest/album reward와 중복되어 UI 밀도가 높아질 수 있다.
- 수확 즉시 next creature goal이 사라지거나 다음 목표로 전환되면 copy race가 생길 수 있다.
- Browser Use iab backend는 이번 세션에서 반복 실패했다. 그래도 #310에서 새로 시도하고 blocker/evidence를 남긴다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist: `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- Sprite/asset route: 신규 accepted manifest asset 없음. DOM/CSS reward motion, HUD affordance, playfield state로 제한한다. 새 sprite/FX가 필요하면 별도 asset provenance WorkUnit으로 분리한다.

## Studio Campaign Gate

- Player verb: `연구 단서 씨앗 수확하기`
- Production/progression role: 연구 단서 심기 → 성장 추적 → 생명체 발견/도감 단서 기록
- Screen moment: #308 flow 이후 정원에서 연구 단서 source plot을 수확하는 순간
- Concrete visual/game-feel payoff: `단서 생명체 발견` receipt, `도감 단서 기록` HUD affordance, playfield reward motion
- Competition production gap: Egg/Idle Miner류는 기다린 reward claim에 즉시 burst를 주고, Cell to Singularity는 unlock node가 다음 branch로 이어진다. 현재는 연구 단서 수확이 일반 수확처럼 보일 위험이 있다.
- Playtest evidence: Browser Use iab 우선, blocker 시 Playwright screenshot + layout invariant.

## Game Studio Department Signoff

- 기획팀: 수확 순간이 연구 단서 arc의 payoff이므로 발견/도감 기록을 즉시 보여준다.
- 리서치팀: 경쟁작은 기다림 이후 claim 순간에 reward burst와 다음 목표를 동시에 보여준다. 일반 수확 receipt만 유지하는 대안은 reject한다.
- 아트팀: 신규 manifest asset 없이 existing creature/seed image와 DOM/CSS reward motion으로 제한한다.
- 개발팀: `src/App.tsx`, `src/styles.css`, `tests/visual/p0-mobile-game-shell.spec.ts` 중심의 좁은 tranche.
- 검수팀: Browser Use iab current-session 시도, 393px screenshot, overflow/bottom-tab invariant 필수.
- 마케팅팀: mock-only promise. 외부 채널/실결제 없음.
- 고객지원팀: “단서 씨앗을 수확했는데 무엇을 발견했는지 모르겠다”를 receipt와 next goal copy로 줄인다.

## Reference teardown / rejected alternative

- Reference: Egg/Idle Miner는 보상 claim 시 숫자/상자/캐릭터 feedback을 즉시 터뜨린다.
- Reference: Cell to Singularity는 unlock 이후 다음 branch 진행 방향을 잃지 않게 한다.
- Rejected: 기존 수확 receipt 문구만 변경 — 연구 단서 arc의 발견 payoff와 도감 기록 감정이 부족하다.
- Rejected: 신규 sprite/FX 즉시 생성 — gameplay payoff 검증을 먼저 끝낸 뒤 별도 provenance gate로 분리한다.

## Subagent/Team Routing

- 현재는 단일 React/CSS/visual regression tranche이므로 Codex native subagents/team mode는 사용하지 않는다.
- 필요 시 분리 기준: asset generation이 필요해지면 asset pipeline subtask, Browser Use 복구가 필요하면 QA/verifier subtask로 분리한다.
