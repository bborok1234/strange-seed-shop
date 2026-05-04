# Browser Use iab blocker — Issue #372

- Issue: #372 `P0.5 진행도 카드 헤더에 "다음: <label>" 다음 milestone 힌트를 인라인 표시한다`
- Timestamp: 2026-05-04T10:33:00Z

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
- 카드 헤더 chip 추가 — layout 영향 최소.
- 시각 검증은 visual inspection으로 수행.
