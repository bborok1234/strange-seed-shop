# 월정 문 두 번째 달빛 단서 payoff

## 상태

- Status: plan
- Game Studio route: `game-studio:game-studio -> game-studio:phaser-2d-game -> game-studio:game-ui-frontend -> game-studio:game-playtest`
- GitHub issue: #524
- PR: TBD
- Branch: `codex/v1-moon-fence-second-clue-payoff`
- 연결: Issue #522, PR #523, main CI `25648143531`

## 배경

#522는 `월정 문 준비 납품`으로 material requirement를 `재료 3/3 ready`까지 닫았다. 하지만 `달빛 단서 1/2` blocker가 남아 있어 플레이어는 실제 route unlock 전 마지막 단서를 어디서 확보해야 하는지 모른다.

`docs/GAME_PRODUCTION_SPEC.md`는 D7 order chain의 `order_lunar_clue_01`과 `upgrade_expedition_01`이 `단서 2`, `재료 3`을 통해 first expedition route로 이어져야 한다고 본다. 경쟁 idle/collection game은 final unlock 전에 마지막 missing requirement를 research/order stamp 또는 clue map glow로 보여준다. 현재 gap은 material ready 이후 clue shortfall이 텍스트 blocker로만 남는 점이다.

이번 slice는 material ready 이후 `달빛 단서 포장` action을 추가해 `달빛 단서 1/2 -> 2/2`를 채우고, research shelf/expedition gate HUD와 playfield에 clue stamp/glow state를 남긴다. 실제 `월정 문 열기` route unlock은 후속 slice로 분리한다.

## Creative brief

- Player verb: `달빛 단서 포장`
- Production/progression role: 월정 문 unlock 전 마지막 clue shortfall을 order/research stamp payoff로 닫는다.
- Screen moment: expedition gate 또는 research shelf surface가 `달빛 단서 2/2 ready`로 빛나고, material ready와 함께 unlock-ready 직전 상태가 된다.
- Asset/FX decision: 새 accepted manifest asset 없이 existing night-glass/moonburst FX와 compact stamp chip을 사용한다. 기존 asset 재사용만으로 끝내지 않고 player verb, clue-ready state, HUD affordance, playfield stamp, telemetry, screenshot assertion을 추가한다.
- Rejected alternative: 바로 `월정 문 열기`까지 구현한다. 이유: clue ready와 route unlock은 각각 player comprehension과 state transition acceptance가 달라 별도 PR로 검증한다.

## Plan

1. `GardenState`에 `moonFenceSecondClueAvailable`, `moonFenceSecondCluePackaged`, `moonFenceClueStampVisible`, `moonFenceCluesReady` telemetry를 추가한다.
2. `moonFenceMaterialsReady=true`이고 clue가 1/2이면 action rail에 `달빛 단서 포장`을 노출한다.
3. action 처리 함수는 clue current를 2/2로 올리고 objective/receipt를 `달빛 단서 포장 완료 · 단서 2/2 · 재료 3/3`으로 전환한다.
4. Phaser expedition gate 주변에 compact clue stamp/chip을 표시하고, HUD requirements surface는 clue/material ready와 next action `월정 문 열기 대기`를 보여준다.
5. `scripts/check-phaser-foundation.mjs`는 #522 prep delivery 이후 second clue action click, clue 2/2 telemetry, screenshot evidence를 assertion한다.
6. Browser Use hands-on QA를 우선 시도한다. 현재 tool surface에서 unavailable이면 current-session blocker report + Playwright fallback evidence를 유지한다.

## 수용 기준

- `월정 문 준비 납품` 이후 action rail에 `달빛 단서 포장`이 노출된다.
- action 실행 후 telemetry는 second clue packaged/stamp visible state와 `moonFenceCurrentClues=2`, `moonFenceRequiredClues=2`, `moonFenceCluesReady=true`를 남긴다.
- 화면에는 `달빛 단서 2/2 ready`와 `재료 3/3 ready`가 동시에 보인다.
- expedition gate 주변 playfield에는 월정 문 clue stamp/chip state가 보인다.
- objective 또는 receipt는 `달빛 단서 포장 완료`를 포함한다.
- runtime image generation/API/cache 호출 없음.
- `npm run check:phaser`, `npm run check:content`, `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:ci`, `git diff --check`가 통과한다.

## Game Studio Department Signoff

- 기획팀: material ready 이후 마지막 clue player verb를 고정해 route unlock 전 comprehension gap을 닫는다.
- 리서치팀: locked route final requirement를 clue stamp/glow로 보여주는 경쟁작 progression pattern을 따른다.
- 아트팀: dedicated clue stamp sprite가 이상적이지만 이번 slice는 existing FX + compact stamp로 runtime contract를 먼저 고정한다.
- 개발팀: Phaser local state/action/render/checker 범위이며 실제 route unlock은 후속 slice로 제한한다.
- 검수팀: Browser Use 우선, unavailable 시 blocker + Playwright scripted click/screenshot/telemetry로 검증한다.
- 마케팅팀: 내부 playable progression only; 외부 채널/실결제/광고 없음.
- 고객지원팀: 플레이어가 `단서와 재료가 준비됨, 다음은 월정 문 열기`를 이해할 수 있어야 한다.

## Department Scorecard

| 부서 | 판정 | 근거 |
| --- | --- | --- |
| 기획팀 | approve | last missing requirement를 `달빛 단서 포장` player verb로 닫는다. |
| 리서치팀 | approve | final requirement stamp/glow pattern으로 locked route readiness를 강화한다. |
| 아트팀 | revise | dedicated clue stamp sprite/FX 없이 compact state로 시작한다. 후속 asset WorkUnit 필요 가능성이 있다. |
| 개발팀 | approve | state/action/render/checker slice로 좁고 route unlock을 분리한다. |
| 검수팀 | approve | deterministic Phaser checker에 click path와 screenshot evidence를 추가한다. |
| 마케팅팀 | approve | mock/playable 내부 progression이며 외부 promise 없음. |
| 고객지원팀 | approve | clue/material ready 상태와 다음 unlock 대기를 같은 surface에 남긴다. |

## Role Debate

아트팀만 revise다. 전용 `moon_fence_clue_stamp` asset을 먼저 만들면 polish가 높지만, 현재 blocker는 material ready 다음 clue shortfall이 행동으로 이어지지 않는 점이다. 이번 slice는 clue-ready state와 telemetry를 먼저 고정하고, dedicated stamp/FX는 unlock-ready moment가 읽히는지 확인한 뒤 후속 asset/FX issue로 분리한다.

## Subagent/Team Routing

- Solo execute. 변경 범위가 #522 위의 Phaser state/action/render/checker로 좁고, 새 asset generation을 포함하지 않아 병렬 팀보다 단일 owner가 빠르다.

## Self-evaluation loop

- Claim: `월정 문 준비 납품` 후 `달빛 단서 포장`을 클릭하면 clue requirement가 2/2 ready로 바뀌고 material은 3/3 ready로 유지된다.
- Smallest verifier: `npm run check:phaser`
- Rubric: action visible, click succeeds, telemetry 2/2 and 3/3, HUD/objective text, screenshot artifact.
- Artifact path: `reports/visual/issue-0524-moon-fence-second-clue-payoff/`
- Iteration log: implementation 후 visual report에 기록한다.
- Stop condition: local checks + PR checks + merge/main CI green, 또는 Browser Use/tool blocker report.

## 검증 명령

- `npm run check:phaser`
- `npm run check:content`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:ci`
- `git diff --check`

## 리스크

- clue ready state가 실제 research/economy spend 없이 보일 수 있다. 이번 slice는 route-ready contract를 먼저 고정하고, 경제 소비/route unlock은 별도 PR로 검증한다.
- compact clue stamp가 수동 플레이에서 작게 느껴지면 dedicated clue stamp asset/FX WorkUnit을 열어야 한다.
