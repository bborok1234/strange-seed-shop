# WorkUnit #316 — 새 기록 다음 씨앗 심기가 정원 재성장 payoff로 이어지게 만든다

- GitHub issue: #316 https://github.com/bborok1234/strange-seed-shop/issues/316
- Campaign source of truth: P0.5 Idle Core + Creative Rescue
- Status: PR publication ready
- Branch: `codex/0316-album-record-next-seed-planting-payoff`
- Created: 2026-05-03

## Plan

1. #314 새 기록 다음 목표 target row에서 구매/심기 후 현재 정원 전환, toast, playfield state, 다음 행동 panel이 어떻게 보이는지 매핑한다.
2. CTA 경유/심기 상태를 남겨 정원 playfield 또는 다음 행동 panel에 `새 기록 후속 재배` affordance와 다음 씨앗/생명체 이름을 추가한다.
3. 성장 시작 행동이 393px 모바일에서 playfield/action surface/bottom tab과 겹치지 않게 유지하고 신규 accepted manifest asset/runtime image generation은 쓰지 않는다.
4. Browser Use iab를 현재 세션에서 먼저 시도하고, 실패 시 #316 전용 blocker를 `reports/visual/`에 남긴다.
5. focused Playwright screenshot과 layout invariant를 추가한 뒤 `check:visual`, `check:ci`, 운영 mirror checks를 통과시킨다.

## 수용 기준

- [x] `새 기록 다음 목표` target row에서 구매 후 심기를 누르면 정원 탭으로 이동하거나 정원 상태가 명확히 열리고, 후속 재배 상태가 보인다.
- [x] 정원 playfield/다음 행동 패널이 `새 기록 후속 재배` 또는 동등한 copy, 다음 씨앗/생명체 이름, 성장 시작 행동을 보여준다.
- [x] 신규 accepted manifest asset 없이 existing visuals + DOM/CSS/playfield state/reward motion으로 구현하고 runtime image generation/API를 호출하지 않는다.
- [x] 393px 모바일에서 playfield/action surface/bottom tab이 겹치지 않고 overflow를 만들지 않는다.
- [x] Browser Use iab current-session 시도 evidence 또는 blocker, focused Playwright screenshot, `npm run check:visual`, `npm run check:ci`가 남는다.

## 검증 명령

- `npm run build`
- `npx playwright test --config playwright.config.ts --grep "새 기록 다음 씨앗 심기|후속 재배|정원 재성장"`
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

- #314의 seeds row highlight 상태와 새 심기 상태를 혼동하면 stale한 `새 기록 다음 목표` copy가 남을 수 있다.
- GardenScene/playfield view model 변경이 커지면 scope가 넓어질 수 있으므로 우선 DOM/HUD state와 existing view model extension으로 좁힌다.
- Browser Use iab backend는 이번 세션에서 반복 실패했다. 그래도 #316에서 새로 시도하고 blocker/evidence를 남긴다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist: `game-studio:game-ui-frontend` + `game-studio:game-playtest` + 필요 시 `game-studio:phaser-2d-game`
- Sprite/asset route: 신규 accepted manifest asset 없음. existing seed/plot visuals, playfield state, DOM/CSS HUD affordance, reward motion으로 제한한다. 새 sprite/FX가 필요하면 별도 asset provenance WorkUnit으로 분리한다.

## Studio Campaign Gate

- Player verb: `새 기록 다음 씨앗 심기`
- Production/progression role: 도감 기억 저장 → 다음 씨앗 구매/심기 → 정원 재성장 시작
- Screen moment: #314 seeds target row의 구매/심기 직후 garden tab/playfield
- Concrete visual/game-feel payoff: `새 기록 후속 재배` playfield/HUD state, 다음 생명체/씨앗 이름, 성장 시작 affordance, planting reward motion
- Competition production gap: collection idle games는 새 발견 뒤 다음 target을 심으면 playfield가 후속 성장 상태로 즉시 전환된다. 씨앗 row 강조에서 끝나는 대안은 reject한다.
- Playtest evidence: Browser Use iab 우선, blocker 시 Playwright screenshot + layout invariant.

## Game Studio Department Signoff

- 기획팀: 도감 저장 이후 다음 씨앗 심기를 정원 재성장 시작으로 닫아야 한다.
- 리서치팀: 경쟁작은 collection unlock 뒤 다음 target을 심으면 playfield stage가 즉시 follow-up 상태를 보여준다.
- 아트팀: 신규 manifest asset 없이 existing seed/plot visuals와 DOM/CSS/playfield state로 제한한다.
- 개발팀: `src/App.tsx`, `src/styles.css`, 필요 시 `src/game/GardenScene.ts`, `tests/visual/p0-mobile-game-shell.spec.ts` 중심의 좁은 tranche.
- 검수팀: Browser Use iab current-session 시도, 393px screenshot, overflow/bottom-tab invariant 필수.
- 마케팅팀: mock-only promise. 외부 채널/실결제 없음.
- 고객지원팀: “심은 다음 어디서 자라나요?”를 정원 state로 줄인다.

## Reference teardown / rejected alternative

- Reference: collection idle games는 새 발견 뒤 follow-up target 심기/성장 state를 playfield에서 즉시 강조한다.
- Reference: Cell to Singularity류 progression tree는 unlock 다음 branch를 누르면 active node state가 화면에 남는다.
- Rejected: #314 row highlight에서 종료 — 다음 성장 action이 정원 장면으로 이어지지 않아 “하나만 더” 루프가 끊긴다.
- Rejected: 신규 row/plot sprite 즉시 생성 — gameplay payoff 검증을 먼저 끝낸 뒤 별도 provenance gate로 분리한다.

## Subagent/Team Routing

- 현재는 단일 React/CSS/visual regression tranche이므로 Codex native subagents/team mode는 사용하지 않는다.
- 필요 시 분리 기준: Phaser view-state 구현이 커지면 runtime worker, asset generation이 필요해지면 asset pipeline subtask, Browser Use 복구가 필요하면 QA/verifier subtask로 분리한다.


## 구현 결과

- `src/App.tsx`: `albumRecordPlantReceipt`를 추가해 새 기록 다음 목표 seed row의 심기 완료를 정원 receipt, production scene, playfield source label로 연결했다. `qaResearchComplete` visual seed에는 후속 목표 구매/심기 검증이 가능하도록 충분한 잎을 제공한다.
- `src/styles.css`: `album-record-plant-receipt`, `album-record-plant-chip`, `has-album-record-plant-receipt` compact layout을 추가했다.
- `tests/visual/p0-mobile-game-shell.spec.ts`: 393px 모바일에서 연구 단서 수확 → 도감 기록 → 다음 씨앗 CTA → 구매/심기 → 정원 `새 기록 후속 재배` receipt/source label/layout invariant를 검증한다.
- Browser Use iab는 현재 세션 backend discovery 실패로 막혀 `reports/visual/browser-use-blocker-0316-20260503.md`에 blocker를 남겼다.
- Playwright evidence screenshot: `reports/visual/issue-316-album-record-next-seed-planting-payoff-393.png`.

## 검증 결과

- `npm run build` — pass
- `npx playwright test --config playwright.config.ts --grep "새 기록 다음 씨앗 심기|후속 재배|정원 재성장"` — 2 passed
- `npm run check:visual` — 61 passed
- `npm run check:ci` — pass
