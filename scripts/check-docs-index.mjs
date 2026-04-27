import fs from "node:fs";

const requiredDocs = [
  "docs/README.md",
  "docs/ROADMAP.md",
  "docs/PRD_PHASE0.md",
  "docs/ECONOMY_PHASE0.md",
  "docs/AUTONOMOUS_PROJECT_OPERATING_MODEL.md",
  "docs/BROWSER_QA.md",
  "docs/PR_AUTOMATION.md"
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

for (const phrase of ["Milestone 5", "review report", "audit report"]) {
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
