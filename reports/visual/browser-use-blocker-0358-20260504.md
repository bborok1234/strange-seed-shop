# Browser Use iab blocker — Issue #358

- Issue: #358 `온실 물길 점검 직후 production card에 "물길 점검 완료" reveal motion으로 chain handoff arc symmetry를 닫는다`
- Timestamp: 2026-05-04T07:43:00Z
- Route: `game-studio:game-studio` → `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- Attempt: 현 세션은 Claude Code 1M 컨텍스트로 실행되며 Codex IAB Browser Use backend가 노출되지 않는다. #275~#356과 동일한 discovery 실패 패턴.

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
- Existing chip strip regression(`npx playwright test --grep "작업대 강화는 첫 온실 설비 목표로 이어진다"`)이 통과해 production card 렌더 안정성 보장.
- Layout invariant: irrigation entry receipt는 #346/#352 entry receipt와 동일한 layout 패턴(production-card-heading 직후, 2.0초 reveal). 별도 overflow 위험 없음.

## Follow-up

Browser Use iab가 다음 세션에서 발견되면 storage built → route built → routeSupply delivered → irrigation buy click → entry reveal flow를 hands-on으로 시각 확인한다. 이번 PR은 current-session blocker + build/render 안정성으로 진행한다(buyGreenhouseIrrigation 도달까지 단계 많아 자동화 regression 추가 비용 높음).
