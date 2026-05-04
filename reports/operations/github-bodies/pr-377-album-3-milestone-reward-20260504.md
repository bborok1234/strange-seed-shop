## 요약

#376은 #374의 album_2 패턴을 mirror해 album_3(도감 완성, 9마리 모두 발견)을 도입합니다. claim 시 +100 잎 보상. UI에 "도감 완성 보상 받기 +100 잎" 버튼 + #364 진행도 카드에 album_3 마크 추가. album_1 → album_2 → album_3 collection ladder 완성.

## Small win

도감 완성에 명확한 최종 보상 목표가 잡혀 player가 끝까지 모을 동기가 강해진다.

## Before / After

- Before: album_2까지만 존재. 9마리 모두 모아도 추가 보상 없음.
- After: 모든 9마리 발견 시 thirdAlbumRewardReady=true, 버튼 등장. claim 시 +100 잎.

## 검증

- [x] `npm run build`
- [x] mirror gates 통과
- [x] Browser Use iab attempt or blocker

## 안전 범위

- 신규 manifest asset 없음.
- save 호환: claimedAlbumMilestoneIds 배열에 album_3 push만 됨.

## 연결된 issue

Closes #376
