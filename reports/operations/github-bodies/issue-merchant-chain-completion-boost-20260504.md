## GitHub authority

- Plan artifact (예정): `items/0171-merchant-chain-completion-boost.md`
- Source: Studio Harness v3 dry-run after #336 merge / main CI run `25297556615` success → `production-game-intake-required` (queue empty)
- Campaign source of truth: P0.5 Idle Core + Creative Rescue
- WorkUnit type: production game quality Intake

## 문제 / 배경

#336은 포장잎 상인 단골 두 번째 chapter 의뢰(`order_merchant_chapter_two_001`)를 production card/playfield에 도입해 단발 follow-up → 두 번째 chapter chain을 닫았다. 그러나 두 번째 chapter 납품이 끝나면 단골 시퀀스는 그대로 종료되고, `getCurrentOrder` fall-through로 greenhouse/lunar 등 기존 우선순위로 silent하게 떨어진다. 플레이어 입장에서는 "단골과 길게 거래해 왔는데 마지막 chapter 납품 후 손에 남는 게 없다"가 된다. idle 경쟁작은 contract series를 끝낼 때 영구적인 production engine boost(Egg Inc. soul eggs/contracts boost stack, Idle Miner manager max 보너스, Cell to Singularity tech tree drip)로 chain의 끝을 정원/엔진 성장에 이어준다.

## 목표

`MERCHANT_SECOND_CHAPTER_ORDER` 납품 직후 "포장잎 상인 단골 시퀀스 마침" reveal motion과 함께 정원 생산 엔진에 작지만 영구적인 boost(예: idle production tick rate 또는 leaf-per-tick 1.10x)를 적용해, merchant chain 종결이 정원 메타 성장의 다음 박자로 읽히게 만든다.

## Small win

단골 시퀀스가 단발 보상의 합으로 끝나지 않고, 정원 자체의 생산 속도가 영구적으로 한 번 더 빨라지는 손맛으로 마무리된다.

## Studio Campaign Gate

- Player verb: `두 번째 chapter 납품 → 단골 시퀀스 마침 reveal → 정원 생산 영구 boost 활성화`
- Production/progression role: merchant chain 종결 beat — 단골 거래의 누적이 정원 엔진의 영구 성장으로 변환된다.
- Screen moment: second-chapter delivered 직후 production card에 chain-complete badge + 보상 receipt에 "정원 생산 +10%" stat이 같이 표시된다. 다음 production tick부터 leaf 수치가 새 속도로 차오른다.
- Concrete visual/game-feel payoff:
  - HUD affordance: production card에 `.production-engine-boost-active` chip 또는 `merchant 단골 마침 +10%` 영구 badge.
  - Order crate visual state: playfield order crate `merchant-chain-complete` variant (delivered crate에 메달/리본 추가).
  - Reward motion: chain-complete sparkle burst — 두 번째-delivered 모션 위에 1회성 반짝임.
  - Numeric payoff: `idleProduction.productionRate` 또는 동등 multiplier에 `merchantChainBoost = 1.10` 적용. 기존 production tick 코드 한 곳에서 감지된다.
- Competition production gap: idle 경쟁작은 contract series 완료 시 영구 prestige/boost stack을 남긴다. 현재 게임은 단골 chain 마침 후 fall-through만 있고 영구 보상이 없다.
- Asset/FX axis commitment: HUD affordance + order crate visual state + reward motion + numeric production engine boost. 신규 accepted manifest asset 없이 existing merchant/order crate asset + DOM/CSS state + reward motion + 작은 숫자 변경으로 닫는다.
- Playtest evidence: Browser Use iab 우선 시도, blocker 시 issue 전용 blocker + 393px Playwright regression(chain-complete reveal, badge 표시, 다음 tick 생산량 변화 확인).

## Game Studio Department Signoff

- 기획팀: 단골과의 정기 거래가 끝났을 때 정원이 영구적으로 더 잘 자라야 단골 chain의 의미가 게임 메타로 남는다.
- 리서치팀: idle 경쟁작은 contract/shaft/era 마무리에 영구 boost/multiplier를 남긴다 (Egg Inc. boosts, Idle Miner manager max, Cell to Singularity prestige drip). 우리는 단골 chain 마무리 직후 이 lever가 비어 있다.
- 아트팀: 신규 accepted manifest asset 없음. existing merchant/order crate asset + DOM/CSS chain-complete state + 작은 메달/리본 SVG-less variant + sparkle FX. 새 단골 sprite는 별도 provenance WorkUnit.
- 개발팀: `src/App.tsx`(`MERCHANT_SECOND_CHAPTER_ORDER` 납품 직후 boost flag 적용 + production tick에서 multiplier 반영), `src/styles.css`(`.has-merchant-chain-complete` chip + chain-complete crate variant + sparkle keyframe), `src/game/playfield/types.ts`(`merchant-chain-complete` variant), `tests/visual/p0-mobile-game-shell.spec.ts`(reveal/badge/생산량 increment regression).
- 검수팀: Browser Use iab current-session 시도 → blocker 기록 + 393px Playwright regression(chain-complete reveal, badge 텍스트, 다음 production tick의 leaf 수치 차이), layout invariant(panel 비충돌, body scroll 없음), `npm run check:visual`, `npm run check:ci`.
- 마케팅팀: mock-only player promise. 외부 채널/실결제/광고 없음.
- 고객지원팀: "단골 시퀀스 다 끝나서 손에 남는 게 없다"를 영구 boost 한 번으로 줄인다.

## 사용자/운영자 가치

- 사용자: 포장잎 상인 단골 chain이 정원 자체 성장으로 이어져, 거래의 손맛이 게임 메타에 누적된다.
- 운영자: #328 → #330 → #332 → #336 merchant chain을 production engine permanent boost beat로 닫아 P0.5 Idle Core + Creative Rescue의 long-term-meta hint 라인을 한 칸 더 채운다.

## 수용 기준

- [ ] `MERCHANT_SECOND_CHAPTER_ORDER` 납품 시 영구 multiplier(`merchantChainBoost`, 기본 1.0 → 1.10)가 save에 기록되고, 이후 production tick에 반영된다.
- [ ] production card에 `.has-merchant-chain-complete` chip/badge가 등장해 "단골 시퀀스 마침 +10%" 또는 동등 카피가 한 화면에서 읽힌다.
- [ ] playfield order crate가 `merchant-chain-complete` variant(`merchant-second-delivered` 위에 메달/리본 SVG-less variant)로 잠깐 표시된 뒤 fallback order crate로 전환된다.
- [ ] chain-complete reveal motion(0.7~1.0s sparkle + badge pulse)이 second-delivered motion 위에서 1회 재생되고 layout overflow를 만들지 않는다.
- [ ] 393px 모바일에서 chain-complete chip / 메달 crate / 보상 receipt / 하단 탭이 겹치지 않고 overflow가 없다.
- [ ] 신규 accepted manifest asset 없이 existing merchant/order crate asset + DOM/CSS state + reward motion + 작은 숫자 변경으로 닫고 runtime image generation/API 호출 없음.
- [ ] Browser Use iab current-session 시도 evidence 또는 blocker, 393px focused Playwright regression(reveal + badge + 다음 production tick 증가량), `npm run check:visual`, `npm run check:ci`가 남는다.

## Visual evidence 계획

- Browser Use iab target: #336 두 번째 chapter 납품 → chain-complete reveal → badge 등장 → 다음 production tick에서 leaf 수치 새 속도로 차오름.
- Fallback screenshot: `reports/visual/issue-NNN-merchant-chain-completion-boost-393.png` (이슈 번호 할당 후 확정).
- Layout invariant: chain-complete chip / 메달 crate / 보상 receipt vs `.bottom-tabs`, no body scroll, no masked overflow.

## Playable mode 영향

- Local dev: `npm run dev -- --host 127.0.0.1 --port 3000`
- Stable main playable mirror: `npm run play:main` + port 5174 계약 유지.

## 안전 범위

- runtime image generation/API 호출 없음.
- 신규 accepted manifest asset 없음. existing merchant/order crate asset + DOM/CSS chain-complete state + reward motion + 메달/리본 SVG-less variant만 사용.
- real payment, customer data, external production deployment 없음.
- 기존 first/greenhouse/lunar/follow-up/second-chapter 우선순위 보존: 영구 boost는 second-chapter 완료 시 1회 적용되며 이후 priority chain은 변경 없음.
- save 호환: `merchantChainBoost`는 기본값 1.0으로 fall-back되도록 default를 깔아 기존 save가 깨지지 않게 한다.

## 검증 명령

- `npm run build`
- focused Playwright: `--grep "단골 시퀀스 마침|merchant-chain-complete|chain-completion-boost"`
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

- 기본은 solo execution: 변경 영역이 좁은 파일 집합(App.tsx 분기 + production tick multiplier, styles.css chain-complete state + sparkle, types.ts variant, regression spec)에 묶이며 병렬 worker conflict 가능성이 더 크다.
- Codex native subagents/team mode는 economy balance(boost 수치)와 visual QA가 독립 evidence로 분리될 때만 사용한다.
