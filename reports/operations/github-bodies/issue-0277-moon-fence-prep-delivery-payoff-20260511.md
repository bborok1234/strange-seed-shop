## 요약

#520/#521 이후 `월정 문` unlock requirements가 `오로 explorer · 달빛 단서 1/2 · 재료 2/3`으로 보이지만, 부족한 재료 1개를 채우는 다음 행동이 없다. `월정 문 준비 납품` action과 expedition gate 옆 prep crate state를 추가해 material requirement를 `3/3` ready로 전환한다.

## 배경

- 이전 완료: Issue #520, PR #521, main CI `25647585415`
- 현재 gap: `개방 조건 보기` 이후 player verb가 없어 `재료 2/3` 부족분이 다음 생산/납품 loop로 이어지지 않는다.
- 경쟁작 production gap: idle/collection game은 locked region 요구 조건을 보여준 뒤 부족한 재료를 crate/prep task로 바로 채우게 한다. 현재는 조건만 보이고 정원 화면의 행동으로 연결되지 않는다.

## Game Studio route

`game-studio:game-studio -> game-studio:phaser-2d-game -> game-studio:game-ui-frontend -> game-studio:game-playtest`

## Game Studio Department Signoff

- 기획팀: player verb `월정 문 준비 납품`으로 material shortfall을 닫는다.
- 리서치팀: locked route requirement -> prep task -> ready state reference pattern을 따른다.
- 아트팀: dedicated crate sprite는 후속 후보로 두고 existing crate/gate visual state로 runtime contract를 먼저 고정한다.
- 개발팀: Phaser local state/action/render/checker 범위이며 route unlock은 후속 slice로 분리한다.
- 검수팀: Browser Use 우선, unavailable 시 current blocker + Playwright fallback screenshot/telemetry를 남긴다.
- 마케팅팀: 내부 playable progression only; 외부 채널/실결제/광고 없음.
- 고객지원팀: 플레이어가 `재료는 준비됨, 단서는 부족`을 이해할 수 있어야 한다.

## Plan

1. `GardenState`에 moon fence prep delivery availability/completed/crate visible telemetry를 추가한다.
2. requirements inspection 이후 action rail에 `월정 문 준비 납품`을 노출한다.
3. action 실행 시 material current를 `3/3`으로 갱신하고 objective/receipt를 `월정 문 준비 납품 완료`로 바꾼다.
4. expedition gate 주변에 prep crate/chip visual state를 표시한다.
5. checker에 prep delivery click, material 3/3 telemetry, HUD/objective, screenshot assertion을 추가한다.

## 수용 기준

- `개방 조건 보기` 이후 `월정 문 준비 납품` action이 보인다.
- action 이후 telemetry는 prep delivery completed/crate visible state와 `moonFenceCurrentMaterials=3`을 남긴다.
- 화면에는 `재료 3/3` ready와 `달빛 단서 1/2` remaining blocker가 함께 보인다.
- objective 또는 receipt는 `월정 문 준비 납품 완료`를 포함한다.
- `npm run check:phaser`, `npm run check:content`, `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:ci`, `git diff --check`가 통과한다.

## Visual evidence 계획

- `reports/visual/issue-0522-moon-fence-prep-delivery-payoff/phaser-check-moon-fence-prep-delivery-393.png`
- `reports/visual/issue-0522-moon-fence-prep-delivery-payoff/visual-report-20260511.md`
- Browser Use unavailable 시 current-session blocker report를 같은 폴더에 남긴다.

## Playable mode 영향

- Feature branch 검증은 `npm run check:phaser`로 수행한다.
- Stable main playable은 별도 worktree `npm run play:main` / port `5174` 기준으로 유지한다.

## 안전 범위

- Phaser local state/action/render/checker와 운영 evidence만 변경한다.
- runtime image generation/API/cache 호출 없음.
- 새 accepted manifest asset은 추가하지 않는다.
- 실제 route unlock/spend/economy consume은 후속 slice로 분리한다.

## 검증 명령

- `npm run check:phaser`
- `npm run check:content`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:ci`
- `git diff --check`
