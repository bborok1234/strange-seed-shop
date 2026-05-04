# Browser Use iab blocker — Issue #370

- Issue: #370 `production card rate에 upgrade 활성 시 "+분당 X.X 잎" delta inline indicator를 1.6s 표시한다`
- Timestamp: 2026-05-04T10:10:00Z

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
- 기존 chip strip regression(`npx playwright test --grep "작업대 강화는 첫 온실 설비 목표로 이어진다"`) 통과.
- 1.6s delta indicator 토글은 timing-fragile하므로 시각 검증은 visual inspection으로 수행.
