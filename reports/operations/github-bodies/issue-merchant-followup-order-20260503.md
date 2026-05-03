## GitHub authority

- Issue: #332 https://github.com/bborok1234/strange-seed-shop/issues/332
- Plan artifact: `items/0168-merchant-followup-order.md`
- Source: Studio Harness v3 dry-run after #331 merge/main CI success
- Campaign source of truth: P0.5 Idle Core + Creative Rescue
- WorkUnit type: production game quality Intake

## 문제 / 배경

#330은 `포장잎 상인` 주문상자 보상 수령을 `+36 잎 · +1 꽃가루`, crate open state, HUD 보상 이동으로 닫았다. 하지만 보상 수령 뒤 실제 다음 주문이 열리거나 진행률을 채워 납품하는 production loop는 아직 없다. idle 경쟁작은 보상 컨테이너가 다음 주문/업그레이드 목표를 즉시 생성해 “보상 받았으니 다음에 무엇을 할지”를 명확히 만든다.

## 목표

`상인 주문상자 보상 받기` 이후 정원 production card/playfield에 `포장잎 상인 단골 납품` 같은 다음 주문을 생성하고, 생산 잎 수령으로 진행률을 채운 뒤 납품하면 reward motion과 다음 목표 affordance가 보이게 만든다.

## Small win

포장잎 상인 보상 수령이 일회성 FX에서 끝나지 않고, 바로 다음 `상인 단골 납품` 주문을 채우고 보내는 idle loop로 이어진다.

## Studio Campaign Gate

- Player verb: `상인 주문상자 보상을 받은 뒤 단골 납품 주문을 채워 보내기`
- Production/progression role: merchant crate reward claim → follow-up order unlock → production progress → delivery reward → next goal
- Screen moment: #330 claim 직후 정원 action surface/playfield order crate
- Concrete visual/game-feel payoff: follow-up order crate visual state, progress HUD affordance, delivery reward motion, claimed/delivered crate state, 393px screenshot
- Competition production gap: idle 경쟁작은 reward claim이 다음 production objective로 전환된다. 보상 수령 후 정적인 다음 행동 문구만 남기는 대안은 reject한다.
- Playtest evidence: Browser Use iab 우선, blocker 시 issue 전용 blocker + 393px Playwright screenshot/layout invariant.

## Game Studio Department Signoff

- 기획팀: 상인 보상은 다음 주문으로 이어져야 named creature가 정원 경제 actor처럼 느껴진다.
- 리서치팀: reference idle games는 보상 수령 후 새로운 order/contract/task를 화면에 세워 retention hook을 만든다.
- 아트팀: 신규 accepted manifest asset은 기본 범위가 아니다. DOM/CSS follow-up crate state, progress glow, delivery reward motion으로 FX payoff를 만든다. 새 order crate sprite strip은 별도 provenance WorkUnit.
- 개발팀: `src/App.tsx`, `src/styles.css`, `tests/visual/p0-mobile-game-shell.spec.ts` 중심. 주문 정의/선택 로직과 저장된 `claimedMerchantCrateRewardIds` 사용을 최소 변경으로 연결한다.
- 검수팀: Browser Use iab current-session 시도, 393px screenshot, no body scroll/bottom-tab overlap, order progress/delivery state를 확인한다.
- 마케팅팀: mock-only player promise. 외부 채널/실결제/광고 없음.
- 고객지원팀: “보상 받은 뒤 무엇을 하나요?”를 실제 새 주문 CTA/진행률로 줄인다.

## 사용자/운영자 가치

- 사용자: 포장잎 상인이 실제로 다음 납품을 가져오는 actor가 되어 수집-생산-주문 루프가 강해진다.
- 운영자: #328→#330 merchant chain을 follow-up order까지 확장해 P0.5 production loop evidence를 더 닫는다.

## 수용 기준

- [ ] #330 flow에서 상인 주문상자 보상 수령 후 production card/playfield에 merchant follow-up order가 표시된다.
- [ ] 생산 잎 수령 또는 동등한 player verb로 follow-up order progress가 증가한다.
- [ ] progress가 충분하면 `상인 단골 납품` 또는 동등한 납품 CTA가 enabled되고, 납품 후 reward receipt/reward motion/claimed crate state가 보인다.
- [ ] 다음 목표 affordance가 같은 모바일 화면에서 읽힌다.
- [ ] 신규 accepted manifest asset 없이 DOM/CSS FX와 existing assets만 사용하고 runtime image generation/API를 호출하지 않는다.
- [ ] 393px 모바일에서 order card/playfield crate/receipt/하단 탭이 겹치지 않고 overflow를 만들지 않는다.
- [ ] Browser Use iab current-session 시도 evidence 또는 blocker, focused Playwright screenshot, `npm run check:visual`, `npm run check:ci`가 남는다.

## Visual evidence 계획

- Browser Use iab target: #330 flow → 보상 수령 → merchant follow-up order visible → 생산 잎 수령 → 납품 → reward motion.
- Fallback screenshot: `reports/visual/issue-332-merchant-followup-order-393.png`.
- Layout invariant: order card/playfield crate/receipt vs `.bottom-tabs`, no body scroll, no masked overflow.

## Playable mode 영향

- Local dev: `npm run dev -- --host 127.0.0.1 --port 3000`
- Stable main playable mirror는 `npm run play:main` + port 5174 계약 유지.

## 안전 범위

- runtime image generation/API 호출 없음.
- 신규 accepted manifest asset 없음. existing assets와 DOM/CSS order crate/reward motion만 허용.
- real payment, customer data, external production deployment 없음.

## 검증 명령

- `npm run build`
- focused Playwright: 상인 단골 납품 / merchant follow-up order / 포장잎 상인
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

## Subagent/Team Routing

- 기본은 solo execution: 주문 상태/production card/visual regression이 같은 좁은 파일 집합에 묶여 있다.
- Codex native subagents/team mode는 order-selection 영향 분석과 QA가 분리될 때만 사용한다.
