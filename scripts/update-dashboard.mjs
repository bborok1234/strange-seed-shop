import fs from "node:fs";

const dashboardPath = "docs/DASHBOARD.md";
const roadmapPath = "docs/ROADMAP.md";

const read = (path) => fs.readFileSync(path, "utf8");
const exists = (path) => fs.existsSync(path);

const roadmap = read(roadmapPath);

const roadmapRows = roadmap
  .split("\n")
  .filter((line) => line.startsWith("| ") && !line.includes("---"))
  .map((line) => line.split("|").map((cell) => cell.trim()));

const countStatus = (status) => roadmapRows.filter((cells) => cells[2] === status).length;

const stepStatus = (stepName, fallback) => {
  const row = roadmapRows.find((cells) => cells[1] === stepName);
  return row?.[2] ?? fallback;
};

const fileStatus = (paths) => (paths.every(exists) ? "verified" : "blocked");

const rows = [
  ["Phase 0 제품 루프", fileStatus(["src/App.tsx", "scripts/check-game-loop.mjs"]), "`npm run check:loop`"],
  [
    "정적 에셋 파이프라인",
    fileStatus(["public/assets/manifest/assetManifest.json", "reports/assets/asset_review_20260427.md"]),
    "`public/assets/manifest/assetManifest.json`"
  ],
  ["경제 검증", fileStatus(["scripts/simulate-economy.mjs", "reports/economy/economy_sim_20260427.md"]), "`npm run simulate:economy`"],
  ["브라우저 QA", stepStatus("Visual/mobile QA", "review"), "`reports/visual/browser_use_qa_20260427.md`"],
  ["PR 자동 검증", fileStatus([".github/workflows/ci.yml", ".github/workflows/agent-automerge.yml"]), "PR #1, PR #2"],
  ["Apply gate", fileStatus(["docs/APPLY_CONDITIONS.md", "scripts/check-apply-conditions.mjs"]), "`npm run check:apply`"],
  ["대시보드 자동 갱신", stepStatus("Create dashboard", "review"), "`npm run update:dashboard`, `npm run check:dashboard`"]
];

const commands = [
  "npm run check:content",
  "npm run check:loop",
  "npm run simulate:economy",
  "npm run check:docs",
  "npm run check:apply",
  "npm run check:dashboard",
  "npm run build"
];

const today = new Date().toISOString().slice(0, 10);
const generated = `# 프로젝트 대시보드

Updated: ${today}

> 이 파일은 \`npm run update:dashboard\`로 갱신한다. 수동 편집 후에는 \`npm run check:dashboard\`가 실패할 수 있다.

## 현재 상태

| 영역 | 상태 | 증거 |
| --- | --- | --- |
${rows.map((row) => `| ${row[0]} | ${row[1]} | ${row[2]} |`).join("\n")}

## 로드맵 요약

| 상태 | 개수 |
| --- | ---: |
| done | ${countStatus("done")} |
| review | ${countStatus("review")} |
| todo | ${countStatus("todo")} |
| blocked | ${countStatus("blocked")} |

## 다음 작업

1. Browser Use로 오프라인 복귀 QA를 완료한다.
2. Browser Use로 데스크톱 폭 QA를 완료한다.
3. 대시보드와 audit report를 PR 이후 상태에 맞춰 계속 갱신한다.

## 검증 상태

| 명령 | 상태 |
| --- | --- |
${commands.map((command) => `| \`${command}\` | tracked |`).join("\n")}

## 열린 위험

- \`ENABLE_AGENT_AUTOMERGE\` 저장소 변수와 브랜치 보호 규칙은 아직 명시적으로 고정하지 않았다.
- Browser Use QA는 모바일 클릭 플로우 중심이며 오프라인 복귀와 데스크톱 폭 검증이 남아 있다.
- 대시보드는 자동 생성되지만 검증 결과 자체를 실행해 저장하지는 않는다.
`;

if (process.argv.includes("--check")) {
  const current = exists(dashboardPath) ? read(dashboardPath) : "";
  if (current !== generated) {
    console.error(
      JSON.stringify(
        {
          ok: false,
          failure: "docs/DASHBOARD.md is stale; run npm run update:dashboard"
        },
        null,
        2
      )
    );
    process.exit(1);
  }

  console.log(JSON.stringify({ ok: true, dashboard: dashboardPath }, null, 2));
} else {
  fs.writeFileSync(dashboardPath, generated);
  console.log(JSON.stringify({ ok: true, updated: dashboardPath }, null, 2));
}
