# #298 정원에서 생산 잎을 수령할 때 포리 작업 FX를 보이게 만든다

## 상태

- 상태: plan-ready
- GitHub issue: #298 `정원에서 생산 잎을 수령할 때 포리 작업 FX를 보이게 만든다`
- Branch: `codex/0298-production-tick-worker-fx`
- Studio Harness v3 route: GitHub-authoritative WorkUnit intake. `$seed-ops` 사용 안 함.
- Campaign source of truth: `P0.5 Idle Core + Creative Rescue`
- Game Studio route: `game-studio:game-studio` → `game-studio:game-ui-frontend` + `game-studio:sprite-pipeline` + `game-studio:game-playtest`

## Plan

1. 현재 production FX/asset manifest/worker playfield state를 매핑한다.
2. asset/FX plan과 prompt batch를 만들고, gpt-image-2 API 가능 여부를 확인한다. API blocker면 Codex native image generation fallback/provenance를 남긴다.
3. 포리 worker/leaf burst FX strip 또는 최소 leaf burst FX strip을 workspace PNG로 저장하고 manifest animation binding을 등록한다.
4. `생산 잎 수령` 직후 playfield worker/leaf burst/reward motion과 order progress 증가를 연결한다.
5. 모바일 393px visual regression으로 수령 전/후, overflow, bottom-tab overlap, reduced-motion safety를 고정한다.
6. Browser Use iab 우선 QA 또는 current-session blocker + Playwright fallback evidence를 남긴다.
7. roadmap/dashboard/control room/PR evidence를 갱신한다.

## 수용 기준

- [ ] `생산 잎 수령` 실행 직후 worker/leaf reward motion이 정원 playfield 또는 action surface에서 보인다.
- [ ] 새 asset/FX가 raster PNG provenance와 manifest animation binding을 갖고 style/provenance checks를 통과한다.
- [ ] order progress 증가와 reward telemetry가 deterministic test로 검증된다.
- [ ] 모바일 393px에서 body scroll, panel overflow, bottom-tab overlap 회귀가 없다.
- [ ] Browser Use `iab` current-session evidence 또는 current-session blocker + Playwright fallback screenshot을 남긴다.
- [ ] `npm run check:visual`과 `npm run check:ci`가 통과한다.

## 검증 명령

- `npm run build`
- `npx playwright test --config playwright.config.ts --grep "생산 잎 수령|worker FX|leaf burst|자동 생산과 첫 주문"`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:visual`
- `npm run check:ci`

## 리스크

- 새 asset/FX는 gpt-image-2 API key/model access가 필요할 수 있다. API가 credit/quota/rate/model access로 막히면 Codex native image generation fallback과 provenance를 남긴다.
- SVG/vector/code-native accepted game graphics는 금지다.
- worker/leaf burst motion이 action surface를 키우면 모바일 393px overflow가 재발할 수 있다.
- Browser Use iab backend는 #296에서 current-session discovery 실패를 보였다. 이번 issue에서도 현재 세션 기준으로 다시 시도해야 한다.

## Reference teardown

- Egg, Inc.: 생산 주체와 재화 흐름이 화면 motion으로 계속 보인다.
- Idle Miner Tycoon: worker/manager가 생산을 수행하고 수령/운반 motion이 다음 업그레이드 판단으로 이어진다.
- Cell to Singularity: click/idle reward가 즉각적인 시각 feedback과 다음 unlock progress로 연결된다.

## Creative brief

- Player value: “포리가 일해서 잎을 만들었고, 내가 수령하자 주문 상자가 채워졌다”를 즉시 이해한다.
- Art direction: 기존 말랑잎 포리 raster style과 같은 조명/외곽선/투명 배경. 새 FX는 64px에서도 잎/반짝임/수령 방향성이 읽혀야 한다.
- Motion tone: 짧고 통통 튀는 leaf burst, reduced-motion에서는 과도한 반복을 줄인다.

## Game Studio Department Signoff

- 기획팀: player verb는 `생산 잎 수령하기`; core loop role은 자동 생산 → 주문 progress.
- 리서치팀: 경쟁작 production gap은 worker/reward motion 부재.
- 아트팀: gpt-image-2 default, Codex native fallback. FX strip은 frame count/frame size/fps/manifest binding을 plan에 고정한다.
- 개발팀: `src/App.tsx`, playfield view model/types, CSS animation, visual regression test를 작은 tranche로 수정한다.
- 검수팀: Browser Use iab 우선; blocker 시 current-session blocker와 Playwright screenshot fallback. 393px overflow/bottom-tab invariant 필수.
- 마케팅팀: mock-only devlog angle은 “포리가 실제로 일하는 정원”이다. 실채널 action 없음.
- 고객지원팀: 첫 5분 혼란 risk는 “생산 잎 수령이 왜 중요한지 모름”; FAQ note는 수령하면 주문 상자가 채워진다는 설명.

## Strategic Jump Check

전체 art direction 점프보다 이 후보를 먼저 고른 이유는 첫 화면 생산 엔진이 이미 배치된 상태에서 가장 가까운 high-severity confusion이 `생산 잎 수령`의 감각 부족이기 때문이다. 새 시스템을 얹기 전에 core verb 하나가 생명체 actor + reward motion + order progress로 읽혀야 이후 주문/원정/연구 확장이 카드 나열로 보이지 않는다.

## Subagent/Team Routing

- 사용할 수 있음: asset prompt/review와 runtime implementation은 write scope가 분리되므로 Codex native subagent가 유효하다.
- 현재 Intake 단계에서는 단일 agent가 issue/plan artifact를 만들고, 구현 단계에서 asset lane과 runtime/test lane을 분리할지 재평가한다.

## QA/playtest plan

- Browser Use `iab` current-session 시도 → blocker면 `reports/visual/`에 신규 blocker와 Playwright fallback screenshot 저장.
- 모바일 393px에서 첫 생산 잎 수령 전/후 screenshot, order progress 증가, body scroll/panel overflow/bottom-tab overlap invariant를 확인한다.
