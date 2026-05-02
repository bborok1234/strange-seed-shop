import fs from "node:fs";
import { reconstructWorkUnit } from "./studio-v3-bot-runner.mjs";

const fixtures = [
  {
    label: "valid-github-gate-event-chain",
    filePath: "reports/operations/fixtures/studio-v3-bot-runner-valid.json",
    expected: {
      authorization: true,
      status: "synced",
      gate_events: 1,
      recovery_states: []
    }
  },
  {
    label: "local-campaign-ledger-authority-regression",
    filePath: "reports/operations/fixtures/studio-v3-bot-runner-local-ledger-authority.json",
    expected: {
      authorization: false,
      status: "quarantined",
      failureIncludes: "local ledger attempted to authorize gate advance"
    }
  },
  {
    label: "routine-github-human-handoff-regression",
    filePath: "reports/operations/fixtures/studio-v3-bot-runner-human-handoff.json",
    expected: {
      authorization: false,
      status: "human-handoff-regression",
      failureIncludes: "routine Git/GitHub publication was handed off to a human"
    }
  },
  {
    label: "stale-dirty-local-work-recovery",
    filePath: "reports/operations/fixtures/studio-v3-bot-runner-stale-dirty-branch.json",
    expected: {
      authorization: false,
      status: "recovery-state",
      recovery_states: ["stale-local-branch", "unpushed-dirty-work"]
    }
  },
  {
    label: "gate-event-hash-mismatch-taint",
    filePath: "reports/operations/fixtures/studio-v3-bot-runner-bad-hash.json",
    expected: {
      authorization: false,
      status: "tainted/reconciliation-required",
      failureIncludes: "next_state_hash mismatch"
    }
  }
];

const requiredDocPhrases = {
  "docs/STUDIO_HARNESS_V3_AUTONOMOUS_DESIGN.md": [
    "Latest valid GateEvent chain plus GitHub fields/checks reconstructs current state",
    "local ledger may summarize GitHub, but must never authorize work",
    "stale runner heartbeat",
    "pending-publication",
    "tainted/reconciliation-required",
    "Queue Manager",
    "PR Manager",
    "CI Repair Runner",
    "Watchdog"
  ],
  "docs/OPERATOR_RUNBOOK.md": [
    "GitHub issue/PR/GateEvent",
    "local campaign ledger",
    "routine git/GitHub actions"
  ],
  "docs/PROJECT_COMMANDS.md": [
    "GitHub issue/PR/GateEvent",
    "Never authorize work from local campaign ledger alone",
    "routine git/GitHub actions"
  ],
  "package.json": [
    "check:studio-v3-bot-runner",
    "scripts/check-studio-v3-bot-runner.mjs",
    "scripts/studio-v3-bot-runner.mjs"
  ],
  "items/0140-studio-v3-bot-runner-checker.md": [
    "Issue: #276",
    "## Plan",
    "GitHub issue/PR/GateEvent",
    "local `campaigns/**`만으로 gate advance",
    "routine branch push, PR create/update, issue/comment update",
    "stale local branch",
    "npm run check:studio-v3-bot-runner"
  ]
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function includesAll(haystack, needles) {
  return needles.every((needle) => haystack.includes(needle));
}

const failures = [];
const results = [];

for (const fixture of fixtures) {
  if (!fs.existsSync(fixture.filePath)) {
    failures.push(`${fixture.label}: missing fixture ${fixture.filePath}`);
    continue;
  }

  const result = reconstructWorkUnit(readJson(fixture.filePath));
  results.push({ label: fixture.label, filePath: fixture.filePath, result });
  const expected = fixture.expected;

  if (result.authorization !== expected.authorization) {
    failures.push(`${fixture.label}: expected authorization ${expected.authorization}, got ${result.authorization}`);
  }

  if (result.status !== expected.status) {
    failures.push(`${fixture.label}: expected status ${expected.status}, got ${result.status}`);
  }

  if (expected.gate_events !== undefined && result.gate_events !== expected.gate_events) {
    failures.push(`${fixture.label}: expected ${expected.gate_events} GateEvent, got ${result.gate_events}`);
  }

  if (expected.recovery_states && !includesAll(result.recovery_states, expected.recovery_states)) {
    failures.push(`${fixture.label}: expected recovery states ${expected.recovery_states.join(", ")}, got ${result.recovery_states.join(", ")}`);
  }

  if (expected.failureIncludes && !result.failures.some((failure) => failure.includes(expected.failureIncludes))) {
    failures.push(`${fixture.label}: expected failure containing ${expected.failureIncludes}; got ${result.failures.join(" | ")}`);
  }
}

for (const [filePath, phrases] of Object.entries(requiredDocPhrases)) {
  if (!fs.existsSync(filePath)) {
    failures.push(`missing required file: ${filePath}`);
    continue;
  }

  const content = fs.readFileSync(filePath, "utf8");
  for (const phrase of phrases) {
    if (!content.includes(phrase)) failures.push(`${filePath} missing phrase: ${phrase}`);
  }
}

const packageJson = readJson("package.json");
const scripts = packageJson.scripts ?? {};
if (scripts["check:studio-v3-bot-runner"] !== "node scripts/check-studio-v3-bot-runner.mjs") {
  failures.push("package.json script check:studio-v3-bot-runner must run node scripts/check-studio-v3-bot-runner.mjs");
}

if (!String(scripts["check:ci"] ?? "").includes("npm run check:studio-v3-bot-runner")) {
  failures.push("package.json check:ci must include npm run check:studio-v3-bot-runner");
}

console.log(
  JSON.stringify(
    {
      ok: failures.length === 0,
      fixtures: results.map((entry) => ({
        label: entry.label,
        status: entry.result.status,
        authorization: entry.result.authorization,
        gate_events: entry.result.gate_events,
        recovery_states: entry.result.recovery_states,
        failures: entry.result.failures
      })),
      checkedDocs: Object.keys(requiredDocPhrases),
      failures
    },
    null,
    2
  )
);

if (failures.length > 0) process.exit(1);
