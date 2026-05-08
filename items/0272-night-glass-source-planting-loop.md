# 밤유리 source planting loop

## 상태

- Status: review
- Game Studio route: `game-studio:game-studio -> game-studio:phaser-2d-game -> game-studio:game-ui-frontend -> game-studio:game-playtest`
- GitHub issue: #512
- PR: #513
- Branch: `codex/v1-night-glass-source-planting-loop`
- 연결: Issue #510, PR #511, main CI `25547115055`

## 배경

#510은 `밤유리 source 보기` 이후 `밤유리 조사 보내기 -> 귀환 상자 열기 -> seed_rare_001 source 획득`까지 열었다. 하지만 획득한 rare source는 아직 빈 밭에서 실제 planting verb로 이어지지 않는다. `docs/GAME_BIBLE.md`는 rare seed source가 expedition/research gameplay에서 와야 하고, 획득 후 새 family/rare branch의 재배 loop로 이어져야 한다고 정한다.

경쟁작 production gap은 rare source를 획득했는데 심기 CTA와 playfield state가 없으면 보상이 inventory receipt로만 끝나 플레이어가 다음 행동을 잃는다는 점이다. 이번 slice는 `seed_rare_001 source 획득` 후 빈 밭에 `밤유리 심기` action을 열고, dedicated `seed_rare_001_icon`을 plot planting/growing 상태에 표시해 rare route가 다음 재배 loop로 이어지게 한다.

## Plan

1. `GardenState`에 night glass source seed planted/growth state를 추가하고 source availability를 소비하는 planting reducer를 만든다.
2. `getAvailableActions`에서 빈 밭 선택 시 `밤유리 심기`를 제공한다.
3. `renderSlots`/plot rendering에서 `seed_rare_001` planted/growing plot에는 `seed_rare_001_icon` overlay와 rare source chip을 표시한다.
4. HUD/action surface와 objective는 `seed_rare_001 source 보관 -> 밤유리 심기 -> 밤유리 재배 중`으로 전환한다.
5. `scripts/check-phaser-foundation.mjs`에 source acquired 이후 empty plot selection, `밤유리 심기`, planted telemetry/screenshot assertion을 추가한다.
6. Browser Use hands-on QA를 우선 시도한다. 현재 tool surface에서 unavailable이면 blocker report + Playwright fallback evidence를 유지한다.

## 수용 기준

- `seed_rare_001 source 획득` 이후 빈 밭에 `밤유리 심기` action이 보인다.
- 심기 후 `nightGlassSourceSeedAvailable=false`, `nightGlassSourceSeedPlanted=true`, plot `seedId=seed_rare_001` telemetry가 남는다.
- planted/growing plot은 `seed_rare_001_icon` overlay 또는 rare source chip으로 일반 말랑잎 씨앗과 구분된다.
- `밤유리 재배 중` objective/receipt/HUD surface가 보인다.
- runtime image generation/API/cache 호출 없음.
- `npm run check:phaser`, `npm run check:content`, `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:ci`, `git diff --check`가 통과한다.

## Department Scorecard

| 부서 | 판정 | 근거 |
| --- | --- | --- |
| 기획팀 | approve | `source 획득` 다음 player verb를 `밤유리 심기`로 닫는다. |
| 리서치팀 | approve | rare source 보상이 inventory receipt에서 멈추지 않고 다음 재배 loop로 이어져야 하는 production gap을 해소한다. |
| 아트팀 | approve | #506 accepted `seed_rare_001_icon`을 plot overlay/chip으로 새 screen moment에 binding한다. |
| 개발팀 | approve | Phaser local state/action/render/checker 범위이며 harvest/reveal은 후속 WorkUnit으로 분리한다. |
| 검수팀 | approve | Browser Use 우선, unavailable 시 blocker + Playwright fallback screenshot/telemetry로 검증한다. |
| 마케팅팀 | approve | 내부 playable progression only; 외부 채널/실결제/광고 없음. |
| 고객지원팀 | approve | 플레이어가 source 획득 후 어디에 써야 하는지 빈 밭 action으로 이해한다. |

## Role Debate

필수 debate는 발생하지 않았다. 모든 부서가 approve다. 기획팀은 harvest/reveal까지 욕심내는 대신 planting loop로 자르는 것을 권장하고, 아트팀은 rare plot readability가 약하면 후속 harvest/reveal slice에서 rare sprout/FX asset plan-prompt를 열도록 권고한다.

## Subagent/Team Routing

- Solo execute. 변경 범위가 Phaser state/action/render/checker로 좁고 PR 속도가 중요하다.

## 검증 명령

- `npm run check:phaser`
- `npm run check:content`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:ci`
- `git diff --check`

## 리스크

- `seed_rare_001` harvest/reveal까지 포함하면 scope가 커진다. 이번 slice는 planting/growing 상태까지만 검증한다.
- dedicated rare sprout/growing plot asset은 아직 없다. 이번 slice는 source icon overlay/chip으로 구분하고, 약하면 후속 asset plan-prompt로 분리한다.

## 구현 결과

- `GardenState`에 `nightGlassSourceSeedPlanted` telemetry와 `plantNightGlassSourceSeed` reducer를 추가했다.
- source 획득 후 빈 밭에서 `밤유리 심기` action을 제공하고, 심기 후 `seed_rare_001` plot `state=planted`, `growth=24`로 전환한다.
- Phaser plot renderer는 `seed_rare_001_icon` overlay와 `밤유리` chip을 표시한다.
- HUD/source surface는 `seed_rare_001 source 획득`에서 `seed_rare_001 재배 중 · 밤유리 rare source`로 전환한다.
- `scripts/check-phaser-foundation.mjs`는 acquisition 이후 empty plot selection, `밤유리 심기`, planted telemetry/screenshot을 검증한다.

## 검증 evidence

- `npm run build:phaser`: pass
- `npm run check:phaser`: pass
- `npm run check:content`: pass
- `npm run check:asset-provenance`: pass
- `npm run check:asset-style`: pass
- `npm run check:ci`: pass
- `git diff --check`: pass
- Draft PR: #513 `https://github.com/bborok1234/strange-seed-shop/pull/513`
- Browser Use blocker: `reports/visual/issue-0512-night-glass-source-planting-loop/browser-use-blocker-20260508.md`
- Visual report: `reports/visual/issue-0512-night-glass-source-planting-loop/visual-report-20260508.md`
- Key screenshots:
  - `reports/visual/issue-0512-night-glass-source-planting-loop/phaser-check-night-glass-plant-action-393.png`
  - `reports/visual/issue-0512-night-glass-source-planting-loop/phaser-check-night-glass-planted-393.png`
