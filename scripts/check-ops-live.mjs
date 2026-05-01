import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const failures = [];

function readArg(name, fallback = "") {
  const index = args.indexOf(`--${name}`);
  if (index === -1) return fallback;
  return args[index + 1] ?? fallback;
}

function tryRun(command, commandArgs) {
  try {
    return execFileSync(command, commandArgs, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return "";
  }
}

function read(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
}

function readHeartbeat(filePath) {
  const raw = read(filePath).trim();
  if (!raw) return null;

  try {
    if (filePath.endsWith(".jsonl")) {
      const lines = raw.split("\n").filter(Boolean);
      return JSON.parse(lines.at(-1));
    }

    return JSON.parse(raw);
  } catch (error) {
    failures.push(`${filePath} has invalid heartbeat JSON: ${error.message}`);
    return null;
  }
}

function latestHeartbeatReport() {
  const operationsDir = "reports/operations";
  if (!fs.existsSync(operationsDir)) return "";

  return fs
    .readdirSync(operationsDir)
    .filter((name) => /^operator-heartbeat-\d{8}\.jsonl$/.test(name))
    .sort()
    .map((name) => path.join(operationsDir, name))
    .at(-1) ?? "";
}

function requirePhrase(filePath, phrase) {
  const content = read(filePath);
  if (!content.includes(phrase)) failures.push(`${filePath} missing phrase: ${phrase}`);
}

const maxAgeSeconds = Number(readArg("max-age-seconds", "86400"));
const now = Date.parse(readArg("now", new Date().toISOString()));
const controlRoomPath = readArg("control-room", "docs/OPERATOR_CONTROL_ROOM.md");
const heartbeatPath = readArg("heartbeat", fs.existsSync(".omx/state/operator-heartbeat.json") ? ".omx/state/operator-heartbeat.json" : latestHeartbeatReport());
const controlRoom = read(controlRoomPath);
const heartbeat = heartbeatPath ? readHeartbeat(heartbeatPath) : null;

if (!controlRoom) failures.push(`missing control room: ${controlRoomPath}`);
if (!heartbeatPath) failures.push("missing heartbeat source");
if (!heartbeat) failures.push(`missing readable heartbeat: ${heartbeatPath || "none"}`);

const generatedMatch = controlRoom.match(/Generated at: ([^\n]+)/);
const generatedAt = generatedMatch ? Date.parse(generatedMatch[1]) : Number.NaN;
if (!generatedMatch) failures.push(`${controlRoomPath} missing Generated at timestamp`);
if (Number.isNaN(generatedAt)) failures.push(`${controlRoomPath} has invalid Generated at timestamp`);

if (!Number.isNaN(now) && !Number.isNaN(generatedAt)) {
  const ageSeconds = Math.max(0, Math.floor((now - generatedAt) / 1000));
  if (ageSeconds > maxAgeSeconds) {
    failures.push(`${controlRoomPath} is stale: generated age ${ageSeconds}s exceeds ${maxAgeSeconds}s`);
  }
}

if (heartbeat?.timestamp) {
  const heartbeatAt = Date.parse(heartbeat.timestamp);
  if (Number.isNaN(heartbeatAt)) {
    failures.push(`heartbeat timestamp is invalid: ${heartbeat.timestamp}`);
  } else if (!Number.isNaN(now)) {
    const heartbeatAgeSeconds = Math.max(0, Math.floor((now - heartbeatAt) / 1000));
    if (heartbeatAgeSeconds > maxAgeSeconds) {
      failures.push(`heartbeat is stale: age ${heartbeatAgeSeconds}s exceeds ${maxAgeSeconds}s`);
    }
  }
} else if (heartbeat) {
  failures.push("heartbeat missing timestamp");
}

for (const field of ["phase", "issue", "item", "branch", "commit", "current_command", "next_action"]) {
  if (!heartbeat?.[field]) failures.push(`heartbeat missing field: ${field}`);
}

if (heartbeat?.item && (!heartbeat.item.startsWith("items/") || !heartbeat.item.endsWith(".md"))) {
  failures.push(`heartbeat item should point at items/*.md, got ${heartbeat.item}`);
}

if (heartbeat?.item && !fs.existsSync(heartbeat.item)) {
  failures.push(`heartbeat item does not exist: ${heartbeat.item}`);
}

const currentBranch = tryRun("git", ["branch", "--show-current"]);
const heartbeatIsRuntimeState = heartbeatPath === ".omx/state/operator-heartbeat.json";
if (heartbeatIsRuntimeState && currentBranch && heartbeat?.branch && heartbeat.branch !== currentBranch) {
  failures.push(`heartbeat branch ${heartbeat.branch} does not match current branch ${currentBranch}`);
}

for (const stalePhrase of ["Active issue | #87", "codex/operator-control-room", "Issue #93", "#94", "2026-04-28T13:35:02.511Z"]) {
  if (controlRoom.includes(stalePhrase)) failures.push(`${controlRoomPath} still contains stale phrase: ${stalePhrase}`);
}

for (const phrase of [
  "Live Snapshot",
  "Heartbeat",
  "Goal-bounded stop condition",
  "Next queue quality gate",
  "competition-inspired production gap",
  "asset/FX or sprite-animation decision",
  "concrete visual/game-feel payoff",
  "기존 asset 재사용만으로는 통과하지 않는다",
  "playfield state",
  "HUD affordance",
  "sprite/FX",
  "order crate visual state",
  "reward motion",
  "Codex native image generation",
  "gpt-image-2",
  "accepted manifest game asset",
  "animation.binding",
  "npm run check:asset-provenance",
  "npm run check:asset-style",
  "OPENAI_API_KEY",
  "SEED_ASSET_IMAGE_MODEL"
]) {
  requirePhrase(controlRoomPath, phrase);
}

if (heartbeat?.next_action && !/stop|멈춤|완료|gate|준비/.test(heartbeat.next_action)) {
  failures.push("heartbeat next_action should include a bounded stop/prep/gate signal");
}

console.log(
  JSON.stringify(
    {
      ok: failures.length === 0,
      controlRoom: controlRoomPath,
      heartbeat: heartbeatPath || null,
      maxAgeSeconds,
      failures
    },
    null,
    2
  )
);

if (failures.length > 0) process.exit(1);
