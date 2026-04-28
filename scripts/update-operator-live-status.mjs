import fs from "node:fs";
import { execFileSync } from "node:child_process";

const args = new Map();
for (let index = 2; index < process.argv.length; index += 1) {
  const arg = process.argv[index];
  if (!arg.startsWith("--")) continue;
  const key = arg.slice(2);
  const next = process.argv[index + 1];
  if (next && !next.startsWith("--")) {
    args.set(key, next);
    index += 1;
  } else {
    args.set(key, "true");
  }
}

const envPath = args.get("env") ?? ".omx/logs/operator-4h-trial-restart-current.env";
const outputPath = args.get("output") ?? `reports/operations/operator-live-status-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}.md`;
const maxAgeSeconds = Number.parseInt(args.get("max-age-seconds") ?? "600", 10);
const checkOnly = args.get("check") === "true";
const now = new Date();
const reportDate = formatReportDate(outputPath, now);

const snapshot = buildSnapshot({ envPath, maxAgeSeconds, now });
const markdown = renderMarkdown(snapshot, reportDate);

if (checkOnly) {
  if (!fs.existsSync(outputPath)) {
    console.error(JSON.stringify({ ok: false, failure: `missing live status report: ${outputPath}` }, null, 2));
    process.exit(1);
  }

  const current = fs.readFileSync(outputPath, "utf8");
  const requiredPhrases = [
    "Operator Live Status",
    "Heartbeat freshness",
    "Heartbeat count",
    "Deadline",
    "Last heartbeat",
    "Completed issue-to-PR loops",
    "Known recovery",
    "Next action",
    "Issue: #53"
  ];
  const failures = requiredPhrases.filter((phrase) => !current.includes(phrase));
  console.log(JSON.stringify({ ok: failures.length === 0, outputPath, failures }, null, 2));
  if (failures.length > 0) process.exit(1);
  process.exit(0);
}

fs.mkdirSync(outputPath.split("/").slice(0, -1).join("/"), { recursive: true });
fs.writeFileSync(outputPath, markdown);
console.log(JSON.stringify({ ok: true, outputPath, status: snapshot.status, heartbeatCount: snapshot.heartbeatCount }, null, 2));

function buildSnapshot({ envPath, maxAgeSeconds, now }) {
  const env = fs.existsSync(envPath) ? parseEnv(fs.readFileSync(envPath, "utf8")) : null;
  const heartbeatPath = env?.HB_LOG;
  const heartbeats = heartbeatPath && fs.existsSync(heartbeatPath) ? readJsonl(heartbeatPath) : [];
  const firstHeartbeat = heartbeats.at(0) ?? null;
  const lastHeartbeat = heartbeats.at(-1) ?? null;
  const lastAt = lastHeartbeat?.timestamp ? new Date(lastHeartbeat.timestamp) : null;
  const ageSeconds = lastAt ? Math.max(0, Math.round((now.getTime() - lastAt.getTime()) / 1000)) : null;
  const fresh = ageSeconds !== null && ageSeconds <= maxAgeSeconds;
  const deadline = env?.DEADLINE ? new Date(Number(env.DEADLINE) * 1000) : null;
  const completedLoops = readCompletedLoops(firstHeartbeat?.timestamp ?? env?.RESTART);
  const recoveryReports = fs.existsSync("reports/operations")
    ? fs
        .readdirSync("reports/operations")
        .filter((name) => name.startsWith("stuck-") && name.endsWith(".md"))
        .sort()
        .map((name) => `reports/operations/${name}`)
    : [];

  return {
    generatedAt: now.toISOString(),
    envPath,
    env,
    status: env ? (fresh ? "fresh" : "stale") : "not-running",
    maxAgeSeconds,
    heartbeatPath: heartbeatPath ?? "n/a",
    heartbeatCount: heartbeats.length,
    firstHeartbeat,
    lastHeartbeat,
    ageSeconds,
    deadline: deadline?.toISOString() ?? "n/a",
    completedLoops,
    recoveryReports,
    nextAction: lastHeartbeat?.next_action ?? "runtime env or heartbeat missing; inspect Issue #53 and .omx logs before claiming completion"
  };
}

function parseEnv(raw) {
  return Object.fromEntries(
    raw
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [key, ...rest] = line.split("=");
        return [key, rest.join("=")];
      })
  );
}

function readJsonl(filePath) {
  return fs
    .readFileSync(filePath, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function readCompletedLoops(startedAt) {
  try {
    const raw = execFileSync(
      "gh",
      ["pr", "list", "--state", "merged", "--limit", "30", "--json", "number,title,mergedAt,url,headRefName"],
      { encoding: "utf8" }
    );
    const started = startedAt ? Date.parse(startedAt) : 0;
    return JSON.parse(raw)
      .filter((pr) => Date.parse(pr.mergedAt) >= started)
      .sort((first, second) => Date.parse(first.mergedAt) - Date.parse(second.mergedAt))
      .map((pr) => ({
        label: `PR #${pr.number}`,
        title: pr.title,
        mergedAt: pr.mergedAt,
        url: pr.url,
        branch: pr.headRefName
      }));
  } catch {
    return [];
  }
}

function formatReportDate(outputPath, now) {
  const match = outputPath.match(/operator-live-status-(\d{4})(\d{2})(\d{2})\.md$/);
  return match ? `${match[1]}-${match[2]}-${match[3]}` : now.toISOString().slice(0, 10);
}

function renderMarkdown(snapshot, reportDate) {
  const last = snapshot.lastHeartbeat;
  const completed = snapshot.completedLoops.length
    ? snapshot.completedLoops
        .map((item) => `- ${item.label}: ${item.title} (${item.mergedAt}) — ${item.url}`)
        .join("\n")
    : "- No merged PRs found from local GitHub query; inspect Issue #53 comments and git history.";
  const recovery = snapshot.recoveryReports.length
    ? snapshot.recoveryReports.map((report) => `- ${report}`).join("\n")
    : "- No stuck reports found.";

  return `# Operator Live Status — ${reportDate}

Status: ${snapshot.status}
Issue: #53
Generated at: ${snapshot.generatedAt}

## Runtime source

- Env file: \`${snapshot.envPath}\`
- Heartbeat log: \`${snapshot.heartbeatPath}\`
- Context snapshot: \`${snapshot.env?.CONTEXT ?? "n/a"}\`
- Summary path: \`${snapshot.env?.SUMMARY ?? "n/a"}\`

## Heartbeat freshness

- Heartbeat freshness: ${snapshot.status === "fresh" ? "fresh" : snapshot.status === "stale" ? "stale" : "not-running"}
- Max age seconds: ${snapshot.maxAgeSeconds}
- Last heartbeat age seconds: ${snapshot.ageSeconds ?? "n/a"}
- Heartbeat count: ${snapshot.heartbeatCount}
- Deadline: ${snapshot.deadline}

## Last heartbeat

- Timestamp: ${last?.timestamp ?? "n/a"}
- Phase: ${last?.phase ?? "n/a"}
- Branch: ${last?.branch ?? "n/a"}
- Commit: ${last?.commit ?? "n/a"}
- Dirty: ${String(last?.dirty ?? "n/a")}
- Current command: ${last?.current_command ?? "n/a"}
- Next action: ${snapshot.nextAction}

## Completed issue-to-PR loops

${completed}

## Known recovery

${recovery}

## Stop rules observed

- Do not call red CI complete.
- Do not use credentials, customer data, payment, login, ads SDK, external deployment, or real GTM channels.
- Do not enable \`ENABLE_AGENT_AUTOMERGE\`.
- If heartbeat is stale, write a stuck report before claiming completion.

## Next action

${snapshot.nextAction}
`;
}
