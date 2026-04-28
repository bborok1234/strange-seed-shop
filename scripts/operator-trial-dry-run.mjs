import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);

function readArg(name, fallback = "") {
  const index = args.indexOf(`--${name}`);
  if (index === -1) return fallback;
  return args[index + 1] ?? fallback;
}

function table(headers, rows) {
  return [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.map((cell) => String(cell ?? "").replaceAll("\n", "<br>")) .join(" | ")} |`)
  ].join("\n");
}

const scenarioPath = readArg("scenario", "reports/operations/fixtures/operator-trial-dry-run-scenario-20260428.json");
const outputPath = readArg("output", "reports/operations/operator-trial-dry-run-20260428.md");
const maxGapSeconds = Number(readArg("max-gap-seconds", "600"));
const scenario = JSON.parse(fs.readFileSync(scenarioPath, "utf8"));
const heartbeatExpected = scenario.heartbeat_windows.reduce((sum, window) => sum + Number(window.expected ?? 0), 0);
const heartbeatObserved = scenario.heartbeat_windows.reduce((sum, window) => sum + Number(window.observed ?? 0), 0);
const heartbeatCoverage = heartbeatExpected === 0 ? 100 : Math.round((heartbeatObserved / heartbeatExpected) * 100);
const staleGapWindows = scenario.heartbeat_windows.filter((window) => {
  const maxGap = Number(window.max_gap_seconds ?? 0);
  return maxGap > maxGapSeconds || String(window.freshness ?? "").includes("stale");
});
const unresolvedFailures = scenario.failures.filter((failure) => !String(failure.result ?? "").includes("reported"));
const ciReady = scenario.ci_status.every((check) => ["expected-pass-after-pr", "pass", "success"].includes(check.result));
const status = heartbeatObserved >= heartbeatExpected && staleGapWindows.length === 0 && unresolvedFailures.length === 0 && ciReady ? "dry-run-pass" : "dry-run-review";

const report = `# Operator Trial Dry Run - ${scenario.trial_id}

Status: ${status}
Mode: ${scenario.mode}
Scope-risk: moderate

## Trial metadata

- Started at: ${scenario.started_at}
- Ended at: ${scenario.ended_at}
- Operator branch: \`${scenario.operator_branch}\`
- Related issues: ${scenario.related_issues.join(", ")}
- Related PRs: ${scenario.related_prs.length ? scenario.related_prs.join(", ") : "pending"}
- Human-approved budget: ${scenario.human_approved_budget}

## Heartbeat coverage

- Expected heartbeat count: ${heartbeatExpected}
- Observed heartbeat count: ${heartbeatObserved}
- Coverage: ${heartbeatCoverage}%
- Max allowed gap seconds: ${maxGapSeconds}
- Stale gap windows: ${staleGapWindows.length}

${table(["Window", "Expected", "Observed", "Max gap seconds", "Freshness", "Evidence"], scenario.heartbeat_windows.map((window) => [window.window, window.expected, window.observed, window.max_gap_seconds ?? "unknown", window.freshness, window.evidence]))}

## Completed work

${table(["Item", "Status", "Evidence"], scenario.completed_work.map((work) => [work.item, work.status, work.evidence]))}

## Failures and recovery attempts

${table(["Failure", "Detection source", "Recovery attempt", "Result", "Follow-up"], scenario.failures.map((failure) => [failure.failure, failure.detection_source, failure.recovery_attempt, failure.result, failure.follow_up]))}

## CI status

${table(["PR", "Check", "Result", "URL"], scenario.ci_status.map((check) => [check.pr, check.check, check.result, check.url]))}

## Stop rules observed

${scenario.stop_rules_observed.map((rule) => `- ${rule}`).join("\n")}

## Next queue

${scenario.next_queue.map((item) => `- ${item}`).join("\n")}
`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, report);

console.log(JSON.stringify({ ok: status === "dry-run-pass", status, output: outputPath, heartbeatExpected, heartbeatObserved, heartbeatCoverage, maxGapSeconds, staleGapWindows: staleGapWindows.length, unresolvedFailures: unresolvedFailures.length }, null, 2));

if (status !== "dry-run-pass") process.exit(1);
