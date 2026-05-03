# Studio Harness v3 Runner Usage

이 문서는 AI 네이티브 게임 운영사를 실제로 시작하고 관찰하는 방법을 설명한다. 목표는 checker를 늘리는 것이 아니라, GitHub-authoritative runner가 24시간 동안 `이상한 씨앗상회`를 production game quality로 계속 밀어 올리게 하는 것이다.

## 핵심 원칙

- GitHub issue/PR/GateEvent가 operational truth다.
- Queue empty is not a stop condition.
- Queue가 비면 runner는 `P0.5 Idle Core + Creative Rescue` 기준의 production game quality WorkUnit intake로 넘어간다.
- Routine GitHub issue/PR/comment publication, branch push, check watch, merge는 runner 책임이다.
- PublicationBoundary는 실제 credential/tool/runtime/destructive/external-production/payment/customer-data blocker가 있을 때만 기록한다.
- Visible gameplay WorkUnit은 Game Studio route와 Browser Use evidence를 요구한다.

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

## 24시간 foreground 실행

```bash
npm run studio:v3:runner -- \
  --duration-hours 24 \
  --interval-seconds 300 \
  --dry-run \
  --issue 290 \
  --item items/0147-studio-v3-24h-live-runner.md
```

`--dry-run`은 GitHub mutation 없이 queue/PR/CI 상태와 다음 action을 기록한다. 실제 issue intake 생성을 허용하려면 dry-run을 끄고 명시적으로 `--allow-create-issue`를 붙인다.

```bash
npm run studio:v3:runner -- \
  --duration-hours 24 \
  --interval-seconds 300 \
  --no-dry-run \
  --allow-create-issue
```

## detached 24시간 실행

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
npm run check:ci
```
