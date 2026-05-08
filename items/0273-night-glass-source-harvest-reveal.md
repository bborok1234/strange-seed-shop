# 밤유리 source harvest reveal

## 상태

- Status: todo
- Game Studio route: `game-studio:game-studio -> game-studio:phaser-2d-game -> game-studio:game-ui-frontend -> game-studio:game-playtest`
- GitHub issue: #514
- PR: TBD
- Branch: `codex/v1-night-glass-source-harvest-reveal`
- 연결: Issue #512, PR #513, main CI `25547958765`

## 배경

#512는 `seed_rare_001 source 획득 -> 빈 밭 밤유리 심기 -> seed_rare_001 planted`까지 닫았다. 하지만 rare source는 아직 harvest/reveal payoff가 없어 플레이어가 “희귀 씨앗을 심었다”는 기대를 실제 새 생명체 발견으로 회수하지 못한다.

`docs/GAME_PRODUCTION_SPEC.md`는 `seed_rare_001`을 밤유리 씨앗으로 두고 creature pool을 오로/나리/로로로 둔다. 현재 accepted manifest에는 `creature_lunar_rare_001`이 있으며, #502 이후 rare silhouette/preview로만 사용됐다. 경쟁작 production gap은 rare source 재배가 일반 수확과 같은 보상 텍스트로 끝나면 장기 rare route가 감정 payoff 없이 기능 체크박스처럼 보인다는 점이다.

이번 slice는 `seed_rare_001` planted plot을 돌봐 ready 상태로 만들고 `밤유리 수확` action이 accepted rare creature reveal, HUD/receipt, deterministic telemetry/screenshot으로 이어지게 한다.

## Plan

1. `GardenState`에 night glass source harvest/reveal telemetry와 deterministic rare creature id/name을 추가한다.
2. `harvestSelectedPlot`에서 `seed_rare_001` ready plot을 수확하면 `creature_lunar_rare_001` reveal state, leaves reward, receipt/objective를 남긴다.
3. Phaser playfield/HUD는 `밤유리 수확 준비 -> 밤유리 오로 발견` screen moment를 표시한다.
4. `getAvailableActions`는 ready `seed_rare_001` plot에 `밤유리 수확` action을 제공한다.
5. Sprite/FX decision: accepted `creature_lunar_rare_001` raster를 reveal marker로 표시하고, existing generated `fx_night_glass_source_unlock_strip_v1`을 새 runtime binding `night_glass_source.action.harvest_reveal`로 재사용한다. 프레임 8개, 96x96, 12fps 기준으로 small-size readability를 Playwright screenshot에서 확인한다.
6. `scripts/check-phaser-foundation.mjs`는 #512 planting 이후 `돌보기` 반복, ready screenshot, `밤유리 수확`, reveal screenshot/telemetry assertion을 추가한다.
7. Browser Use hands-on QA를 우선 시도한다. 현재 tool surface에서 unavailable이면 blocker report + Playwright fallback evidence를 유지한다.

## 수용 기준

- `seed_rare_001` planted plot은 `돌보기`로 ready 상태가 된다.
- ready plot action rail에 `밤유리 수확`이 보인다.
- 수확 후 `nightGlassSourceSeedHarvested=true`, `nightGlassRareCreatureRevealed=true`, `nightGlassRareCreatureId=creature_lunar_rare_001` telemetry가 남는다.
- 화면에는 `creature_lunar_rare_001` reveal marker 또는 card와 `밤유리 오로 발견` HUD/receipt가 보인다.
- source plot은 수확 후 empty로 돌아가며 `seed_rare_001` planted plot이 남지 않는다.
- runtime image generation/API/cache 호출 없음.
- `npm run check:phaser`, `npm run check:content`, `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:ci`, `git diff --check`가 통과한다.

## Department Scorecard

| 부서 | 판정 | 근거 |
| --- | --- | --- |
| 기획팀 | approve | `밤유리 심기` 다음 player verb를 `돌보기 -> 밤유리 수확 -> rare creature reveal`로 닫는다. |
| 리서치팀 | approve | rare route가 planting에서 멈추면 production idle loop의 장기 보상이 약해지는 gap을 해소한다. |
| 아트팀 | approve | accepted `creature_lunar_rare_001`을 preview silhouette에서 실제 reveal payoff로 승격하고, night-glass FX strip을 harvest reveal binding으로 쓴다. |
| 개발팀 | approve | Phaser local state/action/render/checker 범위이며 추가 asset generation이나 economy long-timer는 다루지 않는다. |
| 검수팀 | approve | Browser Use 우선, unavailable 시 blocker + Playwright screenshot/telemetry로 ready/reveal을 검증한다. |
| 마케팅팀 | approve | 내부 playable progression only; 외부 채널/실결제/광고 없음. |
| 고객지원팀 | approve | 플레이어가 밤유리 source를 심은 결과가 새 rare creature 발견이라는 것을 이해할 수 있다. |

## Role Debate

필수 debate는 발생하지 않았다. 모든 부서가 approve다. 아트팀은 dedicated harvest reveal FX 신규 제작도 가능하다고 보지만, #506에서 이미 생성한 night-glass FX strip이 아직 acquisition/reveal 계열 motion으로 충분히 쓰이지 않았으므로 이번 slice는 runtime binding과 screenshot readability를 먼저 검증한다.

## Subagent/Team Routing

- Solo execute. 변경 범위가 Phaser state/action/render/checker로 좁고, 이전 #512 구현 위에 바로 이어지는 단일 runtime slice다.

## 검증 명령

- `npm run check:phaser`
- `npm run check:content`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:ci`
- `git diff --check`

## 리스크

- `creature_lunar_rare_001`의 이름을 장기 bible의 오로/나리/로로 중 어디로 고정할지 후속 content pass와 충돌할 수 있다. 이번 slice는 deterministic first reveal을 `밤유리 오로`로 고정한다.
- 기존 FX strip 재사용이 reveal로 약하면 후속 WorkUnit에서 dedicated `fx_night_glass_harvest_reveal_strip_v1` plan-prompt-generate-review를 열어야 한다.
