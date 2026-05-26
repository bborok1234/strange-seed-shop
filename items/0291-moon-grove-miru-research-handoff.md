# 새벽이끼 미루 research handoff

## 상태

- Status: implemented-local-verification
- Game Studio route: `game-studio:game-studio -> game-studio:phaser-2d-game -> game-studio:game-ui-frontend -> game-studio:game-playtest`
- GitHub issue: #550
- PR: pending
- Branch: `codex/0291-moon-grove-miru-research-handoff`
- 연결: Issue #548, PR #549, main CI `26429733838`

## 배경

#548/#549는 `월정 숲 새벽이끼` 전용 portrait, idle/work actor strip, discovery bloom FX를 accepted manifest와 Phaser runtime에 연결했다. 그러나 수확 이후 `새벽이끼 미루`는 화면에 남아도 아직 별도 research/route 역할을 수행하지 않는다.

경쟁작 production gap은 Idle Miner/Cell to Singularity식 idle loop에서 새 유닛이 단순 보상 이미지가 아니라 다음 node unlock의 원인으로 읽혀야 한다는 점이다. 이번 slice는 새벽이끼 미루를 연구 선반에 배치해 `온실 숲길 단서`를 남기고, 다음 온실 숲길/연구 preview를 HUD와 playfield state로 보여준다.

## Creative brief

- Player verb: `미루 연구 맡기기`
- Core loop layer: Layer 5 `research/expedition meta`
- Production/progression role: rare harvest 보상이 researcher actor 역할과 다음 숲길 clue preview로 이어진다.
- Screen moment: 월정 숲 수확 후 연구 선반을 선택하면 미루가 연구 선반으로 이동하고 `온실 숲길 단서` surface가 열린다.
- Resource/bottleneck affected: research depth / expedition reach preview
- Required actor/prop/FX: accepted `actor_moon_grove_miru_work_strip_v1`, `fx_moon_grove_discovery_bloom_strip_v1`, research shelf prop state, HUD clue surface
- First 10m impact: 첫 rare discovery 이후 "이 아이가 정원을 실제로 움직인다"는 역할 payoff를 만든다.
- Offline/comeback impact: 후속 복귀/원정 route 후보가 연구 선반에 남아 다음 세션 목표가 된다.
- Competition gap: Cell to Singularity처럼 발견 후 다음 node가 즉시 보여야 하고, Idle Miner처럼 새 worker/manager가 생산 구조에 영향을 줘야 한다.
- Rejected alternative: 발견 화면만 유지. 이유: named creature가 actor 역할 없이 남으면 collection reward가 다음 progression으로 이어지지 않는다.

## Plan

1. GitHub issue를 게시하고 issue 번호를 WorkUnit/roadmap/heartbeat에 반영한다.
2. `GardenState`에 moon grove research handoff 상태를 추가한다.
3. `ActorRole`/task가 미루의 researcher handoff를 표현하도록 좁게 확장한다.
4. 월정 숲 발견 후 연구 선반에서 `미루 연구 맡기기` action을 제공한다.
5. action 수행 시 미루 actor를 연구 선반에 anchor하고 `온실 숲길 단서` objective/receipt/HUD surface를 남긴다.
6. Phaser playfield에 research shelf clue badge 또는 bloom marker를 표시하고 telemetry를 노출한다.
7. `scripts/check-phaser-foundation.mjs`에 moon grove research handoff path와 screenshot assertion을 추가한다.
8. Browser Use 우선 QA를 시도하고, tool blocker가 있으면 기록한 뒤 Playwright screenshot evidence를 사용한다.
9. local gates, PR checks, merge, main CI를 확인한다.

## 수용 기준

- 월정 숲 수확 후 연구 선반에 `미루 연구 맡기기` action이 표시된다.
- action 후 `moonGroveResearchHandoffRecorded=true`, `moonGroveResearchNodeId=research_moon_grove_path`, `moonGroveForestPathPreviewVisible=true` telemetry가 검증된다.
- `actor_moon_grove_miru`는 researcher 역할/연구 선반 target으로 업데이트되고 work strip으로 보인다.
- Playfield 연구 선반에 온실 숲길 단서 badge 또는 bloom marker가 표시된다.
- HUD/action rail이 `온실 숲길 단서`와 다음 route preview를 표시한다.
- Visual evidence가 `reports/visual/issue-0550-moon-grove-miru-research-handoff/` 아래 남는다.
- `npm run check:phaser`, `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:ci`, `git diff --check`가 통과한다.

## Department Scorecard

| 부서 | 판정 | 근거 |
| --- | --- | --- |
| 기획팀 | approve | player verb가 `수확`에서 `미루 연구 맡기기`로 이어져 rare creature 역할을 만든다. |
| 리서치팀 | approve | 경쟁작식 새 worker/node unlock payoff를 research clue preview로 축소 구현한다. |
| 아트팀 | revise | 새 generated asset은 만들지 않고 accepted 미루 work strip과 discovery bloom을 재사용한다. 대신 playfield state/HUD affordance로 concrete payoff를 보강해야 한다. |
| 개발팀 | approve | Phaser local state/action/render/checker 범위이며 save schema migration이나 외부 API를 건드리지 않는다. |
| 검수팀 | approve | Browser Use 우선, unavailable 시 blocker + Playwright screenshot/telemetry로 action 전후를 검증한다. |
| 마케팅팀 | approve | mock-only 내부 gameplay promise이며 외부 채널/실결제/광고 없음. |
| 고객지원팀 | approve | 플레이어가 새 생명체의 역할과 다음 목표를 연구 선반에서 이해할 수 있다. |

## Role Debate

아트팀만 revise다. 필수 debate는 발생하지 않는다. 단, 기존 asset 재사용만으로 끝나지 않도록 playfield clue badge, HUD route preview, telemetry, screenshot evidence를 acceptance에 포함한다.

## Self-evaluation loop

- Claim: `새벽이끼 미루`는 발견 보상에서 researcher handoff와 다음 숲길 단서 preview로 이어진다.
- Smallest verifier: `npm run check:phaser`
- Rubric: action availability, state telemetry, actor target/role, research shelf marker, HUD surface, screenshot evidence.
- Artifact path: `apps/seed-garden-phaser/src/gameState.ts`, `apps/seed-garden-phaser/src/main.ts`, `scripts/check-phaser-foundation.mjs`, `reports/visual/issue-0550-moon-grove-miru-research-handoff/`
- Iteration log: checker or visual failure occurs, patch runtime/checker and rerun.
- Stop condition: PR checks, merge, main CI green or written blocker report.

## 구현 결과

- `GardenState`에 `moonGroveResearchHandoffAvailable`, `moonGroveResearchHandoffRecorded`, `moonGroveResearchNodeId`, `moonGroveForestPathPreviewVisible`, `moonGroveForestPathPreviewId`를 추가했다.
- 월정 숲 수확 후 `actor_moon_grove_miru`가 `researcher` 역할과 `research_clue` task를 갖도록 전환했다.
- 연구 선반 선택 시 `미루 연구 맡기기` action을 제공하고, handoff 후 `research_moon_grove_path`와 `route_moon_grove_greenhouse_path` preview를 남긴다.
- 연구 선반에 `숲길 단서` chip과 discovery bloom marker를 표시하고 HUD action rail에 `새벽이끼 미루 연구` surface를 추가했다.
- `scripts/check-phaser-foundation.mjs`에 handoff ready/action/final telemetry와 393px screenshot evidence를 추가했다.

## 검증 결과

- Pass: `npm run build:phaser`
- Pass: `npm run check:phaser`
- Pass: `npm run check:asset-provenance`
- Pass: `npm run check:asset-style`
- Pass: `git diff --check`
- Pass: `npm run check:ci`
- Visual evidence:
  - `reports/visual/issue-0550-moon-grove-miru-research-handoff/phaser-check-moon-grove-miru-research-ready-393.png`
  - `reports/visual/issue-0550-moon-grove-miru-research-handoff/phaser-check-moon-grove-miru-research-handoff-393.png`
- Browser Use blocker: `reports/visual/issue-0550-moon-grove-miru-research-handoff/browser-use-blocker-20260526.md`
- Remaining gates: PR checks, merge, main CI.

## Subagent/Team Routing

- Solo execute. 변경 범위가 Phaser state/action/render/checker에 강하게 묶여 있어 subagent 병렬화보다 단일 소유자가 빠르고 안전하다.

## 검증 명령

- `npm run check:phaser`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:ci`
- `git diff --check`

## 리스크

- 기존 discovery bloom FX 재사용이 연구 단서 FX로 약하게 보일 수 있다. 이번 slice는 전용 asset 생성이 아니라 actor role handoff 검증이 목표이며, 약하면 후속 `moon_grove_research_note_fx` plan-prompt-generate-review로 분리한다.
- research shelf HUD가 이미 많은 surface를 갖고 있어 action rail 과밀 위험이 있다. 393px screenshot에서 bottom-tab overlap과 body scroll을 확인한다.
