import fs from "node:fs";

const args = process.argv.slice(2);

function readArg(name, fallback = "") {
  const index = args.indexOf(`--${name}`);
  if (index === -1) return fallback;
  return args[index + 1] ?? fallback;
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    return { __readError: error.message };
  }
}

function validatePublicationGate(heartbeat, label) {
  const failures = [];
  if (!heartbeat || heartbeat.__readError) {
    return [`${label}: unreadable heartbeat JSON${heartbeat?.__readError ? `: ${heartbeat.__readError}` : ""}`];
  }

  const gate = heartbeat.publication_gate;
  const gateIsActive = heartbeat.phase === "external-publication-gate" || gate?.active === true;
  if (!gateIsActive) return failures;

  if (!gate) failures.push(`${label}: external publication gate phase requires publication_gate object`);
  if (gate && gate.kind !== "representational_communication") failures.push(`${label}: publication_gate.kind must be representational_communication`);
  if (gate && !["github_issue", "github_pr", "github_comment"].includes(gate.target)) {
    failures.push(`${label}: publication_gate.target must be github_issue, github_pr, or github_comment`);
  }
  if (gate && !gate.pending_command) failures.push(`${label}: publication_gate.pending_command is required`);
  if (gate && !gate.branch) failures.push(`${label}: publication_gate.branch is required`);
  if (gate && !gate.commit) failures.push(`${label}: publication_gate.commit is required`);
  if (gate && !gate.body_file) failures.push(`${label}: publication_gate.body_file is required`);
  if (gate && !gate.dedupe_key) failures.push(`${label}: publication_gate.dedupe_key is required`);
  if (gate && gate.repeat_policy !== "do_not_repeat_final_ask") {
    failures.push(`${label}: publication_gate.repeat_policy must be do_not_repeat_final_ask`);
  }
  if (gate?.pending_command && gate.pending_command.includes("gh ") && !gate.pending_command.includes("--body-file") && !gate.pending_command.includes("body=@")) {
    failures.push(`${label}: publication_gate.pending_command must publish GitHub text through --body-file or file payload`);
  }

  const confirmation = heartbeat.confirmation;
  if (!confirmation) failures.push(`${label}: publication gate requires confirmation object`);
  if (confirmation?.channel === "final") failures.push(`${label}: confirmation.channel must not be final`);
  if (confirmation && !["commentary", "tool", "preapproved"].includes(confirmation.channel)) {
    failures.push(`${label}: confirmation.channel must be commentary, tool, or preapproved`);
  }
  const routineGithubPublication = Boolean(gate?.pending_command && /\bgh\s+(issue|pr)\s+(create|edit|comment|merge|ready)\b/.test(gate.pending_command));
  if (routineGithubPublication) {
    if (confirmation?.required !== false || confirmation?.channel !== "preapproved") {
      failures.push(`${label}: routine GitHub issue/PR/comment publication must be preapproved, not an action-time confirmation wait`);
    }
  }

  const continuation = heartbeat.continuation;
  if (!continuation) failures.push(`${label}: publication gate requires continuation object`);
  if (continuation && !continuation.action) failures.push(`${label}: continuation.action is required`);
  if (continuation && !continuation.artifact_path) failures.push(`${label}: continuation.artifact_path is required`);
  if (continuation?.artifact_path && !fs.existsSync(continuation.artifact_path)) {
    failures.push(`${label}: continuation.artifact_path does not exist: ${continuation.artifact_path}`);
  }
  if (continuation && !continuation.safe_local_work) failures.push(`${label}: continuation.safe_local_work is required`);
  if (
    !routineGithubPublication &&
    continuation?.safe_local_work &&
    /no remaining local safe work/i.test(continuation.safe_local_work) &&
    !/await action-time confirmation without repeated ask/i.test(continuation.action ?? "")
  ) {
    failures.push(`${label}: continuation.action must wait without repeated ask when no local safe work remains`);
  }
  if (routineGithubPublication && /await action-time confirmation/i.test(continuation?.action ?? "")) {
    failures.push(`${label}: routine GitHub publication must not wait for action-time confirmation`);
  }

  if (heartbeat.stop_rule && heartbeat.stop_rule !== "none" && !["credential", "destructive", "external-production", "payment", "customer-data", "hard-blocker", "user-stop", "timebox"].includes(heartbeat.stop_rule)) {
    failures.push(`${label}: stop_rule is not recognized: ${heartbeat.stop_rule}`);
  }

  return failures;
}

const fixtures = [
  {
    label: "fixture:good-routine-github-publication",
    shouldPass: true,
    heartbeat: {
      schemaVersion: 1,
      kind: "operator-heartbeat",
      phase: "external-publication-gate",
      publication_gate: {
        active: true,
        kind: "representational_communication",
        target: "github_pr",
        pending_command: "gh pr create --body-file reports/operations/pr.md",
        body_file: "reports/operations/pr.md",
        dedupe_key: "github_pr|codex/example|abc1234|reports/operations/pr.md",
        repeat_policy: "do_not_repeat_final_ask",
        branch: "codex/example",
        commit: "abc1234"
      },
      confirmation: { required: false, channel: "preapproved" },
      continuation: {
        action: "execute GitHub publication and watch checks",
        artifact_path: "items/0134-seed-ops-final-publication-ask-regression.md",
        safe_local_work: "publish routine GitHub body-file command"
      },
      stop_rule: "none"
    }
  },
  {
    label: "fixture:bad-routine-github-self-imposed-wait",
    shouldPass: false,
    heartbeat: {
      schemaVersion: 1,
      kind: "operator-heartbeat",
      phase: "external-publication-gate",
      publication_gate: {
        active: true,
        kind: "representational_communication",
        target: "github_pr",
        pending_command: "gh pr create --body-file reports/operations/pr.md",
        body_file: "reports/operations/pr.md",
        dedupe_key: "github_pr|codex/example|abc1234|reports/operations/pr.md",
        repeat_policy: "do_not_repeat_final_ask",
        branch: "codex/example",
        commit: "abc1234"
      },
      confirmation: { required: true, channel: "commentary" },
      continuation: {
        action: "await action-time confirmation without repeated ask",
        artifact_path: "items/0134-seed-ops-final-publication-ask-regression.md",
        safe_local_work: "no remaining local safe work"
      },
      stop_rule: "none"
    }
  },
  {
    label: "fixture:bad-final-channel",
    shouldPass: false,
    heartbeat: {
      schemaVersion: 1,
      kind: "operator-heartbeat",
      phase: "external-publication-gate",
      publication_gate: {
        active: true,
        kind: "representational_communication",
        target: "github_pr",
        pending_command: "gh pr create --body-file reports/operations/pr.md",
        body_file: "reports/operations/pr.md",
        dedupe_key: "github_pr|codex/example|abc1234|reports/operations/pr.md",
        repeat_policy: "do_not_repeat_final_ask",
        branch: "codex/example",
        commit: "abc1234"
      },
      confirmation: { required: true, channel: "final" },
      continuation: {
        action: "write next issue plan",
        artifact_path: "items/0134-seed-ops-final-publication-ask-regression.md",
        safe_local_work: "harden local checker"
      },
      stop_rule: "none"
    }
  },
  {
    label: "fixture:bad-missing-continuation",
    shouldPass: false,
    heartbeat: {
      schemaVersion: 1,
      kind: "operator-heartbeat",
      phase: "external-publication-gate",
      publication_gate: {
        active: true,
        kind: "representational_communication",
        target: "github_issue",
        pending_command: "gh issue create --body-file reports/operations/issue.md",
        body_file: "reports/operations/issue.md",
        dedupe_key: "github_issue|codex/example|abc1234|reports/operations/issue.md",
        repeat_policy: "do_not_repeat_final_ask",
        branch: "codex/example",
        commit: "abc1234"
      },
      confirmation: { required: true, channel: "commentary" },
      stop_rule: "none"
    }
  }
];

const failures = [];
for (const fixture of fixtures) {
  const fixtureFailures = validatePublicationGate(fixture.heartbeat, fixture.label);
  if (fixture.shouldPass && fixtureFailures.length > 0) failures.push(...fixtureFailures);
  if (!fixture.shouldPass && fixtureFailures.length === 0) failures.push(`${fixture.label}: unexpectedly passed`);
}

const heartbeatPath = readArg("heartbeat", ".omx/state/operator-heartbeat.json");
if (fs.existsSync(heartbeatPath)) {
  failures.push(...validatePublicationGate(readJson(heartbeatPath), `current:${heartbeatPath}`));
}

console.log(JSON.stringify({ ok: failures.length === 0, heartbeat: heartbeatPath, fixtures: fixtures.length, failures }, null, 2));
if (failures.length > 0) process.exit(1);
