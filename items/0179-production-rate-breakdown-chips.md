# WorkUnit #354 — production card rate에 component multiplier breakdown chip strip을 더해 production engine readability를 키운다

## GitHub authority

- GitHub issue: #354 https://github.com/bborok1234/strange-seed-shop/issues/354
- Branch: `codex/0179-production-rate-breakdown-chips`
- Campaign source of truth: P0.5 Idle Core + Creative Rescue
- Runner decision: `production-game-intake-required` after #352 main CI `25303677502` success and queue empty
- Status: plan-first

## 문제 / 배경

`getProductionRatePerSecond`는 5개 multiplier source를 합산해서 production rate를 계산한다:

1. `productionBoost` (작업 간식 충전, 최대 +20%)
2. `workbenchBoost` (작업대 강화, 최대 +15%)
3. `facilityBoost` (온실 시설 설립, 최대 +10%)
4. `irrigationBoost` (온실 물길 점검, 최대 +15%)
5. `merchantChainBoost` (단골 시퀀스 마침, +10%)

그러나 production card는 `분당 X.X 잎` 한 줄만 보여주고, 어떤 source가 얼마를 기여하는지는 화면에서 숨겨져 있다. `merchantChainBoost`만 별도 `.merchant-chain-complete-badge`로 노출되며, 나머지 4개 source는 upgrades 카드의 description으로 흩어져 있다. 결과적으로 플레이어는:

- "내가 분당 15.3 잎인데, 왜?" → 알 수 없음
- "어느 upgrade가 가장 효과 큰가?" → upgrade list를 읽어야 추측 가능
- "단골 마침 +10%가 진짜 적용되고 있나?" → badge로만 확인 가능

idle 경쟁작은 main building/factory 화면에 source breakdown을 visible하게 둔다(Egg, Inc.의 `multiplier list`, Idle Miner Tycoon의 manager bonus stack, Cell to Singularity의 prestige boost stack). 우리는 이 readability lever가 비어 있다.

## 목표

production-card-heading 영역에 component multiplier breakdown chip strip을 더해 active multiplier의 label + percent를 한 줄로 보여준다. chip은 source가 0보다 클 때만 등장하고, 393px overflow를 만들지 않도록 단일 row로 묶어 production card 내부에 안전하게 자리잡는다.

## Small win

플레이어가 "왜 분당 X.X 잎인가?"를 한 화면에서 즉시 읽을 수 있고, 단골 시퀀스 마침/시설/물길 같은 upgrade의 영구 보상이 시각적으로 누적되어 보인다.

## Studio Campaign Gate

- Player verb: `production card 글랜스 → 현재 rate + 어느 upgrade가 기여 중인지 즉시 인지`
- Production/progression role: production engine readability — 5개 multiplier source를 한 화면에 묶어 player가 누적 효과를 인지하게 한다.
- Screen moment: production-card-heading 영역에 `.production-rate-breakdown` chip strip 등장. 활성 multiplier 별로 chip(label + +N%) 표시. 예: `간식 +20% · 작업대 +15% · 시설 +10% · 단골 +10%`.
- Concrete visual/game-feel payoff:
  - HUD affordance: production card에 `.production-rate-breakdown` row + 활성 multiplier별 `.production-rate-chip` 요소.
  - Reward motion: 신규 boost 활성 시 1회성 chip-pulse(기존 keyframe 재사용 가능).
  - Numeric payoff: 별도 multiplier 변경 없음. readability에 한정.
- Competition production gap: idle 경쟁작은 source breakdown을 visible하게 둔다. 우리는 단골 chain만 독립 노출하고 나머지 4 source는 숨겨져 있다.
- Asset/FX axis commitment: HUD affordance + reward motion(chip pulse). 신규 accepted manifest asset 없음.
- Playtest evidence: Browser Use iab 우선 시도, blocker 시 issue 전용 blocker + 393px focused Playwright regression(facility 강화 후 chip strip visible + 카피 + bottom-tabs 비충돌).

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- 적용 규칙: playfield 비차폐, persistent HUD 저밀도 유지, breakdown row는 production card 내부 한 줄에 묶여 393px overflow를 만들지 않는다. DOM text만으로 통과하지 않고 393px screenshot/playtest evidence를 남긴다.

## Game Studio Department Signoff

- 기획팀: 누적 보상이 시각적으로 안 보이면 chain handoff arc(#344→#352)의 효과가 player perception에 누적되지 않는다.
- 리서치팀: idle 경쟁작은 production rate breakdown을 main HUD에 둔다. 우리는 single-number rate만 보여준다.
- 아트팀: 신규 accepted manifest asset 없음. existing chip styling + DOM/CSS chip strip만 사용.
- 개발팀: `src/App.tsx`(`getProductionRateBreakdown` helper + production-card-heading 렌더), `src/styles.css`(chip strip), `tests/visual/p0-mobile-game-shell.spec.ts`(facility 설립 후 chip strip 검증).
- 검수팀: Browser Use iab current-session 시도 → blocker 시 issue 전용 blocker + 393px focused Playwright regression, `npm run check:visual`, `npm run check:ci`.
- 마케팅팀: mock-only player promise. 외부 채널/실결제/광고 없음.
- 고객지원팀: "지금 분당 X.X인데 왜?"를 chip strip으로 줄인다.

## Plan

1. `src/App.tsx`에 `getProductionRateBreakdown(save: PlayerSave): { key: string; label: string; percent: number }[]` helper를 추가한다. percent > 0인 source만 결과에 포함하고, 순서는 player progression 자연 순서(productionBoost → workbench → facility → irrigation → merchantChain)로 고정한다.
2. App component에 `rateBreakdown = getProductionRateBreakdown(save)` 파생을 추가한다.
3. production card 내부 production-card-heading 직후에 `<div className="production-rate-breakdown">` row를 렌더한다(`rateBreakdown.length > 0 && !productionStatus.orderCompleted` 조건). 각 chip은 `<span className="production-rate-chip">{label} +{percent}%</span>`.
4. `productionStatus.orderCompleted`인 경우(=완료/dispatch/transient state) chip strip은 hide해 layout 예산을 보호한다.
5. `src/styles.css`에 `.production-rate-breakdown` flex/wrap row + `.production-rate-chip` compact pill을 추가한다. 톤은 진녹/청록 중간 정도, font-size 8~9px.
6. 기존 "모바일 작업대 강화는 첫 온실 설비 목표로 이어진다" regression(line 2009)이 작업대 → 시설 click 후 분당 15.3 잎 검증을 한다. 그 직후 chip strip 검증(`작업 +20%`, `작업대 +15%`, `시설 +10%` 텍스트)을 추가한다(orderCompleted=false 시점에서).
7. focused checks → issue/PR body-file/evidence mirror → branch push → PR create/watch/merge → main CI observation.

## 수용 기준

- [ ] `getProductionRateBreakdown(save)`는 percent > 0인 source만 반환하고 순서는 productionBoost → workbench → facility → irrigation → merchantChain이다.
- [ ] production card에 `.production-rate-breakdown` row가 등장하는 조건: `breakdown.length > 0 && !productionStatus.orderCompleted`.
- [ ] 각 chip(`.production-rate-chip`)은 label + +N% 카피("간식 +20%", "작업대 +15%", "시설 +10%", "물길 +15%", "단골 +10%")를 보여준다.
- [ ] 393px 모바일에서 breakdown row가 production card 내부 한 줄(또는 wrap)에 들어가고 overflow를 만들지 않는다.
- [ ] orderCompleted state(dispatch/handoff active)에서는 chip strip이 hide되어 chain handoff arc CSS와 충돌하지 않는다.
- [ ] 신규 accepted manifest asset 없이 DOM/CSS chip만 사용하고 runtime image generation/API 호출 없음.
- [ ] 393px focused Playwright regression(작업대 → 시설 강화 후 chip strip + 카피), `npm run check:visual`, `npm run check:ci`가 남는다.

## 검증 명령

- `npm run build`
- `npx playwright test --config playwright.config.ts --grep "작업대 강화는 첫 온실 설비 목표로 이어진다"`
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

- 393px production card overflow: chip strip이 wrap되도록 flex-wrap을 사용하고, font-size를 작게(8~9px) 잡아 한 줄에 4~5개 chip이 들어가게 한다. 5개 모두 활성인 시점은 매우 후반이라 wrap이 발생해도 layout이 깨지지 않는다.
- orderCompleted 상태에서의 layout 충돌: chip strip은 orderCompleted=false 시점에서만 보여 chain handoff arc CSS와 충돌하지 않는다.
- existing regression(line 2009)이 분당 15.3 잎을 검증한다. chip strip이 layout을 변경할 수 있으나, orderCompleted=false 시점에서만 보이므로 그 spec에서는 영향이 없다(facility 강화 후 첫 GREENHOUSE_ORDER 진행 중일 때 활성).
- Browser Use iab는 current-session 미발견이 예상되므로 issue 전용 blocker를 새로 기록한다.

## Subagent/Team Routing

- 기본은 solo execution: 변경 영역이 좁은 파일 집합(App.tsx helper + 렌더, styles.css strip, regression spec)에 묶이며 병렬 worker conflict 가능성이 더 크다.
- Codex native subagents/team mode는 production engine readability 전체를 별도 evidence로 분리할 때만 사용한다.
