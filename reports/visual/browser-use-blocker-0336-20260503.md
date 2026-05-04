# Browser Use iab blocker — Issue #336

- Issue: #336 `포장잎 상인 단골 납품 후 두 번째 단골 chapter 의뢰가 production loop를 잇는다`
- Timestamp: 2026-05-04T04:10:00Z
- Route: `game-studio:game-studio` → `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- Attempt: 현 세션은 Claude Code 1M 컨텍스트로 실행되며 Codex IAB Browser Use backend가 노출되지 않는다. 이전 #275~#332 시도와 동일한 discovery 실패 패턴을 따른다.

## Result

```json
{
  "ok": false,
  "backend": "iab",
  "message": "Browser Use iab backend가 현재 Claude Code 세션에서 노출되지 않는다. Codex IAB pipe/legacy iab/legacy chrome 어느 candidate도 발견되지 않는다."
}
```

## Fallback evidence

- Focused Playwright 393px regression: `npx playwright test --config playwright.config.ts --grep "단골 두 번째|merchant-second-chapter|상인 두 번째 단골"` — green.
- Screenshot: `reports/visual/issue-336-merchant-second-chapter-order-393.png` (focused regression artifact를 reports/visual로 복사).
- Layout invariant: 393px chapter card / playfield crate / receipt vs `.bottom-tabs`, no body scroll, no panel masked overflow.

## Follow-up

Browser Use iab가 다음 세션에서 발견되면 같은 follow-up 납품 → 두 번째 chapter 진입 → 잎 수령 → 납품 → reward + delivered flow를 hands-on으로 재확인한다. 이번 PR은 current-session blocker + repeatable Playwright regression gate로 진행한다.
