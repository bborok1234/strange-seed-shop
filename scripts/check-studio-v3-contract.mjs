import fs from "node:fs";

const failures = [];

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    failures.push(`missing required file: ${filePath}`);
    return "";
  }
  return fs.readFileSync(filePath, "utf8");
}

function requirePhrases(filePath, phrases) {
  const content = read(filePath);
  for (const phrase of phrases) {
    if (!content.includes(phrase)) failures.push(`${filePath} missing phrase: ${phrase}`);
  }
}

const infiniteContractPhrases = [
  "Studio run is infinite by default",
  "Queue empty is not a stop condition",
  "Checkpoint is not completion",
  "Final report requires local main"
];

for (const filePath of [
  "docs/STUDIO_HARNESS_V3_AUTONOMOUS_DESIGN.md",
  "docs/PROJECT_COMMANDS.md",
  "AGENTS.md"
]) {
  requirePhrases(filePath, infiniteContractPhrases);
}

requirePhrases("docs/OPERATOR_RUNBOOK.md", [
  "Studio run is infinite by default",
  "Queue empty is not a stop condition",
  "Those are checkpoints",
  "Final report requires local main"
]);

requirePhrases("docs/STUDIO_HARNESS_V3_AUTONOMOUS_DESIGN.md", [
  "continue forever",
  "Issue creation, PR creation, merge, Release, Retro, daily report, queue refresh, and recovery report are loop events",
  "token/context limit or model runtime exhaustion",
  "network, GitHub, tool, filesystem, or machine outage",
  "user explicitly stops, closes, interrupts, or cancels the run",
  "force majeure"
]);

requirePhrases("package.json", [
  "check:studio-v3-contract",
  "scripts/check-studio-v3-contract.mjs"
]);

console.log(JSON.stringify({ ok: failures.length === 0, failures }, null, 2));

if (failures.length > 0) process.exit(1);
