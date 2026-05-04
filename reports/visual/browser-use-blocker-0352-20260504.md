# Browser Use iab blocker — Issue #352

- Issue: #352 `선반 정리 직후 production card에 "선반 정리 완료" reveal motion으로 storage handoff loop를 닫는다`
- Timestamp: 2026-05-04T06:30:00Z
- Route: `game-studio:game-studio` → `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- Attempt: 현 세션은 Claude Code 1M 컨텍스트로 실행되며 Codex IAB Browser Use backend가 노출되지 않는다. #275~#350과 동일한 discovery 실패 패턴.

## Result

```json
{
  "ok": false,
  "backend": "iab",
  "message": "Browser Use iab backend가 현재 Claude Code 세션에서 노출되지 않는다."
}
```

## Fallback evidence

- Focused Playwright 393px regression: `npx playwright test --config playwright.config.ts --grep "온실 설비는 새 납품 주문으로 이어진다"` — storage handoff(#350) → 선반 정리 click → `.greenhouse-storage-entry-receipt` + 카피("선반 정리 완료 / 다음 주문: 온실 확장 준비 시작 / 보관 보너스 +10% 적용") + storage handoff dismiss를 검증.
- Layout invariant: 393px receipt vs `.bottom-tabs`, no body scroll, no panel masked overflow.
- Screenshot: focused regression artifact `mobile-greenhouse-facility-order-v0-393.png`(entry receipt 포함).

## Follow-up

Browser Use iab가 다음 세션에서 발견되면 chain handoff arc(#344→#346→#348→#350→#352) flow를 hands-on으로 재확인한다. 이번 PR은 current-session blocker + repeatable Playwright regression gate로 진행한다.
