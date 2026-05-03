## GitHub authority

- Plan artifact: `items/0169-operator-claude-fallback-supervisor.md`
- Source: Studio Harness v3 dry-run after #332 merge / main CI `25286072238` success
- Campaign source of truth: Studio Harness v3 runner-plane reliability (24h foreground/detached operator liveness)
- WorkUnit type: production harness quality

## 문제 / 배경

`scripts/studio-v3-operator.mjs`는 24h foreground/detached supervisor에서 Codex/OMX backend 한 갈래만 사용한다. 실제 24h 루프에서는 Codex `rate-limit`/`usage-limit` 메시지나 `idle stall`(stdio가 멈춘 상태)이 발생해 supervisor가 죽거나 사용자 개입 없이 멈춘다. 이 상태에서는 GitHub queue/PR/CI watch가 끊겨 `Studio Harness v3` 24h 운영 계약(infinite run)이 유지되지 않는다.

## 목표

Codex/OMX 패스가 rate-limit/idle blocker에 닿으면 supervisor가 자동으로 (a) 현재 패스를 종료하고 (b) cooldown 동안 Claude CLI 백엔드로 폴백해 동일한 v3 operator prompt를 계속 실행한다. cooldown이 지나면 다시 Codex로 복귀를 시도해 24h 루프 연속성을 유지한다.

## Small win

24h supervisor가 Codex 한쪽 limit/idle에 막혀도 Claude 백엔드로 즉시 이어서 v3 prompt를 실행하고, cooldown 후 자연스럽게 Codex로 복귀한다.

## Studio Campaign Gate

- Player verb: N/A — 게임 표면이 아니라 운영사 supervisor의 24h 루프 안정화.
- Production/progression role: Studio Harness v3 runner-plane reliability (24h infinite run contract).
- Screen moment: N/A — 운영사 인프라.
- Concrete payoff: `scripts/studio-v3-operator.mjs --supervisor`가 Codex rate-limit/idle 시 Claude로 폴백하고 cooldown 추적 telemetry(`backend_used`, `via`, `codex_cooldown_until`, `last_trigger`)를 state/report에 남긴다.
- Competition production gap: AI native 24h 운영사 루프에서 모델/도구 단일 fallback이 없으면 사용자 개입 없이는 멈춘다.
- Playtest evidence: `scripts/check-studio-v3-operator.mjs`, `--doctor --print-command --backend codex` 출력, `--prompt-only` smoke가 새 옵션을 모두 보여준다.

## Game Studio Department Signoff

- 기획팀: N/A — 게임 surface 변경 없음.
- 리서치팀: N/A — 게임 production gap이 아니라 운영사 루프 reliability.
- 아트팀: N/A — accepted manifest asset 변경 없음.
- 개발팀: `scripts/studio-v3-operator.mjs` 단일 파일 안에서 supervisor/runExecPass/runMonitoredPass/buildCommandText/buildDetachedCommandText/doctorChecks 변경을 좁게 묶는다. 다른 게임/하네스 코드 영향 없음.
- 검수팀: `npm run check:studio-v3-operator`, focused doctor/prompt-only smoke, `npm run check:ci` 전체.
- 마케팅팀: N/A.
- 고객지원팀: 사용자가 24h detached operator를 켜고 자고 일어나도 Codex limit 한 번에 멈추지 않는 신뢰 회복.

## 사용자/운영자 가치

- 사용자: AI 네이티브 게임 운영사가 사람 없이도 24h 동안 멈추지 않고 게임 품질을 밀어올리는 약속을 지킨다.
- 운영자: Codex limit/idle blocker가 발생해도 supervisor가 Claude로 자동 폴백 → cooldown 후 Codex 복귀로 자기 회복한다.

## 수용 기준

- [ ] `--backend codex|omx|claude`, `--fallback claude|none`, `--idle-timeout-minutes`, `--codex-cooldown-minutes` CLI 옵션이 노출된다.
- [ ] `runMonitoredPass`가 stdio chunk를 감시해 Codex `rate-limit`/`usage-limit`/`status: 429` 류 패턴을 감지하고 SIGTERM/SIGKILL로 안전 종료한다.
- [ ] idle timeout(기본 10분)을 넘기면 동일하게 종료하고 cooldown으로 처리한다.
- [ ] cooldown 동안 후속 iteration은 Claude 백엔드로 라우팅되고 cooldown 만료 후 Codex 시도가 재개된다.
- [ ] supervisor가 매 iteration마다 `backend_used`, `via`, `codex_cooldown_until`, `last_trigger`, `last_trigger_at`을 state에 기록한다.
- [ ] `--doctor` 출력과 detached/foreground command text가 `--fallback`/`--idle-timeout-minutes`/`--codex-cooldown-minutes`와 Claude 명령을 정확하게 보여준다.
- [ ] `npm run check:studio-v3-operator`가 통과한다.
- [ ] `npm run check:ci`가 통과한다.
- [ ] 24h infinite run 계약이 유지되며 cooldown/리커버리 상태도 state/report에서 사람이 즉시 읽힌다.

## Visual evidence 계획

- N/A — UI 변화 없음.
- 대신 doctor JSON, prompt smoke, check 출력, supervisor state schema 예시를 PR body와 plan artifact에 첨부한다.

## Playable mode 영향

- 없음. 게임 런타임/에셋/스토어 영향 없음.

## 안전 범위

- runtime image generation/API 호출 없음.
- 신규 accepted manifest asset 없음.
- real payment, customer data, external production deployment, branch protection bypass 없음.
- Claude CLI backend는 사용자 로컬에 설치된 Claude CLI에만 의존(외부 결제/계정 자동화 없음).
- destructive git/GitHub 명령 없음.

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

## Subagent/Team Routing

- 기본은 solo execution: 변경 영역이 단일 supervisor 파일 + 단일 check + 단일 doc. 병렬 worker conflict 가능성이 더 크다.
- Codex native subagents/team mode는 다중 backend 시뮬레이션과 24h soak QA가 분리될 때만 사용한다.
