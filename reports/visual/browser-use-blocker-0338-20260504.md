# Browser Use iab blocker — Issue #338

- Issue: #338 `포장잎 상인 단골 두 번째 chapter 납품이 단골 시퀀스 영구 생산 boost로 마침을 잇는다`
- Timestamp: 2026-05-04T02:30:00Z
- Route: `game-studio:game-studio` → `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- Attempt: 현 세션은 Claude Code 1M 컨텍스트로 실행되며 Codex IAB Browser Use backend가 노출되지 않는다. #275~#336과 동일한 discovery 실패 패턴.

## Result

```json
{
  "ok": false,
  "backend": "iab",
  "message": "Browser Use iab backend가 현재 Claude Code 세션에서 노출되지 않는다. Codex IAB pipe/legacy iab/legacy chrome 어느 candidate도 발견되지 않는다."
}
```

## Fallback evidence

- Focused Playwright 393px regression: `npx playwright test --config playwright.config.ts --grep "단골 시퀀스 마침|merchant-chain-complete|chain-completion-boost"` — chain-complete reveal motion + chip pulse + badge persistence + playfield medal crate variant + save `merchantChainBoostActive: true`를 검증.
- Screenshot: `reports/visual/issue-338-merchant-chain-completion-boost-393.png` (focused regression artifact 사본).
- Layout invariant: 393px chip / 메달 crate / 보상 receipt vs `.bottom-tabs`, no body scroll, no panel masked overflow.

## Follow-up

Browser Use iab가 다음 세션에서 발견되면 같은 두 번째 chapter 납품 → chain-complete sparkle → chip pulse → 영구 badge persistence flow를 hands-on으로 재확인한다. 이번 PR은 current-session blocker + repeatable Playwright regression gate로 진행한다.
