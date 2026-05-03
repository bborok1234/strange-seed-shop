import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);

function readArg(name, fallback = "") {
  const index = args.indexOf(`--${name}`);
  if (index === -1) return fallback;
  return args[index + 1] ?? fallback;
}

function hasFlag(name) {
  return args.includes(`--${name}`);
}

function run(command, commandArgs, fallback = "") {
  try {
    return execFileSync(command, commandArgs, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  } catch {
    return fallback;
  }
}

function runJson(command, commandArgs, fallback = []) {
  const raw = run(command, commandArgs, "");
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function todayCompact(date = new Date()) {
  return date.toISOString().slice(0, 10).replaceAll("-", "");
}

function table(headers, rows) {
  return [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.map((cell) => String(cell ?? "").replaceAll("\n", "<br>")).join(" | ")} |`)
  ].join("\n");
}

function normalizeLabels(labels = []) {
  return labels.map((label) => (typeof label === "string" ? label : label?.name ?? "")).filter(Boolean).sort();
}

function snapshotFromGitHub() {
  const openIssues = runJson("gh", ["issue", "list", "--state", "open", "--limit", "30", "--json", "number,title,url,updatedAt,labels"], []);
  const openPrs = runJson("gh", ["pr", "list", "--state", "open", "--limit", "30", "--json", "number,title,url,isDraft,headRefName,updatedAt,statusCheckRollup"], []);
  const mainRuns = runJson("gh", ["run", "list", "--branch", "main", "--limit", "10", "--json", "databaseId,name,status,conclusion,workflowName,headSha,url,createdAt"], []);
  const mainCommit = run("git", ["rev-parse", "origin/main"], run("git", ["rev-parse", "main"], "unknown"));
  return { openIssues, openPrs, mainRuns, mainCommit };
}

function snapshotFromFixture(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function checkSummary(checks = []) {
  const normalized = checks.map((check) => ({
    name: check.name ?? check.context ?? "unknown",
    status: check.status ?? "UNKNOWN",
    conclusion: check.conclusion ?? ""
  }));
  const pending = normalized.filter((check) => check.status !== "COMPLETED");
  const failing = normalized.filter((check) => check.status === "COMPLETED" && !["SUCCESS", "SKIPPED", "NEUTRAL"].includes(check.conclusion ?? ""));
  return { normalized, pending, failing };
}

function classifyNextAction(snapshot) {
  const openPrs = snapshot.openPrs ?? [];
  const openIssues = snapshot.openIssues ?? [];
  const prNeedingRepair = openPrs.find((pr) => checkSummary(pr.statusCheckRollup).failing.length > 0);
  if (prNeedingRepair) {
    return {
      kind: "repair-pr-checks",
      stop: false,
      target: `PR #${prNeedingRepair.number}`,
      reason: "open PR has failing checks",
      next_action: `CI repair gate: inspect and fix PR #${prNeedingRepair.number} checks`
    };
  }

  const prPending = openPrs.find((pr) => pr.isDraft || checkSummary(pr.statusCheckRollup).pending.length > 0);
  if (prPending) {
    return {
      kind: "watch-pr-checks",
      stop: false,
      target: `PR #${prPending.number}`,
      reason: prPending.isDraft ? "open draft PR requires evidence/check gate" : "open PR checks are pending",
      next_action: `PR/check gate: update evidence, watch checks, and merge PR #${prPending.number} when green`
    };
  }

  const gameIssue = openIssues.find((issue) => normalizeLabels(issue.labels).some((label) => /game|p0|production|visual|asset|playtest/i.test(label)));
  if (gameIssue) {
    return {
      kind: "select-github-workunit",
      stop: false,
      target: `Issue #${gameIssue.number}`,
      reason: "open game/production WorkUnit exists",
      next_action: `implementation gate: plan-first for GitHub issue #${gameIssue.number}`
    };
  }

  const anyIssue = openIssues[0];
  if (anyIssue) {
    return {
      kind: "select-github-workunit",
      stop: false,
      target: `Issue #${anyIssue.number}`,
      reason: "open GitHub WorkUnit exists",
      next_action: `implementation gate: plan-first for GitHub issue #${anyIssue.number}`
    };
  }

  return {
    kind: "production-game-intake-required",
    stop: false,
    target: "new GitHub issue",
    reason: "GitHub queue empty is not a stop condition",
    next_action: "Intake gate: create a production game quality WorkUnit from P0.5 Idle Core + Creative Rescue"
  };
}

function makeState({ runnerId, iteration, dryRun, allowCreateIssue, snapshot, action, startedAt }) {
  return {
    schemaVersion: 1,
    kind: "studio-v3-live-runner-state",
    runner_id: runnerId,
    runner_kind: "studio-v3-live-runner",
    status: "running",
    dry_run: dryRun,
    allow_create_issue: allowCreateIssue,
    started_at: startedAt,
    updated_at: new Date().toISOString(),
    iteration,
    source_of_truth: "github-authoritative",
    queue_empty_is_stop: false,
    branch: run("git", ["branch", "--show-current"], "unknown"),
    main_commit: snapshot.mainCommit ?? "unknown",
    open_issues: (snapshot.openIssues ?? []).map((issue) => ({
      number: issue.number,
      title: issue.title,
      url: issue.url,
      updatedAt: issue.updatedAt,
      labels: normalizeLabels(issue.labels)
    })),
    open_prs: (snapshot.openPrs ?? []).map((pr) => ({
      number: pr.number,
      title: pr.title,
      url: pr.url,
      isDraft: Boolean(pr.isDraft),
      headRefName: pr.headRefName,
      updatedAt: pr.updatedAt,
      checks: checkSummary(pr.statusCheckRollup).normalized
    })),
    main_runs: (snapshot.mainRuns ?? []).map((runEntry) => ({
      databaseId: runEntry.databaseId,
      name: runEntry.name,
      workflowName: runEntry.workflowName,
      status: runEntry.status,
      conclusion: runEntry.conclusion,
      headSha: runEntry.headSha,
      url: runEntry.url,
      createdAt: runEntry.createdAt
    })),
    decision: action,
    production_game_quality_gate: {
      active_campaign: "P0.5 Idle Core + Creative Rescue",
      required_axes: ["player verb", "production/progression role", "screen moment", "asset/FX", "playtest evidence"],
      queue_empty_action: "create or select a production game quality WorkUnit, not a checker-only side quest",
      browser_use_required_for_visible_gameplay: true
    }
  };
}

function reportMarkdown(state) {
  const issueRows = state.open_issues.length ? state.open_issues.map((issue) => [`#${issue.number}`, issue.title, issue.labels.join(", "), issue.url]) : [["none", "GitHub queue empty", "", ""]];
  const prRows = state.open_prs.length ? state.open_prs.map((pr) => [`#${pr.number}`, pr.isDraft ? "draft" : "ready", pr.title, pr.checks.map((check) => `${check.name}:${check.status}/${check.conclusion || "pending"}`).join("<br>"), pr.url]) : [["none", "", "", "", ""]];
  const runRows = state.main_runs.length ? state.main_runs.slice(0, 5).map((runEntry) => [runEntry.databaseId, runEntry.workflowName ?? runEntry.name, runEntry.status, runEntry.conclusion ?? "", runEntry.url]) : [["none", "", "", "", ""]];

  return `# Studio Harness v3 Live Runner Report

- Runner: \`${state.runner_id}\`
- Iteration: ${state.iteration}
- Updated: ${state.updated_at}
- Source of truth: ${state.source_of_truth}
- Dry run: ${state.dry_run}
- Queue empty is stop: ${state.queue_empty_is_stop}
- Decision: \`${state.decision.kind}\`
- Target: ${state.decision.target}
- Next action: ${state.decision.next_action}

## Open GitHub issues

${table(["Issue", "Title", "Labels", "URL"], issueRows)}

## Open GitHub PRs

${table(["PR", "State", "Title", "Checks", "URL"], prRows)}

## Latest main runs

${table(["Run", "Workflow", "Status", "Conclusion", "URL"], runRows)}

## Production game quality intake rule

Queue empty is not a stop condition. If there is no legal GitHub WorkUnit, the runner must create or prepare an Intake WorkUnit that improves \`이상한 씨앗상회\` production game quality. The next game issue must include at least three of: player verb, production/progression role, screen moment, asset/FX, playtest evidence. Visible gameplay work requires Game Studio route and Browser Use evidence.
`;
}

function writeStateAndReport(state, statePath, reportPath) {
  ensureDir(statePath);
  ensureDir(reportPath);
  fs.writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`);
  fs.writeFileSync(reportPath, reportMarkdown(state));
}

function writeHeartbeat(state, heartbeatArgs) {
  if (hasFlag("no-heartbeat")) return;
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const writeHeartbeatScript = path.join(scriptDir, "write-operator-heartbeat.mjs");
  const commandArgs = [
    writeHeartbeatScript,
    "--phase", "studio-v3-live-runner",
    "--iteration", String(state.iteration),
    "--issue", heartbeatArgs.issue || String(state.open_issues[0]?.number ?? ""),
    "--pr", heartbeatArgs.pr || String(state.open_prs[0]?.number ?? ""),
    "--item", heartbeatArgs.item,
    "--branch", state.branch,
    "--command", `studio-v3-live-runner ${state.decision.kind}`,
    "--next", state.decision.next_action,
    "--context", heartbeatArgs.reportPath,
    "--status", "running"
  ];
  execFileSync(process.execPath, commandArgs, { stdio: ["ignore", "ignore", "inherit"] });
}

function maybeCreateIntakeIssue(state, dryRun, allowCreateIssue) {
  if (state.decision.kind !== "production-game-intake-required") return null;
  if (dryRun || !allowCreateIssue) return null;

  const bodyPath = `reports/operations/studio-v3-production-intake-${todayCompact()}.md`;
  const body = `# 다음 production game quality WorkUnit intake\n\n## 문제 / 배경\n\nStudio Harness v3 live runner가 GitHub queue empty를 감지했다. Queue empty는 stop condition이 아니므로 P0.5 Idle Core + Creative Rescue 기준으로 다음 production game quality WorkUnit을 intake한다.\n\n## 수용 기준\n\n- [ ] player verb + production/progression role + screen moment + asset/FX + playtest evidence 중 최소 3개를 plan-first로 명시한다.\n- [ ] Game Studio route를 고정한다.\n- [ ] visible gameplay이면 Browser Use evidence 또는 current-session blocker를 남긴다.\n`;
  ensureDir(bodyPath);
  fs.writeFileSync(bodyPath, body);
  const url = run("gh", ["issue", "create", "--title", "다음 production game quality WorkUnit을 intake한다", "--body-file", bodyPath], "");
  return { url, bodyPath };
}

async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

const runnerId = readArg("runner-id", `studio-v3-${Date.now()}`);
const dryRun = !hasFlag("no-dry-run") && (hasFlag("dry-run") || readArg("dry-run", "true") !== "false");
const once = hasFlag("once");
const allowCreateIssue = hasFlag("allow-create-issue");
const durationHours = Number(readArg("duration-hours", once ? "0" : "24"));
const intervalSeconds = Math.max(1, Number(readArg("interval-seconds", "300")));
const maxIterations = Math.max(0, Number(readArg("max-iterations", once ? "1" : "0")));
const startedAt = new Date().toISOString();
const statePath = readArg("state", ".omx/state/studio-v3-live-runner.json");
const reportPath = readArg("report", `reports/operations/studio-v3-live-runner-${todayCompact()}.md`);
const fixturePath = readArg("offline-fixture", "");
const heartbeatIssue = readArg("issue", "");
const heartbeatPr = readArg("pr", "");
const heartbeatItem = readArg("item", "");
const startedMs = Date.now();
let iteration = 0;
let latestState = null;

while (true) {
  iteration += 1;
  const snapshot = fixturePath ? snapshotFromFixture(fixturePath) : snapshotFromGitHub();
  const action = classifyNextAction(snapshot);
  latestState = makeState({ runnerId, iteration, dryRun, allowCreateIssue, snapshot, action, startedAt });
  const createdIssue = maybeCreateIntakeIssue(latestState, dryRun, allowCreateIssue);
  if (createdIssue) latestState.created_issue = createdIssue;
  writeStateAndReport(latestState, statePath, reportPath);
  writeHeartbeat(latestState, { issue: heartbeatIssue, pr: heartbeatPr, item: heartbeatItem, reportPath });

  if (once || (maxIterations > 0 && iteration >= maxIterations)) break;
  if (durationHours > 0 && Date.now() - startedMs >= durationHours * 60 * 60 * 1000) break;
  await sleep(intervalSeconds * 1000);
}

const summary = {
  ok: true,
  runner_id: runnerId,
  iterations: iteration,
  state: statePath,
  report: reportPath,
  decision: latestState?.decision,
  dry_run: dryRun
};
console.log(JSON.stringify(summary, null, 2));
