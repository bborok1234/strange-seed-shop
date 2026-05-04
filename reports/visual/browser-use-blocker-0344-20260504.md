# Browser Use iab blocker — Issue #344

- Issue: #344 `포장잎 상인 단골 시퀀스 마침이 다음 production 목표(달빛 온실 설립)로 시각적 handoff한다`
- Timestamp: 2026-05-04T05:00:00Z
- Route: `game-studio:game-studio` → `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- Attempt: 현 세션은 Claude Code 1M 컨텍스트로 실행되며 Codex IAB Browser Use backend가 노출되지 않는다. #275~#342와 동일한 discovery 실패 패턴.

## Result

```json
{
  "ok": false,
  "backend": "iab",
  "message": "Browser Use iab backend가 현재 Claude Code 세션에서 노출되지 않는다. Codex IAB pipe/legacy iab/legacy chrome 어느 candidate도 발견되지 않는다."
}
```

## Fallback evidence

- Focused Playwright 393px regression: `npx playwright test --config playwright.config.ts --grep "단골 시퀀스 마침"` — chain-complete reveal 종료 후 handoff card("다음 목표 / 달빛 온실 설립") 등장 + `.merchant-chain-next-goal` className + playfield `order-variant-merchant-chain-handoff` crate + facility build 후 handoff dismiss를 검증.
- Layout invariant: 393px handoff card vs `.bottom-tabs`, no body scroll, no panel masked overflow.
- Screenshot: focused regression artifact `mobile-merchant-chain-completion-boost-393.png`(handoff card 포함, 같은 spec에서 출력).

## Follow-up

Browser Use iab가 다음 세션에서 발견되면 같은 chain-complete sparkle → handoff card 등장 → facility 설립 → handoff dismiss flow를 hands-on으로 재확인한다. 이번 PR은 current-session blocker + repeatable Playwright regression gate로 진행한다.
