# WorkUnit #332 — 포장잎 상인 보상 수령을 단골 납품 주문으로 이어준다

## GitHub authority

- GitHub issue: #332 https://github.com/bborok1234/strange-seed-shop/issues/332
- Branch: `codex/0332-merchant-followup-order`
- Campaign source of truth: P0.5 Idle Core + Creative Rescue
- Runner decision: `production-game-intake-required` after #331 merge and main CI `25281550163` success
- Status: plan-first ready

## 문제 / 배경

#330은 `포장잎 상인` 주문상자 보상 수령을 HUD reward motion으로 닫았다. 하지만 claim 이후 실제 다음 주문이 생성되어 생산 progress를 채우고 납품하는 loop는 아직 없다. 이 상태에서는 상인이 정원 경제 actor라기보다 일회성 보상 장치로 남는다.

## 목표

상인 주문상자 보상 수령 후 `포장잎 상인 단골 납품` follow-up order를 production card/playfield에 표시하고, 생산 잎 수령으로 progress를 채운 뒤 납품하면 reward motion과 다음 목표 affordance가 보이게 만든다.

## Reference teardown

- Egg, Inc./Idle Miner Tycoon류는 reward claim이 다음 order/contract/task를 즉시 unlock해 계속할 이유를 만든다.
- 현재 #330은 `상인 주문상자 보상 받기`의 손맛은 있으나 다음 order objective가 실제 gameplay surface로 전환되지 않는다.
- Reject: claim receipt의 small copy만 `다음 납품 목표 확인`으로 두는 방식. 실제 order progress와 납품 CTA가 없어 production loop를 닫지 못한다.

## Creative brief

- Player fun target: 포장잎 상인이 다음 단골 주문을 가져왔고, 플레이어가 잎을 모아 보내는 느낌.
- Core loop role: merchant reward claim → follow-up order unlock → production progress → delivery reward → next goal.
- Screen moment: #330 claim 직후 정원 action surface와 playfield order crate.
- Required assets/FX: 신규 accepted manifest asset 없음. existing order crate asset + DOM/CSS merchant order state + reward motion.
- Game-feel requirements: order progress가 수령 직후 숫자/상자 상태로 반응하고, 납품 시 crate dispatch/claimed state가 보여야 한다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- 적용 규칙: playfield를 가리지 않고, persistent HUD는 저밀도, order CTA는 게임 동사로 유지한다. DOM text만으로 통과하지 않고 screenshot/playtest evidence를 남긴다.

## Game Studio Department Signoff

- 기획팀: 상인 reward claim은 다음 납품 주문으로 이어져야 첫 5분 반복 행동이 명확하다.
- 리서치팀: 경쟁작 production gap은 reward claim 이후 다음 production objective 부재다.
- 아트팀: 신규 manifest asset 없이 DOM/CSS follow-up crate state와 reward motion으로 이번 issue를 닫는다.
- 개발팀: `src/App.tsx`, `src/styles.css`, `tests/visual/p0-mobile-game-shell.spec.ts` 중심. order selection/save mutation을 최소화한다.
- 검수팀: Browser Use iab를 먼저 시도하고, 실패 시 current-session blocker와 393px Playwright screenshot/layout invariant를 남긴다.
- 마케팅팀: mock-only promise. 외부 채널/결제/광고 없음.
- 고객지원팀: `상자 보상을 받은 뒤 무엇을 하나요?`를 실제 단골 납품 CTA로 줄인다.

## Plan

1. 현재 order selection(`getCurrentOrder`/order definitions)과 #330 `claimedMerchantCrateRewardIds` 저장 상태를 확인한다.
2. merchant reward claimed 상태에서 follow-up order를 current order chain에 노출하는 최소 로직을 설계한다.
3. production card/playfield에 merchant order title/progress/CTA/variant를 추가한다.
4. 납품 완료 receipt/reward motion/next affordance를 DOM/CSS로 구현한다.
5. #330 flow에서 claim → follow-up order → progress → delivery까지 393px regression을 추가하고 Browser Use iab 시도 또는 blocker를 남긴다.
6. focused checks → full visual/CI → issue/PR body-file/evidence mirror → PR/check/merge/main CI 순서로 진행한다.

## 수용 기준

- [ ] #330 flow에서 상인 주문상자 보상 수령 후 production card/playfield에 merchant follow-up order가 표시된다.
- [ ] 생산 잎 수령 또는 동등한 player verb로 follow-up order progress가 증가한다.
- [ ] progress가 충분하면 `상인 단골 납품` 또는 동등한 납품 CTA가 enabled되고, 납품 후 reward receipt/reward motion/claimed crate state가 보인다.
- [ ] 다음 목표 affordance가 같은 모바일 화면에서 읽힌다.
- [ ] 신규 accepted manifest asset 없이 DOM/CSS FX와 existing assets만 사용하고 runtime image generation/API를 호출하지 않는다.
- [ ] 393px 모바일에서 order card/playfield crate/receipt/하단 탭이 겹치지 않고 overflow를 만들지 않는다.
- [ ] Browser Use iab current-session 시도 evidence 또는 blocker, focused Playwright screenshot, `npm run check:visual`, `npm run check:ci`가 남는다.

## 검증 명령

- `npm run build`
- `npx playwright test --config playwright.config.ts --grep "상인 단골 납품|포장잎 상인"`
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

- 기존 order chain과 merchant follow-up order 우선순위가 충돌하면 초기 주문/연구 주문 regression이 생길 수 있다.
- 모바일 production card가 이미 길어 follow-up order receipt 추가 시 overflow/하단 탭 overlap이 재발할 수 있다.
- Browser Use iab backend가 현재 세션에서 계속 발견되지 않을 수 있으므로 issue 전용 blocker를 새로 기록해야 한다.

## Subagent/Team Routing

- 기본은 solo execution: order selection, UI, CSS, regression이 같은 파일 집합이라 병렬 worker conflict 가능성이 높다.
- Codex native subagents/team mode는 order selection 영향 분석과 visual QA가 독립 evidence로 분리될 때만 사용한다.
