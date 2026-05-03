# WorkUnit #330 — 상인 주문상자 보상 수령을 HUD 보상 이동 FX로 닫는다

## GitHub authority

- GitHub issue: #330 https://github.com/bborok1234/strange-seed-shop/issues/330
- Branch: `codex/0330-merchant-crate-claim-fx`
- Campaign source of truth: P0.5 Idle Core + Creative Rescue
- Runner decision: `production-game-intake-required` after #329 merge and main CI `25279311165` success
- Status: plan-first ready

## 문제 / 배경

#328은 `포장잎 상인` 수확을 `상인 주문상자`, `보상 포장 완료`, `다음 납품 준비` visual state로 닫았다. 그러나 지금은 상자가 “준비됨” 상태로 남고, 플레이어가 보상을 직접 수령해 HUD 자원이 반응하는 보상 손맛이 부족하다. idle 경쟁작의 보상 컨테이너는 클릭/수령 순간 reward motion과 resource HUD delta를 보여 루프를 강화한다.

## 목표

포장잎 상인 수확 직후 `상인 주문상자`를 보상 수령 CTA로 만들고, 클릭하면 crate open/claimed state, reward particle/flyout, HUD resource delta, 다음 생산/납품 목표 affordance가 한 모바일 화면에서 이어지게 만든다.

## Reference teardown

- Egg, Inc./Idle Miner Tycoon류는 생산/주문 보상이 컨테이너 클릭 → 자원 HUD 변화 → 다음 투자/납품 목표로 즉시 이어진다.
- 현재 #328 상태는 `보상 포장 완료`라는 정적 affordance까지만 있어 “이제 무엇을 누르지?” 혼란이 남는다.
- Reject: 상자 텍스트만 `보상 수령 가능`으로 바꾸는 방식. player verb와 HUD feedback이 없어 game-feel 생산 gap을 닫지 못한다.

## Creative brief

- Player fun target: `포장잎 상인`이 준비한 상자를 눌러 보상이 잎/꽃가루 HUD로 튀는 손맛.
- Core loop role: named creature harvest → order crate reward claim → resource/progression feedback → next order/seed goal.
- Screen moment: 라미 저장 이후 젤리콩 씨앗을 심어 포장잎 상인을 수확한 직후 reveal/playfield 화면.
- Required assets/FX: 신규 accepted manifest asset 없음. existing portrait + DOM/CSS crate open state + reward flyout/particle + HUD delta. 런타임 이미지 생성/API 호출 없음.
- Game-feel requirements: CTA 클릭 즉시 crate state가 `수령 완료`로 변하고, 보상 chip/particle가 HUD 방향으로 움직이며, 다음 행동 문구가 함께 보여야 한다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- 적용 규칙: playfield를 가리지 않고 persistent HUD는 저밀도로 유지한다. DOM/layout assertion만으로 통과하지 않고 screenshot/playtest evidence를 남긴다.

## Game Studio Department Signoff

- 기획팀: 상인 주문상자는 반드시 `보상 받기` 동사와 다음 목표를 제공해야 수확 루프가 닫힌다.
- 리서치팀: 경쟁작 production gap은 reward container click feedback과 resource HUD 반응 부재다.
- 아트팀: 신규 manifest asset 없이 DOM/CSS reward motion으로 이번 issue를 닫는다. sprite strip/accepted raster FX는 별도 WorkUnit으로 분리한다.
- 개발팀: `src/App.tsx`, `src/styles.css`, `tests/visual/p0-mobile-game-shell.spec.ts`에 한정한다. 저장 schema 변경은 중복 수령 방지에 필요한 최소 필드만 허용한다.
- 검수팀: Browser Use iab를 먼저 시도하고, 실패 시 current-session blocker와 393px Playwright screenshot/layout invariant를 남긴다.
- 마케팅팀: mock-only promise. 외부 채널/결제/광고 없음.
- 고객지원팀: `보상 포장 완료 다음에 무엇을 하나요?`를 CTA와 HUD delta로 줄인다.

## Plan

1. #328 merchant harvest receipt/playfield state와 current save/resource model을 확인한다.
2. merchant crate claim 상태를 저장할 최소 필드와 중복 수령 방지 조건을 추가한다.
3. reveal/receipt 또는 playfield에 `상인 주문상자 보상 받기` CTA, claimed receipt, resource delta, next production/order affordance를 구현한다.
4. DOM/CSS reward particle/flyout와 crate open/claimed state를 추가하되 새 accepted manifest asset은 만들지 않는다.
5. #328 flow를 재사용하는 393px visual regression을 추가하고 Browser Use iab 시도 또는 blocker를 `reports/visual/`에 기록한다.
6. focused checks → full visual/CI → issue/PR body-file/evidence mirror → PR/check/merge/main CI 순서로 진행한다.

## 수용 기준

- [ ] #328 flow에서 `포장잎 상인` 수확 후 `상인 주문상자 보상 받기` 또는 동등한 CTA가 보인다.
- [ ] CTA 클릭 후 reveal/receipt 또는 정원 HUD가 crate open/claimed state, reward motion, resource delta를 보여준다.
- [ ] 수령 상태가 저장되어 새로고침 후 중복 수령되지 않거나, QA 세션 내에서 중복 수령 방지 evidence가 있다.
- [ ] 다음 납품/생산 목표 affordance가 같은 모바일 화면에서 읽힌다.
- [ ] 신규 accepted manifest asset 없이 DOM/CSS FX와 기존 portrait만 사용하고 runtime image generation/API를 호출하지 않는다.
- [ ] 393px 모바일에서 CTA/receipt/HUD delta/order crate/하단 탭이 겹치지 않고 overflow를 만들지 않는다.
- [ ] Browser Use iab current-session 시도 evidence 또는 blocker, focused Playwright screenshot, `npm run check:visual`, `npm run check:ci`가 남는다.

## 검증 명령

- `npm run build`
- `npx playwright test --config playwright.config.ts --grep "상인 주문상자 보상|포장잎 상인 수확"`
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

- #328의 reveal 상태가 transient라 CTA 수령 상태와 저장 모델이 어긋나면 중복 수령 또는 CTA 소실이 생길 수 있다.
- 모바일 reveal 카드가 이미 촘촘해 reward motion 추가 시 하단 탭 overlap/overflow가 재발할 수 있다.
- Browser Use iab backend가 현재 세션에서 발견되지 않을 수 있으므로 issue 전용 blocker를 새로 기록해야 한다.

## Subagent/Team Routing

- 기본은 solo execution: 상태 필드, UI, CSS, visual regression이 같은 좁은 파일 집합에 묶여 있어 병렬 worker가 merge conflict를 만들 가능성이 더 크다.
- Codex native subagent는 Browser Use/QA blocker 조사나 save schema 영향 분석이 분리될 때만 사용한다. 현재 즉시 blocker는 아니므로 spawn하지 않는다.
