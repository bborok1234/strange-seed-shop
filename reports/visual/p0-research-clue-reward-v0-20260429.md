# P0 Research Clue Reward v0 Visual QA

Date: 2026-04-29
Issue: #154
Branch: `codex/0087-research-clue-reward-v0`

## 요약

`새싹 기록법 연구` 완료가 단순 저장 상태로 끝나지 않도록, 다음 생명체 목표에 `연구 단서`를 붙였다. 정원 action surface와 씨앗 탭 모두에서 같은 단서가 보여 연구가 다음 수집 행동을 돕는 보상으로 읽힌다.

## Small win

연구 완료 후 플레이어는 `방울새싹 씨앗`이 `방패새싹 모모`와 연결된다는 단서를 정원과 씨앗 탭에서 바로 확인한다.

## Browser Use QA

- URL: `http://127.0.0.1:5175/?qaResearchComplete=1`
- PASS: 정원 다음 생명체 카드에 `연구 단서: 방울새싹 씨앗에서 넓은 잎으로 잠든 씨앗을 지켜준다`가 보인다.
- PASS: 씨앗 탭 goal banner와 target seed row에 같은 연구 단서가 보인다.
- PASS: 씨앗 탭 문구가 `방패새싹 모모를 만날 차례예요.`로 표시된다.
- Evidence:
  - `reports/visual/p0-research-clue-reward-v0-browser-use-20260429.png`
  - `reports/visual/p0-research-clue-reward-v0-seeds-tab-browser-use-20260429.png`

## Visual Gate

- PASS: `npm run check:visual -- --grep "연구 단서|짧은 모바일"`
- PASS: `npm run check:visual` 전체 18개 visual tests
- PASS: `npm run check:ci`
- Evidence:
  - `reports/visual/p0-research-clue-reward-v0-20260429.png`
  - `reports/visual/p0-research-clue-reward-v0-seeds-tab-20260429.png`
  - `reports/visual/p0-research-clue-reward-v0-short-399x666-20260429.png`

## 남은 위험

- 연구 단서는 아직 확률, 비용, 생산량을 바꾸지 않는다. 후속에서는 연구가 도감 단서 강화, 탐험 준비, 또는 온실 시설 중 하나의 실제 progression effect로 이어져야 한다.
- 연구 단서가 길어지면 compact surface에서는 줄임 처리된다. 긴 lore 문장은 도감/연구 탭 같은 별도 surface가 생긴 뒤 옮기는 편이 안전하다.
