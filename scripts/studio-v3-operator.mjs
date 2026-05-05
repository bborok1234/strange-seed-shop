import { execFileSync, spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const scriptPath = fileURLToPath(import.meta.url);

function readArg(name, fallback = "") {
  const index = args.indexOf(`--${name}`);
  if (index === -1) return fallback;
  return args[index + 1] ?? fallback;
}

function hasFlag(name) {
  return args.includes(`--${name}`);
}

function todayCompact(date = new Date()) {
  return date.toISOString().slice(0, 10).replaceAll("-", "");
}

function timestampCompact(date = new Date()) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function shellQuote(value) {
  return `'${String(value).replaceAll("'", "'\\''")}'`;
}

function run(command, commandArgs, fallback = "") {
  try {
    return execFileSync(command, commandArgs, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  } catch {
    return fallback;
  }
}

function commandExists(command) {
  return Boolean(run("sh", ["-lc", `command -v ${shellQuote(command)}`], ""));
}

function usage() {
  return `Studio Harness v3 foreground operator entrypoint (Codex backend)

Usage:
  npm run studio:v3:operate -- --help
  npm run studio:v3:operate -- --doctor --print-command
  npm run studio:v3:operate -- --duration-hours 24
  npm run studio:v3:operate -- --detached --duration-hours 24 --interval-seconds 300
  npm run studio:v3:operate -- --prompt-only --issue 293
  npm run studio:v3:operate -- --axis garden-respecting-hud-assets --cycle-a-approved

What this is:
  v3 native foreground Codex/OMX operator starter. It prepares and launches the
  operator prompt for GitHub-authoritative WorkUnit execution: plan-first,
  branch, implementation, Browser Use iab QA, focused checks, PR, GitHub checks,
  merge, main CI observation, and next WorkUnit continuation.

  When Codex usage limit is hit (or the active pass stalls past the idle
  timeout), the supervisor stops cleanly and points at the in-session skill
  /studio-operate, which runs the same workflow inside an interactive Claude
  Code session under your subscription terms.

What this is not:
  This does not call or route through $seed-ops. $seed-ops is not the v3
  foreground operator entrypoint. It also does not spawn 'claude' as a
  subprocess — for the Claude path, use the /studio-operate skill in your
  Claude Code session (optionally /loop or /schedule for recurrence).

Options:
  --doctor              Print readiness checks for git/gh/codex/omx/node_repl.
  --strict-doctor       Exit non-zero if required readiness checks fail.
  --print-command       Print the exact foreground or detached command.
  --prompt-only         Write the v3 operator prompt and report, then exit.
  --detached            Start a detached supervised operator process and write PID/log paths.
  --duration-hours N    Supervision timebox. Default: 24.
  --interval-seconds N  Delay before restarting a completed Codex pass. Default: 300.
  --max-iterations N    Maximum Codex passes. 0 means until duration expires. Default: 0.
  --idle-timeout-minutes N  Kill the active Codex pass if no stdout/stderr for N minutes. Default: 10.
  --issue N             Initial GitHub WorkUnit issue number to prioritize.
  --axis SLUG           Selected studio deliberation axis to run before ordinary queue work.
  --cycle-a-approved    Record the standing user decision that Cycle A close is OK.
  --worktree PATH       Repo path for Codex/OMX execution. Default: current directory.
  --backend omx|codex   Execution backend. Default: omx if installed, otherwise codex.
  --prompt PATH         Prompt output path. Default: .omx/state/studio-v3-operator-prompt.md.
  --state PATH          State output path. Default: .omx/state/studio-v3-operator.json.
  --report PATH         Report output path. Default: reports/operations/studio-v3-operator-YYYYMMDD.md.
  --log PATH            Detached log path. Default: .omx/logs/studio-v3-operator-TIMESTAMP.log.
  --pid PATH            Detached pid path. Default: .omx/state/studio-v3-operator.pid.
  --yolo                Use Codex bypass flag instead of config/sandbox flags.
`;
}

function doctorChecks(worktree, backend) {
  const checks = [];
  const add = (name, ok, required, details = "") => checks.push({ name, ok: Boolean(ok), required: Boolean(required), details });

  add("git command", commandExists("git"), true, run("sh", ["-lc", "command -v git"], "not found"));
  add("inside git worktree", run("git", ["-C", worktree, "rev-parse", "--is-inside-work-tree"], "") === "true", true, worktree);
  add("gh command", commandExists("gh"), true, run("sh", ["-lc", "command -v gh"], "not found"));
  add("gh auth", run("gh", ["auth", "status"], "").length > 0, false, "needed for issue/PR/comment/check/merge mutation");
  add("codex command", commandExists("codex"), true, run("sh", ["-lc", "command -v codex"], "not found"));
  add("omx command", commandExists("omx"), backend === "omx", run("sh", ["-lc", "command -v omx"], "not found"));

  const mcp = run("codex", ["mcp", "get", "node_repl"], "");
  add("Browser Use Node REPL MCP", mcp.includes("node_repl") || mcp.includes("command"), false, mcp ? "node_repl configured" : "run: codex mcp add node_repl -- /Applications/Codex.app/Contents/Resources/node_repl");

  const nodeReplPath = "/Applications/Codex.app/Contents/Resources/node_repl";
  add("Codex App node_repl binary", fs.existsSync(nodeReplPath), false, nodeReplPath);

  return checks;
}

function formatChecks(checks) {
  const rows = checks.map((check) => `| ${check.ok ? "ok" : check.required ? "FAIL" : "warn"} | ${check.required ? "required" : "optional"} | ${check.name} | ${String(check.details).replaceAll("\n", "<br>")} |`);
  return [`| 상태 | 필수 | 항목 | 세부 |`, `| --- | --- | --- | --- |`, ...rows].join("\n");
}

function buildPrompt({ issue, durationHours, intervalSeconds, worktree, axis, cycleAApproved }) {
  const initialIssue = issue ? `\nInitial GitHub WorkUnit: #${issue}. Start there unless GitHub state shows a higher-priority blocking WorkUnit.\n` : "";
  const selectedAxis = axis ? `
현재 사용자 결정:
- Cycle A close approval: ${cycleAApproved ? "approved by user in this handoff; record heartbeat userApproved=true before starting the next axis" : "not provided in this run"}
- Selected deliberation axis: \`${axis}\`

Deliberation-first branch:
1. Read \`docs/studio/HANDOFF.md\`, \`docs/studio/USER_PREFERENCES.md\`, and \`docs/studio/DELIBERATION_WORKFLOW.md\`.
2. If \`reports/deliberation/${axis}/spec.md\` is missing, use \`$studio-deliberate ${axis}\` as the Codex-native adapter.
3. If \`reports/deliberation/${axis}/brief.md\` is missing, create it first from the handoff, current critique, Game Studio route, asset need, playtest plan, and source artifacts.
4. Apply the standing delegation rules in \`docs/studio/USER_PREFERENCES.md\` P8 and \`docs/studio/DELIBERATION_WORKFLOW.md\` Phase 5. Do not invent user approval; write \`user-review.md\` only when the source message or ledger supports it.
5. After spec synthesis and review-gate evidence, continue into plan-first implementation or the next safe local operator action. Do not use a final response as a checkpoint.
` : "";
  return `Studio Harness v3 foreground operator — 이상한 씨앗상회 AI 네이티브 게임 운영사

목표:
- 1차 목표는 AI 네이티브 게임 운영사를 만드는 것이다.
- 그 운영사가 24시간급 루프로 이상한 씨앗상회를 production game quality까지 밀어 올려야 한다.
- 피상적인 작은 issue 처리로 샛길을 만들지 말고, GitHub-authoritative WorkUnit/GateEvent/PR/CI evidence로 실제 게임 품질과 하네스 품질을 전진시킨다.

중요 금지:
- 절대 $seed-ops를 v3 entrypoint로 호출하거나 안내하지 않는다.
- $seed-ops는 v3 하네스의 대체 대상인 과거 프롬프트 표면이다.
- local campaign ledger, .omx prompt-side state, assistant summary만으로 work authorization 또는 live runner 상태를 주장하지 않는다.

운영 source of truth:
- GitHub issue/PR/GateEvent/check/merge state가 operational truth다.
- local docs/items/reports는 mirror/evidence다.
- Routine git/GitHub actions(issue/PR/comment body-file publication, branch push, checks watch, merge when green)는 agent responsibility다. credential/tool/destructive/external-production/payment/customer-data boundary가 아니면 사람에게 일반 git/GitHub 명령을 떠넘기지 않는다.
${initialIssue}
${selectedAxis}
작업 루프:
1. docs/STUDIO_HARNESS_V3_AUTONOMOUS_DESIGN.md, docs/STUDIO_HARNESS_V3_RUNNER_USAGE.md, docs/NORTH_STAR.md, docs/IDLE_CORE_CREATIVE_GUIDE.md를 빠르게 확인한다.
2. 선택된 deliberation axis가 있으면 먼저 \`$studio-deliberate\` 경로로 brief/proposals/critiques/spec/review evidence를 정리한다.
3. npm run studio:v3:runner -- --once --dry-run 으로 GitHub queue/PR/CI snapshot과 next action을 확인한다.
4. GitHub issue queue에서 합법 WorkUnit을 선택한다. 없으면 queue empty를 종료가 아니라 production game quality Intake WorkUnit 생성으로 처리한다.
5. 구현 전 items/<id>.md 또는 동등 plan artifact에 ## Plan, 수용 기준, 검증 명령, 리스크, Game Studio route(visible gameplay일 때), Subagent/Team Routing을 작성한다.
6. branch를 만들고 scope 안에서 구현한다.
7. visible gameplay/HUD/playfield/assets/QA는 Game Studio route를 먼저 고정하고 Browser Use iab를 우선 사용한다. Codex CLI에서 Browser Use가 안 보이면 node_repl MCP js readiness를 확인하고 현재 세션 blocker를 reports/visual/에 기록한다. Playwright는 반복 regression gate이지 Browser Use hands-on QA 대체재가 아니다.
8. focused checks -> 필요한 full checks -> PR body-file 작성 -> branch push -> PR create/update -> GitHub checks watch/repair -> merge when green -> main CI observation을 수행한다.
9. Release/Retro/daily report/merge/queue empty는 checkpoint일 뿐 종료 사유가 아니다. stop rule이 없으면 즉시 다음 GitHub WorkUnit을 plan-first로 이어간다.

중단 사유:
- user stop/close/interrupt/cancel
- token/context/model runtime exhaustion (codex usage limit 포함)
- network/GitHub/tool/filesystem/machine outage로 안전한 continuation 불가
- destructive/credential/payment/external-production/customer-data boundary with no safe local continuation
- force majeure

Codex 한도/idle로 supervisor가 멈추면 사용자는 Claude Code 세션에서 /studio-operate 스킬로 같은 작업 루프를 이어갈 수 있다.

실행 파라미터:
- worktree: ${worktree}
- supervision target: ${durationHours}h, restart interval after completed pass: ${intervalSeconds}s
- selected deliberation axis: ${axis || "none"}
- cycle-a-approved: ${cycleAApproved}
- final user-facing report는 위 중단 사유가 있을 때만 허용한다. 그 외에는 commentary checkpoint와 다음 plan artifact/heartbeat를 남기고 계속한다.
`;
}

function writeReport({ reportPath, promptPath, statePath, checks, commandText, detachedCommandText, issue, backend, worktree, idleTimeoutMinutes, axis, cycleAApproved }) {
  ensureDir(reportPath);
  const report = `# Studio Harness v3 Foreground Operator Entry

- Updated: ${new Date().toISOString()}
- Backend: ${backend}
- Idle timeout: ${idleTimeoutMinutes} min (per Codex pass; supervisor stops cleanly on idle/limit)
- Worktree: \`${worktree}\`
- Initial issue: ${issue ? `#${issue}` : "auto from GitHub queue"}
- Selected deliberation axis: ${axis ? `\`${axis}\`` : "none"}
- Cycle A approved: ${cycleAApproved}
- Prompt: \`${promptPath}\`
- State: \`${statePath}\`

## 정정

이 entrypoint는 \`$seed-ops\`를 사용하지 않는다. Studio Harness v3는 과거 \`$seed-ops\` 루프를 대체하는 GitHub-authoritative foreground operator surface다.

이 스크립트는 Codex/OMX만 spawn한다. Claude path가 필요하면 Claude Code 세션에서 \`/studio-operate\` 스킬을 호출한다 (반복은 \`/loop 5m /studio-operate\` 또는 \`/schedule\`).

## Readiness

${formatChecks(checks)}

## Foreground command

\`\`\`bash
${commandText}
\`\`\`

## Detached command

\`\`\`bash
${detachedCommandText}
\`\`\`
`;
  fs.writeFileSync(reportPath, report);
}

function buildExecArgs({ backend, worktree, yolo }) {
  const base = backend === "omx" ? ["exec"] : ["exec"];
  const safety = yolo
    ? ["--dangerously-bypass-approvals-and-sandbox"]
    : ["-c", 'approval_policy="never"', "--sandbox", "danger-full-access"];
  return [...base, "-C", worktree, ...safety, "-"];
}

function buildCommandText({ backend, worktree, promptPath, yolo }) {
  const command = backend === "omx" ? "omx" : "codex";
  const argsText = buildExecArgs({ backend, worktree, yolo }).map(shellQuote).join(" ");
  return `${command} ${argsText} < ${shellQuote(promptPath)}`;
}

function buildDetachedCommandText({ durationHours, intervalSeconds, maxIterations, issue, axis, cycleAApproved, worktree, backend, promptPath, statePath, reportPath, logPath, pidPath, yolo, idleTimeoutMinutes }) {
  const scriptArgs = [
    scriptPath,
    "--supervisor",
    "--duration-hours", String(durationHours),
    "--interval-seconds", String(intervalSeconds),
    "--max-iterations", String(maxIterations),
    "--idle-timeout-minutes", String(idleTimeoutMinutes),
    "--worktree", worktree,
    "--backend", backend,
    "--prompt", promptPath,
    "--state", statePath,
    "--report", reportPath
  ];
  if (issue) scriptArgs.push("--issue", String(issue));
  if (axis) scriptArgs.push("--axis", String(axis));
  if (cycleAApproved) scriptArgs.push("--cycle-a-approved");
  if (yolo) scriptArgs.push("--yolo");
  const nodeCommand = [process.execPath, ...scriptArgs].map(shellQuote).join(" ");
  return `mkdir -p ${shellQuote(path.dirname(logPath))} ${shellQuote(path.dirname(pidPath))}\nnohup ${nodeCommand} > ${shellQuote(logPath)} 2>&1 &\necho $! > ${shellQuote(pidPath)}`;
}

function writeState(statePath, state) {
  ensureDir(statePath);
  fs.writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`);
}

const CODEX_LIMIT_PATTERNS = [
  /rate[- ]?limit(?:ed|ing|\s*exceeded|\s*reached|\s*hit)?/i,
  /usage limit/i,
  /quota exceeded/i,
  /too many requests/i,
  /you[' ]?ve hit (?:your |the )?(?:rate |usage )?limit/i,
  /\bratelimited\b/i,
  /\bstatus[: ]+429\b/i,
  /limit resets? in \d/i,
  /please try again (?:in|after) \d/i,
];

function detectLimit(text) {
  for (const pattern of CODEX_LIMIT_PATTERNS) {
    if (pattern.test(text)) return pattern.source;
  }
  return null;
}

function detectLimitInStream(text, streamName) {
  // Codex/OMX echoes the submitted user prompt on stdout. The operator prompt
  // intentionally describes limit handling, so scanning stdout creates a
  // false positive before the first assistant pass starts. Runtime limit
  // failures are expected on stderr.
  if (streamName !== "stderr") return null;
  return detectLimit(text);
}

function runMonitoredPass({ command, args, prompt, worktree, idleTimeoutMs }) {
  return new Promise((resolve) => {
    process.stderr.write(`[operator] launching ${command} (cwd=${worktree}, idle-timeout=${Math.round(idleTimeoutMs / 1000)}s, prompt=${prompt.length} chars)\n`);
    let child;
    try {
      child = spawn(command, args, { cwd: worktree, stdio: ["pipe", "pipe", "pipe"] });
    } catch (err) {
      resolve({ status: 1, signal: null, error: err.message, limitMatch: null, killedReason: null, command });
      return;
    }
    process.stderr.write(`[operator] ${command} pid=${child.pid} started; awaiting first stdio...\n`);
    let limitMatch = null;
    let killedReason = null;
    let lastOutputAt = Date.now();
    const killChild = (reason) => {
      if (killedReason) return;
      killedReason = reason;
      try { child.kill("SIGTERM"); } catch {}
      const fallbackKill = setTimeout(() => { try { child.kill("SIGKILL"); } catch {} }, 5000);
      fallbackKill.unref?.();
    };
    const onChunk = (chunk, sink, streamName) => {
      sink.write(chunk);
      lastOutputAt = Date.now();
      if (limitMatch) return;
      const match = detectLimitInStream(chunk.toString(), streamName);
      if (match) {
        limitMatch = match;
        killChild("limit-detected");
      }
    };
    child.stdout.on("data", (chunk) => onChunk(chunk, process.stdout, "stdout"));
    child.stderr.on("data", (chunk) => onChunk(chunk, process.stderr, "stderr"));
    const interval = Math.max(5000, Math.min(30000, Math.floor(idleTimeoutMs / 4)));
    const idleTimer = setInterval(() => {
      if (Date.now() - lastOutputAt > idleTimeoutMs) killChild("idle-timeout");
    }, interval);
    idleTimer.unref?.();
    child.on("error", (err) => {
      clearInterval(idleTimer);
      resolve({ status: 1, signal: null, error: err.message, limitMatch, killedReason, command });
    });
    child.on("exit", (status, signal) => {
      clearInterval(idleTimer);
      process.stderr.write(`[operator] ${command} pid=${child.pid} exited status=${status} signal=${signal ?? "none"} limitMatch=${limitMatch ?? "none"} killedReason=${killedReason ?? "none"}\n`);
      resolve({
        status: status ?? (signal ? 1 : 0),
        signal: signal ?? null,
        error: null,
        limitMatch,
        killedReason,
        command,
      });
    });
    try {
      child.stdin.end(prompt);
    } catch (err) {
      clearInterval(idleTimer);
      resolve({ status: 1, signal: null, error: err.message, limitMatch, killedReason, command });
    }
  });
}

async function runCodexPass({ backend, worktree, prompt, yolo, idleTimeoutMs }) {
  const command = backend === "omx" ? "omx" : "codex";
  return runMonitoredPass({
    command,
    args: buildExecArgs({ backend, worktree, yolo }),
    prompt,
    worktree,
    idleTimeoutMs,
  });
}

async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function supervise({ backend, worktree, prompt, statePath, durationHours, intervalSeconds, maxIterations, yolo, idleTimeoutMs, axis, cycleAApproved }) {
  const startedAt = new Date();
  const deadlineMs = startedAt.getTime() + durationHours * 60 * 60 * 1000;
  let iteration = 0;
  writeState(statePath, {
    schemaVersion: 1,
    kind: "studio-v3-foreground-operator-state",
    status: "running",
    backend,
    worktree,
    started_at: startedAt.toISOString(),
    updated_at: new Date().toISOString(),
    duration_hours: durationHours,
    interval_seconds: intervalSeconds,
    idle_timeout_ms: idleTimeoutMs,
    max_iterations: maxIterations,
    selected_axis: axis || null,
    cycle_a_approved: Boolean(cycleAApproved),
    seed_ops_entrypoint: false,
  });

  while (Date.now() < deadlineMs && (maxIterations === 0 || iteration < maxIterations)) {
    iteration += 1;
    writeState(statePath, {
      schemaVersion: 1,
      kind: "studio-v3-foreground-operator-state",
      status: "running-codex-pass",
      backend,
      worktree,
      started_at: startedAt.toISOString(),
      updated_at: new Date().toISOString(),
      duration_hours: durationHours,
      interval_seconds: intervalSeconds,
      iteration,
      selected_axis: axis || null,
      cycle_a_approved: Boolean(cycleAApproved),
      seed_ops_entrypoint: false,
    });
    const result = await runCodexPass({ backend, worktree, prompt, yolo, idleTimeoutMs });
    const limitTriggered = Boolean(result.limitMatch) || result.killedReason === "idle-timeout";
    writeState(statePath, {
      schemaVersion: 1,
      kind: "studio-v3-foreground-operator-state",
      status: limitTriggered ? "codex-stopped-limit-or-idle" : (result.status === 0 ? "codex-pass-completed" : "codex-pass-failed"),
      backend,
      worktree,
      started_at: startedAt.toISOString(),
      updated_at: new Date().toISOString(),
      duration_hours: durationHours,
      interval_seconds: intervalSeconds,
      iteration,
      last_result: result,
      selected_axis: axis || null,
      cycle_a_approved: Boolean(cycleAApproved),
      next_action_hint: limitTriggered
        ? "Codex 한도/idle로 supervisor를 중단했다. Claude Code 세션에서 /studio-operate 스킬로 작업 루프를 계속한다."
        : null,
      seed_ops_entrypoint: false,
    });
    if (limitTriggered) {
      process.stderr.write(`[operator] codex stopped (${result.limitMatch ? "limit" : "idle"}). Switching to in-session: run /studio-operate inside Claude Code.\n`);
      return;
    }
    if (Date.now() >= deadlineMs || (maxIterations > 0 && iteration >= maxIterations)) break;
    process.stderr.write(`[operator] iteration ${iteration} done; sleeping ${intervalSeconds}s before next pass\n`);
    await sleep(intervalSeconds * 1000);
  }

  writeState(statePath, {
    schemaVersion: 1,
    kind: "studio-v3-foreground-operator-state",
    status: "duration-complete",
    backend,
    worktree,
    started_at: startedAt.toISOString(),
    updated_at: new Date().toISOString(),
    duration_hours: durationHours,
    interval_seconds: intervalSeconds,
    iterations: iteration,
    selected_axis: axis || null,
    cycle_a_approved: Boolean(cycleAApproved),
    seed_ops_entrypoint: false,
  });
}

const help = hasFlag("help") || hasFlag("h");
if (hasFlag("self-test-limit-detection")) {
  const echoedPrompt = "user\\nCodex 한도/idle로 supervisor가 멈추면 usage limit recovery path를 쓴다.";
  const realLimit = "Error: you've hit your usage limit. Please try again later.";
  const checks = [
    {
      name: "stdout prompt echo does not trigger limit",
      ok: detectLimitInStream(echoedPrompt, "stdout") === null
    },
    {
      name: "stderr usage limit still triggers limit",
      ok: Boolean(detectLimitInStream(realLimit, "stderr"))
    }
  ];
  const ok = checks.every((check) => check.ok);
  console.log(JSON.stringify({ ok, checks }, null, 2));
  process.exit(ok ? 0 : 1);
}
if (help) {
  console.log(usage());
  process.exit(0);
}

const worktree = path.resolve(readArg("worktree", process.cwd()));
const backendRaw = readArg("backend", commandExists("omx") ? "omx" : "codex");
if (backendRaw !== "omx" && backendRaw !== "codex") {
  console.error(`[operator] Unsupported --backend "${backendRaw}". This script only spawns codex/omx. For the Claude path, run /studio-operate inside a Claude Code session.`);
  process.exit(2);
}
const backend = backendRaw;
const issue = readArg("issue", "");
const axis = readArg("axis", "");
const cycleAApproved = hasFlag("cycle-a-approved");
const durationHours = Number(readArg("duration-hours", "24"));
const intervalSeconds = Math.max(1, Number(readArg("interval-seconds", "300")));
const maxIterations = Math.max(0, Number(readArg("max-iterations", "0")));
const idleTimeoutMinutes = Math.max(1, Number(readArg("idle-timeout-minutes", "10")));
const idleTimeoutMs = idleTimeoutMinutes * 60 * 1000;
const promptPath = readArg("prompt", ".omx/state/studio-v3-operator-prompt.md");
const statePath = readArg("state", ".omx/state/studio-v3-operator.json");
const reportPath = readArg("report", `reports/operations/studio-v3-operator-${todayCompact()}.md`);
const logPath = readArg("log", `.omx/logs/studio-v3-operator-${timestampCompact()}.log`);
const pidPath = readArg("pid", ".omx/state/studio-v3-operator.pid");
const yolo = hasFlag("yolo");
const prompt = buildPrompt({ issue, durationHours, intervalSeconds, worktree, axis, cycleAApproved });
const checks = doctorChecks(worktree, backend);

ensureDir(promptPath);
fs.writeFileSync(promptPath, prompt);

const commandText = buildCommandText({ backend, worktree, promptPath, yolo });
const detachedCommandText = buildDetachedCommandText({ durationHours, intervalSeconds, maxIterations, issue, axis, cycleAApproved, worktree, backend, promptPath, statePath, reportPath, logPath, pidPath, yolo, idleTimeoutMinutes });
writeReport({ reportPath, promptPath, statePath, checks, commandText, detachedCommandText, issue, backend, worktree, idleTimeoutMinutes, axis, cycleAApproved });

const strictDoctor = hasFlag("strict-doctor");
const doctor = hasFlag("doctor");
const printCommand = hasFlag("print-command");
const promptOnly = hasFlag("prompt-only");
const detached = hasFlag("detached");
const supervisor = hasFlag("supervisor");

if (doctor) {
  const failedRequired = checks.filter((check) => check.required && !check.ok);
  console.log(JSON.stringify({ ok: failedRequired.length === 0, backend, idle_timeout_minutes: idleTimeoutMinutes, worktree, prompt: promptPath, report: reportPath, axis, cycle_a_approved: cycleAApproved, checks }, null, 2));
  if (printCommand) {
    console.log("\n# foreground");
    console.log(commandText);
    console.log("\n# detached");
    console.log(detachedCommandText);
  }
  if (strictDoctor && failedRequired.length > 0) process.exit(1);
  process.exit(0);
}

if (printCommand) {
  console.log(detached ? detachedCommandText : commandText);
  process.exit(0);
}

if (promptOnly) {
  console.log(JSON.stringify({ ok: true, prompt: promptPath, report: reportPath, state: statePath, axis, cycle_a_approved: cycleAApproved, seed_ops_entrypoint: false }, null, 2));
  process.exit(0);
}

if (detached) {
  ensureDir(logPath);
  ensureDir(pidPath);
  const childArgs = [
    scriptPath,
    "--supervisor",
    "--duration-hours", String(durationHours),
    "--interval-seconds", String(intervalSeconds),
    "--max-iterations", String(maxIterations),
    "--idle-timeout-minutes", String(idleTimeoutMinutes),
    "--worktree", worktree,
    "--backend", backend,
    "--prompt", promptPath,
    "--state", statePath,
    "--report", reportPath,
  ];
  if (issue) childArgs.push("--issue", String(issue));
  if (axis) childArgs.push("--axis", String(axis));
  if (cycleAApproved) childArgs.push("--cycle-a-approved");
  if (yolo) childArgs.push("--yolo");
  const out = fs.openSync(logPath, "a");
  const child = spawn(process.execPath, childArgs, { detached: true, stdio: ["ignore", out, out] });
  child.unref();
  fs.writeFileSync(pidPath, `${child.pid}\n`);
  writeState(statePath, {
    schemaVersion: 1,
    kind: "studio-v3-foreground-operator-state",
    status: "detached-started",
    backend,
    worktree,
    pid: child.pid,
    log: logPath,
    prompt: promptPath,
    report: reportPath,
    updated_at: new Date().toISOString(),
    selected_axis: axis || null,
    cycle_a_approved: Boolean(cycleAApproved),
    seed_ops_entrypoint: false,
  });
  console.log(JSON.stringify({ ok: true, status: "detached-started", pid: child.pid, pidPath, logPath, prompt: promptPath, report: reportPath }, null, 2));
  process.exit(0);
}

if (supervisor) {
  await supervise({ backend, worktree, prompt, statePath, durationHours, intervalSeconds, maxIterations, yolo, idleTimeoutMs, axis, cycleAApproved });
  process.exit(0);
}

await supervise({ backend, worktree, prompt, statePath, durationHours, intervalSeconds, maxIterations, yolo, idleTimeoutMs, axis, cycleAApproved });
