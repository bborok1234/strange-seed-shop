## 문제 / 배경

`$seed-ops`가 두 issue loop를 완료한 뒤 멈춘 원인은 기능 구현 실패가 아니라 운영 gate의 누락이었다. 기존 계약은 "완료 보고는 중단 조건이 아니라 checkpoint"라고 말했지만, assistant `final` 응답 자체가 세션을 닫는 terminal action이라는 점을 명시하지 않았다. 또한 "다음 queue 후보를 문서에 남김"을 실제 continuation으로 오인할 수 있었다.

## 목표

`$seed-ops`가 stop rule 없이 issue completion 뒤 assistant `final`로 멈추지 못하게 한다. 완료 요약은 commentary checkpoint로만 허용하고, 실제 continuation은 다음 issue의 plan artifact가 존재해야 인정한다.

## Small win

- 이번 issue가 만들 가장 작은 승리: `seed-ops` 운영 계약과 자동 검사에 `No-final continuation gate`를 추가한다.

GitHub issue: #248

## Game Studio route

- Umbrella: N/A — 운영사 계약/검증 스크립트 수정이며 게임 기능/UI/에셋/QA issue가 아니다.
- Specialist route: N/A — 게임 화면 변경 없음.
- 북극성/플레이어 동사: 운영사 북극성. agent가 issue loop 이후 다음 plan-first 작업으로 실제 계속 진행한다.
- Playfield 보호 또는 UI surface 원칙: N/A.
- Playtest evidence 계획: N/A — Browser Use 대상 UI 변경 없음. 운영 gate와 CI로 검증한다.

## Plan

- 구현 전 작성/검토할 plan artifact: `items/0126-seed-ops-no-final-continuation-gate.md`
- 예상 변경 단계:
  - `seed-ops` skill에 no-final continuation gate 추가.
  - project commands, autonomous operating model, runbook, AGENTS에 같은 계약 반영.
  - `check:seed-ops-queue`가 no-final gate phrase를 검사하도록 확장.
  - roadmap/dashboard/control room/heartbeat 갱신.
- 검증 계획:
  - `npm run check:seed-ops-queue`
  - `npm run check:project-commands`
  - `npm run check:ops-live`
  - `npm run check:dashboard`
  - `npm run check:ci`
- 건드리지 않을 범위:
  - 게임 runtime/UI/HUD/playfield/asset/economy.
  - branch protection, automerge, 외부 배포, credential.

## 플레이어 가치 또는 운영사 가치

- 게임 가치: `$seed-ops`가 임의 종료하지 않아 production vertical slice queue가 끊기지 않는다.
- 운영사 가치: 다음 issue plan artifact가 없으면 완료 후 종료를 통과시킬 수 없게 된다.

## 수용 기준

- [x] `$seed-ops` 문서가 assistant `final` 응답을 terminal action으로 명시한다.
- [x] stop rule 없이 final 응답을 보내는 것을 금지한다.
- [x] `left the next queue candidate is not continuation` 계약을 문서화한다.
- [x] `next issue plan artifact exists`가 continuation 인정 조건으로 문서화된다.
- [x] `check:seed-ops-queue`가 위 계약 phrase를 검사한다.
- [x] 검증 명령이 통과한다.

## Visual evidence 계획

- Before screenshot: N/A — UI 변경 없음.
- After screenshot: N/A — UI 변경 없음.
- Browser Use 우선 QA 계획 또는 N/A 사유: N/A — 운영 문서와 검사 스크립트 변경이다.
- N/A 사유: 게임 화면을 바꾸지 않는다.

## Playable mode 영향

- [x] 사람이 `npm run play:main`으로 main 게임을 계속 실행할 수 있다.
- 변경 확인 URL/port: N/A — playable runtime 변경 없음.

## 안전 범위

- 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음.
- Branch protection 우회 없음.

## 검증 명령

- 기본 CI gate: `npm run check:ci`
- UI/visual 변경: N/A — 운영 문서/스크립트 변경.

## 검증 결과

- PASS: `npm run check:seed-ops-queue`
- PASS: `npm run check:project-commands`
- PASS: `npm run check:ops-live`
- PASS: `npm run check:dashboard`
- PASS: `npm run check:ci`
