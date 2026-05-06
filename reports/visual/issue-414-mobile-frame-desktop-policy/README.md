# Issue #414 mobile frame desktop policy visual evidence

Date: 2026-05-06

## Browser Use

Browser Use `iab` was attempted before and after implementation. Both attempts failed because the Codex in-app browser backend was not discoverable in this session:

`No Codex IAB backends were discovered.`

This is recorded as a Browser Use blocker for this issue. Playwright screenshots are fallback evidence only.

## Screenshots

- Desktop 1280 after wait: `playwright-desktop-1280-after-wait-20260506.png`
- Mobile 393 after wait: `playwright-mobile-393-after-wait-20260506.png`

## Result

- Desktop no longer renders the left rail or right side dock.
- Desktop uses the same centered 393px mobile game frame as the mobile policy.
- Mobile plot labels now have a backing plate/tint and support actor badges sit inside the production card.
- Short mobile viewport action surface no longer clips content in the focused regression.

