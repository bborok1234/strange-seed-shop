## 요약

Studio Harness v3 계약을 “한 번 시작되면 interruption 전까지 무한 운영”으로 고정했습니다.

## Small win

`Studio run is infinite by default`, `Queue empty is not a stop condition`, `Checkpoint is not completion`, `Final report requires local main`을 문서와 deterministic checker에 연결했습니다.

## Plan-first evidence

- Plan artifact: `items/0139-studio-infinite-runner-contract.md`
- Linked issue: #276
- Scope: Studio contract docs/checker only

## 사용자/운영자 가치

Studio가 issue 생성이나 PR 생성 후 멈추는 식의 반쪽짜리 운영을 하지 않도록 계약을 바꿨습니다. 이제 checkpoint를 완료로 오해하면 `check:studio-v3-contract`와 `check:ci`에서 잡힙니다.

## Before / After 또는 Visual evidence

Before:

- Studio v3는 GitHub-authoritative runner를 설명했지만, 무한 운영의 중단 조건이 충분히 좁게 고정되지 않았습니다.
- Queue empty, issue 생성, PR 생성, merge, report가 종료처럼 해석될 여지가 있었습니다.
- 최종 보고 전 로컬 workspace가 `main`이어야 한다는 규칙이 체커에 없었습니다.

After:

- Studio run은 기본적으로 무한 운영입니다.
- 허용 interruption은 token/context limit, network/GitHub/tool/machine outage, user stop/close/interrupt, destructive/credential/payment/external-production boundary with no safe local continuation, force majeure로 제한됩니다.
- Queue empty는 중단 조건이 아니며 reconciliation, Intake WorkUnit, stale PR/check repair, contract hardening, evidence refresh, retry heartbeat로 이어집니다.
- 최종 사용자 보고 전 foreground workspace는 `main`이어야 합니다.

## Playable mode

해당 없음. 게임 production code를 수정하지 않는 Studio 계약/체커 변경입니다.

## 검증

- `npm run check:studio-v3-contract`
- `npm run check:project-commands`
- `npm run check:operator`
- `npm run check:ci`

## 안전 범위

- production game code는 수정하지 않았습니다.
- recovery stash는 보존했습니다.
- #274/#275의 로컬 미반영 작업은 이 PR에 포함하지 않았습니다.

## 남은 위험

- 이 PR은 계약과 deterministic checker만 고정합니다.
- 실제 unattended bot runner 구현은 #276 후속 작업입니다.
- 최종 보고 전 `main` 복귀는 PR 생성/검증 후 별도로 확인해야 합니다.

## 연결된 issue

Refs #276

## 작업 checklist

- [x] Infinite Run Contract 문서화
- [x] Project commands/runbook/AGENTS 계약 동기화
- [x] `check:studio-v3-contract` 추가
- [x] `check:ci`에 새 contract checker 연결
- [x] local `npm run check:ci` 통과
