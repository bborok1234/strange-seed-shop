# WorkUnit #326 — 라미 도감 저장을 포장잎 상인 다음 목표로 이어지게 만든다

- GitHub issue: #326 https://github.com/bborok1234/strange-seed-shop/issues/326
- Campaign source of truth: P0.5 Idle Core + Creative Rescue
- Status: PR publication ready
- Branch: `codex/0326-rami-record-next-merchant-goal`
- Created: 2026-05-03

## Plan

1. #324 flow 이후 `이슬연금 라미` reveal의 `도감에 기록하기`가 album card와 다음 목표를 어떻게 보여주는지 매핑한다.
2. 저장 직후 `다음 기록 목표: 포장잎 상인`과 `다음 기록으로 이어가기: 젤리콩 씨앗` CTA/target row가 명확히 보이도록 UI/state gap을 고친다.
3. 393px 모바일에서 album card/seeds target row/bottom tab이 겹치지 않게 유지하고 신규 accepted manifest asset/runtime image generation은 쓰지 않는다.
4. Browser Use iab를 현재 세션에서 먼저 시도하고, 실패 시 #326 전용 blocker를 `reports/visual/`에 남긴다.
5. focused Playwright screenshot과 layout invariant를 추가한 뒤 `check:visual`, `check:ci`, 운영 mirror checks를 통과시킨다.

## 수용 기준

- [x] `이슬연금 라미` reveal에서 `도감에 기록하기`를 누르면 album 화면이 라미 저장과 다음 목표 `포장잎 상인`을 함께 보여준다.
- [x] album CTA가 `다음 기록으로 이어가기: 젤리콩 씨앗` 또는 동등한 source seed action을 제공한다.
- [x] seeds target row가 `젤리콩 씨앗`, `포장잎 상인`, `다음 기록` 재순환 affordance를 보여준다.
- [x] 신규 accepted manifest asset 없이 existing visuals + DOM/CSS HUD/CTA/reward motion으로 구현하고 runtime image generation/API를 호출하지 않는다.
- [x] 393px 모바일에서 album/seeds row/bottom tab이 겹치지 않고 overflow를 만들지 않는다.
- [x] Browser Use iab current-session 시도 evidence 또는 blocker, focused Playwright screenshot, `npm run check:visual`, `npm run check:ci`가 남는다.

## 검증 명령

- `npm run build`
- `npx playwright test --config playwright.config.ts --grep "라미 도감 저장|포장잎 상인|다음 기록 목표"`
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

- #324의 라미 수확 이후 next goal ordering이 `포장잎 상인`이 아니라 다른 unlocked seed pool target으로 계산되면 acceptance를 조정해야 한다.
- 라미 저장 후 copy가 #322 copy와 지나치게 같으면 “세 번째 목표” 감각이 약할 수 있다.
- Browser Use iab backend는 이번 세션에서 반복 실패했다. 그래도 #326에서 새로 시도하고 blocker/evidence를 남긴다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist: `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- Sprite/asset route: 신규 accepted manifest asset 없음. existing `포장잎 상인`/`젤리콩 씨앗` visuals, DOM/CSS CTA, target row highlight로 제한한다. 새 sprite/FX가 필요하면 별도 asset provenance WorkUnit으로 분리한다.

## Studio Campaign Gate

- Player verb: `이슬연금 라미를 도감에 저장하고 포장잎 상인 목표로 이동하기`
- Production/progression role: 라미 수확 reveal → 도감 저장 → next creature/seed target 확인 → seeds target row 재진입
- Screen moment: #324 reveal의 `도감에 기록하기` 직후 album/seeds 화면
- Concrete visual/game-feel payoff: `다음 기록 목표: 포장잎 상인`, `다음 기록으로 이어가기: 젤리콩 씨앗`, seeds target row highlight, next target preview, bottom-tab/overflow-safe 393px screenshot
- Competition production gap: collection idle games는 collection reveal 저장 후 다음 target identity/source를 반복적으로 유지한다. 두 번째 재순환 이후 목표가 사라지는 대안은 reject한다.
- Playtest evidence: Browser Use iab 우선, blocker 시 issue 전용 blocker + Playwright screenshot + layout invariant.

## Game Studio Department Signoff

- 기획팀: “하나만 더”는 두 번째 재순환 뒤에도 다음 named target이 살아 있을 때 강화된다.
- 리서치팀: reference collection games는 reveal 저장마다 다음 collection target/source를 즉시 보여준다.
- 아트팀: 신규 accepted manifest asset 없이 existing `포장잎 상인`/`젤리콩 씨앗` visuals와 DOM/CSS CTA/row highlight로 제한한다. 새 FX는 별도 provenance WorkUnit.
- 개발팀: `src/App.tsx`, `src/styles.css`, `tests/visual/p0-mobile-game-shell.spec.ts` 중심의 좁은 tranche.
- 검수팀: Browser Use iab current-session 시도, album/seeds screenshot, layout invariant 필수.
- 마케팅팀: mock-only promise. 외부 채널/실결제 없음.
- 고객지원팀: “라미 저장 후 다음은 뭔가요?”를 포장잎 상인 CTA로 줄인다.

## Reference teardown / rejected alternative

- Reference: collection idle games는 collection entry 저장 후 next target/source를 반복적으로 보여준다.
- Reference: progression tree류 게임은 node completion 뒤 다음 node와 source를 같은 화면에서 바로 제시한다.
- Rejected: 라미 저장 후 종료 — 다음 target이 사라져 unlocked pool 재순환 promise가 약하다.
- Rejected: 신규 merchant FX sprite 즉시 생성 — DOM/CSS/target row payoff 검증을 먼저 끝낸 뒤 별도 provenance WorkUnit으로 분리한다.

## Subagent/Team Routing

- 현재는 단일 React/CSS/visual regression tranche이므로 Codex native subagents/team mode는 사용하지 않는다.
- 필요 시 분리 기준: next goal ordering에 설계 이견이 생기면 architect/verifier subtask, 신규 FX asset이 필요하면 asset pipeline subtask로 분리한다.


## 구현 결과

- `src/App.tsx`: 수확 reveal이 선택한 실제 생명체(`harvestedCreature.id`)를 도감 discovered list에 저장하도록 고쳐, `방울새싹 씨앗` 두 번째 pool target인 `이슬연금 라미` 저장 뒤 다음 unlocked target이 `젤리콩 씨앗 → 포장잎 상인`으로 계산되게 했다.
- `tests/visual/p0-mobile-game-shell.spec.ts`: 라미 저장 → `포장잎 상인` 다음 기록 목표 → `젤리콩 씨앗` target row 재진입 regression을 추가했다.
- 같은 테스트 파일의 긴 모바일 수집 루프에서 ready/reveal 상태를 수확 완료로 인식하는 `growAndHarvestSeed` 헬퍼를 추가해, 앱은 이미 reveal 상태인데 테스트가 성장 버튼만 기다리는 오탐을 줄였다.
- 신규 accepted manifest asset, runtime image generation/API 호출, 결제/외부 배포/고객 데이터 변경 없음.

## 검증 결과

- Browser Use iab current-session 시도: blocked, `reports/visual/browser-use-blocker-0326-20260503.md`.
- Screenshot: `reports/visual/issue-326-rami-record-next-merchant-goal-393.png`.
- `npm run build` — pass.
- `npx playwright test --config playwright.config.ts --grep "연구 단서 도감 기록|라미 도감 저장|새 기록 후속 수확은 예고했던"` — 3 passed.
- `npx playwright test --config playwright.config.ts --grep "새 기록 후속 저장은 다음 기록 목표 재순환"` — 1 passed.
- `npm run check:visual` — 66 passed.
- `npm run check:ci` — pass.
