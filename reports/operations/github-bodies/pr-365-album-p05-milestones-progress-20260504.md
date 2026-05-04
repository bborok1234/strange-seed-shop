## 요약

#364는 album 탭의 album-progress-copy 직후 `.phase05-milestones-card`를 추가합니다. 6개 P0.5 milestone(첫 생명체 발견 / 두 번째 주문 완료 / 작업대 강화 / 달빛 온실 설립 / 단골 시퀀스 마침 / 달빛 손님 발견)을 2-col grid로 표시하며, 각 항목은 ✓ 또는 · 마커로 done/pending 상태를 보여줍니다. 헤더에 "X/6 단계 완료" 진행 카운트.

## Small win

player가 album 탭에서 자기 P0.5 진행도를 한 화면에서 확인해 long-term meta hint axis가 visible해진다.

## 사용자/운영자 가치

- 사용자: chain handoff arc(#344→#362) 누적 효과의 player perception이 "단골 시퀀스 마침"/"달빛 온실 설립" 등 milestone 형태로 album에 축적되어 보인다.
- 운영자: P0.5 phase의 player progression이 visible한 surface로 누적되어 long-term meta hint axis(North Star B5)를 한 칸 채운다.

## Before / After 또는 Visual evidence

- Before: album 탭은 album-progress-copy + creature grid + next-creature-goal만 표시. 전체 phase 진행도(facility/storage/irrigation/mist 어디까지 갔는지) 시각 surface 부재.
- After: 6 milestone 카드가 ✓/· 마커로 player의 phase 진행도를 한 화면에서 보여준다. 헤더에 "X/6 단계 완료" 카운트. 카드는 chain handoff arc(facility green tone)와 일관된 톤(`rgba(168, 218, 132, ...)`).
- Browser Use: current-session iab discovery 실패 기록 `reports/visual/browser-use-blocker-0364-20260504.md`.

## 검증

- [x] `npm run build`
- [x] `npm run check:ci`
- [x] `npm run check:ops-live`
- [x] mirror gates 통과

## 안전 범위

- 신규 accepted manifest asset 없음. existing tone palette + DOM/CSS만 사용.
- runtime image generation/API 호출 없음.
- save 호환: 신규 state 없음, save schema 변경 없음.

## 남은 위험

- milestone 카드의 시각 확인은 visual inspection으로 수행. 자동화 regression 추가는 후속 WorkUnit에서 추적.
- 향후 Phase 1 콘텐츠 추가 시 milestone 목록 확장이 필요 — 현재는 P0.5 한정.

## 연결된 issue

Closes #364

## 작업 checklist

- [x] Game Studio route 기록
- [x] Plan-first artifact: `items/0184-album-p05-milestones-progress.md`
- [x] Visual evidence 또는 current-session blocker 기록
- [x] Build + CI/ops/mirror gates 통과
- [x] Routine GitHub publication은 body-file로 수행
