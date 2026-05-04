# WorkUnit #374 — album_2 milestone(5마리 도감) 보상 +50 잎을 도입한다

## GitHub authority

- GitHub issue: #374 https://github.com/bborok1234/strange-seed-shop/issues/374
- Branch: `codex/0190-album-2-milestone-reward`
- Campaign source of truth: P0.5 Idle Core + Creative Rescue
- Status: plan-first

## 문제 / 배경

`album_1`(첫 생명체 발견 → +25 잎)이 유일한 album milestone이다. #364가 추가한 P0.5 진행도 카드에는 `album_2` 슬롯이 보이지만 실제 reward나 claim flow가 없었다. 즉, 첫 생명체 발견 후 도감 collection desire를 잇는 lever가 비어 있다. North Star B5(장기 메타 silhouette) 관점에서 player가 "다음 album 보상은 5마리 모으면" 같은 명확한 milestone을 보고 collection을 이어가야 한다.

## 목표

`album_2` milestone 도입. 5마리 도감 발견 시 50 잎 보상을 claim 가능. firstAlbumRewardReady 패턴 그대로 mirror하여 secondAlbumRewardReady + claimSecondAlbumReward + UI button 추가. P0.5 진행도 카드에도 `album_2` 항목 추가.

## Plan

1. `secondAlbumRewardReady = save.discoveredCreatureIds.length >= 5 && !save.claimedAlbumMilestoneIds.includes("album_2")` 파생.
2. `claimSecondAlbumReward()` 함수 추가 — 가드 후 claimedAlbumMilestoneIds에 push, leaves +50, trackEvent.
3. UI에 secondAlbumRewardReady 시 "두 번째 도감 보상 받기 +50 잎" primary-action 버튼 렌더.
4. phase05Milestones 배열에 `{ id: "album_2", label: "5마리 도감 마일스톤", done: claimedAlbumMilestoneIds.includes("album_2") }` 추가.
5. focused build + 기존 regression 통과.

## 수용 기준

- [ ] 5마리 발견 시 secondAlbumRewardReady=true, 버튼 등장.
- [ ] claim 시 +50 잎 + claimedAlbumMilestoneIds에 push.
- [ ] P0.5 진행도 카드에 album_2 마크 표시.
- [ ] save 호환: 기존 `claimedAlbumMilestoneIds: ["album_1"]` 형태에 `album_2` 추가만 됨.

## 검증 명령

- `npm run build`
- 기존 regression 통과.
- mirror gates.

## Subagent/Team Routing

- 기본은 solo execution.
