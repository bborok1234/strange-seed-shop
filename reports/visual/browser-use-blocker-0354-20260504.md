# Browser Use iab blocker — Issue #354

- Issue: #354 `production card rate에 component multiplier breakdown chip strip을 더해 production engine readability를 키운다`
- Timestamp: 2026-05-04T06:55:00Z
- Route: `game-studio:game-studio` → `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- Attempt: 현 세션은 Claude Code 1M 컨텍스트로 실행되며 Codex IAB Browser Use backend가 노출되지 않는다. #275~#352와 동일한 discovery 실패 패턴.

## Result

```json
{
  "ok": false,
  "backend": "iab",
  "message": "Browser Use iab backend가 현재 Claude Code 세션에서 노출되지 않는다."
}
```

## Fallback evidence

- Focused Playwright 393px regression: `npx playwright test --config playwright.config.ts --grep "작업대 강화는 첫 온실 설비 목표로 이어진다"` — 작업대 강화 → 온실 설비 → 온실 선반 납품 → 선반 정리 → chip strip 출현 검증("간식 +25%", "작업대 +15%", "시설 +10%").
- Layout invariant: 393px chip strip vs `.bottom-tabs`, no body scroll, no panel masked overflow.
- Screenshot: focused regression artifact `mobile-greenhouse-facility-order-v0-393.png`(chip strip 포함).

## Follow-up

Browser Use iab가 다음 세션에서 발견되면 chain handoff arc(#344→...→#352) 누적 후 chip strip이 어떻게 보이는지 hands-on으로 확인한다. 이번 PR은 current-session blocker + repeatable Playwright regression gate로 진행한다.
