# WorkUnit #356 — production rate breakdown chip strip의 신규 활성 source에 1.6s pulse motion을 더해 boost unlock moment를 강조한다

## GitHub authority

- GitHub issue: #356 https://github.com/bborok1234/strange-seed-shop/issues/356
- Branch: `codex/0180-production-rate-chip-activation-pulse`
- Campaign source of truth: P0.5 Idle Core + Creative Rescue
- Runner decision: `production-game-intake-required` after #354 main CI `25304125768` success and queue empty
- Status: plan-first

## 문제 / 배경

#354는 production-card-heading 영역에 component multiplier breakdown chip strip을 더해 5개 source(간식/작업대/시설/물길/단골)의 활성 multiplier를 한 화면에 노출했다. 그러나 신규 source가 활성화되는 순간(예: 작업대 강화 click, 시설 click, 단골 시퀀스 마침)은 chip이 정적으로 등장할 뿐 별도 motion이 없다. 플레이어 perception 관점에서 "방금 +10% 시설이 추가됐다!"는 unlock moment가 비어 있다.

idle 경쟁작은 새 multiplier가 활성화되는 순간에 가벼운 pulse/glow motion을 묶어 player가 "+N% just unlocked" 감각을 느끼게 한다(Egg, Inc. boost activate burst, Idle Miner Tycoon manager hire glow, Cell to Singularity tech unlock chime). 우리는 이 unlock moment lever가 비어 있다.

## 목표

`getProductionRateBreakdown(save)` 결과의 신규 key가 등장한 첫 render 직후 1.6s pulse motion을 해당 chip에 적용한다. 그 이후에는 정적인 chip 상태로 돌아간다. 기존 layout/copy/condition은 변경 없이 motion 한 layer만 추가한다.

## Small win

upgrade click 또는 chain-complete fires 직후 player가 "이번 +N%가 어디서 왔는지"를 chip pulse로 한 호흡에 인지한다.

## Studio Campaign Gate

- Player verb: 작업대 강화 click → chip strip에 작업대 chip 등장 + 1.6s pulse → 정적 chip로 안착.
- Production/progression role: production engine readability — 신규 unlock moment를 시각적으로 강조해 player perception에 누적되게 한다.
- Screen moment: chip strip(`.production-rate-breakdown`) 안의 신규 key chip이 1.6s `production-rate-chip-pulse` keyframe 적용. 색/box-shadow 변동.
- Concrete visual/game-feel payoff:
  - HUD affordance: 신규 chip의 `.is-pulsing` className.
  - Reward motion: 1회성 1.6s glow + scale pulse.
  - Numeric payoff: 별도 multiplier 변경 없음. motion 한정.
- Competition production gap: idle 경쟁작은 unlock moment에 motion을 묶는다. 우리는 정적이다.
- Asset/FX axis commitment: HUD affordance + reward motion. 신규 accepted manifest asset 없음.
- Playtest evidence: Browser Use iab 우선 시도, blocker 시 issue 전용 blocker + 393px focused Playwright regression(facility 강화 후 chip strip에서 시설 chip의 .is-pulsing class 검증).

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- 적용 규칙: playfield 비차폐, persistent HUD 저밀도 유지, motion은 chip 한 elem에 1.6s 1회성 pulse로 한정.

## Game Studio Department Signoff

- 기획팀: unlock moment가 motion으로 강조되어야 player perception에 누적된다.
- 리서치팀: idle 경쟁작은 unlock moment를 motion으로 묶는다.
- 아트팀: 신규 accepted manifest asset 없음. existing chip styling + DOM/CSS pulse keyframe만 사용.
- 개발팀: `src/App.tsx`(`previousRateBreakdownKeys` ref + `useEffect`로 신규 key 감지 후 `recentlyActivatedBoosts` set에 추가, 1.6s timeout으로 제거 + chip className에 `is-pulsing` 토글), `src/styles.css`(`.production-rate-chip.is-pulsing` keyframe 추가).
- 검수팀: Browser Use iab current-session 시도 → blocker 시 issue 전용 blocker + 393px focused Playwright regression, `npm run check:visual`, `npm run check:ci`.
- 마케팅팀: mock-only player promise. 외부 채널/실결제/광고 없음.
- 고객지원팀: "upgrade click했는데 시각적 반응이 약하다"를 chip pulse로 줄인다.

## Plan

1. `src/App.tsx`에 `previousRateBreakdownKeysRef = useRef<Set<string>>(new Set())` 추가.
2. `recentlyActivatedBoostsState = useState<Set<string>>(new Set())` 추가.
3. `useEffect`로 `rateBreakdown`을 watch — 새 key가 발견되면 `recentlyActivatedBoostsState`에 추가하고 1_600ms 후 제거. previous keys ref도 업데이트.
4. chip 렌더 시 `recentlyActivatedBoostsState.has(entry.key) ? "is-pulsing" : ""`를 className에 추가.
5. `src/styles.css`에 `.production-rate-chip.is-pulsing` rule + `production-rate-chip-pulse` keyframe(0% scale 1 / box-shadow none, 50% scale 1.06 + glow, 100% scale 1 / 정적)을 추가.
6. 기존 "모바일 작업대 강화는 첫 온실 설비 목표로 이어진다" regression의 끝부분(이미 chip strip 검증 추가됨)에 추가 assertion: `.production-rate-chip.is-pulsing` 가 존재하는 시점이 있다는 것을 검증(예: 시설 강화 직후).
7. focused checks → issue/PR body-file/evidence mirror → branch push → PR create/watch/merge → main CI observation.

## 수용 기준

- [ ] 신규 boost source가 활성화되는 첫 render 직후 해당 chip이 1.6s 동안 `.is-pulsing` className을 가진다.
- [ ] 1.6s 후 className이 자동으로 제거되어 chip이 정적 상태로 돌아간다.
- [ ] 페이지 첫 로드 시 이미 활성인 source는 pulse하지 않는다(initial mount 시 previous keys ref가 즉시 업데이트되어 신규 감지 회피).
- [ ] 393px 모바일에서 pulse motion이 layout shift나 overflow를 만들지 않는다.
- [ ] 신규 accepted manifest asset 없이 DOM/CSS keyframe만 사용하고 runtime image generation/API 호출 없음.
- [ ] 393px focused Playwright regression(시설 강화 후 시설 chip의 .is-pulsing class 검증), `npm run check:visual`, `npm run check:ci`가 남는다.

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

- 페이지 첫 로드 시 false positive pulse: initial mount에서 모든 chip이 신규로 보이면 모두 pulse한다. 이를 막기 위해 첫 effect 실행 시 previous keys ref를 즉시 채우고 set 변경을 트리거하지 않는 가드를 둔다.
- React.StrictMode에서 effect가 두 번 실행될 수 있다. ref 기반 비교는 idempotent하므로 영향 없음.
- 1.6s 후 timeout으로 set에서 key 제거 시 unmount/cleanup race condition 가능. cleanup에서 timeout id를 clearTimeout 처리한다.
- Browser Use iab는 current-session 미발견이 예상되므로 issue 전용 blocker를 새로 기록한다.

## Subagent/Team Routing

- 기본은 solo execution: 변경 영역이 좁은 파일 집합(App.tsx ref/effect + 렌더, styles.css keyframe, regression spec)에 묶이며 병렬 worker conflict 가능성이 더 크다.
- Codex native subagents/team mode는 production engine readability 전체를 별도 evidence로 분리할 때만 사용한다.
