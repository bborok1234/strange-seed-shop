# WorkUnit #320 — 새 기록 후속 재배 수확 순간을 새 생명체 발견 payoff로 보이게 만든다

- GitHub issue: #320 https://github.com/bborok1234/strange-seed-shop/issues/320
- Campaign source of truth: P0.5 Idle Core + Creative Rescue
- Status: review
- Branch: `codex/0320-album-record-followup-harvest-reveal`
- Created: 2026-05-03

## Plan

1. #318 후속 재배 성장 예고 상태에서 ready plot 수확 시 현재 reveal/action surface/playfield feedback이 어떤 copy와 CTA를 보여주는지 매핑한다.
2. `album_record_next_seed` source plot harvest를 판정해 `새 기록 후속 수확`/다음 생명체 발견/도감 저장 CTA가 같은 target creature 이름으로 이어지게 한다.
3. 393px 모바일에서 reveal/action surface/bottom tab이 겹치지 않게 유지하고 신규 accepted manifest asset/runtime image generation은 쓰지 않는다.
4. Browser Use iab를 현재 세션에서 먼저 시도하고, 실패 시 #320 전용 blocker를 `reports/visual/`에 남긴다.
5. focused Playwright screenshot과 layout invariant를 추가한 뒤 `check:visual`, `check:ci`, 운영 mirror checks를 통과시킨다.

## 수용 기준

- [x] `album_record_next_seed` source plot을 ready 상태로 만든 뒤 수확하면 reveal/action feedback이 다음 생명체 이름과 `새 기록 후속 수확` 또는 동등한 payoff copy를 보여준다.
- [x] reveal 또는 action surface가 도감 저장 CTA를 명확히 보여주며, 성장 예고와 같은 target creature 이름이 유지된다.
- [x] 신규 accepted manifest asset 없이 existing visuals + DOM/CSS/playfield feedback/reward motion으로 구현하고 runtime image generation/API를 호출하지 않는다.
- [x] 393px 모바일에서 reveal/action surface/bottom tab이 겹치지 않고 overflow를 만들지 않는다.
- [x] Browser Use iab current-session 시도 evidence 또는 blocker, focused Playwright screenshot, `npm run check:visual`, `npm run check:ci`가 남는다.

## 검증 명령

- `npm run build`
- `npx playwright test --config playwright.config.ts --grep "새 기록 후속 수확|후속 재배 수확|새 생명체 발견"`
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

- #318의 `album_record_next_seed` source가 수확 시 plot reset 전에 사라지면 reveal 상태가 target source를 잃을 수 있다. 필요한 경우 harvest 직전 source/target snapshot을 receipt로 보존한다.
- 기존 연구 단서 수확 reveal과 새 기록 후속 수확 reveal copy가 충돌하면 플레이어가 “연구 단서”와 “새 기록 후속” 맥락을 혼동할 수 있다.
- Browser Use iab backend는 이번 세션에서 반복 실패했다. 그래도 #320에서 새로 시도하고 blocker/evidence를 남긴다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist: `game-studio:game-ui-frontend` + `game-studio:game-playtest` + 필요 시 `game-studio:phaser-2d-game`
- Sprite/asset route: 신규 accepted manifest asset 없음. existing creature portrait/plot visuals, playfield feedback, DOM/CSS reveal affordance, reward motion으로 제한한다. 새 sprite/FX가 필요하면 별도 asset provenance WorkUnit으로 분리한다.

## Studio Campaign Gate

- Player verb: `새 기록 후속 씨앗 수확하기`
- Production/progression role: 후속 재배 성장 완료 → ready 밭 수확 → 새 생명체 발견 → 도감 저장
- Screen moment: #318 garden `새 기록 후속 재배` 성장 예고 상태에서 ready plot의 수확 버튼을 누른 직후
- Concrete visual/game-feel payoff: `새 기록 후속 수확` playfield feedback/reward motion, next creature reveal, 도감 저장 CTA, bottom-tab/overflow-safe mobile screenshot
- Competition production gap: collection idle games는 target planting/growth preview 이후 실제 harvest/reveal 순간에 target reward를 크게 확인시킨다. 성장 예고만 있고 수확 payoff가 평범한 reveal로 끝나는 대안은 reject한다.
- Playtest evidence: Browser Use iab 우선, blocker 시 Playwright screenshot + layout invariant.

## Game Studio Department Signoff

- 기획팀: 수확 verb가 “하나만 더 키워볼까?”의 payoff다. 성장 예고가 실제 발견으로 닫혀야 한다.
- 리서치팀: target reward preview 뒤 harvest reveal confirmation은 경쟁작 수집 루프의 핵심이다.
- 아트팀: 신규 accepted manifest asset 없이 existing creature portrait/plot visuals, DOM/CSS reveal treatment, reward motion으로 제한한다. 새 FX가 필요하면 별도 provenance WorkUnit으로 분리한다.
- 개발팀: `src/App.tsx`, `src/game/playfield/*`, `src/styles.css`, `tests/visual/p0-mobile-game-shell.spec.ts` 중심의 좁은 tranche.
- 검수팀: Browser Use iab current-session 시도, 393px screenshot, reveal/action surface/bottom-tab invariant 필수.
- 마케팅팀: mock-only promise. 외부 채널/실결제 없음.
- 고객지원팀: “예고와 수확이 연결됐나요?” 혼란을 reveal copy/CTA로 줄인다.

## Reference teardown / rejected alternative

- Reference: collection idle games는 target reward preview 뒤 harvest reveal에서 target reward identity를 다시 크게 확인시킨다.
- Reference: progression tree류 게임은 active node 완료 순간 다음 unlock/collection confirmation을 CTA와 함께 보여준다.
- Rejected: 일반 harvest reveal 재사용만으로 종료 — #318의 수확 예고와 실제 발견 사이의 promise/payoff 연결이 약하다.
- Rejected: 신규 수확 sprite 즉시 생성 — harvest/reveal payoff 검증을 먼저 끝낸 뒤 별도 provenance gate로 분리한다.

## Subagent/Team Routing

- 현재는 단일 React/CSS/playfield feedback/visual regression tranche이므로 Codex native subagents/team mode는 사용하지 않는다.
- 필요 시 분리 기준: Phaser reward motion 구현이 커지면 runtime worker, Browser Use 복구가 필요하면 QA/verifier subtask, 새 FX asset이 필요하면 asset pipeline subtask로 분리한다.


## Implementation evidence

- 변경: `AlbumRecordHarvestReceipt`를 추가해 `album_record_next_seed` source plot 수확 직전 seed/creature snapshot을 보존한다.
- 변경: harvest reveal이 `새 기록 후속 생명체 발견`, `예고했던 새 생명체 수확`, `새 기록 후속 수확` receipt, 도감 저장 CTA를 보여준다.
- 변경: 도감 저장 후 garden production scene이 `새 기록 후속 수확 · 젤리콩 통통 도감 기록`을 유지한다.
- Browser Use blocker: `reports/visual/browser-use-blocker-0320-20260503.md` — 현재 세션 iab backend discovery 실패.
- Screenshot: `reports/visual/issue-320-album-record-followup-harvest-reveal-393.png`
- Focused verification: `npm run build`; `npx playwright test --config playwright.config.ts --grep "새 기록 후속 수확|후속 재배 수확|새 생명체 발견"` — 1 passed.
- Full verification: `npm run check:visual` — 63 passed; `npm run check:ci` — pass.
