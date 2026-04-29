# Session Handoff — 2026-04-29

Status: current-handoff
Owner: agent
Updated: 2026-04-29

## 바로 재개하는 방법

새 Codex/OMX 세션은 아래 순서로 읽는다.

1. `AGENTS.md`
2. `docs/README.md`
3. `docs/PROJECT_COMMANDS.md`
4. `docs/NORTH_STAR.md`
5. `docs/ROADMAP.md`
6. `docs/IDLE_CORE_CREATIVE_GUIDE.md`
7. 필요 시 `docs/OPERATOR_RUNBOOK.md`, `docs/AUTONOMOUS_PROJECT_OPERATING_MODEL.md`

## 현재 결론

운영사 인프라는 최소한의 실험을 계속할 수 있을 만큼 있다. 당분간 본질은 운영사 추상화가 아니라 production급 idle collection game을 만드는 것이다.

핵심 방향:

- Codex/Claude/opencode/pi 전체 provider-portable kernel은 지금은 보류한다.
- `operator:resume` 같은 별도 커널도 지금은 과설계로 본다.
- OMX는 optional accelerator로 취급하고, source of truth는 `docs/`, `items/`, `reports/`, GitHub issue/PR에 둔다.
- 다음 큰 축은 P0.5 idle core + creative rescue다.

## 이미 main에 merge된 운영사 기반

- PR #116: completion watchdog. 완료 보고는 중단 조건이 아니라 checkpoint.
- PR #118: 프로젝트 전용 명령어.
  - `$seed-ops`: 운영모드
  - `$seed-brief`: 보고/상황판
  - `$seed-design`: 설계 대화
  - `$seed-qa`: 실기 QA
  - `$seed-play`: 사람 플레이 준비

## 아직 canonical로 승격하지 않은 것

`.omx/plans/provider-portable-operator-kernel-*`에는 provider portability 기획이 있지만, 현재 판단상 v0 실행 대상이 아니다. 필요하면 나중에 `OMX optional boundary` 또는 `Codex/Claude dual harness` issue로 축소해서 다룬다.

## 다음 추천 작업

`$seed-ops`로 다음 issue를 만든다.

추천 issue title:

> 게임: P0.5 idle core creative rescue vertical slice 설계

추천 small win:

> `docs/IDLE_CORE_CREATIVE_GUIDE.md` 기준으로 첫 vertical slice를 `creature role + auto production + order v0`로 정의하고, 구현 가능한 item/PRD/test spec을 만든다.

그 다음 구현 후보:

1. 첫 생명체 역할/자동 생산 v0
2. 주문/의뢰 v0
3. 생산 엔진이 보이는 정원 UI v0
4. creature work/celebrate + reward FX asset batch
5. 5분 playtest checklist와 visual evidence

## 운영사 판단 규칙

운영사 인프라 작업은 아래 조건일 때만 게임 작업보다 우선한다.

- PR/CI/QA가 막혀 게임 PR을 낼 수 없다.
- 현재 상태를 사람이 이해하지 못해 다음 게임 작업 선택이 불가능하다.
- 세션 끊김으로 source of truth가 사라질 위험이 있다.

그 외에는 게임 core, UI, 에셋, playtest를 우선한다.
