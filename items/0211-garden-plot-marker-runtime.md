# WorkUnit — 정원 밭 marker를 실제 화면 object로 교체

- ID: `0211`
- Status: review
- GitHub issue: #403
- Draft PR: #404 — https://github.com/bborok1234/strange-seed-shop/pull/404
- Source WorkUnit: `items/0210-garden-hud-plot-marker-assets.md`
- Source spec: `reports/deliberation/garden-respecting-hud-assets/spec.md`
- Game Studio route: `game-studio:game-studio` -> `game-studio:game-ui-frontend` -> `game-studio:game-playtest`
- Campaign source: P0.5 Idle Core + Creative Rescue

## Goal

PR1에서 생성한 plot marker raster 후보를 `GardenPlotCard` runtime에 실제로 적용한다. 목표는 정원 중앙 밭 버튼이 cream rectangle 카드가 아니라 심고, 키우고, 수확하는 낮은 정원 object로 읽히게 만드는 것이다.

## Plan

1. `public/assets/manifest/assetManifest.json`에 PR1에서 통과한 네 PNG를 accepted `ui_frame` asset으로 등록한다.
2. 각 manifest entry에 `screen_moment`, `player_verb`, `state_binding`, `text_safe_zone`, `must_not_obscure`를 notes/tags로 남긴다.
3. `src/game/playfield/GardenPlayfieldHost.tsx`에서 `GardenPlotCard`에 state별 raster marker layer를 추가한다.
   - empty: `ui_hud_plot_seedbed_empty_001`
   - growing/source: `ui_hud_plot_seedbed_growing_001`
   - ready: growing seedbed + `ui_hud_plot_ready_ribbon_001`
   - text plate: 작고 종속적인 label backing으로만 사용
4. `src/styles.css`에서 cream rectangle 배경을 제거하고 transparent edge, low shadow, text-safe layer로 재구성한다.
5. 기존 DOM button, aria-label, click target은 유지하되 fresh empty first plot은 starter seed를 바로 심을 수 있는 시작 동사로 연다.
6. Browser Use `iab`를 우선 시도해 desktop default, loaded ready plot, dock-expanded seeds tab, mobile 393x852 screenshot evidence를 남긴다. Browser Use가 세션 도구에서 막히면 blocker를 기록하고 Playwright screenshot fallback을 사용한다.
7. asset/content/UI checks와 build를 실행하고, WorkUnit/roadmap/control room/heartbeat에 evidence를 갱신한다.

## Acceptance Criteria

- [x] 새 asset은 runtime generation 없이 pre-produced raster PNG provenance를 유지한다.
- [x] 각 asset entry에 `screen_moment`, `player_verb`, `state_binding`, `text_safe_zone`, `must_not_obscure`가 기록된다.
- [x] `GardenPlotCard`의 DOM button, aria-label, click target이 유지되고 fresh first plot은 starter seed planting action으로 동작한다.
- [x] screenshot에서 plot card가 기존 cream rectangle이 아니라 정원 plot marker object로 읽힌다.
- [x] ready plot은 ribbon affordance가 보이되 label/source/progress를 가리지 않는다.
- [x] ready plot은 상단 선반이 아니라 정원 바닥 action area에 놓인다.
- [x] dock-expanded seeds tab에서 plot card가 dev/player panel에 가리지 않는다.
- [x] mobile 393x852에서 body scroll, bottom tab overlap, text clipping이 없다.
- [x] fresh desktop/mobile reset에서 잎/씨앗이 없어도 plot marker의 무료 심기 동사로 게임을 시작할 수 있다.
- [x] marker와 production actor에 최소 idle motion이 있어 static pasted-picture 회귀를 줄인다.
- [x] merchant follow-up / second-chapter 모바일 상태에서 action panel overflow가 없다.
- [x] 두 번째 단골 납품 직후 playfield crate는 chain-complete handoff보다 `merchant-second-delivered` 상태를 먼저 보여준다.
- [x] `npm run check:asset-provenance`
- [x] `npm run check:asset-style`
- [x] `npm run check:asset-normalization`
- [x] `npm run check:asset-alpha`
- [x] `npm run check:art-share`
- [x] `npm run check:p0-ui-ux`
- [x] `npm run check:visual` 또는 이번 failure mode를 직접 겨냥한 focused visual regression
- [x] `npm run check:ci`
- [x] `npm run build`

## Reference Teardown

- Egg, Inc.처럼 생산 공간은 카드 설명보다 tappable object가 먼저 보여야 한다.
- Idle Miner Tycoon처럼 player verb 위치가 시각적으로 구분되어야 한다. 밭은 메뉴 카드가 아니라 생산 엔진의 action node다.
- Cell to Singularity처럼 다음 행동은 긴 설명이 아니라 화면 안의 object state와 progress affordance로 읽혀야 한다.

Rejected alternative: side dock resource skin을 먼저 바꾸기. 정원 중앙의 cream plot rectangle이 현재 첫 5분 production readability blocker라서, HUD 주변부보다 player verb surface를 먼저 고친다.

## Creative Brief

- Player verb: 씨앗 심기, 성장시키기, 수확하기.
- Production/progression role: 첫 5분 생산 엔진의 시작점과 수확/도감 progression entry.
- Screen moment: fresh garden, growing plot, ready harvest, desktop dock-expanded player tab, mobile 393x852.
- Asset/FX decision: 기존 PR1 Codex native raster plot marker family를 manifest accepted로 승격하고, ready ribbon을 harvest affordance로 결합한다.
- Game-feel target: 버튼을 누르기 전부터 “밭 object를 건드린다”는 감각을 만든다.

## Game Studio Department Signoff

- 기획팀: 첫 행동 위치인 밭을 app card가 아니라 plant/grow/harvest verb object로 바꾼다.
- 리서치팀: 경쟁작 idle game의 생산 node readability를 축소 적용한다. 단순 색/여백 변경은 거절한다.
- 아트팀: Codex native raster PNG provenance를 유지하고, `ui_hud_plot_text_plate_001`은 small subordinate plate로 제한한다.
- 개발팀: `GardenPlayfieldHost.tsx`, `src/styles.css`, manifest만 만지는 runtime skin slice다. save schema와 Phaser scene logic은 변경하지 않는다.
- 검수팀: Browser Use 우선 screenshot, Playwright fallback, `check:visual` layout gate를 evidence로 남긴다.
- 마케팅팀: mock-only 내부 gameplay visual improvement이며 외부 채널/결제/광고 약속 없음.
- 고객지원팀: “정원 화면이 카드 묶음처럼 보인다”는 첫 5분 confusion risk를 줄인다.

## Subagent/Team Routing

Codex native subagent는 사용하지 않는다. 이번 slice는 manifest, 한 React component, CSS, visual tests가 강하게 결합된 단일 write scope이며, 병렬 작업보다 로컬 통합과 screenshot 판정이 더 중요하다.

## QA / Playtest Plan

- Browser Use `iab`: local app에서 첫 정원 화면, ready plot, dock-expanded seeds tab, mobile 393x852를 직접 확인한다.
- Fallback: Browser Use 도구가 사용할 수 없으면 Playwright screenshot을 `reports/visual/`에 저장하고 blocker를 report에 명시한다.
- Regression: 기존 `tests/visual/desktop-art-share.spec.ts`와 `tests/visual/p0-mobile-game-shell.spec.ts`를 통해 dock overlap, body scroll, bottom tab overlap, visible overflow를 확인한다.

## Stop / Blocker Boundaries

- 신규 이미지 생성은 scope 밖이다. PR1 asset이 runtime 합성에서 실패하면 crop/scale/reject report를 남기고 멈춘다.
- 이번 PR은 static marker와 fresh-start deadlock 복구가 범위다. 캐릭터 animation/actor payoff는 다음 WorkUnit으로 분리한다.
- SVG/vector/code-native game graphic은 accepted manifest asset으로 만들지 않는다.
- 결제, 외부 배포, production customer data, save migration은 건드리지 않는다.

## Verification Notes

- GitHub issue: https://github.com/bborok1234/strange-seed-shop/issues/403
- Browser Use `iab` report: `reports/visual/issue-403-garden-plot-marker-runtime-20260505.md`
- `reports/visual/issue-403-garden-plot-marker-runtime/browser-use-ready-plot-iab.png`
- `reports/visual/issue-403-garden-plot-marker-runtime/browser-use-default-garden-iab.png`
- `reports/visual/issue-403-garden-plot-marker-runtime/browser-use-seeds-tab-iab.png`
- `reports/visual/issue-403-garden-plot-marker-runtime/browser-use-fresh-start-iab.png`
- `reports/visual/issue-403-garden-plot-marker-runtime/browser-use-fresh-start-after-plant-iab.png`
- `reports/visual/issue-403-garden-plot-marker-runtime/browser-use-ready-floor-placement-iab.png`
- Browser Use `iab` fresh-start result: `말랑잎 씨앗 무료로 심기` appears on reset and changes to `말랑잎 씨앗 성장시키기` after click.
- Browser Use `iab` ready-position result: plot marker moved from the upper shelf band to the garden floor action area and text is reduced to safe-zone label + `수확`.
- Browser Use `iab` final 4173 fresh-start check: `reports/visual/issue-403-garden-plot-marker-runtime/browser-use-final-fresh-4173-iab.png`, marker count 2, `무료로 심기` present.
- `npm run check:asset-provenance` passed.
- `npm run check:asset-style` passed.
- `npm run check:asset-normalization` passed.
- `npm run check:asset-alpha` passed.
- `npm run check:p0-ui-ux` passed.
- `npm run check:art-share` passed: 21 passed.
- Focused mobile regression passed: `npx playwright test tests/visual/p0-mobile-game-shell.spec.ts --grep "첫 화면은 밭 marker에서 바로 시작된다|화면은 body scroll 없이 playfield와 하단 탭을 보존한다" --config playwright.config.ts`, 8 passed.
- Targeted regression after helper race fix passed: `npx playwright test tests/visual/p0-mobile-game-shell.spec.ts --grep "모바일 다음 기록 목표 씨앗은 이슬연금 라미 수확 payoff로 닫힌다" --config playwright.config.ts`.
- Merchant follow-up + second-chapter focused regressions passed after mobile overflow and delivered-state precedence fixes: `npx playwright test tests/visual/p0-mobile-game-shell.spec.ts --grep "상인 주문상자 보상은 단골 납품 주문으로 이어진다|단골 두 번째 chapter" --config playwright.config.ts`, 2 passed.
- `npm run check:ci` passed after placement/motion fix.
- `npm run build` passed as part of `npm run check:ci`.
- `npm run check:visual` full-suite attempt reached the long merchant chapter tests, exposed two regressions, and was stopped for focused repair. The failed cases passed after fixes; the full 96-test suite was not rerun end-to-end because the merchant path alone takes several minutes per case.
