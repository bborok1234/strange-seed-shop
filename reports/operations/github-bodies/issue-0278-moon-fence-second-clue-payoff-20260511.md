## 요약

#522/#523 이후 `월정 문 준비 납품`으로 material requirement는 `재료 3/3 ready`가 됐지만, `달빛 단서 1/2` blocker가 남아 있다. `달빛 단서 포장` action과 clue stamp state를 추가해 clue requirement를 `2/2 ready`로 전환한다.

## 배경

- 이전 완료: Issue #522, PR #523, main CI `25648143531`
- 현재 gap: material ready 이후 마지막 clue shortfall이 텍스트 blocker로만 남고 다음 player verb가 없다.
- 경쟁작 production gap: idle/collection game은 final unlock 직전 missing requirement를 research/order stamp 또는 clue map glow로 보여준다.

## Game Studio route

`game-studio:game-studio -> game-studio:phaser-2d-game -> game-studio:game-ui-frontend -> game-studio:game-playtest`

## Game Studio Department Signoff

- 기획팀: player verb `달빛 단서 포장`으로 clue shortfall을 닫는다.
- 리서치팀: locked route final requirement -> stamp/glow ready state reference pattern을 따른다.
- 아트팀: dedicated clue stamp sprite는 후속 후보로 두고 existing FX + compact chip으로 runtime contract를 먼저 고정한다.
- 개발팀: Phaser local state/action/render/checker 범위이며 route unlock은 후속 slice로 분리한다.
- 검수팀: Browser Use 우선, unavailable 시 current blocker + Playwright fallback screenshot/telemetry를 남긴다.
- 마케팅팀: 내부 playable progression only; 외부 채널/실결제/광고 없음.
- 고객지원팀: 플레이어가 `단서와 재료가 준비됨, 다음은 월정 문 열기`를 이해할 수 있어야 한다.

## Plan

1. `GardenState`에 second clue availability/completed/stamp visible/clue ready telemetry를 추가한다.
2. material ready 이후 action rail에 `달빛 단서 포장`을 노출한다.
3. action 실행 시 clue current를 `2/2`로 갱신하고 objective/receipt를 `달빛 단서 포장 완료`로 바꾼다.
4. expedition gate 주변에 clue stamp/chip visual state를 표시한다.
5. checker에 second clue click, clue 2/2 telemetry, HUD/objective, screenshot assertion을 추가한다.

## 수용 기준

- `월정 문 준비 납품` 이후 `달빛 단서 포장` action이 보인다.
- action 이후 telemetry는 clue packaged/stamp visible state와 `moonFenceCurrentClues=2`를 남긴다.
- 화면에는 `달빛 단서 2/2 ready`와 `재료 3/3 ready`가 함께 보인다.
- objective 또는 receipt는 `달빛 단서 포장 완료`를 포함한다.
- `npm run check:phaser`, `npm run check:content`, `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:ci`, `git diff --check`가 통과한다.

## Visual evidence 계획

- `reports/visual/issue-0524-moon-fence-second-clue-payoff/phaser-check-moon-fence-second-clue-393.png`
- `reports/visual/issue-0524-moon-fence-second-clue-payoff/visual-report-20260511.md`
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
