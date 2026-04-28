import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);

function readArg(name, fallback = "") {
  const index = args.indexOf(`--${name}`);
  if (index === -1) return fallback;
  return args[index + 1] ?? fallback;
}

function slug(value) {
  return value.toLowerCase().replace(/[^a-z0-9가-힣]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "unknown";
}

const timestamp = new Date().toISOString();
const reason = readArg("reason", "unknown-stall");
const phase = readArg("phase", "unknown");
const currentCommand = readArg("command", "unknown");
const nextAction = readArg("next", "triage and recover");
const heartbeatPath = readArg("heartbeat", ".omx/state/operator-heartbeat.json");
const output = readArg("output", `reports/operations/stuck-${timestamp.slice(0, 10).replaceAll("-", "")}-${slug(reason)}.md`);
let heartbeat = null;

if (fs.existsSync(heartbeatPath)) {
  try {
    heartbeat = JSON.parse(fs.readFileSync(heartbeatPath, "utf8"));
  } catch {
    heartbeat = null;
  }
}

const report = `# Ralph Stuck Report - ${timestamp}

Status: reported
Reason: ${reason}
Phase: ${phase}
Scope-risk: narrow

## 감지 신호

- Reason: ${reason}
- Current command: ${currentCommand}
- Next action: ${nextAction}
- Last heartbeat: ${heartbeat?.timestamp ?? "unknown"}
- Branch: ${heartbeat?.branch ?? "unknown"}
- Issue: ${heartbeat?.issue ?? "unknown"}
- PR: ${heartbeat?.pr ?? "unknown"}

## 표준 복구 절차

1. 현재 명령이 아직 실행 중인지 확인한다.
2. heartbeat가 stale인지 확인한다.
3. GitHub PR check가 red이면 로그를 읽고 원인을 분류한다.
4. 로컬 재현이 가능하면 fix branch에서 수정하고 검증을 다시 실행한다.
5. 3회 이상 같은 실패가 반복되면 blocker report로 전환한다.
6. credential, 결제, 외부 배포, 고객 데이터가 필요하면 즉시 사용자 확인으로 escalation한다.

## 금지 사항

- red CI를 green으로 착각하고 완료 선언하지 않는다.
- 실패 로그를 읽지 않고 재실행만 반복하지 않는다.
- main 자동 merge나 branch protection 우회를 시도하지 않는다.

## Recovery next action

${nextAction}
`;

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, report);
console.log(JSON.stringify({ ok: true, report: output, reason }, null, 2));
