## GitHub authority

- Plan artifact: `items/0179-production-rate-breakdown-chips.md`
- Source: Studio Harness v3 dry-run after #352 merge / main CI run `25303677502` success → `production-game-intake-required` (queue empty)
- Campaign source of truth: P0.5 Idle Core + Creative Rescue
- WorkUnit type: production game quality Intake

## 문제 / 배경

`getProductionRatePerSecond`는 5개 multiplier source를 합산해 production rate를 계산한다(productionBoost +25% / workbench +15% / facility +10% / irrigation +15% / merchantChain +10%). 그러나 production card는 `분당 X.X 잎` 한 줄만 보여주고, 어떤 source가 얼마를 기여하는지는 화면에서 숨겨져 있다. `merchantChain` 한 source만 별도 `.merchant-chain-complete-badge`로 노출되며, 나머지 4개 source는 upgrades 카드 description으로 흩어져 있다.

idle 경쟁작은 main building/factory 화면에 source breakdown을 visible하게 둔다(Egg, Inc.의 `multiplier list`, Idle Miner Tycoon의 manager bonus stack, Cell to Singularity의 prestige boost stack). 우리는 이 readability lever가 비어 있다.

## 목표

production-card-heading 영역에 component multiplier breakdown chip strip을 더해 active multiplier별로 label + +N%를 한 줄(필요 시 wrap)에 보여준다. chip은 source가 0보다 클 때만 등장하고, orderCompleted=false 시점에서만 보여 chain handoff arc CSS와 충돌하지 않는다.

## Small win

플레이어가 "왜 분당 X.X 잎인가?"를 한 화면에서 즉시 읽고, 단골 시퀀스 마침/시설/물길 같은 upgrade의 영구 보상이 시각적으로 누적되어 보인다.

## Studio Campaign Gate

- Player verb: production card 글랜스 → 현재 rate + 어느 upgrade가 기여 중인지 즉시 인지.
- Production/progression role: production engine readability — 5개 multiplier source를 한 화면에 묶어 누적 효과를 인지하게 한다.
- Screen moment: production-card-heading 직후에 `.production-rate-breakdown` chip strip 등장. 활성 multiplier별 chip 표시 (예: `간식 +25% · 작업대 +15% · 시설 +10% · 단골 +10%`).
- Concrete visual/game-feel payoff:
  - HUD affordance: `.production-rate-breakdown` row + 활성 multiplier별 `.production-rate-chip`.
  - Reward motion: chip 등장은 React state 변화로 자연스럽게 등장(별도 motion 추가하지 않음 — 카드 중앙 영역 안정성 우선).
  - Numeric payoff: 별도 multiplier 변경 없음. readability에 한정.
- Competition production gap: idle 경쟁작은 source breakdown을 main HUD에 둔다. 우리는 single-number rate만 보여주고 단골만 독립 노출.
- Asset/FX axis commitment: HUD affordance + 카드 중앙 layout 보강. 신규 accepted manifest asset 없음.
- Playtest evidence: Browser Use iab 우선 시도, blocker 시 issue 전용 blocker + 393px focused Playwright regression(facility 강화 후 chip strip visible + 카피).

## Game Studio Department Signoff

- 기획팀: 누적 보상이 시각적으로 안 보이면 chain handoff arc(#344→#352)의 효과가 player perception에 누적되지 않는다.
- 리서치팀: idle 경쟁작은 production rate breakdown을 main HUD에 둔다.
- 아트팀: 신규 accepted manifest asset 없음. existing chip styling + DOM/CSS만 사용.
- 개발팀: `src/App.tsx`(`getProductionRateBreakdown` helper + `rateBreakdown` 파생 + production-card-heading 직후 렌더), `src/styles.css`(`.production-rate-breakdown` flex/wrap row + `.production-rate-chip` compact pill), `tests/visual/p0-mobile-game-shell.spec.ts`(facility 설립 + storage 설립 후 chip strip 검증).
- 검수팀: Browser Use iab current-session 시도 → blocker 시 issue 전용 blocker + 393px focused Playwright regression, `npm run check:visual`, `npm run check:ci`.
- 마케팅팀: mock-only player promise. 외부 채널/실결제/광고 없음.
- 고객지원팀: "지금 분당 X.X인데 왜?"를 chip strip으로 줄인다.

## 사용자/운영자 가치

- 사용자: production rate component multiplier가 한 화면에 visible해 누적 보상이 인지된다.
- 운영자: chain handoff arc 작업의 누적 효과가 production card에서 시각적으로 보여 P0.5 Idle Core + Creative Rescue의 production engine readability axis가 한 칸 채워진다.

## 수용 기준

- [ ] `getProductionRateBreakdown(save)`는 percent > 0인 source만 반환하고 순서는 productionBoost → workbench → facility → irrigation → merchantChain이다.
- [ ] production card에 `.production-rate-breakdown` row가 등장하는 조건: `breakdown.length > 0 && !productionStatus.orderCompleted`.
- [ ] 각 chip(`.production-rate-chip`)은 label + +N% 카피(예: "간식 +25%", "작업대 +15%", "시설 +10%")를 보여준다.
- [ ] 393px 모바일에서 breakdown row가 production card 내부 한 줄(또는 wrap)에 들어가고 overflow를 만들지 않는다.
- [ ] orderCompleted state(dispatch/handoff active)에서는 chip strip이 hide되어 chain handoff arc CSS와 충돌하지 않는다.
- [ ] 신규 accepted manifest asset 없이 DOM/CSS chip만 사용하고 runtime image generation/API 호출 없음.
- [ ] 393px focused Playwright regression(작업대+시설+storage 강화 후 chip strip + 카피), `npm run check:visual`, `npm run check:ci`가 남는다.

## Visual evidence 계획

- Browser Use iab target: 작업대 → 시설 → storage 강화 후 production card에서 chip strip 확인.
- Fallback screenshot: focused regression artifact `mobile-greenhouse-facility-order-v0-393.png`(chip strip 포함).
- Layout invariant: chip strip / production card heading / 하단 탭 vs `.bottom-tabs`, no body scroll, no panel masked overflow.

## Playable mode 영향

- Local dev: `npm run dev -- --host 127.0.0.1 --port 3000`
- Stable main playable mirror 계약 유지: `npm run play:main` + port 5174.

## 안전 범위

- runtime image generation/API 호출 없음.
- 신규 accepted manifest asset 없음. existing chip styling + DOM/CSS만 사용.
- real payment, customer data, external production deployment 없음.
- 기존 first/greenhouse/lunar/follow-up/second-chapter 우선순위 보존: economy 변동 없음. 신규 변경은 readability에 한정.
- save 호환: 신규 state 없음, save schema 변경 없음.

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

- 기본은 solo execution: 변경 영역이 좁은 파일 집합(App.tsx helper + 렌더, styles.css strip, regression spec)에 묶이며 병렬 worker conflict 가능성이 더 크다.
- Codex native subagents/team mode는 production engine readability 전체를 별도 evidence로 분리할 때만 사용한다.
