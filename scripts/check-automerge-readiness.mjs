const labels = (process.env.PR_LABELS ?? "")
  .split(",")
  .map((label) => label.trim())
  .filter(Boolean);

const context = {
  eventName: process.env.GITHUB_EVENT_NAME ?? "local",
  prNumber: process.env.PR_NUMBER ?? "",
  headRef: process.env.PR_HEAD_REF ?? "",
  baseRef: process.env.PR_BASE_REF ?? "",
  isFork: process.env.PR_IS_FORK === "true",
  labels,
  requiredLabel: process.env.REQUIRED_AUTOMERGE_LABEL ?? "agent-automerge",
  allowedBranchPrefixes: (process.env.ALLOWED_AUTOMERGE_BRANCH_PREFIXES ?? "codex/,agent/")
    .split(",")
    .map((prefix) => prefix.trim())
    .filter(Boolean)
};

const failures = [];

if (context.eventName !== "pull_request") {
  failures.push(`pull_request event required, got ${context.eventName}`);
}

if (context.baseRef !== "main") {
  failures.push(`base branch must be main, got ${context.baseRef || "(empty)"}`);
}

if (context.isFork) {
  failures.push("fork pull requests are not eligible for agent automerge");
}

if (!context.labels.includes(context.requiredLabel)) {
  failures.push(`missing label: ${context.requiredLabel}`);
}

if (!context.allowedBranchPrefixes.some((prefix) => context.headRef.startsWith(prefix))) {
  failures.push(
    `head branch must start with one of: ${context.allowedBranchPrefixes.join(", ")}; got ${context.headRef || "(empty)"}`
  );
}

const result = {
  ok: failures.length === 0,
  context,
  failures
};

console.log(JSON.stringify(result, null, 2));

if (!result.ok) {
  process.exit(1);
}
