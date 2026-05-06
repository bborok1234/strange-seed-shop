# WorkUnit — 주문 납품 순간을 playfield reward motion으로 읽히게 만들기

- ID: `0214`
- Status: review
- GitHub issue: #409 — https://github.com/bborok1234/strange-seed-shop/issues/409
- Draft PR: #410 — https://github.com/bborok1234/strange-seed-shop/pull/410
- Source feedback: `studio-operate` next queue after #408 merge/main CI
- Campaign source: P0.5 Idle Core + Creative Rescue
- Game Studio route: `game-studio:game-studio` -> `game-studio:game-ui-frontend` -> `game-studio:game-playtest`

## Goal

첫 주문 납품 순간이 아래 panel receipt에만 머무르지 않고, 정원 playfield 안 주문상자 자체가 burst/reward motion으로 반응하게 한다. 플레이어가 `주문 납품`을 눌렀을 때 “상자가 열리고 보상이 정원에서 발생했다”는 장면으로 읽혀야 한다.

## Candidate Issue List

1. **선택: 주문 납품 playfield reward motion**
   - Player verb: 주문 납품.
   - Production/progression role: 주문/납품 보상이 다음 씨앗·연구 progression으로 이어지는 순간.
   - Screen moment: 첫 5분 `?qaProductionReady=1`에서 생산 수령 후 주문 납품.
   - Asset/FX: accepted `fx_order_delivery_burst_001` strip을 playfield 주문상자에 runtime binding한다.
   - Playtest evidence: Browser Use before/after screenshot + mobile/desktop regression.
2. **큰 방향 점프 후보: 첫 화면 생산 엔진 전체 재배치**
   - 장점: production readability를 가장 크게 바꿈.
   - 거절: #407 직후 desktop shell 안정화가 끝났고, 현재 production card/order lane의 납품 moment가 먼저 game-feel blocker다.
3. **다른 creature 고유 actor strip**
   - 장점: 수집 생명체 소유감 강화.
   - 거절: 새 asset generation과 manifest review가 필요하고, 주문 납품 feedback 부재보다 첫 5분 진행 이해에 직접성이 낮다.

## Strategic Jump Check

큰 방향 점프 후보는 `첫 화면 생산 엔진 전체 재배치`다. 이번 slice는 더 작지만, 단순 polish가 아니라 주문 납품이라는 core verb의 보상 motion을 playfield에 붙인다. 즉 `reward motion`과 `order crate visual state`를 직접 개선해 production loop의 이해도를 올린다.

## Reference Teardown

- Egg, Inc.와 Idle Miner류는 수확/납품/수거 버튼 이후 화면 object가 즉시 반응한다. 보상 숫자만 바뀌면 생산 엔진이 정적 UI처럼 보인다.
- 현재 게임은 주문상자 asset과 FX strip이 있지만, 납품 순간의 주된 증거가 panel receipt와 text라 playfield object reaction이 약하다.

## Creative Brief

- Player fun target: 주문을 끝냈을 때 상자가 열리고 보상이 튀는 작은 만족감.
- Core loop role: 자동 생산 -> 주문 상자 채움 -> 납품 -> 보상/다음 성장 선택.
- Screen moment: `qaProductionReady=1`에서 생산 잎 수령 후 첫 주문 납품.
- Required assets: 기존 accepted `ui_order_crate_leaf_001`, `fx_order_delivery_burst_001`.
- Game-feel requirements: order crate 근처에서 4-frame burst가 재생되고, reduced-motion에서도 상태 텍스트와 crate highlight가 남는다.

## Game Studio Department Signoff

- 기획팀: `주문 납품` verb를 first 5 minutes의 보상 순간으로 강화한다.
- 리서치팀: 경쟁작 기준 production object reaction gap을 닫는다.
- 아트팀: 새 그래픽 생성 없이 accepted raster FX strip의 manifest animation binding을 runtime에 연결한다. 신규 asset generation은 scope 밖.
- 개발팀: `GardenPlayfieldViewModel.productionScene`에 order FX binding을 추가하고 `GardenPlayfieldHost`에서 렌더링한다.
- 검수팀: Browser Use `iab` before/after, focused mobile regression, art-share bounds를 확인한다.
- 마케팅팀: mock-only devlog angle은 “주문상자가 실제로 반응하는 정원”이며 외부 채널 게시 없음.
- 고객지원팀: 주문 납품 후 보상 의미가 receipt-only보다 명확해져 첫 5분 혼란을 줄인다.

## Subagent/Team Routing

사용하지 않는다. 이번 slice는 `App.tsx`, playfield host/types, CSS, focused tests의 단일 runtime path라 병렬 산출물보다 직접 구현과 Browser Use 검증이 빠르고 충돌 위험이 낮다.

## Plan

1. Browser Use `iab`로 `?qaProductionReady=1` before screenshot을 저장한다.
2. GitHub issue로 promotion 후 branch 구현을 진행한다.
3. `GardenPlayfieldViewModel.productionScene`에 optional order reward motion asset metadata를 추가한다.
4. `orderDeliveryReceipt` 활성 순간에 `fx_order_delivery_burst_001`을 playfield order crate 위에서 재생한다.
5. CSS로 4-frame strip animation, crate pulse, reduced-motion fallback을 정의한다.
6. focused visual regression에 data binding, visibility, bounds, event telemetry를 추가한다.
7. Browser Use `iab` after screenshot과 local checks를 저장한다.
8. draft PR을 만들고 required checks/main CI까지 관찰한다.

## Acceptance Criteria

- [x] 주문 납품 직후 playfield order crate 내부/근처에 `fx_order_delivery_burst_001` animation binding이 보인다.
- [x] FX는 4 frame strip metadata를 data attribute로 노출한다.
- [x] FX와 crate pulse가 playfield bounds 및 하단 tab을 가리지 않는다.
- [x] Browser Use `iab` before evidence가 있다. after는 Browser Use data URL blocker로 Playwright fallback evidence를 남겼다.
- [x] focused mobile order regression이 통과한다.
- [x] `npm run check:art-share`
- [x] `npm run build`

## QA / Playtest Plan

- Browser Use `iab`: `http://127.0.0.1:4173/?qaProductionReady=1` before/after screenshot.
- Playwright: `tests/visual/p0-mobile-game-shell.spec.ts`의 production/order flow에 playfield FX assertion 추가.
- Desktop: `npm run check:art-share`로 stage/dock/actor/plot 회귀 확인.

## Verification Notes

- Browser Use before screenshot: `reports/visual/issue-0214-order-reward-motion-before-browseruse-20260506.png`
- Browser Use after blocker: selected tab was a Chromium `ERR_CONNECTION_REFUSED` data error page, and Browser Use blocked navigation from that data URL state.
- Playwright fallback after screenshot: `reports/visual/issue-0214-order-reward-motion-after-playwright-20260506.png`
- Visual report: `reports/visual/issue-0214-order-delivery-playfield-reward-motion-20260506.md`
- `npx playwright test tests/visual/p0-mobile-game-shell.spec.ts --grep "모바일 자동 생산과 첫 주문" --config playwright.config.ts`: 1 passed.
- `npm run check:art-share`: 24 passed.
- `npm run build`: passed.

## Stop / Blocker Boundaries

- 새 asset generation은 하지 않는다.
- 런타임 이미지 생성, 결제, 외부 배포, save migration은 scope 밖이다.
- Browser Use plugin이 중단되면 blocker를 기록하고 Playwright screenshot을 fallback evidence로 남긴다.
