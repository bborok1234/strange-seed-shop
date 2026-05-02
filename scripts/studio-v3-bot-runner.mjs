import crypto from "node:crypto";
import fs from "node:fs";

const args = process.argv.slice(2);

function readArg(name, fallback = "") {
  const index = args.indexOf(`--${name}`);
  if (index === -1) return fallback;
  return args[index + 1] ?? fallback;
}

function hasFlag(name) {
  return args.includes(`--${name}`);
}

export const GATE_EVENT_SCHEMA = "studio-gate-event/v1";

const orderedGateIndex = new Map(
  [
    "Intake",
    "Research",
    "Creative Direction",
    "Prototype Plan",
    "Throwaway Prototype",
    "Playtest",
    "Keep / Kill / Pivot",
    "Productionization",
    "Release",
    "Retro"
  ].map((gate, index) => [gate, index])
);

function normalizeValue(value) {
  if (Array.isArray(value)) {
    return value.map(normalizeValue).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, normalizeValue(value[key] ?? null)]));
  }

  return value ?? null;
}

export function canonicalJson(value) {
  return JSON.stringify(normalizeValue(value));
}

export function stateHash(value) {
  return `sha256:${crypto.createHash("sha256").update(canonicalJson(value)).digest("hex")}`;
}

function compactLabels(labels = []) {
  return labels
    .map((label) => (typeof label === "string" ? label : label?.name ?? ""))
    .filter(Boolean)
    .sort();
}

function normalizeRepo(input) {
  return input.repo ?? input.github?.repo ?? input.github?.issue?.repo ?? "unknown/repo";
}

function normalizeIssue(input) {
  return input.github?.issue ?? input.issue ?? null;
}

function normalizePrs(input) {
  return input.github?.prs ?? input.prs ?? [];
}

function normalizeComments(input) {
  return input.github?.comments ?? input.comments ?? normalizeIssue(input)?.comments ?? [];
}

function issueNumber(input) {
  return Number(normalizeIssue(input)?.number ?? input.issue_number ?? 0);
}

function initialState(input) {
  const issue = normalizeIssue(input);
  const repo = normalizeRepo(input);
  const number = issueNumber(input);

  return {
    repo,
    issue_number: number,
    current_gate: issue?.gate ?? "Intake",
    labels: compactLabels(issue?.labels ?? []),
    linked_branch: issue?.linked_branch ?? null,
    linked_pr_number: issue?.linked_pr ?? null,
    head_sha: issue?.head_sha ?? null,
    latest_gate_event_id: null,
    verification_status: issue?.verification_status ?? "unknown",
    publication_state: issue?.publication_state ?? "published"
  };
}

function applyGateEvent(state, event) {
  return {
    ...state,
    current_gate: event.gate_to ?? state.current_gate,
    labels: compactLabels(event.labels ?? state.labels),
    linked_branch: event.branch ?? state.linked_branch ?? null,
    linked_pr_number: event.pr_number ?? state.linked_pr_number ?? null,
    head_sha: event.head_sha ?? state.head_sha ?? null,
    latest_gate_event_id: event.event_id,
    verification_status: event.verification_status ?? state.verification_status ?? "unknown",
    publication_state: event.publication_state ?? state.publication_state ?? "published"
  };
}

export function makeGateEvent(input, eventDraft) {
  const previousState = eventDraft.previous_state ? eventDraft.previous_state : initialState(input);
  const previous_state_hash = stateHash(previousState);
  const nextState = applyGateEvent(previousState, { ...eventDraft, previous_state_hash, next_state_hash: "" });
  const next_state_hash = stateHash(nextState);
  return { ...eventDraft, previous_state_hash, next_state_hash };
}

function parseJsonCandidate(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function extractGateEventFromBody(body) {
  if (!body || typeof body !== "string") return null;
  const markerMatch = body.match(/<!--\s*STUDIO_GATE_EVENT:START\s*-->([\s\S]*?)<!--\s*STUDIO_GATE_EVENT:END\s*-->/i);
  if (markerMatch) return parseJsonCandidate(markerMatch[1].trim());

  const fencedMatch = body.match(/```(?:json)?\s*([\s\S]*?"schema_version"\s*:\s*"studio-gate-event\/v1"[\s\S]*?)```/i);
  if (fencedMatch) return parseJsonCandidate(fencedMatch[1].trim());

  const trimmed = body.trim();
  if (trimmed.startsWith("{") && trimmed.includes(GATE_EVENT_SCHEMA)) return parseJsonCandidate(trimmed);
  return null;
}

function gateEventsFromComments(comments) {
  return comments
    .map((comment, index) => ({ comment, index, event: comment?.event ?? extractGateEventFromBody(comment?.body ?? "") }))
    .filter((entry) => entry.event)
    .map((entry) => ({ ...entry.event, __comment_index: entry.index }));
}

function detectRoutineHumanHandoff(input) {
  const issue = normalizeIssue(input);
  const prs = normalizePrs(input);
  const comments = normalizeComments(input);
  const haystack = [issue?.body, ...prs.map((pr) => pr.body), ...comments.map((comment) => comment.body)].filter(Boolean).join("\n---\n");
  const patterns = [
    /(?:human|user|maintainer|사람|사용자|휴먼).{0,80}(?:git push|gh pr create|gh pr edit|gh issue comment|gh issue edit|gh pr merge|PR 생성|PR 수정|이슈 수정|댓글 게시|머지|push)/i,
    /(?:git push|gh pr create|gh pr edit|gh issue comment|gh issue edit|gh pr merge).{0,80}(?:please|대신|실행해|해줘|부탁|handoff|넘긴다)/i,
    /final\s+.*(?:ask|confirm).{0,80}(?:PR|issue|GitHub|publication)/i
  ];

  return patterns.find((pattern) => pattern.test(haystack))?.source ?? "";
}

function localLedgerAttemptsAuthority(input) {
  const mirror = input.local_mirror ?? input.local_ledger ?? input.campaigns ?? null;
  if (!mirror) return false;
  if (mirror.authorizes_gate_advance === true) return true;
  if (mirror.authority === "local" || mirror.source === "campaigns") return true;
  if (mirror.gate && !mirror.github_issue_number) return true;
  return false;
}

function classifyLocalRecovery(input, reconstructedState) {
  const localGit = input.local_git ?? {};
  const recoveries = [];
  const linkedBranch = reconstructedState.linked_branch;

  if (localGit.branch && localGit.branch !== "main" && linkedBranch && localGit.branch !== linkedBranch) {
    recoveries.push("stale-local-branch");
  }

  if (localGit.branch && localGit.branch !== "main" && localGit.upstream_exists === false) {
    recoveries.push("stale-local-branch");
  }

  if (localGit.dirty === true && localGit.pushed !== true) {
    recoveries.push("unpushed-dirty-work");
  }

  return [...new Set(recoveries)];
}

function validateGateEvent(event, index, state, failures) {
  const label = `GateEvent[${index}]`;
  if (event.schema_version !== GATE_EVENT_SCHEMA) failures.push(`${label}: schema_version must be ${GATE_EVENT_SCHEMA}`);
  for (const field of ["event_id", "event_type", "repo", "issue_number", "gate_from", "gate_to", "actor", "timestamp", "publication_state", "previous_state_hash", "next_state_hash"]) {
    if (event[field] === undefined || event[field] === null || event[field] === "") failures.push(`${label}: missing ${field}`);
  }

  if (event.repo && event.repo !== state.repo) failures.push(`${label}: repo mismatch ${event.repo} != ${state.repo}`);
  if (Number(event.issue_number) !== Number(state.issue_number)) failures.push(`${label}: issue_number mismatch ${event.issue_number} != ${state.issue_number}`);
  if (event.gate_from && event.gate_from !== state.current_gate) failures.push(`${label}: gate_from ${event.gate_from} does not match current gate ${state.current_gate}`);

  if (orderedGateIndex.has(event.gate_from) && orderedGateIndex.has(event.gate_to)) {
    const from = orderedGateIndex.get(event.gate_from);
    const to = orderedGateIndex.get(event.gate_to);
    if (to < from && event.gate_to !== "Intake") failures.push(`${label}: impossible gate regression ${event.gate_from} -> ${event.gate_to}`);
  }

  const expectedPrevious = stateHash(state);
  if (event.previous_state_hash !== expectedPrevious) failures.push(`${label}: previous_state_hash mismatch expected ${expectedPrevious}, got ${event.previous_state_hash}`);

  const nextState = applyGateEvent(state, event);
  const expectedNext = stateHash(nextState);
  if (event.next_state_hash !== expectedNext) failures.push(`${label}: next_state_hash mismatch expected ${expectedNext}, got ${event.next_state_hash}`);

  return nextState;
}

export function reconstructWorkUnit(input) {
  const failures = [];
  const warnings = [];
  const issue = normalizeIssue(input);
  const prs = normalizePrs(input);
  const events = gateEventsFromComments(normalizeComments(input));

  if (!issue) failures.push("missing GitHub issue anchor");
  if (localLedgerAttemptsAuthority(input)) failures.push("local ledger attempted to authorize gate advance");

  let state = initialState(input);
  for (const [index, event] of events.entries()) {
    state = validateGateEvent(event, index, state, failures);
  }

  const linkedPr = prs.find((pr) => Number(pr.number) === Number(state.linked_pr_number)) ?? null;
  if (state.current_gate === "Productionization" || state.current_gate === "Release") {
    if (!state.linked_pr_number && !input.pending_pr_target) failures.push(`${state.current_gate}: linked PR or pending PR target is required`);
  }

  if (state.linked_pr_number && !linkedPr) warnings.push(`linked PR #${state.linked_pr_number} not present in fixture metadata`);

  const handoffPattern = detectRoutineHumanHandoff(input);
  if (handoffPattern) failures.push(`routine Git/GitHub publication was handed off to a human: ${handoffPattern}`);

  const recovery_states = classifyLocalRecovery(input, state);
  let status = "synced";
  let authorization = failures.length === 0;

  if (recovery_states.length > 0) {
    status = "recovery-state";
    authorization = false;
  }

  if (failures.some((failure) => failure.includes("local ledger"))) {
    status = "quarantined";
    authorization = false;
  }

  if (failures.some((failure) => failure.includes("human"))) {
    status = "human-handoff-regression";
    authorization = false;
  }

  if (failures.some((failure) => failure.includes("hash") || failure.includes("GateEvent") || failure.includes("impossible"))) {
    status = "tainted/reconciliation-required";
    authorization = false;
  }

  if (failures.some((failure) => failure.includes("missing GitHub issue"))) {
    status = "quarantined";
    authorization = false;
  }

  return {
    ok: failures.length === 0 && recovery_states.length === 0,
    authorization,
    status,
    source_of_truth: "github-authoritative",
    work_unit: {
      repo: state.repo,
      issue_number: state.issue_number,
      issue_url: issue?.url ?? null,
      title: issue?.title ?? null,
      gate: state.current_gate,
      labels: state.labels,
      linked_branch: state.linked_branch,
      linked_pr: state.linked_pr_number,
      current_state_hash: stateHash(state),
      publication_state: state.publication_state,
      latest_gate_event_id: state.latest_gate_event_id
    },
    gate_events: events.length,
    recovery_states,
    failures,
    warnings
  };
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const fixturePath = readArg("fixture", "");
  const inputPath = readArg("input", fixturePath);
  if (!inputPath) {
    console.error("usage: node scripts/studio-v3-bot-runner.mjs --fixture <fixture.json> [--require-authorized]");
    process.exit(2);
  }

  const result = reconstructWorkUnit(readJson(inputPath));
  console.log(JSON.stringify(result, null, 2));

  if (hasFlag("require-authorized") && !result.authorization) process.exit(1);
  if (hasFlag("fail-on-problems") && (!result.ok || result.failures.length > 0)) process.exit(1);
}
