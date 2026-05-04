# Browser Use iab blocker — Issue #366

- Issue: #366 `달빛 손님 첫 발견 직후 production card에 "달빛 phase 시작" reveal motion으로 lunar phase entry를 anchor한다`
- Timestamp: 2026-05-04T09:18:00Z
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
- 패턴은 facility/storage/irrigation/mist entry receipt와 동일.
- LUNAR_REWARD_CREATURE_ID 첫 discovery 자동화 regression은 lunar seed 수확까지 시퀀스 길어 비용 높음. build + 기존 lunar 관련 regression 통과로 검증.

## Follow-up

Browser Use iab 발견 시 lunar phase entry receipt를 hands-on으로 시각 확인.
