# Studio Harness v3 bot runner 구현 spec 및 checker 정리

## 문제 / 배경

PR #273의 v3 설계는 GitHub issue/PR/GateEvent를 기준으로 Studio runner가 계속 운영되어야 한다고 정했지만, 이를 deterministic하게 검증하는 bot runner/checker slice가 없었다. 그 결과 local `campaigns/**` ledger나 recovery branch/stash가 다시 work authorization source처럼 쓰이는 회귀, routine GitHub 작업을 사람 handoff로 넘기는 회귀, stale local branch/dirty work를 완료처럼 오인하는 회귀를 CI가 막지 못했다.

## 목표

GitHub-authoritative Studio Harness v3의 첫 deterministic runner/checker slice를 만든다. 이 slice는 live GitHub mutation runner가 아니라 fixture 기반으로 WorkUnit reconstruction, GateEvent hash, local ledger authority 금지, publication handoff 금지, stale branch/dirty work recovery 분류를 검증한다.

## Small win

- 이번 issue가 만들 가장 작은 승리: `npm run check:studio-v3-bot-runner`가 #276 핵심 회귀를 deterministic fixture로 실패시키고 `npm run check:ci`에 연결된다.

## Game Studio route

- Umbrella: N/A — operator/harness WorkUnit이며 visible gameplay/HUD/asset/QA 화면을 변경하지 않는다.
- Specialist route: N/A — runner/checker/docs 범위다.
- 북극성/플레이어 동사: 운영사 북극성 — 사람이 GitHub 작업을 반복 지시하지 않아도 issue→PR→checks→merge 루프를 지속할 수 있게 한다.
- Playfield 보호 또는 UI surface 원칙: N/A — 게임 화면 변경 없음.
- Playtest evidence 계획: N/A — UI/visual 변경이 없어 Browser Use 실기 QA 대상이 아니다. 다음 #275 같은 game/UI WorkUnit에서는 Browser Use `iab`가 blocking evidence다.

## Plan

- 구현 전 작성/검토할 plan artifact: `items/0140-studio-v3-bot-runner-checker.md`
- 예상 변경 단계:
  1. current checker/script/docs surface 매핑
  2. `scripts/studio-v3-bot-runner.mjs` 추가
  3. `scripts/check-studio-v3-bot-runner.mjs` 추가
  4. `reports/operations/fixtures/studio-v3-bot-runner-*.json` 추가
  5. `package.json` `check:ci` 연결
  6. v3 spec/runbook/project commands/roadmap/control room/dashboard evidence 갱신
- 검증 계획: `npm run check:studio-v3-bot-runner`, valid fixture `--require-authorized`, local-ledger fixture expected failure, `npm run check:ci`
- 건드리지 않을 범위: production gameplay code, assets, payment/login/ads/customer data/external deploy, recovery stash drop/reset/clean

## 플레이어 가치 또는 운영사 가치

- 게임 가치: 직접 UI/게임 변경은 없지만, 다음 production game WorkUnit이 로컬 ledger에 갇히지 않고 GitHub issue/PR evidence로 승격되도록 한다.
- 운영사 가치: runner가 GitHub issue/PR/GateEvent를 기준으로 WorkUnit을 복원하고, local ledger authority와 human handoff regression을 CI에서 차단한다.

## 수용 기준

- [x] runner가 GitHub issue/PR/GateEvent를 source로 work unit을 복원한다.
- [x] local `campaigns/**`만으로 gate advance를 authorize하지 못한다.
- [x] routine branch push, PR create/update, issue/comment update가 human handoff로 밀리지 않도록 checker가 실패시킨다.
- [x] stale local branch와 unpushed dirty work를 감지하고 recovery state로 분류한다.
- [x] `npm run check:ci`에 필요한 deterministic gate가 연결된다.

## Visual evidence 계획

- Before screenshot: N/A — docs/scripts/checker-only 변경.
- After screenshot: N/A — docs/scripts/checker-only 변경.
- Browser Use 우선 QA 계획 또는 N/A 사유: N/A — visible gameplay/HUD/UI 변경 없음.
- N/A 사유: #276은 operator harness deterministic checker work이며 화면 rendering을 변경하지 않는다.

## Playable mode 영향

- [x] 사람이 `npm run play:main`으로 main 게임을 계속 실행할 수 있다.
- 변경 확인 URL/port: N/A — game runtime 변경 없음, playable mode gate는 `npm run check:control-room`에서 확인.

## 안전 범위

- 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음.
- Branch protection 우회 없음.
- recovery stash/branch 삭제 없음.
- GitHub issue/PR/comment 본문은 markdown body file로 게시한다.

## 검증 명령

- `npm run check:studio-v3-bot-runner` — PASS
- `node scripts/studio-v3-bot-runner.mjs --fixture reports/operations/fixtures/studio-v3-bot-runner-valid.json --require-authorized` — PASS
- `! node scripts/studio-v3-bot-runner.mjs --fixture reports/operations/fixtures/studio-v3-bot-runner-local-ledger-authority.json --require-authorized` — expected failure PASS
- `npm run check:ci` — PASS

## 연결 evidence

- `docs/STUDIO_HARNESS_V3_AUTONOMOUS_DESIGN.md`
- `docs/OPERATOR_RUNBOOK.md`
- `docs/PROJECT_COMMANDS.md`
- `docs/ROADMAP.md`
- `docs/OPERATOR_CONTROL_ROOM.md`
- `items/0140-studio-v3-bot-runner-checker.md`
- `reports/operations/operator-heartbeat-20260502.jsonl`
- `reports/operations/fixtures/studio-v3-bot-runner-*.json`
- PR #279: https://github.com/bborok1234/strange-seed-shop/pull/279
- GateEvent comment: https://github.com/bborok1234/strange-seed-shop/issues/276#issuecomment-4364251574
