# Studio Harness v3 Runner Usage

이 문서는 AI 네이티브 게임 운영사를 실제로 시작하고 관찰하는 방법을 설명한다. 목표는 checker를 늘리는 것이 아니라, GitHub-authoritative runner가 24시간 동안 `이상한 씨앗상회`를 production game quality로 계속 밀어 올리게 하는 것이다.

## 핵심 원칙

- GitHub issue/PR/GateEvent가 operational truth다.
- Queue empty is not a stop condition.
- Queue가 비면 runner는 `P0.5 Idle Core + Creative Rescue` 기준의 production game quality WorkUnit intake로 넘어간다.
- Routine GitHub issue/PR/comment publication, branch push, check watch, merge는 runner 책임이다.
- PublicationBoundary는 실제 credential/tool/runtime/destructive/external-production/payment/customer-data blocker가 있을 때만 기록한다.
- Visible gameplay WorkUnit은 Game Studio route와 Browser Use evidence를 요구한다.

## Codex game-development operating pattern

Studio Harness v3는 OpenAI Codex의 game-development use case를 운영 루프의 형태로 채택한다.

- 참고: `https://developers.openai.com/codex/use-cases/collections/game-development`
- 참고: `https://developers.openai.com/codex/use-cases/iterate-on-difficult-problems`

운영 순서는 아래처럼 해석한다.

1. first playable loop: brief를 계획과 실제 browser build로 바꾼다.
2. UI/control tuning: HUD, menu, controls, small interaction을 실제 화면에서 조정한다.
3. difficult game-logic eval loop: 복잡한 economy, AI, routing, sprite/FX, QA harness 문제는 self-evaluation loop로 반복한다.
4. real-signal bug triage: bug report, failed checks, logs, repro note를 우선순위화한 뒤 patch한다.
5. PR review before merge: regression, missing tests, visual evidence 누락을 merge 전에 잡는다.

Hard problem WorkUnit은 구현 전에 `claim`, `smallest verifier`, `rubric`, `artifact path`, `iteration log`, `stop condition`을 적어야 한다. 통과한 checker가 실제 claim을 평가하지 않으면 green 상태를 completion evidence로 쓰지 않는다.


## v3 운영 루프 진입점 상태

`$seed-ops`는 Studio Harness v3의 실행 진입점이 아니다. `$seed-ops`는 과거 운영 프롬프트이며, v3 전환의 목적은 그 피상적인 issue 처리 루프를 GitHub-authoritative WorkUnit/GateEvent/PR/CI/Browser Use evidence 기반의 새 하네스로 대체하는 것이다.

현재 올바른 구분은 아래와 같다.

- 현재 사용 가능: `npm run studio:v3:runner` — GitHub queue/PR/CI 상태를 읽고 다음 action, heartbeat, report를 남기는 watcher/decision runner.
- 현재 사용 가능: `npm run studio:v3:operate` — foreground Codex/OMX operator prompt를 준비하고 실행하는 v3 native entrypoint. 기획/아트 판단/구현/Browser Use QA/PR/check/merge/다음 WorkUnit 루프를 `$seed-ops` 없이 시작한다.
- 금지/회귀: v3 사용법을 `$seed-ops`로 안내하거나, `$seed-ops`가 실제 v3 foreground operator라고 주장하는 것.

## 실제 foreground 운영사 시작

먼저 doctor와 실제 실행 명령을 확인한다.

```bash
npm run studio:v3:operate -- --doctor --print-command
```

24시간 foreground 운영 루프를 시작한다.

```bash
npm run studio:v3:operate -- --duration-hours 24
```

특정 GitHub WorkUnit부터 시작하려면 issue를 지정한다.

```bash
npm run studio:v3:operate -- --duration-hours 24 --issue 293
```

이 명령은 `omx exec`가 있으면 OMX overlay로, 없으면 `codex exec`로 v3 operator prompt를 실행한다. prompt에는 GitHub issue/PR/GateEvent authoritative, plan-first, branch/implementation/focused checks, Browser Use iab gate, PR/check/merge/main CI observation, queue-empty non-stop, no-final continuation, Department Scorecard, hard-problem self-evaluation loop 계약이 포함된다.

## Department Scorecard

전문팀은 이름표가 아니라 WorkUnit gate owner다. 새 게임 WorkUnit plan에는 `## Department Scorecard`가 있어야 하며 각 부서는 `approve/revise/block` 중 하나와 근거 artifact를 남긴다.

| 부서 | 소유 산출물 | block 조건 |
| --- | --- | --- |
| 기획팀 | player verb, loop role, reward timing, success metric | player verb 또는 첫 5분/D1/D7/D30 screen moment가 없음 |
| 리서치팀 | reference teardown, production gap, rejected alternatives | 경쟁작/내부 reference 없이 작은 기능을 자동 선택 |
| 아트팀 | visual target, asset/FX bundle, provenance/generation plan | asset/FX payoff인데 raster/sprite/manifest/animation plan 없음 |
| 개발팀 | runtime/save/economy boundary, implementation tranche, rollback boundary | touched files와 state boundary가 모호함 |
| 검수팀 | Browser Use/playtest plan, deterministic regression, rubric scoring | UI/visual claim인데 Browser Use evidence 또는 current blocker가 없음 |
| 마케팅팀 | mock-only player promise, release/devlog angle, no real channel action | 외부 채널/실결제/광고/과장 promise 위험 |
| 고객지원팀 | first-5m confusion risk, support FAQ note | 플레이어가 다음 행동이나 변화 의미를 설명할 수 없음 |

두 부서 이상이 `revise` 또는 `block`이면 구현 전에 `## Role Debate`를 남긴다. 최종 선택, 거절한 대안, 범위 축소/확대 사유가 없으면 plan 미완성이다.

## 실제 detached 24시간 운영사 시작

```bash
npm run studio:v3:operate -- --detached --duration-hours 24 --interval-seconds 300
```

관찰 파일:

- `.omx/state/studio-v3-operator.json`
- `.omx/state/studio-v3-operator.pid`
- `.omx/state/studio-v3-operator-prompt.md`
- `.omx/logs/studio-v3-operator-*.log`
- `reports/operations/studio-v3-operator-YYYYMMDD.md`

중단:

```bash
kill $(cat .omx/state/studio-v3-operator.pid)
```

## 1회 smoke 실행

```bash
npm run studio:v3:runner -- --once --dry-run
```

권장: 현재 WorkUnit을 heartbeat에 명시하려면 아래처럼 실행한다.

```bash
npm run studio:v3:runner -- --once --dry-run \
  --issue 290 \
  --item items/0147-studio-v3-24h-live-runner.md
```

생성/갱신되는 evidence:

- `.omx/state/studio-v3-live-runner.json`
- `.omx/state/operator-heartbeat.json`
- `reports/operations/studio-v3-live-runner-YYYYMMDD.md`

## watcher/decision runner 24시간 실행

```bash
npm run studio:v3:runner -- \
  --duration-hours 24 \
  --interval-seconds 300 \
  --dry-run \
  --issue 290 \
  --item items/0147-studio-v3-24h-live-runner.md
```

`studio:v3:runner`의 `--dry-run`은 GitHub mutation 없이 queue/PR/CI 상태와 다음 action을 기록한다. 실제 issue intake 생성을 허용하려면 dry-run을 끄고 명시적으로 `--allow-create-issue`를 붙인다.

```bash
npm run studio:v3:runner -- \
  --duration-hours 24 \
  --interval-seconds 300 \
  --no-dry-run \
  --allow-create-issue
```

## watcher/decision runner detached 24시간 실행

```bash
mkdir -p .omx/logs .omx/state
nohup npm run studio:v3:runner -- \
  --duration-hours 24 \
  --interval-seconds 300 \
  --dry-run \
  --issue 290 \
  --item items/0147-studio-v3-24h-live-runner.md \
  > .omx/logs/studio-v3-live-runner-$(date -u +%Y%m%dT%H%M%SZ).log 2>&1 &
echo $! > .omx/state/studio-v3-live-runner.pid
```

## 관찰 명령

```bash
cat .omx/state/studio-v3-live-runner.json
cat .omx/state/operator-heartbeat.json
npm run operator:watchdog -- --heartbeat .omx/state/operator-heartbeat.json --max-age-seconds 600
npm run operator:control-room -- --output docs/OPERATOR_CONTROL_ROOM.md
npm run check:ops-live
```

## 중단 명령

```bash
kill $(cat .omx/state/studio-v3-live-runner.pid)
```

중단 후에는 heartbeat/report에 실제 stop reason을 남긴다. token/context exhaustion, network/GitHub/tool/machine outage, user stop/close/interrupt, force majeure, destructive/credential/payment/external-production boundary 외에는 final report가 아니라 다음 WorkUnit intake로 계속 간다.

## Queue empty 처리

Runner decision이 `production-game-intake-required`이면 종료가 아니다. 다음 issue는 최소 아래 중 3개를 포함해야 한다.

- player verb
- production/progression role
- screen moment
- asset/FX
- playtest evidence

그리고 `P0.5 Idle Core + Creative Rescue`의 production game quality를 직접 올려야 한다. 단순 checker-only, copy tweak, test-only 작업은 production game blocker를 제거할 때만 선택한다.

## 검증

```bash
npm run check:studio-v3-live-runner
npm run check:studio-v3-operator
npm run check:ci
```
