# 월정 숲 source planting loop

## 상태

- Status: planned
- Game Studio route: `game-studio:game-studio -> game-studio:phaser-2d-game -> game-studio:game-ui-frontend -> game-studio:game-playtest`
- GitHub issue: #538
- PR: TBD
- Branch: `codex/v1-moon-grove-source-planting-loop`
- 연결: Issue #536, PR #537, main CI `25902521000`

## 배경

#536/#537은 `clue_moon_grove_001` promise를 `월정 숲 source 확인` player verb와 `seed_moon_grove_001 source 획득` state로 닫았다. 하지만 현재 playable은 source 획득 이후 objective가 `planting 대기`로 멈추고, 빈 밭에서 `seed_moon_grove_001`을 실제로 심는 action은 아직 없다.

`docs/GAME_BIBLE.md`의 v1 수집 루프는 source 획득이 다음 planting/harvest loop로 이어져야 한다. 이번 slice는 harvest/reveal까지 확장하지 않고, 월정 숲 source를 빈 밭에 심어 `planted` state와 playfield source icon marker를 남기는 데 집중한다.

## Creative brief

- Player verb: `월정 숲 심기`
- Production/progression role: 월정 문 장기 보상이 다음 식물 재배 루프의 실제 시작점으로 전환된다.
- Screen moment: `월정 숲 source 확인` 후 빈 밭을 선택하면 `월정 숲 심기`가 보이고, 누르면 `seed_moon_grove_001`이 plot에 심겨 source availability가 소비된다.
- Asset/FX decision: #532/#533/#535 accepted `seed_moon_grove_001_icon`을 planted plot overlay/chip에 재사용하고, existing care/planting visual language를 유지한다. 새 raster asset은 만들지 않는다.
- Competition gap: idle collection 게임에서 rare source claim 뒤 실제 재배 시작이 없으면 장기 보상이 inventory receipt에 갇힌다. Egg, Inc./Cell to Singularity식 장기 목표는 claim 직후 다음 production entity가 화면에 놓여야 한다.
- Rejected alternative: harvest/reveal까지 한 PR에 포함. 이유: source planting의 state 소비/plot binding을 먼저 고정해야 reveal tuning을 안정적으로 분리할 수 있다.

## Plan

1. `GardenState`에 월정 숲 planting 상태를 추가한다: `moonGroveSourceSeedPlanted`, optional planted plot id.
2. 빈 unlocked plot 선택 시 `moonGroveSourceSeedAvailable && !moonGroveSourceSeedPlanted`이면 `월정 숲 심기` action을 제공한다.
3. reducer `plantMoonGroveSourceSeed`를 추가해 source availability를 소비하고 해당 plot을 `planted`, `seedId=seed_moon_grove_001`, 초기 growth로 전환한다.
4. Phaser plot render path는 `seed_moon_grove_001` planted plot 위에 accepted source icon overlay/chip을 표시한다.
5. telemetry를 추가한다:
   - `__seedGardenMoonGroveSourceSeedPlanted`
   - `__seedGardenMoonGroveSourcePlotId`
6. `scripts/check-phaser-foundation.mjs`에 acquisition 후 빈 밭 선택, `월정 숲 심기`, source availability 소비, planted plot, screenshot assertion을 추가한다.
7. Browser Use `iab`를 우선 시도하고, unavailable이면 current-session blocker와 Playwright fallback screenshot evidence를 남긴다.

## 수용 기준

- `월정 숲 source 확인` 후 빈 밭 선택 시 `월정 숲 심기` action이 보인다.
- action 후 objective/receipt에 `seed_moon_grove_001` planting 상태가 남는다.
- `moonGroveSourceSeedAvailable=false`, `moonGroveSourceSeedPlanted=true`, planted plot `seedId=seed_moon_grove_001` telemetry가 검증된다.
- planted plot에 `seed_moon_grove_001_icon` marker가 보인다.
- runtime image generation/API/cache 호출 없음.
- `npm run check:phaser`, `npm run check:content`, `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:asset-alpha`, `npm run check:ci`, `git diff --check`가 통과한다.

## Department Scorecard

| 부서 | 판정 | 근거 |
| --- | --- | --- |
| 기획팀 | approve | source acquisition이 실제 planting verb로 이어져 수집 루프의 다음 행동을 만든다. |
| 리서치팀 | approve | 장기 reward가 inventory receipt에 갇히는 production gap을 plot state 전환으로 해소한다. |
| 아트팀 | approve | 새 asset 없이 accepted source icon을 planted plot marker로 재사용한다. 후속 harvest/reveal 전 dedicated creature/FX는 별도 WorkUnit에서 결정한다. |
| 개발팀 | approve | Phaser state/action/render/checker 범위이며 harvest/reveal은 후속 slice로 분리한다. |
| 검수팀 | approve | Browser Use 우선, unavailable 시 blocker + Playwright screenshot/telemetry로 검증한다. |
| 마케팅팀 | approve | 내부 playable progression이며 외부 채널/실결제/광고 없음. |
| 고객지원팀 | approve | 플레이어가 source 획득 후 다음 행동이 빈 밭 planting임을 이해한다. |

## Role Debate

필수 debate는 발생하지 않았다. 모든 부서가 approve다. 아트팀은 월정 숲 planted marker가 기존 badge 밀도에 묻히면 후속 visual declutter 또는 plot marker consolidation issue로 분리하라고 권고한다.

## Self-evaluation loop

- Claim: `seed_moon_grove_001 source`는 획득 후 빈 밭 planting loop로 이어진다.
- Smallest verifier: `npm run check:phaser`
- Rubric: player verb present, source availability consumed, plot seed id, source icon marker, telemetry, no body scroll, no runtime generation.
- Artifact path: `reports/visual/issue-0538-moon-grove-source-planting-loop/visual-report-20260515.md`
- Iteration log: checker failure나 screenshot marker readability 문제가 있으면 같은 WorkUnit에서 수정 후 재검증한다.
- Stop condition: local gates, PR checks, merge, main CI가 green이거나 Browser Use/tool outage blocker가 문서화됨.

## Subagent/Team Routing

- Solo execute. 변경 범위가 Phaser source planting state/action/render/checker로 좁고 이전 source planting 패턴을 재사용할 수 있다.

## 검증 명령

- `npm run check:phaser`
- `npm run check:content`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:asset-alpha`
- `npm run check:ci`
- `git diff --check`

## 리스크

- harvest/reveal payoff까지 포함하면 scope가 커진다. 이번 slice는 planting까지만 검증한다.
- 월정 문 주변과 plot marker 밀도가 올라갈 수 있다. marker가 읽히지 않으면 후속 visual declutter issue로 분리한다.
