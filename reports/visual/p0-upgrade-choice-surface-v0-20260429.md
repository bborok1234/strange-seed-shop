# P0 Upgrade choice surface v0

Date: 2026-04-29
Branch: `codex/0083-upgrade-choice-surface-v0`
Issue: #146
Route: `game-studio:game-studio` -> `game-studio:web-game-foundations`, `game-studio:game-ui-frontend`, `game-studio:game-playtest`

## 목적

North Star production bar의 “업그레이드 선택이 있어야 한다” 기준을 정원 action surface에 적용했다. 자동 생산/첫 주문 아래에 `다음 성장 선택`을 추가해 밭 확장, 생산 속도, 주문 준비가 하나의 growth choice로 읽히게 했다.

## Evidence

- Browser Use current tab QA: `reports/visual/p0-upgrade-choice-surface-v0-browser-use-20260429.png`
- Mobile 393 visual gate: `reports/visual/p0-upgrade-choice-surface-v0-20260429.png`
- Short 399x666 visual gate: `reports/visual/p0-upgrade-choice-surface-v0-short-399x666-20260429.png`

## Game Playtest Findings

- PASS: `다음 성장 선택`이 production CTA 아래에 보인다.
- PASS: 밭 확장, 생산 속도, 주문 준비가 각각 상태 chip으로 읽힌다.
- PASS: Browser Use current tab에서 upgrade choice count는 1이며 세 선택 문구가 DOM에 존재한다.
- PASS: 399x666 짧은 viewport에서도 starter panel internal scroll과 bottom tab overlap이 없다.
- 남은 위험: 이번 PR은 existing upgrade를 choice로 재배치한 v0이다. 실제 production speed/research upgrade 구매 루프는 후속 issue가 필요하다.

## Verification

- `npm run build` PASS
- `npm run check:visual -- --grep "업그레이드 선택|짧은 모바일|모바일 자동 생산과 첫 주문"` PASS
- Browser Use in-app tab QA PASS (`http://127.0.0.1:5175/?qaProductionReady=1`, upgrade scene count 1)
- `npm run check:visual` PASS (15 passed)
- `npm run check:ci` PASS
