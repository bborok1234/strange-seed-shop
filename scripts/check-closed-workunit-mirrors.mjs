import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const failures = [];

function readArg(name, fallback = "") {
  const index = args.indexOf(`--${name}`);
  if (index === -1) return fallback;
  return args[index + 1] ?? fallback;
}

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    failures.push(`missing required path: ${filePath}`);
    return "";
  }

  return fs.readFileSync(filePath, "utf8");
}

function readJson(filePath) {
  const raw = read(filePath);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (error) {
    failures.push(`${filePath} has invalid JSON: ${error.message}`);
    return null;
  }
}

function latestManifest() {
  const dir = "reports/operations";
  if (!fs.existsSync(dir)) return "";
  return fs
    .readdirSync(dir)
    .filter((name) => /^closed-workunit-mirror-manifest-\d{8}\.json$/.test(name))
    .sort()
    .map((name) => path.join(dir, name))
    .at(-1) ?? "";
}

function roadmapRows(markdown) {
  return markdown
    .split("\n")
    .filter((line) => line.startsWith("| ") && !line.includes("---"))
    .map((line) => line.split("|").map((cell) => cell.trim()));
}

function section(markdown, heading) {
  const match = markdown.match(new RegExp(`(^|\\n)## ${heading}\\n\\n([\\s\\S]*?)(?:\\n## |\\n# |$)`));
  return match?.[2]?.trim() ?? "";
}

const manifestPath = readArg("manifest", latestManifest());
if (!manifestPath) failures.push("missing closed WorkUnit mirror manifest");
const manifest = manifestPath ? readJson(manifestPath) : null;
const roadmap = read("docs/ROADMAP.md");
const controlRoom = read("docs/OPERATOR_CONTROL_ROOM.md");
const rows = roadmapRows(roadmap);
const currentNext = section(roadmap, "Current Next Action");

if (manifest) {
  if (manifest.source && !/GitHub/.test(manifest.source)) {
    failures.push("manifest.source must name GitHub observation as authority");
  }
  if (!manifest.activeWorkUnit?.issue) failures.push("manifest.activeWorkUnit.issue is required");
  if (!manifest.activeWorkUnit?.item) failures.push("manifest.activeWorkUnit.item is required");
  if (manifest.activeWorkUnit?.item && !fs.existsSync(manifest.activeWorkUnit.item)) {
    failures.push(`activeWorkUnit item does not exist: ${manifest.activeWorkUnit.item}`);
  }

  for (const workUnit of manifest.workUnits ?? []) {
    const label = `#${workUnit.issue}/#${workUnit.pr}`;
    if (workUnit.issueState !== "CLOSED") failures.push(`${label}: issueState must be CLOSED`);
    if (workUnit.prState !== "MERGED") failures.push(`${label}: prState must be MERGED`);
    if (workUnit.mainCiConclusion !== "success") failures.push(`${label}: mainCiConclusion must be success`);
    if (!workUnit.mainCiRun) failures.push(`${label}: mainCiRun is required`);

    const row = rows.find((cells) => cells[1] === workUnit.roadmapStep);
    if (!row) {
      failures.push(`${label}: missing roadmap row for ${workUnit.roadmapStep}`);
      continue;
    }

    const [, step, status, output] = row;
    if (status !== workUnit.expectedRoadmapStatus) {
      failures.push(`${label}: roadmap row ${step} status must be ${workUnit.expectedRoadmapStatus}, got ${status}`);
    }
    for (const phrase of workUnit.requiredRoadmapEvidence ?? []) {
      if (!output.includes(phrase)) failures.push(`${label}: roadmap output missing evidence phrase: ${phrase}`);
    }

    for (const phrase of workUnit.forbiddenActivePhrases ?? []) {
      if (currentNext.includes(phrase)) failures.push(`${label}: Current Next Action still has active phrase: ${phrase}`);
      if (controlRoom.includes(phrase)) failures.push(`${label}: control room still has active phrase: ${phrase}`);
    }
  }

  const activeIssue = `#${manifest.activeWorkUnit?.issue}`;
  const activeItem = manifest.activeWorkUnit?.item ?? "";
  if (activeIssue && !currentNext.includes(activeIssue)) failures.push(`Current Next Action missing active issue ${activeIssue}`);
  if (activeItem && !currentNext.includes(activeItem)) failures.push(`Current Next Action missing active item ${activeItem}`);
  if (activeIssue && !controlRoom.includes(activeIssue)) failures.push(`control room missing active issue ${activeIssue}`);
  if (activeItem && !controlRoom.includes(activeItem)) failures.push(`control room missing active item ${activeItem}`);
}

console.log(JSON.stringify({ ok: failures.length === 0, manifest: manifestPath || null, failures }, null, 2));
if (failures.length > 0) process.exit(1);
