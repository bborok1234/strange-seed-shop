# WorkUnit #318 — 새 기록 후속 재배 성장 중 다음 생명체 수확 예고를 보이게 만든다

- GitHub issue: #318 https://github.com/bborok1234/strange-seed-shop/issues/318
- Campaign source of truth: P0.5 Idle Core + Creative Rescue
- Status: planned
- Branch: `codex/0318-album-record-followup-growth-preview`
- Created: 2026-05-03

## Plan

1. #316 새 기록 후속 재배 상태에서 밭을 톡톡 누른 뒤 action feedback, next creature card, action surface가 어떤 copy/상태를 보여주는지 매핑한다.
2. 후속 재배 성장 상태를 판정해 `후속 성장 중`/`수확 예고` HUD affordance와 다음 씨앗/생명체 이름을 추가한다.
3. 393px 모바일에서 playfield/action surface/bottom tab이 겹치지 않게 유지하고 신규 accepted manifest asset/runtime image generation은 쓰지 않는다.
4. Browser Use iab를 현재 세션에서 먼저 시도하고, 실패 시 #318 전용 blocker를 `reports/visual/`에 남긴다.
5. focused Playwright screenshot과 layout invariant를 추가한 뒤 `check:visual`, `check:ci`, 운영 mirror checks를 통과시킨다.

## 수용 기준

- [ ] `새 기록 후속 재배` 씨앗을 한 번 이상 성장시키면 action feedback 또는 action surface가 다음 생명체/씨앗 이름과 수확 예고를 보여준다.
- [ ] next creature card 또는 동등한 HUD가 후속 재배 성장 중 상태를 `수확 예고`/`후속 성장 중`으로 설명한다.
- [ ] 신규 accepted manifest asset 없이 existing visuals + DOM/CSS/playfield feedback/reward motion으로 구현하고 runtime image generation/API를 호출하지 않는다.
- [ ] 393px 모바일에서 playfield/action surface/bottom tab이 겹치지 않고 overflow를 만들지 않는다.
- [ ] Browser Use iab current-session 시도 evidence 또는 blocker, focused Playwright screenshot, `npm run check:visual`, `npm run check:ci`가 남는다.

## 검증 명령

- `npm run build`
- `npx playwright test --config playwright.config.ts --grep "새 기록 후속 성장|후속 재배 성장|수확 예고"`
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

- #316 receipt가 6초 후 사라지면 후속 성장 상태 판정도 사라질 수 있다. 필요한 경우 planted plot/next goal 기반의 더 안정적인 판정을 사용한다.
- 성장 중 수확 예고 copy가 기존 연구 단서/복귀 성장 copy와 충돌하면 action surface가 과밀해질 수 있다.
- Browser Use iab backend는 이번 세션에서 반복 실패했다. 그래도 #318에서 새로 시도하고 blocker/evidence를 남긴다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist: `game-studio:game-ui-frontend` + `game-studio:game-playtest` + 필요 시 `game-studio:phaser-2d-game`
- Sprite/asset route: 신규 accepted manifest asset 없음. existing seed/plot visuals, playfield feedback, DOM/CSS HUD affordance, reward motion으로 제한한다. 새 sprite/FX가 필요하면 별도 asset provenance WorkUnit으로 분리한다.

## Studio Campaign Gate

- Player verb: `새 기록 후속 씨앗 성장시키기`
- Production/progression role: 후속 재배 시작 → 성장 탭 반복 → 다음 생명체 수확 기대
- Screen moment: #316 garden `새 기록 후속 재배` 상태에서 밭을 톡톡 누른 직후
- Concrete visual/game-feel payoff: `후속 성장 중`/`수확 예고` HUD affordance, 다음 생명체/씨앗 이름, playfield action feedback/reward motion
- Competition production gap: collection idle games는 target planting 뒤 성장 중에도 target reward/next unlock preview를 유지한다. 심기 receipt에서 끝나는 대안은 reject한다.
- Playtest evidence: Browser Use iab 우선, blocker 시 Playwright screenshot + layout invariant.

## Game Studio Department Signoff

- 기획팀: 후속 재배 시작 이후 성장 탭 반복을 다음 수확 기대로 닫아야 한다.
- 리서치팀: 경쟁작은 target planting 뒤 성장 중 target reward preview를 유지한다.
- 아트팀: 신규 manifest asset 없이 existing seed/plot visuals와 DOM/CSS/playfield feedback으로 제한한다.
- 개발팀: `src/App.tsx`, `src/styles.css`, 필요 시 `src/game/playfield/*`, `tests/visual/p0-mobile-game-shell.spec.ts` 중심의 좁은 tranche.
- 검수팀: Browser Use iab current-session 시도, 393px screenshot, overflow/bottom-tab invariant 필수.
- 마케팅팀: mock-only promise. 외부 채널/실결제 없음.
- 고객지원팀: “심은 건 알겠는데 뭘 얻나요?”를 성장 중 수확 예고로 줄인다.

## Reference teardown / rejected alternative

- Reference: collection idle games는 새 target을 심은 뒤에도 성장 UI에 target reward/next unlock preview를 남긴다.
- Reference: progression tree류 게임은 활성 node 성장 중에도 다음 unlock reward를 계속 보여준다.
- Rejected: #316 심기 receipt에서 종료 — 성장 반복의 수확 기대가 약하다.
- Rejected: 신규 성장 sprite 즉시 생성 — gameplay payoff 검증을 먼저 끝낸 뒤 별도 provenance gate로 분리한다.

## Subagent/Team Routing

- 현재는 단일 React/CSS/visual regression tranche이므로 Codex native subagents/team mode는 사용하지 않는다.
- 필요 시 분리 기준: Phaser feedback 구현이 커지면 runtime worker, asset generation이 필요해지면 asset pipeline subtask, Browser Use 복구가 필요하면 QA/verifier subtask로 분리한다.
