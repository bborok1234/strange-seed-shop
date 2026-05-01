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
2. 새 게임 issue를 고르기 전에 `Studio Campaign Gate`를 적용한다. 현재 campaign source of truth는 `P0.5 Idle Core + Creative Rescue`다.
3. 게임 기능/UI/에셋/QA issue이면 `game-studio:game-studio`로 먼저 분류하고, 즉시 specialist route를 고정한다.
4. 다음 issue를 선택하거나 만든다. 이때 선택 기준은 "안전하고 작은 작업"이 아니라 `docs/NORTH_STAR.md`의 Production Bar와 `docs/IDLE_CORE_CREATIVE_GUIDE.md`의 vertical slice workflow다.
5. 구현 전에 `items/<id>.md` 또는 동등 문서에 `## Plan`, Game Studio route, Game Studio Department Signoff, Subagent/Team Routing, 수용 기준, 검증 명령, 금지 범위를 적는다.
6. branch에서 작업한다.
7. 로컬 검증과 필요한 visual evidence를 남긴다. UI/visual 변경이면 Browser Use `iab` QA를 먼저 시도하고, 처음 도구가 보이지 않으면 `tool_search`로 Node REPL `js`를 lazy-load한 뒤 재시도한다.
8. PR을 만들고 GitHub checks를 확인한다.
9. merge 후 main CI를 확인한다.
10. 완료 보고는 중단 조건이 아니라 checkpoint로 취급하고, stop rule이 없으면 다음 issue를 plan-first로 선택한다.

원격 게시 기본값: `$seed-ops` issue loop에서 branch push, draft PR 생성/갱신, GitHub checks 확인, merge, main CI 확인은 별도 사용자 지시가 없어도 완료 조건에 포함된다. 확인 질문으로 멈추지 않는다. 다만 credential, 외부 배포, 결제/광고/고객 데이터, destructive boundary, 실채널 GTM은 stop rule과 명시 승인 규칙을 우선한다.

### No post-merge closeout

- all merge-blocking evidence must be in the original PR before merge/close.
- post-merge main CI is observation-only: merge 후 main CI는 GitHub run 관찰로만 확인하고, 그 결과를 repo에 backfill하기 위한 main-targeted closeout commit을 만들지 않는다.
- do not create a post-merge closeout PR for the just-merged issue. PR이 닫힌 뒤 evidence를 보강해야 할 정도로 누락이 있으면, 그것은 원 PR merge gate 실패로 보고 다음 plan-first harness defect issue로 분리한다.

### Ralph runner boundary

`$seed-ops`는 `$ralph`의 상태/검증 계약을 참고하지만, Codex App에서 `$ralph`를 입력했다는 사실만으로 장시간 runner가 실행 중이라고 보지 않는다.

- prompt-side `$ralph` activation은 `.omx/state/sessions/<id>/ralph-state.json`을 만들거나 갱신할 수 있다. `active:true`, `current_phase:"starting"`, `iteration:0`, runner metadata 없음이면 `prompt-side-only` 상태다.
- live long runner로 인정하려면 detached `omx ralph`/`omx exec` runner artifact, heartbeat source, watchdog source가 함께 있어야 한다.
- foreground Codex App 루프는 직접 tool loop와 operator heartbeat로 증명한다. detached runner가 없으면 4h/6h/overnight Ralph runner가 돌고 있다고 보고하지 않는다.
- lifecycle 판단은 assistant message 문구 감지가 아니라 structured state, heartbeat, watchdog, runner artifact를 기준으로 한다.
- PR/CI wait continuation은 heartbeat phase와 watchdog source로 남긴다. final summary, 완료 문구, 게시 확인 문구는 continuation evidence가 아니다.

### No-final continuation gate

`$seed-ops`에서 assistant `final` 응답은 세션을 닫는 terminal action이다. `final response is terminal`을 운영 계약으로 보고, stop rule 없이 `final` 응답을 보내지 않는다.

- 완료 요약은 final이 아니라 commentary checkpoint로 남긴다.
- stop rule이 없고 다음 작업이 non-destructive라면 즉시 다음 issue를 만들거나 선택하고 plan-first artifact를 작성한다.
- 실제 continuation은 `next issue plan artifact exists` 상태다. 다음 `items/<id>.md` 또는 동등 문서에 `## Plan`, 수용 기준, 검증 명령, 리스크가 있어야 한다.
- `left the next queue candidate is not continuation`: roadmap/control room/final summary에 다음 후보를 적어두는 것은 continuation이 아니다.
- final 응답은 명시 중단, 시간 상한, 외부 승인/credential/destructive boundary, 치명적 blocker, materially branching 제품 결정 중 하나를 보고서로 고정한 뒤에만 허용된다.

### PR publication confirmation boundary

Codex App에서는 GitHub PR 생성/수정, issue 수정, comment 게시처럼 외부에 운영사 문장을 공개하는 representational communication이 action-time confirmation을 요구할 수 있다. 이 경계는 safety gate이지 `$seed-ops`의 완료 조건이 아니다.

- This is not a terminal stop: PR publication confirmation boundary는 `final response is terminal` 예외가 아니며, do not send final just to ask for PR creation.
- assistant final publication ask is a regression: final로 GitHub 게시 확인을 묻지 않는다.
- confirmation wording, if unavoidable, must be commentary, not final.
- write heartbeat before any publication ask를 먼저 수행하고, same-turn local continuation action으로 heartbeat/control room/report/checker/next plan 중 하나를 실제 tool action으로 남긴다.
- 같은 final publication ask가 반복되면 open a harness-defect fix instead of stopping.
- 확인이 필요한 순간에는 final이 아니라 commentary checkpoint로 pending external-publication gate를 남긴다.
- 동시에 `reports/operations/` 또는 현재 `items/<id>.md`에 branch, commit, PR body file, 정확한 pending command, 필요한 confirmation, next local safe work를 기록한다.
- 그 직후 `next issue plan artifact exists` 상태를 만들거나 이미 존재하는 다음 plan artifact를 최신 blocker/continuation evidence에 연결한다.
- 확인 대기 중에도 destructive/external 작업이 아닌 local safe work는 계속한다. 예: 다음 issue plan 보강, asset plan/prompt 초안, local QA 계획, docs/checker hardening, report 갱신.
- 로컬로 계속할 안전한 작업이 전혀 없고 PR/issue/comment 게시만 남으면 blocker report를 보낼 수 있다. 이 경우에도 final은 vague ask가 아니라 pending external-publication gate와 stop rule을 명시해야 한다.

### Game Studio routing gate

이 프로젝트는 일반 웹앱이 아니라 브라우저 게임이다. `$seed-ops`가 게임 기능, UI/HUD, playfield, asset, QA, playtest issue를 처리할 때는 Game Studio plugin route가 필수다.

- Umbrella: `game-studio:game-studio`로 fantasy, player verbs, core loop, UI surface, asset workflow, playtest approach를 먼저 정렬한다.
- UI/HUD/layout: `game-studio:game-ui-frontend` 기준을 적용한다. playfield 보호, 낮은 persistent HUD 밀도, secondary panel collapse, generic dashboard 금지가 blocking rule이다.
- Browser-game QA: `game-studio:game-playtest` 기준을 적용한다. 첫 actionable screen, main verbs, HUD readability, playfield obstruction, screenshot review, severity findings를 기록한다.
- Phaser/runtime: `game-studio:phaser-2d-game` 또는 `game-studio:web-game-foundations` 기준으로 simulation/render/UI/input boundary를 점검한다.
- 2D sprite/FX: `game-studio:sprite-pipeline` 또는 프로젝트 로컬 GPT asset skills를 사용한다.

Game Studio route가 필요한 issue/PR에서 route가 비어 있으면 plan 미완성이다. UI/visual 변경에서 “DOM이 보임”, “viewport 안에 있음”, “겹치지 않음”만으로는 통과가 아니다. 첫 화면이 게임 장면으로 읽히고, player verb와 즉시 행동이 명확하며, playfield가 보호되어야 한다.

사용자 screenshot으로 제보된 UI bug는 그 screenshot을 source-of-truth 재현 상태로 취급한다. 같은 URL, viewport, QA 파라미터, 클릭/탭 sequence를 재현해 before/after screenshot을 남기고, 같은 실패 mode를 잡는 자동 회귀 gate를 추가한다. 모바일 카드/패널은 DOM text visible만으로 통과시키지 않고 body scroll, 하단 탭 overlap, visible child overflow, `overflow: hidden`으로 가려진 내부 콘텐츠를 확인한다.

### Studio Campaign Gate

새 게임 issue는 campaign의 하위 산출물이다. `$seed-ops`는 직전 issue 옆의 다음 기능을 자동으로 고르지 않고, active campaign source of truth에서 다음 production gap을 고른다.

현재 active campaign은 `P0.5 Idle Core + Creative Rescue`다. 이 campaign은 첫 5분 loop, production readability, creative rescue, asset/FX consistency, Browser Use/playtest evidence가 모두 충족될 때만 닫는다.

다음 issue plan에는 아래가 있어야 한다.

- campaign source of truth
- reference teardown
- creative brief
- Game Studio Department Signoff
- candidate issue list와 선택/거절 사유
- Strategic Jump Check
- Title Contract
- Subagent/Team Routing decision
- QA/playtest plan

### Strategic Jump Check

`$seed-ops`는 직전 issue에서 이어지는 작은 기능을 자동 선택하지 않는다. 새 게임 issue plan은 최소 3개 후보를 비교하고, 그중 하나는 큰 방향 점프 후보여야 한다.

큰 방향 점프 후보는 전체 art direction/accepted raster asset family, 첫 화면 UI/UX 재배치, core gameplay verb 추가 또는 단순화, production readability를 막는 visual QA 하네스 결함, 첫 5분 fun rubric의 high-severity confusion 중 하나를 실제 화면/플레이에서 크게 바꾸는 후보다.

선택한 후보가 작은 연결 기능이면 `Strategic Jump Check`에 큰 방향 점프 후보보다 먼저 해야 하는 근거를 적는다. “직전 issue에서 이어진다”, “작다”, “안전하다”, “CI가 빠르다”만으로는 선택 실패다.

### Title Contract

Issue/PR 제목은 운영사 evidence surface다. 게임 issue/PR 제목은 한국어를 기본으로 하고, `screen moment + player verb + production/progression role` 중 최소 2개를 담는다. `bridge`, `payoff`, `v0`, `closeout`, `완료 증거`만으로 제목을 만들지 않는다.

- 좋은 예: `달방울 누누가 달빛 보호 주문을 납품하게 만들기`
- 좋은 예: `정원 첫 화면을 생산 엔진 중심으로 재배치`
- 나쁜 예: `Lunar guardian order bridge v0`
- 나쁜 예: `Issue 254 closeout`

PR 제목은 연결 issue 제목의 의도를 유지한다. issue와 PR이 서로 다른 언어/스코프/증거 단계처럼 보이면 PR body에 `Title Contract` 보정 사유를 적고, 가능하면 PR 제목을 고친다.

### Game Studio Department Signoff

기존 `Intake / Review / Apply / Verify / Audit`는 실행 stage이고, 아래 부서는 ownership axis다. 각 부서는 의견만 내는 역할이 아니라 plan artifact의 특정 산출물을 소유한다.

| 부서 | 책임 | 필수 산출물 |
| --- | --- | --- |
| 기획팀 | player verb, loop, reward timing | player value, production/progression role, first 5 minutes moment |
| 리서치팀 | 경쟁작 production gap과 reference | reference teardown, 비교 기준, rejected alternative |
| 아트팀 | style consistency와 asset/FX | art direction, gpt-image-2 default/fallback, manifest/animation plan |
| 개발팀 | runtime/save/economy boundary | implementation tranche, touched files, rollback boundary |
| 검수팀 | Browser Use와 regression | playtest evidence, screenshot/report/checks |
| 마케팅팀 | mock-only player-facing promise | devlog/release-note angle, no real channel action |
| 고객지원팀 | confusion/support risk | support risk, FAQ note, first 5 minutes confusion |

충돌이 있으면 `role-debate note`를 남긴다. 예: 아트팀 요구와 개발 scope가 충돌하면 최종 선택과 거절한 대안을 plan에 기록한다.

### Subagent/Team Routing

`$seed-ops`는 역할별 독립 산출물이 있을 때 Codex native subagents 또는 team mode를 사용한다.

- 리서치/로컬 감사/QA가 구현과 독립적으로 병렬 진행 가능할 때
- 아트 계획과 runtime 구현의 write scope가 분리될 때
- 검수팀이 구현 중 병렬로 회귀 기준을 준비할 수 있을 때
- campaign pass처럼 여러 역할의 관점 누락 위험이 높은 작업일 때

사용하지 않는 경우도 plan에 이유를 적는다.

### 다음 issue 선택 gate

`$seed-ops`는 작은 기능 개선을 기본값으로 고르지 않는다. 새 게임 issue 후보는 아래 5개 중 최소 3개를 plan에 명시해야 한다.

1. `player verb`: 플레이어가 새로 하거나 더 명확히 이해하는 행동.
2. `production/progression role`: 생산 엔진, 주문/납품, 업그레이드, 오프라인 복귀, 연구/원정, 수집 progression 중 어느 위치를 강화하는지.
3. `screen moment`: 첫 5분 또는 복귀 후 30초 안에서 실제로 보이는 장면.
4. `asset/FX`: 필요한 gameplay asset/FX, sprite state, motion, HUD/playfield 시각 변화. 기존 asset 재사용만으로는 통과하지 않는다.
5. `playtest evidence`: Browser Use, visual QA, 수치 검증으로 볼 사용자 관찰 포인트.

`asset/FX` 축은 `playfield state`, `HUD affordance`, `sprite/FX`, `order crate visual state`, `reward motion` 중 최소 하나의 concrete visual/game-feel payoff와 경쟁작 production gap을 같이 적어야 한다. `safe`, `local`, `작다`는 선택 이유가 아니라 승인/파괴/외부 권한 gate를 통과했다는 조건이다. 단순 주문 추가, 색/여백/문구, copy tweak, test-only/doc-only 작업은 위 visual payoff를 동반해 production vertical slice blocker를 제거하거나 명확한 vertical slice 일부일 때만 선택한다.

신규 게임 그래픽 asset의 기본 생성 경로는 OpenAI Images API `gpt-image-2`다. gpt-image-2/API 생성은 `OPENAI_API_KEY`와 `SEED_ASSET_IMAGE_MODEL`을 사용하며, 키가 없으면 생성 단계는 hard-block으로 기록한다. accepted manifest game asset으로 SVG/vector/code-native 그림을 만들거나 등록하지 않는다. `asset/FX` 축을 선택한 issue는 `gpt-game-asset-plan -> gpt-game-asset-prompt -> gpt-game-asset-generate -> gpt-game-asset-review` 또는 gpt-image-2 API provenance 중 하나를 plan/evidence에 남기고, `npm run check:asset-provenance`와 `npm run check:asset-style`을 통과해야 한다.

Asset/FX work는 gastory에서 가져온 bundle 기준도 따른다. 즉 project style state, prompt/model sidecar, reference image consistency, animation camera/composition lock, frame/GIF/spritesheet extraction, manifest QA, small-size visual review가 plan/evidence에 있어야 한다.

gpt-image-2 API가 credit/quota/rate limit/organization verification/model access로 막히면 기존처럼 Codex native image generation fallback을 사용한다. fallback도 최종 산출물은 raster PNG workspace file이어야 하며, SVG/vector/code-native 그림은 여전히 금지다. fallback 발생 시 `assets/source/gpt_image_asset_provenance.json`에 blocker와 fallback_required를 남긴다.

FX/애니메이션이 payoff인 issue는 static icon 하나로 통과하지 않는다. `sprite/FX` 후보는 sprite sheet 또는 FX strip 계획, frame count, frame size, intended frame rate, manifest `animation.binding`, Browser Use/playtest 관찰 지점을 함께 적어야 한다.

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
- 사용자 screenshot 제보가 있으면 동일 재현 상태의 before/after screenshot과 layout invariant 결과를 남긴다.

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
