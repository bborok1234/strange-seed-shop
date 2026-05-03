# #286 GitHub 게시가 final 확인 대기로 멈추지 않게 하네스를 고정한다

- 상태: `planned`
- GitHub issue: #286 `GitHub 게시가 final 확인 대기로 멈추지 않게 하네스를 고정한다`
- Branch: `codex/0286-routine-github-publication-no-final`
- WorkUnit authority: GitHub issue/PR/GateEvent. local docs/reports는 evidence mirror다.
- Game Studio route: N/A — 운영사 하네스/문서/체커 작업이며 visible gameplay, HUD, playfield, asset 변경 없음.

## Problem statement

#284/#285 진행 중 agent가 routine GitHub issue/PR/comment publication을 final 확인 대기로 멈췄다. `$seed-studio force` 계약에서 GitHub issue 생성/수정, PR 생성/수정, comment 게시, checks 확인, merge는 agent responsibility이며 checkpoint다. final publication ask는 terminal action이라 운영사 무한 루프를 깨뜨린다.

## Plan

1. 현재 publication gate 문서/체커가 `confirmation.required: true` 또는 `await action-time confirmation`을 정상 경로로 남기는 지점을 고친다.
2. routine GitHub publication은 `preauthorized` 또는 tool-executed responsibility이고, PublicationBoundary는 credential/tool/runtime이 실제로 막을 때만 적용한다고 문서화한다.
3. checker fixture에 self-imposed wait regression을 추가해 `await action-time confirmation without repeated ask`가 routine GitHub publication에서 실패하도록 만든다.
4. #284/#285 회귀 evidence report를 남긴다.
5. focused checker와 `npm run check:ci`를 통과시킨다.

## 수용 기준

- [ ] docs/PROJECT_COMMANDS.md, docs/OPERATOR_RUNBOOK.md, docs/AUTONOMOUS_PROJECT_OPERATING_MODEL.md, .codex/skills/seed-ops/SKILL.md가 routine GitHub issue/PR/comment publication은 agent responsibility이며 self-imposed confirmation wait로 멈추면 안 된다고 명시한다.
- [ ] scripts/check-seed-ops-publication-gate-state.mjs fixture가 `confirmation.channel: preapproved` 또는 실제 tool-blocked boundary를 기준으로 갱신된다.
- [ ] `await action-time confirmation without repeated ask`가 routine GitHub publication continuation으로 쓰이면 checker가 실패한다.
- [ ] #284/#285 final publication ask 회귀가 report evidence에 기록된다.
- [ ] `npm run check:seed-ops-publication-gate`, `npm run check:ops-live`, `npm run check:ci`가 통과한다.

## 검증 명령

- `npm run check:seed-ops-publication-gate`
- `npm run check:ops-live`
- `npm run check:ci`

## 리스크와 롤백

- 리스크: 실제 credential/tool/runtime blocker까지 무시하면 안 된다. 문구는 self-imposed GitHub publication wait만 금지하고 credential/destructive/external-production boundary는 유지한다.
- 롤백: #286 문서/체커 변경 commit을 되돌리면 기존 publication gate 모델로 돌아간다.
