# WorkUnit #338 — 포장잎 상인 단골 두 번째 chapter 납품이 단골 시퀀스 영구 생산 boost로 마침을 잇는다

## GitHub authority

- GitHub issue: #338 https://github.com/bborok1234/strange-seed-shop/issues/338
- Branch: `codex/0338-merchant-chain-completion-boost`
- Campaign source of truth: P0.5 Idle Core + Creative Rescue
- Runner decision: `production-game-intake-required` after #336 main CI `25297556615` success
- Status: plan-first

## 문제 / 배경

#336은 포장잎 상인 단골 두 번째 chapter 의뢰(`order_merchant_chapter_two_001`)를 도입하고 follow-up 직후의 chapter chain을 닫았다. 그러나 두 번째 chapter 납품이 끝나면 단골 시퀀스는 silent하게 종료되고 `getCurrentOrder` fall-through로 greenhouse/lunar 우선순위로 떨어진다. idle 경쟁작은 contract series 종결 시 영구 production engine 보상(Egg Inc. soul eggs/contracts boost stack, Idle Miner manager max bonus, Cell to Singularity tech tree drip)으로 chain의 마무리를 정원/엔진 성장에 이어준다. 우리 게임은 단골 chain 마침에 lasting payoff가 없다.

## Reference teardown

- Egg, Inc.: contract complete → 영구 boost stack/SE 누적.
- Idle Miner Tycoon: 광산/대륙 완료 → 매니저 max + 영구 multiplier.
- Cell to Singularity: 단계 완료 → tech tree drip + 영구 prestige currency.
- Reject: 단골 chain 마침을 단발 보상으로만 끝내는 방식. lasting payoff 없으면 chain 의미가 휘발한다.

## Creative brief

- Player fun target: 단골과의 정기 거래 누적이 정원 자체 성장으로 이어져, 거래 chain 마무리가 게임 메타에 영구적인 자국을 남긴다.
- Core loop role: merchant chain 종결 — 단골 거래의 누적이 production engine 영구 multiplier로 변환된다.
- Screen moment: `MERCHANT_SECOND_CHAPTER_ORDER` 납품 직후 production card에 chain-complete 보상 receipt + `.has-merchant-chain-complete` chip("단골 시퀀스 마침 +10%")가 등장하고, 다음 production tick부터 leaf 수치가 새 속도로 차오른다.
- Required assets/FX: 신규 accepted manifest asset 없음. existing merchant/order crate asset + DOM/CSS chip/메달/리본 variant + sparkle reveal motion.
- Game-feel requirements: chain-complete reveal motion(0.7~1.0s sparkle + chip pulse) 1회 재생, chip은 그 이후 영구 표시, 다음 production tick에서 leaf 증가 속도가 새 multiplier(`* 1.10`)로 반영.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- 적용 규칙: playfield 비차폐, persistent HUD 저밀도 유지, chip 카피는 게임 동사/메타 톤. DOM text만으로 통과하지 않고 393px screenshot/playtest evidence를 남긴다.

## Game Studio Department Signoff

- 기획팀: 단골 chain의 누적이 정원 엔진의 영구 성장으로 이어져야 단골 시퀀스가 의미 있는 메타 이정표가 된다.
- 리서치팀: idle 경쟁작은 contract/series 마침에 영구 boost를 남긴다. 우리는 그 lever가 비어 있다.
- 아트팀: 신규 accepted manifest asset 없음. existing merchant/order crate asset + DOM/CSS chip + 메달/리본 SVG-less variant + sparkle keyframe만 사용.
- 개발팀: `src/types/game.ts`(PlayerSave에 `merchantChainBoostActive: boolean`), `src/lib/persistence.ts`(default false + normalizeSave), `src/App.tsx`(MERCHANT_CHAIN_RATE_BONUS 상수, 두 번째 chapter 완료 시 boost 활성화 + chainCompleteReceipt + production rate 분기, 카드 chip + crate variant), `src/styles.css`(chip + 메달/리본 crate + sparkle keyframe), `src/game/playfield/types.ts`(`merchant-chain-complete` variant), `tests/visual/p0-mobile-game-shell.spec.ts`(reveal/chip/crate regression).
- 검수팀: Browser Use iab current-session 시도 → blocker 시 issue 전용 blocker + 393px Playwright screenshot, layout invariant(chip/crate/receipt vs `.bottom-tabs`, no body scroll, no panel masked overflow), `npm run check:visual`, `npm run check:ci`.
- 마케팅팀: mock-only player promise. 외부 채널/실결제/광고 없음.
- 고객지원팀: "단골 시퀀스 다 끝나서 손에 남는 게 없다"를 영구 +10% boost와 chip로 줄인다.

## Plan

1. `src/types/game.ts`의 `PlayerSave`에 `merchantChainBoostActive: boolean` 필드를 추가한다.
2. `src/lib/persistence.ts`의 `createNewSave`/`normalizeSave`에 `merchantChainBoostActive: false` 기본값을 더해 기존 save가 깨지지 않게 한다.
3. `src/App.tsx`에 `MERCHANT_CHAIN_RATE_BONUS = 0.1` 상수를 추가한다.
4. order-delivery commit 분기(현재 `MERCHANT_FOLLOWUP_ORDER` 다음)에 `MERCHANT_SECOND_CHAPTER_ORDER` 분기를 추가해 `draft.merchantChainBoostActive = true`로 토글하고 `merchant_chain_complete_boost_unlocked` event를 발행한다.
5. `getProductionRatePerSecond`에 `merchantChainBoost = save.merchantChainBoostActive ? MERCHANT_CHAIN_RATE_BONUS : 0`을 더한다(1 + production + workbench + facility + irrigation + merchantChain 형태).
6. `chainCompleteReceipt` state를 추가해 second-chapter delivered 직후 1.6~2.0초 reveal motion을 1회 표시한다.
7. production card에 `.has-merchant-chain-complete` chip("단골 시퀀스 마침 +10%")을 영구 표시(boost active 시)하고, chain-complete receipt 활성 시 chip pulse를 적용한다.
8. playfield order crate에 `merchant-chain-complete` variant를 추가하고, 두 번째 chapter delivered 직후 1회 메달/리본 표시 후 fallback 상태로 돌아오게 한다.
9. `src/game/playfield/types.ts`의 `orderVariant` union에 `merchant-chain-complete`를 추가한다.
10. `src/styles.css`에 `.has-merchant-chain-complete` chip + chain-complete crate variant + sparkle keyframe(`merchant-chain-complete-sparkle`)을 추가한다.
11. `tests/visual/p0-mobile-game-shell.spec.ts`에 두 번째 chapter 납품 → chain-complete reveal → chip 영구 표시 → playfield crate 메달 → bottom-tabs 비충돌 393px regression을 추가한다.
12. focused checks(build, focused playwright grep, check:visual, check:ci) → issue/PR body-file/evidence mirror → branch push → PR create/watch/merge → main CI observation.

## 수용 기준

- [ ] `MERCHANT_SECOND_CHAPTER_ORDER` 납품 시 `save.merchantChainBoostActive`가 `true`로 토글되고 save에 영구 기록된다.
- [ ] `getProductionRatePerSecond`가 `merchantChainBoostActive` 활성 시 `+0.10`을 multiplier에 더한다(다른 boost와 합산).
- [ ] production card에 `.has-merchant-chain-complete` chip이 등장해 "단골 시퀀스 마침" + "+10%" 카피가 한 화면에서 읽힌다.
- [ ] second-chapter delivered 직후 chip pulse + sparkle reveal motion이 1회 재생되고, 이후 chip은 영구 표시 상태로 남는다.
- [ ] playfield order crate가 second-delivered 직후 `merchant-chain-complete` variant(메달/리본 SVG-less)로 잠시 표시된 뒤 fallback order crate로 전환된다.
- [ ] 393px 모바일에서 chain-complete chip / 메달 crate / 보상 receipt / 하단 탭이 겹치지 않고 overflow가 없다.
- [ ] 신규 accepted manifest asset 없이 existing merchant/order crate asset + DOM/CSS state + reward motion + 작은 숫자 변경으로 닫고 runtime image generation/API 호출 없음.
- [ ] Browser Use iab current-session 시도 evidence 또는 blocker, 393px focused Playwright regression(reveal + chip + crate), `npm run check:visual`, `npm run check:ci`가 남는다.

## 검증 명령

- `npm run build`
- `npx playwright test --config playwright.config.ts --grep "단골 시퀀스 마침|merchant-chain-complete|chain-completion-boost"`
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

- 영구 multiplier(+10%)가 너무 강하면 후속 greenhouse/lunar 경제 균형을 깨뜨릴 수 있다. 1.10 단계는 기존 production/workbench/facility/irrigation boost와 동일한 단계 단위로 잡아 중첩 영향을 작게 유지한다.
- 기존 save에 `merchantChainBoostActive` 필드가 없으므로 `normalizeSave`가 default false로 채워야 한다. 기존 미완료 chain 플레이어는 chain 완료 후 정상 활성화된다.
- chain-complete reveal motion이 second-delivered motion과 겹치면 layout이 흔들릴 수 있으므로, sparkle은 chip 위 1회성 keyframe + crate 메달은 1.4초 후 fade-out으로 분리한다.
- 393px production card overflow 위험. chip은 한 줄/저밀도 + 우측 정렬 또는 production card 상단 strip로 배치한다.
- Browser Use iab는 current-session 미발견이 예상되므로 issue 전용 blocker를 새로 기록한다.

## Subagent/Team Routing

- 기본은 solo execution: 변경 영역이 좁은 파일 집합(types/game.ts, persistence.ts, App.tsx 분기 + production rate, styles.css chip + crate + sparkle, types.ts variant, regression spec)에 묶이며 병렬 worker conflict 가능성이 더 크다.
- Codex native subagents/team mode는 economy balance(boost 수치)와 visual QA가 독립 evidence로 분리될 때만 사용한다.
