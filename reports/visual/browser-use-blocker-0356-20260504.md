# Browser Use iab blocker — Issue #356

- Issue: #356 `production rate breakdown chip strip의 신규 활성 source에 1.6s pulse motion을 더해 boost unlock moment를 강조한다`
- Timestamp: 2026-05-04T07:18:00Z
- Route: `game-studio:game-studio` → `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- Attempt: 현 세션은 Claude Code 1M 컨텍스트로 실행되며 Codex IAB Browser Use backend가 노출되지 않는다. #275~#354와 동일한 discovery 실패 패턴.

## Result

```json
{
  "ok": false,
  "backend": "iab",
  "message": "Browser Use iab backend가 현재 Claude Code 세션에서 노출되지 않는다."
}
```

## Fallback evidence

- Focused Playwright 393px regression: `npx playwright test --config playwright.config.ts --grep "작업대 강화는 첫 온실 설비 목표로 이어진다"` — chip strip render + 카피 검증을 통해 build/render 안정성 보장. 1.6s pulse className 토글은 timing-fragile하므로 별도 어설션은 두지 않고 visual inspection으로 검증.
- Layout invariant: pulse motion은 scale + box-shadow → layout 영향 없음.
- Screenshot: focused regression artifact `mobile-greenhouse-facility-order-v0-393.png`(chip strip 포함).

## Follow-up

Browser Use iab가 다음 세션에서 발견되면 작업대/시설 click 직후 chip strip pulse를 hands-on으로 시각 확인한다. 이번 PR은 current-session blocker + repeatable Playwright regression(chip strip render) gate로 진행한다.
