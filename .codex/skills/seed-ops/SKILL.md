---
name: seed-ops
description: Deprecated adapter for pre-v3 이상한 씨앗상회 Productionization support. Studio Harness v3 entrypoint가 아니다. 새 무한 운영/계속 운영/북극성 실행은 `npm run studio:v3:operate`를 사용한다.
---

# Seed Ops

> Deprecated adapter: 이 skill은 Studio Harness v3 entrypoint가 아니다. 새 무한 운영, 계속 운영, 북극성 실행, 24h foreground operator는 `npm run studio:v3:operate`로 시작한다. `$seed-ops`는 v3 이전 Productionization 보조 표면으로만 남긴다.

이 skill은 `$ralph` 같은 범용 지속 실행 엔진 위에 이 프로젝트의 운영사 계약을 얹던 과거 표면이다.

## Mode contract

- 목표: deprecated adapter 상태에서 이미 승인된 Productionization 보조 작업만 지원한다. 새 v3 운영 목표는 `npm run studio:v3:operate`가 소유한다.
- 기본 루프: issue 선택/생성 -> `## Plan` artifact -> branch -> 구현 -> 로컬 검증 -> PR -> GitHub checks -> merge -> main CI -> 다음 issue.
- 완료 보고는 중단 조건이 아니라 checkpoint다.
- 원격 게시 기본값: `$seed-ops`로 시작한 issue loop에서는 사용자가 별도로 "push/PR/merge 해도 돼?"라고 말하지 않아도 branch push, draft PR 생성/갱신, GitHub checks 확인, main merge, main CI 확인까지가 완료 조건이다. 단, credential, 외부 배포, 결제/광고/고객 데이터, destructive boundary는 Stop rules를 우선한다.
- 각 issue는 작은 승리, 수용 기준, 검증 명령, evidence, 남은 리스크를 남긴다.
- issue 종료 전 GitHub issue 본문의 `## 수용 기준` 체크박스를 실제 검증 결과로 갱신한다. `Closes #id`는 issue를 닫을 뿐 체크박스를 채우지 않으므로 빈 체크박스가 남으면 완료 gate 실패다.
- UI/visual 작업은 Browser Use `iab` 실기 QA를 먼저 시도한다. Browser Use는 별도 `browser` namespace tool이 아니라 Node REPL `js`에서 `scripts/browser-client.mjs`를 absolute import해 bootstrap하는 방식이므로, `browser-use` tool namespace가 안 보인다는 이유만으로 fallback하지 않는다. Node REPL `js` tool이 처음 보이지 않으면 fallback 전에 `tool_search`로 노출을 재확인하고, `node_repl js`, `mcp__node_repl__js`, `js`, `node_repl js JavaScript execution`을 순서대로 찾는다.
- 다음 issue 선택은 "safe small item"이 아니라 `docs/NORTH_STAR.md` 경쟁작 기준 Production Bar와 `docs/IDLE_CORE_CREATIVE_GUIDE.md` vertical slice workflow를 우선한다. safety는 stop/approval gate이고, 제품 우선순위 기준이 아니다.

## Ralph runner boundary

`$seed-ops`는 `$ralph`의 완료/검증 철학을 사용하지만, Codex App prompt-side `$ralph` activation만으로 실제 장시간 runner가 시작됐다고 보지 않는다.

- prompt-side `$ralph` activation은 `.omx/state/sessions/<id>/ralph-state.json`을 seed할 수 있다. 이 상태가 `active:true`, `current_phase:"starting"`, `iteration:0`이고 runner metadata가 없으면 `prompt-side-only`다.
- 4h/6h/overnight 같은 장시간 운영은 detached `omx ralph`/`omx exec` runner artifact, heartbeat source, watchdog source가 있어야만 live long runner로 인정한다.
- foreground Codex App 작업은 직접 tool loop와 operator heartbeat로 진행한다. detached runner가 없으면 "Ralph long runner가 돌고 있다"고 보고하지 않는다.
- lifecycle 판단은 assistant message 문구가 아니라 structured state, heartbeat, watchdog, runner artifact를 기준으로 한다.
- PR/CI wait continuation은 heartbeat phase와 watchdog source로 표현한다. final summary, 완료 문구, 게시 확인 문구는 continuation evidence가 아니다.

## No post-merge closeout

- all merge-blocking evidence must be in the original PR before merge/close.
- post-merge main CI is observation-only: merge 후 main CI는 `gh run watch` 같은 외부 관찰로 확인하고, repo에 evidence를 backfill하기 위한 main-targeted closeout commit을 만들지 않는다.
- do not create a post-merge closeout PR for the issue that was just merged. 필요한 새 수정은 다음 plan-first issue로 분리한다.

## No-final continuation gate

- `$seed-ops`에서 assistant `final` 응답은 세션을 닫는 terminal action이다. `final response is terminal`을 기본 운영 가정으로 둔다.
- stop rule이 없고 non-destructive 다음 issue 후보가 있으면 `final` 응답을 보내지 않는다. 완료 요약은 commentary checkpoint로만 남기고 즉시 다음 issue를 생성/선택한다.
- 실제 continuation은 `next issue plan artifact exists` 상태여야 인정한다. 즉, 다음 `items/<id>.md` 또는 동등 plan artifact에 `## Plan`, 수용 기준, 검증 명령, 리스크가 있어야 한다.
- `left the next queue candidate is not continuation`: 다음 후보를 roadmap/control room/final summary에 적어둔 것은 continuation이 아니다. 다음 issue plan artifact가 없으면 아직 멈출 수 없다.
- `final` 응답이 허용되는 경우는 Stop rules 중 하나가 활성화되고, final heartbeat/watchdog/daily report 또는 blocker report가 그 stop rule을 명시한 때뿐이다.

## PR publication boundary

Routine GitHub issue/PR/comment publication is a Studio Harness v3 runner responsibility in this repository. `gh issue create/edit/comment`, `gh pr create/edit/comment/ready/merge`, branch push, check inspection, and merge are normal checkpoints when credentials/tools are available. Do not self-impose an action-time confirmation wait for these routine GitHub operations, and never send `final` to ask whether to publish them.

- This is not a terminal stop: PR/issue/comment publication is not a `final response is terminal` exception.
- assistant final publication ask is a regression: final로 GitHub 게시 확인을 묻지 않는다. Commentary confirmation wording is also a regression for routine GitHub publication when the tool did not actually block.
- PublicationBoundary는 credential, tool/runtime block, destructive/external-production/payment/customer-data boundary가 실제로 막을 때만 기록한다. 단순 GitHub issue/PR/comment 게시 자체는 boundary가 아니다.
- If a real tool/runtime blocker occurs, write heartbeat before any blocker report and leave a same-turn local continuation action in heartbeat/control room/report/checker/next plan. The heartbeat should distinguish `confirmation.channel: preapproved` routine GitHub publication from actual blocked publication.
- 같은 final publication ask가 반복되면 open a harness-defect fix instead of stopping: 외부 게시 재시도보다 먼저 docs/checker hardening item을 만들고 검증한다.
- PR/issue creation is normal v3 operator work: 이 프로젝트에서 issue/PR 생성은 운영 루프의 정상 단계이며 anti-pattern이 아니다.
- Publication gate de-duplication: `publication_gate.dedupe_key`는 target, branch, commit, body_file, pending_command 조합으로 안정적으로 남긴다. 같은 dedupe key에서 이미 `repeat_policy: do_not_repeat_final_ask`가 기록되었으면 같은 PR/issue 게시 확인을 다시 묻거나 같은 CI/검증 prep loop를 반복하지 않는다.
- `fresh evidence 재수집`, `main CI 반복`, PR body 재생성만 하며 GitHub 게시를 미루는 것은 routine publication harness failure다.
- Routine GitHub publication의 continuation action은 `execute GitHub publication`, `watch checks`, `merge gate`처럼 다음 agent action이어야 한다. `await action-time confirmation without repeated ask`는 routine GitHub publication에서 harness failure다.
- 로컬로 계속할 안전한 작업이 전혀 없고 credential/tool/runtime blocker만 남은 경우에만 blocker report를 보낼 수 있다. 이 경우에도 final은 vague ask가 아니라 실제 stop rule과 blocker를 명시해야 한다.
## Before implementation

1. `docs/README.md`, `docs/ROADMAP.md`, `docs/PROJECT_COMMANDS.md`, `docs/NORTH_STAR.md`를 확인한다.
2. 새 게임 issue를 고르기 전에 `## Studio Campaign Gate`를 적용한다. 현재 active campaign은 `P0.5 Idle Core + Creative Rescue`이며, campaign source of truth 없이 직전 issue 옆의 작은 작업으로 내려가지 않는다.
3. 게임 기능/UI/HUD/playfield/asset/QA issue는 `game-studio:game-studio`로 먼저 분류하고 specialist route를 고정한다.
4. UI/HUD/layout은 `game-studio:game-ui-frontend`, browser-game QA는 `game-studio:game-playtest`, Phaser runtime은 `game-studio:phaser-2d-game`, simulation/render/UI boundary는 `game-studio:web-game-foundations`, 2D sprite/FX는 `game-studio:sprite-pipeline` 기준을 적용한다.
5. 새 issue/work item은 구현 전에 `items/<id>.md` 또는 동등 문서에 `## Plan`, `## Game Studio route`, `## Game Studio Department Signoff`, `## Subagent/Team Routing`을 만든다.
6. stop rule이 없는 한 완료 후 다음 production vertical slice 후보를 plan-first로 선택한다.
7. 다음 issue로 넘어가기 전 닫힌 issue/PR metadata를 확인해 acceptance checkbox, 작업 checklist, Browser Use/visual evidence, main CI 링크가 비어 있지 않은지 검증한다.

## Studio Campaign Gate

`$seed-ops`의 게임 작업 단위는 개별 issue가 아니라 campaign이다. issue는 campaign의 하위 산출물이다. 다음 implementation issue를 선택하기 전 active campaign source of truth를 확인하고, campaign completion 기준에서 가장 큰 production gap을 고른다.

현재 active campaign: `P0.5 Idle Core + Creative Rescue`

이 campaign의 완료 기준은 “기능 목록 완료”가 아니라 첫 5분 idle vertical slice가 production 게임 장면으로 읽히는 것이다.

- 첫 5분 loop가 심기 -> 성장 가속 -> 수확/발견 -> 자동 생산 -> 보상 사용 -> 다음 목표로 이어진다.
- 정원 화면에서 생산 주체, 생산량, 주문/납품, 다음 보상, 오프라인 복귀 hook이 즉시 읽힌다.
- 핵심 seed/creature/FX/order/facility visual surface는 accepted manifest raster asset이고 SVG/vector/code-native accepted game graphics가 없다.
- asset/FX work는 gpt-image-2 default, Codex native fallback, style/provenance/animation evidence를 남긴다.
- Browser Use `iab` 또는 현재 세션 blocker와 visual regression evidence가 visible gameplay PR마다 남는다.
- 첫 5분 confusion/support risk가 닫혔거나 follow-up으로 남는다.

다음 issue plan artifact는 아래를 포함해야 한다.

1. campaign source of truth
2. reference teardown
3. creative brief
4. Game Studio Department Signoff
5. candidate issue list와 선택/거절 사유
6. Strategic Jump Check
7. Title Contract
8. Subagent/Team Routing decision
9. QA/playtest plan

`left the next queue candidate is not continuation`: ROADMAP나 control room에 다음 후보를 적는 것은 continuation이 아니다. 이 gate가 들어간 plan artifact가 있어야 계속 진행 중으로 인정한다.

## Strategic Jump Check

다음 issue 선택은 직전 issue의 옆 칸을 자동으로 고르는 것이 아니다. 새 게임 issue plan은 최소 3개 후보를 비교해야 하며, 그중 하나는 **큰 방향 점프 후보**여야 한다. 큰 방향 점프 후보는 아래 중 하나 이상을 실제 화면/플레이에 크게 바꾸는 후보를 뜻한다.

- 전체 art direction 또는 accepted raster asset family 개선
- 첫 화면 UI/UX 대대적 재배치
- core gameplay verb 추가 또는 큰 단순화
- production/readability를 막는 visual QA 하네스 결함 제거
- 첫 5분 fun rubric의 high-severity confusion 제거

선택한 후보가 작은 연결 기능이면, 왜 큰 방향 점프 후보보다 먼저 해야 하는지 `Strategic Jump Check`에 evidence로 설명해야 한다. 설명이 “직전 issue에서 이어진다”, “작다”, “안전하다”, “CI가 빠르다”뿐이면 선택 실패다.

## Title Contract

Issue/PR 제목은 운영사 evidence surface다. 새 게임 issue/PR 제목은 한국어를 기본으로 하고, `screen moment + player verb + production/progression role` 중 최소 2개를 담아야 한다. `bridge`, `payoff`, `v0`, `closeout`, `완료 증거`만으로 제목을 만들지 않는다.

- Good: `달방울 누누가 달빛 보호 주문을 납품하게 만들기`
- Good: `정원 첫 화면을 생산 엔진 중심으로 재배치`
- Bad: `Lunar guardian order bridge v0`
- Bad: `Issue 254 closeout`

PR 제목은 연결 issue 제목의 의도를 유지해야 한다. issue와 PR이 서로 다른 언어/스코프/증거 단계처럼 보이면 PR body에 `Title Contract` 보정 사유를 적고, 가능하면 PR 제목을 고친다.

## Game Studio Department Signoff

기존 ClawSweeper식 `Intake / Review / Apply / Verify / Audit`는 실행 stage다. 여기에 게임사 부서 ownership axis를 겹쳐서 쓴다. 각 부서는 roleplay가 아니라 산출물과 통과 조건을 소유한다.

| 부서 | 책임 | Plan에 남길 산출물 |
| --- | --- | --- |
| 기획팀 | player verb, core loop, reward timing | player value, production/progression role, first 5 minutes moment |
| 리서치팀 | 경쟁작 production gap, 외부/내부 레퍼런스 | reference teardown, 비교 기준, 거절한 대안 |
| 아트팀 | visual target, style consistency, asset/FX plan | art direction, gpt-image-2 default/fallback, manifest/animation plan |
| 개발팀 | runtime architecture, save/economy boundaries | implementation tranche, touched files, rollback boundary |
| 검수팀 | Browser Use, visual QA, regression | playtest evidence, screenshot/report/check list |
| 마케팅팀 | mock-only player-facing promise | devlog/release-note angle, no real channel action |
| 고객지원팀 | 첫 5분 혼란과 support risk | confusion/support risk, player-facing FAQ note |

부서 간 관점이 충돌하면 `role-debate note`를 plan에 남긴다. 예: 아트팀이 신규 raster asset을 요구하지만 개발팀이 scope를 줄이려는 경우, 최종 선택과 rejected alternative를 기록한다.

## Subagent/Team Routing

`$seed-ops`는 혼자 모든 역할을 순차 처리하는 것을 기본값으로 삼지 않는다. 아래 조건이면 Codex native subagents 또는 team mode를 사용한다.

- 리서치/로컬 감사/QA가 구현과 독립적으로 병렬 진행 가능하다.
- 아트 계획과 runtime 구현의 write scope가 분리된다.
- 검수팀이 구현 후가 아니라 구현 중 회귀 기준을 준비할 수 있다.
- campaign pass처럼 여러 역할의 관점 누락 위험이 높은 작업이다.

사용하지 않는 경우도 plan에 이유를 적는다. 예: 단일 문서 gate 수정처럼 병렬화 비용이 더 크고 write scope가 거의 같은 작업.

## Issue selection gate

다음 게임 issue 후보는 아래 5개 축 중 최소 3개를 명시해야 한다.

1. `player verb`: 플레이어가 새로 하거나 더 명확히 이해하는 행동.
2. `production/progression role`: 생산 엔진, 주문/납품, 업그레이드, 오프라인 복귀, 연구/원정, 수집 progression 중 연결되는 위치.
3. `screen moment`: 첫 5분 또는 복귀 후 30초 안에서 보이는 실제 화면 순간.
4. `asset/FX`: 필요한 생명체/주문/자원/피드백 asset, FX, sprite state, motion, HUD/playfield 시각 변화. 기존 asset 재사용만으로는 통과하지 않는다.
5. `playtest evidence`: Browser Use/visual QA/수치 검증으로 확인할 사용자 관찰 포인트.

`asset/FX` 축을 쓰는 후보는 `playfield state`, `HUD affordance`, `sprite/FX`, `order crate visual state`, `reward motion` 중 최소 하나의 concrete visual/game-feel payoff와 경쟁작 production gap을 적어야 한다. 단순 주문 추가, 색, 여백, 문구, copy tweak, test-only, 문서-only 작업은 위 visual payoff를 동반해 vertical slice blocker를 제거하거나 명확한 slice 일부일 때만 고른다. `safe`, `local`, `작다`는 선택 이유가 될 수 없고, 오직 승인/파괴/외부 권한 gate를 통과했다는 조건으로만 사용한다.

신규 게임 그래픽 asset의 기본 생성 경로는 OpenAI Images API `gpt-image-2`다. gpt-image-2/API 생성은 `OPENAI_API_KEY`와 `SEED_ASSET_IMAGE_MODEL`을 사용하며, 키가 없으면 생성 단계는 hard-block으로 기록한다. accepted manifest game asset으로 SVG/vector/code-native 그림을 만들거나 등록하지 않는다. `asset/FX` 축을 선택한 issue는 `gpt-game-asset-plan -> gpt-game-asset-prompt -> gpt-game-asset-generate -> gpt-game-asset-review` 또는 gpt-image-2 API provenance 중 하나를 plan/evidence에 남기고, `npm run check:asset-provenance`와 `npm run check:asset-style`을 통과해야 한다.

Asset/FX work는 gastory에서 가져온 bundle 기준도 따른다. 즉 project style state, prompt/model sidecar, reference image consistency, animation camera/composition lock, frame/GIF/spritesheet extraction, manifest QA, small-size visual review가 plan/evidence에 있어야 한다.

gpt-image-2 API가 credit/quota/rate limit/organization verification/model access로 막히면 기존처럼 Codex native image generation fallback을 사용한다. fallback도 최종 산출물은 raster PNG workspace file이어야 하며, SVG/vector/code-native 그림은 여전히 금지다. fallback 발생 시 `assets/source/gpt_image_asset_provenance.json`에 blocker와 fallback_required를 남긴다.

FX/애니메이션이 payoff인 issue는 static icon 하나로 통과하지 않는다. `sprite/FX` 후보는 sprite sheet 또는 FX strip 계획, frame count, frame size, intended frame rate, manifest `animation.binding`, Browser Use/playtest 관찰 지점을 함께 적어야 한다.

## Product-quality gates

- UI/visual 작업은 `docs/GAME_UI_UX_RESEARCH_20260428.md`, `docs/IDLE_CORE_CREATIVE_GUIDE.md`, `docs/DESIGN_SYSTEM.md`, Game Studio route를 acceptance criteria에 연결한다.
- `npm run check:visual`은 반복 회귀 gate이지 Browser Use 실기 QA의 대체재가 아니다. Browser Use evidence 또는 현재 세션 blocker 없이 Playwright 결과만으로 UI/visual 작업을 완료 처리하지 않는다.
- Browser Use 현재 세션 blocker로 인정하려면 `browser-use:browser` skill 전체 읽기, Node REPL `js` discovery, `scripts/browser-client.mjs` 존재 확인, `setupAtlasRuntime({ backend: "iab" })` bootstrap 시도 중 어디서 실패했는지를 evidence에 남겨야 한다.
- 과거 Browser Use blocker report는 현재 세션의 fallback 근거가 아니다. fallback을 쓰려면 현재 세션에서 Browser Use를 다시 시도하고 blocker를 새로 기록한다.
- “viewport 안에 있음”, “겹치지 않음”, “DOM text visible”만으로 UI 작업을 통과시키지 않는다.
- 사용자 screenshot으로 제보된 visual bug는 그 screenshot의 URL, viewport, action sequence를 재현한 뒤 before/after evidence와 자동 회귀 gate를 같은 PR에 추가한다.
- 모바일 panel/card QA는 `scrollHeight/clientHeight`, body scroll, bottom-tab overlap, visible child overflow를 함께 확인한다. DOM text가 있어도 `overflow: hidden`으로 중요한 내용이 가려지면 실패다.
- 정원 첫 화면은 game-playtest 관점에서 첫 actionable screen, player verb, playfield obstruction, HUD weight를 확인한다.
- 디자인/북극성 gate가 실패하면 CI가 green이어도 PR을 완료로 부르지 않는다.

## Stop rules

멈추는 경우는 다음뿐이다.

- 사용자가 stop/cancel/abort를 명시한다.
- 시간 상한이 도달했고 final heartbeat/watchdog/daily report가 남았다.
- 결제, 로그인, 광고, 외부 배포, 고객 데이터, 실채널 GTM, credential, destructive boundary가 필요하다.
- 치명적 blocker가 있고 복구 경로가 없다.
- 사용자의 제품 결정이 필요한 materially branching 선택지가 있다.
