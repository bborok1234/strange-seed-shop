# Seed goal CTA one-tap planting QA

## Browser Use

- Backend: Browser Use `iab`
- URL: `http://127.0.0.1:4173/?qaResearchExpeditionReady=1&qaTab=seeds`
- Before: `browser-use-before-noop-20260507.png`
- Button-ready after fix: `browser-use-after-button-ready-20260507.png`
- Planted after fix: `browser-use-after-one-tap-planted-20260507.png`

## Finding

- Before: seed goal banner exposed `정원에서 심기`, but the button only switched to garden and did not buy or plant `젤리콩 씨앗`.
- After: the banner exposes `구매하고 심기` when leaves and an open plot are available. Clicking it buys `젤리콩 씨앗`, plants it into the open plot, deducts leaves, and shows the garden growth button plus planting receipt.

## CI / Visual Regression Note

- PR CI was slow because `Agent Automerge Trial` duplicated `npm run check:ci` while the main `CI` workflow already ran the same baseline check.
- This pass removes that duplicate project-check step from `agent-automerge.yml`; baseline validation remains owned by the `CI` workflow.
