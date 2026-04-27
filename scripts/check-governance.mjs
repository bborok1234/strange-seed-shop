import fs from "node:fs";

const requiredPaths = [
  ".github/workflows/ci.yml",
  ".github/workflows/agent-automerge.yml",
  "docs/PR_AUTOMATION.md",
  "docs/AUTOMERGE_GOVERNANCE.md",
  "items/0004-automerge-governance.md"
];

const requiredPhrases = new Map([
  [
    "docs/AUTOMERGE_GOVERNANCE.md",
    [
      "ENABLE_AGENT_AUTOMERGE",
      "agent-automerge",
      "required checks",
      "Branch protection",
      "중단 조건"
    ]
  ],
  [
    "docs/PR_AUTOMATION.md",
    [
      "저장소 변수 `ENABLE_AGENT_AUTOMERGE`",
      "Branch protection",
      "required checks",
      "agent-automerge"
    ]
  ],
  [
    ".github/workflows/agent-automerge.yml",
    [
      "ENABLE_AGENT_AUTOMERGE",
      "npm run check:automerge",
      "npm run check:all",
      "gh pr merge"
    ]
  ],
  [
    ".github/workflows/ci.yml",
    [
      "npm run check:all"
    ]
  ]
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

console.log(
  JSON.stringify(
    {
      ok: failures.length === 0,
      requiredPaths: requiredPaths.length,
      phraseGroups: requiredPhrases.size,
      failures
    },
    null,
    2
  )
);

if (failures.length > 0) {
  process.exit(1);
}
