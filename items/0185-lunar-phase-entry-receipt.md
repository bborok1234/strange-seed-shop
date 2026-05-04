# WorkUnit #366 — 달빛 손님 첫 발견 직후 production card에 "달빛 phase 시작" reveal motion으로 lunar phase entry를 anchor한다

## GitHub authority

- GitHub issue: #366 https://github.com/bborok1234/strange-seed-shop/issues/366
- Branch: `codex/0185-lunar-phase-entry-receipt`
- Campaign source of truth: P0.5 Idle Core + Creative Rescue
- Runner decision: `production-game-intake-required` after #364 main CI `25305634435` success and queue empty
- Status: plan-first

## 문제 / 배경

LUNAR_REWARD_CREATURE_ID(달빛 손님)는 lunar seed 수확 시 도감에 추가되며, 그 순간 harvestReveal modal이 등장한다. 그러나 player perception 관점에서 이는 일반 creature discovery와 동일한 무게로 처리되어 lunar phase 진입의 milestone moment 가 잘 안 느껴진다. North Star Phase 0 핵심 루프의 마지막 베타("연구/탐험 → 더 희귀한 생명체 수집")에 해당하는 단계인데 화면에서 별도 transition reveal이 없다.

## 목표

LUNAR_REWARD_CREATURE_ID 첫 discovery(즉 `discoveredCreatureIds`에 추가되는 그 commit) 직후 production card에 `.lunar-phase-entry-receipt` 2.0초 reveal motion을 띄운다. 카피는 strong "달빛 phase 시작" + span "달빛 보호 거래 준비" + small "달빛 케어 메모리 잠금 해제". harvestReveal modal과 별개로, production card 위에 layered되어 player는 두 surface 모두에서 lunar 진입을 인지한다.

## Plan

1. `LunarPhaseEntryReceipt` interface + state 추가.
2. `harvest` 함수에서 LUNAR_REWARD_CREATURE_ID 첫 discovery 감지 (`!save.discoveredCreatureIds.includes(LUNAR_REWARD_CREATURE_ID) && harvestedCreatureId === LUNAR_REWARD_CREATURE_ID`).
3. 감지 시 receipt fire (2_000ms timeout).
4. production card className에 `has-lunar-phase-entry-receipt` 추가.
5. 렌더 (chip "달빛 phase 시작", strong "달빛 phase 시작", span "달빛 보호 거래 준비", small "달빛 케어 메모리 잠금 해제").
6. CSS: 보라/lunar 톤(`rgba(180, 156, 220, ...)`).

## 수용 기준

- [ ] LUNAR_REWARD_CREATURE_ID 첫 discovery 직후 receipt 등장.
- [ ] 약 2초 후 unmount.
- [ ] 신규 manifest asset 없음.
- [ ] build + 기존 regression 통과.

## 검증 명령

- `npm run build`
- 기존 regression 통과.
- `npm run check:ci` 외 mirror gates.

## 리스크

- harvestReveal modal과 production card receipt 두 layer가 동시에 보일 수 있다 — 의도된 동작(modal은 creature 정보, receipt는 phase 진입). layout 충돌 없음.
- LUNAR_REWARD_CREATURE_ID 첫 discovery 자동화 regression은 lunar seed 수확까지 시퀀스가 길어 비용 높다. build + 기존 lunar tests 통과로 검증.

## Subagent/Team Routing

- 기본은 solo execution.
