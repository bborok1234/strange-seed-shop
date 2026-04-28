import { execFileSync, spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
// Supported flags: --check, --serve, --install, --force

function readArg(name, fallback = "") {
  const index = args.indexOf(`--${name}`);
  if (index === -1) return fallback;
  return args[index + 1] ?? fallback;
}

function hasFlag(name) {
  return args.includes(`--${name}`);
}

function run(command, commandArgs, options = {}) {
  const output = execFileSync(command, commandArgs, {
    encoding: "utf8",
    stdio: options.stdio ?? ["ignore", "pipe", "pipe"],
    cwd: options.cwd ?? process.cwd()
  });
  return typeof output === "string" ? output.trim() : "";
}

function tryRun(command, commandArgs, options = {}) {
  try {
    return run(command, commandArgs, options);
  } catch {
    return "";
  }
}

const repoRoot = run("git", ["rev-parse", "--show-toplevel"]);
const targetPath = path.resolve(repoRoot, readArg("path", "../strange-seed-shop-play"));
const port = readArg("port", "5174");
const checkOnly = hasFlag("check");
const serve = hasFlag("serve");
const force = hasFlag("force");
const install = hasFlag("install");

function worktreeExists() {
  return fs.existsSync(path.join(targetPath, "package.json")) && fs.existsSync(path.join(targetPath, ".git"));
}

function isDirty(cwd) {
  return tryRun("git", ["status", "--porcelain"], { cwd }).length > 0;
}

const result = {
  ok: true,
  targetPath,
  port,
  mode: checkOnly ? "check" : serve ? "prepare-and-serve" : "prepare",
  checkout: "detached origin/main",
  commands: [
    `cd ${targetPath}`,
    "npm install",
    `npm run dev -- --host 127.0.0.1 --port ${port}`
  ],
  notes: []
};

if (checkOnly) {
  result.notes.push("check mode does not create or modify the playable worktree");
  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
}

run("git", ["fetch", "origin", "main"], { cwd: repoRoot });

if (!worktreeExists()) {
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  run("git", ["worktree", "add", "--detach", targetPath, "origin/main"], { cwd: repoRoot, stdio: "inherit" });
  result.notes.push("created playable worktree from origin/main");
} else {
  if (isDirty(targetPath) && !force) {
    console.error(JSON.stringify({
      ok: false,
      targetPath,
      reason: "playable worktree has local changes; rerun with --force only if you want to discard them"
    }, null, 2));
    process.exit(1);
  }

  run("git", ["checkout", "--detach", "origin/main"], { cwd: targetPath });
  if (force) run("git", ["reset", "--hard", "origin/main"], { cwd: targetPath, stdio: "inherit" });
  result.notes.push("refreshed playable worktree to detached origin/main");
}

const packageJson = path.join(targetPath, "package.json");
if (!fs.existsSync(packageJson)) {
  console.error(JSON.stringify({ ok: false, targetPath, reason: "package.json missing after worktree preparation" }, null, 2));
  process.exit(1);
}

if (!fs.existsSync(path.join(targetPath, "node_modules"))) {
  if (install) {
    run("npm", ["install"], { cwd: targetPath, stdio: "inherit" });
    result.notes.push("installed dependencies in playable worktree");
  } else {
    result.notes.push("node_modules is missing; run npm install inside the playable worktree before serving, or rerun with --install");
  }
}

console.log(JSON.stringify(result, null, 2));

if (serve) {
  const child = spawn("npm", ["run", "dev", "--", "--host", "127.0.0.1", "--port", port], {
    cwd: targetPath,
    stdio: "inherit"
  });
  child.on("exit", (code) => process.exit(code ?? 0));
}
