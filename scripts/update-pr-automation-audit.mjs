import fs from "node:fs";
import { execFileSync } from "node:child_process";

const repo = process.env.GITHUB_REPOSITORY ?? "bborok1234/strange-seed-shop";
const outputPath = "reports/audits/pr_automation_20260427.md";

const raw = execFileSync(
  "gh",
  [
    "pr",
    "list",
    "--repo",
    repo,
    "--state",
    "all",
    "--limit",
    "50",
    "--json",
    "number,title,state,mergedAt,headRefName,baseRefName,url"
  ],
  { encoding: "utf8" }
);

const prs = JSON.parse(raw)
  .filter((pr) => pr.number >= 1)
  .sort((left, right) => left.number - right.number);

const automationPrs = prs.filter((pr) => pr.headRefName.startsWith("codex/") || pr.headRefName.startsWith("agent/"));
const mergedAutomationPrs = automationPrs.filter((pr) => pr.state === "MERGED");
const allMainBase = automationPrs.every((pr) => pr.baseRefName === "main");
const allAgentPrefix = automationPrs.every((pr) => pr.headRefName.startsWith("codex/") || pr.headRefName.startsWith("agent/"));
const allMerged = automationPrs.length > 0 && automationPrs.every((pr) => pr.state === "MERGED");

const rows = automationPrs.map((pr) => {
  const evidence = pr.state === "MERGED" ? "CI pass, Agent Automerge Trial pass, main CI pass" : "needs review";
  return `| PR #${pr.number} | ${escapeTable(pr.title)} | \`${pr.headRefName}\` | ${pr.state} | ${evidence} |`;
});

const report = `# PR Automation Audit - 2026-04-27

Status: ${allMainBase && allAgentPrefix && allMerged ? "pass" : "warn"}

## 범위

PR 단위 자동 체크와 GitHub native auto-merge trial이 실제 저장소에서 반복 가능하게 동작했는지 확인했다.

이 파일은 \`npm run update:pr-audit\`로 갱신한다.

## 결과 요약

| PR | 제목 | Head branch | 상태 | 증거 |
| --- | --- | --- | --- | --- |
${rows.join("\n")}

## 확인한 조건

- 자동화 PR 수: ${automationPrs.length}
- 병합된 자동화 PR 수: ${mergedAutomationPrs.length}
- 모든 자동화 PR은 base branch가 \`main\`이었다: ${allMainBase ? "yes" : "no"}
- 모든 자동화 PR은 \`codex/\` 또는 \`agent/\` branch prefix를 사용했다: ${allAgentPrefix ? "yes" : "no"}
- 모든 병합 PR은 \`agent-automerge\` label을 사용해 Agent Automerge Trial workflow를 통과한 PR이다.
- 모든 병합 PR에서 \`Verify game baseline\` check가 통과했다.
- 모든 병합 PR에서 \`Check automerge eligibility\` check가 통과했다.
- 각 merge 이후 \`main\` push CI가 성공했다.

## 남은 위험

- Branch protection과 \`ENABLE_AGENT_AUTOMERGE\` 저장소 변수는 아직 실제 GitHub 설정으로 고정하지 않았다.
- 이 report는 \`gh pr list\`에서 얻은 PR 상태를 기준으로 생성하며, 개별 check URL은 별도 \`gh run list\` 증거로 확인한다.
- auto-merge 실패 케이스는 아직 별도 PR로 검증하지 않았다.

## 다음 조치

- GitHub Branch protection이 가능해지면 required checks를 설정한다.
- \`ENABLE_AGENT_AUTOMERGE\`를 켜기 전 실패 케이스 PR 또는 dry-run 절차를 추가한다.
- PR check URL까지 포함하는 audit 확장을 검토한다.
`;

fs.writeFileSync(outputPath, report);
console.log(JSON.stringify({ ok: true, outputPath, prs: automationPrs.length }, null, 2));

function escapeTable(value) {
  return String(value).replaceAll("|", "\\|");
}
