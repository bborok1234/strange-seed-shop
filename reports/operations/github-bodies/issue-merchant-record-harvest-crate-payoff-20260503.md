## GitHub authority

- Issue: #328 https://github.com/bborok1234/strange-seed-shop/issues/328
- Plan artifact: `items/0166-merchant-record-harvest-crate-payoff.md`
- Source: Studio Harness v3 dry-run after #327 merge/main CI success
- Campaign source of truth: P0.5 Idle Core + Creative Rescue
- WorkUnit type: production game quality Intake

## 문제 / 배경

#326은 `이슬연금 라미` 도감 저장 직후 `젤리콩 씨앗 → 포장잎 상인` next target row를 복구했다. 하지만 target row에서 실제로 젤리콩 씨앗을 구매/심기/성장/수확했을 때 `포장잎 상인` harvest reveal과 주문상자/reward motion payoff가 한 화면의 production moment로 닫히는 evidence는 아직 없다.

## 목표

`다음 기록으로 이어가기: 젤리콩 씨앗` 이후 target row에서 `포장잎 상인`을 실제 수확하고, reveal/receipt/playfield/order crate visual state가 다음 주문/보상 행동으로 이어지게 만든다.

## Small win

라미 저장 후 “다음 아이”로 보였던 `포장잎 상인`을 실제 harvest reveal과 주문상자 payoff로 만나, 수집 목표가 UI 예고에서 손맛 있는 결과로 닫힌다.

## Studio Campaign Gate

- Player verb: `젤리콩 씨앗을 심어 포장잎 상인을 수확하고 상인 주문상자를 확인하기`
- Production/progression role: 라미 저장 다음 목표 → 젤리콩 씨앗 target row → planting/growth → 포장잎 상인 reveal → order crate/reward motion → 다음 행동
- Screen moment: #326 seeds target row에서 구매/심기 이후 정원 harvest reveal과 주문상자 상태
- Concrete visual/game-feel payoff: `포장잎 상인` harvest reveal, merchant/order crate visual state, reward motion/receipt, playfield state, bottom-tab/overflow-safe 393px screenshot
- Competition production gap: collection idle games는 next target row가 실제 named reveal과 production reward로 닫힐 때 반복 수집 신뢰가 강해진다. target row에서 멈추는 대안은 reject한다.
- Playtest evidence: Browser Use iab 우선, blocker 시 issue 전용 blocker + 393px Playwright screenshot/layout invariant.

## Game Studio Department Signoff

- 기획팀: “하나만 더” 목표가 `포장잎 상인` reveal과 reward/order crate payoff로 닫혀야 한다.
- 리서치팀: reference collection/progression games는 target acquisition 뒤 reward container/receipt를 같은 loop에 연결한다.
- 아트팀: 신규 accepted manifest asset은 이번 WorkUnit 기본 범위가 아니다. 기존 포장잎 상인 portrait를 쓰되 DOM/CSS order crate visual state, reward motion, HUD affordance로 asset/FX payoff를 만든다. 새 sprite/FX 필요 시 별도 provenance WorkUnit.
- 개발팀: `src/App.tsx`, `src/styles.css`, `tests/visual/p0-mobile-game-shell.spec.ts` 중심의 좁은 tranche. 필요하면 playfield telemetry만 추가한다.
- 검수팀: Browser Use iab current-session 시도, 393px screenshot, no body scroll/bottom-tab overlap, order crate visual state를 확인한다.
- 마케팅팀: mock-only promise. 외부 채널/실결제 없음.
- 고객지원팀: “포장잎 상인을 수확하면 뭘 해야 하나요?”를 reward/order crate CTA로 줄인다.

## 사용자/운영자 가치

- 사용자: next target이 실제 harvest payoff로 닫혀 수집 신뢰와 반복 동기가 유지된다.
- 운영자: #322→#324→#326으로 만든 unlocked seed pool chain을 세 번째 named harvest + order crate visual evidence까지 확장한다.

## 수용 기준

- [ ] #326 라미 저장 후 `젤리콩 씨앗 → 포장잎 상인` target row에서 구매/심기/성장/수확 flow가 재현된다.
- [ ] 수확 reveal이 `포장잎 상인`을 명확히 보여주고 `새 기록 재순환` 또는 동등한 record-loop source를 설명한다.
- [ ] reveal/receipt 또는 정원 HUD가 merchant/order crate visual state와 reward motion/다음 행동을 보여준다.
- [ ] 신규 accepted manifest asset 없이 existing portrait + DOM/CSS HUD/CTA/reward motion으로 구현하고 runtime image generation/API를 호출하지 않는다.
- [ ] 393px 모바일에서 reveal/receipt/order crate/하단 탭이 겹치지 않고 overflow를 만들지 않는다.
- [ ] Browser Use iab current-session 시도 evidence 또는 blocker, focused Playwright screenshot, `npm run check:visual`, `npm run check:ci`가 남는다.

## Visual evidence 계획

- Browser Use iab target: #326 flow → 라미 저장 → 포장잎 상인 target row → 젤리콩 씨앗 구매/심기/수확 → order crate/reward motion.
- Fallback screenshot: `reports/visual/issue-merchant-record-harvest-crate-payoff-393.png`.
- Layout invariant: reveal/receipt/order crate vs `.bottom-tabs`, no body scroll, no masked overflow.

## Playable mode 영향

- Local dev: `npm run dev -- --host 127.0.0.1 --port 3000`
- Stable main playable mirror는 `npm run play:main` + port 5174 계약 유지.

## 안전 범위

- runtime image generation/API 호출 없음.
- 신규 accepted manifest asset 없음. existing portrait, DOM/CSS HUD/CTA/reward motion만 허용.
- real payment, customer data, external production deployment 없음.

## 검증 명령

- `npm run build`
- focused Playwright: 포장잎 상인 / 주문상자 / 다음 기록 목표
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
- Codex native subagents/team mode는 order crate visual state와 harvest state 설계가 분리될 때만 사용한다.
