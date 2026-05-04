# WorkUnit #364 — album 탭에 P0.5 진행도 milestones 카드를 더해 player progression long-term meta hint를 anchor한다

## GitHub authority

- GitHub issue: #364 https://github.com/bborok1234/strange-seed-shop/issues/364
- Branch: `codex/0184-album-p05-milestones-progress`
- Campaign source of truth: P0.5 Idle Core + Creative Rescue
- Runner decision: `production-game-intake-required` after #362 main CI `25305311339` success and queue empty
- Status: plan-first

## 문제 / 배경

10개의 chain handoff arc + production engine readability slices가 merged되었지만, player가 자기 진행도(전체 phase에서 어디쯤 와있나?)를 한 화면에서 볼 수 있는 long-term meta hint surface는 비어 있다. 도감의 album-progress-copy는 "미발견 슬롯의 단서를 따라 ..." 안내만 있고, 큰 그림 milestone progression은 player perception에 누적되지 않는다.

North Star의 "장기 메타의 silhouette" axis: Phase 0라도 player가 "내가 지금 어디?"를 확인할 visible structure가 필요하다.

## 목표

album 탭의 album-progress-copy 직후에 `.phase05-milestones-card` 추가. 6개 P0.5 milestone(첫 생명체 발견 / 두 번째 주문 완료 / 작업대 강화 / 달빛 온실 설립 / 단골 시퀀스 마침 / 달빛 손님 발견)을 grid 2-col list로 표시. 각 milestone은 ✓ 또는 · 마크로 done/pending 상태 표시. 헤더에 "X/Y 단계 완료" 진행 카운트.

## Plan

1. App component 스코프에 `phase05Milestones` 배열 + `phase05MilestonesDone` count 파생.
2. album section의 album-progress-copy 직후 `.phase05-milestones-card` 카드 렌더.
3. CSS: `.phase05-milestones-card` flex column, 2-col grid for milestones list, ✓/· marker styling.
4. Build + 기존 album regression 통과.

## 수용 기준

- [ ] album 탭 진입 시 6개 milestone 모두 보인다.
- [ ] save가 fresh이면 모두 pending(·), milestone done이면 ✓로 색이 바뀐다.
- [ ] 헤더 "X/Y 단계 완료" 카운트가 정확하다.
- [ ] 393px 모바일에서 카드가 layout overflow 없이 렌더된다.

## 검증 명령

- `npm run build`
- 기존 album/playfield regression 통과 보장.
- `npm run check:ci` 외 mirror gates.

## 리스크

- album 탭 layout이 milestone 카드 추가로 overflow할 수 있다 → flex grid 2-col + 9px 폰트로 컴팩트 처리, scroll 계약 유지.

## Subagent/Team Routing

- 기본은 solo execution.
