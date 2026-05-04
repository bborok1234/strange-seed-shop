# Browser Use iab blocker — Issue #386

- Issue: #386 `Garden playfield plot tap에 group container scale-pulse micro-animation을 추가한다`
- Timestamp: 2026-05-04T13:05:00Z

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
- 시각 검증은 visual inspection으로 수행.
- Phaser tween yoyo scale 1.04, 160ms, Sine.easeOut.
