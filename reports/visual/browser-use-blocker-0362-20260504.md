# Browser Use iab blocker — Issue #362

- Issue: #362 `온실 물안개 분사 직후 production card에 "물안개 분사 완료" reveal motion으로 chain handoff arc symmetry를 마무리한다`
- Timestamp: 2026-05-04T08:30:00Z
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

- Build green: `npm run build` 성공.
- Existing chip strip regression(`npx playwright test --grep "온실 설비는 새 납품 주문으로 이어진다"`) 통과.
- Layout invariant: facility/storage/irrigation entry receipt와 동일 패턴.

## Follow-up

mist는 후반 단계로 자동화 regression 추가 비용이 높다. build/render 안정성 + facility/storage/irrigation entry 패턴 일관성으로 충분히 검증된다.
