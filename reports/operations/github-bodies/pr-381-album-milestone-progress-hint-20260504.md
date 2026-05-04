## 요약

#380은 P0.5 진행도 카드의 album_2/album_3 milestone label에 미완료 시 "(X/5)" 또는 "(X/9)" progress 카운트를 인라인 표시합니다. claim 후에는 카운트가 사라져 깔끔한 마일스톤 명칭만 남습니다.

## Small win

album collection 진행도가 milestones card에서 즉시 보여 player가 "지금 몇 마리 모았지?"를 한 화면에서 인지한다.

## Before / After

- Before: album_2 미완료 시 단순 "·" 마크 + "5마리 도감 마일스톤" label만.
- After: 미완료 시 "5마리 도감 마일스톤 (3/5)" 같은 progress 카운트 인라인 표시. 9마리도 동일.

## 검증

- [x] `npm run build`
- [x] mirror gates 통과
- [x] Browser Use iab attempt or blocker

## 안전 범위

- 신규 manifest asset 없음.
- save 호환: 변경 없음.

## 연결된 issue

Closes #380
