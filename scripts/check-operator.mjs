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
  "items/0029-operator-completion-gate.md",
  "reports/operations/operator-trial-readiness-20260428.md",
  "reports/operations/fixtures/operator-trial-dry-run-scenario-20260428.json",
  "reports/operations/operator-trial-dry-run-20260428.md",
  "scripts/write-operator-heartbeat.mjs",
  "scripts/operator-trial-dry-run.mjs",
  "scripts/check-operator-trial-readiness.mjs",
  "scripts/operator-watchdog.mjs",
  "scripts/report-operator-stuck.mjs",
  "scripts/check-operator.mjs",
  "docs/AUTONOMOUS_PROJECT_OPERATING_MODEL.md",
  "docs/PR_AUTOMATION.md"
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
  "Failures and recovery attempts",
  "simulated stale heartbeat",
  "Stop rules observed",
  "No real 2h/4h/24h execution in dry-run"
]);

requirePhrases("reports/operations/fixtures/operator-trial-dry-run-scenario-20260428.json", [
  "deterministic-dry-run",
  "heartbeat_windows",
  "stop_rules_observed"
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

requirePhrases("reports/operations/README.md", [
  "heartbeat",
  "stuck report",
  "CI repair",
  "issue-to-PR",
  "operator-completion-gate-YYYYMMDD.md",
  "작업 완료 gate"
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

requirePhrases("package.json", ["check:operator", "operator:watchdog", "operator:trial:dry-run", "operator:trial:readiness", "scripts/check-operator.mjs"]);

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
