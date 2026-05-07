import fs from "node:fs";

const failures = [];

const requiredPaths = [
  "apps/legacy-react-playable/README.md",
  "apps/legacy-react-playable/index.html",
  "apps/legacy-react-playable/src/App.tsx",
  "apps/legacy-react-playable/src/data/seeds.json",
  "apps/legacy-react-playable/vite.config.ts",
  "apps/seed-garden-phaser/README.md",
  "apps/seed-garden-phaser/index.html",
  "apps/seed-garden-phaser/src/main.ts",
  "apps/seed-garden-phaser/vite.config.ts",
  "docs/legacy/README.md",
  "docs/phaser/README.md",
  "docs/phaser/VERTICAL_SLICE_SPEC.md"
];

const forbiddenRootPaths = ["src", "index.html", "vite.config.ts"];

for (const filePath of requiredPaths) {
  if (!fs.existsSync(filePath)) failures.push(`missing required boundary path: ${filePath}`);
}

for (const filePath of forbiddenRootPaths) {
  if (fs.existsSync(filePath)) failures.push(`legacy app entrypoint must not remain at repo root: ${filePath}`);
}

const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
const scripts = packageJson.scripts ?? {};

for (const scriptName of ["dev:legacy", "build:legacy", "check:legacy", "dev:phaser", "build:phaser", "check:phaser"]) {
  if (typeof scripts[scriptName] !== "string") failures.push(`package.json missing script: ${scriptName}`);
}

if (!scripts["dev:legacy"]?.includes("apps/legacy-react-playable/vite.config.ts")) {
  failures.push("dev:legacy must point at apps/legacy-react-playable/vite.config.ts");
}

if (!scripts["dev:phaser"]?.includes("apps/seed-garden-phaser/vite.config.ts")) {
  failures.push("dev:phaser must point at apps/seed-garden-phaser/vite.config.ts");
}

const docsIndex = fs.readFileSync("docs/README.md", "utf8");
for (const phrase of [
  "Source Ownership Boundary",
  "apps/legacy-react-playable",
  "apps/seed-garden-phaser",
  "docs/legacy/README.md",
  "docs/phaser/README.md"
]) {
  if (!docsIndex.includes(phrase)) failures.push(`docs/README.md missing boundary phrase: ${phrase}`);
}

const roadmap = fs.readFileSync("docs/ROADMAP.md", "utf8");
for (const phrase of ["Issue #436", "apps/legacy-react-playable", "apps/seed-garden-phaser", "Issue #433"]) {
  if (!roadmap.includes(phrase)) failures.push(`docs/ROADMAP.md missing boundary phrase: ${phrase}`);
}

console.log(JSON.stringify({ ok: failures.length === 0, requiredPaths: requiredPaths.length, failures }, null, 2));

if (failures.length > 0) process.exit(1);
