## 요약

Studio Harness v3의 권위 모델을 GitHub issue/PR 중심으로 재설계하는 planning/spec PR입니다.

## Small win

사람이 직접 `git`/`gh` 명령을 실행해야 하는 설계 결함을 제거하고, routine issue/branch/PR/check 작업은 agent/runner 책임이라는 계약을 문서화했습니다.

## 사용자/운영자 가치

운영사가 로컬 campaign ledger에 갇히지 않고 GitHub issue/PR/GateEvent를 기준으로 재개, 검증, PR 운영, CI repair를 계속할 수 있게 합니다.

## Before / After 또는 Visual evidence

Before:

- Studio Harness v2는 local campaign ledger가 실질 authority가 되는 문제가 있었습니다.
- GitHub issue/PR publication이 사람 handoff로 밀릴 수 있었습니다.

After:

- GitHub issue #272가 v3 WorkUnit이 되었습니다.
- 초기 GateEvent comment를 issue #272에 남겼습니다.
- local ledger는 read-model mirror만 허용됩니다.
- `autonomous_publish`가 실제 runner 기본 목표 정책입니다.

## Playable mode

해당 없음. 게임 production code를 수정하지 않는 harness planning/spec PR입니다.

## 검증

- `npm run check:docs`
- `npm run check:studio-harness`

## 안전 범위

- docs/spec/report만 변경합니다.
- production game code는 변경하지 않습니다.
- v3 구현은 별도 follow-up으로 issue #272와 PR evidence를 기준으로 진행합니다.

## 남은 위험

- 이 PR은 v3 구현이 아니라 실행 전 설계/스펙입니다.
- v3 deterministic checker와 runner implementation은 후속 PR에서 구현해야 합니다.
- 현재 worktree에는 이 PR 범위 밖의 기존 미커밋 변경이 남아 있습니다.

## 연결된 issue

Closes #272 only after the v3 implementation PR is complete. This PR links and seeds #272 but should not close it.

Refs #272

## 작업 checklist

- [x] GitHub-authoritative source model documented
- [x] GateEvent/state hash/reconciliation spec documented
- [x] no-human routine git/GitHub ownership documented
- [x] GitHub issue created
- [x] initial GateEvent posted
- [x] focused local checks passed
- [ ] v3 checker implemented
- [ ] v3 runner implementation completed
