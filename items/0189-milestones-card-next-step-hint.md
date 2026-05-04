# WorkUnit #372 — P0.5 진행도 카드 헤더에 "다음: <label>" 다음 milestone 힌트를 인라인 표시한다

## GitHub authority

- GitHub issue: #372 https://github.com/bborok1234/strange-seed-shop/issues/372
- Branch: `codex/0189-milestones-card-next-step-hint`
- Campaign source of truth: P0.5 Idle Core + Creative Rescue
- Status: plan-first

## 문제 / 배경

#364가 추가한 `.phase05-milestones-card`는 "X/6 단계 완료" 카운트와 6개 milestone 마크를 보여주지만, "이번에 다음으로 무엇을 해야 하나"는 명시되지 않는다. player가 카드를 보고 next-step을 즉시 인지하려면 첫 미완료 milestone label이 헤더에 인라인으로 보이는 것이 자연스럽다.

## 목표

`phase05Milestones` 배열에서 첫 미완료 milestone을 찾아 헤더에 `다음: <label>` chip으로 표시. 모두 완료된 경우 chip 표시하지 않음.

## Plan

1. `phase05NextMilestone = phase05Milestones.find((m) => !m.done) ?? null` 파생.
2. milestones-card 헤더에 chip 렌더(`phase05NextMilestone` 존재 시).
3. CSS: `.phase05-next-step-hint` chip 스타일.
4. Build + 기존 regression 통과.

## 수용 기준

- [ ] phase05NextMilestone 존재 시 chip이 헤더에 등장.
- [ ] 모두 완료 시 chip 미등장.
- [ ] 393px overflow 없음.

## 검증 명령

- `npm run build`
- 기존 regression 통과.
- mirror gates.

## Subagent/Team Routing

- 기본은 solo execution.
