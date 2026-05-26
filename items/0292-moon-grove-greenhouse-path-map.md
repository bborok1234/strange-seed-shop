# 온실 숲길 clue map v0

## 상태

- Status: local CI verified
- Game Studio route: `game-studio:game-studio -> game-studio:phaser-2d-game -> game-studio:game-ui-frontend -> game-studio:game-playtest`
- GitHub issue: #552 https://github.com/bborok1234/strange-seed-shop/issues/552
- PR: #553 https://github.com/bborok1234/strange-seed-shop/pull/553
- Branch: `codex/0292-moon-grove-greenhouse-path-map`
- 연결: Issue #550, PR #551, main CI `26430497298`

## 배경

#550/#551은 `새벽이끼 미루`를 연구 선반 researcher actor로 고정하고 `온실 숲길 단서`를 기록했다. 하지만 지금은 단서가 HUD 텍스트와 telemetry로 남을 뿐, 플레이어가 직접 "다음 연구 지도를 펼쳐 본다"는 screen moment가 없다.

경쟁작 production gap은 Cell to Singularity식 tech tree처럼 다음 node가 시각적으로 연결되어야 한다는 점이다. 이번 slice는 `숲길 지도 펼치기` action으로 research shelf에 3-node clue map을 표시해 `research_moon_grove_path -> route_moon_grove_greenhouse_path -> 물안개 source silhouette`의 진행감을 만든다.

## Creative brief

- Player verb: `숲길 지도 펼치기`
- Core loop layer: Layer 5 `Research/expedition meta`
- Production/progression role: 연구 단서가 다음 family/zone preview로 확장된다.
- Screen moment: 미루 연구 handoff 후 연구 선반을 선택하면 지도 action이 열리고, 실행 후 연구 선반에 3-node clue map과 다음 물안개/숲길 silhouette가 남는다.
- Resource/bottleneck affected: Research depth / next family route visibility
- Required actor/prop/FX: `actor_moon_grove_miru_work_strip_v1`, `facility_research_shelf_v1`, `fx_research_clue_glimmer_strip_v1`, clue map HUD surface, path-node playfield marker
- First 10m impact: rare creature 연구 결과가 다음 collection 목표로 이어지는 것을 직접 확인한다.
- Offline/comeback impact: 다음 접속 때 research shelf에 남은 숲길 지도 상태가 장기 목표를 복기시킨다.
- Competition gap: Cell to Singularity처럼 다음 node가 텍스트 promise가 아니라 visual map으로 남아야 한다.
- Rejected alternative: `온실 숲길 단서 기록됨` 문구만 유지. 이유: 연구/원정 long meta가 텍스트 receipt로만 남으면 collection map 욕구가 약하다.

## Plan

1. #550/#551/main CI `26430497298` 완료 상태를 roadmap에 반영한다.
2. GitHub issue를 게시하고 issue 번호를 WorkUnit/roadmap/heartbeat에 반영한다.
3. `GardenState`에 moon grove clue map open/record state와 next node ids를 추가한다.
4. `moonGroveResearchHandoffRecorded` 이후 연구 선반에서 `숲길 지도 펼치기` action을 제공한다.
5. action 수행 시 `moonGroveClueMapOpened=true`, current/next/locked node telemetry, objective/receipt/HUD surface를 남긴다.
6. Phaser playfield의 연구 선반에 clue map marker 또는 node chip 3개를 표시하고, HUD는 다음 물안개/숲길 silhouette를 보여준다.
7. `scripts/check-phaser-foundation.mjs`에 handoff 이후 clue map action path와 393px screenshot assertion을 추가한다.
8. Browser Use 우선 QA를 시도하고, tool blocker가 있으면 기록한 뒤 Playwright screenshot evidence를 사용한다.
9. local gates, PR checks, merge, main CI를 확인한다.

## 수용 기준

- 미루 연구 handoff 후 연구 선반에 `숲길 지도 펼치기` action이 표시된다.
- action 후 `moonGroveClueMapOpened=true`, `moonGroveClueMapCurrentNodeId=research_moon_grove_path`, `moonGroveClueMapNextNodeId=route_moon_grove_greenhouse_path` telemetry가 검증된다.
- HUD/action rail이 `온실 숲길 지도`와 다음 `물안개 source silhouette`를 표시한다.
- Playfield 연구 선반에 clue map marker 또는 3-node chip이 표시된다.
- `actor_moon_grove_miru`는 researcher 역할로 연구 선반에 유지된다.
- Visual evidence가 `reports/visual/issue-0552-moon-grove-greenhouse-path-map/` 아래 남는다.
- `npm run check:phaser`, `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:ci`, `git diff --check`가 통과한다.

## Department Scorecard

| 부서 | 판정 | 근거 |
| --- | --- | --- |
| 기획팀 | approve | player verb가 `미루 연구 맡기기`에서 `숲길 지도 펼치기`로 이어져 research result를 직접 행동으로 만든다. |
| 리서치팀 | approve | Cell to Singularity식 next-node visibility를 Phaser research shelf에 축소 구현한다. |
| 아트팀 | revise | 전용 `moon_grove_path_map` raster/FX가 있으면 더 좋다. 이번 slice는 accepted research shelf/glimmer FX와 node chip playfield state로 먼저 닫고, 약하면 후속 asset generation issue로 분리한다. |
| 개발팀 | approve | Phaser state/action/render/checker 범위이며 save migration이나 외부 API를 건드리지 않는다. |
| 검수팀 | approve | Browser Use 우선, unavailable 시 blocker + Playwright screenshot/telemetry로 action 전후를 검증한다. |
| 마케팅팀 | approve | mock-only 내부 gameplay promise이며 외부 채널/실결제/광고 없음. |
| 고객지원팀 | approve | 플레이어가 연구 결과와 다음 숲길/물안개 목표를 연구 선반에서 이해할 수 있다. |

## Role Debate

아트팀만 revise다. 필수 debate는 발생하지 않는다. 단, 기존 asset 재사용만으로 끝나지 않도록 playfield node marker, HUD clue map, telemetry, screenshot evidence를 acceptance에 포함한다.

## Self-evaluation loop

- Claim: `온실 숲길 단서`는 연구 선반의 visual clue map과 다음 route/family silhouette로 이어진다.
- Smallest verifier: `npm run check:phaser`
- Rubric: action availability, state telemetry, actor persistence, clue map marker, HUD surface, screenshot evidence.
- Artifact path: `apps/seed-garden-phaser/src/gameState.ts`, `apps/seed-garden-phaser/src/main.ts`, `scripts/check-phaser-foundation.mjs`, `reports/visual/issue-0552-moon-grove-greenhouse-path-map/`
- Iteration log: checker or visual failure occurs, patch runtime/checker and rerun.
- Stop condition: PR checks, merge, main CI green or written blocker report.

## Subagent/Team Routing

- Solo execute. 변경 범위가 직전 #550 state/action/render/checker 후속으로 강하게 묶여 있어 subagent 병렬화보다 단일 소유자가 빠르고 안전하다.

## 검증 명령

- `npm run check:phaser` - pass
- `npm run check:asset-provenance` - pass
- `npm run check:asset-style` - pass
- `git diff --check` - pass
- `npm run check:ci` - pass

## 리스크

- 393px action rail이 이미 길어 clue map surface가 과밀해질 수 있다. bottom-tab overlap과 action surface overflow를 checker에서 확인한다.
- 기존 `fx_research_clue_glimmer_strip_v1`이 월정 숲 지도 느낌에 약하면 후속 `moon_grove_path_map_fx` plan-prompt-generate-review WorkUnit으로 분리한다.

## 구현 기록

- `GardenState`에 `moonGroveClueMapAvailable`, `moonGroveClueMapOpened`, current/next/locked node id를 추가했다.
- `미루 연구 맡기기` 이후 연구 선반에서 `숲길 지도 펼치기` action을 노출한다.
- action 후 `research_moon_grove_path -> route_moon_grove_greenhouse_path -> source_mist_greenhouse_silhouette` receipt/objective/HUD surface/telemetry를 남긴다.
- 연구 선반 playfield는 opened 상태에서 3-node chip을 표시하고, pending FX는 `moonGroveClueMap`으로 기록된다.
- HUD action button이 Phaser slot pointer와 충돌하지 않도록 HUD pointer boundary와 action button priority를 보강했다.
- plot/no-action 또는 pending planting 상태에서 누적 진행 카드가 playfield 선택을 가리지 않도록 action rail surface를 접는다.

## Visual QA evidence

- Browser Use blocker: `reports/visual/issue-0552-moon-grove-greenhouse-path-map/browser-use-blocker-20260526.md`
- Visual report: `reports/visual/issue-0552-moon-grove-greenhouse-path-map/visual-report-20260526.md`
- 핵심 screenshot: `reports/visual/issue-0552-moon-grove-greenhouse-path-map/phaser-check-moon-grove-clue-map-opened-393.png`

## Asset/provenance note

`fx_research_clue_glimmer_strip_v1.png`는 prompt/plan에는 있었지만 workspace PNG가 없어 clue map render가 중간에 끊겼다. 현재 세션에는 `OPENAI_API_KEY`가 없어 새 gpt-image-2 생성이 불가능했고, Browser/Codex native image save path도 노출되지 않았다. 임시로 accepted gpt-image-2 provenance가 있는 `fx_moon_grove_discovery_bloom_strip_v1.png`를 strict 8x96x96 derivative로 복제해 runtime texture contract를 맞췄다. 전용 clue glimmer art는 후속 asset generation/review 후보로 남긴다.
