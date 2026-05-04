## GitHub authority

- Plan artifact: `items/0180-production-rate-chip-activation-pulse.md`
- Source: Studio Harness v3 dry-run after #354 merge / main CI run `25304125768` success → `production-game-intake-required` (queue empty)
- Campaign source of truth: P0.5 Idle Core + Creative Rescue
- WorkUnit type: production game quality Intake

## 문제 / 배경

#354는 production-card-heading 영역에 component multiplier breakdown chip strip을 더해 5개 source(간식/작업대/시설/물길/단골)의 활성 multiplier를 한 화면에 노출했다. 그러나 신규 source가 활성화되는 순간(작업대 강화 click, 시설 click, 단골 시퀀스 마침)은 chip이 정적으로 등장할 뿐 unlock motion이 없다. 플레이어 perception 관점에서 "방금 +10% 시설이 추가됐다!"는 unlock moment가 비어 있다.

idle 경쟁작은 새 multiplier가 활성화되는 순간에 가벼운 pulse/glow motion을 묶는다(Egg, Inc. boost activate burst, Idle Miner Tycoon manager hire glow, Cell to Singularity tech unlock chime). 우리는 이 unlock moment lever가 비어 있다.

## 목표

`getProductionRateBreakdown(save)` 결과의 신규 key가 등장한 첫 render 직후 1.6s pulse motion을 해당 chip에 적용한다. 그 이후에는 정적 chip 상태로 안착한다.

## Small win

upgrade click 또는 chain-complete fires 직후 player가 "이번 +N%가 어디서 왔는지"를 chip pulse로 한 호흡에 인지한다.

## Studio Campaign Gate

- Player verb: 작업대 강화 click → chip strip에 작업대 chip 등장 + 1.6s pulse → 정적 chip로 안착.
- Production/progression role: production engine readability — unlock moment를 시각적으로 강조해 player perception에 누적되게 한다.
- Screen moment: chip strip(`.production-rate-breakdown`) 안의 신규 key chip이 1.6s `production-rate-chip-pulse` keyframe 적용. scale + box-shadow + background gradient 변동.
- Concrete visual/game-feel payoff:
  - HUD affordance: 신규 chip의 `.is-pulsing` className.
  - Reward motion: 1회성 1.6s glow + scale pulse.
  - Numeric payoff: 별도 multiplier 변경 없음. motion 한정.
- Competition production gap: idle 경쟁작은 unlock moment에 motion을 묶는다. 우리는 정적이다.
- Asset/FX axis commitment: HUD affordance + reward motion. 신규 accepted manifest asset 없음.
- Playtest evidence: Browser Use iab 우선 시도, blocker 시 issue 전용 blocker + repeatable focused Playwright regression(기존 chip strip regression이 build 안정성을 보장).

## Game Studio Department Signoff

- 기획팀: unlock moment가 motion으로 강조되어야 player perception에 누적된다.
- 리서치팀: idle 경쟁작은 unlock moment를 motion으로 묶는다.
- 아트팀: 신규 accepted manifest asset 없음. existing chip styling + DOM/CSS pulse keyframe만 사용.
- 개발팀: `src/App.tsx`(`previousRateBreakdownKeysRef` + `recentlyActivatedBoosts` state + useEffect로 신규 key 감지 + 1.6s timeout으로 className 토글), `src/styles.css`(`.production-rate-chip.is-pulsing` + `production-rate-chip-pulse` keyframe).
- 검수팀: Browser Use iab current-session 시도 → blocker 시 issue 전용 blocker + 기존 chip strip regression이 build/render 안정성을 보장. 1.6s pulse class 토글은 timing-fragile하므로 기존 spec에 추가 어설션은 두지 않고 visual inspection으로 검증한다.
- 마케팅팀: mock-only player promise. 외부 채널/실결제/광고 없음.
- 고객지원팀: "upgrade click했는데 시각적 반응이 약하다"를 chip pulse로 줄인다.

## 사용자/운영자 가치

- 사용자: upgrade click moment가 motion으로 강조되어 누적 보상이 인지된다.
- 운영자: chain handoff arc 누적 효과의 unlock moment가 motion layer로 강조되어 P0.5 Idle Core + Creative Rescue의 production engine readability axis가 한 칸 더 채워진다.

## 수용 기준

- [ ] 신규 boost source가 활성화되는 첫 render 직후 해당 chip이 1.6s 동안 `.is-pulsing` className을 가진다.
- [ ] 1.6s 후 className이 자동으로 제거되어 chip이 정적 상태로 돌아간다.
- [ ] 페이지 첫 로드 시 이미 활성인 source는 pulse하지 않는다(initial mount 시 previousRateBreakdownKeysRef가 즉시 업데이트되어 신규 감지 회피).
- [ ] 393px 모바일에서 pulse motion이 layout shift나 overflow를 만들지 않는다(scale 1.06 + box-shadow는 inline scale로 layout 변경 없음).
- [ ] 신규 accepted manifest asset 없이 DOM/CSS keyframe만 사용하고 runtime image generation/API 호출 없음.
- [ ] 기존 "모바일 작업대 강화는 첫 온실 설비 목표로 이어진다" regression이 통과해 build/render 안정성이 보장된다, `npm run check:visual`, `npm run check:ci`가 남는다.

## Visual evidence 계획

- Browser Use iab target: 작업대/시설 click 직후 chip strip pulse 시각 확인.
- Fallback evidence: focused regression artifact `mobile-greenhouse-facility-order-v0-393.png`(chip strip 포함).
- Layout invariant: pulse motion은 scale + box-shadow → layout 영향 없음.

## Playable mode 영향

- Local dev: `npm run dev -- --host 127.0.0.1 --port 3000`
- Stable main playable mirror 계약 유지: `npm run play:main` + port 5174.

## 안전 범위

- runtime image generation/API 호출 없음.
- 신규 accepted manifest asset 없음. existing chip + DOM/CSS만 사용.
- real payment, customer data, external production deployment 없음.
- 기존 first/greenhouse/lunar/follow-up/second-chapter 우선순위 보존: economy 변동 없음.
- save 호환: 신규 state는 transient runtime state(set/timeout). save schema 변경 없음.

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

- 기본은 solo execution: 변경 영역이 좁은 파일 집합(App.tsx ref/effect + 렌더 한 줄, styles.css keyframe).
- Codex native subagents/team mode는 production engine readability 전체를 별도 evidence로 분리할 때만 사용한다.
