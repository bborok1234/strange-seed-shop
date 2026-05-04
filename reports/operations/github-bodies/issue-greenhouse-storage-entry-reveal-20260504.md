## GitHub authority

- Plan artifact: `items/0178-greenhouse-storage-entry-reveal.md`
- Source: Studio Harness v3 dry-run after #350 merge / main CI run `25303306137` success → `production-game-intake-required` (queue empty)
- Campaign source of truth: P0.5 Idle Core + Creative Rescue
- WorkUnit type: production game quality Intake

## 문제 / 배경

#350은 GREENHOUSE_ORDER dispatch receipt 종료 직후 production card에 `.greenhouse-storage-next-goal` handoff card를 띄워 chain handoff arc(#344 → #346 → #348)의 네 번째 beat를 닫았다. 그러나 플레이어가 그 안내를 따라 `buyGreenhouseStorage`를 click하면 silent 두 가지 변화만 일어난다: `greenhouseStorageLevel` 1로 토글, 다음 priority로 GREENHOUSE_EXPANSION_ORDER 전환. handoff card → click → silent → 다음 주문 등장의 transition이 비어 있고, #346이 facility 설립에 적용한 entry reveal 패턴이 storage에서는 빠져 있다.

## 목표

`buyGreenhouseStorage` 성공 직후 production card에 "선반 정리 완료" 2.0초 reveal motion을 1회 표시해 storage handoff loop(#350)를 닫는다. receipt는 다음 주문(GREENHOUSE_EXPANSION_ORDER, "온실 확장 준비")과 +10% 보관 보너스 적용을 한 호흡에 보여준다.

## Small win

storage handoff(#350) → click → "선반 정리 완료" reveal beat → 다음 주문 등장이 한 호흡으로 마무리되어 chain handoff arc(#344→#346→#348→#350)의 다섯 번째 beat가 닫힌다.

## Studio Campaign Gate

- Player verb: `storage handoff card 인지 → 선반 정리 click → 선반 정리 완료 reveal → 다음 주문(온실 확장 준비) 시작`
- Production/progression role: facility-greenhouse 진입 phase의 다섯 번째 beat — storage handoff(#350)와 다음 production 단계(GREENHOUSE_EXPANSION_ORDER) 사이의 transition을 시각적으로 닫는다.
- Screen moment: `buyGreenhouseStorage` 성공 직후 production card에 `.greenhouse-storage-entry-receipt`(2.0초 reveal motion) + chip "선반 정리 완료" + strong "선반 정리 완료" + span "다음 주문: 온실 확장 준비 시작" + small "보관 보너스 +10% 적용". 기존 storage handoff card는 storage level 토글로 자동 unmount.
- Concrete visual/game-feel payoff:
  - HUD affordance: production card에 `.has-greenhouse-storage-entry-receipt` className + `.greenhouse-storage-entry-receipt`.
  - Reward motion: receipt fade-in/glow burst/fade-out + chip pulse — 1회성 reveal motion(`greenhouse-facility-entry-reveal/-chip-pulse` keyframe 재사용).
  - Numeric payoff: 별도 multiplier 변경 없음. 기존 +10% 보관 보너스를 receipt copy로 plain text 표시.
- Competition production gap: idle 경쟁작은 secondary upgrade complete 시에도 작은 burst를 묶는다. 우리 storage 설립은 silent state 변화로만 두고 있다.
- Asset/FX axis commitment: HUD affordance + reward motion. 신규 accepted manifest asset 없음.
- Playtest evidence: Browser Use iab 우선 시도, blocker 시 issue 전용 blocker + 393px focused Playwright regression(receipt 표시 + 카피 + bottom-tabs 비충돌).

## Game Studio Department Signoff

- 기획팀: storage handoff(#350)가 약속한 "선반 정리"가 player click과 함께 시각적 beat로 마무리되어야 chain handoff arc loop가 끊기지 않는다.
- 리서치팀: idle 경쟁작은 secondary upgrade complete 시에도 reveal moment를 묶는다. 우리는 silent state 변화로만 두고 있다.
- 아트팀: 신규 accepted manifest asset 없음. existing storage icon + DOM/CSS receipt + sparkle keyframe(`greenhouse-facility-entry-reveal/-chip-pulse` 재사용)만 사용.
- 개발팀: `src/App.tsx`(`GreenhouseStorageEntryReceipt` interface + state + `buyGreenhouseStorage` 트리거 + production card 렌더), `src/styles.css`(receipt + chip + sparkle keyframe — facility-entry keyframe 재사용), `tests/visual/p0-mobile-game-shell.spec.ts`(storage build → entry receipt 표시 393px regression 확장).
- 검수팀: Browser Use iab current-session 시도 → blocker 시 issue 전용 blocker + 393px focused Playwright regression, `npm run check:visual`, `npm run check:ci`.
- 마케팅팀: mock-only player promise. 외부 채널/실결제/광고 없음.
- 고객지원팀: "선반 정리 click했는데 화면에서 아무 일도 안 일어난 것 같다"를 entry reveal로 줄인다.

## 사용자/운영자 가치

- 사용자: storage handoff(#350) → click → "선반 정리 완료" reveal beat → 다음 주문 등장이 한 호흡으로 마무리되어 facility-greenhouse 진입 phase의 다섯 번째 beat가 닫힌다.
- 운영자: #336 → #338 → #344 → #346 → #348 → #350 chain handoff arc를 facility-greenhouse 진입의 다섯 번째 reveal moment로 닫아 P0.5 Idle Core + Creative Rescue의 production loop continuity를 한 칸 더 채운다.

## 수용 기준

- [ ] `buyGreenhouseStorage`가 성공한 직후(`greenhouseStorageLevel`이 1로 토글된 케이스에서만) `.greenhouse-storage-entry-receipt`가 production card에 등장한다.
- [ ] receipt 카피는 chip "선반 정리 완료" + strong "선반 정리 완료" + span "다음 주문: 온실 확장 준비 시작" + small "보관 보너스 +10% 적용"이다.
- [ ] receipt는 약 2초 후 자동으로 unmount되고, 그 직후 #350 storage handoff card도 storage level 토글로 사라져 production card는 GREENHOUSE_EXPANSION_ORDER 모드로 자연스럽게 전환된다.
- [ ] 393px 모바일에서 receipt / 기존 production card chip / 하단 탭이 겹치지 않고 production card에 추가 overflow를 만들지 않는다.
- [ ] 신규 accepted manifest asset 없이 existing storage icon + DOM/CSS state + 작은 motion(facility-entry keyframe 재사용)만 사용하고 runtime image generation/API 호출 없음.
- [ ] 393px focused Playwright regression(receipt 표시 + 카피 + storage handoff dismiss), `npm run check:visual`, `npm run check:ci`가 남는다.

## Visual evidence 계획

- Browser Use iab target: storage handoff(#350) → 선반 정리 click → entry reveal → 다음 주문 등장.
- Fallback screenshot: focused regression artifact `mobile-greenhouse-facility-order-v0-393.png`(entry receipt 포함).
- Layout invariant: receipt / production card chip / 하단 탭 vs `.bottom-tabs`, no body scroll, no panel masked overflow.

## Playable mode 영향

- Local dev: `npm run dev -- --host 127.0.0.1 --port 3000`
- Stable main playable mirror 계약 유지: `npm run play:main` + port 5174.

## 안전 범위

- runtime image generation/API 호출 없음.
- 신규 accepted manifest asset 없음. existing storage icon + DOM/CSS receipt + sparkle keyframe(facility-entry 재사용)만 사용.
- real payment, customer data, external production deployment 없음.
- 기존 first/greenhouse/lunar/follow-up/second-chapter 우선순위 보존: 영구 boost(+10%) economy 변동 없음. 신규 변경은 시각적 reveal에 한정.
- save 호환: 신규 state는 transient receipt에 한정, save schema 변경 없음.

## 검증 명령

- `npm run build`
- focused Playwright: `--grep "온실 설비는 새 납품 주문으로 이어진다"`
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

- 기본은 solo execution: 변경 영역이 좁은 파일 집합(App.tsx receipt + 라우팅, styles.css receipt + chip, regression spec)에 묶이며 병렬 worker conflict 가능성이 더 크다.
- Codex native subagents/team mode는 facility-greenhouse 진입 phase 전체 economy/visual QA를 별도 evidence로 분리할 때만 사용한다.
