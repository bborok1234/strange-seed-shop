# Idle core creative rescue source of truth

Status: active
Work type: game_feature
Issue: #119
Owner: agent
Created: 2026-04-29
Updated: 2026-04-29
Scope-risk: narrow

## Intent

세션 중 `이상한 씨앗상회`가 아직 production급 idle game으로 플레이 가능한 수준이 아니며, 운영사 인프라보다 게임 core, 디자인, 에셋, 재미를 함께 끌어올려야 한다는 방향 전환이 있었다. 기획도 source of truth 변경이므로 GitHub issue/PR/main merge 루프로 고정한다.

## Small win

`docs/IDLE_CORE_CREATIVE_GUIDE.md`와 `docs/SESSION_HANDOFF_20260429.md`를 추가하고, `docs/README.md`와 `docs/ROADMAP.md`가 다음 안전 작업을 P0.5 idle core creative rescue로 가리키게 한다.

## Plan

1. 세션 중 작성한 idle core creative guide와 handoff 문서를 source of truth 문서로 정리한다.
2. `docs/README.md`에 새 문서를 색인한다.
3. `docs/ROADMAP.md`에 P0.5 Idle Core + Creative Rescue 마일스톤과 Current Next Action을 추가한다.
4. 작업 종료 문서 갱신 규칙을 `docs/PROJECT_COMMANDS.md`, `docs/OPERATOR_RUNBOOK.md`, `AGENTS.md`에 고정한다.
5. `npm run check:docs`, `npm run check:dashboard`로 문서 index와 dashboard 갱신을 검증한다.
6. PR을 만들고 GitHub checks/main CI까지 확인한다.

## Acceptance Criteria

- `docs/IDLE_CORE_CREATIVE_GUIDE.md`가 core loop, production UI, asset bible, Codex vertical-slice workflow를 포함한다.
- `docs/SESSION_HANDOFF_20260429.md`가 새 세션이 읽을 재개 순서와 다음 `$seed-ops` 작업을 명시한다.
- `docs/ROADMAP.md`의 Current Next Action이 P0.5 idle core creative rescue를 가리킨다.
- 작업 종료 시 `items/<id>.md`, `docs/ROADMAP.md`, `docs/DASHBOARD.md`, GitHub issue/PR evidence를 갱신해야 한다는 지침이 문서화된다.
- `npm run check:docs`, `npm run check:dashboard`, PR checks, main CI가 통과한다.

## Evidence

- Issue: #119
- Verification:
  - `npm run check:docs` — pass
  - `npm run check:dashboard` — pass
  - `npm run check:project-commands` — pass
  - `npm run check:all` — pass

## Apply Conditions

- 게임 런타임/UI/에셋 구현은 이번 issue에서 하지 않는다.
- 운영사 provider-portability/OMX 제거 확장은 이번 issue에서 하지 않는다.
- 결제, 로그인, 광고, 외부 배포, 고객 데이터, 실채널 GTM은 건드리지 않는다.

## Verification

- `npm run check:docs`
- PR checks
- main CI
