## GitHub authority

- Plan artifact: `items/0170-merchant-second-chapter-order.md`
- Source: Studio Harness v3 dry-run after #332 merge / main CI `25286072238` and #334 merge / main CI `25286329093` success
- Campaign source of truth: P0.5 Idle Core + Creative Rescue
- WorkUnit type: production game quality Intake

## 문제 / 배경

#332는 포장잎 상인 단골 납품 follow-up order를 production card/playfield에 도입하고, 납품 완료 시 `merchant-delivered` 상태와 reward motion으로 닫았다. 그러나 단골 납품이 끝나면 merchant chain은 거기서 멈추고 다음 단골 chapter 목표가 같은 화면에 보이지 않는다. 플레이어는 보상 직후 “이제 또 무엇을 하지?”에서 정지하고, idle 경쟁작이 약속하는 “contract 완료 직후 다음 contract objective” production gap에 닿는다.

## 목표

`포장잎 상인 단골 납품` 완료 직후 `포장잎 상인 두 번째 단골 chapter`(더 큰 잎/꽃가루/재료 요구) 주문이 production card/playfield에 등장하고, 신규 chapter 진입 reveal motion과 chapter card visual state로 다음 거래 목표가 한 화면에서 읽히게 만든다.

## Small win

단골 납품 완료가 일회성 보상으로 끝나지 않고, 즉시 두 번째 단골 chapter 의뢰가 production loop의 다음 박자로 이어진다.

## Studio Campaign Gate

- Player verb: `단골 두 번째 chapter 의뢰 진입 → 잎/꽃가루/재료 모으기 → 납품 → 보상 + 다음 chapter 미리보기`
- Production/progression role: merchant chain 두 번째 chapter — 단골 단발 거래에서 단골 정기 거래로 escalation.
- Screen moment: #332 follow-up delivery 직후 production card/playfield에 두 번째 chapter 등장.
- Concrete visual/game-feel payoff: 신규 playfield state `merchant-second-chapter`(/`merchant-second-delivered`), 신규 HUD chapter card variant(`.has-merchant-second-chapter`), chapter reveal motion(delivered → second-chapter 전환), 393px regression screenshot.
- Competition production gap: idle 경쟁작(Egg Inc., Idle Miner Tycoon)은 contract 완료 직후 같은 화면에 다음 contract objective와 보상 흐름을 즉시 보여준다. 현재 게임은 단골 납품 완료에서 chain이 끊긴다.
- Asset/FX axis commitment: playfield state + HUD affordance + order crate visual state + reward motion. (신규 accepted manifest asset 없이 existing merchant/order crate asset과 DOM/CSS state로 닫는다.)
- Playtest evidence: Browser Use iab 우선 시도, blocker 시 issue 전용 blocker + 393px Playwright screenshot/layout invariant.

## Game Studio Department Signoff

- 기획팀: 포장잎 상인 첫 단골 납품의 손맛이 다음 chapter 의뢰로 자연스럽게 escalation되어야 정원 경제 actor 약속이 살아난다.
- 리서치팀: idle 경쟁작은 reward claim과 next contract objective를 한 화면에 묶는다. 단발 거래 후 chain이 끊기면 retention hook이 사라진다.
- 아트팀: 신규 accepted manifest asset 없음. existing merchant/order crate asset과 DOM/CSS chapter state, reward motion으로 닫는다. 새 merchant sprite/strip은 별도 provenance WorkUnit.
- 개발팀: `src/App.tsx`(MERCHANT_SECOND_CHAPTER_ORDER 정의, getCurrentOrder/getOrderDeliveryCta/playfield variant 분기), `src/styles.css`(chapter card variant + chapter reveal motion + order crate variant), `src/game/playfield/types.ts`(`merchant-second-chapter`, `merchant-second-delivered` 추가), `tests/visual/p0-mobile-game-shell.spec.ts`(regression).
- 검수팀: Browser Use iab current-session 시도 → blocker 기록 + 393px Playwright screenshot, layout invariant(playfield/HUD/하단 탭/오버플로 없음), `npm run check:visual`, `npm run check:ci`.
- 마케팅팀: mock-only player promise. 외부 채널/실결제/광고 없음.
- 고객지원팀: “단골 납품 끝났는데 또 뭐 하지?”를 두 번째 chapter 진행률 + reveal로 줄인다.

## 사용자/운영자 가치

- 사용자: 포장잎 상인이 단발 거래자가 아니라 정기 단골 chain의 actor가 되어 수집-생산-주문 루프가 한 박자 더 길어진다.
- 운영자: #328→#330→#332 merchant chain을 두 번째 chapter로 확장해 P0.5 production loop evidence를 더 닫는다.

## 수용 기준

- [ ] `MERCHANT_FOLLOWUP_ORDER` 완료 직후 `MERCHANT_SECOND_CHAPTER_ORDER`가 `getCurrentOrder`에서 current order로 선택된다.
- [ ] production card에 신규 chapter card variant(`.has-merchant-second-chapter`)가 적용되어 단골 두 번째 chapter임이 한 화면에서 읽힌다.
- [ ] playfield order crate가 `merchant-second-chapter` variant로 표시되고, 납품 완료 시 `merchant-second-delivered`로 전환되며 chapter reveal motion이 보인다.
- [ ] 두 번째 chapter는 단발 follow-up보다 큰 자원(잎/꽃가루/재료) 요구와 보상을 가지며 production tick + 잎 수령으로 progress가 채워진다.
- [ ] 393px 모바일에서 chapter card / playfield crate / receipt / 하단 탭이 겹치지 않고 overflow를 만들지 않는다.
- [ ] 신규 accepted manifest asset 없이 existing merchant/order crate asset + DOM/CSS state + reward motion만 사용하고 runtime image generation/API 호출 없음.
- [ ] Browser Use iab current-session 시도 evidence 또는 blocker, 393px focused Playwright screenshot, `npm run check:visual`, `npm run check:ci`가 남는다.

## Visual evidence 계획

- Browser Use iab target: #332 follow-up 납품 완료 → 두 번째 chapter 등장 → 잎 수령 progress → 납품 → reward motion + chapter delivered.
- Fallback screenshot: `reports/visual/issue-NNN-merchant-second-chapter-order-393.png` (이슈 번호 할당 후 확정).
- Layout invariant: chapter card / playfield crate / receipt vs `.bottom-tabs`, no body scroll, no masked overflow.

## Playable mode 영향

- Local dev: `npm run dev -- --host 127.0.0.1 --port 3000`
- Stable main playable mirror는 `npm run play:main` + port 5174 계약 유지.

## 안전 범위

- runtime image generation/API 호출 없음.
- 신규 accepted manifest asset 없음. existing merchant/order crate asset + DOM/CSS chapter state + reward motion만 사용.
- real payment, customer data, external production deployment 없음.
- 기존 first/greenhouse/lunar/follow-up order 우선순위 보존.

## 검증 명령

- `npm run build`
- focused Playwright: `--grep "단골 두 번째|merchant 두 번째|merchant-second-chapter|상인 단골 두 번째"`
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

- 기본은 solo execution: 변경 영역이 같은 좁은 파일 집합(App.tsx 분기, styles.css chapter state, types.ts variant, regression spec)에 묶이며 병렬 worker conflict 가능성이 더 크다.
- Codex native subagents/team mode는 chapter scaling/economy balance 분석과 visual QA가 독립 evidence로 분리될 때만 사용한다.
