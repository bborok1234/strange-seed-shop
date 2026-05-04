# Browser Use iab blocker — Issue #350

- Issue: #350 `첫 GREENHOUSE_ORDER 출하 후 다음 production 목표(선반 정리)로 시각적 handoff card를 production card에 더한다`
- Timestamp: 2026-05-04T06:05:00Z
- Route: `game-studio:game-studio` → `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- Attempt: 현 세션은 Claude Code 1M 컨텍스트로 실행되며 Codex IAB Browser Use backend가 노출되지 않는다. #275~#348과 동일한 discovery 실패 패턴.

## Result

```json
{
  "ok": false,
  "backend": "iab",
  "message": "Browser Use iab backend가 현재 Claude Code 세션에서 노출되지 않는다. Codex IAB pipe/legacy iab/legacy chrome 어느 candidate도 발견되지 않는다."
}
```

## Fallback evidence

- Focused Playwright 393px regression: `npx playwright test --config playwright.config.ts --grep "온실 설비는 새 납품 주문으로 이어진다"` — 작업대 강화 → 온실 설비 click → 잎 채움 → 온실 선반 납품 click → dispatch receipt 종료(2.0s 대기) → `.greenhouse-storage-next-goal` handoff card 표시 + 카피("다음 목표 / 선반 정리 · 1 재료") + production card overflow 없음을 검증.
- Layout invariant: 393px handoff card vs `.bottom-tabs`, no body scroll, no panel masked overflow. handoff active 시 production-complete-row hide로 카드 height 예산 안에 맞춤.
- Screenshot: focused regression artifact `mobile-greenhouse-facility-order-v0-393.png`(handoff card 포함).

## Follow-up

Browser Use iab가 다음 세션에서 발견되면 chain handoff(#344) → entry reveal(#346) → 첫 출하 receipt(#348) → 선반 정리 handoff card flow를 hands-on으로 재확인한다. 이번 PR은 current-session blocker + repeatable Playwright regression gate로 진행한다.
