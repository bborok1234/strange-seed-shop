## GitHub authority

- Plan artifact: `items/0174-merchant-chain-next-goal-handoff.md`
- Source: Studio Harness v3 dry-run after #342 merge / main CI run `25301208484` success → `production-game-intake-required` (queue empty)
- Campaign source of truth: P0.5 Idle Core + Creative Rescue
- WorkUnit type: production game quality Intake

## 문제 / 배경

#338은 `MERCHANT_SECOND_CHAPTER_ORDER` 납품 시 영구 +10% production multiplier(`merchantChainBoostActive`)와 chain-complete reveal/chip를 도입했다. 단골 시퀀스 마침의 lasting payoff는 정원 엔진 가속으로 들어왔지만 **그 직후 화면 안에서 다음 production 목표는 가려져 있다.**

`getCurrentOrder` priority chain을 추적해보면 `MERCHANT_SECOND_CHAPTER_ORDER` 완료 직후 다음 분기는 `greenhouseFacilityLevel >= GREENHOUSE_FACILITY_MAX_LEVEL` 단계의 GREENHOUSE_ORDER다. 그러나 이 단계까지 가지 않은 플레이어(즉 chain-complete 직후의 평균적인 첫 5분 플레이어)는 facility 미설치 상태이므로 priority chain의 모든 분기가 false로 떨어지고, 마지막 fallback 라인은 이미 완료된 SECOND_ORDER를 반환한다. production card는 chain-complete chip과 함께 stale order로 fall-through되어 "다음에 무엇을 할지"가 화면에서 사라진다.

idle 경쟁작은 contract 마침 직후 다음 unlock 목표를 같은 화면에 즉시 보여준다(Egg Inc. next contract slot, Idle Miner Tycoon 다음 광산 unlock CTA, Cell to Singularity 다음 tech tree node hint). 우리는 chain-complete reveal이 끝나면 다음 progression 목표가 화면에서 사라지므로 production loop가 chain-complete 직후 한 번 끊긴다.

## 목표

`MERCHANT_SECOND_CHAPTER_ORDER` 납품 → chain-complete sparkle 종료 직후, production card에 "다음 목표: 달빛 온실 설립" handoff card를 영구 표시해 chain-end gap을 시각적으로 닫는다. facility level이 1이 되면 handoff card는 자동으로 사라진다.

## Small win

단골 시퀀스 마침의 영구 +10% boost가 화면에서 다음 production 단계(달빛 온실 설립)로 손을 잡아 끌어주는 한 줄 카드로 마무리된다.

## Studio Campaign Gate

- Player verb: `두 번째 chapter 납품 → 단골 시퀀스 마침 reveal → 다음 production 목표(달빛 온실 설립) 인지 → upgrades 진입`
- Production/progression role: merchant chain 마침 → greenhouse facility 설립 production phase 진입 — chain-end gap을 시각적 handoff로 닫는다.
- Screen moment: chain-complete sparkle motion(2.2s) 종료 직후 production card에 영구 chain-complete badge 옆/하단으로 "다음 목표: 달빛 온실 설립" handoff card가 등장한다. card는 facility build 비용(잎 80, 재료 1)과 작업대 prerequisites를 한 줄로 보여주고, facility level이 1이 되면 자동으로 사라진다.
- Concrete visual/game-feel payoff:
  - HUD affordance: production card에 `.has-merchant-chain-next-goal` className + `.merchant-chain-next-goal` handoff card.
  - Order crate visual state: playfield order crate `merchant-chain-handoff` variant — chain-complete sparkle 종료 후 facility 미설치 시 표시.
  - Reward motion: handoff fade-in(0.5s) + arrow chip pulse(1.6s) — 1회성, 그 이후 영구 표시.
  - Numeric payoff: 별도 multiplier 변경 없음. 시각적 handoff에 한정해 chain-complete의 +10% boost는 그대로 유지.
- Competition production gap: idle 경쟁작은 contract series 완료 직후 다음 unlock 목표를 같은 화면에 즉시 보여준다. 우리 chain-complete 후 화면에서는 이 lever가 비어 있다.
- Asset/FX axis commitment: HUD affordance + order crate visual state + reward motion. 신규 accepted manifest asset 없이 existing facility icon + DOM/CSS state + 작은 motion으로 닫는다.
- Playtest evidence: Browser Use iab 우선 시도, blocker 시 issue 전용 blocker + 393px focused Playwright regression(handoff card visible + facility build 후 사라짐 + bottom-tabs 비충돌).

## Game Studio Department Signoff

- 기획팀: 단골 시퀀스 마침의 lasting boost가 "다음 production 단계 시작"으로 이어져야 chain-end가 메타 진행에 닿는다.
- 리서치팀: idle 경쟁작은 contract/series 마침 직후 다음 unlock 목표를 같은 화면에 보여준다. 우리는 이 lever가 비어 있다.
- 아트팀: 신규 accepted manifest asset 없음. existing facility icon + DOM/CSS handoff card + arrow keyframe만 사용.
- 개발팀: `src/App.tsx`(`merchantChainNextGoalActive` 파생 + className + handoff card 렌더 + playfield variant 라우팅), `src/styles.css`(handoff card + arrow keyframe + playfield variant), `src/game/playfield/types.ts`(`merchant-chain-handoff` variant), `tests/visual/p0-mobile-game-shell.spec.ts`(handoff card 표시 + facility 설립 직후 사라짐 393px regression).
- 검수팀: Browser Use iab current-session 시도 → blocker 시 issue 전용 blocker + 393px focused Playwright regression(handoff card visible + facility 설립 후 사라짐 + bottom-tabs 비충돌), `npm run check:visual`, `npm run check:ci`.
- 마케팅팀: mock-only player promise. 외부 채널/실결제/광고 없음.
- 고객지원팀: "단골 시퀀스 다 끝났는데 화면에서 다음 목표가 안 보인다"를 facility 설립 handoff card로 줄인다.

## 사용자/운영자 가치

- 사용자: 단골 시퀀스 마침 직후 다음 progression 목표(달빛 온실 설립)가 같은 화면에 보여, chain-complete의 영구 boost가 다음 단계로 이어진다.
- 운영자: #328 → #330 → #332 → #336 → #338 merchant chain의 끝을 facility-greenhouse 진입 phase로 시각적으로 묶어 P0.5 Idle Core + Creative Rescue의 long-term-meta hint 라인을 한 칸 더 채운다.

## 수용 기준

- [ ] `merchantChainBoostActive=true && greenhouseFacilityLevel<MAX` 조건에서 production card에 `.has-merchant-chain-next-goal` className이 적용되고 `.merchant-chain-next-goal` handoff card가 렌더된다.
- [ ] handoff card는 strong "다음 목표" + span "달빛 온실 설립" + small 비용 또는 unlock 안내 + arrow chip을 한 줄/두 줄 안에 보여준다.
- [ ] chain-complete sparkle motion(2.2s)이 진행되는 동안 handoff card는 숨겨지고, 종료 직후 0.5s fade-in으로 등장한다.
- [ ] facility level이 1이 되면 handoff card가 자동으로 unmount된다.
- [ ] playfield order crate variant `merchant-chain-handoff`가 정의되고 chain-complete sparkle 종료 후 facility 미설치 시 표시된다.
- [ ] 393px 모바일에서 handoff card / 기존 chain-complete chip / 하단 탭이 겹치지 않고 production card에 추가 overflow를 만들지 않는다.
- [ ] 신규 accepted manifest asset 없이 existing facility icon + DOM/CSS state + 작은 motion만 사용하고 runtime image generation/API 호출 없음.
- [ ] 393px focused Playwright regression(handoff card 표시 + facility 설립 후 사라짐), `npm run check:visual`, `npm run check:ci`가 남는다.

## Visual evidence 계획

- Browser Use iab target: #338 두 번째 chapter 납품 → chain-complete sparkle → handoff card 등장 → facility build 후 handoff dismissal.
- Fallback screenshot: `reports/visual/issue-NNN-merchant-chain-next-goal-handoff-393.png` (issue 번호 할당 후 확정).
- Layout invariant: handoff card / 기존 chain-complete badge vs `.bottom-tabs`, no body scroll, no panel masked overflow.

## Playable mode 영향

- Local dev: `npm run dev -- --host 127.0.0.1 --port 3000`
- Stable main playable mirror: `npm run play:main` + port 5174 계약 유지.

## 안전 범위

- runtime image generation/API 호출 없음.
- 신규 accepted manifest asset 없음. existing facility icon + DOM/CSS handoff card + arrow keyframe만 사용.
- real payment, customer data, external production deployment 없음.
- 기존 first/greenhouse/lunar/follow-up/second-chapter 우선순위 보존: 영구 boost(+10%)는 그대로 유지되며 economy 변동 없음. 신규 변경은 시각적 handoff에 한정.
- save 호환: 기존 save에 `merchantChainBoostActive`/`greenhouseFacilityLevel`은 이미 normalize되어 있어 추가 migration 불필요.

## 검증 명령

- `npm run build`
- focused Playwright: `--grep "단골 시퀀스 마침|merchant-chain-next-goal|chain-handoff|달빛 온실 설립"`
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

- 기본은 solo execution: 변경 영역이 좁은 파일 집합(App.tsx 파생 + 렌더, styles.css handoff card + keyframes, types.ts variant, regression spec)에 묶이며 병렬 worker conflict 가능성이 더 크다.
- Codex native subagents/team mode는 facility-greenhouse 진입 phase 전체 economy/visual QA를 별도 evidence로 분리할 때만 사용한다.
