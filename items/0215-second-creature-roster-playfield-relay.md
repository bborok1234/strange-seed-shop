# WorkUnit — 두 번째 생명체 roster 합류를 playfield relay motion으로 읽히게 만들기

- ID: `0215`
- Status: active
- GitHub issue: #411 — https://github.com/bborok1234/strange-seed-shop/issues/411
- Draft PR: pending
- Source feedback: #410 merge 후 Studio Harness v3 queue empty intake
- Campaign source: P0.5 Idle Core + Creative Rescue
- Game Studio route: `game-studio:game-studio` -> `game-studio:game-ui-frontend` -> `game-studio:game-playtest`

## Goal

두 번째 생명체를 발견한 뒤 생산 roster가 텍스트 chip에만 머무르지 않게 한다. `방패새싹 모모`가 정원 playfield 안에서 포리 옆 보조 동료로 등장하고, 주문/생산 lane이 “혼자 일하는 상자”가 아니라 생명체 팀이 relay로 움직이는 장면처럼 보여야 한다.

## Candidate Issue List

1. **선택: second creature roster playfield relay**
   - Player verb: 두 번째 생명체 발견 후 자동 생산 확인.
   - Production/progression role: 도감 확장이 생산률/roster 확장으로 이어지는 첫 team payoff.
   - Screen moment: `?qaResearchExpeditionReady=1` 또는 두 번째 생명체 보유 상태의 정원.
   - Asset/FX: 기존 accepted `creature_herb_common_002` raster를 playfield support actor로 runtime binding하고 CSS relay motion을 부여한다.
   - Playtest evidence: Browser Use before/after screenshot, focused mobile regression, art-share gate.
2. **큰 방향 점프 후보: 신규 모모 work idle sprite strip 생성**
   - 장점: 진짜 sprite animation 품질 상승.
   - 거절: 이미지 생성/정규화/manifest review가 들어가 이번 bounded pass를 크게 만든다. 이번 slice는 기존 accepted raster를 playfield에 합류시키는 behavior payoff를 먼저 닫는다.
3. **상점/원정 다음 주문 추가**
   - 장점: progression breadth 증가.
   - 거절: 사용자가 지적한 “캐릭터가 도감에만 존재” 문제와 직접성이 낮고, visual/game-feel payoff가 약하다.

## Strategic Jump Check

큰 방향 점프는 신규 actor sprite strip 제작이다. 이번 slice는 그 전 단계로, 이미 가진 creature art를 dashboard chip 밖으로 꺼내 playfield scene object로 합류시킨다. 새 그림 없이도 `도감 발견 -> 정원 동료 합류 -> 생산 scene 변화`를 연결하는 production blocker를 제거한다.

## Reference Teardown

- Idle Miner, Egg, Inc.류는 새 worker/creature가 unlock되면 생산 scene의 worker count 또는 movement가 즉시 바뀐다.
- 현재 게임은 roster text와 card portrait가 존재하지만, playfield actor는 primary worker 중심이라 두 번째 생명체 발견 payoff가 화면 안에서 약하다.

## Creative Brief

- Player fun target: “새로 발견한 모모가 진짜 정원에 들어와 포리와 같이 일한다.”
- Core loop role: 수집이 생산 team 확장으로 이어진다는 증거.
- Screen moment: `qaResearchExpeditionReady=1` 정원 production scene.
- Required assets: 기존 accepted `creature_herb_common_001`, `creature_herb_common_002`.
- Game-feel requirements: support actor는 primary actor/order crate/plot marker를 가리지 않고, 작은 bob/relay motion으로 살아 있어야 한다. reduced-motion에서도 support actor와 label은 남는다.

## Game Studio Department Signoff

- 기획팀: 두 번째 생명체 발견이 단순 도감 수치가 아니라 생산 team payoff로 읽히게 한다.
- 리서치팀: 경쟁작 기준 새 worker unlock 후 scene 변화가 즉시 보이는 패턴을 따른다.
- 아트팀: 신규 asset generation 없이 accepted raster creature를 쓰며, sprite strip generation은 다음 별도 WorkUnit 후보로 남긴다.
- 개발팀: `GardenPlayfieldViewModel.productionScene`에 support worker metadata를 추가하고 `GardenPlayfieldHost`에서 rendering한다.
- 검수팀: Browser Use `iab` before/after와 focused regression으로 support actor bounds, bottom tab overlap, body scroll을 확인한다.
- 마케팅팀: mock devlog angle은 “도감 발견이 정원 팀 합류로 이어짐”이며 외부 게시 없음.
- 고객지원팀: 두 번째 생명체가 왜 중요한지 화면에서 바로 보이므로 첫 장기 목표 혼란을 줄인다.

## Subagent/Team Routing

사용하지 않는다. 변경 범위는 playfield view model/host/CSS/focused visual test의 단일 surface이며, 병렬 작업보다 직접 구현과 브라우저 검증이 빠르다.

## Plan

1. Browser Use `iab`로 두 번째 생명체 roster 상태 before screenshot을 저장한다.
2. GitHub issue로 promotion한다.
3. `productionScene`에 support worker actor metadata를 추가한다.
4. `GardenPlayfieldHost`에 support actor rail/relay label을 추가한다.
5. CSS로 mobile/desktop bounds를 보존하는 small relay motion과 reduced-motion fallback을 정의한다.
6. focused mobile regression에 `creature_herb_common_002` support actor visibility, bounds, scroll/tab overlap assertion을 추가한다.
7. Browser Use after screenshot과 `check:art-share`, focused test, build evidence를 남긴다.
8. draft PR을 만들고 checks/main CI까지 관찰한다.

## Acceptance Criteria

- [x] 두 번째 생명체 보유 상태에서 playfield production scene에 `방패새싹 모모` support actor가 보인다.
- [x] support actor는 `creature_herb_common_002` accepted raster asset을 runtime binding한다.
- [x] support actor motion은 plot marker, order crate, bottom tab을 가리지 않는다.
- [x] Browser Use `iab` before/after evidence가 있다.
- [x] focused mobile regression이 support actor visibility와 bounds를 검증한다.
- [x] `npm run check:art-share`
- [x] `npm run build`

## QA / Playtest Plan

- Browser Use `iab`: `http://127.0.0.1:4173/?qaResearchExpeditionReady=1` before/after screenshot.
- Playwright: `tests/visual/p0-mobile-game-shell.spec.ts`에 두 번째 creature roster playfield assertion 추가.
- Desktop: `npm run check:art-share`.

## Verification Notes

- Browser Use before screenshot: `reports/visual/issue-0215-second-creature-roster-before-browseruse-20260506.png`
- Browser Use after screenshot: `reports/visual/issue-0215-second-creature-roster-after-browseruse-20260506.png`
- Visual report: `reports/visual/issue-0215-second-creature-roster-playfield-relay-20260506.md`
- Browser Use after confirmed `supportCount=1`, `supportAsset=creature_herb_common_002`.
- `npx playwright test tests/visual/p0-mobile-game-shell.spec.ts --grep "모바일 생산 roster" --config playwright.config.ts`: 1 passed.
- `npm run check:art-share`: 24 passed.
- `npm run build`: passed.

## Stop / Blocker Boundaries

- 신규 image generation/sprite strip 제작은 이번 slice 밖이다.
- 런타임 이미지 생성, 결제, 외부 배포, save migration은 scope 밖이다.
- Browser Use plugin이 중단되면 blocker를 기록하고 Playwright screenshot을 fallback evidence로 남긴다.
