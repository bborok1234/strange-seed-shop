# WorkUnit #352 — 선반 정리 직후 production card에 "선반 정리 완료" reveal motion으로 storage handoff loop를 닫는다

## GitHub authority

- GitHub issue: #352 https://github.com/bborok1234/strange-seed-shop/issues/352
- Branch: `codex/0178-greenhouse-storage-entry-reveal`
- Campaign source of truth: P0.5 Idle Core + Creative Rescue
- Runner decision: `production-game-intake-required` after #350 main CI `25303306137` success and queue empty
- Status: plan-first

## 문제 / 배경

#350은 GREENHOUSE_ORDER dispatch receipt 종료 직후 production card에 `.greenhouse-storage-next-goal` handoff card를 띄워 chain handoff arc(#344 → #346 → #348)의 네 번째 beat를 닫았다. 그러나 플레이어가 그 안내를 따라 `buyGreenhouseStorage`를 click하면 변하는 것은 두 가지뿐이다:

1. `greenhouseStorageLevel`이 1로 토글되고 storage handoff card가 unmount된다.
2. 다음 priority 분기로 GREENHOUSE_EXPANSION_ORDER가 current order로 전환된다(silent state).

storage 설립 그 순간 production card나 playfield에는 어떤 reveal moment도 없다. handoff card → click → silent state change → next order 등장까지의 transition이 비어 있다. #346이 facility 설립에 적용한 `달빛 온실 입장` reveal motion 패턴을 storage에도 적용해 chain handoff arc의 다섯 번째 beat를 시각적으로 닫는다.

## Reference teardown

- #346 (자체 reference): facility 설립 직후 production card에 2.0초 reveal motion + chip + 다음 주문 카피.
- Egg, Inc.: secondary upgrade complete 시에도 작은 burst.
- Reject: storage 설립을 silent state 변화로만 두는 방식. handoff card → click → silent → next order의 transition이 시각적으로 비면 production loop continuity가 끊긴다.

## Creative brief

- Player fun target: 선반 정리 click 직후 정원 보관 보너스가 시각적 beat로 보상받는 손맛.
- Core loop role: facility-greenhouse 진입 phase의 다섯 번째 beat — storage handoff(#350)와 다음 production 단계(GREENHOUSE_EXPANSION_ORDER) 사이의 transition을 시각적으로 닫는다.
- Screen moment: `buyGreenhouseStorage` 성공 직후 production card에 `.greenhouse-storage-entry-receipt`(2.0초 reveal motion) + strong "선반 정리 완료" + span "다음 주문: 온실 확장 준비 시작" + small "보관 보너스 +10% 적용". 기존 storage handoff card는 storage level 토글로 자동 unmount.
- Required assets/FX: 신규 accepted manifest asset 없음. existing storage icon + DOM/CSS receipt + sparkle keyframe(#346의 `greenhouse-facility-entry-reveal` 키프레임 재사용 가능 — 동일 톤).
- Game-feel requirements: receipt는 fade-in(0.35s) → glow burst(0.4s) → fade-out(1.25s)로 1회 재생, handoff card unmount와 겹치지 않게 storage-level 토글과 같은 commit 직후 set.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- 적용 규칙: playfield 비차폐, persistent HUD 저밀도 유지, receipt는 production card 내부 기존 receipt 영역에 묶여 추가 layout column을 만들지 않는다. DOM text만으로 통과하지 않고 393px screenshot/playtest evidence를 남긴다.

## Plan

1. `src/App.tsx`에 `GreenhouseStorageEntryReceipt { id: number; nextOrderTitle: string; bonusPercent: number }` interface와 `useState<GreenhouseStorageEntryReceipt | null>` state를 추가한다.
2. `buyGreenhouseStorage` 함수에 `canBuild` precheck를 추가하고, 성공 시 `setGreenhouseStorageEntryReceipt({ ... })`를 호출하고 2_000ms timeout으로 unmount, `trackEvent("greenhouse_storage_entry_revealed", ...)`도 추가.
3. production card className 분기에 `greenhouseStorageEntryReceipt ? "has-greenhouse-storage-entry-receipt" : ""`를 추가한다.
4. production card 내부 기존 `.greenhouse-facility-entry-receipt` 직후에 `.greenhouse-storage-entry-receipt` div를 렌더한다 (chip "선반 정리 완료", strong "선반 정리 완료", span "다음 주문: {nextOrderTitle} 시작", small "보관 보너스 +{bonusPercent}% 적용").
5. `src/styles.css`에 `.greenhouse-storage-entry-receipt` + chip + reveal/chip-pulse keyframe을 추가하거나 기존 `greenhouse-facility-entry-reveal/-chip-pulse` 키프레임을 재사용한다(톤 일관).
6. 기존 "모바일 작업대 강화는 첫 온실 설비 목표로 이어진다" regression의 끝부분이나 별도 위치에서, storage 설립 click → entry receipt 표시 + 카피 + unmount 393px regression을 확장한다. 단순한 접근: 기존 "모바일 온실 설비는 새 납품 주문으로 이어진다" 테스트 끝부분에 storage build 추가 → entry receipt 시각화 검증.
7. focused checks → issue/PR body-file/evidence mirror → branch push → PR create/watch/merge → main CI observation.

## 수용 기준

- [ ] `buyGreenhouseStorage`가 성공한 직후(`greenhouseStorageLevel`이 1로 토글된 케이스에서만) `.greenhouse-storage-entry-receipt`가 production card에 등장한다.
- [ ] receipt 카피는 strong "선반 정리 완료", span "다음 주문: 온실 확장 준비 시작", small "보관 보너스 +10% 적용"이다.
- [ ] receipt는 약 2초 후 자동으로 unmount되고, 그 직후 #350 storage handoff card도 storage level 토글로 사라져 production card는 GREENHOUSE_EXPANSION_ORDER 모드로 자연스럽게 전환된다.
- [ ] 393px 모바일에서 receipt / 기존 production card chip / 하단 탭이 겹치지 않고 production card에 추가 overflow를 만들지 않는다.
- [ ] 신규 accepted manifest asset 없이 existing storage icon + DOM/CSS state + 작은 motion만 사용하고 runtime image generation/API 호출 없음.
- [ ] 393px focused Playwright regression(receipt 표시 + 카피 + unmount), `npm run check:visual`, `npm run check:ci`가 남는다.

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

- 기존 "모바일 온실 설비는 새 납품 주문으로 이어진다" regression이 storage handoff card를 검증한다. storage build를 추가하면 그 spec이 확장된다. handoff card 사라짐 + entry receipt 등장이 동시에 일어나는 transition이 layout overflow를 만들지 않도록 receipt 활성 시에도 production-complete-row hide 규칙을 적용해 카드 height 예산 안에 맞춘다.
- entry receipt fade-in과 handoff card fade-out이 겹치면 layout이 흔들릴 수 있다. handoff는 storage level 토글로 즉시 unmount되고, receipt는 0.35s fade-in으로 등장해 시각적 우선순위를 분리한다.
- Browser Use iab는 current-session 미발견이 예상되므로 issue 전용 blocker를 새로 기록한다.

## Subagent/Team Routing

- 기본은 solo execution: 변경 영역이 좁은 파일 집합(App.tsx receipt + 라우팅, styles.css receipt + variant, regression spec)에 묶이며 병렬 worker conflict 가능성이 더 크다.
- Codex native subagents/team mode는 facility-greenhouse 진입 phase 전체 economy/visual QA를 별도 evidence로 분리할 때만 사용한다.
