# P0 Creature production roster v0

Date: 2026-04-30
Branch: `codex/0107-creature-production-roster-v0`
Item: `items/0107-creature-production-roster-v0.md`
Issue: #194

## Game Studio route

- `game-studio:game-studio`: 수집한 두 번째 생명체가 생산 루프에 합류하는 vertical slice.
- `game-studio:web-game-foundations`: 기존 `discoveredCreatureIds` 기반 생산 rate를 화면 view model에 노출.
- `game-studio:game-ui-frontend`: 모바일 playfield와 bottom tab을 가리지 않는 compact roster surface.
- `game-studio:game-playtest`: 첫 5분 이후 연구/원정 직전 상태에서 roster readability와 card overflow 확인.

## Browser Use evidence

Browser Use `iab`로 `http://127.0.0.1:5173/?qaResearchExpeditionReady=1`를 확인했다.

Evidence screenshot:

- `reports/visual/p0-creature-production-roster-browser-use-20260430.png`

Observed checks:

- `정원 자동 생산 장면` 1개 확인.
- `자동 생산과 첫 주문` 1개 확인.
- `생산 동료 roster` 1개 확인.
- playfield와 action card가 `정원 동료 2명 작업 중`을 표시.
- playfield가 `말랑잎 포리 · 방패새싹 모모`를 표시.
- action card가 `분당 12.8 잎` 합산 생산량을 표시.
- roster가 `말랑잎 포리`, `방패새싹 모모`, `수집가 +7.2/분`, `수호자 +3.0/분`을 표시.

## Automated visual evidence

- `npm run check:visual -- --grep "생산 roster"`: 통과.
- `npm run check:visual`: 32개 통과.
- `npm run check:ci`: 통과.
- 추가된 screenshot artifact: `mobile-creature-production-roster-v0-393.png`

## Layout invariants

Focused visual test가 다음 회귀 조건을 확인한다.

- body scroll이 viewport를 넘지 않는다.
- playfield height가 220px보다 크다.
- starter panel bottom이 bottom tab top보다 위에 있다.
- starter panel `scrollHeight`가 `clientHeight`를 넘지 않는다.
- production roster bottom이 bottom tab top보다 위에 있다.
- visible child card/text overflow가 없다.

## Result

두 번째 생명체 발견 상태가 생산 roster, 합산 생산량, 정원 playfield copy로 연결된다. 모바일 393px action surface는 body scroll, bottom tab overlap, card overflow 회귀 없이 유지된다.
