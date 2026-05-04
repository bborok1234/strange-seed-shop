## 요약

#366은 LUNAR_REWARD_CREATURE_ID(달빛 손님)가 첫 discovery되는 그 commit 직후 production card에 "달빛 phase 시작" 2.0초 reveal motion(strong "달빛 phase 시작" + "달빛 보호 거래 준비" + "달빛 케어 메모리 잠금 해제")을 1회 표시합니다. 기존 harvestReveal modal과 별개로 production card 위에 layered되어 player는 두 surface(modal + receipt) 모두에서 lunar phase 진입을 인지합니다. CSS는 보라/lunar 톤(`rgba(180, 156, 220, ...)`)으로 chain handoff arc(green/blue)와 시각적으로 구분.

## Small win

lunar seed 첫 수확 → 달빛 손님 discovery 순간이 production card receipt + harvestReveal modal layered로 phase 진입의 milestone moment로 마무리됩니다.

## 사용자/운영자 가치

- 사용자: lunar phase 진입 순간이 일반 creature discovery와 다른 무게로 처리되어 player perception에 lunar phase 시작이 누적된다.
- 운영자: P0.5 phase 0 핵심 루프의 마지막 베타("연구/탐험 → 더 희귀한 생명체 수집")가 시각적으로 마무리되어 production loop의 long-term 진행도 axis가 한 단계 더 채워진다.

## Before / After 또는 Visual evidence

- Before: lunar seed 수확 시 일반 harvestReveal modal만 등장. 달빛 phase 진입의 milestone moment가 별도 surface로 마크되지 않음.
- After: harvest 함수가 LUNAR_REWARD_CREATURE_ID 첫 discovery를 감지해 `setLunarPhaseEntryReceipt`를 fire. production card에 보라 톤 receipt sparkle 2.0초 등장. modal과 receipt 두 layer로 lunar phase entry의 시각적 무게가 누적된다.
- Browser Use: current-session iab discovery 실패 기록 `reports/visual/browser-use-blocker-0366-20260504.md`.

## 검증

- [x] `npm run build`
- [x] `npm run check:ci`
- [x] `npm run check:ops-live`
- [x] mirror gates 통과

## 안전 범위

- 신규 accepted manifest asset 없음. existing tone palette + DOM/CSS receipt + facility-entry keyframe 재사용.
- runtime image generation/API 호출 없음.
- save 호환: 신규 state는 transient receipt에 한정.

## 남은 위험

- LUNAR_REWARD_CREATURE_ID 첫 discovery 자동화 regression은 시퀀스 길어 비용 높다. 별도 WorkUnit으로 추적 가능.

## 연결된 issue

Closes #366

## 작업 checklist

- [x] Game Studio route 기록
- [x] Plan-first artifact: `items/0185-lunar-phase-entry-receipt.md`
- [x] Visual evidence 또는 current-session blocker 기록
- [x] Build + CI/ops/mirror gates 통과
- [x] Routine GitHub publication은 body-file로 수행
