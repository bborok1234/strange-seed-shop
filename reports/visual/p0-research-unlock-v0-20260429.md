# P0 Research Unlock v0 Visual QA

Date: 2026-04-29
Issue: #152
Branch: `codex/0086-research-unlock-v0`

## 요약

North Star production bar의 “장기 메타의 실루엣이 보여야 한다” 기준을 적용했다. 두 번째 주문 `연구 준비 잎 묶음`을 납품하면 `새싹 기록법 연구`가 열리고, 구매 후 action surface에 `연구 완료`가 남는다.

## Small win

주문 반복 보상이 단순 잎/꽃가루 증가에서 끝나지 않고 첫 연구 purchase로 이어진다.

## Browser Use QA

- URL: `http://127.0.0.1:5175/?qaResearchReady=1`
- PASS: 첫 화면에서 `연구 준비 잎 묶음` 24/24와 `두 번째 주문 후` 연구 locked 상태가 보인다.
- PASS: `주문 납품 +28 잎` 클릭 후 `새싹 기록법 연구` 버튼이 활성화된다.
- PASS: `새싹 기록법 연구` 클릭 후 `연구 완료`, 잎 28, 꽃가루 0 상태가 보인다.
- Evidence: `reports/visual/p0-research-unlock-v0-browser-use-20260429.png`

## Visual Gate

- PASS: `npm run check:visual -- --grep "연구 unlock|짧은 모바일|반복 주문"`
- PASS: `npm run check:visual` 전체 16개 visual tests
- PASS: `npm run check:ci`
- PASS: 393px 모바일 research unlock screenshot.
- PASS: 399x666 short viewport에서 `starter-panel` internal scroll과 bottom tab overlap 없음.
- Evidence:
  - `reports/visual/p0-research-unlock-v0-20260429.png`
  - `reports/visual/p0-research-unlock-v0-short-399x666-20260429.png`
  - `reports/visual/p0-research-unlock-v0-repeat-order-baseline-20260429.png`

## 남은 위험

- 연구가 아직 다음 시스템 효과를 바꾸지는 않는다. 후속 issue에서 research reward가 도감 단서, 새 시설, 탐험 준비 중 하나로 이어져야 한다.
- 네 번째 upgrade choice가 action surface에 들어왔으므로 이후 choice 수가 더 늘면 compact carousel/drawer로 바꾸는 별도 UI 구조가 필요하다.
