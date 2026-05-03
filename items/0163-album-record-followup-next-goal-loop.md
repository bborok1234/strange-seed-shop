# WorkUnit #322 — 새 기록 후속 수확 도감 저장을 다음 씨앗 목표 재순환으로 이어지게 만든다

- GitHub issue: #322 https://github.com/bborok1234/strange-seed-shop/issues/322
- Campaign source of truth: P0.5 Idle Core + Creative Rescue
- Status: planned
- Branch: `codex/0322-album-record-followup-next-goal-loop`
- Created: 2026-05-03

## Plan

1. #320 후속 수확 reveal에서 `도감에 기록하기`를 누른 뒤 album/action surface/seeds row가 현재 어떤 다음 목표 CTA를 보여주는지 매핑한다.
2. 저장 직후 `다음 기록으로 이어가기` HUD affordance와 next seed/creature CTA를 보강해 seeds tab target row로 재진입하게 한다.
3. 393px 모바일에서 album/action surface/seeds row/bottom tab이 겹치지 않게 유지하고 신규 accepted manifest asset/runtime image generation은 쓰지 않는다.
4. Browser Use iab를 현재 세션에서 먼저 시도하고, 실패 시 #322 전용 blocker를 `reports/visual/`에 남긴다.
5. focused Playwright screenshot과 layout invariant를 추가한 뒤 `check:visual`, `check:ci`, 운영 mirror checks를 통과시킨다.

## 수용 기준

- [ ] 새 기록 후속 수확 reveal에서 `도감에 기록하기`를 누르면 album 화면이 저장한 생명체와 다음 씨앗/생명체 목표를 함께 보여준다.
- [ ] album CTA 또는 action surface가 seeds tab target row로 이동하는 다음 행동을 명확히 제공한다.
- [ ] seeds tab target row가 새 목표의 seed/creature 이름과 `다음 기록` 또는 동등한 재순환 affordance를 보여준다.
- [ ] 신규 accepted manifest asset 없이 existing visuals + DOM/CSS HUD/CTA/reward motion으로 구현하고 runtime image generation/API를 호출하지 않는다.
- [ ] 393px 모바일에서 album/action surface/seeds row/bottom tab이 겹치지 않고 overflow를 만들지 않는다.
- [ ] Browser Use iab current-session 시도 evidence 또는 blocker, focused Playwright screenshot, `npm run check:visual`, `npm run check:ci`가 남는다.

## 검증 명령

- `npm run build`
- `npx playwright test --config playwright.config.ts --grep "새 기록 후속 저장|다음 목표 재순환|다음 기록"`
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

- #320 도감 저장 후 `researchAlbumRecord`를 재사용하므로 기존 연구 단서 copy와 새 기록 후속 수확 copy가 충돌할 수 있다.
- 다음 목표가 이미 충분히 노출되어 있다면, 이번 변경은 CTA hierarchy/visual emphasis에 국한해야 과밀을 피할 수 있다.
- Browser Use iab backend는 이번 세션에서 반복 실패했다. 그래도 #322에서 새로 시도하고 blocker/evidence를 남긴다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist: `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- Sprite/asset route: 신규 accepted manifest asset 없음. existing creature/seed portrait, DOM/CSS CTA, target row reward motion으로 제한한다. 새 sprite/FX가 필요하면 별도 asset provenance WorkUnit으로 분리한다.

## Studio Campaign Gate

- Player verb: `새 기록 후속 수확을 도감에 저장하고 다음 씨앗 목표 선택하기`
- Production/progression role: 후속 수확 발견 → 도감 저장 → 다음 생명체 목표 확인 → seeds tab target row 재진입
- Screen moment: #320 reveal의 `도감에 기록하기` 직후 album 화면
- Concrete visual/game-feel payoff: `다음 기록으로 이어가기` HUD affordance, next seed/creature CTA, target row highlight/reward motion, bottom-tab/overflow-safe mobile screenshot
- Competition production gap: collection idle games는 새 도감 기록 저장 직후 다음 collection target을 즉시 보여주고, 다음 acquisition screen으로 이동할 CTA를 제공한다. 기록 저장 후 목표가 흐려지는 대안은 reject한다.
- Playtest evidence: Browser Use iab 우선, blocker 시 Playwright screenshot + layout invariant.

## Game Studio Department Signoff

- 기획팀: “하나만 더” 루프는 도감 저장 직후 다음 목표 CTA에서 발생한다.
- 리서치팀: 경쟁작은 collection entry 저장 후 next target/next source를 바로 제시한다.
- 아트팀: 신규 accepted manifest asset 없이 existing creature/seed portrait, DOM/CSS CTA, target row motion으로 제한한다. 새 FX가 필요하면 별도 provenance WorkUnit으로 분리한다.
- 개발팀: `src/App.tsx`, `src/styles.css`, `tests/visual/p0-mobile-game-shell.spec.ts` 중심의 좁은 tranche.
- 검수팀: Browser Use iab current-session 시도, 393px screenshot, album/action surface/seeds row/bottom-tab invariant 필수.
- 마케팅팀: mock-only promise. 외부 채널/실결제 없음.
- 고객지원팀: “기록한 다음 뭘 하죠?”를 다음 씨앗 CTA와 target row로 줄인다.

## Reference teardown / rejected alternative

- Reference: collection idle games는 collection entry 저장 후 next target/next source를 즉시 보여준다.
- Reference: progression tree류 게임은 node completion 뒤 next node CTA를 같은 화면에 배치한다.
- Rejected: 도감 저장 후 기존 album highlight에서 종료 — next target acquisition 동기가 약하다.
- Rejected: 신규 CTA sprite 즉시 생성 — DOM/CSS/target row payoff 검증을 먼저 끝낸 뒤 별도 provenance gate로 분리한다.

## Subagent/Team Routing

- 현재는 단일 React/CSS/visual regression tranche이므로 Codex native subagents/team mode는 사용하지 않는다.
- 필요 시 분리 기준: Browser Use 복구가 필요하면 QA/verifier subtask, 새 FX asset이 필요하면 asset pipeline subtask로 분리한다.
