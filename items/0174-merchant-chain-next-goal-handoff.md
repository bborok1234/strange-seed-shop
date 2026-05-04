# WorkUnit #344 — 단골 시퀀스 마침이 다음 production 목표(달빛 온실 설립)로 시각적 handoff한다

## GitHub authority

- GitHub issue: #344 https://github.com/bborok1234/strange-seed-shop/issues/344
- Branch: `codex/0174-merchant-chain-next-goal-handoff`
- Campaign source of truth: P0.5 Idle Core + Creative Rescue
- Runner decision: `production-game-intake-required` after #342 main CI `25301208484` success and queue empty
- Status: plan-first

## 문제 / 배경

#338은 `MERCHANT_SECOND_CHAPTER_ORDER` 납품 시 영구 +10% production multiplier(`merchantChainBoostActive`)와 chain-complete reveal/chip를 도입했다. 단골 시퀀스 마침의 lasting payoff는 정원 엔진 가속으로 들어왔지만, **그 직후 화면 안에서 다음 production 목표는 가려져 있다.**

`getCurrentOrder` priority chain을 추적해보면 `MERCHANT_SECOND_CHAPTER_ORDER` 완료 직후 다음 분기는 `greenhouseFacilityLevel >= GREENHOUSE_FACILITY_MAX_LEVEL` 단계의 GREENHOUSE_ORDER다. 그러나 이 단계까지 가지 않은 플레이어(즉 chain-complete 직후의 평균적인 첫 5분 플레이어)는 facility 미설치 상태이므로 priority chain의 모든 분기가 false로 떨어지고, 마지막 fallback 라인은 `save.greenhouseFacilityLevel >= GREENHOUSE_FACILITY_MAX_LEVEL ? GREENHOUSE_ORDER : SECOND_ORDER`로 **이미 완료된 SECOND_ORDER를 반환**한다. production card는 chain-complete chip과 함께, 이미 완료된 stale order로 fall-through되어 "다음에 무엇을 할지"가 화면에서 사라진다.

idle 경쟁작은 contract 마침 직후 다음 unlock 목표를 같은 화면에 즉시 보여준다(Egg Inc. next contract slot, Idle Miner Tycoon 다음 광산 unlock CTA, Cell to Singularity 다음 tech tree node hint). 우리는 chain-complete reveal이 끝나면 다음 progression 목표(달빛 온실 설립)가 화면에서 사라지므로 production loop가 chain-complete 직후 한 번 끊긴다.

## Reference teardown

- Egg, Inc.: contract complete → next contract slot이 같은 UI에 즉시 등장.
- Idle Miner Tycoon: 광산 단계 완료 → 다음 광산 unlock CTA가 같은 화면에 highlight.
- Cell to Singularity: 단계 완료 → 다음 tech tree node hint drip.
- Reject: chain-complete reveal 후 production card를 stale order로 두는 방식. 다음 unlock 목표가 시각적으로 사라지면 retention hook이 끊긴다.

## Creative brief

- Player fun target: 단골 시퀀스 마침 직후 정원 자동 가속 보상이 "다음 큰 목표(달빛 온실 설립)"로 자연스럽게 손을 잡아 끌어준다.
- Core loop role: merchant chain 마침 → greenhouse facility 설립 production phase 진입 — chain-end gap을 시각적 handoff로 닫는다.
- Screen moment: chain-complete reveal motion(2.2s)이 끝나면 production card에 영구 chain-complete badge 옆/하단으로 "다음 목표: 달빛 온실 설립" handoff card가 나타난다. card는 facility build 비용(잎 80, 재료 1)과 활성 CTA 여부를 한 줄로 보여주고, facility level이 1이 되면 자동으로 사라진다.
- Required assets/FX: 신규 accepted manifest asset 없음. existing greenhouse facility icon + DOM/CSS handoff card + arrow keyframe + chain-complete chip extension.
- Game-feel requirements: handoff card는 chain-complete reveal 종료 직후 0.5s fade-in, 그 다음 영구 표시. 화살표/아이콘 1회 pulse로 "이쪽으로 이어진다"를 시각적으로 전달. facility 설립 직후 0.4s fade-out.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- 적용 규칙: playfield 비차폐, persistent HUD 저밀도 유지, handoff card는 chain-complete badge 영역에 묶여 추가 layout column을 만들지 않는다. DOM text만으로 통과하지 않고 393px screenshot/playtest evidence를 남긴다.

## Game Studio Department Signoff

- 기획팀: 단골 시퀀스 마침의 lasting boost가 "다음 production 단계 시작"으로 이어져야 chain-end가 메타 진행에 닿는다.
- 리서치팀: idle 경쟁작은 contract/series 마침 직후 다음 unlock 목표를 같은 화면에 보여준다. 우리는 이 lever가 비어 있다.
- 아트팀: 신규 accepted manifest asset 없음. existing greenhouse facility icon + DOM/CSS handoff card + arrow keyframe만 사용.
- 개발팀: `src/App.tsx`(`merchantChainNextGoalActive` 파생 + className + handoff card 렌더), `src/styles.css`(handoff card + arrow keyframe), `src/game/playfield/types.ts`(`merchant-chain-handoff` variant), `src/App.tsx`의 `orderVariant` 라우팅(`merchant-chain-handoff`가 chain-complete sparkle 종료 후 facility 미설치 시 표시), `tests/visual/p0-mobile-game-shell.spec.ts`(handoff card 표시 + facility 설립 직후 사라짐 393px regression).
- 검수팀: Browser Use iab current-session 시도 → blocker 시 issue 전용 blocker + 393px focused Playwright regression(handoff card visible + facility 설립 후 사라짐 + bottom-tabs 비충돌), `npm run check:visual`, `npm run check:ci`.
- 마케팅팀: mock-only player promise. 외부 채널/실결제/광고 없음.
- 고객지원팀: "단골 시퀀스 다 끝났는데 화면에서 다음 목표가 안 보인다"를 facility 설립 handoff card로 줄인다.

## Plan

1. `src/App.tsx`에 `merchantChainNextGoalActive` 파생값을 만든다. 조건: `save.merchantChainBoostActive === true && save.greenhouseFacilityLevel < GREENHOUSE_FACILITY_MAX_LEVEL`.
2. production card className 분기에 `merchantChainNextGoalActive ? "has-merchant-chain-next-goal" : ""`를 추가한다.
3. 기존 `merchant-chain-complete-badge` 영역(production card 내부) 직후에 `<div className="merchant-chain-next-goal">` handoff card를 렌더한다. 내용:
   - strong: "다음 목표"
   - span: "달빛 온실 설립"
   - small: facility build 비용(`잎 80 · 재료 1`) 또는 facility unlock 미달 시 안내(`작업대 완성 후 시작`)
   - arrow chip: "→ 시작" (facility unlocked + affordable 시 강조, 아닐 시 muted)
4. handoff card는 chain-complete sparkle motion(`merchant-chain-complete-receipt` 활성 동안)에는 숨기고, 그 종료 직후 0.5s fade-in으로 등장하게 한다. facility level >= 1이 되면 자동으로 unmount.
5. `src/game/playfield/types.ts`의 `orderVariant` union에 `merchant-chain-handoff`를 추가한다.
6. App.tsx의 `orderVariant` 라우팅에 `merchant-chain-handoff` 분기를 추가한다. 우선순위: chain-complete sparkle 종료 + facility 미설치 + chain-complete reward motion 비활성 시 `merchant-chain-handoff`가 표시되어 playfield order crate가 다음 facility 단계 표식으로 보이게 한다(메달/리본 대신 화살표 모티프).
7. `src/styles.css`에 `.merchant-chain-next-goal` handoff card + `.merchant-chain-next-goal-arrow` 화살표 chip + `merchant-chain-next-goal-fadein` keyframe + playfield `merchant-chain-handoff` crate variant를 추가한다.
8. `tests/visual/p0-mobile-game-shell.spec.ts`에 393px regression을 추가한다:
   - chain-complete 직후 handoff card visible(strong "다음 목표", span "달빛 온실 설립")
   - bottom-tabs/playfield 비충돌
   - facility build 후 handoff card unmount 확인
9. focused checks → issue/PR body-file/evidence mirror → branch push → PR create/watch/merge → main CI observation.

## 수용 기준

- [ ] `merchantChainBoostActive=true && greenhouseFacilityLevel<MAX` 조건에서 production card에 `.has-merchant-chain-next-goal` className이 적용되고 `.merchant-chain-next-goal` handoff card가 렌더된다.
- [ ] handoff card는 strong "다음 목표" + span "달빛 온실 설립" + small 비용 또는 unlock 안내 + arrow chip을 한 줄/두 줄 안에 보여준다.
- [ ] chain-complete sparkle motion(2.2s)이 진행되는 동안 handoff card는 숨겨지고, 종료 직후 0.5s fade-in으로 등장한다.
- [ ] facility level이 1이 되면 handoff card가 자동으로 unmount된다.
- [ ] playfield order crate variant `merchant-chain-handoff`가 정의되고 chain-complete sparkle 종료 후 facility 미설치 시 표시된다(reward motion이 활성일 때는 우선순위가 reward에 양보).
- [ ] 393px 모바일에서 handoff card / 기존 chain-complete chip / 하단 탭이 겹치지 않고 production card에 추가 overflow를 만들지 않는다.
- [ ] 신규 accepted manifest asset 없이 existing facility icon + DOM/CSS state + 작은 motion만 사용하고 runtime image generation/API 호출 없음.
- [ ] 393px focused Playwright regression(handoff card 표시 + facility 설립 후 사라짐), `npm run check:visual`, `npm run check:ci`가 남는다.

## 검증 명령

- `npm run build`
- `npx playwright test --config playwright.config.ts --grep "단골 시퀀스 마침|merchant-chain-next-goal|chain-handoff|달빛 온실 설립"`
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

- 393px production card overflow 위험. handoff card는 한 줄 strong + 두 줄 small + arrow chip으로 묶고, 화면 폭이 부족하면 small을 줄임표 처리하지 않고 줄바꿈으로 흡수한다.
- chain-complete reveal motion과 handoff fade-in이 겹치면 layout이 흔들릴 수 있다. handoff fade-in은 `merchantChainCompleteReceipt`가 null로 돌아간 직후 시작하도록 condition gate로 분리한다.
- `merchantChainNextGoalActive`가 facility build 직후 false가 되면 unmount가 갑작스러워 보일 수 있다. 0.4s fade-out keyframe으로 이 전환을 부드럽게 닫는다.
- playfield `merchant-chain-handoff` variant가 reward motion(첫 납품/추가 보상)과 우선순위 충돌하면 reward 가시성이 깨진다. reward motion 활성 시에는 reward variant가 우선이고 handoff는 다음 idle tick에서만 표시되도록 라우팅한다.
- Browser Use iab는 current-session 미발견이 예상되므로 issue 전용 blocker를 새로 기록한다.

## Subagent/Team Routing

- 기본은 solo execution: 변경 영역이 좁은 파일 집합(App.tsx 파생 + 렌더, styles.css handoff card + keyframes, types.ts variant, regression spec)에 묶이며 병렬 worker conflict 가능성이 더 크다.
- Codex native subagents/team mode는 facility-greenhouse 진입 phase 전체 economy/visual QA를 별도 evidence로 분리할 때만 사용한다.
