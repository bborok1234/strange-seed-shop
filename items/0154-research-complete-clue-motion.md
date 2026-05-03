# WorkUnit #304 — 연구 완료 보상이 도감 단서 기록 motion으로 다음 씨앗 목표까지 이어지게 만든다

- GitHub issue: #304 https://github.com/bborok1234/strange-seed-shop/issues/304
- Campaign source of truth: P0.5 Idle Core + Creative Rescue
- Status: planned
- Branch: `codex/0304-research-complete-clue-motion`
- Created: 2026-05-03

## Plan

1. 현재 `새싹 기록법 연구` 완료 흐름과 visual regression fixture를 확인해 연구 완료 직후의 player verb/screen moment를 고정한다.
2. 연구 완료 직후 `도감 단서 기록` receipt, playfield actor/order state, 연구/씨앗 CTA 강조를 DOM/CSS reward motion으로 구현한다.
3. 393px 모바일에서 receipt, 연구 CTA, 하단 탭, action surface overflow를 검증하는 focused Playwright assertion과 screenshot을 추가한다.
4. Browser Use iab를 현재 세션에서 먼저 시도하고, 실패 시 issue 전용 blocker를 `reports/visual/`에 남긴다.
5. 검증 evidence를 `items/0154...`, `docs/ROADMAP.md`, GitHub issue/PR body-file, GateEvent에 반영한 뒤 PR checks/merge/main CI까지 진행한다.

## 수용 기준

- [ ] `새싹 기록법 연구` 완료 직후 `도감 단서 기록`/`다음 씨앗 목표` 보상이 action surface에서 visible하다.
- [ ] garden playfield가 연구 완료 payoff를 `연구 노트 저장` 또는 동등한 actor/order state로 보여준다.
- [ ] 보상 motion은 새 manifest asset 없이 DOM/CSS reward motion/HUD affordance로 구현하며, runtime image generation/API를 호출하지 않는다.
- [ ] 393px 모바일에서 receipt와 research/seed CTA가 bottom tab과 겹치지 않고 action surface overflow를 만들지 않는다.
- [ ] focused Playwright screenshot과 `npm run check:visual`, `npm run check:ci`가 통과한다.
- [ ] PR body와 GateEvent에 Browser Use evidence 또는 current-session blocker, screenshot, verification commands가 들어간다.

## 검증 명령

- `npm run build`
- `npx playwright test --config playwright.config.ts --grep "연구 완료"`
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

- 연구 완료 receipt, 주문 receipt, 생산 receipt가 동시에 표시되면 모바일 세로 공간이 부족할 수 있다.
- Browser Use iab가 현재 세션에서 계속 미발견될 수 있다. 이 경우 blocker를 새로 남기고 Playwright screenshot을 regression gate로만 사용한다.
- 새 raster asset이 필요해지면 이 WorkUnit 범위를 넘으므로 별도 asset pipeline issue로 분리한다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist: `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- Sprite/asset route: 신규 accepted manifest asset 없음. DOM/CSS reward motion과 HUD affordance로 제한한다. 새 sprite/FX가 필요하면 `game-studio:sprite-pipeline` + project asset skills로 별도 분리한다.

## Studio Campaign Gate

- Player verb: `새싹 기록법 연구 완료하기`
- Production/progression role: 두 번째 주문 보상 → 연구 완료 → 도감 단서/다음 씨앗 목표
- Screen moment: research CTA를 누른 직후 393px 정원 첫 화면
- Concrete visual/game-feel payoff: `도감 단서 기록` receipt, playfield `연구 노트 저장` state, seed/research CTA glow, reward motion
- Competition production gap: Cell to Singularity식 연구/해금 feedback처럼 메타 진행이 즉시 보이고, Egg/Idle Miner식 보상 수령 motion처럼 다음 행동이 명확해야 한다.
- Playtest evidence: Browser Use iab 우선, blocker 시 Playwright screenshot + layout invariant.

## Game Studio Department Signoff

- 기획팀: 주문-연구-도감 progression chain을 첫 5분 안에서 끊기지 않게 만든다.
- 리서치팀: 경쟁작 idle은 연구/업그레이드 완료를 다음 메타 노드로 시각 연결한다. 단순 완료 문구는 reject한다.
- 아트팀: 신규 manifest asset 없이 CSS/DOM note card motion으로 제한한다. 새 asset 필요 시 별도 provenance gate로 분리한다.
- 개발팀: `src/App.tsx`, `src/styles.css`, `tests/visual/p0-mobile-game-shell.spec.ts` 중심의 좁은 tranche로 구현한다.
- 검수팀: Browser Use iab current-session 시도, 393px screenshot, overflow/bottom-tab invariant를 요구한다.
- 마케팅팀: mock-only player-facing promise. 외부 채널/실결제 없음.
- 고객지원팀: “연구를 했는데 무엇이 열렸는지 모르겠다” 혼란을 receipt와 다음 목표 copy로 줄인다.

## Reference teardown / rejected alternative

- Reference: Cell to Singularity는 연구/진화 완료가 다음 node 목표로 즉시 이어진다. Idle Miner/Egg 계열은 수령/업그레이드 결과를 숫자와 motion으로 짧게 확인시킨다.
- Rejected: 연구 버튼을 enabled/disabled만 바꾸는 방식 — player verb 후 reward payoff가 부족하고 #302와 차별이 없다.
- Rejected: 신규 asset batch를 즉시 만드는 방식 — 현재 목표는 gameplay payoff 검증이며 asset provenance gate가 별도 WorkUnit 규모가 된다.

## Subagent/Team Routing

- 현재는 단일 React/CSS/visual regression tranche이고 즉시 implementation path가 명확하므로 native subagent/team은 사용하지 않는다.
- 병렬화가 필요한 경우만 확대한다: asset 생성이 필요해지면 asset pipeline subtask, Browser Use 복구가 필요하면 QA/verifier subtask로 분리한다.
