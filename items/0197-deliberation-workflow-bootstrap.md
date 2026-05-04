# WorkUnit — Game Studio deliberation workflow bootstrap

## GitHub authority

- PR: #388 https://github.com/bborok1234/strange-seed-shop/pull/388
- Branch: `studio/deliberation-workflow-bootstrap`
- Status: spec-first (deliberation pilot, no implementation)

## Plan

본 WorkUnit은 **process-only**다. 게임 코드는 변경 0. canonical plan은 `docs/studio/plans/0001-deliberation-workflow-bootstrap.md` 참조.

1. `docs/studio/` 안에 5 페르소나 + DELIBERATION_WORKFLOW.md + spec template + plan 작성.
2. `.claude/skills/studio-deliberate/SKILL.md` Claude Code adapter 작성.
3. `desktop-ui-redesign` axis 첫 dogfood — Phase 2 proposal × 3 + Phase 3 critique × 4 + Director 합성 spec.md.
4. `mission-ux-visibility` axis 두 번째 dogfood로 skill 안정성 검증.
5. retrospective + memory 저장.

## 수용 기준

- [x] `docs/studio/` source-of-truth 7 파일 작성
- [x] `/studio-deliberate` skill 등록
- [x] 2 axis spec.md 사용자 review 통과
- [x] retrospective 기록 + 개선사항 두 번째 axis에서 자동 작동 검증
- [x] heartbeat closure entry 추가
- [x] PR open

## 검증 명령

- `npm run build`
- `npm run check:ci`

## 리스크

- 첫 dogfood라 페르소나 prompt 진화 필요 가능성 — retrospective.md에 기록.
- studio-operate autonomous loop은 본 WorkUnit 동안 paused.

## 후속 axis

- Cycle 1 implementation (별도 plan)
- 7개 follow-up axis (`garden-scene-anchor-adjustment` 등) — spec.md § Implementation Sequence 참조

## Subagent/Team Routing

- Phase 2/3은 4 general-purpose subagent 병렬. Director 합성은 main thread.
- 본 axis 종료 후 `/studio-deliberate` skill로 다음 axis 운영.
