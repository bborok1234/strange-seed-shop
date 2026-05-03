## GitHub authority

- Issue: #330 https://github.com/bborok1234/strange-seed-shop/issues/330
- Plan artifact: `items/0167-merchant-crate-claim-fx.md`
- Source: Studio Harness v3 dry-run after #329 merge/main CI success
- Campaign source of truth: P0.5 Idle Core + Creative Rescue
- WorkUnit type: production game quality Intake

## 문제 / 배경

#328은 `젤리콩 씨앗 → 포장잎 상인` 수확을 `상인 주문상자`, `보상 포장 완료`, `다음 납품 준비` visual state로 닫았다. 하지만 플레이어가 그 주문상자를 눌러 보상을 실제로 수령하고, 보상 입자가 HUD 자원으로 이동하며 다음 생산/납품 행동이 열리는 손맛은 아직 없다.

## 목표

포장잎 상인 수확 직후의 `상인 주문상자`를 player verb가 있는 보상 수령 CTA로 바꾸고, 탭하면 보상 수령 receipt + HUD 자원 이동 FX + 다음 납품/생산 목표를 한 화면에서 보여준다.

## Small win

`포장잎 상인`을 만난 뒤 “상자가 준비됐네”에서 멈추지 않고, 플레이어가 `상인 주문상자 보상 받기`를 눌러 잎/꽃가루 보상이 HUD로 튀는 production moment를 본다.

## Studio Campaign Gate

- Player verb: `포장잎 상인 주문상자를 눌러 보상을 받고 다음 납품 목표 확인하기`
- Production/progression role: named creature harvest → merchant crate reward claim → HUD resources feedback → next order/seed/progression target
- Screen moment: #328 merchant harvest reveal 직후 정원/playfield + reveal receipt 하단
- Concrete visual/game-feel payoff: order crate claim CTA, crate open state, reward particle/flyout motion, HUD resource delta, next production/order goal affordance
- Competition production gap: idle 경쟁작은 보상 상자/주문 완료 순간에 reward motion과 resource HUD 반응으로 루프를 닫는다. 정적인 `보상 포장 완료` 상태만 남기는 대안은 reject한다.
- Playtest evidence: Browser Use iab 우선, blocker 시 issue 전용 blocker + 393px Playwright screenshot/layout invariant.

## Game Studio Department Signoff

- 기획팀: 상인 주문상자가 실제 수령 동사와 다음 행동으로 이어져야 `수확 → 보상 → 다음 주문` loop 신뢰가 생긴다.
- 리서치팀: Egg, Inc./Idle Miner 계열은 보상 컨테이너 클릭 후 자원 HUD가 즉시 반응해 성장감을 만든다.
- 아트팀: 신규 accepted manifest asset은 기본 범위가 아니다. DOM/CSS reward particle/flyout, crate open state, HUD delta로 FX payoff를 만든다. 새 sprite strip은 별도 asset provenance WorkUnit으로 분리한다.
- 개발팀: `src/App.tsx`, `src/styles.css`, `tests/visual/p0-mobile-game-shell.spec.ts` 중심의 좁은 tranche. 필요 시 playfield view model에 merchant claim 상태만 추가한다.
- 검수팀: Browser Use iab current-session 시도, 393px screenshot, no body scroll/bottom-tab overlap, crate/receipt/HUD delta visibility를 확인한다.
- 마케팅팀: mock-only player promise. 외부 채널/실결제/광고 없음.
- 고객지원팀: “보상 포장 완료 다음에 무엇을 하나요?” 혼란을 claim CTA와 HUD delta로 줄인다.

## 사용자/운영자 가치

- 사용자: 이름 있는 생명체 수확이 자원 보상과 다음 목표로 즉시 이어져 game feel과 반복 동기가 강해진다.
- 운영자: #326→#328로 만든 record-loop target chain을 reward-claim gate까지 확장해 production loop evidence를 더 완성한다.

## 수용 기준

- [x] #328 flow에서 `포장잎 상인` 수확 후 `상인 주문상자 보상 받기` 또는 동등한 CTA가 보인다.
- [x] CTA 클릭 후 reveal/receipt 또는 정원 HUD가 crate open/claimed state, reward motion, resource delta를 보여준다.
- [x] 수령 상태가 저장되어 새로고침 후 중복 수령되지 않거나, QA 세션 내에서 중복 수령 방지 evidence가 있다.
- [x] 다음 납품/생산 목표 affordance가 같은 모바일 화면에서 읽힌다.
- [x] 신규 accepted manifest asset 없이 DOM/CSS FX와 기존 portrait만 사용하고 runtime image generation/API를 호출하지 않는다.
- [x] 393px 모바일에서 CTA/receipt/HUD delta/order crate/하단 탭이 겹치지 않고 overflow를 만들지 않는다.
- [x] Browser Use iab current-session 시도 evidence 또는 blocker, focused Playwright screenshot, `npm run check:visual`, `npm run check:ci`가 남는다.

## Visual evidence 계획

- Browser Use iab target: 라미 저장 → 포장잎 상인 target row → 젤리콩 씨앗 수확 → 상인 주문상자 보상 수령 → HUD delta/next goal.
- Fallback screenshot: `reports/visual/issue-330-merchant-crate-claim-fx-393.png`.
- Layout invariant: claim CTA/receipt/HUD delta/order crate vs `.bottom-tabs`, no body scroll, no masked overflow.

## Playable mode 영향

- Local dev: `npm run dev -- --host 127.0.0.1 --port 3000`
- Stable main playable mirror는 `npm run play:main` + port 5174 계약 유지.

## 안전 범위

- runtime image generation/API 호출 없음.
- 신규 accepted manifest asset 없음. existing portrait, DOM/CSS reward FX, HUD delta만 허용.
- real payment, customer data, external production deployment 없음.

## 검증 명령

- `npm run build`
- focused Playwright: 포장잎 상인 주문상자 / 보상 수령 / HUD delta
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

- 단일 React/CSS/visual regression tranche라 기본은 solo execution.
- Codex native subagents/team mode는 reward-claim 상태 설계와 visual QA가 분리될 때만 사용한다.


## 구현 결과

- `claimedMerchantCrateRewardIds` 저장 필드와 persistence normalization으로 `merchant_crate_creature_candy_common_002` 중복 수령을 막았다.
- 포장잎 상인 수확 reveal에 `상인 주문상자 보상 받기` CTA, `상자 열림`, `+36 잎 · +1 꽃가루`, `다음 납품 목표 확인` receipt를 추가했다.
- 정원 production scene/playfield crate는 claimed 후 `상인 주문상자 수령`, `HUD 보상 이동`, `merchant-claimed` visual state로 바뀐다.
- 393px regression은 localStorage leaves/pollen 증가와 claimed id 1회 저장, reveal card/claim receipt/HUD receipt/playfield crate viewport invariant를 검증한다.
- 신규 accepted manifest asset, runtime image generation/API 호출, 결제/외부 배포/고객 데이터 변경 없음.

## 검증 결과

- Browser Use iab current-session 시도: blocked, `reports/visual/browser-use-blocker-0330-20260503.md`.
- Screenshot: `reports/visual/issue-330-merchant-crate-claim-fx-393.png`.
- `npm run build` — pass.
- `npx playwright test --config playwright.config.ts --grep "상인 주문상자 보상"` — 1 passed.
- `npx playwright test --config playwright.config.ts --grep "포장잎 상인 수확|상인 주문상자 보상"` — 2 passed.
- `npm run check:visual` — 68 passed.
- `npm run check:ci` — pass.
