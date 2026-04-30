import fs from "node:fs";

const failures = [];

function requirePath(filePath) {
  if (!fs.existsSync(filePath)) failures.push(`missing required path: ${filePath}`);
}

function requirePhrases(filePath, phrases) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, "utf8");
  for (const phrase of phrases) {
    if (!content.includes(phrase)) failures.push(`${filePath} missing phrase: ${phrase}`);
  }
}

function readJsonLine(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const lines = fs.readFileSync(filePath, "utf8").split("\n").filter(Boolean);
  if (lines.length === 0) return null;
  try {
    return JSON.parse(lines.at(-1));
  } catch (error) {
    failures.push(`${filePath} has invalid JSONL tail: ${error.message}`);
    return null;
  }
}

const requiredPaths = [
  "items/0019-ralph-session-operating-company-v0.md",
  "reports/operations/README.md",
  "reports/operations/operator-loop-20260428.md",
  "reports/operations/operator-completion-gate-20260428.md",
  "reports/operations/operator-heartbeat-20260428.jsonl",
  "reports/operations/stuck-drill-20260428.md",
  "reports/operations/watchdog-fresh-drill-20260428.md",
  "reports/operations/watchdog-stale-drill-20260428.md",
  "reports/operations/operator-trial-template-20260428.md",
  "items/0020-operator-watchdog-runner-trial-scaffold.md",
  "items/0021-supervised-operator-trial-dry-run.md",
  "items/0022-supervised-2h-trial-readiness-gate.md",
  "items/0023-supervised-2h-operator-trial.md",
  "items/0034-operator-runbook-daily-report.md",
  "items/0040-operator-live-status-report.md",
  "items/0051-heartbeat-daemon-hardening.md",
  "items/0052-operator-control-room-playable-mode.md",
  "items/0061-issue-plan-first-operating-rule.md",
  "items/0066-operator-continuation-watchdog.md",
  "items/0029-operator-completion-gate.md",
  "docs/OPERATOR_RUNBOOK.md",
  "docs/OPERATOR_CONTROL_ROOM.md",
  "docs/PLAYABLE_MODE.md",
  "reports/operations/operator-trial-readiness-20260428.md",
  "reports/operations/operator-trial-20260428T025400Z.md",
  "reports/operations/operator-trial-20260428T053230Z.md",
  "reports/operations/daily-template-20260428.md",
  "reports/operations/operator-live-status-20260428.md",
  "reports/operations/heartbeat-daemon-hardening-20260428.md",
  "reports/operations/operator-control-room-20260428.md",
  "reports/operations/operator-continuation-watchdog-20260429.md",
  "reports/research/agent_operator_control_room_research_20260428.md",
  "reports/operations/fixtures/operator-trial-dry-run-scenario-20260428.json",
  "reports/operations/fixtures/operator-trial-stale-gap-scenario-20260428.json",
  "reports/operations/operator-trial-dry-run-20260428.md",
  "reports/operations/operator-trial-stale-gap-guard-20260428.md",
  "scripts/write-operator-heartbeat.mjs",
  "scripts/operator-heartbeat-daemon.mjs",
  "scripts/operator-control-room.mjs",
  "scripts/prepare-playable-main.mjs",
  "scripts/check-operator-control-room.mjs",
  "scripts/update-operator-live-status.mjs",
  "scripts/operator-trial-dry-run.mjs",
  "scripts/check-operator-trial-gap-guard.mjs",
  "scripts/check-operator-trial-readiness.mjs",
  "scripts/operator-watchdog.mjs",
  "scripts/check-operator-watchdog-stuck-report.mjs",
  "scripts/report-operator-stuck.mjs",
  "scripts/check-operator.mjs",
  "docs/AUTONOMOUS_PROJECT_OPERATING_MODEL.md",
  "docs/PR_AUTOMATION.md",
  ".github/ISSUE_TEMPLATE/agent-work-item.md",
  ".github/pull_request_template.md"
];

for (const filePath of requiredPaths) requirePath(filePath);

requirePhrases("items/0019-ralph-session-operating-company-v0.md", [
  "Status: in_progress",
  "Work type: agent_ops",
  "Issue: #25",
  "Scope-risk: moderate",
  "heartbeat ledger",
  "stuck report",
  "CI repair loop",
  "npm run check:operator",
  "npm run check:all"
]);

requirePhrases("items/0020-operator-watchdog-runner-trial-scaffold.md", [
  "Status: in_progress",
  "Work type: agent_ops",
  "Issue: #27",
  "watchdog runner",
  "operator trial report",
  "npm run check:operator",
  "npm run check:all"
]);

requirePhrases("reports/operations/watchdog-fresh-drill-20260428.md", [
  "Status: fresh",
  "Heartbeat is fresh",
  "Issue: #27",
  "continue operator iteration"
]);

requirePhrases("reports/operations/watchdog-stale-drill-20260428.md", [
  "Status: stale",
  "Heartbeat is not fresh",
  "Issue: #27",
  "write stuck report before completion"
]);

requirePhrases("reports/operations/operator-trial-template-20260428.md", [
  "Heartbeat coverage",
  "Failures and recovery attempts",
  "CI status",
  "Stop rules observed"
]);


requirePhrases("items/0021-supervised-operator-trial-dry-run.md", [
  "Status: in_progress",
  "Work type: agent_ops",
  "Issue: #29",
  "trial dry-run generator",
  "실제 장시간 실행을 시작하지 않는다",
  "npm run operator:trial:dry-run"
]);

requirePhrases("reports/operations/operator-trial-dry-run-20260428.md", [
  "Status: dry-run-pass",
  "Heartbeat coverage",
  "Coverage: 100%",
  "Max allowed gap seconds: 600",
  "Stale gap windows: 0",
  "Failures and recovery attempts",
  "simulated stale heartbeat",
  "Stop rules observed",
  "No real 2h/4h/24h execution in dry-run"
]);

requirePhrases("reports/operations/fixtures/operator-trial-dry-run-scenario-20260428.json", [
  "deterministic-dry-run",
  "heartbeat_windows",
  "max_gap_seconds",
  "stop_rules_observed"
]);

requirePhrases("items/0051-heartbeat-daemon-hardening.md", [
  "Status: review",
  "Work type: agent_ops",
  "Issue: #84",
  "heartbeat daemon",
  "702.5초",
  "npm run operator:trial:gap-guard",
  "npm run operator:watchdog:stuck-guard",
  "npm run check:all"
]);

requirePhrases("reports/operations/heartbeat-daemon-hardening-20260428.md", [
  "Status: review",
  "Issue: #84",
  "Heartbeat Daemon Hardening",
  "702.5초",
  "operator-heartbeat-daemon.mjs",
  "Stale gap windows: 1",
  "npm run operator:trial:gap-guard",
  "npm run operator:watchdog:stuck-guard"
]);

requirePhrases("reports/operations/operator-trial-stale-gap-guard-20260428.md", [
  "Status: dry-run-review",
  "Max allowed gap seconds: 600",
  "Stale gap windows: 1",
  "702.5",
  "stale-gap",
  "Issue #84"
]);

requirePhrases("reports/operations/fixtures/operator-trial-stale-gap-scenario-20260428.json", [
  "deterministic-stale-gap-guard",
  "max_gap_seconds",
  "702.5",
  "reported-stale-gap",
  "Issue #84"
]);



requirePhrases("items/0052-operator-control-room-playable-mode.md", [
  "Status: review",
  "Work type: agent_ops",
  "Issue: #87",
  "small win",
  "playable mode",
  "npm run check:control-room",
  "npm run check:all"
]);

requirePhrases("docs/OPERATOR_CONTROL_ROOM.md", [
  "Operator Control Room",
  "Small win",
  "Visual evidence",
  "Playable Mode",
  "npm run play:main",
  "5174",
  "24h dry run gate"
]);

requirePhrases("items/0061-issue-plan-first-operating-rule.md", [
  "Status: active",
  "Work type: agent_ops",
  "Issue: #106",
  "## Plan",
  "plan-first",
  "npm run check:operator",
  "npm run check:all"
]);

requirePhrases("items/0066-operator-continuation-watchdog.md", [
  "Status: active",
  "Work type: agent_ops",
  "Issue: #115",
  "## Plan",
  "완료 보고는 중단 조건이 아니라 checkpoint",
  "다음 issue를 plan-first로 선택",
  "명시 중단",
  "시간 상한",
  "외부 승인",
  "치명적 blocker",
  "npm run check:operator",
  "npm run check:all"
]);

requirePhrases("AGENTS.md", [
  "Issue/work-item 단위 작업은 반드시 plan-first로 시작한다",
  "## Plan",
  "수용 기준",
  "검증 명령",
  "완료 보고는 중단 조건이 아니라 체크포인트",
  "다음 issue를 plan-first로 선택",
  "Production Bar",
  "vertical slice workflow"
]);

requirePhrases("docs/AUTONOMOUS_PROJECT_OPERATING_MODEL.md", [
  "issue -> plan artifact -> branch",
  "plan-first gate",
  "Plan은 거창한 PRD가 아니라도 된다",
  "plan artifact exists and includes `## Plan`",
  "completion checkpoint / continuation watchdog",
  "완료 보고는 중단 조건이 아니라 체크포인트",
  "다음 issue를 plan-first로 선택",
  "production vertical slice",
  "명시 중단, 시간 상한, 외부 승인, 치명적 blocker"
]);

requirePhrases("docs/OPERATOR_RUNBOOK.md", [
  "Create or update the issue plan artifact before implementation",
  "Plan artifact가 없으면 branch 구현",
  "plan artifact with `## Plan`",
  "완료 보고는 중단 조건이 아니라 체크포인트",
  "다음 issue를 plan-first로 선택",
  "Production Bar",
  "명시 중단, 시간 상한, 외부 승인, 치명적 blocker"
]);

requirePhrases("reports/operations/operator-continuation-watchdog-20260429.md", [
  "Status: active",
  "Issue: #115",
  "items/0066-operator-continuation-watchdog.md",
  "완료 보고는 중단 조건이 아니라 체크포인트",
  "명시 중단, 시간 상한, 외부 승인, 치명적 blocker",
  "다음 issue를 plan-first로 선택",
  "npm run check:operator",
  "npm run check:all"
]);

requirePhrases("docs/PLAYABLE_MODE.md", [
  "사람 플레이 모드",
  "../strange-seed-shop-play",
  "detached HEAD",
  "5174",
  "--serve",
  "--force"
]);

requirePhrases("reports/operations/operator-control-room-20260428.md", [
  "Operator Control Room Snapshot",
  "Current mission",
  "Open issues",
  "Playable mode",
  "Visual evidence rule",
  "Next safe stop"
]);

requirePhrases("reports/research/agent_operator_control_room_research_20260428.md", [
  "ClawSweeper",
  "GitHub Mission Control",
  "Ralph",
  "Playable mode",
  "small win"
]);

requirePhrases(".github/ISSUE_TEMPLATE/agent-work-item.md", [
  "Small win",
  "## Plan",
  "검증 계획",
  "Visual evidence 계획",
  "Playable mode 영향",
  "npm run play:main"
]);

requirePhrases(".github/pull_request_template.md", [
  "Small win",
  "Plan-first evidence",
  "Plan artifact",
  "Before / After 또는 Visual evidence",
  "Playable mode",
  "npm run play:main"
]);

requirePhrases("items/0022-supervised-2h-trial-readiness-gate.md", [
  "Status: in_progress",
  "Work type: agent_ops",
  "Issue: #31",
  "readiness gate",
  "실제 2h run을 시작하지 않는다",
  "npm run operator:trial:readiness"
]);

requirePhrases("items/0029-operator-completion-gate.md", [
  "Status: in_progress",
  "Work type: agent_ops",
  "Issue: #17",
  "draft PR",
  "follow-up issue/audit",
  "reports/operations/operator-completion-gate-20260428.md",
  "npm run check:operator",
  "npm run check:all"
]);

requirePhrases("reports/operations/operator-completion-gate-20260428.md", [
  "Status: pr-open",
  "Issue: #17",
  "Completion checklist",
  "Draft PR",
  "PR body requirements",
  "Audit/operation link rule",
  "Follow-up",
  "GitHub checks",
  "N/A — 운영 문서/checker 변경이며 UI 변화 없음"
]);

requirePhrases("reports/operations/operator-trial-readiness-20260428.md", [
  "Status: ready-gated",
  "ready-for-supervised-start",
  "no-go-in-this-slice",
  "Time budget",
  "Token/context budget",
  "Credential boundary",
  "ENABLE_AGENT_AUTOMERGE"
]);

requirePhrases("items/0023-supervised-2h-operator-trial.md", [
  "Status: in_progress",
  "Work type: agent_ops",
  "Issue: #33",
  "2h supervised trial",
  "Heartbeat coverage",
  "Observed heartbeat count: 24",
  "PR #49",
  "npm run check:operator",
  "npm run check:all"
]);

requirePhrases("reports/operations/operator-trial-20260428T025400Z.md", [
  "Status: completed",
  "Issue: #33",
  "Observed heartbeat count: 24",
  "Heartbeat coverage: pass",
  "Completed work",
  "PR #35",
  "PR #49",
  "Stop rules observed",
  "No credential",
  "Next queue"
]);

requirePhrases("items/0034-operator-runbook-daily-report.md", [
  "Status: in_progress",
  "Work type: agent_ops",
  "Issue: #51",
  "docs/OPERATOR_RUNBOOK.md",
  "reports/operations/daily-template-20260428.md",
  "실제 4h/24h 실행을 시작하지 않는다",
  "npm run check:operator",
  "npm run check:all"
]);

requirePhrases("docs/OPERATOR_RUNBOOK.md", [
  "Start procedure",
  "Monitor procedure",
  "Recover procedure",
  "Stop procedure",
  "Summarize procedure",
  "4h supervised trial readiness checklist",
  "24h dry-run readiness checklist",
  "operator:heartbeat:daemon",
  "operator:trial:gap-guard",
  "operator:watchdog:stuck-guard",
  "--stuck-output",
  "No credential access",
  "Do not call red CI"
]);

requirePhrases("reports/operations/daily-template-20260428.md", [
  "Daily Operating Report Template",
  "Completed work",
  "Failed or blocked work",
  "Open PRs",
  "Red checks",
  "Decisions made",
  "Stop rules observed",
  "Verification evidence",
  "Next queue"
]);

requirePhrases("items/0040-operator-live-status-report.md", [
  "Status: in_progress",
  "Work type: agent_ops",
  "Issue: #62",
  "operator:live-status",
  "Heartbeat freshness",
  "Completed issue-to-PR loops",
  "npm run check:operator",
  "npm run check:all"
]);

requirePhrases("reports/operations/operator-live-status-20260428.md", [
  "Operator Live Status",
  "Issue: #53",
  "Heartbeat freshness",
  "Heartbeat count",
  "Deadline",
  "Last heartbeat",
  "Completed issue-to-PR loops",
  "PR #55",
  "PR #61",
  "Known recovery",
  "Next action"
]);

requirePhrases("scripts/update-operator-live-status.mjs", [
  "operator-live-status",
  "Heartbeat freshness",
  "Completed issue-to-PR loops",
  "Known recovery",
  "Next action",
  "not-running"
]);

requirePhrases("reports/operations/README.md", [
  "heartbeat",
  "heartbeat daemon",
  "stuck report",
  "--stuck-output",
  "CI repair",
  "issue-to-PR",
  "operator-completion-gate-YYYYMMDD.md",
  "작업 완료 gate",
  "daily operating report"
]);

requirePhrases("reports/operations/operator-loop-20260428.md", [
  "Issue #25",
  "codex/ralph-operator-v0",
  "items/0019-ralph-session-operating-company-v0.md",
  "npm run check:operator",
  "npm run check:all",
  "PR evidence",
  "PR #26",
  "Follow-up Issue #27"
]);

requirePhrases("reports/operations/stuck-drill-20260428.md", [
  "Status: reported",
  "Reason: drill-not-stuck",
  "red CI",
  "blocker report"
]);

requirePhrases("docs/AUTONOMOUS_PROJECT_OPERATING_MODEL.md", [
  "Ralph-session 운영사 v0",
  "Operator Work Item Taxonomy",
  "heartbeat ledger",
  "stuck report",
  "CI repair loop",
  "completion gate",
  "draft PR + 검증 증거 + follow-up/audit 링크"
]);

requirePhrases("docs/PR_AUTOMATION.md", [
  "CI repair loop",
  "red check",
  "blocker report",
  "gh run view",
  "작업 완료 gate: 완료 → draft PR → follow-up issue/audit",
  "PR 본문 최소 템플릿",
  "Audit/operation link policy",
  "Follow-up: none + reason",
  "red PR을 완료로 부르지 않는다"
]);

requirePhrases("package.json", [
  "check:operator",
  "operator:watchdog",
  "operator:heartbeat:daemon",
  "operator:trial:dry-run",
  "operator:trial:gap-guard",
  "operator:watchdog:stuck-guard",
  "operator:control-room",
  "play:main",
  "check:control-room",
  "operator:trial:readiness",
  "operator:live-status",
  "scripts/operator-heartbeat-daemon.mjs",
  "scripts/check-operator-trial-gap-guard.mjs",
  "scripts/check-operator-watchdog-stuck-report.mjs",
  "scripts/operator-control-room.mjs",
  "scripts/prepare-playable-main.mjs",
  "scripts/check-operator-control-room.mjs",
  "scripts/check-operator.mjs",
  "scripts/update-operator-live-status.mjs"
]);

const heartbeat = readJsonLine("reports/operations/operator-heartbeat-20260428.jsonl");
if (!heartbeat) {
  failures.push("operator heartbeat report has no readable JSON line");
} else {
  for (const field of ["schemaVersion", "timestamp", "phase", "branch", "commit", "current_command", "next_action", "issue", "item"]) {
    if (heartbeat[field] === undefined || heartbeat[field] === null || heartbeat[field] === "") {
      failures.push(`operator heartbeat missing field: ${field}`);
    }
  }

  if (Number.isNaN(Date.parse(heartbeat.timestamp))) failures.push("operator heartbeat timestamp is invalid");
  if (!/^#\d+$/.test(heartbeat.issue)) failures.push(`operator heartbeat issue should look like #<number>, got ${heartbeat.issue}`);
  if (!heartbeat.item.startsWith("items/") || !heartbeat.item.endsWith(".md")) failures.push(`operator heartbeat item should point at items/*.md, got ${heartbeat.item}`);
}

console.log(JSON.stringify({ ok: failures.length === 0, requiredPaths: requiredPaths.length, failures }, null, 2));

if (failures.length > 0) process.exit(1);
