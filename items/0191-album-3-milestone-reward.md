# WorkUnit #376 — album_3 milestone(도감 완성) 보상 +100 잎을 도입한다

## GitHub authority

- GitHub issue: #376 https://github.com/bborok1234/strange-seed-shop/issues/376
- Branch: `codex/0191-album-3-milestone-reward`
- Status: plan-first

## 문제 / 배경

#374가 album_2(5마리 도감 → 50 잎) milestone을 추가했지만 도감 완성(9마리 모두 발견)에 대한 최종 보상은 없다. collection ladder의 정상에 명확한 보상 목표가 없으면 player가 끝까지 모을 동기가 약하다.

## 목표

album_3 milestone 도입. 모든 9마리 발견 시 100 잎 보상을 claim 가능. mirror album_1/album_2 패턴.

## Plan

1. `thirdAlbumRewardReady` 파생.
2. `claimThirdAlbumReward()` 함수 추가.
3. UI: "도감 완성 보상 받기 +100 잎" primary-action 버튼.
4. phase05Milestones 배열에 `album_3` 항목 추가.

## 수용 기준

- [ ] 9마리 발견 시 thirdAlbumRewardReady=true.
- [ ] claim 시 +100 잎 + claimedAlbumMilestoneIds에 push.
- [ ] P0.5 진행도 카드에 album_3 마크 표시.
- [ ] save 호환.

## 검증 명령

- `npm run build`
- 기존 regression 통과.
- mirror gates.

## Subagent/Team Routing

- 기본은 solo execution.
