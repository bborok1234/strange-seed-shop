# 월정 문 unlock requirements surface

## 상태

- Status: review
- Game Studio route: `game-studio:game-studio -> game-studio:phaser-2d-game -> game-studio:game-ui-frontend -> game-studio:game-playtest`
- GitHub issue: #520
- PR: #521
- Branch: `codex/v1-moon-fence-unlock-requirements-surface`
- 연결: Issue #518, PR #519, main CI `25647140548`

## 배경

#518은 `밤유리 오로 합류 -> 월정 문 단서 보기 -> expedition_moon_fence_locked locked preview`까지 닫았다. 하지만 locked route가 보인 다음, 플레이어가 어떤 조건을 모아야 월정 문이 열리는지 아직 화면 state와 telemetry로 고정되지 않았다.

`docs/GAME_PRODUCTION_SPEC.md`의 D7/D30 script는 expedition gate와 rare source가 장기 목표로 이어져야 한다고 본다. locked route가 단순 잠김 표식으로만 남으면 경쟁 idle/collection game의 “잠김 목표 -> 요구 조건 -> 다음 수집/생산 루프”에 비해 progression affordance가 약하다.

이번 slice는 `월정 문 단서 확인` 이후 `개방 조건 보기` surface를 추가해, 요구 조건(`오로 explorer`, `달빛 단서 2`, `재료 3`)과 현재 보유/부족 상태가 HUD/playfield/checker telemetry에 남도록 만든다.

## Plan

1. `GardenState`에 `moonFenceRequirementSurfaceVisible`, `moonFenceRequirementsInspected`, `moonFenceRequiredClues`, `moonFenceRequiredMaterials`, `moonFenceRequiredExplorerId` telemetry를 추가한다.
2. `moonFenceRouteInspected=true` 이후 action rail에 `개방 조건 보기`를 노출한다.
3. action 처리 함수는 requirements surface를 켜고 objective/receipt를 `월정 문 개방 조건 확인`으로 전환한다.
4. Phaser expedition gate 주변 locked marker는 요구 조건 chip을 추가하고, HUD/action rail은 요구/보유/부족을 compact하게 표시한다.
5. Asset/FX decision: 새 accepted manifest asset 없이 existing expedition gate + night-glass FX + text chip을 사용한다. 기존 asset 재사용만으로 끝내지 않고 player verb, requirement state, telemetry, screenshot assertion을 추가한다.
6. `scripts/check-phaser-foundation.mjs`는 #518 route action 이후 `개방 조건 보기` click, requirements telemetry, screenshot evidence를 assertion한다.
7. Browser Use hands-on QA를 우선 시도한다. 현재 tool surface에서 unavailable이면 blocker report + Playwright fallback evidence를 유지한다.

## 수용 기준

- `월정 문 단서 보기` 후 action rail에 `개방 조건 보기`가 노출된다.
- action 실행 후 telemetry는 `moonFenceRequirementSurfaceVisible=true`, `moonFenceRequirementsInspected=true`, required clue/material/explorer values를 남긴다.
- 화면에는 `오로 explorer`, `달빛 단서 2`, `재료 3` 요구 조건과 현재 부족 상태가 보인다.
- objective 또는 HUD는 `월정 문 개방 조건 확인`을 포함한다.
- runtime image generation/API/cache 호출 없음.
- `npm run check:phaser`, `npm run check:content`, `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:ci`, `git diff --check`가 통과한다.

## Department Scorecard

| 부서 | 판정 | 근거 |
| --- | --- | --- |
| 기획팀 | approve | locked route 다음 player verb를 `개방 조건 보기`로 고정해 장기 목표를 수집/생산 요구로 번역한다. |
| 리서치팀 | approve | 경쟁 idle/collection game은 locked region을 보여준 뒤 요구 조건과 부족분을 바로 제시한다. 잠김 표식만 남는 gap을 줄인다. |
| 아트팀 | revise | 전용 requirements panel/route marker art가 가장 좋지만, 이번 slice는 chip/FX/HUD로 requirement readability를 먼저 고정한다. |
| 개발팀 | approve | Phaser local state/action/render/checker 범위이며 실제 unlock/economy spend는 후속 slice로 분리한다. |
| 검수팀 | approve | Browser Use 우선, unavailable 시 blocker + Playwright click/screenshot/telemetry로 requirements surface를 검증한다. |
| 마케팅팀 | approve | 내부 playable progression only; 외부 채널/실결제/광고 없음. |
| 고객지원팀 | approve | 플레이어가 월정 문이 왜 잠겼고 다음에 무엇을 모아야 하는지 이해할 수 있다. |

## Role Debate

아트팀만 revise다. dedicated route requirements panel asset을 먼저 만들면 polish가 좋아지지만, 현재 blocker는 locked route가 요구 조건으로 해석되지 않는 점이다. 이번 slice는 requirements contract를 먼저 고정하고, 전용 marker/panel asset은 후속 asset WorkUnit으로 남긴다.

## Subagent/Team Routing

- Solo execute. 변경 범위가 #518 위의 Phaser action/state/render/checker로 좁고, 별도 asset generation 병렬화보다 단일 slice가 빠르다.

## 검증 명령

- `npm run check:phaser`
- `npm run check:content`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:ci`
- `git diff --check`

## 구현 결과

- `GardenState`에 `moonFenceRequirementSurfaceVisible`, `moonFenceRequirementsInspected`, required/current clue/material/explorer telemetry를 추가했다.
- `월정 문 단서 보기` 이후 `개방 조건 보기` action이 열리고, 실행 후 `오로 explorer`, `달빛 단서 1/2`, `재료 2/3` 조건이 objective/HUD/playfield/telemetry에 남는다.
- Phaser expedition gate는 existing gate/night-glass FX 위에 compact 조건 chip을 표시한다.
- `scripts/check-phaser-foundation.mjs`는 #518 route action 이후 requirements action click, telemetry, screenshot evidence를 assertion한다.

## 검증 결과

- `npm run build:phaser`: 통과
- `npm run check:phaser`: 통과
- `npm run check:content`: 통과
- `npm run check:asset-provenance`: 통과
- `npm run check:asset-style`: 통과
- `npm run check:ci`: 통과
- Requirements evidence: `reports/visual/issue-0520-moon-fence-unlock-requirements-surface/phaser-check-moon-fence-requirements-393.png`
- Visual report: `reports/visual/issue-0520-moon-fence-unlock-requirements-surface/visual-report-20260511.md`
- Browser Use blocker: `reports/visual/issue-0520-moon-fence-unlock-requirements-surface/browser-use-blocker-20260511.md`

## 리스크

- requirements chip이 HUD density를 더 높일 수 있다. 실패하면 route requirements를 expedition gate playfield marker 쪽으로 더 밀어야 한다.
- 실제 unlock/spend까지 넣지 않기 때문에 다음 slice에서 `월정 문 준비 납품` 또는 `route unlock`이 필요할 수 있다.
