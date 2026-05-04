# WorkUnit #378 — album_1/2/3 reward claim 직후 1.8s "도감 마일스톤 +X 잎" reveal motion을 표시한다

## GitHub authority

- GitHub issue: #378 https://github.com/bborok1234/strange-seed-shop/issues/378
- Branch: `codex/0192-album-milestone-claim-receipt`
- Status: plan-first

## 문제 / 배경

album_1/2/3 reward claim 시 `triggerRewardPulse()`만 호출되고 별도 visual moment가 없다. player가 milestone 보상을 받는 순간을 기념하는 receipt가 없어 collection 보상이 silent하게 흘러간다.

## 목표

album reward claim 직후 1.8s "도감 마일스톤 +X 잎" reveal receipt를 production card에 표시. 골드 톤(`rgba(214, 156, 80, ...)`)으로 collection achievement를 시각화.

## Plan

1. `AlbumMilestoneClaimReceipt` interface + state 추가.
2. `fireAlbumMilestoneClaimReceipt(milestoneId, leaves)` 헬퍼 추가.
3. claim 함수 3개에서 fireAlbumMilestoneClaimReceipt 호출.
4. production card에 receipt 렌더.
5. CSS: 골드 톤 receipt + 재사용 keyframe.

## 수용 기준

- [ ] album_1/2/3 claim 직후 receipt 1.8s 등장.
- [ ] 카피: "도감 마일스톤 / +X 잎 / N단계 보상 수령".
- [ ] auto unmount.

## Subagent/Team Routing

- 기본은 solo execution.
