## GitHub authority

- Plan artifact: `items/0175-greenhouse-facility-entry-reveal.md`
- Source: Studio Harness v3 dry-run after #344 merge / main CI run `25302138795` success → `production-game-intake-required` (queue empty)
- Campaign source of truth: P0.5 Idle Core + Creative Rescue
- WorkUnit type: production game quality Intake

## 문제 / 배경

#344는 단골 시퀀스 마침 직후 production card에 "다음 목표: 달빛 온실 설립" handoff card를 영구 표시해 chain-end gap을 시각적으로 닫았습니다. 그러나 플레이어가 그 안내를 따라 작업대를 강화하고 `buyGreenhouseFacility`를 click하면 변하는 것은 두 가지뿐입니다:

1. `greenhouseFacilityLevel`이 1로 토글되고 `idleProduction.pendingLeaves`가 GREENHOUSE_ORDER.requiredLeaves로 미리 채워진다.
2. production rate가 +10%로 silent하게 올라간다(분당 15.3 잎).

facility가 건설된 그 순간 production card나 playfield에는 어떤 reveal moment도 없다. chain handoff card → 작업대 강화 → 온실 설비 click → "갑자기 다음 주문 chain이 시작된 화면" 사이의 transition이 비어 있다. idle 경쟁작은 main building/factory complete 순간에 reveal cinematic을 묶는다(Egg Inc. henhouse upgrade complete burst, Idle Miner Tycoon 광산 단계 unlock, Cell to Singularity tech node unlock).

## 목표

`buyGreenhouseFacility` 성공 직후 production card에 "달빛 온실 입장" 2.0초 reveal motion을 1회 표시해 chain handoff loop를 닫는다. receipt는 다음 주문(GREENHOUSE_ORDER, "온실 선반 납품")과 +10% production boost 적용을 한 호흡에 보여준다.

## Small win

chain handoff(#344)가 약속한 "달빛 온실 설립"이 player click과 함께 시각적 beat로 마무리되어 chain-end → facility-greenhouse 진입 loop가 시각적으로 완성된다.

## Studio Campaign Gate

- Player verb: `단골 시퀀스 마침 → 작업대 강화 → 온실 설비 click → 달빛 온실 입장 reveal → 다음 주문(온실 선반 납품) 시작`
- Production/progression role: facility-greenhouse 진입 phase의 첫 beat — chain handoff(#344)와 first GREENHOUSE_ORDER 사이의 transition을 시각적으로 닫는다.
- Screen moment: `buyGreenhouseFacility` 성공 직후 production card에 `.greenhouse-facility-entry-receipt`(2.0초 reveal motion) + strong "달빛 온실 입장" + span "다음 주문: 온실 선반 납품 시작" + small "정원 자동 생산 +10% 적용". playfield order crate가 같은 2.0초 동안 `greenhouse-facility-entry` variant로 표시된 뒤 GREENHOUSE_ORDER variant로 자연스럽게 전환된다. 기존 #344 handoff card는 facility level 토글로 자동 unmount된다.
- Concrete visual/game-feel payoff:
  - HUD affordance: production card에 `.has-greenhouse-facility-entry-receipt` className + `.greenhouse-facility-entry-receipt`.
  - Order crate visual state: playfield order crate `greenhouse-facility-entry` variant — 2.0초 reveal 후 GREENHOUSE_ORDER variant로 전환.
  - Reward motion: receipt fade-in/glow burst/fade-out + chip pulse — 1회성 reveal motion.
  - Numeric payoff: 별도 multiplier 변경 없음. 시각적 reveal에 한정해 기존 +10% production boost는 그대로 유지(receipt copy로 plain text 표시).
- Competition production gap: idle 경쟁작은 main building/factory complete 순간에 reveal cinematic을 묶는다. 우리는 silent 수치 변화로만 두고 있다.
- Asset/FX axis commitment: HUD affordance + order crate visual state + reward motion. 신규 accepted manifest asset 없이 existing facility icon + DOM/CSS state + sparkle keyframe으로 닫는다.
- Playtest evidence: Browser Use iab 우선 시도, blocker 시 issue 전용 blocker + 393px focused Playwright regression(facility build 직후 receipt 표시 + 카피 + unmount + bottom-tabs 비충돌).

## Game Studio Department Signoff

- 기획팀: chain handoff(#344)가 약속한 "달빛 온실 설립"이 player click과 함께 시각적 beat로 마무리되어야 chain-end → facility-greenhouse 진입 loop가 완성된다.
- 리서치팀: idle 경쟁작은 main building/factory unlock 순간에 reveal moment를 묶는다. 우리는 silent 수치 변화로만 두고 있다.
- 아트팀: 신규 accepted manifest asset 없음. existing facility icon + DOM/CSS receipt + sparkle keyframe만 사용.
- 개발팀: `src/App.tsx`(`GreenhouseFacilityEntryReceipt` interface + state + `buyGreenhouseFacility` 트리거 + production card 렌더 + playfield variant 라우팅), `src/styles.css`(receipt + sparkle keyframe + playfield variant), `src/game/playfield/types.ts`(`greenhouse-facility-entry` variant), `tests/visual/p0-mobile-game-shell.spec.ts`(facility build → entry receipt 표시 + unmount 393px regression).
- 검수팀: Browser Use iab current-session 시도 → blocker 시 issue 전용 blocker + 393px focused Playwright regression(receipt 표시 + 카피 + unmount + bottom-tabs 비충돌), `npm run check:visual`, `npm run check:ci`.
- 마케팅팀: mock-only player promise. 외부 채널/실결제/광고 없음.
- 고객지원팀: "온실 설비 click했는데 화면에서 아무 일도 안 일어난 것 같다"를 entry reveal로 줄인다.

## 사용자/운영자 가치

- 사용자: chain handoff(#344) → 작업대 강화 → 달빛 온실 설립까지 따라온 손맛이 "달빛 온실에 들어왔다"는 한 번의 시각적 beat로 보상받는다.
- 운영자: #336 → #338 → #344 chain handoff loop를 facility-greenhouse 진입의 첫 reveal moment로 닫아 P0.5 Idle Core + Creative Rescue의 production loop continuity를 한 칸 더 채운다.

## 수용 기준

- [ ] `buyGreenhouseFacility`가 성공한 직후(`greenhouseFacilityLevel`이 1로 토글된 케이스에서만) `.greenhouse-facility-entry-receipt`가 production card에 등장한다.
- [ ] receipt 카피는 strong "달빛 온실 입장", span "다음 주문: 온실 선반 납품 시작", small "정원 자동 생산 +10% 적용"이다.
- [ ] receipt는 약 2초 후 자동으로 unmount되고, 그 직후 #344 handoff card도 facility level 토글로 사라져 production card는 GREENHOUSE_ORDER 모드로 자연스럽게 전환된다.
- [ ] playfield order crate variant `greenhouse-facility-entry`가 정의되고 receipt 활성 동안 표시되며 reward motion 우선순위와 충돌하지 않는다.
- [ ] 393px 모바일에서 receipt / 기존 production card chip / 하단 탭이 겹치지 않고 production card에 추가 overflow를 만들지 않는다.
- [ ] 신규 accepted manifest asset 없이 existing facility icon + DOM/CSS state + 작은 motion만 사용하고 runtime image generation/API 호출 없음.
- [ ] 393px focused Playwright regression(receipt 표시 + 카피 + unmount), `npm run check:visual`, `npm run check:ci`가 남는다.

## Visual evidence 계획

- Browser Use iab target: chain handoff(#344) → 작업대 강화 → 온실 설비 click → entry reveal → GREENHOUSE_ORDER 진입.
- Fallback screenshot: `mobile-greenhouse-facility-unlock-v0-393.png`(focused regression artifact 사본, entry receipt 포함).
- Layout invariant: receipt / production card chip / 하단 탭 vs `.bottom-tabs`, no body scroll, no panel masked overflow.

## Playable mode 영향

- Local dev: `npm run dev -- --host 127.0.0.1 --port 3000`
- Stable main playable mirror 계약 유지: `npm run play:main` + port 5174.

## 안전 범위

- runtime image generation/API 호출 없음.
- 신규 accepted manifest asset 없음. existing facility icon + DOM/CSS receipt + sparkle keyframe + playfield variant만 사용.
- real payment, customer data, external production deployment 없음.
- 기존 first/greenhouse/lunar/follow-up/second-chapter 우선순위 보존: 영구 boost(+10%) economy 변동 없음. 신규 변경은 시각적 reveal에 한정.
- save 호환: 신규 state는 transient receipt에 한정, save schema 변경 없음.

## 검증 명령

- `npm run build`
- focused Playwright: `--grep "작업대 강화는 첫 온실 설비 목표로 이어진다"`
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

- 기본은 solo execution: 변경 영역이 좁은 파일 집합(App.tsx receipt + 라우팅, styles.css receipt + variant, types.ts variant, regression spec)에 묶이며 병렬 worker conflict 가능성이 더 크다.
- Codex native subagents/team mode는 facility-greenhouse 진입 phase 전체 economy/visual QA를 별도 evidence로 분리할 때만 사용한다.
