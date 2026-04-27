import fs from "node:fs";

const requiredPaths = [
  "docs/README.md",
  "docs/ROADMAP.md",
  "docs/REPORTING.md",
  "docs/DASHBOARD.md",
  "docs/APPLY_CONDITIONS.md",
  "items/0001-pr-automation-trial.md",
  "reports/audits/audit_20260427.md",
  "reports/reviews/README.md"
];

const requiredPhrases = new Map([
  ["docs/APPLY_CONDITIONS.md", ["Apply gate", "중단 조건", "검증 증거"]],
  ["docs/DASHBOARD.md", ["현재 상태", "다음 작업", "검증 상태"]],
  ["docs/ROADMAP.md", ["Create apply conditions", "Create dashboard"]]
]);

const failures = [];

for (const path of requiredPaths) {
  if (!fs.existsSync(path)) {
    failures.push(`missing required path: ${path}`);
  }
}

for (const [path, phrases] of requiredPhrases.entries()) {
  if (!fs.existsSync(path)) {
    continue;
  }

  const content = fs.readFileSync(path, "utf8");
  for (const phrase of phrases) {
    if (!content.includes(phrase)) {
      failures.push(`${path} missing phrase: ${phrase}`);
    }
  }
}

const roadmap = fs.existsSync("docs/ROADMAP.md") ? fs.readFileSync("docs/ROADMAP.md", "utf8") : "";
if (roadmap.includes("| Create apply conditions | todo |")) {
  failures.push("apply conditions roadmap row is still todo");
}

if (roadmap.includes("| Create dashboard | todo |")) {
  failures.push("dashboard roadmap row is still todo");
}

const result = {
  ok: failures.length === 0,
  checkedPaths: requiredPaths.length,
  phraseGroups: requiredPhrases.size,
  failures
};

console.log(JSON.stringify(result, null, 2));

if (!result.ok) {
  process.exit(1);
}
