# #298 정원에서 생산 잎을 수령할 때 포리 작업 FX를 보이게 만든다

## 상태

- 상태: verification-ready
- GitHub issue: #298 `정원에서 생산 잎을 수령할 때 포리 작업 FX를 보이게 만든다`
- Branch: `codex/0298-production-tick-worker-fx`
- Studio Harness v3 route: GitHub-authoritative WorkUnit intake. `$seed-ops` 사용 안 함.
- Campaign source of truth: `P0.5 Idle Core + Creative Rescue`
- Game Studio route: `game-studio:game-studio` → `game-studio:game-ui-frontend` + `game-studio:sprite-pipeline` + `game-studio:game-playtest`

## Plan

1. 현재 production FX/asset manifest/worker playfield state를 매핑한다. ✅
2. gpt-image-2 API 가능 여부와 기존 accepted raster FX를 확인한다. `OPENAI_API_KEY`/`SEED_ASSET_IMAGE_MODEL` 부재이고, 기존 `fx_production_tick_leaf_001` raster FX strip이 manifest binding을 이미 통과했으므로 새 API 생성 대신 runtime binding/payoff에 연결한다. ✅
3. `생산 잎 수령` 직후 action surface에 포리 작업 완료 receipt를 띄우고, playfield actor/order crate에 `+n 잎 수령`/`+n 잎 이동` 상태를 연결한다. ✅
4. 수령 telemetry에 order progress와 `rewardMotion: worker_leaf_burst`를 남긴다. ✅
5. 모바일 393px visual regression으로 수령 전/후, overflow, bottom-tab overlap, FX strip 크기를 고정한다. ✅
6. Browser Use iab 우선 QA 또는 current-session blocker + Playwright fallback evidence를 남긴다. ✅
7. roadmap/dashboard/control room/PR evidence를 갱신한다. 진행 중

## 수용 기준

- [x] `생산 잎 수령` 실행 직후 worker/leaf reward motion이 정원 playfield 또는 action surface에서 보인다.
- [x] asset/FX는 accepted raster PNG `public/assets/game/fx/fx_production_tick_leaf_001_strip.png`와 manifest animation binding을 사용한다. 새 그래픽 asset을 만들지 않았으므로 SVG/vector/code-native asset 추가 없음.
- [x] order progress 증가와 reward telemetry가 deterministic test로 검증된다.
- [x] 모바일 393px에서 body scroll, panel overflow, bottom-tab overlap 회귀가 없다.
- [x] Browser Use `iab` current-session blocker + Playwright fallback screenshot을 남긴다.
- [x] `npm run check:ci`가 통과한다.

## 검증 명령

- [x] `npm run build`
- [x] `npx playwright test --config playwright.config.ts --grep "자동 생산과 첫 주문"`
- [x] `npm run check:visual`
- [x] `npm run check:ci`

## Asset/FX binding evidence

- Manifest id: `fx_production_tick_leaf_001`
- File: `public/assets/game/fx/fx_production_tick_leaf_001_strip.png`
- Kind: spritesheet
- Frames: 4
- Frame size: 160x160
- Intended frame rate: 10fps
- Binding: `effect.production_tick_fx`, action `claim_production`
- Runtime payoff: `triggerProductionFx("production")`, `production-claim-receipt`, playfield `+n 잎 이동`, action-surface worker pulse.

## 리스크

- 새 asset 생성은 API key/model env가 없어 진행하지 않았다. 이번 WorkUnit은 새 asset intake가 아니라 accepted raster FX의 runtime reward motion/payoff 연결로 범위를 고정한다.
- 기존 asset 재사용만으로 production payoff를 주장하지 않기 위해 action surface receipt, playfield state, reward motion, order progress telemetry를 함께 묶었다.
- worker/leaf burst motion이 action surface를 키우면 모바일 393px overflow가 재발할 수 있어 screenshot + layout invariant로 고정했다.
- Browser Use iab backend는 현재 세션에서도 discovery 실패했다. blocker는 `reports/visual/browser-use-blocker-0298-20260503.md`에 남겼다.

## Reference teardown

- Egg, Inc.: 생산 주체와 재화 흐름이 화면 motion으로 계속 보인다.
- Idle Miner Tycoon: worker/manager가 생산을 수행하고 수령/운반 motion이 다음 업그레이드 판단으로 이어진다.
- Cell to Singularity: click/idle reward가 즉각적인 시각 feedback과 다음 unlock progress로 연결된다.

## Creative brief

- Player value: “포리가 일해서 잎을 만들었고, 내가 수령하자 주문 상자가 채워졌다”를 즉시 이해한다.
- Art direction: 기존 말랑잎 포리 raster style과 같은 조명/외곽선/투명 배경. accepted leaf FX strip을 수령 verb에 붙여 64px에서도 잎/반짝임/수령 방향성이 읽히게 한다.
- Motion tone: 짧고 통통 튀는 leaf burst, reduced-motion에서는 과도한 반복을 줄인다.

## Game Studio Department Signoff

- 기획팀: player verb는 `생산 잎 수령하기`; core loop role은 자동 생산 → 주문 progress.
- 리서치팀: 경쟁작 production gap은 worker/reward motion 부재.
- 아트팀: 새 API 생성 대신 accepted raster FX strip을 재사용하되, frame count/frame size/fps/manifest binding을 evidence에 고정한다.
- 개발팀: `src/App.tsx`, CSS animation, visual regression test를 작은 tranche로 수정한다.
- 검수팀: Browser Use iab 우선; current-session blocker와 Playwright screenshot fallback. 393px overflow/bottom-tab invariant 필수.
- 마케팅팀: mock-only devlog angle은 “포리가 실제로 일하는 정원”이다. 실채널 action 없음.
- 고객지원팀: 첫 5분 혼란 risk는 “생산 잎 수령이 왜 중요한지 모름”; FAQ note는 수령하면 주문 상자가 채워진다는 설명.

## Strategic Jump Check

전체 art direction 점프보다 이 후보를 먼저 고른 이유는 첫 화면 생산 엔진이 이미 배치된 상태에서 가장 가까운 high-severity confusion이 `생산 잎 수령`의 감각 부족이기 때문이다. 새 시스템을 얹기 전에 core verb 하나가 생명체 actor + reward motion + order progress로 읽혀야 이후 주문/원정/연구 확장이 카드 나열로 보이지 않는다.

## Subagent/Team Routing

- 사용하지 않음: 새 asset 생성 lane이 API/env 부재와 기존 accepted raster strip 존재로 축소되었고, runtime/test 변경이 한 파일 흐름에 강하게 결합되어 단일 agent가 더 안전하다.
- 병렬화 대신 focused visual regression과 full visual gate를 우선했다.

## QA/playtest evidence

- Browser Use blocker: `reports/visual/browser-use-blocker-0298-20260503.md`
- Playwright screenshot: `reports/visual/issue-298-production-claim-worker-fx-393.png`
- Dispatch-after-claim screenshot: `reports/visual/issue-298-order-dispatch-after-production-claim-393.png`
- Focused regression: `npx playwright test --config playwright.config.ts --grep "자동 생산과 첫 주문"` → 1 passed
- Full visual regression: `npm run check:visual` → 55 passed
