## 요약

#374는 album_1 한 단계만 있던 도감 milestone 체인에 album_2(5마리 도감)을 추가하고 +50 잎 보상을 도입합니다. firstAlbumRewardReady 패턴을 mirror해 secondAlbumRewardReady + claimSecondAlbumReward + UI button 추가. P0.5 진행도 카드(#364)에도 album_2 항목이 추가되어 player가 다음 collection 목표를 한 화면에서 본다.

## Small win

5마리 도감 collection이 명확한 보상 목표로 잡혀 player의 collection desire가 다음 단계로 이어진다.

## Before / After

- Before: album_1 한 단계만 존재. 5마리 이상 모아도 추가 보상 없음.
- After: 5마리 발견 시 "두 번째 도감 보상 받기 +50 잎" 버튼 등장. claim 시 +50 잎 + claimedAlbumMilestoneIds.push("album_2"). 진행도 카드에 album_2 마크.

## 검증

- [x] `npm run build`
- [x] `npm run check:ci`
- [x] mirror gates 통과
- [x] Browser Use iab attempt or blocker

## 안전 범위

- 신규 manifest asset 없음.
- save 호환: claimedAlbumMilestoneIds 배열에 album_2 push만 됨.

## 연결된 issue

Closes #374
