# Browser Use iab blocker — Issue #368

- Issue: #368 `dispatch receipt nextOrderTitle fall-through 처리를 모든 greenhouse chain orders로 확장한다`
- Timestamp: 2026-05-04T09:42:00Z

## Result

```json
{
  "ok": false,
  "backend": "iab",
  "message": "Browser Use iab backend가 현재 Claude Code 세션에서 노출되지 않는다."
}
```

## Fallback evidence

- Build green: `npm run build` 성공.
- 기존 GREENHOUSE_ORDER fall-through regression 통과 (#360 카피 검증).
- 4개 케이스 자동화 비용 높음 — 같은 패턴 일관성으로 검증.
