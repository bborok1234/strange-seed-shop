# Studio Harness v3 bot runner/checker 구현

Status: review
Work type: agent_ops
Issue: #276
Branch: codex/0276-studio-v3-bot-runner-checker
Owner: Codex
Created: 2026-05-03
Updated: 2026-05-03
Scope-risk: moderate

## GitHub 권위 WorkUnit

- Source of truth: GitHub issue #276 `Studio Harness v3 bot runner 구현 spec 및 checker 정리`
- Queue decision: 2026-05-03 현재 open queue #276/#274/#275 중 #276이 runner/checker blocking WorkUnit이므로 먼저 진행한다.
- Local ledger rule: `campaigns/**`, `.omx/**`, recovery stash/branch는 evidence 또는 runtime cache일 뿐 WorkUnit authorization source가 아니다.
- 연결 설계: `docs/STUDIO_HARNESS_V3_AUTONOMOUS_DESIGN.md`

## Plan

1. 현재 `scripts/check-*`, `scripts/operator-*`, `package.json`의 Studio v3 관련 검증면을 매핑한다.
2. GitHub issue/PR/GateEvent 기반 WorkUnit reconstruction을 deterministic하게 테스트할 수 있는 fixture와 checker를 추가한다.
3. local `campaigns/**` 단독 권위, final/publication handoff 문구, stale local branch/dirty work 누락을 실패시키는 regression fixture를 만든다.
4. checker를 `npm run check:ci`에 연결하고 #276 수용 기준이 로컬 deterministic gate에 걸리도록 한다.
5. 문서에는 runner spec을 구현 상세와 연결하되, PR #273 설계를 대규모 재작성하지 않는다.
6. focused checks(`npm run check:studio-v3-bot-runner`, 관련 단위 명령)와 `npm run check:ci`를 실행한다.
7. PR body 파일을 작성하고 branch push/PR/check/merge까지 진행한다. GitHub 게시에는 body file을 사용한다.

## 수용 기준

- [x] runner/checker가 GitHub issue/PR/GateEvent를 source로 WorkUnit 상태를 복원하는 fixture를 통과한다.
- [x] local `campaigns/**`만으로 gate advance를 authorize하는 fixture는 실패한다.
- [x] routine branch push, PR create/update, issue/comment update를 human handoff로 남기는 projection은 checker가 실패시킨다.
- [x] stale local branch와 unpushed dirty work를 recovery state로 분류하는 fixture가 있다.
- [x] `npm run check:ci`가 #276 deterministic gate를 포함한다.

## 검증 명령

- `npm run check:studio-v3-bot-runner`
- `npm run check:studio-v3-contract`
- `npm run check:ci`

## Subagent/Team Routing decision

- 사용: Codex native `explorer` 1개가 read-only로 현재 harness/checker/doc/test surface를 병렬 매핑한다.
- 미사용: worker edit 병렬화는 같은 scripts/package/doc write scope 충돌 가능성이 커서 이번 tranche에서는 leader가 구현한다.

## Game Studio route

- 해당 없음: #276은 operator/harness WorkUnit이며 visible gameplay/HUD/asset/Browser Use gate를 직접 변경하지 않는다.
- 단, #275 같은 다음 game/UI WorkUnit으로 이동하면 `game-studio:game-studio` 및 `game-playtest` route를 plan-first에 고정한다.

## 안전 범위 / 비범위

- 게임 production code, 새 asset generation, 결제/로그인/외부 배포, credential flow는 건드리지 않는다.
- recovery stash와 branch는 삭제하지 않는다.
- GitHub issue/PR/comment 본문은 markdown body file로만 게시한다.
- v2 local ledger를 다시 authority로 승격하지 않는다.

## 리스크

- `gh` 네트워크/권한 실패 시 pending-publication boundary로 기록하고 로컬 checker/plan hardening을 계속한다.
- 기존 `check:ci`가 길기 때문에 focused gate를 먼저 통과시킨 뒤 전체 gate를 실행한다.
- 실제 GitHub API를 CI에서 호출하지 않도록 fixture 기반 deterministic reconstruction을 우선한다.

## Evidence

- 2026-05-03: `npm run operator:heartbeat:write -- --phase planning --issue '#276' ...` 실행.
- 2026-05-03: Codex native `explorer`와 `omx explore`가 현재 harness/checker surface를 read-only 매핑했고 `check:studio-v3-bot-runner` 부재와 fixture gap을 확인했다.
- 2026-05-03: `scripts/studio-v3-bot-runner.mjs`, `scripts/check-studio-v3-bot-runner.mjs`, `reports/operations/fixtures/studio-v3-bot-runner-*.json` 추가.
- 2026-05-03: `npm run check:studio-v3-bot-runner` 통과.
- 2026-05-03: `node scripts/studio-v3-bot-runner.mjs --fixture reports/operations/fixtures/studio-v3-bot-runner-valid.json --require-authorized` 통과.
- 2026-05-03: `! node scripts/studio-v3-bot-runner.mjs --fixture reports/operations/fixtures/studio-v3-bot-runner-local-ledger-authority.json --require-authorized`로 local ledger authority fixture 실패 확인.
- 2026-05-03: `npm run check:ci` 통과. 1차 실패는 `docs/ROADMAP.md`의 기존 Studio Campaign Gate 문구 누락이었고, ROADMAP에 활성 gate 문구를 복원한 뒤 재실행해 통과했다.

## 남은 리스크

- 이번 slice는 deterministic fixture 기반이며 live GitHub mutation runner가 아니다. 실제 GitHub API 동기화, PR check repair loop, merge automation은 후속 runner tranche에서 다룬다.
- #274/#275는 아직 open WorkUnit이다. #276 merge 후 GitHub state 기준으로 다음 합법 WorkUnit을 계속 진행해야 한다.
