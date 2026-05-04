# WorkUnit #348 — 첫 GREENHOUSE_ORDER ("온실 선반 납품") 납품에 출하 receipt + playfield 메달 variant를 더해 chain handoff loop를 한 beat 더 닫는다

## GitHub authority

- GitHub issue: #348 https://github.com/bborok1234/strange-seed-shop/issues/348
- Branch: `codex/0176-greenhouse-shelf-delivery-receipt`
- Campaign source of truth: P0.5 Idle Core + Creative Rescue
- Runner decision: `production-game-intake-required` after #346 main CI `25302527915` success and queue empty
- Status: plan-first

## 문제 / 배경

#346은 `buyGreenhouseFacility` 성공 직후 production card에 "달빛 온실 입장" 2.0초 reveal motion을 띄워 chain handoff(#344) loop의 첫 beat를 닫았다. 그러나 그 다음 단계 — 플레이어가 GREENHOUSE_ORDER("온실 선반 납품")를 처음 납품하는 순간 — production card에는 어떤 출하 reveal motion도 없다.

`commitOrder` 분기를 추적해보면 `setOrderDeliveryReceipt(deliveryReceipt)`는 다음 세 주문에서만 호출된다:

```ts
if (
  orderBeforeDelivery.id === FIRST_ORDER.id ||
  orderBeforeDelivery.id === MERCHANT_FOLLOWUP_ORDER.id ||
  orderBeforeDelivery.id === MERCHANT_SECOND_CHAPTER_ORDER.id
) { setOrderDeliveryReceipt(deliveryReceipt); ... }
else { setOrderDeliveryReceipt(null); }
```

그래서 GREENHOUSE_ORDER 납품 시 `.order-dispatch-receipt` chip + sparkle motion은 출현하지 않고, production card는 `productionStatus.orderCompleted` flag만 true가 된 후 정적인 production-complete-row로 떨어진다. idle 경쟁작은 main building/factory의 첫 출하 순간에 reveal cinematic을 묶는다(Egg Inc. 첫 hatchery 출하 burst, Idle Miner Tycoon 광산 첫 cargo 출하 unlock cinematic, Cell to Singularity 첫 tech node 발견 burst). 우리는 chain handoff가 약속한 "달빛 온실 입장" 다음 beat에서 그 lever가 비어 있다.

## Reference teardown

- Egg, Inc.: 첫 cargo shipment 도착에 reveal burst + bonus chip.
- Idle Miner Tycoon: 광산 첫 cargo 출하에 unlock cinematic + 다음 광산 hint.
- Cell to Singularity: 첫 tech node 도달에 시각적 burst + 다음 카드 push.
- Reject: 첫 GREENHOUSE_ORDER 납품을 silent state 변화로만 두는 방식. chain handoff가 약속한 "달빛 온실" 단계의 첫 출하가 시각적으로 비면 entry reveal과 다음 production loop 사이의 호흡이 끊긴다.

## Creative brief

- Player fun target: chain handoff(#344) → 작업대 강화 → 달빛 온실 설립 → 온실 선반 첫 출하까지 따라온 손맛이 출하 receipt sparkle + playfield 메달 crate variant로 마무리된다.
- Core loop role: facility-greenhouse 진입 phase의 두 번째 beat — entry reveal(#346)과 다음 greenhouse 단계(`buyGreenhouseStorage`) 사이의 transition을 시각적으로 닫는다.
- Screen moment: GREENHOUSE_ORDER 납품 직후 production card에 `.order-dispatch-receipt`(1.8s sparkle) + chip "상자 출하 완료" + strong "온실 선반 납품" + reward label + small "다음 주문: …". playfield order crate가 같은 1.8s 동안 `greenhouse-shelf-delivered` variant(메달/리본 + 초록 톤 burst)로 표시된 뒤 GREENHOUSE_ORDER variant로 자연스럽게 전환된다.
- Required assets/FX: 신규 accepted manifest asset 없음. existing greenhouse order crate asset + DOM/CSS receipt + sparkle keyframe + playfield variant.
- Game-feel requirements: 기존 merchant-delivered receipt 패턴과 동일한 sparkle motion(0.4s reveal + 1.4s persist + auto-unmount), playfield 메달 variant는 receipt 활성 동안만 보여서 reward motion 우선순위와 충돌하지 않는다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- 적용 규칙: playfield 비차폐, persistent HUD 저밀도 유지, receipt는 production card 내부 기존 receipt 영역에 묶여 추가 layout column을 만들지 않는다. DOM text만으로 통과하지 않고 393px screenshot/playtest evidence를 남긴다.

## Game Studio Department Signoff

- 기획팀: chain handoff(#344) → entry reveal(#346)이 약속한 "달빛 온실 입장"의 다음 호흡(첫 출하)이 시각적 beat로 마무리되어야 facility-greenhouse 진입 loop가 끊기지 않는다.
- 리서치팀: idle 경쟁작은 main building/factory 첫 출하에 reveal cinematic을 묶는다. 우리는 silent state 변화로만 두고 있다.
- 아트팀: 신규 accepted manifest asset 없음. existing greenhouse/order crate asset + DOM/CSS receipt + sparkle keyframe만 사용.
- 개발팀: `src/App.tsx`(`commitOrder` 납품 분기에 GREENHOUSE_ORDER 추가, playfield variant 라우팅 추가), `src/styles.css`(playfield greenhouse-shelf-delivered variant + sparkle keyframe), `src/game/playfield/types.ts`(`greenhouse-shelf-delivered` variant), `tests/visual/p0-mobile-game-shell.spec.ts`(첫 GREENHOUSE_ORDER 납품 → receipt + playfield variant 표시 393px regression).
- 검수팀: Browser Use iab current-session 시도 → blocker 시 issue 전용 blocker + 393px focused Playwright regression(receipt 표시 + 카피 + playfield variant + bottom-tabs 비충돌 + 1.9초 후 receipt unmount), `npm run check:visual`, `npm run check:ci`.
- 마케팅팀: mock-only player promise. 외부 채널/실결제/광고 없음.
- 고객지원팀: "온실 선반 납품했는데 출하 sparkle이 없다" 또는 "merchant 납품과 다르게 silent하다"를 출하 receipt + 메달 crate로 줄인다.

## Plan

1. `src/App.tsx`의 납품 receipt 분기에 `orderBeforeDelivery.id === GREENHOUSE_ORDER.id`를 추가해 GREENHOUSE_ORDER 납품 시에도 `.order-dispatch-receipt` motion이 1.8s 등장하게 한다.
2. `src/game/playfield/types.ts`의 `orderVariant` union에 `greenhouse-shelf-delivered`를 추가한다.
3. `buildGardenPlayfieldViewModel`에 `greenhouseShelfDeliveredActive = orderDeliveryReceipt?.orderId === GREENHOUSE_ORDER.id` 파생을 추가하고, `orderVariant` 라우팅에 기존 dispatch receipt variants와 같은 우선순위 위치에 `greenhouse-shelf-delivered` 분기를 끼워 넣는다(merchant-second-delivered 다음, merchant-delivered 다음 적합한 위치).
4. `src/styles.css`에 `.playfield-order-crate.order-variant-greenhouse-shelf-delivered` + `::after` 메달/리본 burst + sparkle keyframe(`greenhouse-shelf-delivered-burst`)을 추가한다. 톤은 chain handoff/entry reveal과 일관된 초록 계열(`rgba(168, 218, 132, ...)`)을 사용한다.
5. 기존 "모바일 온실 설비는 새 납품 주문으로 이어진다" regression(line 2094)에 GREENHOUSE_ORDER 납품 직후 `.order-dispatch-receipt` + chip + 카피 + playfield `order-variant-greenhouse-shelf-delivered` visible assertion + 2.0초 후 receipt unmount 확인을 추가한다.
6. focused checks → issue/PR body-file/evidence mirror → branch push → PR create/watch/merge → main CI observation.

## 수용 기준

- [ ] `commitOrder`가 GREENHOUSE_ORDER를 납품 처리하면 `setOrderDeliveryReceipt(deliveryReceipt)`가 호출되어 `.order-dispatch-receipt` 모션이 production card에 1.8s 등장한다.
- [ ] receipt 카피는 chip "상자 출하 완료" + strong "온실 선반 납품" + reward label + small "다음 주문: {nextOrderTitle}"이다.
- [ ] playfield order crate variant `greenhouse-shelf-delivered`가 정의되고 receipt 활성 동안 표시되며 reward motion 우선순위와 충돌하지 않는다.
- [ ] receipt는 약 1.8초 후 자동으로 unmount되고, production card는 GREENHOUSE_ORDER 완료 후 다음 priority(GREENHOUSE_EXPANSION_ORDER 또는 fallback) 모드로 자연스럽게 전환된다.
- [ ] 393px 모바일에서 receipt / production card chip / 하단 탭이 겹치지 않고 production card에 추가 overflow를 만들지 않는다.
- [ ] 신규 accepted manifest asset 없이 existing greenhouse/order crate asset + DOM/CSS state + 작은 motion만 사용하고 runtime image generation/API 호출 없음.
- [ ] 393px focused Playwright regression(receipt 표시 + 카피 + playfield variant + unmount), `npm run check:visual`, `npm run check:ci`가 남는다.

## 검증 명령

- `npm run build`
- `npx playwright test --config playwright.config.ts --grep "온실 설비는 새 납품 주문으로 이어진다|greenhouse-shelf-delivered"`
- `npm run check:visual`
- `npm run check:ci`
- `npm run update:dashboard`
- `npm run operator:control-room -- --output docs/OPERATOR_CONTROL_ROOM.md`
- `npm run check:dashboard`
- `npm run check:control-room`
- `npm run check:ops-live`
- `npm run check:github-metadata`
- `npm run check:closed-workunit-mirrors`

## 리스크

- 기존 "모바일 온실 설비는 새 납품 주문으로 이어진다" regression이 GREENHOUSE_ORDER 납품 후 production card 카피와 layout invariant를 검증한다. receipt가 이 layout/copy에 끼어들지 않도록 production card 내부 기존 receipt 영역에 묶고 카피는 dispatch receipt 패턴을 그대로 따른다.
- playfield `greenhouse-shelf-delivered` variant가 다른 reward motion과 우선순위 충돌하면 가시성이 깨진다. 기존 merchant-second-delivered/merchant-delivered와 같은 priority bucket에 위치시켜 dispatch receipt 활성 동안만 표시되게 한다.
- receipt 1.8s 종료 후 production card는 다음 priority(GREENHOUSE_EXPANSION_ORDER 또는 fallback)로 전환되는데, 그 transition이 `productionStatus.orderCompleted` flag로 즉시 일어나면서 약간의 layout shift가 발생할 수 있다. 기존 merchant-second-delivered 패턴과 동일한 접근이라 회귀 위험은 낮다.
- Browser Use iab는 current-session 미발견이 예상되므로 issue 전용 blocker를 새로 기록한다.

## Subagent/Team Routing

- 기본은 solo execution: 변경 영역이 좁은 파일 집합(App.tsx 분기 + 라우팅, styles.css variant + keyframe, types.ts variant, regression spec)에 묶이며 병렬 worker conflict 가능성이 더 크다.
- Codex native subagents/team mode는 facility-greenhouse 진입 phase 전체 economy/visual QA를 별도 evidence로 분리할 때만 사용한다.
