# Browser Use iab blocker — Issue #348

- Issue: #348 `첫 GREENHOUSE_ORDER 납품에 출하 receipt + playfield 메달 variant를 더해 chain handoff loop를 한 beat 더 닫는다`
- Timestamp: 2026-05-04T05:45:00Z
- Route: `game-studio:game-studio` → `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- Attempt: 현 세션은 Claude Code 1M 컨텍스트로 실행되며 Codex IAB Browser Use backend가 노출되지 않는다. #275~#346과 동일한 discovery 실패 패턴.

## Result

```json
{
  "ok": false,
  "backend": "iab",
  "message": "Browser Use iab backend가 현재 Claude Code 세션에서 노출되지 않는다. Codex IAB pipe/legacy iab/legacy chrome 어느 candidate도 발견되지 않는다."
}
```

## Fallback evidence

- Focused Playwright 393px regression: `npx playwright test --config playwright.config.ts --grep "온실 설비는 새 납품 주문으로 이어진다"` — 작업대 강화 → 온실 설비 click → 잎 채움 → 온실 선반 납품 click → `.order-dispatch-receipt` chip + 카피("상자 출하 완료 / 온실 선반 납품 / +42 잎 · +2 꽃가루 · +1 재료") + playfield `order-variant-greenhouse-shelf-delivered` + bottom-tabs 비충돌을 검증.
- Layout invariant: 393px receipt vs `.bottom-tabs`, no body scroll, no panel masked overflow.
- Screenshot: focused regression artifact `mobile-greenhouse-facility-order-v0-393.png`(receipt + 메달 variant 포함).

## Follow-up

Browser Use iab가 다음 세션에서 발견되면 chain handoff(#344) → entry reveal(#346) → 첫 출하 receipt + 메달 variant flow를 hands-on으로 재확인한다. 이번 PR은 current-session blocker + repeatable Playwright regression gate로 진행한다.
