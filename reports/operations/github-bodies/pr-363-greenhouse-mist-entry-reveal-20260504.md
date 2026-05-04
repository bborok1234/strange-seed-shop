## 요약

#362는 `buyGreenhouseMist` 성공 직후 production card에 "물안개 분사 완료" 2.0초 reveal motion(strong "물안개 분사 완료" + "다음 주문: 온실 물안개 점검 시작" + "오프라인 복귀 보관 +10% 적용")을 1회 표시합니다. greenhouse upgrade 4개(facility/storage/irrigation/mist) 모두 entry reveal 패턴으로 chain handoff arc가 마무리됩니다. mist는 offline 보너스를 추가하므로 receipt 카피로 comeback hook 효과를 명시합니다.

## Small win

mist upgrade click → 오프라인 복귀 보관 보너스 +10%가 적용되는 unlock moment가 production card receipt로 한 호흡에 마무리되어 comeback hook 약속이 시각적으로 강화됩니다.

## 사용자/운영자 가치

- 사용자: greenhouse upgrade 4단계가 모두 일관된 entry reveal 패턴으로 마무리되어 chain handoff arc symmetry가 닫힌다. 마지막 단계는 offline 보너스를 명시해 "오프라인 다녀오면 더 모인다"는 comeback hook 약속이 강화된다.
- 운영자: #336→#360 chain handoff arc + entry reveal pattern이 facility/storage/irrigation/mist 4단계 모두 일관되게 적용되어 P0.5 Idle Core + Creative Rescue의 production loop continuity 패턴이 완전체로 마무리된다.

## Before / After 또는 Visual evidence

- Before: mist upgrade click이 silent state 변화로만 끝났다. +10% offline 보너스가 적용됐지만 시각적 unlock moment 없음.
- After: receipt sparkle(2.0s) + 다음 주문 카피 + "오프라인 복귀 보관 +10% 적용" 카피로 mist의 offline 보너스 효과가 화면에서 읽힌다. CSS는 facility-entry keyframe 재사용 + 파란/푸른 톤(`rgba(160, 196, 232, ...)`)으로 visual differentiation.
- Browser Use: current-session iab discovery 실패 기록 `reports/visual/browser-use-blocker-0362-20260504.md`.

## Playable mode

- Local dev: `npm run dev -- --host 127.0.0.1 --port 3000`

## 검증

- [x] `npm run build`
- [x] 기존 chip strip regression (`npx playwright test --grep "온실 설비는 새 납품 주문으로 이어진다"`)
- [x] `npm run check:ci`
- [x] `npm run check:ops-live`
- [x] mirror gates 통과

## 안전 범위

- 신규 accepted manifest asset 없음. existing icon + DOM/CSS receipt + facility-entry keyframe 재사용.
- runtime image generation/API 호출 없음.
- save 호환: 신규 state는 transient receipt에 한정.

## 남은 위험

- mist는 후반 단계로 자동화 regression 추가 비용 높다. build + facility/storage/irrigation entry 패턴 일관성으로 검증.

## 연결된 issue

Closes #362

## 작업 checklist

- [x] Game Studio route 기록
- [x] Plan-first artifact: `items/0183-greenhouse-mist-entry-reveal.md`
- [x] Visual evidence 또는 current-session blocker 기록
- [x] Build + regression + CI/ops/mirror gates 통과
- [x] Routine GitHub publication은 body-file로 수행
