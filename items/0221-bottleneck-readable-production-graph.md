# WorkUnit #414 - Bottleneck-readable production graph

GitHub issue: #416 - https://github.com/bborok1234/strange-seed-shop/issues/416
Draft PR: #417 - https://github.com/bborok1234/strange-seed-shop/pull/417
Branch: `codex/bottleneck-production-graph`
Source gate: `docs/PRODUCTION_SLICE_READINESS.md`
Game Studio route: `game-studio:game-studio` -> `game-studio:web-game-foundations` -> `game-studio:game-ui-frontend` -> `game-studio:game-playtest`

## Context

`docs/PRODUCTION_SLICE_READINESS.md`가 첫 core gameplay blocking slice를 `Bottleneck-readable production graph`로 고정했다. 기존 열린 #413 모모 sprite strip은 캐릭터 animation 품질에는 맞지만, 현재 blocking gate인 생산/보관/납품 병목 가독성을 먼저 닫지 못한다.

이번 slice는 첫 10분 loop를 다음 구조로 한 화면에서 읽히게 만든다.

`첫 수확 -> 자동 생산 -> 보관 병목 -> 추천 업그레이드 -> 주문/납품 -> 다음 생명체/연구/원정 기대`

## Plan

1. 기존 자동 생산 card와 playfield scene의 데이터 경계를 확인한다.
2. `생산 / 보관 / 납품` 3축을 계산하는 production graph view model을 추가한다.
3. 첫 화면에는 한 줄 요약만 노출하고, 상세는 action card에 묶는다.
4. 첫 추천 병목은 `보관 부족`으로 고정하되, 다른 2축 선택지도 같은 action card에 유지한다.
5. 보관 upgrade는 수치 변화와 화면 prop 변화를 함께 남긴다.
6. fresh/production QA 상태에서 scripted regression과 screenshot evidence를 남긴다.

## Acceptance Criteria

- [x] 정원 첫 화면에 `생산 / 보관 / 납품` 상태가 한 줄 요약으로 보인다.
- [x] 360px/393px 모바일과 desktop mobile-frame에서 요약이 잘리거나 playfield를 가리지 않는다.
- [x] 첫 병목은 `보관 부족` 또는 동등한 경고로 읽히며 추천 upgrade와 연결된다.
- [x] action card 상세에는 부족한 축, 이유, 추천 upgrade, 바뀌는 수치, 바뀌는 화면 prop, 다른 2축 선택지가 보인다.
- [x] 보관 upgrade 실행 후 저장 값과 화면 prop 상태가 같이 변한다.
- [x] 생산 수령과 주문 납품 flow가 기존 first order / repeat order regression을 깨지 않는다.
- [x] Browser Use `iab`를 먼저 시도하고, 막히면 blocker와 Playwright fallback screenshot을 남긴다.

## Verification Commands

- `npx playwright test --config playwright.config.ts tests/visual/p0-mobile-game-shell.spec.ts --grep "병목|자동 생산과 첫 주문"`
- `npx playwright test --config playwright.config.ts tests/visual/desktop-art-share.spec.ts`
- `npm run check:ci`

## Browser Use QA Plan

- Target URL: `http://127.0.0.1:4173/?qaBottleneckGraphReady=1`
- Viewports: current in-app browser, then 393x852 and desktop frame fallback if IAB is unavailable.
- Checks: summary line, storage recommendation, storage prop before/after, production/order controls, no bottom-tab overlap.

## Stop / Blocker Boundaries

- 런타임 이미지 생성, 결제, 외부 배포, production user data는 하지 않는다.
- Browser Use backend가 없는 경우 Playwright fallback으로 진행하되 blocker report를 남긴다.
- PR이 gate를 통과하지 못하면 같은 slice 안에서 보완하고 닫지 않는다.

## Evidence

- Browser Use blocker + visual report: `reports/visual/issue-416-bottleneck-production-graph/visual-report-20260506.md`
- Draft PR: https://github.com/bborok1234/strange-seed-shop/pull/417
- Before screenshot: `reports/visual/issue-416-bottleneck-production-graph/before-storage-393.png`
- After screenshot: `reports/visual/issue-416-bottleneck-production-graph/after-storage-393.png`
- Focused mobile regression: `npx playwright test --config playwright.config.ts tests/visual/p0-mobile-game-shell.spec.ts --grep "병목|자동 생산과 첫 주문"` passed.
- Desktop frame regression: `npx playwright test --config playwright.config.ts tests/visual/desktop-art-share.spec.ts` passed.
- Build: `npm run build` passed.
- CI gate: `npm run check:ci` passed.
