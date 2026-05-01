import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const failures = [];

function readArg(name, fallback = "") {
  const index = args.indexOf(`--${name}`);
  if (index === -1) return fallback;
  return args[index + 1] ?? fallback;
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    failures.push(`${filePath} has invalid JSON: ${error.message}`);
    return null;
  }
}

function collectRalphStates(root = ".omx/state/sessions") {
  if (!fs.existsSync(root)) return [];

  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(root, entry.name, "ralph-state.json"))
    .filter((filePath) => fs.existsSync(filePath))
    .map((filePath) => ({ filePath, state: readJson(filePath) }))
    .filter((entry) => entry.state);
}

function classifyRalphState(entry) {
  const state = entry.state;
  const runner = state.runner ?? {};
  const isPromptSideOnly = state.active === true && state.current_phase === "starting" && Number(state.iteration ?? 0) === 0 && !runner.kind;
  const isDetachedRunner = runner.kind === "detached";
  const heartbeatPath = runner.heartbeat_path ?? state.heartbeat_path ?? "";
  const driverPath = runner.driver_path ?? state.driver ?? "";

  if (isPromptSideOnly) {
    return {
      filePath: entry.filePath,
      status: "prompt-side-only",
      active: state.active,
      current_phase: state.current_phase,
      iteration: state.iteration ?? 0,
      runner_kind: runner.kind ?? "",
      heartbeat_path: heartbeatPath,
      driver_path: driverPath
    };
  }

  if (isDetachedRunner) {
    if (!driverPath || !fs.existsSync(driverPath)) {
      failures.push(`${entry.filePath}: detached runner missing existing driver_path`);
    }
    if (!heartbeatPath || !fs.existsSync(heartbeatPath)) {
      failures.push(`${entry.filePath}: detached runner missing existing heartbeat_path`);
    }

    return {
      filePath: entry.filePath,
      status: "detached-runner",
      active: state.active,
      current_phase: state.current_phase,
      iteration: state.iteration ?? 0,
      runner_kind: runner.kind,
      heartbeat_path: heartbeatPath,
      driver_path: driverPath
    };
  }

  return {
    filePath: entry.filePath,
    status: state.active ? "foreground-or-legacy" : "inactive",
    active: state.active,
    current_phase: state.current_phase,
    iteration: state.iteration ?? 0,
    runner_kind: runner.kind ?? "",
    heartbeat_path: heartbeatPath,
    driver_path: driverPath
  };
}

function validateFixture(name, state, expectedStatus) {
  const before = failures.length;
  const result = classifyRalphState({ filePath: `fixture:${name}`, state });
  if (result.status !== expectedStatus) {
    failures.push(`fixture:${name}: expected ${expectedStatus}, got ${result.status}`);
  }
  return failures.length === before;
}

validateFixture(
  "prompt-side-only",
  {
    active: true,
    mode: "ralph",
    current_phase: "starting",
    iteration: 0
  },
  "prompt-side-only"
);

validateFixture(
  "inactive-complete",
  {
    active: false,
    mode: "ralph",
    current_phase: "complete",
    iteration: 3
  },
  "inactive"
);

const statePath = readArg("state", "");
const entries = statePath ? [{ filePath: statePath, state: readJson(statePath) }].filter((entry) => entry.state) : collectRalphStates();
const classifications = entries.map(classifyRalphState);

console.log(
  JSON.stringify(
    {
      ok: failures.length === 0,
      checked: classifications.length,
      promptSideOnly: classifications.filter((entry) => entry.status === "prompt-side-only").length,
      detachedRunners: classifications.filter((entry) => entry.status === "detached-runner").length,
      classifications: classifications.slice(-10),
      failures
    },
    null,
    2
  )
);

if (failures.length > 0) process.exit(1);
