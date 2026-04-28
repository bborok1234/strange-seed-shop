# Operator control room and playable mode

Status: review
Owner: agent
Created: 2026-04-28
Updated: 2026-04-28
Scope-risk: moderate
Work type: agent_ops
Issue: #87
Branch: codex/operator-control-room

## Intent

4h trial과 heartbeat hardening은 자동화가 실제로 잘 돌아감을 보여줬지만, 사람이 중간에 현재 목표·small win·결과·스크린샷·게임 실행 방법을 한눈에 보기 어려웠다. 24h dry run 전에 운영 상황판과 사람 플레이 모드를 고정한다.

## Acceptance Criteria

- `docs/OPERATOR_CONTROL_ROOM.md`가 active mission, small win, evidence, visual delta, playable status, next safe stop을 정의한다.
- issue/PR 템플릿에 한국어 우선 small win, visual evidence, playable mode 섹션이 있다.
- `docs/PLAYABLE_MODE.md`와 `npm run play:main`이 agent branch와 분리된 `origin/main` worktree 실행 방법을 제공한다.
- `npm run operator:control-room`이 현재 local/GitHub 상태와 playable mode 명령을 출력한다.
- `npm run check:control-room`, `npm run check:operator`, `npm run check:all`이 통과한다.
- 24h dry run은 이 작업이 merge되기 전 시작하지 않는다.

## Evidence

- Issue #87: https://github.com/bborok1234/strange-seed-shop/issues/87
- Control room: `docs/OPERATOR_CONTROL_ROOM.md`
- Playable mode: `docs/PLAYABLE_MODE.md`
- Research note: `reports/research/agent_operator_control_room_research_20260428.md`
- Templates: `.github/ISSUE_TEMPLATE/agent-work-item.md`, `.github/pull_request_template.md`
- Scripts: `scripts/operator-control-room.mjs`, `scripts/prepare-playable-main.mjs`, `scripts/check-operator-control-room.mjs`

## Apply Conditions

- 실제 고객 데이터, credential, 결제, 로그인/account, ads SDK, external deployment, 실채널 GTM을 건드리지 않는다.
- `ENABLE_AGENT_AUTOMERGE`를 켜지 않는다.
- Branch protection과 required checks를 우회하지 않는다.
- UI 변화가 없으면 visual evidence는 `N/A — UI 변화 없음`으로 기록한다.

## Verification

- `npm run check:control-room`
- `npm run operator:control-room -- --output reports/operations/operator-control-room-20260428.md`
- `npm run check:operator`
- `npm run check:all`
- Playable mode smoke: `npm run play:main:install`, Vite on `127.0.0.1:5174`, HTTP GET `/` PASS
