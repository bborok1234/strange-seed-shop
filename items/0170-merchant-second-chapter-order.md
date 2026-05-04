# WorkUnit #336 — 포장잎 상인 단골 납품 후 두 번째 단골 chapter 의뢰가 production loop를 잇는다

## GitHub authority

- GitHub issue: #336 https://github.com/bborok1234/strange-seed-shop/issues/336
- Branch: `codex/0336-merchant-second-chapter-order`
- Campaign source of truth: P0.5 Idle Core + Creative Rescue
- Runner decision: `production-game-intake-required` after #332 main CI `25286072238` 및 #334 main CI `25286329093` success
- Status: plan-first

## 문제 / 배경

#332는 포장잎 상인 단골 납품 follow-up order(`MERCHANT_FOLLOWUP_ORDER`)를 도입하고 `merchant-delivered` reward motion으로 닫았다. 그러나 단골 납품이 끝나면 merchant chain은 거기서 멈추고 다음 단골 chapter 목표가 같은 화면에 보이지 않는다. 플레이어는 보상 직후 “이제 또 무엇을 하지?”에서 정지하고, idle 경쟁작이 약속하는 “contract 완료 직후 다음 contract objective” production gap에 닿는다.

## Reference teardown

- Egg, Inc.: contract 완료 즉시 새 contract slot이 같은 UI에 등장해 retention loop를 끊지 않는다.
- Idle Miner Tycoon: 광산 한 단계 완료 직후 다음 단계 unlock UI가 즉시 들어와 “다음에 무엇” 질문을 시각적으로 닫는다.
- Reject: 단골 납품 완료 후 화면을 그대로 두고 reward toast만 띄우는 방식. 다음 chapter objective가 없으면 단발 거래로 끝난다.

## Creative brief

- Player fun target: 단골과의 거래가 단발이 아니라 정기 chain으로 escalation되는 손맛.
- Core loop role: merchant chain 두 번째 chapter — 단발 follow-up → 두 번째 정기 chapter → (이후 더 큰 거래/새 단골 후속 WorkUnit).
- Screen moment: #332 follow-up delivery 직후 production card/playfield에 두 번째 chapter 등장.
- Required assets/FX: 신규 accepted manifest asset 없음. existing merchant/order crate asset + DOM/CSS chapter card variant + reveal motion + order crate variant 사용.
- Game-feel requirements: `merchant-delivered` → `merchant-second-chapter` 전환 reveal motion(0.6s 내 chapter card glow, crate state 전환), 잎 수령 시 progress 즉시 반응, 두 번째 chapter 납품 시 receipt + reward motion + chapter delivered.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- 적용 규칙: playfield를 가리지 않고 persistent HUD 저밀도 유지, chapter CTA는 게임 동사 사용. DOM text만으로 통과하지 않고 393px screenshot/playtest evidence를 남긴다.

## Game Studio Department Signoff

- 기획팀: 단골 첫 거래의 손맛이 두 번째 chapter로 escalation되어야 정원 경제 actor 약속이 살아난다.
- 리서치팀: idle 경쟁작은 reward와 next contract objective를 한 화면에 묶는다. 단발 거래 후 chain이 끊기면 retention hook이 사라진다.
- 아트팀: 신규 accepted manifest asset 없음. existing merchant/order crate asset + DOM/CSS chapter state + reveal motion으로 닫는다. 새 merchant sprite/strip은 별도 provenance WorkUnit.
- 개발팀: `src/App.tsx`, `src/styles.css`, `src/game/playfield/types.ts`, `tests/visual/p0-mobile-game-shell.spec.ts` 중심. `MERCHANT_SECOND_CHAPTER_ORDER` 정의, `getCurrentOrder` 분기, playfield variant, chapter card variant, regression 추가.
- 검수팀: Browser Use iab current-session 시도 → blocker 시 issue 전용 blocker + 393px Playwright screenshot, layout invariant 확인, `npm run check:visual`, `npm run check:ci`.
- 마케팅팀: mock-only player promise. 외부 채널/실결제/광고 없음.
- 고객지원팀: “단골 납품 끝났는데 또 뭐 하지?”를 두 번째 chapter 진행률 + reveal로 줄인다.

## Plan

1. `MERCHANT_SECOND_CHAPTER_ORDER`(`order_merchant_chapter_two_001`)를 정의한다. 단발 follow-up(잎 18, 보상 잎 54+꽃가루 2+재료 1)보다 큰 정기 chapter 거래로 잡는다(예: 잎 36, 보상 잎 96+꽃가루 3+재료 2). regression이 정확히 검증할 수 있도록 숫자는 한 번 결정해 freeze한다.
2. `getCurrentOrder`에 분기를 추가해 `MERCHANT_FOLLOWUP_ORDER` 완료 후 `MERCHANT_SECOND_CHAPTER_ORDER`가 current order로 선택되게 한다. 기존 first/greenhouse/lunar/follow-up 우선순위를 보존한다.
3. `getOrderDeliveryCta`에 `상인 두 번째 단골 납품` CTA를 추가한다.
4. production card에 `has-merchant-second-chapter` className 분기를 추가하고, playfield order crate에 `merchant-second-chapter` / `merchant-second-delivered` variant를 추가한다. CSS chapter card border/background, chapter reveal glow, crate dispatch state, reward motion을 작성한다.
5. `MerchantFollowupDelivered → MerchantSecondChapter` 전환 reveal motion(짧은 highlight, chapter title pulse) — DOM/CSS keyframe.
6. `tests/visual/p0-mobile-game-shell.spec.ts`에 두 번째 chapter 등장, 잎 수령 progress, 납품 CTA, receipt/reward motion, completed order save state(`order_merchant_chapter_two_001`)를 393px regression으로 추가한다.
7. focused checks(build, focused playwright grep, check:visual, check:ci) → issue/PR body-file/evidence mirror → branch push → PR create/watch/merge → main CI observation.

## 수용 기준

- [ ] `MERCHANT_FOLLOWUP_ORDER` 완료 직후 `MERCHANT_SECOND_CHAPTER_ORDER`가 current order로 선택된다.
- [ ] production card에 신규 chapter card variant(`.has-merchant-second-chapter`)가 적용되어 단골 두 번째 chapter임이 한 화면에서 읽힌다.
- [ ] playfield order crate가 `merchant-second-chapter`로 표시되고, 납품 완료 시 `merchant-second-delivered`로 전환되며 chapter reveal motion이 보인다.
- [ ] 두 번째 chapter는 single batch follow-up보다 큰 자원 요구와 보상을 가지며 production tick + 잎 수령으로 progress가 채워진다.
- [ ] 393px 모바일에서 chapter card / playfield crate / receipt / 하단 탭이 겹치지 않고 overflow를 만들지 않는다.
- [ ] 신규 accepted manifest asset 없이 existing merchant/order crate asset + DOM/CSS state + reward motion만 사용하고 runtime image generation/API 호출 없음.
- [ ] Browser Use iab current-session 시도 evidence 또는 blocker, 393px focused Playwright screenshot, `npm run check:visual`, `npm run check:ci`가 남는다.

## 검증 명령

- `npm run build`
- `npx playwright test --config playwright.config.ts --grep "단골 두 번째|merchant-second-chapter|상인 두 번째 단골"`
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

- `getCurrentOrder` 우선순위가 greenhouse/lunar 흐름과 충돌하지 않게 follow-up 직후 한정으로 두 번째 chapter를 라우팅해야 한다. greenhouse/lunar progression이 더 진행된 save에서는 기존 우선순위가 유지되어야 한다.
- 두 번째 chapter 자원 요구가 너무 크면 첫 5분 안에 도달하지 못해 production loop reveal moment가 사라질 수 있다. 따라서 follow-up의 약 2배 수준으로 선택해 production tick + 정원 잎 수령으로 1~2회 cycle 안에 닿게 한다.
- 모바일 production card가 이미 길어 chapter card 추가 시 overflow / 하단 탭 overlap 회귀가 생길 수 있다. 393px regression이 이를 잡는다.
- Browser Use iab backend가 현재 세션에서 발견되지 않을 수 있으므로 issue 전용 blocker를 새로 기록한다.

## Subagent/Team Routing

- 기본은 solo execution: 변경 영역이 같은 좁은 파일 집합(App.tsx 분기, styles.css chapter state, types.ts variant, regression spec)에 묶이며 병렬 worker conflict 가능성이 더 크다.
- Codex native subagents/team mode는 chapter scaling/economy balance 분석과 visual QA가 독립 evidence로 분리될 때만 사용한다.
