# Studio infinite runner contract

Status: review
Work type: agent_ops
Issue: #276
Branch: codex/studio-infinite-runner-contract-20260503

## 문제 / 배경

Studio Harness v3 설계가 GitHub-authoritative runner를 정의했지만, 사용자가 요구한 핵심 계약인 “Studio는 한 번 시작되면 token/network/user interruption/force majeure 전까지 무한히 돈다”가 문서와 deterministic checker에 충분히 고정되어 있지 않았다.

기존 계약은 checkpoint, issue 생성, PR 생성, merge, release, retro, queue empty를 종료처럼 해석할 여지를 남겼다. 또한 최종 보고 전 로컬 branch가 `main`이어야 한다는 사용자 운영 규칙이 문서화되지 않았다.

## Plan

1. `docs/STUDIO_HARNESS_V3_AUTONOMOUS_DESIGN.md`에 Infinite Run Contract를 추가한다.
2. `docs/PROJECT_COMMANDS.md`, `docs/OPERATOR_RUNBOOK.md`, `AGENTS.md`에 같은 계약을 중복 고정한다.
3. `scripts/check-studio-v3-contract.mjs`를 추가해 핵심 문구가 빠지면 실패하게 한다.
4. `package.json`의 `check:ci`에 `check:studio-v3-contract`를 연결한다.
5. heartbeat를 이 item과 현재 branch로 갱신한다.
6. `npm run check:studio-v3-contract`, `npm run check:project-commands`, `npm run check:ci`를 실행한다.
7. PR을 만들고 checks를 확인한 뒤, 최종 보고 전 workspace를 `main`으로 되돌린다.

## 수용 기준

- [x] Studio run is infinite by default 문구가 v3 설계, 프로젝트 명령, runbook, AGENTS에 존재한다.
- [x] Queue empty is not a stop condition 문구가 deterministic checker로 강제된다.
- [x] Checkpoint is not completion 문구가 deterministic checker로 강제된다.
- [x] Final report requires local main 문구가 deterministic checker로 강제된다.
- [x] `npm run check:ci`가 `check:studio-v3-contract`를 포함한다.
- [ ] 최종 사용자 보고 전 현재 branch는 `main`이다.

## 검증 결과

- `npm run check:studio-v3-contract`: 통과
- `npm run check:project-commands`: 통과
- `npm run check:operator`: 통과
- `npm run check:ci`: 통과

## 검증 명령

- `npm run check:studio-v3-contract`
- `npm run check:project-commands`
- `npm run check:ci`

## 안전 범위

- 게임 production code는 수정하지 않는다.
- local recovery stash는 보존한다.
- issue #274/#275/#276의 실제 구현 범위는 건드리지 않는다.
