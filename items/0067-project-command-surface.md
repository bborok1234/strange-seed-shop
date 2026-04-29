# Project command surface

Status: active
Work type: agent_ops
Issue: #117
Owner: agent
Created: 2026-04-29
Updated: 2026-04-29
Scope-risk: narrow

## Intent

운영모드, 보고/상황판, 설계 대화, 실기 QA, 사람 플레이 준비가 같은 대화 흐름에 섞이면 에이전트가 언제 무한 루프를 계속해야 하는지와 언제 사용자와 설계/보고 대화를 해야 하는지 헷갈린다. 이 프로젝트만의 명령어를 만들어 `$ralph` 같은 범용 엔진 위에 이상한 씨앗상회 운영사 계약을 얹는다.

## Small win

`$seed-ops`, `$seed-brief`, `$seed-design`, `$seed-qa`, `$seed-play`를 project-local skill과 문서로 고정해, 무한 작업 루프와 사용자 대화 세션을 명확히 구분한다.

## Plan

1. `docs/PROJECT_COMMANDS.md`에 명령별 목적, 허용 행동, 금지 행동, 종료 조건을 정의한다.
2. `.codex/skills/seed-ops`, `seed-brief`, `seed-design`, `seed-qa`, `seed-play`의 `SKILL.md`를 추가한다.
3. `AGENTS.md`와 `docs/README.md`에서 프로젝트 전용 명령을 인덱스한다.
4. `scripts/check-project-commands.mjs`와 `package.json` script를 추가하고 `check:all`에 포함한다.
5. `docs/ROADMAP.md`와 `docs/DASHBOARD.md`를 Issue #117 기준으로 갱신한다.

## Acceptance Criteria

- 다섯 project-local skill이 모두 존재하고 각 skill description이 트리거 경계를 명확히 한다.
- `docs/PROJECT_COMMANDS.md`가 운영모드와 설계/보고/QA/playable 세션을 구분한다.
- `AGENTS.md`가 `$seed-ops`를 장시간 운영모드의 프로젝트 전용 진입점으로 가리킨다.
- `npm run check:project-commands`와 `npm run check:all`이 통과한다.

## Evidence

- Issue: #117
- Verification:
  - `npm run check:project-commands` — pass
  - `npm run check:docs` — pass
  - `npm run check:dashboard` — pass
  - `npm run check:all` — pass

## Apply Conditions

- 제품 UI/게임 로직을 변경하지 않는다.
- 실제 6h/24h 실행을 이 issue 안에서 새로 시작하지 않는다.
- 결제, 로그인, 광고, 외부 배포, 고객 데이터, 실채널 GTM은 건드리지 않는다.

## Verification

- `npm run check:project-commands`
- `npm run check:docs`
- `npm run check:dashboard`
- `npm run check:all`
