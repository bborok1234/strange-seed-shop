# Studio Harness v3 24h live runner 진입점을 만든다

## 문제 / 배경

우리의 1차 목표는 AI 네이티브 게임 운영사를 만드는 것이다. 이 운영사는 24시간 돌아가면서 GitHub issue/PR/GateEvent를 operational truth로 삼고, `이상한 씨앗상회`를 production 게임 품질로 계속 개선해야 한다. #276은 fixture 기반 deterministic checker였지만, 사람이 쓸 수 있는 24h live runner 진입점과 실행법은 아직 부족하다.

## 목표

Studio Harness v3를 실제 운영 명령으로 시작할 수 있는 live runner entrypoint를 만든다. 이 runner는 GitHub open issue/PR 상태를 읽고, heartbeat/control-room/report를 남기며, queue가 비었을 때 production 게임 WorkUnit intake를 제안/생성할 수 있는 다음 행동을 명확히 한다.

## Small win

- 이번 issue가 만들 가장 작은 승리: `npm run studio:v3:runner -- --once --dry-run`이 GitHub queue/PR/main 상태를 읽고 `.omx/state/studio-v3-live-runner.json`과 `reports/operations/studio-v3-live-runner-*.md` evidence를 남긴다.

## Game Studio route

- Umbrella: N/A — 운영사 runner/workflow 작업이다.
- Specialist route: N/A
- 게임 품질 연결: queue가 비면 다음 WorkUnit은 `P0.5 Idle Core + Creative Rescue`와 production game quality gate를 우선해야 한다.
- Playtest evidence 계획: runner 자체는 UI 변경 없음. runner가 생성/선택하는 visible gameplay WorkUnit은 별도 Game Studio route와 Browser Use evidence를 요구한다.

## Plan

- 구현 전 plan artifact: `items/0147-studio-v3-24h-live-runner.md`
- Branch: `codex/0290-studio-v3-24h-live-runner`

## 플레이어 가치 또는 운영사 가치

- 운영사 가치: 사람이 매번 “다음 뭐 해?”를 말하지 않아도 runner가 queue/PR/CI 상태를 읽고 다음 legal action을 evidence로 남긴다.
- 게임 가치: queue empty가 멈춤이 아니라 production 게임 품질 WorkUnit intake로 이어진다.

## 수용 기준

- [ ] `npm run studio:v3:runner -- --once --dry-run` runnable entrypoint가 생긴다.
- [ ] runner가 GitHub open issues/open PRs/latest main commit/check state를 읽고 state/report artifact를 남긴다.
- [ ] runner가 queue empty를 stop이 아니라 production game WorkUnit intake/reconcile action으로 분류한다.
- [ ] `npm run check:studio-v3-live-runner`가 dry-run fixture/smoke를 검증하고 `npm run check:ci`에 포함된다.
- [ ] `docs/STUDIO_HARNESS_V3_RUNNER_USAGE.md` 또는 동등 문서에 24h 실행/중단/관찰 명령이 있다.

## Visual evidence 계획

- N/A — runner/docs/scripts-only change. Browser Use 대상이 아니다.

## Playable mode 영향

- 게임 runtime code를 직접 변경하지 않는다. runner가 다음 game WorkUnit을 만들 때 `npm run play:main`과 Browser Use/visual evidence를 별도 요구한다.

## 안전 범위

- 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음.
- `--dry-run` 기본값은 GitHub mutation 없이 state/report만 남긴다.
- 실제 GitHub issue/PR 생성은 runner policy가 허용하고 credentials/tools가 있을 때만 수행한다.

## 검증 명령

- `npm run studio:v3:runner -- --once --dry-run`
- `npm run check:studio-v3-live-runner`
- `npm run check:ci`
