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
  return `Studio Harness v3 foreground operator entrypoint

Usage:
  npm run studio:v3:operate -- --help
  npm run studio:v3:operate -- --doctor --print-command
  npm run studio:v3:operate -- --duration-hours 24
  npm run studio:v3:operate -- --detached --duration-hours 24 --interval-seconds 300
  npm run studio:v3:operate -- --prompt-only --issue 293

What this is:
  v3 native foreground Codex/OMX operator starter. It prepares and launches the
  operator prompt for GitHub-authoritative WorkUnit execution: plan-first,
  branch, implementation, Browser Use iab QA, focused checks, PR, GitHub checks,
  merge, main CI observation, and next WorkUnit continuation.

What this is not:
  This does not call or route through $seed-ops. $seed-ops is not the v3
  foreground operator entrypoint.

Options:
  --doctor              Print readiness checks for git/gh/codex/omx/node_repl.
  --strict-doctor       Exit non-zero if required readiness checks fail.
  --print-command       Print the exact foreground or detached command.
  --prompt-only         Write the v3 operator prompt and report, then exit.
  --detached            Start a detached supervised operator process and write PID/log paths.
  --duration-hours N    Supervision timebox. Default: 24.
  --interval-seconds N  Delay before restarting a completed Codex pass. Default: 300.
  --max-iterations N    Maximum Codex passes. 0 means until duration expires. Default: 0.
  --issue N             Initial GitHub WorkUnit issue number to prioritize.
  --worktree PATH       Repo path for Codex/OMX execution. Default: current directory.
  --backend omx|codex|claude  Execution backend. Default: omx if installed, otherwise codex. Use claude to skip Codex entirely.
  --fallback claude|none  Fallback backend when Codex hits a usage/rate limit or stalls. Default: claude if installed, otherwise none.
  --idle-timeout-minutes N  Kill the active Codex pass if no stdout/stderr for N minutes. Default: 10.
  --codex-cooldown-minutes N  After a Codex limit/stall, route to fallback for N minutes before retrying Codex. Default: 60.
  --prompt PATH         Prompt output path. Default: .omx/state/studio-v3-operator-prompt.md.
  --state PATH          State output path. Default: .omx/state/studio-v3-operator.json.
  --report PATH         Report output path. Default: reports/operations/studio-v3-operator-YYYYMMDD.md.
  --log PATH            Detached log path. Default: .omx/logs/studio-v3-operator-TIMESTAMP.log.
  --pid PATH            Detached pid path. Default: .omx/state/studio-v3-operator.pid.
  --yolo                Use Codex bypass flag instead of config/sandbox flags. Also enables claude --dangerously-skip-permissions on fallback.
`;
}

function doctorChecks(worktree, backend, fallback) {
  const checks = [];
  const add = (name, ok, required, details = "") => checks.push({ name, ok: Boolean(ok), required: Boolean(required), details });

  add("git command", commandExists("git"), true, run("sh", ["-lc", "command -v git"], "not found"));
  add("inside git worktree", run("git", ["-C", worktree, "rev-parse", "--is-inside-work-tree"], "") === "true", true, worktree);
  add("gh command", commandExists("gh"), true, run("sh", ["-lc", "command -v gh"], "not found"));
  add("gh auth", run("gh", ["auth", "status"], "").length > 0, false, "needed for issue/PR/comment/check/merge mutation");
  add("codex command", commandExists("codex"), backend !== "claude", run("sh", ["-lc", "command -v codex"], "not found"));
  add("omx command", commandExists("omx"), backend === "omx", run("sh", ["-lc", "command -v omx"], "not found"));
  add("claude command", commandExists("claude"), backend === "claude" || fallback === "claude", run("sh", ["-lc", "command -v claude"], "not found"));

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

function buildPrompt({ issue, durationHours, intervalSeconds, worktree }) {
  const initialIssue = issue ? `\nInitial GitHub WorkUnit: #${issue}. Start there unless GitHub state shows a higher-priority blocking WorkUnit.\n` : "";
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
작업 루프:
1. docs/STUDIO_HARNESS_V3_AUTONOMOUS_DESIGN.md, docs/STUDIO_HARNESS_V3_RUNNER_USAGE.md, docs/NORTH_STAR.md, docs/IDLE_CORE_CREATIVE_GUIDE.md를 빠르게 확인한다.
2. npm run studio:v3:runner -- --once --dry-run 으로 GitHub queue/PR/CI snapshot과 next action을 확인한다.
3. GitHub issue queue에서 합법 WorkUnit을 선택한다. 없으면 queue empty를 종료가 아니라 production game quality Intake WorkUnit 생성으로 처리한다.
4. 구현 전 items/<id>.md 또는 동등 plan artifact에 ## Plan, 수용 기준, 검증 명령, 리스크, Game Studio route(visible gameplay일 때), Subagent/Team Routing을 작성한다.
5. branch를 만들고 scope 안에서 구현한다.
6. visible gameplay/HUD/playfield/assets/QA는 Game Studio route를 먼저 고정하고 Browser Use iab를 우선 사용한다. Codex CLI에서 Browser Use가 안 보이면 node_repl MCP js readiness를 확인하고 현재 세션 blocker를 reports/visual/에 기록한다. Playwright는 반복 regression gate이지 Browser Use hands-on QA 대체재가 아니다.
7. focused checks -> 필요한 full checks -> PR body-file 작성 -> branch push -> PR create/update -> GitHub checks watch/repair -> merge when green -> main CI observation을 수행한다.
8. Release/Retro/daily report/merge/queue empty는 checkpoint일 뿐 종료 사유가 아니다. stop rule이 없으면 즉시 다음 GitHub WorkUnit을 plan-first로 이어간다.

중단 사유:
- user stop/close/interrupt/cancel
- token/context/model runtime exhaustion
- network/GitHub/tool/filesystem/machine outage로 안전한 continuation 불가
- destructive/credential/payment/external-production/customer-data boundary with no safe local continuation
- force majeure

실행 파라미터:
- worktree: ${worktree}
- supervision target: ${durationHours}h, restart interval after completed pass: ${intervalSeconds}s
- final user-facing report는 위 중단 사유가 있을 때만 허용한다. 그 외에는 commentary checkpoint와 다음 plan artifact/heartbeat를 남기고 계속한다.
`;
}

function writeReport({ reportPath, promptPath, statePath, checks, commandText, detachedCommandText, issue, backend, worktree, fallback, idleTimeoutMinutes, codexCooldownMinutes }) {
  ensureDir(reportPath);
  const report = `# Studio Harness v3 Foreground Operator Entry

- Updated: ${new Date().toISOString()}
- Backend: ${backend}
- Fallback: ${fallback}
- Idle timeout: ${idleTimeoutMinutes} min (per pass, kills on no stdio)
- Codex cooldown: ${codexCooldownMinutes} min (after limit/idle, route to fallback)
- Worktree: \`${worktree}\`
- Initial issue: ${issue ? `#${issue}` : "auto from GitHub queue"}
- Prompt: \`${promptPath}\`
- State: \`${statePath}\`

## 정정

이 entrypoint는 \`$seed-ops\`를 사용하지 않는다. Studio Harness v3는 과거 \`$seed-ops\` 루프를 대체하는 GitHub-authoritative foreground operator surface다.

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
  if (backend === "claude") {
    const args = ["-p", "--add-dir", worktree];
    if (yolo) args.push("--dangerously-skip-permissions");
    const argsText = args.map(shellQuote).join(" ");
    return `(cd ${shellQuote(worktree)} && claude ${argsText} < ${shellQuote(promptPath)})`;
  }
  const command = backend === "omx" ? "omx" : "codex";
  const argsText = buildExecArgs({ backend, worktree, yolo }).map(shellQuote).join(" ");
  return `${command} ${argsText} < ${shellQuote(promptPath)}`;
}

function buildDetachedCommandText({ durationHours, intervalSeconds, maxIterations, issue, worktree, backend, promptPath, statePath, reportPath, logPath, pidPath, yolo, fallback, idleTimeoutMinutes, codexCooldownMinutes }) {
  const scriptArgs = [
    scriptPath,
    "--supervisor",
    "--duration-hours", String(durationHours),
    "--interval-seconds", String(intervalSeconds),
    "--max-iterations", String(maxIterations),
    "--worktree", worktree,
    "--backend", backend,
    "--fallback", fallback,
    "--idle-timeout-minutes", String(idleTimeoutMinutes),
    "--codex-cooldown-minutes", String(codexCooldownMinutes),
    "--prompt", promptPath,
    "--state", statePath,
    "--report", reportPath
  ];
  if (issue) scriptArgs.push("--issue", String(issue));
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

function runMonitoredPass({ command, args, prompt, worktree, idleTimeoutMs }) {
  return new Promise((resolve) => {
    let child;
    try {
      child = spawn(command, args, { cwd: worktree, stdio: ["pipe", "pipe", "pipe"] });
    } catch (err) {
      resolve({ status: 1, signal: null, error: err.message, limitMatch: null, killedReason: null, command });
      return;
    }
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
    const onChunk = (chunk, sink) => {
      sink.write(chunk);
      lastOutputAt = Date.now();
      if (limitMatch) return;
      const match = detectLimit(chunk.toString());
      if (match) {
        limitMatch = match;
        killChild("limit-detected");
      }
    };
    child.stdout.on("data", (chunk) => onChunk(chunk, process.stdout));
    child.stderr.on("data", (chunk) => onChunk(chunk, process.stderr));
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

async function runClaudePass({ worktree, prompt, yolo, idleTimeoutMs }) {
  const args = ["-p", "--add-dir", worktree];
  if (yolo) args.push("--dangerously-skip-permissions");
  return runMonitoredPass({
    command: "claude",
    args,
    prompt,
    worktree,
    idleTimeoutMs,
  });
}

async function runExecPass({ backend, worktree, prompt, yolo, fallback, idleTimeoutMs, cooldownState }) {
  if (backend === "claude") {
    const result = await runClaudePass({ worktree, prompt, yolo, idleTimeoutMs });
    return { ...result, backend_used: "claude", via: "primary" };
  }

  const fallbackEnabled = fallback === "claude" && commandExists("claude");
  const inCooldown = cooldownState.codexCooldownUntil > Date.now();

  if (inCooldown && fallbackEnabled) {
    const result = await runClaudePass({ worktree, prompt, yolo, idleTimeoutMs });
    return {
      ...result,
      backend_used: "claude",
      via: "cooldown",
      codex_cooldown_until: new Date(cooldownState.codexCooldownUntil).toISOString(),
    };
  }

  const codexResult = await runCodexPass({ backend, worktree, prompt, yolo, idleTimeoutMs });
  const limitTriggered = Boolean(codexResult.limitMatch) || codexResult.killedReason === "idle-timeout";
  if (limitTriggered) {
    cooldownState.codexCooldownUntil = Date.now() + cooldownState.cooldownMs;
    cooldownState.lastTrigger = codexResult.limitMatch ?? codexResult.killedReason;
    cooldownState.lastTriggerAt = new Date().toISOString();
    if (fallbackEnabled) {
      const fallbackResult = await runClaudePass({ worktree, prompt, yolo, idleTimeoutMs });
      return {
        ...fallbackResult,
        backend_used: "claude",
        via: "fallback",
        codex_result: codexResult,
        codex_cooldown_until: new Date(cooldownState.codexCooldownUntil).toISOString(),
      };
    }
  }
  return { ...codexResult, backend_used: backend };
}

async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function supervise({ backend, worktree, prompt, statePath, durationHours, intervalSeconds, maxIterations, yolo, fallback, idleTimeoutMs, cooldownMs }) {
  const startedAt = new Date();
  const deadlineMs = startedAt.getTime() + durationHours * 60 * 60 * 1000;
  const cooldownState = { codexCooldownUntil: 0, cooldownMs, lastTrigger: null, lastTriggerAt: null };
  let iteration = 0;
  writeState(statePath, {
    schemaVersion: 1,
    kind: "studio-v3-foreground-operator-state",
    status: "running",
    backend,
    fallback,
    worktree,
    started_at: startedAt.toISOString(),
    updated_at: new Date().toISOString(),
    duration_hours: durationHours,
    interval_seconds: intervalSeconds,
    idle_timeout_ms: idleTimeoutMs,
    codex_cooldown_ms: cooldownMs,
    max_iterations: maxIterations,
    seed_ops_entrypoint: false
  });

  while (Date.now() < deadlineMs && (maxIterations === 0 || iteration < maxIterations)) {
    iteration += 1;
    const inCooldown = cooldownState.codexCooldownUntil > Date.now();
    const passLabel = backend === "claude"
      ? "running-claude-pass"
      : (inCooldown && fallback === "claude" ? "running-fallback-pass" : "running-codex-pass");
    writeState(statePath, {
      schemaVersion: 1,
      kind: "studio-v3-foreground-operator-state",
      status: passLabel,
      backend,
      fallback,
      worktree,
      started_at: startedAt.toISOString(),
      updated_at: new Date().toISOString(),
      duration_hours: durationHours,
      interval_seconds: intervalSeconds,
      iteration,
      codex_cooldown_until: cooldownState.codexCooldownUntil > 0 ? new Date(cooldownState.codexCooldownUntil).toISOString() : null,
      last_trigger: cooldownState.lastTrigger,
      last_trigger_at: cooldownState.lastTriggerAt,
      seed_ops_entrypoint: false
    });
    const result = await runExecPass({ backend, worktree, prompt, yolo, fallback, idleTimeoutMs, cooldownState });
    writeState(statePath, {
      schemaVersion: 1,
      kind: "studio-v3-foreground-operator-state",
      status: result.status === 0 ? "pass-completed" : "pass-failed",
      backend,
      fallback,
      worktree,
      started_at: startedAt.toISOString(),
      updated_at: new Date().toISOString(),
      duration_hours: durationHours,
      interval_seconds: intervalSeconds,
      iteration,
      last_result: result,
      codex_cooldown_until: cooldownState.codexCooldownUntil > 0 ? new Date(cooldownState.codexCooldownUntil).toISOString() : null,
      last_trigger: cooldownState.lastTrigger,
      last_trigger_at: cooldownState.lastTriggerAt,
      seed_ops_entrypoint: false
    });
    if (Date.now() >= deadlineMs || (maxIterations > 0 && iteration >= maxIterations)) break;
    await sleep(intervalSeconds * 1000);
  }

  writeState(statePath, {
    schemaVersion: 1,
    kind: "studio-v3-foreground-operator-state",
    status: "duration-complete",
    backend,
    fallback,
    worktree,
    started_at: startedAt.toISOString(),
    updated_at: new Date().toISOString(),
    duration_hours: durationHours,
    interval_seconds: intervalSeconds,
    iterations: iteration,
    codex_cooldown_until: cooldownState.codexCooldownUntil > 0 ? new Date(cooldownState.codexCooldownUntil).toISOString() : null,
    last_trigger: cooldownState.lastTrigger,
    last_trigger_at: cooldownState.lastTriggerAt,
    seed_ops_entrypoint: false
  });
}

const help = hasFlag("help") || hasFlag("h");
if (help) {
  console.log(usage());
  process.exit(0);
}

const worktree = path.resolve(readArg("worktree", process.cwd()));
const backend = readArg("backend", commandExists("omx") ? "omx" : "codex");
const fallback = readArg("fallback", commandExists("claude") ? "claude" : "none");
const issue = readArg("issue", "");
const durationHours = Number(readArg("duration-hours", "24"));
const intervalSeconds = Math.max(1, Number(readArg("interval-seconds", "300")));
const maxIterations = Math.max(0, Number(readArg("max-iterations", "0")));
const idleTimeoutMinutes = Math.max(1, Number(readArg("idle-timeout-minutes", "10")));
const codexCooldownMinutes = Math.max(1, Number(readArg("codex-cooldown-minutes", "60")));
const idleTimeoutMs = idleTimeoutMinutes * 60 * 1000;
const cooldownMs = codexCooldownMinutes * 60 * 1000;
const promptPath = readArg("prompt", ".omx/state/studio-v3-operator-prompt.md");
const statePath = readArg("state", ".omx/state/studio-v3-operator.json");
const reportPath = readArg("report", `reports/operations/studio-v3-operator-${todayCompact()}.md`);
const logPath = readArg("log", `.omx/logs/studio-v3-operator-${timestampCompact()}.log`);
const pidPath = readArg("pid", ".omx/state/studio-v3-operator.pid");
const yolo = hasFlag("yolo");
const prompt = buildPrompt({ issue, durationHours, intervalSeconds, worktree });
const checks = doctorChecks(worktree, backend, fallback);

ensureDir(promptPath);
fs.writeFileSync(promptPath, prompt);

const commandText = buildCommandText({ backend, worktree, promptPath, yolo });
const detachedCommandText = buildDetachedCommandText({ durationHours, intervalSeconds, maxIterations, issue, worktree, backend, promptPath, statePath, reportPath, logPath, pidPath, yolo, fallback, idleTimeoutMinutes, codexCooldownMinutes });
writeReport({ reportPath, promptPath, statePath, checks, commandText, detachedCommandText, issue, backend, worktree, fallback, idleTimeoutMinutes, codexCooldownMinutes });

const strictDoctor = hasFlag("strict-doctor");
const doctor = hasFlag("doctor");
const printCommand = hasFlag("print-command");
const promptOnly = hasFlag("prompt-only");
const detached = hasFlag("detached");
const supervisor = hasFlag("supervisor");

if (doctor) {
  const failedRequired = checks.filter((check) => check.required && !check.ok);
  console.log(JSON.stringify({ ok: failedRequired.length === 0, backend, fallback, idle_timeout_minutes: idleTimeoutMinutes, codex_cooldown_minutes: codexCooldownMinutes, worktree, prompt: promptPath, report: reportPath, checks }, null, 2));
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
  console.log(JSON.stringify({ ok: true, prompt: promptPath, report: reportPath, state: statePath, seed_ops_entrypoint: false }, null, 2));
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
    "--worktree", worktree,
    "--backend", backend,
    "--fallback", fallback,
    "--idle-timeout-minutes", String(idleTimeoutMinutes),
    "--codex-cooldown-minutes", String(codexCooldownMinutes),
    "--prompt", promptPath,
    "--state", statePath,
    "--report", reportPath
  ];
  if (issue) childArgs.push("--issue", String(issue));
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
    seed_ops_entrypoint: false
  });
  console.log(JSON.stringify({ ok: true, status: "detached-started", pid: child.pid, pidPath, logPath, prompt: promptPath, report: reportPath }, null, 2));
  process.exit(0);
}

if (supervisor) {
  await supervise({ backend, worktree, prompt, statePath, durationHours, intervalSeconds, maxIterations, yolo, fallback, idleTimeoutMs, cooldownMs });
  process.exit(0);
}

await supervise({ backend, worktree, prompt, statePath, durationHours, intervalSeconds, maxIterations, yolo });
