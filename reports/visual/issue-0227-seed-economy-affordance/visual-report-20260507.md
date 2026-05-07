# 씨앗 탭 경제 affordance Browser Use QA

## Target

- Issue: https://github.com/bborok1234/strange-seed-shop/issues/428
- URL: `http://127.0.0.1:4173/?qaResearchExpeditionReady=1&qaTab=seeds`
- Route: `game-studio:game-studio` -> `game-studio:game-ui-frontend` -> `game-studio:game-playtest`

## Before

- Screenshot: `reports/visual/issue-0227-seed-economy-affordance/browser-use-before-seeds-affordance-20260507.png`
- Finding: seed row CTA showed `구매 25` without the resource unit in the button. The row had fragmented context, so cost, current resource, and result were not scannable at the action point.

## After

- Screenshot: `reports/visual/issue-0227-seed-economy-affordance/browser-use-after-seeds-affordance-20260507.png`
- DOM/screen checks:
  - `비용 60 잎 · 보유 72 잎`: present.
  - `구매 후 보유 1개`: present.
  - `구매 60 잎`: present.

## Interaction

- Screenshot: `reports/visual/issue-0227-seed-economy-affordance/browser-use-after-buy-seeds-affordance-20260507.png`
- Browser Use clicked exactly one `구매 60 잎` button.
- Result after click:
  - `보유 씨앗 1개`: present.
  - `정원에 심기`: present.
  - insufficient second purchase state now explains the blocker as `48 잎 부족`.

## Regression Evidence

- `npm run build`: passed.
- `npx playwright test tests/visual/p0-mobile-game-shell.spec.ts --config playwright.config.ts -g "씨앗 경제 affordance|도감 목표 CTA|연구 단서 씨앗 구매와 심기"`: 3 passed.
- `npm run check:ci`: passed after heartbeat/control-room/roadmap mirror update.
