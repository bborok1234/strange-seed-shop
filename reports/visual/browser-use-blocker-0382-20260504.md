# Browser Use iab blocker — Issue #382

- Issue: #382 `원정 보상 수령 모멘트에 ExpeditionClaimReceipt 셀러브레이션 카드를 노출한다`
- Timestamp: 2026-05-04T12:30:00Z

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
- expedition-claim-reveal keyframe + chip 스타일은 production-claim-receipt 패턴을 mirror.
