# WorkUnit #362 — 온실 물안개 분사 직후 production card에 "물안개 분사 완료" reveal motion으로 chain handoff arc symmetry를 마무리한다

## GitHub authority

- GitHub issue: #362 https://github.com/bborok1234/strange-seed-shop/issues/362
- Branch: `codex/0183-greenhouse-mist-entry-reveal`
- Campaign source of truth: P0.5 Idle Core + Creative Rescue
- Runner decision: `production-game-intake-required` after #360 main CI `25305046180` success and queue empty
- Status: plan-first

## 문제 / 배경

#346(facility), #352(storage), #358(irrigation)는 각 greenhouse upgrade의 unlock moment에 reveal motion을 묶었다. 마지막 greenhouse upgrade인 mist는 silent state 변화로만 끝나고 있다. mist는 `GREENHOUSE_MIST_OFFLINE_BONUS = +10%` 오프라인 보관 보너스를 추가하므로 comeback hook 관점에서 의미가 큰데, click moment가 시각적 반응 없이 흘러간다.

## 목표

`buyGreenhouseMist` 성공 직후 production card에 "물안개 분사 완료" 2.0초 reveal motion + 카피 "오프라인 복귀 보관 +10% 적용"으로 mist 가 추가하는 comeback hook 효과를 명시한다. greenhouse upgrade chain 4개(facility/storage/irrigation/mist)가 모두 entry reveal로 마무리된다.

## Plan

1. `GreenhouseMistEntryReceipt` interface + state 추가.
2. `buyGreenhouseMist`에 canBuild precheck + receipt fire (2_000ms timeout) + trackEvent.
3. production card className에 `has-greenhouse-mist-entry-receipt` 추가.
4. 렌더 (chip "물안개 분사 완료", strong "물안개 분사 완료", span "다음 주문: {GREENHOUSE_MIST_RETURN_ORDER.title} 시작", small "오프라인 복귀 보관 +{bonusPercent}% 적용").
5. CSS: `.greenhouse-mist-entry-receipt` + chip(파란/푸른 톤) + facility-entry keyframe 재사용.
6. focused checks → mirror gates → PR.

## 수용 기준

- [ ] `buyGreenhouseMist` 성공 직후 `.greenhouse-mist-entry-receipt`가 production card에 등장.
- [ ] receipt 카피: strong "물안개 분사 완료" / span "다음 주문: 물안개 응축" / small "오프라인 복귀 보관 +10% 적용".
- [ ] 약 2초 후 unmount.
- [ ] 신규 manifest asset 없음.
- [ ] build + 기존 chip strip regression 통과.

## 검증 명령

- `npm run build`
- `npx playwright test --config playwright.config.ts --grep "온실 설비는 새 납품 주문으로 이어진다"` (회귀 보장)
- mirror gates

## 리스크

- mist는 매우 후반 단계로 자동화 regression 추가 비용 높음. build + 기존 chip strip regression이 build/render 안정성 보장.

## Subagent/Team Routing

- 기본은 solo execution.
