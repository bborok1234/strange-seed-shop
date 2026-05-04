## GitHub authority

- Plan artifact: `items/0176-greenhouse-shelf-delivery-receipt.md`
- Source: Studio Harness v3 dry-run after #346 merge / main CI run `25302527915` success → `production-game-intake-required` (queue empty)
- Campaign source of truth: P0.5 Idle Core + Creative Rescue
- WorkUnit type: production game quality Intake

## 문제 / 배경

#346은 `buyGreenhouseFacility` 성공 직후 production card에 "달빛 온실 입장" 2.0초 reveal motion을 띄워 chain handoff(#344) loop의 첫 beat를 닫았다. 그러나 그 다음 단계 — 플레이어가 GREENHOUSE_ORDER("온실 선반 납품")를 처음 납품하는 순간 — production card에는 어떤 출하 reveal motion도 없다.

`commitOrder` 분기는 `setOrderDeliveryReceipt(deliveryReceipt)`를 FIRST_ORDER, MERCHANT_FOLLOWUP_ORDER, MERCHANT_SECOND_CHAPTER_ORDER에서만 호출하고 GREENHOUSE_ORDER 납품 시에는 `setOrderDeliveryReceipt(null)`로 떨어진다. 그래서 첫 GREENHOUSE_ORDER 납품 직후 production card는 정적인 `production-complete-row`만 보여주고, idle 경쟁작이 약속하는 main building/factory 첫 출하 cinematic이 비어 있다.

## 목표

GREENHOUSE_ORDER 납품 직후 기존 `.order-dispatch-receipt` 모션(1.8s)을 띄우고, playfield order crate에 `greenhouse-shelf-delivered` 메달/리본 variant를 같은 1.8s 동안 표시해 chain handoff(#344) → entry reveal(#346) → 첫 출하 reveal arc를 한 호흡으로 닫는다.

## Small win

chain handoff → 작업대 강화 → 달빛 온실 설립 → 온실 선반 첫 출하까지 따라온 손맛이 출하 receipt sparkle + playfield 메달 crate variant로 마무리된다.

## Studio Campaign Gate

- Player verb: `달빛 온실 설립 → 잎 36개 채움 → 온실 선반 납품 click → 출하 receipt sparkle + 메달 crate variant`
- Production/progression role: facility-greenhouse 진입 phase의 두 번째 beat — entry reveal(#346)과 다음 greenhouse 단계(`buyGreenhouseStorage`) 사이의 transition을 시각적으로 닫는다.
- Screen moment: GREENHOUSE_ORDER 납품 직후 production card에 `.order-dispatch-receipt`(1.8s sparkle) + chip "상자 출하 완료" + strong "온실 선반 납품" + reward label("+42 잎 · +2 꽃가루 · +1 재료") + small "다음 주문: …". playfield order crate가 같은 1.8s 동안 `greenhouse-shelf-delivered` variant(메달/리본 + 초록 burst)로 표시된 뒤 다음 priority crate variant로 자연스럽게 전환된다.
- Concrete visual/game-feel payoff:
  - HUD affordance: 기존 `.order-dispatch-receipt`/`.has-order-dispatch-receipt` className 재사용.
  - Order crate visual state: playfield `greenhouse-shelf-delivered` variant — 1.8s 동안 메달/리본 burst.
  - Reward motion: receipt fade-in/glow burst/fade-out + medal-spin keyframe — 1회성.
  - Numeric payoff: 별도 multiplier 변경 없음. 수치 보상은 GREENHOUSE_ORDER의 기존 +42 잎 / +2 꽃가루 / +1 재료를 그대로 표시.
- Competition production gap: idle 경쟁작은 main building/factory 첫 출하에 reveal cinematic을 묶는다. 우리는 silent state 변화로만 두고 있다.
- Asset/FX axis commitment: HUD affordance + order crate visual state + reward motion. 신규 accepted manifest asset 없이 existing greenhouse/order crate asset + DOM/CSS state + sparkle keyframe + medal burst keyframe으로 닫는다.
- Playtest evidence: Browser Use iab 우선 시도, blocker 시 issue 전용 blocker + 393px focused Playwright regression(receipt 표시 + 카피 + playfield variant + bottom-tabs 비충돌).

## Game Studio Department Signoff

- 기획팀: chain handoff(#344) → entry reveal(#346)이 약속한 "달빛 온실 입장"의 다음 호흡(첫 출하)이 시각적 beat로 마무리되어야 facility-greenhouse 진입 loop가 끊기지 않는다.
- 리서치팀: idle 경쟁작은 main building/factory 첫 출하에 reveal cinematic을 묶는다. 우리는 silent state 변화로만 두고 있다.
- 아트팀: 신규 accepted manifest asset 없음. existing greenhouse/order crate asset + DOM/CSS receipt + sparkle/burst keyframe만 사용.
- 개발팀: `src/App.tsx`(`commitOrder` 납품 분기에 GREENHOUSE_ORDER 추가, playfield variant 라우팅 추가), `src/styles.css`(playfield greenhouse-shelf-delivered variant + burst/medal-spin keyframe), `src/game/playfield/types.ts`(`greenhouse-shelf-delivered` variant), `tests/visual/p0-mobile-game-shell.spec.ts`(첫 GREENHOUSE_ORDER 납품 → receipt + playfield variant 표시 393px regression).
- 검수팀: Browser Use iab current-session 시도 → blocker 시 issue 전용 blocker + 393px focused Playwright regression, `npm run check:visual`, `npm run check:ci`.
- 마케팅팀: mock-only player promise. 외부 채널/실결제/광고 없음.
- 고객지원팀: "온실 선반 납품했는데 merchant 납품과 다르게 silent하다"를 출하 receipt + 메달 crate로 줄인다.

## 사용자/운영자 가치

- 사용자: chain handoff(#344) → 작업대 강화 → 달빛 온실 설립(#346) → 온실 선반 첫 출하까지 따라온 손맛이 출하 receipt sparkle + playfield 메달 crate variant로 마무리된다.
- 운영자: #336 → #338 → #344 → #346 chain handoff arc를 facility-greenhouse 진입의 두 번째 reveal moment로 닫아 P0.5 Idle Core + Creative Rescue의 production loop continuity를 한 칸 더 채운다.

## 수용 기준

- [ ] `commitOrder`가 GREENHOUSE_ORDER를 납품 처리하면 `setOrderDeliveryReceipt(deliveryReceipt)`가 호출되어 `.order-dispatch-receipt` 모션이 production card에 1.8s 등장한다.
- [ ] receipt 카피는 chip "상자 출하 완료" + strong "온실 선반 납품" + reward label("+42 잎 · +2 꽃가루 · +1 재료") + small "다음 주문: {nextOrderTitle}"이다.
- [ ] playfield order crate variant `greenhouse-shelf-delivered`가 정의되고 receipt 활성 동안 표시되며 reward motion 우선순위와 충돌하지 않는다.
- [ ] receipt는 약 1.8초 후 자동으로 unmount되고, production card는 GREENHOUSE_ORDER 완료 후 다음 priority(GREENHOUSE_EXPANSION_ORDER 또는 fallback) 모드로 자연스럽게 전환된다.
- [ ] 393px 모바일에서 receipt / production card chip / 하단 탭이 겹치지 않고 production card에 추가 overflow를 만들지 않는다.
- [ ] 신규 accepted manifest asset 없이 existing greenhouse/order crate asset + DOM/CSS state + 작은 motion만 사용하고 runtime image generation/API 호출 없음.
- [ ] 393px focused Playwright regression(receipt 표시 + 카피 + playfield variant), `npm run check:visual`, `npm run check:ci`가 남는다.

## Visual evidence 계획

- Browser Use iab target: chain handoff(#344) → 작업대 강화 → 온실 설비 click(#346) → 잎 채움 → 온실 선반 납품 click → 출하 receipt + 메달 crate.
- Fallback screenshot: focused regression artifact `mobile-greenhouse-facility-order-v0-393.png`(receipt + 메달 variant 포함).
- Layout invariant: receipt / production card chip / 하단 탭 vs `.bottom-tabs`, no body scroll, no panel masked overflow.

## Playable mode 영향

- Local dev: `npm run dev -- --host 127.0.0.1 --port 3000`
- Stable main playable mirror 계약 유지: `npm run play:main` + port 5174.

## 안전 범위

- runtime image generation/API 호출 없음.
- 신규 accepted manifest asset 없음. existing greenhouse/order crate asset + DOM/CSS receipt + sparkle/medal keyframe만 사용.
- real payment, customer data, external production deployment 없음.
- 기존 first/greenhouse/lunar/follow-up/second-chapter 우선순위 보존: 영구 boost(+10%) economy 변동 없음. 신규 변경은 시각적 reveal에 한정.
- save 호환: 신규 state는 transient receipt에 한정, save schema 변경 없음.

## 검증 명령

- `npm run build`
- focused Playwright: `--grep "온실 설비는 새 납품 주문으로 이어진다"`
- `npm run check:visual`
- `npm run check:ci`
- `npm run update:dashboard`
- `npm run operator:control-room -- --output docs/OPERATOR_CONTROL_ROOM.md`
- `npm run check:dashboard`
- `npm run check:control-room`
- `npm run check:ops-live`
- `npm run check:github-metadata`
- `npm run check:closed-workunit-mirrors`

## Subagent/Team Routing

- 기본은 solo execution: 변경 영역이 좁은 파일 집합(App.tsx 분기 + 라우팅, styles.css variant + keyframe, types.ts variant, regression spec)에 묶이며 병렬 worker conflict 가능성이 더 크다.
- Codex native subagents/team mode는 facility-greenhouse 진입 phase 전체 economy/visual QA를 별도 evidence로 분리할 때만 사용한다.
