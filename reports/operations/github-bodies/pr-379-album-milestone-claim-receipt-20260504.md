## 요약

#378은 album_1/2/3 reward claim 직후 1.8초 "도감 마일스톤 +X 잎" reveal receipt를 production card에 표시합니다. 골드 톤(`rgba(214, 156, 80, ...)`)으로 collection achievement를 시각화. fireAlbumMilestoneClaimReceipt 헬퍼를 도입해 3개 claim 함수에서 공유.

## Small win

도감 마일스톤 claim moment가 시각적 celebration으로 마무리되어 player perception에 collection 보상이 누적된다.

## 검증

- [x] `npm run build`
- [x] mirror gates 통과
- [x] Browser Use iab attempt or blocker

## 안전 범위

- 신규 manifest asset 없음.
- save 호환: 변경 없음.

## 연결된 issue

Closes #378
