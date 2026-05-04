# Browser Use iab blocker — Issue #346

- Issue: #346 `달빛 온실 설립 직후 production card에 "달빛 온실 입장" reveal motion으로 chain handoff loop를 닫는다`
- Timestamp: 2026-05-04T05:25:00Z
- Route: `game-studio:game-studio` → `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- Attempt: 현 세션은 Claude Code 1M 컨텍스트로 실행되며 Codex IAB Browser Use backend가 노출되지 않는다. #275~#344와 동일한 discovery 실패 패턴.

## Result

```json
{
  "ok": false,
  "backend": "iab",
  "message": "Browser Use iab backend가 현재 Claude Code 세션에서 노출되지 않는다. Codex IAB pipe/legacy iab/legacy chrome 어느 candidate도 발견되지 않는다."
}
```

## Fallback evidence

- Focused Playwright 393px regression: `npx playwright test --config playwright.config.ts --grep "작업대 강화는 첫 온실 설비 목표로 이어진다"` — 작업대 강화 → 온실 설비 click 직후 `.greenhouse-facility-entry-receipt` 표시 + 카피("달빛 온실 입장 / 다음 주문: 온실 선반 납품 시작 / 정원 자동 생산 +10% 적용") + playfield `order-variant-greenhouse-facility-entry` + 2.4초 후 receipt unmount를 검증.
- Layout invariant: 393px receipt vs `.bottom-tabs`, no body scroll, no panel masked overflow.
- Screenshot: focused regression artifact `mobile-greenhouse-facility-unlock-v0-393.png`(entry receipt 포함).

## Follow-up

Browser Use iab가 다음 세션에서 발견되면 chain handoff(#344) → 작업대 강화 → 온실 설비 click → entry reveal → GREENHOUSE_ORDER 진입 flow를 hands-on으로 재확인한다. 이번 PR은 current-session blocker + repeatable Playwright regression gate로 진행한다.
