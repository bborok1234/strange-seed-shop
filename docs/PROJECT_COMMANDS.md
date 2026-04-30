# 프로젝트 전용 명령어

Status: draft-v0
Owner: agent
Updated: 2026-04-29
Scope: `이상한 씨앗상회` + 에이전트 네이티브 게임 스튜디오/운영사

## 목적

이 문서는 범용 `$ralph` 실행과 이 프로젝트의 운영사 계약을 분리한다. 앞으로 사용자는 긴 설명 대신 프로젝트 전용 명령어로 “무한 작업 루프”, “보고”, “설계 대화”, “실기 QA”, “사람 플레이 준비”를 구분할 수 있다.

## 명령어 요약

| 명령 | 세션 종류 | 목적 | 기본 행동 |
| --- | --- | --- | --- |
| `$seed-ops` | 운영모드 | 북극성까지 계속 달리는 무한 작업 루프 | issue -> `## Plan` -> 구현 -> 검증 -> PR -> CI -> merge -> 다음 issue |
| `$seed-brief` | 보고/상황판 | 지금 어디까지 됐는지 증거 중심으로 요약 | issue/PR/CI/main/playable/evidence/next queue 정리 |
| `$seed-design` | 설계/기획 대화 | 게임성, UI/UX, 운영사 철학, milestone 정렬 | 선택지와 tradeoff 제시, 결정된 내용 문서화 |
| `$seed-qa` | 실기 QA | 모바일/데스크톱 실제 화면과 visual regression 확인 | Browser Use 우선, Playwright CLI/CDP fallback, screenshot evidence |
| `$seed-play` | 사람 플레이 준비 | 사용자가 agent 작업과 별개로 main 게임을 실행 | `npm run play:main`, `../strange-seed-shop-play`, port 5174 |

## `$seed-ops` — 운영모드

`$seed-ops`는 장시간 운영사 루프의 프로젝트 전용 진입점이다. `$ralph`는 범용 엔진이고, `$seed-ops`는 이 레포의 제품/운영 북극성, safety gate, issue 단위 plan-first 규칙을 함께 적용한다.

반드시 지키는 루프:

1. `docs/ROADMAP.md`, `docs/NORTH_STAR.md`, `docs/OPERATOR_CONTROL_ROOM.md`에서 현재 목표를 확인한다.
2. 게임 기능/UI/에셋/QA issue이면 `game-studio:game-studio`로 먼저 분류하고, 즉시 specialist route를 고정한다.
3. 다음 issue를 선택하거나 만든다.
4. 구현 전에 `items/<id>.md` 또는 동등 문서에 `## Plan`, Game Studio route, 수용 기준, 검증 명령, 금지 범위를 적는다.
5. branch에서 작업한다.
6. 로컬 검증과 필요한 visual evidence를 남긴다. UI/visual 변경이면 Browser Use `iab` QA를 먼저 시도하고, 처음 도구가 보이지 않으면 `tool_search`로 Node REPL `js`를 lazy-load한 뒤 재시도한다.
7. PR을 만들고 GitHub checks를 확인한다.
8. merge 후 main CI를 확인한다.
9. 완료 보고는 중단 조건이 아니라 checkpoint로 취급하고, stop rule이 없으면 다음 issue를 plan-first로 선택한다.

### Game Studio routing gate

이 프로젝트는 일반 웹앱이 아니라 브라우저 게임이다. `$seed-ops`가 게임 기능, UI/HUD, playfield, asset, QA, playtest issue를 처리할 때는 Game Studio plugin route가 필수다.

- Umbrella: `game-studio:game-studio`로 fantasy, player verbs, core loop, UI surface, asset workflow, playtest approach를 먼저 정렬한다.
- UI/HUD/layout: `game-studio:game-ui-frontend` 기준을 적용한다. playfield 보호, 낮은 persistent HUD 밀도, secondary panel collapse, generic dashboard 금지가 blocking rule이다.
- Browser-game QA: `game-studio:game-playtest` 기준을 적용한다. 첫 actionable screen, main verbs, HUD readability, playfield obstruction, screenshot review, severity findings를 기록한다.
- Phaser/runtime: `game-studio:phaser-2d-game` 또는 `game-studio:web-game-foundations` 기준으로 simulation/render/UI/input boundary를 점검한다.
- 2D sprite/FX: `game-studio:sprite-pipeline` 또는 프로젝트 로컬 GPT asset skills를 사용한다.

Game Studio route가 필요한 issue/PR에서 route가 비어 있으면 plan 미완성이다. UI/visual 변경에서 “DOM이 보임”, “viewport 안에 있음”, “겹치지 않음”만으로는 통과가 아니다. 첫 화면이 게임 장면으로 읽히고, player verb와 즉시 행동이 명확하며, playfield가 보호되어야 한다.

### 작업 종료 문서 갱신 규칙

issue 단위 작업이 끝나기 전에는 사람이 요청하지 않아도 아래를 갱신한다.

1. `items/<id>.md`: 상태, small win, plan 이행 여부, 검증 결과, PR/CI evidence.
2. `docs/ROADMAP.md`: 해당 milestone/step 상태와 `Current Next Action`.
3. `docs/DASHBOARD.md`: 직접 편집하지 않고 `npm run update:dashboard`로 갱신한 뒤 `npm run check:dashboard`.
4. GitHub issue/PR: small win, acceptance criteria, verification, evidence, 남은 risk.
5. GitHub issue 본문의 `## 수용 기준` 체크박스는 merge 후 issue가 닫히기 전에 실제 검증 결과 기준으로 `- [x]` / `- [ ]`를 갱신한다. `Closes #id`로 issue가 닫히더라도 체크박스는 자동 갱신되지 않으므로 `gh issue edit --body-file`이 완료 gate에 포함된다.

### GitHub metadata 품질 규칙

GitHub issue/PR/comment 본문은 코드와 같은 운영사 산출물이다. `$seed-ops`에서 GitHub metadata를 만들거나 고칠 때는 아래를 지킨다.

1. 본문은 먼저 markdown 파일로 작성한다.
2. `gh issue create/edit`, `gh pr create/edit`, `gh issue comment`는 `--body-file`을 사용한다.
3. 셸 인자 안에 `\n`을 넣어 multi-line 본문을 만들지 않는다. GitHub 화면에 literal `\n`이 보이면 실패다.
4. PR 본문은 `.github/pull_request_template.md`의 섹션을 유지한다: `요약`, `Small win`, `Plan-first evidence`, `사용자/운영자 가치`, `Before / After 또는 Visual evidence`, `Playable mode`, `검증`, `안전 범위`, `남은 위험`, `연결된 issue`.
5. Issue 본문은 `.github/ISSUE_TEMPLATE/agent-work-item.md`의 섹션을 유지한다: `문제 / 배경`, `목표`, `Small win`, `Game Studio route`, `Plan`, `플레이어 가치 또는 운영사 가치`, `수용 기준`, `Visual evidence 계획`, `Playable mode 영향`, `안전 범위`, `검증 명령`.
6. PR 본문에는 `작업 checklist`를 유지한다. Plan 수용 기준, Game Studio route, Browser Use 우선 QA 또는 blocker, 문서/roadmap/dashboard/report 갱신, GitHub evidence 갱신 여부를 체크한다.
7. UI/visual 변경은 Browser Use 우선 QA를 PR/issue 본문에 evidence 또는 현재 세션 blocker로 남긴다. Playwright/CDP는 fallback evidence이며 Browser Use 시도 기록을 대체하지 않는다. 오래된 Browser Use blocker report를 현재 작업의 fallback 근거로 재사용하지 않는다.
8. 완료 댓글도 축약하지 않는다. PR, merge commit, PR checks, main CI, local verification, visual/report evidence, 남은 risk 또는 후속 issue를 포함한다.
9. `npm run check:github-metadata`, `npm run check:ci`, `npm run check:all`은 이 규칙이 repo-local template에서 빠지지 않았는지 검증한다.
10. 닫힌 issue에 빈 수용 기준 체크박스가 남아 있으면 운영 evidence 실패로 본다. 다음 issue로 넘어가기 전에 issue 본문 또는 follow-up issue로 미충족 사유를 남긴다.

### CI / QA gate 분리 규칙

GitHub required checks는 빠르고 재현성 높은 `npm run check:ci`를 실행한다. Browser Use와 Playwright screenshot 기반 visual QA는 `$seed-ops` 작업 과정의 evidence gate로 남기며, UI/visual 변경 PR 본문과 `reports/visual/`에 결과 또는 blocker를 기록한다.

- `npm run check:ci`: PR/main required checks용 기본 gate다. content, docs, governance, metadata, build처럼 결정적이고 빠른 검증만 포함한다.
- `npm run check:visual`: Browser Use QA를 보강하는 screenshot/playfield 회귀 검증이다. UI/visual issue에서는 로컬 운영 evidence로 실행하지만, Browser Use 실기 QA evidence 또는 현재 세션 blocker 없이 단독 통과 근거로 쓰지 않는다.
- `npm run check:all`: 운영자가 로컬에서 전체 evidence를 묶어 확인할 때 쓰는 full gate이며, CI required check로 사용하지 않는다.

조건부 갱신:

- 새 source-of-truth 문서가 생기면 `docs/README.md`와 필요 시 `scripts/check-docs-index.mjs`.
- 운영 방식/명령/자동화 규칙이 바뀌면 `docs/PROJECT_COMMANDS.md`, `docs/OPERATOR_RUNBOOK.md`, `docs/AUTONOMOUS_PROJECT_OPERATING_MODEL.md`, 필요 최소한의 `AGENTS.md`.
- 게임 방향/재미/디자인/에셋 기준이 바뀌면 `docs/NORTH_STAR.md`, `docs/PRD_PHASE0.md`, `docs/IDLE_CORE_CREATIVE_GUIDE.md`, `docs/DESIGN_SYSTEM.md`.
- UI/visual 작업이면 Browser Use 우선 QA, `reports/visual/` evidence, `npm run check:visual`.
- 운영 실행 결과이면 `reports/operations/`에 해당 실행 보고서.

Stop rules:

- 사용자가 stop/cancel/abort를 명시한다.
- 정해진 시간 상한에 도달했고 final heartbeat/watchdog/daily report가 남았다.
- 결제, 로그인, 광고, 외부 배포, 고객 데이터, 실채널 GTM, credential, destructive boundary가 필요하다.
- 치명적 blocker가 있고 복구 경로가 없다.
- 제품 방향상 사용자 결정이 필요한 materially branching 선택지가 있다.

## `$seed-brief` — 보고/상황판 모드

`$seed-brief`는 새 작업을 시작하는 명령이 아니다. 사용자가 현재 상태를 빠르게 이해하도록 증거를 모으는 read-mostly 모드다.

보고 형식:

- 현재 mode / active mission
- 완료된 small wins
- 열린 issue/PR/CI와 상태
- main branch CI 상태
- visual evidence와 playable mode
- 실패/복구/남은 리스크
- 다음 queue
- 사람 결정 필요 여부

`$seed-brief` 중에는 사용자가 명시하지 않는 한 새 구현, PR merge, 장시간 루프 진입을 하지 않는다.

## `$seed-design` — 설계/기획 대화 모드

`$seed-design`은 게임성과 운영사 구조를 사용자와 정렬하는 모드다. “어때?”, “방향 잡자”, “디자인을 어떻게 개선할까?” 같은 질문은 이 모드가 기본이다.

권장 절차:

1. 관련 문서와 현재 화면/운영 상태를 확인한다.
2. `game-studio:game-studio`로 fantasy, player verbs, core loop, UI surface, asset workflow, playtest approach를 정렬한다.
3. 필요하면 `game-studio:game-ui-frontend`, `game-studio:web-game-foundations`, `game-studio:game-playtest`, `game-studio:sprite-pipeline` 중 specialist 관점으로 좁힌다.
4. 선택지를 2~4개로 좁힌다.
5. tradeoff와 추천안을 제시한다.
6. 결정된 내용은 필요하면 docs/roadmap/items에 남긴다.
7. 구현이 명확해지면 `$seed-ops`용 issue와 plan-first artifact로 넘긴다.

## `$seed-qa` — 실기 QA / visual QA 모드

`$seed-qa`는 실제 화면 기준의 검증 모드다.

도구 우선순위:

1. Browser Use가 가능한 세션이면 `browser-use:browser`를 먼저 사용한다.
2. Browser Use가 처음 보이지 않으면 `tool_search`로 Node REPL `js` 실행 tool을 찾고 `iab` backend bootstrap을 시도한다.
3. Browser Use가 막히면 현재 세션 blocker report를 남기고 Playwright CLI/CDP fallback을 사용한다.
4. Computer Use는 in-app browser와 CLI fallback이 모두 부적합할 때 대체 경로로 사용한다.

필수 증거:

- 모바일 393/375/360 중 관련 viewport screenshot
- 데스크톱 1280x900 또는 명시 game frame screenshot
- `reports/visual/` markdown 또는 image artifact
- UI 변경이면 `npm run check:visual`
- 게임 화면 QA이면 `game-studio:game-playtest` 기준으로 첫 actionable screen, main verbs, HUD readability, playfield obstruction, screenshot review findings를 남긴다.

## `$seed-play` — 사람 플레이 준비 모드

`$seed-play`는 사용자가 agent 작업 중에도 main 게임을 실행해볼 수 있게 하는 모드다.

기본 명령:

```bash
npm run play:main -- --check
npm run play:main
npm run play:main:serve
```

기준:

- worktree: `../strange-seed-shop-play`
- port: `5174`
- 현재 agent branch와 사람이 플레이하는 main worktree를 섞지 않는다.

## 충돌 해결

- 사용자가 “계속 달려”, “운영모드”, “북극성까지”라고 하면 `$seed-ops`로 본다.
- 사용자가 “지금 뭐 했어”, “보고해줘”, “상태 알려줘”라고 하면 `$seed-brief`로 본다.
- 사용자가 “어때”, “방향”, “설계”, “기획”을 묻는다면 `$seed-design`으로 본다.
- 사용자가 screenshot, 화면, 모바일, QA를 말하면 `$seed-qa`로 본다.
- 사용자가 직접 게임 실행을 말하면 `$seed-play`로 본다.

명령어가 섞이면 가장 안전한 모드가 우선이다. 예를 들어 `$seed-brief`와 `$seed-ops`가 함께 있으면 먼저 brief로 현재 상태를 고정한 뒤, stop rule이 없을 때 ops로 이어간다.
