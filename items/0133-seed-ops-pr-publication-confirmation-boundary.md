# Seed ops PR publication confirmation boundary

Status: verified
Owner: agent
Created: 2026-05-01
Updated: 2026-05-01
Work type: agent_ops
Scope-risk: narrow

## Intent

`$seed-ops`가 Codex App의 PR 생성 action-time confirmation 경계에서 `final`로 멈추는 회귀를 막는다. PR/issue/comment 게시 확인이 필요한 상황은 safety gate지만, 운영모드 종료 신호가 아니어야 한다.

## Plan

1. `$seed-ops` skill, project command 문서, 운영 모델, runbook, AGENTS에 `PR publication confirmation boundary`를 정의한다.
2. 이 경계가 `final response is terminal` 예외가 아니며 `do not send final just to ask for PR creation`임을 명시한다.
3. 확인 대기 시 `pending external-publication gate` report와 `next local safe work` 기록을 요구한다.
4. `scripts/check-seed-ops-queue-gate.mjs`와 control room/live checker가 이 문구를 검사하게 만든다.
5. Roadmap, PR body, 운영 보고서를 갱신하고 로컬 검증을 통과시킨다.

## Acceptance Criteria

- [x] 핵심 운영 문서가 `PR publication confirmation boundary`, `action-time confirmation`, `This is not a terminal stop`, `do not send final just to ask for PR creation`, `pending external-publication gate`, `next local safe work`를 포함한다.
- [x] `npm run check:seed-ops-queue`가 위 문구 누락을 실패로 잡는다.
- [x] `docs/OPERATOR_CONTROL_ROOM.md` 생성 결과에도 같은 경계가 보인다.
- [x] Issue #260 PR body가 이 corrective fix를 포함한다.
- [x] `npm run check:ci`가 통과한다.

## Verification Commands

```bash
npm run check:seed-ops-queue
npm run check:ops-live
npm run check:dashboard
npm run check:ci
```

## Risk / Out of Scope

- GitHub PR 생성 자체는 Codex App action-time confirmation 경계가 남아 있다.
- 이 작업은 운영 계약과 checker hardening만 바꾸며 게임 runtime, save schema, 결제, 로그인, 외부 배포, 고객 데이터, 실채널 GTM은 건드리지 않는다.

## Evidence

- Draft PR: #265 `https://github.com/bborok1234/strange-seed-shop/pull/265`
- `reports/operations/seed-ops-pr-publication-confirmation-boundary-20260501.md`
- `.codex/skills/seed-ops/SKILL.md`
- `docs/PROJECT_COMMANDS.md`
- `docs/AUTONOMOUS_PROJECT_OPERATING_MODEL.md`
- `docs/OPERATOR_RUNBOOK.md`
- `scripts/check-seed-ops-queue-gate.mjs`

## Verification

- `npm run check:seed-ops-queue` pass
- `npm run check:ops-live` pass
- `npm run check:dashboard` pass
- `npm run check:ci` pass
- PR #265 checks pass:
  - Check automerge eligibility: `https://github.com/bborok1234/strange-seed-shop/actions/runs/25219403256/job/73947597649`
  - Verify game baseline: `https://github.com/bborok1234/strange-seed-shop/actions/runs/25219403267/job/73947597333`
