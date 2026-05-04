# WorkUnit #380 — P0.5 진행도 카드의 album_2/album_3 milestone에 progress 카운트(X/Y)를 인라인 표시한다

## GitHub authority

- GitHub issue: #380 https://github.com/bborok1234/strange-seed-shop/issues/380
- Branch: `codex/0193-album-milestone-progress-hint`
- Status: plan-first

## 문제 / 배경

album_2(5마리), album_3(9마리 도감 완성) milestone은 claim 전 단계에서 단순 "·" 마크만 표시되고 progress 카운트가 없다. player가 "지금 몇 마리 모았지?"를 milestones card에서 직접 볼 수 없다.

## 목표

album_2/album_3 milestone label에 미완료 시 "(X/5)" 또는 "(X/9)" progress 카운트를 인라인 표시.

## Plan

1. phase05Milestones 배열에서 album_2/album_3 label을 done 상태별로 분기. 미완료 시 `(${discoveredCreatureIds.length}/N)` 카운트 추가.
2. claim 후 label에서 카운트 제거.
3. focused build + 기존 regression 통과.

## 수용 기준

- [ ] album_2 미완료 시 "5마리 도감 마일스톤 (X/5)" 표시.
- [ ] album_3 미완료 시 "도감 완성 마일스톤 (X/9)" 표시.
- [ ] claim 후 카운트 제거.

## Subagent/Team Routing

- 기본은 solo execution.
