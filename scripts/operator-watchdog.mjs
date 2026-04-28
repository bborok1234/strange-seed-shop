import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);

function readArg(name, fallback = "") {
  const index = args.indexOf(`--${name}`);
  if (index === -1) return fallback;
  return args[index + 1] ?? fallback;
}

function hasFlag(name) {
  return args.includes(`--${name}`);
}

function readHeartbeat(filePath) {
  if (!fs.existsSync(filePath)) return { heartbeat: null, error: "missing" };
  const raw = fs.readFileSync(filePath, "utf8").trim();
  if (!raw) return { heartbeat: null, error: "empty" };

  try {
    if (filePath.endsWith(".jsonl")) {
      const lines = raw.split("\n").filter(Boolean);
      return { heartbeat: JSON.parse(lines.at(-1)), error: "" };
    }

    return { heartbeat: JSON.parse(raw), error: "" };
  } catch (error) {
    return { heartbeat: null, error: `invalid json: ${error.message}` };
  }
}

function writeReport(filePath, result) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const report = `# Operator Watchdog Report - ${result.checked_at}

Status: ${result.status}
Reason: ${result.reason}
Scope-risk: narrow

## 입력

- Heartbeat path: \`${result.heartbeat_path}\`
- Max age seconds: ${result.max_age_seconds}
- Checked at: ${result.checked_at}

## 마지막 heartbeat

- Timestamp: ${result.heartbeat?.timestamp ?? "unknown"}
- Phase: ${result.heartbeat?.phase ?? "unknown"}
- Branch: ${result.heartbeat?.branch ?? "unknown"}
- Issue: ${result.heartbeat?.issue ?? "unknown"}
- PR: ${result.heartbeat?.pr ?? "unknown"}
- Current command: ${result.heartbeat?.current_command ?? "unknown"}
- Next action: ${result.heartbeat?.next_action ?? "unknown"}
- Age seconds: ${result.age_seconds ?? "unknown"}

## 판정

${result.status === "fresh" ? "Heartbeat is fresh. Continue current iteration." : "Heartbeat is not fresh. Create or update a stuck report before claiming completion."}

## Recovery next action

${result.recovery_next_action}
`;
  fs.writeFileSync(filePath, report);
}

function writeStuckReport(filePath, result) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const report = `# Operator Watchdog Stuck Report - ${result.checked_at}

Status: reported
Reason: ${result.reason}
Scope-risk: narrow

## 감지 신호

- Heartbeat path: \`${result.heartbeat_path}\`
- Last heartbeat: ${result.heartbeat?.timestamp ?? "unknown"}
- Branch: ${result.heartbeat?.branch ?? "unknown"}
- Issue: ${result.heartbeat?.issue ?? "unknown"}
- PR: ${result.heartbeat?.pr ?? "unknown"}
- Current command: ${result.heartbeat?.current_command ?? "unknown"}
- Next action: ${result.heartbeat?.next_action ?? "unknown"}
- Age seconds: ${result.age_seconds ?? "unknown"}
- Max age seconds: ${result.max_age_seconds}

## 표준 복구 절차

1. 현재 명령이나 CI 대기가 실제로 살아 있는지 확인한다.
2. 마지막 heartbeat 이후의 PR/CI 상태를 확인한다.
3. red/pending CI를 완료로 부르지 않고 repair 또는 blocker report로 분류한다.
4. 같은 stale class가 3회 이상 반복되면 장시간 run을 중단하고 follow-up issue로 분리한다.
5. credential, 결제, 외부 배포, 고객 데이터가 필요하면 즉시 escalation한다.

## Recovery next action

${result.recovery_next_action}
`;
  fs.writeFileSync(filePath, report);
}

const heartbeatPath = readArg("heartbeat", ".omx/state/operator-heartbeat.json");
const maxAgeSeconds = Number(readArg("max-age-seconds", "600"));
const checkedAt = readArg("now", new Date().toISOString());
const output = readArg("output", readArg("report", ""));
const stuckOutput = readArg("stuck-output", "");
const { heartbeat, error } = readHeartbeat(heartbeatPath);
const checkedTime = Date.parse(checkedAt);
const heartbeatTime = heartbeat?.timestamp ? Date.parse(heartbeat.timestamp) : Number.NaN;
const ageSeconds = Number.isNaN(checkedTime) || Number.isNaN(heartbeatTime) ? null : Math.max(0, Math.floor((checkedTime - heartbeatTime) / 1000));
let status = "fresh";
let reason = "heartbeat within freshness threshold";

if (!heartbeat) {
  status = "missing";
  reason = error || "heartbeat missing";
} else if (ageSeconds === null) {
  status = "invalid";
  reason = "timestamp parse failed";
} else if (ageSeconds > maxAgeSeconds) {
  status = "stale";
  reason = `heartbeat age ${ageSeconds}s exceeds ${maxAgeSeconds}s`;
}

const result = {
  ok: status === "fresh",
  status,
  reason,
  checked_at: checkedAt,
  heartbeat_path: heartbeatPath,
  heartbeat,
  age_seconds: ageSeconds,
  max_age_seconds: maxAgeSeconds,
  recovery_next_action: status === "fresh" ? readArg("next", "continue current iteration") : readArg("next", "write stuck report and inspect current process/CI state")
};

if (output) writeReport(output, result);
if (stuckOutput && status !== "fresh") writeStuckReport(stuckOutput, result);

console.log(JSON.stringify(result, null, 2));

if (hasFlag("fail-on-stale") && status !== "fresh") {
  process.exit(1);
}
