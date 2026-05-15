# 월정 숲 source acquisition bridge

## 상태

- Status: planned
- Game Studio route: `game-studio:game-studio -> game-studio:phaser-2d-game -> game-studio:game-ui-frontend -> game-studio:game-playtest`
- GitHub issue: #536
- PR: TBD
- Branch: `codex/v1-moon-grove-source-acquisition-bridge`
- 연결: Issue #534, PR #535, main CI `25901742983`

## 배경

#534/#535는 `clue_moon_grove_001` reward promise를 accepted `seed_moon_grove_001_icon`과 `fx_moon_grove_source_reward_strip_v1`로 runtime에 연결했다. 하지만 현재 playable은 월정 문 첫 원정 보상 이후에도 실제 `seed_moon_grove_001` source 획득 verb가 없어서, 다음 수집 목표가 그림 promise에서 멈춘다.

`docs/GAME_BIBLE.md`와 `docs/GAME_PRODUCTION_SPEC.md`의 v1 수집 루프는 expedition/research source가 획득 가능한 seed source로 전환되고, 그 다음 planting/harvest loop로 이어지는 흐름을 요구한다. 이번 slice는 planting까지 욕심내지 않고 `clue_moon_grove_001`을 `seed_moon_grove_001 source 획득 가능` 상태로 닫는다.

## Creative brief

- Player verb: `월정 숲 source 확인`
- Production/progression role: 월정 문 보상이 다음 seed source inventory로 전환된다.
- Screen moment: `월정 문 귀환 상자 열기` 후 `월정 숲 source 확인`을 누르면 source icon/FX와 함께 `seed_moon_grove_001 source 획득` 상태가 남는다.
- Asset/FX decision: #532/#533/#535 accepted `seed_moon_grove_001_icon`과 `fx_moon_grove_source_reward_strip_v1`을 acquisition reward motion, HUD source row, playfield marker에 binding한다.
- Competition gap: 장기 expedition 보상이 다음 target 그림으로만 남으면 idle collection의 "받았다 -> 어디에 쓰지?" 연결이 끊긴다. Egg, Inc./Cell to Singularity식 장기 목표는 claim 직후 다음 resource/source inventory가 명확해야 한다.
- Rejected alternative: #535 상태 그대로 planting WorkUnit으로 바로 건너뛰기. 이유: source 획득 telemetry와 플레이어 verb 없이 planting action을 열면 reward claim과 planting 사이의 원인 관계가 약해진다.

## Plan

1. `GardenState`에 월정 숲 source acquisition 상태를 추가한다: source preview visible, source acquired, source seed available.
2. `getAvailableActions`에서 `moonFenceNextClueVisible && !moonGroveSourceAcquired` 상태일 때 원정 문 action rail에 `월정 숲 source 확인` player verb를 제공한다.
3. reducer `claimMoonGroveSource`를 추가해 source seed availability, objective, receipt, reward motion state를 갱신한다.
4. Phaser render path는 원정 문 주변에 `seed_moon_grove_001_icon` acquired marker와 `fx_moon_grove_source_reward_strip_v1` acquisition motion을 남긴다.
5. telemetry를 추가한다:
   - `__seedGardenMoonGroveSourceAcquired`
   - `__seedGardenMoonGroveSourceSeedAvailable`
   - `__seedGardenMoonGroveSourceSeedId`
6. `scripts/check-phaser-foundation.mjs`에 source 확인 action, acquired state, telemetry, screenshot assertion을 추가한다.
7. Browser Use `iab`를 우선 시도하고, unavailable이면 current-session blocker와 Playwright fallback screenshot evidence를 남긴다.

## 수용 기준

- `월정 문 귀환 상자 열기` 후 action rail에 `월정 숲 source 확인`이 보인다.
- action 후 objective/receipt에 `seed_moon_grove_001 source 획득` 또는 동등한 한국어 상태가 남는다.
- `moonGroveSourceAcquired=true`, `moonGroveSourceSeedAvailable=true`, `moonGroveSourceSeedId=seed_moon_grove_001` telemetry가 검증된다.
- source 획득 순간 `seed_moon_grove_001_icon`과 `fx_moon_grove_source_reward_strip_v1`가 acquisition reward motion/playfield marker로 보인다.
- runtime image generation/API/cache 호출 없음.
- `npm run check:phaser`, `npm run check:content`, `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:asset-alpha`, `npm run check:ci`, `git diff --check`가 통과한다.

## Department Scorecard

| 부서 | 판정 | 근거 |
| --- | --- | --- |
| 기획팀 | approve | 월정 문 보상을 다음 seed source inventory로 닫아 planting loop의 원인 관계를 만든다. |
| 리서치팀 | approve | 장기 expedition reward가 그림 promise에서 멈추는 production gap을 실제 source 획득 verb로 해소한다. |
| 아트팀 | approve | 새 asset을 만들지 않지만 accepted source icon/FX를 acquisition screen moment와 playfield marker에 새 binding한다. |
| 개발팀 | approve | Phaser local state/action/render/checker 범위이며 planting/harvest는 후속 WorkUnit으로 분리한다. |
| 검수팀 | approve | Browser Use 우선, unavailable 시 blocker + Playwright screenshot/telemetry로 검증한다. |
| 마케팅팀 | approve | 내부 playable progression이며 외부 채널/실결제/광고 없음. |
| 고객지원팀 | approve | 플레이어가 `clue_moon_grove_001`의 의미를 source 획득 상태로 이해한다. |

## Role Debate

필수 debate는 발생하지 않았다. 모든 부서가 approve다. 기획팀은 acquisition과 planting을 한 PR에 묶으면 scope가 커진다고 보고 acquisition bridge를 먼저 닫는 것을 지지한다. 아트팀은 오른쪽 월정 문 badge 밀도가 높아지면 후속 declutter WorkUnit을 열도록 권고한다.

## Self-evaluation loop

- Claim: `clue_moon_grove_001`은 source promise에서 멈추지 않고 `seed_moon_grove_001 source 획득 가능` 상태로 전환된다.
- Smallest verifier: `npm run check:phaser`
- Rubric: player verb present, state progression, source icon/FX visible, telemetry, no body scroll, no runtime generation.
- Artifact path: `reports/visual/issue-0536-moon-grove-source-acquisition-bridge/visual-report-20260515.md`
- Iteration log: checker failure나 screenshot overlap이 있으면 같은 WorkUnit에서 수정 후 재검증한다.
- Stop condition: local gates, PR checks, merge, main CI가 green이거나 Browser Use/tool outage blocker가 문서화됨.

## Subagent/Team Routing

- Solo execute. 변경 범위가 Phaser state/action/render/checker로 좁고, 현재까지 Browser Use callable이 노출되지 않아 병렬 QA agent의 효용이 낮다.

## 검증 명령

- `npm run check:phaser`
- `npm run check:content`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:asset-alpha`
- `npm run check:ci`
- `git diff --check`

## 리스크

- `seed_moon_grove_001` planting/harvest까지 포함하면 scope가 커진다. 이번 slice는 source acquisition까지만 검증한다.
- 오른쪽 월정 문 주변 badge 밀도가 이미 높다. source acquired marker가 읽히지 않으면 후속 visual declutter 또는 marker consolidation issue로 분리한다.
