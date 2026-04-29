import fs from "node:fs";

const requiredDocs = [
  "docs/README.md",
  "docs/NORTH_STAR.md",
  "docs/ROADMAP.md",
  "docs/PROJECT_COMMANDS.md",
  "docs/PRD_PHASE0.md",
  "docs/ECONOMY_PHASE0.md",
  "docs/DESIGN_SYSTEM.md",
  "docs/UX_REVIEW_20260427.md",
  "docs/GAME_STUDIO_REVIEW_20260427.md",
  "docs/SESSION_HANDOFF_20260427.md",
  "docs/AUTONOMOUS_PROJECT_OPERATING_MODEL.md",
  "docs/OPERATOR_RUNBOOK.md",
  "docs/OPERATOR_CONTROL_ROOM.md",
  "docs/PLAYABLE_MODE.md",
  "docs/BROWSER_QA.md",
  "docs/PR_AUTOMATION.md",
  "docs/AUTOMERGE_GOVERNANCE.md",
  "docs/REPORTING.md",
  "docs/APPLY_CONDITIONS.md",
  "docs/DASHBOARD.md"
];

const index = fs.readFileSync("docs/README.md", "utf8");
const roadmap = fs.readFileSync("docs/ROADMAP.md", "utf8");
const failures = [];

for (const doc of requiredDocs) {
  if (!fs.existsSync(doc)) {
    failures.push(`missing required doc: ${doc}`);
    continue;
  }

  const basename = doc.split("/").pop();
  if (doc !== "docs/README.md" && !index.includes(basename)) {
    failures.push(`docs/README.md does not index ${basename}`);
  }
}

const requiredDirs = ["items", "reports/reviews", "reports/audits", "reports/visual"];

for (const dir of requiredDirs) {
  if (!fs.existsSync(dir)) {
    failures.push(`missing required directory: ${dir}`);
  }
}

for (const phrase of [
  "Milestone 5",
  "Milestone 6",
  "Milestone 7",
  "Milestone 8",
  "Milestone 9",
  "북극성",
  "24-Hour Agent-Native Studio Prototype",
  "review report",
  "audit report",
  "dashboard",
  "PR automation audit"
]) {
  if (!roadmap.includes(phrase)) {
    failures.push(`docs/ROADMAP.md missing phrase: ${phrase}`);
  }
}

const result = {
  ok: failures.length === 0,
  requiredDocs: requiredDocs.length,
  requiredDirs: requiredDirs.length,
  failures
};

console.log(JSON.stringify(result, null, 2));

if (!result.ok) {
  process.exit(1);
}
