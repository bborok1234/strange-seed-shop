# 정원에서 생산 잎을 수령할 때 포리 작업 FX를 보이게 만든다

## 문제 / 배경

#296으로 첫 주문 납품은 상자 출하/보상 수거 payoff가 생겼지만, 그 직전 단계인 `생산 잎 수령`은 아직 숫자/버튼 중심이다. 경쟁작 idle game에서는 생산 주체가 일하고, 생산 tick이 시각적으로 터지고, 수령한 재화가 주문으로 흘러가는 순간이 core loop 이해의 핵심이다.

Studio Harness v3 queue가 비었으므로 local ledger가 아니라 GitHub issue를 새 WorkUnit authority로 만든다. 이 작업은 Studio Harness v3 foreground operator의 `P0.5 Idle Core + Creative Rescue` production game quality intake다.

## Campaign source of truth

- Campaign: `P0.5 Idle Core + Creative Rescue`
- North Star: 첫 5분 안에 “이 아이가 정원을 실제로 움직이네. 다음 주문/업그레이드/생명체까지 보고 싶다.”를 만든다.
- Production gap: 생산 엔진이 보이긴 하지만, `생산 잎 수령` 클릭이 생명체 작업/잎 reward motion/주문 progress로 이어지는 게임 feel이 아직 약하다.

## Reference teardown

- Egg, Inc.: 생산 주체와 재화 흐름이 화면 motion으로 계속 보인다.
- Idle Miner Tycoon: worker/manager가 생산을 수행하고 수령/운반 motion이 다음 업그레이드 판단으로 이어진다.
- Cell to Singularity: click/idle reward가 즉각적인 시각 feedback과 다음 unlock progress로 연결된다.

## 후보 비교 / 선택 근거

1. 선택: 생산 잎 수령 worker FX + leaf burst reward motion
   - player verb: `생산 잎 수령하기`
   - production/progression role: 자동 생산 엔진 → 주문 progress → 다음 주문/업그레이드
   - screen moment: 첫 5분 또는 복귀 후 30초, `생산 대기 n 잎`이 생긴 뒤 수령 버튼을 누르는 순간
   - asset/FX/game-feel payoff: 포리 work/celebrate FX strip 또는 leaf burst strip, playfield state, reward motion
   - playtest evidence: 모바일 393px에서 수령 전/후 worker FX, leaf burst, order progress 증가, overflow/bottom-tab invariants 확인
2. 보류: 정원 첫 화면 전체 art direction 대점프
   - 큰 방향 점프 후보. 효과는 크지만 #296 직후에는 생산 verb 자체의 game feel 구멍이 더 직접적인 first 5m blocker다.
3. 보류: 새 주문/원정 teaser 추가
   - 주문 수를 늘리기보다 기존 생산 수령 순간이 게임 장면으로 읽히게 만든 뒤 확장한다.

## Strategic Jump Check

전체 art direction 점프보다 이 후보를 먼저 고른 이유는 첫 화면 생산 엔진이 이미 배치된 상태에서 가장 가까운 high-severity confusion이 `생산 잎 수령`의 감각 부족이기 때문이다. 새 시스템을 얹기 전에 core verb 하나가 생명체 actor + reward motion + order progress로 읽혀야 이후 주문/원정/연구 확장이 카드 나열로 보이지 않는다.

## Creative brief

- Player value: “포리가 일해서 잎을 만들었고, 내가 수령하자 주문 상자가 채워졌다”를 즉시 이해한다.
- Art direction: 기존 말랑잎 포리 raster style과 같은 조명/외곽선/투명 배경. 새 FX는 64px에서도 잎/반짝임/수령 방향성이 읽혀야 한다.
- Motion tone: 짧고 통통 튀는 leaf burst, reduced-motion에서는 과도한 반복을 줄인다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:game-ui-frontend` + `game-studio:sprite-pipeline` + `game-studio:game-playtest`
- 적용 기준: playfield 보호, low-density HUD, first actionable screen, main verb, HUD readability, playfield obstruction, screenshot evidence.

## Game Studio Department Signoff

- 기획팀: player verb는 `생산 잎 수령하기`; core loop role은 자동 생산 → 주문 progress.
- 리서치팀: 경쟁작 production gap은 worker/reward motion 부재.
- 아트팀: gpt-image-2 default, Codex native fallback. FX strip은 frame count/frame size/fps/manifest binding을 plan에 고정한다.
- 개발팀: `src/App.tsx`, playfield view model/types, CSS animation, visual regression test를 작은 tranche로 수정한다.
- 검수팀: Browser Use iab 우선; blocker 시 current-session blocker와 Playwright screenshot fallback. 393px overflow/bottom-tab invariant 필수.
- 마케팅팀: mock-only devlog angle은 “포리가 실제로 일하는 정원”이다. 실채널 action 없음.
- 고객지원팀: 첫 5분 혼란 risk는 “생산 잎 수령이 왜 중요한지 모름”; FAQ note는 수령하면 주문 상자가 채워진다는 설명.

## Plan

- 구현 전 작성/검토할 plan artifact: `items/0151-production-tick-worker-fx.md`
- 예상 단계:
  1. 현재 production FX/asset manifest/worker playfield state를 매핑한다.
  2. asset/FX plan과 prompt batch를 만들고, gpt-image-2 API 가능 여부를 확인한다. API blocker면 Codex native image generation fallback/provenance를 남긴다.
  3. 포리 worker/leaf burst FX strip 또는 최소 leaf burst FX strip을 workspace PNG로 저장하고 manifest animation binding을 등록한다.
  4. `생산 잎 수령` 직후 playfield worker/leaf burst/reward motion과 order progress 증가를 연결한다.
  5. 모바일 393px visual regression으로 수령 전/후, overflow, bottom-tab overlap, reduced-motion safety를 고정한다.
  6. Browser Use iab 우선 QA 또는 current-session blocker + Playwright fallback evidence를 남긴다.
  7. roadmap/dashboard/control room/PR evidence를 갱신한다.

## Subagent/Team Routing

- 사용할 수 있음: asset prompt/review와 runtime implementation은 write scope가 분리되므로 Codex native subagent가 유효하다.
- 현재 Intake 단계에서는 단일 agent가 issue/plan artifact를 만들고, 구현 단계에서 asset lane과 runtime/test lane을 분리할지 재평가한다.

## QA/playtest plan

- `npm run build`
- focused Playwright: `npx playwright test --config playwright.config.ts --grep "생산 잎 수령|worker FX|leaf burst|자동 생산과 첫 주문"`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:visual`
- `npm run check:ci`

## 수용 기준

- [ ] `생산 잎 수령` 실행 직후 worker/leaf reward motion이 정원 playfield 또는 action surface에서 보인다.
- [ ] 새 asset/FX가 raster PNG provenance와 manifest animation binding을 갖고 style/provenance checks를 통과한다.
- [ ] order progress 증가와 reward telemetry가 deterministic test로 검증된다.
- [ ] 모바일 393px에서 body scroll, panel overflow, bottom-tab overlap 회귀가 없다.
- [ ] Browser Use `iab` current-session evidence 또는 current-session blocker + Playwright fallback screenshot을 남긴다.
- [ ] `npm run check:visual`과 `npm run check:ci`가 통과한다.

## 안전 범위

- 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음.
- 런타임 이미지 생성 없음. 새 그래픽 asset은 사전 생성된 raster PNG만 manifest에 등록한다.
- SVG/vector/code-native accepted game graphics 금지.
