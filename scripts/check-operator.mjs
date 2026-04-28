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
  "reports/operations/operator-heartbeat-20260428.jsonl",
  "reports/operations/stuck-drill-20260428.md",
  "reports/operations/watchdog-fresh-drill-20260428.md",
  "reports/operations/watchdog-stale-drill-20260428.md",
  "reports/operations/operator-trial-template-20260428.md",
  "items/0020-operator-watchdog-runner-trial-scaffold.md",
  "items/0021-supervised-operator-trial-dry-run.md",
  "reports/operations/fixtures/operator-trial-dry-run-scenario-20260428.json",
  "reports/operations/operator-trial-dry-run-20260428.md",
  "scripts/write-operator-heartbeat.mjs",
  "scripts/operator-trial-dry-run.mjs",
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

requirePhrases("reports/operations/README.md", [
  "heartbeat",
  "stuck report",
  "CI repair",
  "issue-to-PR"
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
  "CI repair loop"
]);

requirePhrases("docs/PR_AUTOMATION.md", [
  "CI repair loop",
  "red check",
  "blocker report",
  "gh run view"
]);

requirePhrases("package.json", ["check:operator", "operator:watchdog", "operator:trial:dry-run", "scripts/check-operator.mjs"]);

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
