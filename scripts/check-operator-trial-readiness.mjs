import fs from "node:fs";

const reportPath = "reports/operations/operator-trial-readiness-20260428.md";
const failures = [];

if (!fs.existsSync(reportPath)) {
  failures.push(`missing readiness report: ${reportPath}`);
} else {
  const report = fs.readFileSync(reportPath, "utf8");
  for (const phrase of [
    "Status: ready-gated",
    "Issue: #31",
    "readiness-only",
    "Time budget",
    "Token/context budget",
    "Branch hygiene",
    "Network boundary",
    "Credential boundary",
    "Heartbeat monitoring",
    "CI repair loop",
    "ready-for-supervised-start",
    "no-go-in-this-slice",
    "ENABLE_AGENT_AUTOMERGE",
    "context budget exceeds 80%"
  ]) {
    if (!report.includes(phrase)) failures.push(`${reportPath} missing phrase: ${phrase}`);
  }

  const passRows = report.match(/\| [^|]+ \| pass \|/g) ?? [];
  if (passRows.length < 10) failures.push(`${reportPath} expected at least 10 pass gate rows, got ${passRows.length}`);
}

console.log(JSON.stringify({ ok: failures.length === 0, report: reportPath, failures }, null, 2));

if (failures.length > 0) process.exit(1);
