# 월정 숲 source harvest/reveal payoff

## 상태

- Status: active
- Game Studio route: `game-studio:game-studio -> game-studio:phaser-2d-game -> game-studio:game-ui-frontend -> game-studio:game-playtest`
- GitHub issue: #540
- PR: TBD
- Branch: `codex/v1-moon-grove-harvest-reveal-payoff`
- 연결: Issue #538, PR #539, main CI `25903165974`

## 배경

#538/#539는 `월정 숲 source 확인` 이후 빈 밭에서 `월정 숲 심기`로 `seed_moon_grove_001` planted state를 만들었다. 그러나 현재 playable은 source를 심은 뒤 growth `26`에 머무르고, 수확/reveal payoff와 다음 장기 메타 힌트가 없다. Rare source가 planting에서 멈추면 플레이어가 "하나 더 키워볼까?" 대신 "끝났나?"를 느끼는 production gap이 생긴다.

이번 slice는 새 accepted manifest asset을 만들지 않고, #533/#535에서 이미 accepted된 `seed_moon_grove_001_icon`과 `fx_moon_grove_source_reward_strip_v1`을 harvest reward motion으로 재바인딩한다. payoff는 단순 재사용이 아니라 새 playfield state와 HUD affordance를 만든다: planted source를 care -> ready -> `월정 숲 수확` -> named discovery surface -> 다음 온실/숲길 메타 preview로 닫는다.

## Creative brief

- Player verb: `월정 숲 수확`
- Production/progression role: 월정 문 첫 보상이 source planting에서 끝나지 않고 named discovery와 다음 온실/숲길 메타 힌트로 이어진다.
- Screen moment: `월정 숲 심기` 후 plot을 두 번 돌보면 ready가 되고, 수확 시 plot이 비워지며 HUD에 `월정 숲 발견` surface와 다음 확장 힌트가 남는다.
- Asset/FX decision: 새 raster asset은 만들지 않는다. 대신 accepted `fx_moon_grove_source_reward_strip_v1`을 harvest reward motion으로 새로 바인딩하고, accepted `seed_moon_grove_001_icon`을 reveal HUD/source badge에 유지한다. 후속 creature 전용 portrait/actor는 별도 asset generation WorkUnit으로 분리한다.
- Competition gap: idle collection 게임에서 rare route reward는 claim/planting 후 수확 순간에 다음 goal을 열어야 한다. Egg, Inc./Cell to Singularity식 장기 목표는 새 발견이 다음 확장 preview를 화면에 남겨야 한다.
- Rejected alternative: 새 월정 숲 creature PNG 생성까지 포함. 이유: current blocker는 planting 이후 harvest/reveal state 부재이며, 전용 creature asset은 gpt-image-2/Codex native generation provenance와 review가 필요한 별도 slice다.

## Plan

1. `GardenState`에 월정 숲 harvest/reveal 상태를 추가한다: harvested, discovery revealed, discovery id/name, next preview visible.
2. `careSelectedPlot`에서 `seed_moon_grove_001` 전용 성장 copy와 ready receipt를 추가한다.
3. `harvestSelectedPlot`에서 `seed_moon_grove_001`을 수확하면 plot을 비우고 harvested/revealed 상태, reward leaves, discovery id/name, next preview objective/receipt를 남긴다.
4. Phaser telemetry에 월정 숲 harvested/revealed/discovery/next preview 값을 추가한다.
5. harvest action FX routing에서 `seed_moon_grove_001` 수확은 `moonGroveSource` reward motion을 사용한다.
6. HUD collection surface는 planted/ready/harvested/revealed 상태를 구분하고, reveal 후 다음 온실/숲길 preview 문구를 표시한다.
7. `scripts/check-phaser-foundation.mjs`에 planting 후 care -> ready -> harvest sequence, screenshots, telemetry assertions를 추가한다.
8. Browser Use `iab`를 우선 시도하고, 이번 세션에서 unavailable이면 blocker + Playwright fallback screenshot evidence를 남긴다.

## 수용 기준

- `월정 숲 심기` 후 care action으로 `seed_moon_grove_001`이 ready state가 되고 `월정 숲 수확` action이 보인다.
- 수확 후 plot이 비워지고 `moonGroveSourceSeedPlanted=false`, `moonGroveSourceSeedHarvested=true`, `moonGroveDiscoveryRevealed=true` telemetry가 검증된다.
- HUD에 `월정 숲 발견` surface와 discovery id/name, 다음 온실/숲길 preview가 보인다.
- 수확 순간 `fx_moon_grove_source_reward_strip_v1` reward motion binding이 사용된다.
- runtime image generation/API/cache 호출 없음.
- `npm run check:phaser`, `npm run check:content`, `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:asset-alpha`, `npm run check:ci`, `git diff --check`가 통과한다.

## Department Scorecard

| 부서 | 판정 | 근거 |
| --- | --- | --- |
| 기획팀 | approve | source planting 다음 player verb를 수확/reveal로 닫아 collection loop를 완성한다. |
| 리서치팀 | approve | rare reward가 planting state에서 멈추는 production gap을 수확 payoff와 next preview로 해소한다. |
| 아트팀 | approve | 새 asset을 만들지 않는 대신 accepted source FX를 harvest reward motion에 재바인딩한다. 전용 creature portrait/actor는 별도 generation WorkUnit으로 분리한다. |
| 개발팀 | approve | Phaser state/action/render/checker 범위이며 save/economy boundary 변경은 local state에 한정된다. |
| 검수팀 | approve | Browser Use 우선, unavailable 시 current blocker + Playwright screenshot/telemetry로 검증한다. |
| 마케팅팀 | approve | 내부 playable progression이며 외부 채널/실결제/광고 없음. |
| 고객지원팀 | approve | 플레이어가 월정 숲 source를 수확한 의미와 다음 목표를 HUD에서 이해한다. |

## Role Debate

필수 debate는 발생하지 않았다. 모든 부서가 approve다. 아트팀은 dedicated 월정 숲 creature portrait가 없으면 reveal 감정 점수가 제한될 수 있으므로, 이 slice merge 후 바로 전용 asset generation/review issue를 후보로 올리라고 권고한다.

## Self-evaluation loop

- Claim: `seed_moon_grove_001`은 planting 후 care/ready/harvest/reveal payoff로 이어진다.
- Smallest verifier: `npm run check:phaser`
- Rubric: ready action present, harvest telemetry, plot cleared, reveal HUD, next preview, reward FX key, no runtime generation.
- Artifact path: `reports/visual/issue-0540-moon-grove-harvest-reveal-payoff/visual-report-20260515.md`
- Iteration log: checker failure나 screenshot payoff readability 문제가 있으면 같은 WorkUnit에서 수정 후 재검증한다.
- Stop condition: local gates, PR checks, merge, main CI가 green이거나 Browser Use/tool outage blocker가 문서화됨.

## Subagent/Team Routing

- Solo execute. 변경 범위가 #538의 바로 다음 Phaser state/action/render/checker slice로 좁고, 병렬 agent가 맡을 독립 write scope가 없다.

## 검증 명령

- `npm run check:phaser`
- `npm run check:content`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:asset-alpha`
- `npm run check:ci`
- `git diff --check`

## 리스크

- 전용 월정 숲 creature portrait/actor가 아직 없으므로 reveal은 source discovery 수준이다. dedicated creature asset generation은 후속 WorkUnit으로 분리한다.
- 장기 메타 preview copy가 과하면 첫 5분 clarity를 해칠 수 있다. HUD surface는 한 줄 next preview로 제한한다.
