# 월정 문 준비 납품 material payoff

## 상태

- Status: plan
- Game Studio route: `game-studio:game-studio -> game-studio:phaser-2d-game -> game-studio:game-ui-frontend -> game-studio:game-playtest`
- GitHub issue: #522
- PR: TBD
- Branch: `codex/v1-moon-fence-prep-delivery-payoff`
- 연결: Issue #520, PR #521, main CI `25647585415`

## 배경

#520은 `월정 문 단서 보기 -> 개방 조건 보기`까지 닫아 `오로 explorer`, `달빛 단서 1/2`, `재료 2/3` 요구 조건을 화면과 telemetry에 남겼다. 하지만 그 다음 player verb가 없어서 플레이어는 부족한 `재료 1`을 어떻게 채우는지 알 수 없다.

`docs/GAME_PRODUCTION_SPEC.md`의 v1 order chain은 D7의 `order_lunar_clue_01`과 `upgrade_expedition_01`이 `재료 3`, `단서 2`를 통해 first expedition route로 이어져야 한다고 본다. 경쟁 idle/collection game은 locked route 요구 조건을 보여준 뒤, 부족한 재료를 채우는 납품 crate나 preparation task를 즉시 보여준다. 현재 gap은 요구 조건 surface가 읽히지만, 정원 화면 안의 crate/work verb로 이어지지 않는 점이다.

이번 slice는 `개방 조건 보기` 이후 `월정 문 준비 납품` action을 추가해 `재료 2/3 -> 3/3`을 채우고, expedition gate 주변 order crate visual state와 HUD/objective/telemetry에 material-ready 상태를 고정한다. 실제 route unlock과 두 번째 달빛 단서 획득은 후속 slice로 분리한다.

## Creative brief

- Player verb: `월정 문 준비 납품`
- Production/progression role: locked route requirement 중 material shortfall을 실제 납품 loop로 채운다.
- Screen moment: expedition gate 옆 준비 상자가 봉인되고 `재료 3/3`이 초록 ready 상태로 바뀐다.
- Asset/FX decision: 새 accepted manifest asset 없이 existing crate/gate/night-glass visual language를 사용한다. 기존 asset 재사용만으로 끝내지 않고 player verb, order crate visual state, reward/progress text motion, telemetry, screenshot assertion을 추가한다.
- Rejected alternative: 바로 `월정 문 열기`까지 구현한다. 이유: 현재 `달빛 단서 1/2`가 남아 있어 material completion과 route unlock을 한 PR에 섞으면 acceptance와 QA가 넓어진다.

## Plan

1. `GardenState`에 `moonFencePrepDeliveryAvailable`, `moonFencePrepDeliveryCompleted`, `moonFencePrepDeliveryCrateVisible`, material-ready telemetry를 추가한다.
2. `moonFenceRequirementsInspected=true`이고 material이 2/3이면 action rail에 `월정 문 준비 납품`을 노출한다.
3. action 처리 함수는 material current를 3/3으로 올리고 objective/receipt를 `월정 문 준비 납품 완료 · 재료 3/3 · 달빛 단서 1/2`로 전환한다.
4. Phaser expedition gate 주변에 compact prep crate/chip을 표시하고, HUD requirements surface는 material ready와 remaining clue blocker를 함께 보여준다.
5. `scripts/check-phaser-foundation.mjs`는 #520 requirements action 이후 prep delivery action click, material 3/3 telemetry, screenshot evidence를 assertion한다.
6. Browser Use hands-on QA를 우선 시도한다. 현재 tool surface에서 unavailable이면 current-session blocker report + Playwright fallback evidence를 유지한다.

## 수용 기준

- `개방 조건 보기` 이후 action rail에 `월정 문 준비 납품`이 노출된다.
- action 실행 후 telemetry는 prep delivery completed/visible state와 `moonFenceCurrentMaterials=3`, `moonFenceRequiredMaterials=3`을 남긴다.
- 화면에는 `재료 3/3` ready 상태와 `달빛 단서 1/2` remaining blocker가 동시에 보인다.
- expedition gate 주변 playfield에는 월정 문 준비 crate/chip state가 보인다.
- objective 또는 receipt는 `월정 문 준비 납품 완료`를 포함한다.
- runtime image generation/API/cache 호출 없음.
- `npm run check:phaser`, `npm run check:content`, `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:ci`, `git diff --check`가 통과한다.

## Game Studio Department Signoff

- 기획팀: locked route requirement를 material delivery verb로 이어 first 5m 이후 D7 route 목표를 실제 반복 loop와 연결한다.
- 리서치팀: 경쟁 idle/collection game의 locked-region requirement -> prep task -> ready state 패턴을 따른다.
- 아트팀: dedicated moon-fence crate sprite가 이상적이지만 이번 slice는 existing crate/gate 위 compact state로 먼저 runtime contract를 고정한다.
- 개발팀: Phaser local state/action/render/checker 범위이며 실제 unlock/spend는 후속 route unlock slice로 제한한다.
- 검수팀: Browser Use 우선, unavailable 시 blocker + Playwright scripted click/screenshot/telemetry로 검증한다.
- 마케팅팀: 내부 playable progression만 변경하며 외부 채널/실결제/광고 없음.
- 고객지원팀: 플레이어가 `재료는 준비됨, 단서는 아직 부족`이라는 다음 행동 blocker를 이해할 수 있어야 한다.

## Department Scorecard

| 부서 | 판정 | 근거 |
| --- | --- | --- |
| 기획팀 | approve | `개방 조건 보기` 다음 player verb를 납품으로 고정해 부족 재료를 채운다. |
| 리서치팀 | approve | locked route가 요구 조건 표시에 머물지 않고 preparation task로 이어지는 경쟁작 패턴을 따른다. |
| 아트팀 | revise | dedicated crate sprite/FX 없이 compact state로 시작한다. 후속 asset WorkUnit 필요 가능성이 있다. |
| 개발팀 | approve | state/action/render/checker slice로 좁고 route unlock을 분리한다. |
| 검수팀 | approve | deterministic Phaser checker에 click path와 screenshot evidence를 추가한다. |
| 마케팅팀 | approve | mock/playable 내부 progression이며 외부 promise 없음. |
| 고객지원팀 | approve | material ready와 clue shortfall을 같은 surface에 남긴다. |

## Role Debate

아트팀만 revise다. 전용 `moon_fence_prep_crate` asset을 먼저 만들면 polish가 높지만, 현재 blocker는 requirements surface 다음 행동이 없는 점이다. 이번 slice는 order crate visual state와 telemetry를 먼저 고정하고, dedicated crate/spark FX는 material loop가 실제로 읽히는지 확인한 뒤 후속 asset/FX issue로 분리한다.

## Subagent/Team Routing

- Solo execute. 변경 범위가 #520 위의 Phaser state/action/render/checker로 좁고, 새 asset generation을 포함하지 않아 병렬 팀보다 단일 owner가 빠르다.

## Self-evaluation loop

- Claim: `개방 조건 보기` 후 `월정 문 준비 납품`을 클릭하면 material requirement가 3/3 ready로 바뀌고 clue blocker는 1/2로 남는다.
- Smallest verifier: `npm run check:phaser`
- Rubric: action visible, click succeeds, telemetry 3/3, HUD/objective text, screenshot artifact.
- Artifact path: `reports/visual/issue-0522-moon-fence-prep-delivery-payoff/`
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

- material ready state가 실제 resource spend 없이 보일 수 있다. 이번 slice는 route-prep contract를 먼저 고정하고, 경제 소비/route unlock은 별도 PR로 검증한다.
- compact crate/chip이 수동 플레이에서 작게 느껴지면 dedicated crate asset/FX WorkUnit을 열어야 한다.
