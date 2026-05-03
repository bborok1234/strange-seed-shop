# WorkUnit #334 — 운영사 supervisor가 Codex rate-limit/idle에서 Claude로 자동 폴백하게 한다

## GitHub authority

- GitHub issue: #334 https://github.com/bborok1234/strange-seed-shop/issues/334
- Branch: `codex/0334-operator-claude-fallback-supervisor`
- Campaign source of truth: Studio Harness v3 runner-plane reliability (24h infinite run contract)
- Runner decision: `production-game-intake-required` after #332 merge / main CI `25286072238` success — re-routed to runner-plane WorkUnit since uncommitted Claude-fallback supervisor work was discovered in working tree from prior session
- Status: plan-first (구현 본문은 prior session에서 이미 작성됨, ceremony/검증/PR로 닫는다)

## 문제 / 배경

`scripts/studio-v3-operator.mjs`의 `--supervisor` 루프는 Codex/OMX 백엔드 한 갈래에 의존한다. 24h 운영을 시도하면 Codex `rate-limit`/`usage-limit`/`status: 429` 메시지나 `idle stall`(stdio가 멈춘 상태)이 발생해 supervisor가 종료되거나 사용자 개입 없이 멈춘다. 그 순간 GitHub queue/PR/CI watch가 끊겨 v3 contract의 infinite run 약속이 깨진다.

이전 세션에서 동일 supervisor에 Claude 백엔드/폴백/idle-timeout/cooldown 로직을 구현했지만 commit/PR로 묶이지 않은 채 dirty working tree 상태로 남아 있었다. 본 WorkUnit은 그 구현을 GitHub issue/PR/CI evidence로 정식화해 v3 contract 위반을 닫는다.

## Reference teardown

- AI native 24h agent 운영 사례는 단일 backend(Codex / OMX / Claude / etc.) 단일 limit에 닿으면 사용자 호출 없이는 회복하지 못한다. fallback이 없는 단일 backend는 SLA가 없다.
- Codex CLI는 사용 한도가 단기간 reset되며, idle/rate-limit 시점에 stdio가 끊긴다. supervisor가 stdio chunk를 능동 감시하지 않으면 dead loop으로 빠진다.
- Reject: `codex --auto-retry` 같은 백엔드 내부 옵션만 의존. supervisor 외부에서 hand-off하지 않으면 한도가 풀릴 때까지 시간이 통째로 소모된다.

## Creative brief

- Player fun target: N/A. 운영사 인프라.
- Operator fun target: 24h detached supervisor를 켜고 자고 일어나도 Codex 한 번의 limit에 멈추지 않고, cooldown 후 자기 회복했다는 evidence가 보인다.
- Production/progression role: Studio Harness v3 runner-plane reliability — `Run Continuity`/`Watchdog` 계약의 한 단면.
- Screen moment: N/A.
- Required assets/FX: 없음. 신규 manifest asset 변경 없음.

## Game Studio route

- Umbrella: 운영사 인프라 — 게임 surface 변경 없음.
- Specialist route: Harness Auditor + Studio Director (게임 production 라우팅 미적용).
- 적용 규칙: scope를 단일 supervisor 파일과 단일 check/단일 doc로 제한한다. 게임 production 코드, 결제, 외부 배포, customer data 변경 없음.

## Game Studio Department Signoff

- 기획팀: N/A — 게임 surface 변경 없음.
- 리서치팀: AI native 24h 운영사는 backend fallback 없이 SLA를 약속할 수 없다. cooldown은 backend health에 비례한 자기 회복 장치다.
- 아트팀: N/A — accepted manifest asset 변경 없음.
- 개발팀: `scripts/studio-v3-operator.mjs` 단일 파일 안에서 doctorChecks/runMonitoredPass/runCodexPass/runClaudePass/runExecPass/supervise/buildCommandText/buildDetachedCommandText 변경을 좁게 묶는다.
- 검수팀: `npm run check:studio-v3-operator`, `--doctor --print-command --backend codex` 출력, `--prompt-only` smoke, `npm run check:ci` 전체.
- 마케팅팀: N/A.
- 고객지원팀: 사용자가 24h detached operator를 사용할 때 Codex limit 한 번에 멈추지 않는 신뢰 회복.

## Plan

1. `runMonitoredPass`로 Codex/Claude 자식 프로세스를 stdio chunk 단위로 감시하고 `CODEX_LIMIT_PATTERNS`(rate-limit, usage limit, 429, retry-after 류)를 만나면 SIGTERM/SIGKILL로 안전 종료한다.
2. `--idle-timeout-minutes`(기본 10분)을 넘는 stdio 무응답을 동일하게 종료하고 cooldown으로 처리한다.
3. `runExecPass`가 cooldown 진행 중이면 Claude 백엔드로 라우팅하고, cooldown 만료 후에는 Codex를 다시 시도한다.
4. `--backend codex|omx|claude` 와 `--fallback claude|none` CLI 옵션을 노출하고 doctor에서 적절한 required/optional 판정을 한다.
5. `buildCommandText`/`buildDetachedCommandText`/`writeReport`에 새 옵션과 텔레메트리를 반영한다.
6. supervisor state schema에 `backend_used`, `via`, `codex_cooldown_until`, `last_trigger`, `last_trigger_at`을 기록한다.
7. focused checks(`check:studio-v3-operator`, doctor/prompt-only smoke, `check:operator`) → 전체 `check:ci` → issue/PR body-file 게시 → branch push → PR create/watch/merge → main CI observation.

## 수용 기준

- [ ] `--backend codex|omx|claude`, `--fallback claude|none`, `--idle-timeout-minutes`, `--codex-cooldown-minutes` CLI 옵션이 노출된다.
- [ ] `runMonitoredPass`가 stdio chunk를 감시해 Codex `rate-limit`/`usage-limit`/`status: 429`/`retry in N` 류 패턴을 감지하면 안전 종료한다.
- [ ] idle timeout 초과 시 동일하게 종료하고 cooldown 처리된다.
- [ ] cooldown 동안 후속 iteration은 Claude 백엔드로 라우팅되고 cooldown 만료 후 Codex 시도가 재개된다.
- [ ] supervisor state에 `backend_used`, `via`, `codex_cooldown_until`, `last_trigger`, `last_trigger_at`이 기록된다.
- [ ] doctor JSON 및 detached/foreground command text가 새 옵션/Claude 호출을 정확하게 표시한다.
- [ ] `npm run check:studio-v3-operator`가 통과한다.
- [ ] `npm run check:ci`가 통과한다.

## 검증 명령

- `node --check scripts/studio-v3-operator.mjs`
- `node scripts/studio-v3-operator.mjs --doctor --print-command --backend codex`
- `node scripts/studio-v3-operator.mjs --prompt-only --backend codex --issue 334`
- `npm run check:studio-v3-operator`
- `npm run check:operator`
- `npm run check:ci`
- `npm run update:dashboard`
- `npm run operator:control-room -- --output docs/OPERATOR_CONTROL_ROOM.md`
- `npm run check:dashboard`
- `npm run check:control-room`
- `npm run check:ops-live`
- `npm run check:github-metadata`
- `npm run check:seed-ops-queue`
- `npm run check:closed-workunit-mirrors`

## 리스크

- supervisor child stdio 감시 패턴이 너무 좁으면 Codex의 미래 limit 메시지를 놓칠 수 있다. 패턴은 흔한 표현 다수를 OR로 묶어 broad하게 잡았다.
- idle-timeout이 너무 짧으면 정상 long-running 작업(예: 큰 빌드/테스트)을 강제 종료할 수 있다. 기본 10분은 v3 운영자 prompt가 한 iteration에서 보통 stdio를 자주 뱉는다는 가정에 기반한다.
- Claude 백엔드는 사용자가 로컬에 `claude` CLI를 설치/로그인해야 한다. doctor는 backend가 claude거나 fallback이 claude일 때만 required로 표시한다.
- cooldown 동안 Claude도 동일한 한도에 닿으면 다음 iteration까지 멈추지 않고 다시 시도한다. 다중 백엔드 health-check는 후속 WorkUnit으로 분리한다.

## Subagent/Team Routing

- 기본은 solo execution: 변경 영역이 단일 supervisor 파일 + 단일 check + 단일 report 템플릿에 좁게 묶인다.
- Codex native subagents/team mode는 다중 backend 시뮬레이션 또는 24h soak QA가 독립 evidence로 분리될 때만 사용한다.

## 구현 결과

- `scripts/studio-v3-operator.mjs`: `runMonitoredPass`/`runCodexPass`/`runClaudePass`/`runExecPass` 도입, `CODEX_LIMIT_PATTERNS` 기반 stdio chunk 감시, idle timeout, cooldown state, telemetry, `--backend claude`, `--fallback claude|none`, `--idle-timeout-minutes`, `--codex-cooldown-minutes` CLI 옵션, doctor/required/optional 재계산, `buildCommandText`/`buildDetachedCommandText`/`writeReport` 갱신, supervisor state schema 확장.
- `reports/operations/studio-v3-operator-20260503.md`: 새 doctor/foreground/detached 명령으로 regeneration.
- `reports/operations/operator-heartbeat-20260503.jsonl`: WorkUnit #334 phase 진입 heartbeat append.
- 게임 production 코드, accepted manifest asset, runtime image generation/API, 결제/외부 배포/customer data 변경 없음.

## 검증 결과

- `node --check scripts/studio-v3-operator.mjs` — pass.
- `node scripts/studio-v3-operator.mjs --doctor --print-command --backend codex` — required/optional 분류, foreground/detached command, cooldown/idle-timeout 옵션 노출 확인.
- `npm run check:studio-v3-operator` — pass.
- `npm run check:operator` — pending (commit 직전 실행).
- `npm run check:ci` — pending (commit 직전 실행).
