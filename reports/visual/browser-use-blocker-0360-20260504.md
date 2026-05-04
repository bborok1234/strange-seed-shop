# Browser Use iab blocker — Issue #360

- Issue: #360 `dispatch receipt의 nextOrderTitle이 fall-through 케이스에서 stale-completed order를 가리키는 UX bug를 다음 단계 hint로 대체한다`
- Timestamp: 2026-05-04T08:05:00Z
- Route: `game-studio:game-studio` → `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- Attempt: 현 세션은 Claude Code 1M 컨텍스트로 실행되며 Codex IAB Browser Use backend가 노출되지 않는다.

## Result

```json
{
  "ok": false,
  "backend": "iab",
  "message": "Browser Use iab backend가 현재 Claude Code 세션에서 노출되지 않는다."
}
```

## Fallback evidence

- Focused Playwright 393px regression: `npx playwright test --grep "온실 설비는 새 납품 주문으로 이어진다"` — GREENHOUSE_ORDER 납품 직후 dispatch receipt가 "다음 단계: 선반 정리" 카피를 보여주는지 검증.
- Layout invariant: receipt 카피 변경만, layout 변경 없음.

## Follow-up

다른 fall-through 케이스(예: 모든 greenhouse upgrade 완료 후 LUNAR_GUARDIAN_ORDER 빠진 상태)는 별도 WorkUnit으로 추적.
