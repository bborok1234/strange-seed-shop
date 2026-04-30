# Browser Use source-of-truth guard

Status: completed
Work type: operator_qa
Branch: `codex/0098-browser-use-source-of-truth-guard`
Date: 2026-04-30
Issue: #175

## 문제 / 배경

프로젝트 지침은 UI/visual QA에서 Browser Use 우선을 요구하지만, 실제 운영 중 Playwright visual gate가 Browser Use 실기 QA를 대체하는 것처럼 사용됐다. 원인은 source of truth가 “Browser Use 우선”을 말하면서도 Node REPL `js` tool이 lazy-load될 수 있다는 현재 조건과, fallback 전 재시도/증거 요건을 충분히 강제하지 못했기 때문이다.

## Small win

UI/visual 작업에서 Browser Use를 건너뛰려면 `tool_search`로 Node REPL `js` 노출을 재확인하고, blocker report를 남긴 뒤에만 Playwright/CDP fallback을 허용하도록 문서와 checker를 강화한다.

## Plan

1. `docs/BROWSER_QA.md`의 Browser Use 우선 절차를 현재 Codex App/Browser Use 플러그인 구조에 맞게 갱신한다.
2. `$seed-ops`, `$seed-qa`, PR evidence 규칙에 “Playwright는 반복 회귀 gate이지 Browser Use 대체가 아니다”를 명시한다.
3. `scripts/check-browser-qa.mjs`가 lazy-load/tool_search 재확인, Browser Use evidence/blocker, Playwright fallback 제한 문구를 검증하게 한다.
4. roadmap/dashboard/checks를 갱신하고 로컬 검증으로 완료 여부를 확인한다.

## 수용 기준

- [x] Browser Use fallback 전 `tool_search`로 Node REPL `js`를 찾아야 한다는 지침이 source of truth에 들어간다.
- [x] 오래된 2026-04-28 진단이 현재 세션의 fallback 근거로 재사용되면 안 된다는 지침이 들어간다.
- [x] Playwright CLI는 반복 회귀 gate이며 Browser Use 실기 QA evidence를 대체하지 않는다고 명시된다.
- [x] checker가 위 문구가 빠지면 실패한다.
- [x] `npm run check:browser-qa`, `npm run check:project-commands`, `npm run check:ci`가 통과한다.

## 검증 명령

- [x] `npm run check:browser-qa` PASS
- [x] `npm run check:project-commands` PASS
- [x] `npm run check:ci` PASS

## Evidence

- Source of truth: `docs/BROWSER_QA.md`, `docs/PROJECT_COMMANDS.md`, `AGENTS.md`, `.codex/skills/seed-ops/SKILL.md`
- Checker: `scripts/check-browser-qa.mjs`

## 안전 범위

- 게임 runtime 변경 없음.
- 외부 배포, 로그인, 결제, 고객 데이터, 실채널 GTM 없음.
- 기존 Playwright visual suite는 제거하지 않고 Browser Use 보강 gate로만 재정의한다.
