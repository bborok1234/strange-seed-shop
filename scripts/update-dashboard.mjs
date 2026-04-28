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
  ["공통 북극성", fileStatus(["docs/NORTH_STAR.md"]), "`docs/NORTH_STAR.md`"],
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
  ["대시보드 자동 갱신", stepStatus("Create dashboard", "review"), "`npm run update:dashboard`, `npm run check:dashboard`"],
  ["자동 머지 거버넌스", stepStatus("Document automerge governance", "review"), "`npm run check:governance`"],
  ["PR 자동화 audit", stepStatus("Accumulate PR automation audit", "review"), "`npm run check:audit`"],
  ["Branch protection audit", stepStatus("Audit Branch protection status", "review"), "`reports/audits/branch_protection_20260427.md`"],
  ["PR audit 생성기", stepStatus("Generate PR automation audit", "review"), "`npm run update:pr-audit`"],
  ["Browser Use QA gate", stepStatus("Browser Use QA gate", "review"), "`npm run check:browser-qa`"],
  ["운영사 v0", stepStatus("Create operator work item schema", "todo"), "`npm run check:operator`"],
  ["운영사 watchdog", stepStatus("Build watchdog runner", "todo"), "`npm run operator:watchdog`"],
  ["운영사 trial dry-run", stepStatus("Create supervised trial dry-run", "todo"), "`npm run operator:trial:dry-run`"],
  ["운영사 2h readiness", stepStatus("Add 2h supervised trial readiness gate", "todo"), "`npm run operator:trial:readiness`"],
  ["운영 상황판", stepStatus("Add operator control room and playable mode", "todo"), "`docs/OPERATOR_CONTROL_ROOM.md`, `npm run check:control-room`"],
  ["사람 플레이 모드", fileStatus(["docs/PLAYABLE_MODE.md", "scripts/prepare-playable-main.mjs"]), "`npm run play:main`, port 5174"],
  [
    "Sprite batch QA gate",
    stepStatus("Starter seed sprite-pipeline first batch", "review"),
    "`npm run check:sprite-batch`"
  ],
  ["플레이테스트 intake", stepStatus("Create feedback intake format", "todo"), "`npm run check:playtest-intake`"],
  ["GTM mock lane", stepStatus("Add GTM mock lane", "todo"), "`npm run check:gtm-mock`"],
  ["Asset normalization", stepStatus("Asset export and strip normalization path", "todo"), "`npm run check:asset-normalization`"]
];

const commands = [
  "npm run check:content",
  "npm run check:loop",
  "npm run simulate:economy",
  "npm run check:docs",
  "npm run check:apply",
  "npm run check:dashboard",
  "npm run check:browser-qa",
  "npm run check:sprite-batch",
  "npm run check:asset-normalization",
  "npm run check:playtest-intake",
  "npm run check:gtm-mock",
  "npm run check:control-room",
  "npm run check:operator",
  "npm run check:governance",
  "npm run check:audit",
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

1. \`docs/OPERATOR_CONTROL_ROOM.md\`에서 active mission/small win/evidence/playable mode를 먼저 확인한다.
2. 사람이 게임을 확인해야 하면 \`npm run play:main\` 후 \`../strange-seed-shop-play\`에서 port 5174로 실행한다.
3. 24h dry run은 control room/playable mode PR이 merge되고 main CI가 green이 된 뒤 시작한다.

## 검증 상태

| 명령 | 상태 |
| --- | --- |
${commands.map((command) => `| \`${command}\` | tracked |`).join("\n")}

## 열린 위험

- \`main\` Branch protection은 2026-04-28 기준 활성이고 required checks를 강제한다. \`ENABLE_AGENT_AUTOMERGE\` 활성화는 별도 운영 결정으로 유지한다.
- Browser Use QA는 Phase 0 기준을 통과했지만, 신규 UI가 생기면 같은 캡처 절차로 갱신해야 한다.
- 대시보드는 자동 생성되지만 검증 결과 자체를 실행해 저장하지는 않는다.
- 운영 상황판은 살아있는 snapshot이므로 장시간 run 시작/종료/PR 전후에 \`npm run operator:control-room -- --output reports/operations/operator-control-room-YYYYMMDD.md\`로 갱신한다.
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
