# WorkUnit #324 — 다음 기록 목표 씨앗을 이슬연금 라미 수확 payoff로 닫는다

- GitHub issue: #324 https://github.com/bborok1234/strange-seed-shop/issues/324
- Campaign source of truth: P0.5 Idle Core + Creative Rescue
- Status: review
- Branch: `codex/0324-album-record-loop-rami-harvest-payoff`
- Created: 2026-05-03

## Plan

1. #322 flow 이후 `방울새싹 씨앗 → 이슬연금 라미` target row의 구매/심기/성장/수확 state를 매핑한다.
2. `album_record_next_seed` 재순환 plot state가 growth feedback, next creature card, harvest reveal receipt, telemetry에 같은 target creature name을 유지하는지 확인하고 필요한 UI/state gap을 고친다.
3. 393px 모바일에서 playfield/action surface/reveal/bottom-tab이 겹치지 않게 유지하고 신규 accepted manifest asset/runtime image generation은 쓰지 않는다.
4. Browser Use iab를 현재 세션에서 먼저 시도하고, 실패 시 #324 전용 blocker를 `reports/visual/`에 남긴다.
5. focused Playwright screenshot과 layout/telemetry invariant를 추가한 뒤 `check:visual`, `check:ci`, 운영 mirror checks를 통과시킨다.

## 수용 기준

- [x] #322 후속 기록 저장 이후 `방울새싹 씨앗 → 이슬연금 라미` target row에서 구매/심기를 할 수 있다.
- [x] 심은 plot/action feedback/next creature card가 `이슬연금 라미` 수확 예고와 `후속 성장 중` 또는 동등한 재순환 상태를 보여준다.
- [x] 수확 reveal이 `이슬연금 라미`와 새 기록 재순환 수확 receipt를 보여주고 도감 저장 CTA로 이어진다.
- [x] reward motion telemetry 또는 plot state evidence가 `album_record_next_seed` 재순환임을 남긴다.
- [x] 신규 accepted manifest asset 없이 existing visuals + DOM/CSS HUD/CTA/reward motion으로 구현하고 runtime image generation/API를 호출하지 않는다.
- [x] 393px 모바일에서 playfield/action surface/reveal/bottom tab이 겹치지 않고 overflow를 만들지 않는다.
- [x] Browser Use iab current-session blocker, focused Playwright screenshot, `npm run check:visual` evidence가 남았다. `npm run check:ci`까지 통과했다.

## 검증 명령

- `npm run build`
- `npx playwright test --config playwright.config.ts --grep "다음 기록 목표|이슬연금 라미|새 기록 재순환"`
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

- #322에서 unlocked seed pool의 다음 미발견 creature를 target으로 잡았지만, general harvest path와 `album_record_next_seed` source path가 서로 다른 creature를 보여주면 promise/payoff가 깨질 수 있다.
- 이슬연금 라미 reveal이 기존 `새 기록 후속 수확` copy만 재사용하면 두 번째 재순환감이 약할 수 있어 copy hierarchy가 과밀해질 수 있다.
- Browser Use iab backend는 이번 세션에서 반복 실패했다. 그래도 #324에서 새로 시도하고 blocker/evidence를 남긴다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist: `game-studio:game-ui-frontend` + `game-studio:game-playtest` + 필요 시 `game-studio:phaser-2d-game`
- Sprite/asset route: 신규 accepted manifest asset 없음. existing `이슬연금 라미` portrait, playfield plot state, DOM/CSS CTA, reward motion/telemetry로 제한한다. 새 sprite/FX가 필요하면 별도 asset provenance WorkUnit으로 분리한다.

## Studio Campaign Gate

- Player verb: `다음 기록 목표 씨앗을 심고 이슬연금 라미를 수확하기`
- Production/progression role: 후속 기록 저장 → next seed target row → planting → growth preview → named creature reveal
- Screen moment: #322 seeds target row에서 `방울새싹 씨앗`을 심은 뒤 정원 성장/수확 화면
- Concrete visual/game-feel payoff: `album_record_next_seed` plot state, `이슬연금 라미 수확 예고` growth feedback, target creature reveal receipt, reward motion telemetry, bottom-tab/overflow-safe 393px screenshot
- Competition production gap: collection idle games는 next target CTA가 실제 다음 collectible reveal로 이어져야 신뢰가 생긴다. CTA만 있고 다음 harvest payoff가 검증되지 않는 대안은 reject한다.
- Playtest evidence: Browser Use iab 우선, blocker 시 issue 전용 blocker + Playwright screenshot + layout invariant.

## Game Studio Department Signoff

- 기획팀: 다음 목표 CTA는 다음 생명체 수확 payoff까지 이어져야 “하나만 더” 루프가 완성된다.
- 리서치팀: reference collection games는 target source → growth/collection reveal까지 같은 named target을 유지한다.
- 아트팀: 신규 accepted manifest asset 없이 existing `이슬연금 라미` asset과 DOM/CSS/reward motion으로 제한한다. 별도 FX sprite가 필요하면 provenance WorkUnit으로 분리한다.
- 개발팀: `src/App.tsx`, `src/game/playfield/*` 필요 여부, `tests/visual/p0-mobile-game-shell.spec.ts` 중심의 좁은 tranche.
- 검수팀: Browser Use iab current-session 시도, growth preview/reveal screenshot, telemetry/layout invariant 필수.
- 마케팅팀: mock-only promise. 외부 채널/실결제 없음.
- 고객지원팀: “다음 기록 목표를 눌렀는데 정말 새 아이가 나오나요?”를 named reveal로 줄인다.

## Reference teardown / rejected alternative

- Reference: collection idle games는 next target source를 누른 뒤 growth/collection reveal까지 같은 named target을 유지한다.
- Reference: progression tree류 게임은 next node CTA 이후 completion animation/reward screen까지 같은 node identity를 유지한다.
- Rejected: #322 CTA/target row만으로 종료 — 실제 다음 harvest payoff가 검증되지 않아 CTA 신뢰가 낮다.
- Rejected: 신규 라미 FX sprite 즉시 생성 — 기존 asset과 playfield reward motion이 먼저 end-to-end로 검증된 뒤 provenance WorkUnit으로 분리한다.

## Subagent/Team Routing

- 현재는 단일 React/game-state/visual regression tranche이므로 Codex native subagents/team mode는 사용하지 않는다.
- 필요 시 분리 기준: playfield telemetry mapping이 불명확하면 explorer/verifier subtask, 신규 FX asset이 필요하면 asset pipeline subtask로 분리한다.

## 구현 결과

- `AlbumRecordHarvestReceipt.actionLabel`을 추가해 두 번째 후속 기록 루프 수확을 `새 기록 재순환 수확`으로 구분했다.
- harvest reveal aria/kicker/receipt가 `새 기록 재순환 생명체 발견` / `새 기록 재순환 수확`을 표시한다.
- Phaser scene 및 DOM overlay playfield telemetry에 `plotSource`, `plotLabel`, `growthPreviewLabel`을 포함해 `album_record_next_seed` reward motion source를 검증할 수 있게 했다.
- #322 target row 이후 방울새싹 씨앗 구매/심기/성장/수확이 `이슬연금 라미` named reveal로 닫히는 393px visual regression을 추가했다.

## 검증 결과

- Browser Use iab: `reports/visual/browser-use-blocker-0324-20260503.md` — 현재 세션 iab backend discovery 실패를 issue 전용 blocker로 기록.
- Screenshot: `reports/visual/issue-324-album-record-loop-rami-harvest-payoff-393.png`
- `npm run build` — pass
- `npx playwright test --config playwright.config.ts --grep "이슬연금 라미 수확 payoff"` — 1 passed
- `npm run check:visual` — 65 passed
- `npm run check:ci` — pass
