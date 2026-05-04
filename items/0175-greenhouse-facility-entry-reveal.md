# WorkUnit #346 — 달빛 온실 설립 직후 production card에 "달빛 온실 입장" reveal motion으로 chain handoff loop를 닫는다

## GitHub authority

- GitHub issue: #346 https://github.com/bborok1234/strange-seed-shop/issues/346
- Branch: `codex/0175-greenhouse-facility-entry-reveal`
- Campaign source of truth: P0.5 Idle Core + Creative Rescue
- Runner decision: `production-game-intake-required` after #344 main CI `25302138795` success and queue empty
- Status: plan-first

## 문제 / 배경

#344는 단골 시퀀스 마침 직후 production card에 "다음 목표: 달빛 온실 설립" handoff card를 영구 표시해 chain-end gap을 시각적으로 닫았다. 그러나 플레이어가 그 안내를 따라 작업대를 강화하고 `buyGreenhouseFacility`를 click하면 변하는 것은 다음 두 가지뿐이다:

1. `greenhouseFacilityLevel`이 1로 토글되고 `idleProduction.pendingLeaves`가 GREENHOUSE_ORDER.requiredLeaves로 미리 채워진다.
2. production rate가 +10%로 silent하게 올라간다. 기존 `mobile 작업대 강화는 첫 온실 설비 목표로 이어진다` regression이 분당 15.3 잎 수치 변화만 검증한다.

facility가 건설된 그 순간 production card나 playfield에는 어떤 reveal moment도 없다. 즉 chain handoff card → 작업대 강화 → 온실 설비 click → "갑자기 다음 주문 chain이 시작된 화면" 사이의 transition이 비어 있다. idle 경쟁작은 main building/factory complete 순간에 reveal cinematic, 새 production line 등장, 다음 unlock progression hint를 한 호흡에 묶는다(Egg Inc. henhouse upgrade complete burst, Idle Miner Tycoon 광산 단계 unlock, Cell to Singularity tech node unlock). 우리는 chain handoff의 마지막 한 호흡(`달빛 온실 입장`)이 비어 있다.

## Reference teardown

- Egg, Inc.: henhouse 등급 업그레이드 complete 시 화면 가득 reveal burst + 새 단계 buff chip.
- Idle Miner Tycoon: 광산 단계 unlock 직후 unlock cinematic + 새 production line 등장.
- Cell to Singularity: tech tree node unlock 시 시각적 burst + 다음 주제 카드 push.
- Reject: facility build를 silent 수치 변화로만 두는 방식. 다음 단계 진입을 시각적으로 묶지 않으면 chain handoff의 "다음 목표" 약속이 비어 보인다.

## Creative brief

- Player fun target: 단골 시퀀스 마침 → 작업대 강화 → 달빛 온실 설립까지 따라온 손맛이 "달빛 온실에 들어왔다"는 한 번의 시각적 beat로 보상받는다.
- Core loop role: facility-greenhouse 진입 phase의 첫 beat — chain handoff(#344)와 first GREENHOUSE_ORDER 사이의 transition을 시각적으로 닫는다.
- Screen moment: `buyGreenhouseFacility` 성공 직후 production card에 `.greenhouse-facility-entry-receipt`(2.0초 reveal motion) + strong "달빛 온실 입장" + span "다음 주문: 온실 첫 출하 시작" + small "정원 자동 생산 +10% 적용". playfield order crate가 `greenhouse-facility-entry` variant로 같은 2.0초 동안 표시된 뒤 GREENHOUSE_ORDER variant로 자연스럽게 전환된다. 기존 #344 handoff card는 facility level 토글로 자동 unmount된다.
- Required assets/FX: 신규 accepted manifest asset 없음. existing greenhouse facility icon + DOM/CSS receipt + sparkle keyframe + playfield variant.
- Game-feel requirements: receipt는 fade-in(0.35s) → glow burst(0.4s) → fade-out(1.25s)로 1회 재생, chain handoff fade-out과 겹치지 않게 facility-level이 토글되는 같은 commit 직후 set. playfield variant는 receipt 활성 동안만 표시되어 reward motion 우선순위와 충돌하지 않는다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- 적용 규칙: playfield 비차폐, persistent HUD 저밀도 유지, receipt는 production card 내부 기존 receipt 영역에 묶여 추가 layout column을 만들지 않는다. DOM text만으로 통과하지 않고 393px screenshot/playtest evidence를 남긴다.

## Game Studio Department Signoff

- 기획팀: chain handoff(#344)가 약속한 "달빛 온실 설립"이 player click과 함께 시각적 beat로 마무리되어야 chain-end → facility-greenhouse 진입 loop가 완성된다.
- 리서치팀: idle 경쟁작은 main building/factory unlock 순간에 reveal moment를 묶는다. 우리는 silent 수치 변화로만 두고 있다.
- 아트팀: 신규 accepted manifest asset 없음. existing greenhouse facility icon + DOM/CSS receipt + sparkle keyframe만 사용.
- 개발팀: `src/App.tsx`(`GreenhouseFacilityEntryReceipt` interface + state + `buyGreenhouseFacility` 트리거 + production card 렌더 + playfield variant 라우팅), `src/styles.css`(receipt + sparkle keyframe + playfield variant), `src/game/playfield/types.ts`(`greenhouse-facility-entry` variant), `tests/visual/p0-mobile-game-shell.spec.ts`(facility 설립 → entry receipt 표시 393px regression).
- 검수팀: Browser Use iab current-session 시도 → blocker 시 issue 전용 blocker + 393px focused Playwright regression(receipt 표시 + classNames + bottom-tabs 비충돌), `npm run check:visual`, `npm run check:ci`.
- 마케팅팀: mock-only player promise. 외부 채널/실결제/광고 없음.
- 고객지원팀: "온실 설비 click했는데 화면에서 아무 일도 안 일어난 것 같다"를 entry reveal로 줄인다.

## Plan

1. `src/App.tsx`에 `GreenhouseFacilityEntryReceipt { id: number; nextOrderTitle: string; bonusPercent: number }` interface와 `useState<GreenhouseFacilityEntryReceipt | null>` state를 추가한다.
2. `buyGreenhouseFacility` 함수의 commit 직후(facility level이 1로 토글된 케이스), `setGreenhouseFacilityEntryReceipt({ id: Date.now(), nextOrderTitle: GREENHOUSE_ORDER.title, bonusPercent: Math.round(GREENHOUSE_FACILITY_RATE_BONUS * 100) })`를 호출하고 2_000ms timeout으로 unmount한다. `trackEvent("greenhouse_facility_entry_revealed", { rewardMotion: "greenhouse_facility_entry_reveal" })` 추가.
3. production card className 분기에 `greenhouseFacilityEntryReceipt ? "has-greenhouse-facility-entry-receipt" : ""`를 추가한다.
4. production card 내부 기존 receipt 블록 근처에 `.greenhouse-facility-entry-receipt` div를 렌더한다 (strong "달빛 온실 입장", span "다음 주문: {nextOrderTitle} 시작", small "정원 자동 생산 +{bonusPercent}% 적용", chip "온실 입장").
5. `src/game/playfield/types.ts`의 `orderVariant` union에 `greenhouse-facility-entry`를 추가한다.
6. `getGardenPlayfieldViewModel` 시그니처와 호출부에 `greenhouseFacilityEntryReceipt`를 전달, `greenhouseFacilityEntryActive = Boolean(...)` 파생, orderVariant priority 체인에 `merchant-chain-complete`보다 위에 `greenhouse-facility-entry` 분기를 추가한다(reward motion 우선순위 유지).
7. `src/styles.css`에 `.greenhouse-facility-entry-receipt` + chip + sparkle keyframe + playfield variant(`order-variant-greenhouse-facility-entry`)를 추가한다.
8. `tests/visual/p0-mobile-game-shell.spec.ts`에 393px regression을 추가한다: 기존 "모바일 작업대 강화는 첫 온실 설비 목표로 이어진다" flow 직후 facility build click → `.greenhouse-facility-entry-receipt` visible + strong "달빛 온실 입장" + 다음 주문 카피 + bottom-tabs 비충돌 + 2.4초 후 receipt unmount 확인.
9. focused checks → issue/PR body-file/evidence mirror → branch push → PR create/watch/merge → main CI observation.

## 수용 기준

- [ ] `buyGreenhouseFacility`가 성공한 직후(`greenhouseFacilityLevel`이 1로 토글된 케이스에서만) `.greenhouse-facility-entry-receipt`가 production card에 등장한다.
- [ ] receipt 카피는 strong "달빛 온실 입장", span "다음 주문: {GREENHOUSE_ORDER.title} 시작", small "정원 자동 생산 +10% 적용"이다.
- [ ] receipt는 약 2초 후 자동으로 unmount되고, 그 직후 #344 handoff card도 facility level 토글로 사라져 production card는 GREENHOUSE_ORDER 모드로 자연스럽게 전환된다.
- [ ] playfield order crate variant `greenhouse-facility-entry`가 정의되고 receipt 활성 동안 표시되며 reward motion 우선순위와 충돌하지 않는다.
- [ ] 393px 모바일에서 receipt / 기존 production card chip / 하단 탭이 겹치지 않고 production card에 추가 overflow를 만들지 않는다.
- [ ] 신규 accepted manifest asset 없이 existing facility icon + DOM/CSS state + 작은 motion만 사용하고 runtime image generation/API 호출 없음.
- [ ] 393px focused Playwright regression(receipt 표시 + 카피 + unmount), `npm run check:visual`, `npm run check:ci`가 남는다.

## 검증 명령

- `npm run build`
- `npx playwright test --config playwright.config.ts --grep "온실 설비|greenhouse-facility-entry|달빛 온실 입장"`
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

- 기존 "모바일 작업대 강화는 첫 온실 설비 목표로 이어진다" regression이 facility 설립 후 production rate(분당 15.3 잎)를 검증한다. receipt가 layout/숫자에 끼어들면 그 spec이 깨질 수 있으므로 receipt는 production card 내부 기존 receipt 영역에 묶고 rate 표시 위치/copy를 변경하지 않는다.
- chain handoff card unmount(facility level 토글)와 entry receipt fade-in이 동시에 일어나면 layout이 흔들릴 수 있다. handoff card는 condition 변화로 즉시 사라지고, receipt는 0.35s fade-in으로 등장해 시각적 우선순위를 분리한다.
- playfield `greenhouse-facility-entry` variant가 GREENHOUSE_ORDER variant 또는 다른 reward motion과 충돌하면 가시성이 깨진다. variant priority 체인에 reward motion보다 아래, GREENHOUSE_ORDER variant보다 위로 배치해 receipt 동안만 표시.
- Browser Use iab는 current-session 미발견이 예상되므로 issue 전용 blocker를 새로 기록한다.

## Subagent/Team Routing

- 기본은 solo execution: 변경 영역이 좁은 파일 집합(App.tsx receipt + 라우팅, styles.css receipt + variant, types.ts variant, regression spec)에 묶이며 병렬 worker conflict 가능성이 더 크다.
- Codex native subagents/team mode는 facility-greenhouse 진입 phase 전체 economy/visual QA를 별도 evidence로 분리할 때만 사용한다.
