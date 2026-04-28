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

function read(filePath, fallback = "") {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : fallback;
}

const roadmap = read("docs/ROADMAP.md");
const currentNext = roadmap.split("\n").find((line) => line.startsWith("`docs/NORTH_STAR.md`")) ?? "Current Next Action unavailable";
const branch = tryRun("git", ["branch", "--show-current"]);
const status = tryRun("git", ["status", "--short"]);
const latestCommit = tryRun("git", ["log", "-1", "--oneline"]);
const openPrs = tryRun("gh", ["pr", "list", "--state", "open", "--limit", "5", "--json", "number,title,isDraft,url", "--jq", ".[] | \"#\\(.number) \\(.isDraft // false | if . then \\\"draft\\\" else \\\"ready\\\" end) \\(.title) — \\(.url)\""]);
const openIssues = tryRun("gh", ["issue", "list", "--state", "open", "--limit", "5", "--json", "number,title,url", "--jq", ".[] | \"#\\(.number) \\(.title) — \\(.url)\""]);

const report = `# Operator Control Room Snapshot

Generated at: ${new Date().toISOString()}

## Current mission

${currentNext}

## Local state

- Branch: ${branch}
- Latest commit: ${latestCommit}
- Dirty files: ${status === "" ? "none" : "present"}

## Open PRs

${openPrs === "" || openPrs === "unavailable" ? "- unavailable or none" : openPrs.split("\n").map((line) => `- ${line}`).join("\n")}

## Open issues

${openIssues === "" || openIssues === "unavailable" ? "- unavailable or none" : openIssues.split("\n").map((line) => `- ${line}`).join("\n")}

## Playable mode

- Prepare stable main worktree: \`npm run play:main\`
- Serve stable main game: \`cd ../strange-seed-shop-play && npm run dev -- --host 127.0.0.1 --port 5174\`
- URL: http://127.0.0.1:5174

## Visual evidence rule

- UI/game PR: link before/after screenshots under \`reports/visual/\`.
- Docs/scripts-only PR: write \`N/A — UI 변화 없음\` and link check output/report.

## Next safe stop

Stop only after PR required checks, main CI, and local \`npm run check:all\` are green, or after a written blocker report.
`;

if (outputPath) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, report);
}

console.log(report);
