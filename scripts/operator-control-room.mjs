import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const outputIndex = args.indexOf("--output");
const outputPath = outputIndex === -1 ? "" : args[outputIndex + 1] ?? "";

function tryRun(command, commandArgs) {
  try {
    return execFileSync(command, commandArgs, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return "unavailable";
  }
}

function tryRunJson(command, commandArgs) {
  const raw = tryRun(command, commandArgs);
  if (!raw || raw === "unavailable") return [];

  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function read(filePath, fallback = "") {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : fallback;
}

function readHeartbeat(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8").trim();
  if (!raw) return null;

  try {
    if (filePath.endsWith(".jsonl")) {
      const lines = raw.split("\n").filter(Boolean);
      return JSON.parse(lines.at(-1));
    }

    return JSON.parse(raw);
  } catch {
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

function updateMarkedBlock(existing, block) {
  const start = "<!-- OPERATOR_CONTROL_ROOM_SNAPSHOT:START -->";
  const end = "<!-- OPERATOR_CONTROL_ROOM_SNAPSHOT:END -->";
  const replacement = `${start}\n${block.trim()}\n${end}`;

  if (existing.includes(start) && existing.includes(end)) {
    return existing.replace(new RegExp(`${start}[\\s\\S]*?${end}`), replacement);
  }

  const firstHeadingEnd = existing.indexOf("\n\n");
  if (firstHeadingEnd === -1) return `${replacement}\n\n${existing}`;
  return `${existing.slice(0, firstHeadingEnd)}\n\n${replacement}${existing.slice(firstHeadingEnd)}`;
}

const roadmap = read("docs/ROADMAP.md");
const currentNextMatch = roadmap.match(/## Current Next Action\n\n([\s\S]*?)(?:\n## |\n# |\n$)/);
const currentNext = currentNextMatch?.[1]?.trim() || "Current Next Action unavailable";
const branch = tryRun("git", ["branch", "--show-current"]);
const status = tryRun("git", ["status", "--short"]);
const latestCommit = tryRun("git", ["log", "-1", "--oneline"]);
const heartbeatPath = read(".omx/state/operator-heartbeat.json").trim() ? ".omx/state/operator-heartbeat.json" : latestHeartbeatReport();
const heartbeat = heartbeatPath ? readHeartbeat(heartbeatPath) : null;
const openPrs = tryRunJson("gh", ["pr", "list", "--state", "open", "--limit", "5", "--json", "number,title,isDraft,url"]);
const openIssues = tryRunJson("gh", ["issue", "list", "--state", "open", "--limit", "5", "--json", "number,title,url"]);

const snapshot = `## Live Snapshot

Generated at: ${new Date().toISOString()}

## Current mission

${currentNext}

## Local state

- Branch: ${branch}
- Latest commit: ${latestCommit}
- Dirty files: ${status === "" ? "none" : "present"}

## Heartbeat

- Source: ${heartbeatPath || "missing"}
- Timestamp: ${heartbeat?.timestamp ?? "missing"}
- Phase: ${heartbeat?.phase ?? "missing"}
- Issue: ${heartbeat?.issue ?? "missing"}
- PR: ${heartbeat?.pr ?? "missing"}
- Item: ${heartbeat?.item ?? "missing"}
- Next action: ${heartbeat?.next_action ?? "missing"}

## Open PRs

${openPrs.length === 0 ? "- unavailable or none" : openPrs.map((pr) => `- #${pr.number} ${pr.isDraft ? "draft" : "ready"} ${pr.title} — ${pr.url}`).join("\n")}

## Open issues

${openIssues.length === 0 ? "- unavailable or none" : openIssues.map((issue) => `- #${issue.number} ${issue.title} — ${issue.url}`).join("\n")}

## Playable mode

- Prepare stable main worktree: \`npm run play:main\`
- Serve stable main game: \`cd ../strange-seed-shop-play && npm run dev -- --host 127.0.0.1 --port 5174\`
- URL: http://127.0.0.1:5174

## Visual evidence rule

- UI/game PR: link before/after screenshots under \`reports/visual/\`.
- Docs/scripts-only PR: write \`N/A — UI 변화 없음\` and link check output/report.

## Next stop gate

Stop only after PR required checks, main CI, and local \`npm run check:all\` are green, or after a written blocker report. The next work queue should name a North Star production vertical slice, not a merely safe small task.

## Studio Campaign Gate

The next game issue is a child of the active campaign, not a neighbor of the previous issue. Active campaign source of truth: P0.5 Idle Core + Creative Rescue. Before implementation, the next plan artifact must include reference teardown, creative brief, Game Studio Department Signoff, role-debate note when roles disagree, Subagent/Team Routing decision, and QA/playtest plan.

## Game Studio Department Signoff

- 기획팀: player verb, production/progression role, first 5 minutes moment.
- 리서치팀: 경쟁작 production gap, reference teardown, rejected alternative.
- 아트팀: art direction, gpt-image-2 default/fallback, manifest/animation plan.
- 개발팀: implementation tranche, touched files, rollback boundary.
- 검수팀: Browser Use/playtest evidence, screenshot/report/check list.
- 마케팅팀: mock-only player-facing promise, no real channel action.
- 고객지원팀: first 5 minutes confusion/support risk and FAQ note.

## Subagent/Team Routing

Use Codex native subagents or team mode when research, local audit, asset planning, runtime implementation, or QA can produce independent evidence in parallel. If not used, the plan must explain why.

## Asset/FX production bundle

Asset/FX work follows gastory-style style state, prompt/model sidecar, reference image consistency, animation camera/composition lock, frame/GIF/spritesheet extraction, manifest QA, and small-size visual review.

## Goal-bounded stop condition

For the current seed-ops issue run, stop only after the plan acceptance criteria, local verification, PR required checks, merge, and main CI are green, or after a written blocker report.

## Next queue quality gate

The next seed-ops issue must name at least one 경쟁작 production gap (competition-inspired production gap) and at least one asset/FX or sprite-animation decision that creates a concrete visual/game-feel payoff. The asset/FX axis 기존 asset 재사용만으로는 통과하지 않는다; it must commit to at least one of playfield state, HUD affordance, sprite/FX, order crate visual state, reward motion. New accepted manifest game asset work must use Codex native image generation or gpt-image-2 provenance, never SVG/vector/code-native game graphics, and must pass npm run check:asset-provenance and npm run check:asset-style. GPT image/API generation requires OPENAI_API_KEY and SEED_ASSET_IMAGE_MODEL. Sprite/FX payoff must name animation.binding plus frame count, frame size, and intended frame rate. 단순 주문 추가, copy tweak, spacing tweak, or test-only work fails unless it is paired with that payoff and unblocks the vertical slice.
`;

const report = `# Operator Control Room Snapshot\n\n${snapshot.trim()}\n`;

if (outputPath) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  if (outputPath === "docs/OPERATOR_CONTROL_ROOM.md" && fs.existsSync(outputPath)) {
    fs.writeFileSync(outputPath, updateMarkedBlock(read(outputPath), snapshot));
  } else {
    fs.writeFileSync(outputPath, report);
  }
}

console.log(report);
