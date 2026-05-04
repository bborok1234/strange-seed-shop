# WorkUnit #350 — 첫 GREENHOUSE_ORDER 납품 후 다음 production 목표(선반 정리)로 시각적 handoff card를 production card에 더한다

## GitHub authority

- GitHub issue: #350 https://github.com/bborok1234/strange-seed-shop/issues/350
- Branch: `codex/0177-greenhouse-storage-next-goal-handoff`
- Campaign source of truth: P0.5 Idle Core + Creative Rescue
- Runner decision: `production-game-intake-required` after #348 main CI `25302859250` success and queue empty
- Status: plan-first

## 문제 / 배경

#348은 첫 GREENHOUSE_ORDER 납품에 출하 receipt(1.8초 sparkle) + playfield 메달 variant를 더해 chain handoff arc(#344 → #346)의 다음 호흡을 시각적으로 닫았다. 그러나 receipt 모션이 끝난 직후 production card는 다음 production 목표를 잃어버린다. `getCurrentOrder` priority chain을 추적해보면 GREENHOUSE_ORDER 완료 직후의 분기는 `greenhouseStorageLevel >= GREENHOUSE_STORAGE_MAX_LEVEL` 체크인데, 첫 납품 직후 평균 플레이어는 storage를 아직 안 샀으므로 그 분기를 통과하지 못한다. priority chain의 모든 후속 분기가 false로 떨어지면 마지막 fallback이 `save.idleProduction.completedOrderIds.includes(GREENHOUSE_ORDER.id) ? GREENHOUSE_ORDER`로 떨어져 **이미 완료된 GREENHOUSE_ORDER를 다시 current order로 반환**한다. 결과적으로 dispatch receipt가 끝나면 production card에는 stale-completed `온실 선반 납품` 상태만 남고 "다음에 무엇" 목표는 화면에서 사라진다.

idle 경쟁작은 첫 building unlock 직후 다음 unlock 목표를 같은 화면에 즉시 보여준다(Egg Inc. 첫 hatchery → 다음 contract slot, Idle Miner Tycoon 첫 광산 → 다음 광산 unlock CTA). 우리는 chain handoff arc의 다음 호흡(첫 출하)에서 receipt 후 silent gap이 다시 생긴다.

## Reference teardown

- Egg, Inc.: 첫 contract 완료 → 같은 UI에 다음 contract slot 즉시 등장.
- Idle Miner Tycoon: 첫 광산 첫 cargo 후 → 다음 광산 unlock CTA가 같은 화면에 highlight.
- #344 (자체 reference): 단골 시퀀스 마침 직후 "다음 목표: 달빛 온실 설립" handoff card로 chain-end gap을 닫음.
- Reject: dispatch receipt 후 production card를 stale-completed 상태로 두는 방식. 다음 unlock 목표가 시각적으로 사라지면 retention hook이 끊긴다.

## Creative brief

- Player fun target: 온실 선반 첫 출하 직후 정원 자동 가속 보상이 "다음 목표(선반 정리)"로 자연스럽게 이어지는 손맛.
- Core loop role: facility-greenhouse 진입 phase의 세 번째 beat — 첫 출하(#348)와 다음 storage upgrade 사이의 transition을 시각적으로 닫는다.
- Screen moment: GREENHOUSE_ORDER dispatch receipt(1.8초)가 끝난 직후 production card에 영구 `.greenhouse-storage-next-goal` handoff card 등장. card는 strong "다음 목표" + span "선반 정리" + small "1 재료로 보관 보너스 +20%" 또는 "{shortfall} 재료 더 필요" + arrow chip을 한 줄에 보여준다. storage level이 1이 되면 자동으로 unmount된다.
- Required assets/FX: 신규 accepted manifest asset 없음. existing greenhouse storage icon + DOM/CSS handoff card + arrow keyframe(`merchant-chain-next-goal-arrow-pulse` 재사용 또는 동등 keyframe).
- Game-feel requirements: handoff card는 dispatch receipt fade-out 직후 0.5s fade-in으로 등장. 화살표/아이콘 1회 pulse로 "이쪽으로 이어진다"를 시각적으로 전달. storage 설립 직후 0.4s fade-out.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- 적용 규칙: playfield 비차폐, persistent HUD 저밀도 유지, handoff card는 production card 내부 기존 receipt 영역에 묶여 추가 layout column을 만들지 않는다. DOM text만으로 통과하지 않고 393px screenshot/playtest evidence를 남긴다.

## Game Studio Department Signoff

- 기획팀: chain handoff arc(#344→#346→#348)의 다음 호흡(첫 출하 후 다음 unlock)이 시각적으로 마무리되어야 facility-greenhouse 진입 loop가 끊기지 않는다.
- 리서치팀: idle 경쟁작은 첫 building unlock 직후 다음 unlock 목표를 같은 화면에 보여준다. 우리는 dispatch receipt 후 silent gap이 다시 생긴다.
- 아트팀: 신규 accepted manifest asset 없음. existing greenhouse storage icon + DOM/CSS handoff card + arrow keyframe만 사용.
- 개발팀: `src/App.tsx`(`greenhouseStorageHandoffActive` 파생 + className + handoff card 렌더), `src/styles.css`(handoff card + arrow keyframe), `tests/visual/p0-mobile-game-shell.spec.ts`(GREENHOUSE_ORDER 납품 → dispatch receipt 종료 → handoff card 표시 + storage build 후 사라짐 393px regression).
- 검수팀: Browser Use iab current-session 시도 → blocker 시 issue 전용 blocker + 393px focused Playwright regression(handoff card 표시 + storage 설립 후 사라짐 + bottom-tabs 비충돌), `npm run check:visual`, `npm run check:ci`.
- 마케팅팀: mock-only player promise. 외부 채널/실결제/광고 없음.
- 고객지원팀: "온실 선반 납품 끝났는데 다음 목표가 안 보인다"를 storage 설치 handoff card로 줄인다.

## Plan

1. `src/App.tsx`에 `greenhouseStorageHandoffActive` 파생값을 만든다. 조건: `save.idleProduction.completedOrderIds.includes(GREENHOUSE_ORDER.id) && save.greenhouseStorageLevel < GREENHOUSE_STORAGE_MAX_LEVEL && !(orderDeliveryReceipt?.orderId === GREENHOUSE_ORDER.id)`.
2. production card className 분기에 `greenhouseStorageHandoffActive ? "has-greenhouse-storage-next-goal" : ""`를 추가한다.
3. 기존 `.merchant-chain-next-goal` 영역 직후에 `<div className="greenhouse-storage-next-goal">` handoff card를 렌더한다. 내용:
   - strong: "다음 목표"
   - span: "선반 정리"
   - small: storage build 비용 또는 안내(`save.materials >= GREENHOUSE_STORAGE_COST_MATERIALS ? "1 재료로 보관 보너스 +20%" : "재료 부족"`)
   - arrow chip: "→ 시작" (affordable 시 강조, 아닐 시 muted)
4. handoff card는 dispatch receipt(`orderDeliveryReceipt?.orderId === GREENHOUSE_ORDER.id`) 활성 동안 숨기고, 종료 직후 0.5s fade-in으로 등장하게 한다. storage level >= MAX이면 자동 unmount.
5. `src/styles.css`에 `.greenhouse-storage-next-goal` handoff card + arrow chip + fade-in keyframe(또는 기존 `merchant-chain-next-goal-fadein` 재사용)을 추가한다. 톤은 chain-handoff와 일관된 초록 계열을 사용한다.
6. 기존 "모바일 온실 설비는 새 납품 주문으로 이어진다" regression(line 2107)에 dispatch receipt 종료(2.0s 대기) → handoff card 표시 + 카피 + bottom-tabs 비충돌 + storage build(localStorage 변경 + reload) 후 handoff dismiss 확인을 추가한다.
7. focused checks → issue/PR body-file/evidence mirror → branch push → PR create/watch/merge → main CI observation.

## 수용 기준

- [ ] `greenhouseOrderComplete && !storageComplete && (orderDeliveryReceipt 비활성)` 조건에서 production card에 `.has-greenhouse-storage-next-goal` className이 적용되고 `.greenhouse-storage-next-goal` handoff card가 렌더된다.
- [ ] handoff card는 strong "다음 목표" + span "선반 정리" + small 비용 또는 안내 + arrow chip을 한 줄/두 줄 안에 보여준다.
- [ ] dispatch receipt(1.8s) 활성 동안 handoff card는 숨겨지고, 종료 직후 0.5s fade-in으로 등장한다.
- [ ] storage level이 1이 되면 handoff card가 자동으로 unmount된다.
- [ ] 393px 모바일에서 handoff card / 기존 production card chip / 하단 탭이 겹치지 않고 production card에 추가 overflow를 만들지 않는다.
- [ ] 신규 accepted manifest asset 없이 existing facility/storage icon + DOM/CSS state + 작은 motion만 사용하고 runtime image generation/API 호출 없음.
- [ ] 393px focused Playwright regression(handoff card 표시 + storage 설립 후 사라짐), `npm run check:visual`, `npm run check:ci`가 남는다.

## 검증 명령

- `npm run build`
- `npx playwright test --config playwright.config.ts --grep "온실 설비는 새 납품 주문으로 이어진다"`
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

- 393px production card overflow 위험. handoff card는 한 줄 strong + 두 줄 small + arrow chip으로 묶고, 화면 폭이 부족하면 줄바꿈으로 흡수한다.
- dispatch receipt fade-out과 handoff fade-in이 겹치면 layout이 흔들릴 수 있다. handoff fade-in은 `orderDeliveryReceipt?.orderId === GREENHOUSE_ORDER.id`가 false로 돌아간 직후 시작하도록 condition gate로 분리한다.
- `greenhouseStorageHandoffActive`가 storage build 직후 false가 되면 unmount가 갑작스러워 보일 수 있다. 0.4s fade-out keyframe으로 이 전환을 부드럽게 닫는다.
- Browser Use iab는 current-session 미발견이 예상되므로 issue 전용 blocker를 새로 기록한다.

## Subagent/Team Routing

- 기본은 solo execution: 변경 영역이 좁은 파일 집합(App.tsx 파생 + 렌더, styles.css handoff card, regression spec)에 묶이며 병렬 worker conflict 가능성이 더 크다.
- Codex native subagents/team mode는 facility-greenhouse 진입 phase 전체 economy/visual QA를 별도 evidence로 분리할 때만 사용한다.
