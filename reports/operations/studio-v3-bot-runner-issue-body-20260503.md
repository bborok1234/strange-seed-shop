# Studio Harness v3 bot runner 구현 spec 및 checker 정리

## 요약

PR #273의 v3 설계를 기준으로, 사람이 직접 git/GitHub를 조작하지 않아도 Studio runner가 GitHub issue/PR/GateEvent를 기준으로 계속 운영되도록 bot runner spec과 deterministic checker를 구현한다.

## 배경

현재 문제는 단순히 코드 변경이 남은 것이 아니라, Codex가 로컬 branch/stash에 작업을 쌓고 GitHub WorkUnit으로 승격하지 않은 운영 결함이다. v3 설계는 GitHub-authoritative 모델을 승인했지만, runner/checker 구현은 아직 없다.

## 범위

- GitHub WorkUnit reconstruction
- GateEvent/state hash validation
- pending-publication / partial-transition / quarantined state 처리
- runner heartbeat / watchdog / stale branch 감지
- PR/issue publication handoff 금지 checker
- local ledger authority 회귀 방지

## 비범위

- production gameplay feature 구현
- 새 asset generation
- 실제 external deploy, payment, credential flow
- PR #273 설계 문서의 대규모 재작성

## 수용 기준

- [ ] runner가 GitHub issue/PR/GateEvent를 source로 work unit을 복원한다.
- [ ] local `campaigns/**`만으로 gate advance를 authorize하지 못한다.
- [ ] routine branch push, PR create/update, issue/comment update가 human handoff로 밀리지 않도록 checker가 실패시킨다.
- [ ] stale local branch와 unpushed dirty work를 감지하고 recovery state로 분류한다.
- [ ] `npm run check:ci`에 필요한 deterministic gate가 연결된다.

## 검증

- focused unit/checker tests
- stale branch fixture
- local ledger authority regression fixture
- `npm run check:ci`

## 연결 evidence

- `docs/STUDIO_HARNESS_V3_AUTONOMOUS_DESIGN.md`
- `reports/operations/local-studio-work-recovery-20260503.md`

