import fs from "node:fs";

const failures = [];

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    failures.push(`missing required file: ${filePath}`);
    return "";
  }
  return fs.readFileSync(filePath, "utf8");
}

function readJson(filePath) {
  try {
    return JSON.parse(read(filePath));
  } catch (error) {
    failures.push(`${filePath} has invalid JSON: ${error.message}`);
    return null;
  }
}

function requirePhrases(filePath, phrases) {
  const content = read(filePath);
  for (const phrase of phrases) {
    if (!content.includes(phrase)) failures.push(`${filePath} missing phrase: ${phrase}`);
  }
}

const manifestPath = "reports/operations/studio-v3-migration-backfill-20260503.json";
const reportPath = "reports/operations/studio-v3-migration-backfill-20260503.md";
const itemPath = "items/0141-v2-ledger-quarantine-backfill.md";
const recoveryReportPath = "reports/operations/local-studio-work-recovery-20260503.md";
const manifest = readJson(manifestPath);

if (manifest) {
  if (manifest.schema_version !== "studio-v3-migration-backfill/v1") failures.push("manifest schema_version must be studio-v3-migration-backfill/v1");
  if (Number(manifest.source_issue) !== 274) failures.push("manifest source_issue must be 274");
  if (!manifest.source_issue_url?.endsWith("/issues/274")) failures.push("manifest source_issue_url must point to issue #274");
  if (manifest.status !== "migration-backfill") failures.push("manifest status must be migration-backfill");
  if (manifest.authorization?.source_of_truth !== "github-authoritative") failures.push("authorization.source_of_truth must be github-authoritative");
  if (manifest.authorization?.local_ledger_can_authorize_work !== false) failures.push("local_ledger_can_authorize_work must be false");
  if (manifest.authorization?.local_ledger_role !== "evidence-mirror-only") failures.push("local_ledger_role must be evidence-mirror-only");

  const stashEntries = manifest.captured_stash_entries ?? [];
  if (stashEntries.length < 2) failures.push("manifest should capture at least current classified stash and original backup stash");
  for (const requiredMessage of ["codex classified recovery diff", "cleanup backup before returning to main after PR 273"]) {
    if (!stashEntries.some((entry) => entry.message?.includes(requiredMessage))) failures.push(`missing stash entry message containing: ${requiredMessage}`);
  }
  for (const entry of stashEntries) {
    if (entry.preserve !== true) failures.push(`stash entry ${entry.ref_at_capture} must preserve true`);
    if (!entry.classification || !["migration-backfill", "quarantined-backup"].includes(entry.classification)) {
      failures.push(`stash entry ${entry.ref_at_capture} has invalid classification: ${entry.classification}`);
    }
  }

  const branchStatus = manifest.recovery_branch_status ?? {};
  if (branchStatus.local_branch_present_at_capture !== false) failures.push("recovery local branch should be recorded as absent after PR277 split");
  if (branchStatus.remote_branch_present_at_capture !== false) failures.push("recovery remote branch should be recorded as absent after PR277 split");
  if (!String(branchStatus.note ?? "").includes("not by restoring the branch")) failures.push("recovery branch note must say evidence is preserved without restoring branch");

  const mainTree = manifest.main_tree_status ?? {};
  for (const [field, value] of Object.entries(mainTree)) {
    if (value !== false) failures.push(`main_tree_status.${field} must be false, got ${value}`);
  }

  const groups = manifest.artifact_groups ?? [];
  const groupsById = new Map(groups.map((group) => [group.id, group]));
  for (const id of ["v2-campaign-ledger", "throwaway-prototypes", "visual-evidence", "asset-prompt-prep", "legacy-harness-surfaces", "production-game-code"]) {
    if (!groupsById.has(id)) failures.push(`missing artifact group: ${id}`);
  }
  for (const group of groups) {
    if (group.authorization_allowed !== false) failures.push(`${group.id}: authorization_allowed must be false`);
    if (!group.classification) failures.push(`${group.id}: classification is required`);
    if (!group.action) failures.push(`${group.id}: action is required`);
  }
  if (groupsById.get("v2-campaign-ledger")?.classification !== "quarantined") failures.push("v2-campaign-ledger must be quarantined");
  if (groupsById.get("legacy-harness-surfaces")?.classification !== "quarantined") failures.push("legacy-harness-surfaces must be quarantined");
  if (groupsById.get("production-game-code")?.classification !== "excluded-follow-up") failures.push("production-game-code must be excluded-follow-up");
  if (Number(groupsById.get("production-game-code")?.follow_up_issue) !== 275) failures.push("production-game-code must route to follow_up_issue 275");

  const policy = manifest.preservation_policy ?? [];
  for (const phrase of ["preserve stash entries; do not drop", "do not restore campaigns/**", "backfill useful evidence only through GitHub issue/PR/GateEvent surfaces", "production game code remains excluded for #275"]) {
    if (!policy.some((entry) => String(entry).includes(phrase))) failures.push(`preservation_policy missing: ${phrase}`);
  }
}

requirePhrases(reportPath, [
  "Status: migration-backfill",
  "Issue: #274",
  "v2 local campaign ledger 산출물은 보존하지만",
  "work authorization source가 아니다",
  "quarantined",
  "migration-backfill",
  "stash@{0}",
  "stash@{1}",
  "production game code",
  "#275 WorkUnit",
  "npm run check:studio-v3-migration-backfill"
]);

requirePhrases(itemPath, [
  "Issue: #274",
  "## Plan",
  "quarantined",
  "migration-backfill",
  "local ledger가 work authorization source가 아니라 evidence mirror",
  "stash@{0}",
  "recovery branch",
  "npm run check:studio-v3-migration-backfill"
]);

requirePhrases(recoveryReportPath, [
  "WU-A: v2 Local Ledger Quarantine / Migration",
  "GitHub issue: #274",
  "local ledger가 work authorization source가 될 수 없으므로",
  "production game code는 포함하지 않는다",
  "stash@{0}` drop 금지"
]);

requirePhrases("scripts/check-studio-v3-bot-runner.mjs", [
  "local ledger attempted to authorize gate advance",
  "quarantined",
  "stale-dirty-local-work-recovery"
]);

requirePhrases("package.json", [
  "check:studio-v3-migration-backfill",
  "scripts/check-studio-v3-migration-backfill.mjs"
]);

const packageJson = readJson("package.json");
const scripts = packageJson?.scripts ?? {};
if (scripts["check:studio-v3-migration-backfill"] !== "node scripts/check-studio-v3-migration-backfill.mjs") {
  failures.push("package.json script check:studio-v3-migration-backfill must run node scripts/check-studio-v3-migration-backfill.mjs");
}
if (!String(scripts["check:ci"] ?? "").includes("npm run check:studio-v3-migration-backfill")) {
  failures.push("package.json check:ci must include npm run check:studio-v3-migration-backfill");
}

console.log(JSON.stringify({ ok: failures.length === 0, manifest: manifestPath, report: reportPath, failures }, null, 2));
if (failures.length > 0) process.exit(1);
