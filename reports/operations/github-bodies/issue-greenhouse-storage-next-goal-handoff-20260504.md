## GitHub authority

- Plan artifact: `items/0177-greenhouse-storage-next-goal-handoff.md`
- Source: Studio Harness v3 dry-run after #348 merge / main CI run `25302859250` success → `production-game-intake-required` (queue empty)
- Campaign source of truth: P0.5 Idle Core + Creative Rescue
- WorkUnit type: production game quality Intake

## 문제 / 배경

#348은 첫 GREENHOUSE_ORDER 납품에 출하 receipt(1.8초 sparkle) + playfield 메달 variant를 더해 chain handoff arc(#344 → #346)의 다음 호흡을 시각적으로 닫았다. 그러나 receipt 모션이 끝난 직후 production card는 다음 production 목표를 잃어버린다. `getCurrentOrder` priority chain은 GREENHOUSE_ORDER 완료 직후 `greenhouseStorageLevel >= MAX` 체크로 떨어지는데, 첫 납품 직후 평균 플레이어는 storage를 아직 안 샀으므로 분기를 통과하지 못하고 마지막 fallback이 이미 완료된 GREENHOUSE_ORDER를 다시 current order로 반환한다. 결과적으로 production card에는 stale-completed `온실 선반 납품` 상태만 남고 "다음에 무엇" 목표는 화면에서 사라진다.

idle 경쟁작은 첫 building unlock 직후 다음 unlock 목표를 같은 화면에 즉시 보여준다(Egg Inc. 첫 contract → 다음 contract slot, Idle Miner Tycoon 첫 광산 → 다음 광산 unlock CTA). 우리는 chain handoff arc의 다음 호흡(첫 출하)에서 receipt 후 silent gap이 다시 생긴다.

## 목표

GREENHOUSE_ORDER dispatch receipt(1.8초)가 끝난 직후 production card에 영구 `.greenhouse-storage-next-goal` handoff card를 띄워 chain handoff arc(#344 → #346 → #348)의 네 번째 beat — "선반 정리 (storage upgrade)"로 시각적 handoff — 를 닫는다. handoff는 storage 설립 직후 자동으로 사라진다.

## Small win

온실 선반 첫 출하 직후 정원 자동 가속 보상이 "다음 목표(선반 정리)"로 자연스럽게 이어지는 손맛이 한 줄 handoff card로 마무리된다.

## Studio Campaign Gate

- Player verb: `온실 선반 납품 → dispatch receipt → 다음 목표(선반 정리) handoff card 인지 → upgrades 진입`
- Production/progression role: facility-greenhouse 진입 phase의 네 번째 beat — 첫 출하(#348)와 다음 storage upgrade 사이의 transition을 시각적으로 닫는다.
- Screen moment: GREENHOUSE_ORDER dispatch receipt(1.8초)가 끝난 직후 production card에 영구 `.greenhouse-storage-next-goal` handoff card 등장. card는 strong "다음 목표" + span "선반 정리 · 1 재료" 또는 "재료 부족" + arrow chip을 한 줄에 보여준다. 카드 layout 예산 안에 맞도록 dispatch receipt 종료 후 production-complete-row를 hide하고 handoff card가 그 자리를 받는다.
- Concrete visual/game-feel payoff:
  - HUD affordance: production card에 `.has-greenhouse-storage-next-goal` className + `.greenhouse-storage-next-goal` 한 줄 chip card.
  - Layout 조정: handoff active 시 redundant `production-complete-row`를 hide하여 393px 모바일 production card overflow를 방지.
  - Reward motion: handoff fade-in(0.5s) + arrow chip pulse(1.6s) — 1회성, 그 이후 영구 표시.
  - Numeric payoff: 별도 multiplier 변경 없음. handoff에 한정.
- Competition production gap: idle 경쟁작은 첫 building unlock 직후 다음 unlock 목표를 같은 화면에 보여준다. 우리는 dispatch receipt 후 silent gap이 다시 생긴다.
- Asset/FX axis commitment: HUD affordance + reward motion + layout 조정. 신규 accepted manifest asset 없음.
- Playtest evidence: Browser Use iab 우선 시도, blocker 시 issue 전용 blocker + 393px focused Playwright regression(handoff card 표시 + 카피 + bottom-tabs 비충돌).

## Game Studio Department Signoff

- 기획팀: chain handoff arc(#344→#346→#348)의 다음 호흡(첫 출하 후 다음 unlock)이 시각적으로 마무리되어야 facility-greenhouse 진입 loop가 끊기지 않는다.
- 리서치팀: idle 경쟁작은 첫 building unlock 직후 다음 unlock 목표를 같은 화면에 보여준다. 우리는 dispatch receipt 후 silent gap이 다시 생긴다.
- 아트팀: 신규 accepted manifest asset 없음. existing greenhouse storage icon + DOM/CSS handoff card + arrow keyframe만 사용.
- 개발팀: `src/App.tsx`(`greenhouseStorageHandoffActive` className + handoff card 렌더), `src/styles.css`(handoff card + production-complete-row hide rule), `tests/visual/p0-mobile-game-shell.spec.ts`(GREENHOUSE_ORDER 납품 → dispatch receipt 종료 → handoff card 표시 393px regression).
- 검수팀: Browser Use iab current-session 시도 → blocker 시 issue 전용 blocker + 393px focused Playwright regression(handoff card 표시 + 카피 + bottom-tabs 비충돌 + production card overflow 없음), `npm run check:visual`, `npm run check:ci`.
- 마케팅팀: mock-only player promise. 외부 채널/실결제/광고 없음.
- 고객지원팀: "온실 선반 납품 끝났는데 다음 목표가 안 보인다"를 storage 설치 handoff card로 줄인다.

## 사용자/운영자 가치

- 사용자: chain handoff arc(#344 → #346 → #348)가 첫 출하 후에도 끊기지 않고 다음 production 단계(선반 정리)로 시각적으로 이어진다.
- 운영자: #336 → #338 → #344 → #346 → #348 chain handoff arc를 facility-greenhouse 진입의 네 번째 reveal moment로 닫아 P0.5 Idle Core + Creative Rescue의 production loop continuity를 한 칸 더 채운다.

## 수용 기준

- [ ] `greenhouseOrderComplete && !storageComplete && (orderDeliveryReceipt 비활성)` 조건에서 production card에 `.has-greenhouse-storage-next-goal` className이 적용되고 `.greenhouse-storage-next-goal` handoff card가 렌더된다.
- [ ] handoff card는 strong "다음 목표" + span "선반 정리 · 1 재료" 또는 "재료 부족" 안내 + arrow chip을 한 줄에 보여준다.
- [ ] dispatch receipt(1.8s) 활성 동안 handoff card는 숨겨지고, 종료 직후 0.5s fade-in으로 등장한다.
- [ ] storage level이 1이 되면 handoff card가 자동으로 unmount된다.
- [ ] handoff active 시 production-complete-row가 hide되어 393px production card overflow가 발생하지 않는다.
- [ ] 신규 accepted manifest asset 없이 existing facility/storage icon + DOM/CSS state + 작은 motion만 사용하고 runtime image generation/API 호출 없음.
- [ ] 393px focused Playwright regression(handoff card 표시 + 카피 + production card overflow 없음), `npm run check:visual`, `npm run check:ci`가 남는다.

## Visual evidence 계획

- Browser Use iab target: chain handoff(#344) → 작업대 강화 → 온실 설비 click(#346) → 잎 채움 → 온실 선반 납품 click → dispatch receipt 종료 → 선반 정리 handoff card.
- Fallback screenshot: focused regression artifact `mobile-greenhouse-facility-order-v0-393.png`(handoff card 포함, dispatch receipt 종료 후).
- Layout invariant: handoff card / production card / 하단 탭 vs `.bottom-tabs`, no body scroll, no panel masked overflow.

## Playable mode 영향

- Local dev: `npm run dev -- --host 127.0.0.1 --port 3000`
- Stable main playable mirror 계약 유지: `npm run play:main` + port 5174.

## 안전 범위

- runtime image generation/API 호출 없음.
- 신규 accepted manifest asset 없음. existing facility/storage icon + DOM/CSS handoff card + arrow keyframe만 사용.
- real payment, customer data, external production deployment 없음.
- 기존 first/greenhouse/lunar/follow-up/second-chapter 우선순위 보존: economy 변동 없음. 신규 변경은 시각적 handoff에 한정.
- save 호환: 신규 state 없음, save schema 변경 없음.

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

- 기본은 solo execution: 변경 영역이 좁은 파일 집합(App.tsx 렌더, styles.css handoff card + hide rule, regression spec)에 묶이며 병렬 worker conflict 가능성이 더 크다.
- Codex native subagents/team mode는 facility-greenhouse 진입 phase 전체 economy/visual QA를 별도 evidence로 분리할 때만 사용한다.
