# Browser Use iab blocker — Issue #364

- Issue: #364 `album 탭에 P0.5 진행도 milestones 카드를 더해 player progression long-term meta hint를 anchor한다`
- Timestamp: 2026-05-04T08:50:00Z
- Route: `game-studio:game-studio` → `game-studio:game-ui-frontend` + `game-studio:game-playtest`

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
- 카드는 album 탭의 album-progress-copy 직후 추가, 기존 album-grid CSS와 격리.
- Layout invariant: 393px 모바일에서 6 milestone이 2-col grid, 각 row 9px 폰트로 컴팩트하게 들어간다.

## Follow-up

milestone 카드의 시각 확인은 visual inspection으로 수행. 자동화 regression 추가는 후속 WorkUnit에서 추적.
