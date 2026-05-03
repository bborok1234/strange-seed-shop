# GitHub 게시가 final 확인 대기로 멈추지 않게 하네스를 고정한다

## 요약

#284/#285 진행 중 agent가 GitHub issue/PR/comment 게시를 routine Studio responsibility로 처리하지 않고 `final` 응답으로 확인 대기 상태를 만들었다. 이 레포에서는 사용자가 `$seed-studio force`로 명시한 대로 issue 생성/수정, PR 생성/수정, comment 게시, checks 확인, merge는 운영 루프의 정상 업무이며, 작업이 멈추면 Studio Harness v3 결함이다.

## 문제

- `final response is terminal` 계약을 깨고 PR publication confirmation ask가 작업 정지로 이어졌다.
- 기존 문서/체커는 `final` 채널 금지는 검사하지만, routine GitHub publication을 `confirmation.required: true`로 모델링하는 여지를 남긴다.
- `await action-time confirmation` 문구가 정상 fixture로 남아 있어 agent가 실제 GitHub 권한/도구가 있는데도 자체적으로 멈출 수 있다.

## 범위

- `$seed-ops` / Studio Harness v3 문서에서 routine GitHub publication은 preauthorized runner responsibility임을 더 강하게 고정한다.
- PublicationBoundary는 credential/tool/runtime이 실제로 막을 때만 사용하고, 단순 issue/PR/comment 게시 자체는 boundary가 아님을 명시한다.
- checker fixtures를 `preapproved/tool-continuation` 중심으로 바꾸고 `await action-time confirmation` self-stop 패턴을 실패로 잡는다.
- #284/#285의 final publication ask 재발을 regression evidence로 남긴다.

## 비범위

- GitHub credential 생성/권한 변경
- branch protection 우회 또는 admin merge
- 결제/광고/고객 데이터/외부 배포
- 게임 UI/asset 변경

## 수용 기준

- [ ] docs/PROJECT_COMMANDS.md, docs/OPERATOR_RUNBOOK.md, docs/AUTONOMOUS_PROJECT_OPERATING_MODEL.md, .codex/skills/seed-ops/SKILL.md가 routine GitHub issue/PR/comment publication은 agent responsibility이며 self-imposed confirmation wait로 멈추면 안 된다고 명시한다.
- [ ] scripts/check-seed-ops-publication-gate-state.mjs fixture가 `confirmation.channel: preapproved` 또는 실제 tool-blocked boundary를 기준으로 갱신된다.
- [ ] `await action-time confirmation without repeated ask`가 routine GitHub publication continuation으로 쓰이면 checker가 실패한다.
- [ ] #284/#285 final publication ask 회귀가 report 또는 item evidence에 기록된다.
- [ ] `npm run check:seed-ops-publication-gate`, `npm run check:ops-live`, `npm run check:ci`가 통과한다.

## 검증 명령

- `npm run check:seed-ops-publication-gate`
- `npm run check:ops-live`
- `npm run check:ci`

## 연결 evidence

- User report: 2026-05-03, `$seed-studio force` session 중 #284 PR publication ask가 final로 멈춤
- Related merged PR: #285
