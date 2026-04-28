# 0018 Dual north star and agent-native studio milestones

Status: verified
Owner: agent
Created: 2026-04-28
Updated: 2026-04-28
Scope-risk: narrow

## Intent

`이상한 씨앗상회` 게임 프로젝트와 에이전트 네이티브 게임 스튜디오/운영사 프로젝트가 현재 한 레포에 공존하지만, 장기적으로 분리될 수 있음을 최상위 문서에 고정한다.

## Acceptance Criteria

- `docs/NORTH_STAR.md`가 게임 북극성과 운영사 북극성을 분리해서 정의한다.
- `AGENTS.md` required reading order가 `docs/NORTH_STAR.md`를 가리킨다.
- `docs/README.md` current source of truth에 `NORTH_STAR.md`가 등록된다.
- `docs/ROADMAP.md`가 Ralph-session 운영사에서 24시간 운영사까지 단계별 마일스톤을 갖는다.
- `npm run check:docs`와 `npm run check:all`이 통과한다.

## Evidence

- `docs/NORTH_STAR.md`
- `docs/ROADMAP.md` Milestone 6-9
- `.omx/logs/north-star-post-architect-check-all-20260428T012734Z.log`
- Architect verification: APPROVE, blocking issue 없음
- Draft PR: https://github.com/bborok1234/strange-seed-shop/pull/23

## Verification

- `npm run check:docs` PASS
- `npm run check:dashboard` PASS
- `npm run check:all` PASS
