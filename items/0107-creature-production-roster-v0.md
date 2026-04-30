# Creature production roster v0

Status: review
Branch: `codex/0107-creature-production-roster-v0`
Issue: #194
PR: #195

## Context

P0.5 production loop는 첫 생명체 생산, 주문, 업그레이드, 연구/원정, 복귀 hook까지 이어졌다. 하지만 두 번째 생명체를 발견해도 정원 생산 장면은 여전히 `말랑잎 포리 작업 중`처럼 첫 생명체 한 명만 일하는 것으로 보인다. 실제 생산 rate는 `discoveredCreatureIds` 전체를 합산하지만, 화면 순간은 수집한 생명체가 정원 경제에 합류한다는 production idle fantasy를 충분히 보여주지 못한다.

## Game Studio route

- `game-studio:game-studio`: 수집 -> 생산 roster 합류 -> rate 상승 -> 다음 주문/연구 progression으로 이어지는 vertical slice.
- `game-studio:web-game-foundations`: save/simulation은 이미 `discoveredCreatureIds` 기반 rate를 계산하므로, UI/view model이 simulation truth를 읽어 보여준다.
- `game-studio:game-ui-frontend`: mobile playfield를 가리지 않는 compact roster surface로 설계한다.
- `game-studio:game-playtest`: 첫 5분/복귀 상태에서 roster readability, HUD weight, card overflow를 확인한다.

## Vertical slice scoring

- `player verb`: 두 번째 생명체를 얻고 정원에서 생산 동료로 확인한다.
- `production/progression role`: discovered creature count가 production rate와 order readiness에 연결된다.
- `screen moment`: 정원 playfield production lane과 action surface production card가 `정원 동료 n명`을 보여준다.
- `asset/FX`: 기존 creature asset을 roster portrait로 재사용한다. 신규 생성 없음.
- `playtest evidence`: Browser Use `iab`, focused visual, full visual, CI.

## Plan

1. `ProductionStatus`에 worker creature 목록과 roster label/detail을 추가한다.
2. playfield production lane과 production card가 첫 생명체 고정 문구 대신 roster summary를 보여주게 한다.
3. production card에 compact roster portraits/role contribution을 추가하되 모바일 panel/card overflow를 만들지 않는다.
4. `qaResearchExpeditionReady=1` 또는 동등 QA state에서 두 생명체 roster가 보이는 visual test를 추가한다.
5. Browser Use evidence와 visual report를 남기고 roadmap/dashboard/GitHub evidence를 갱신한다.

## Acceptance

- [x] 두 생명체 발견 상태에서 정원 자동 생산 장면이 `정원 동료 2명` 또는 동등 roster copy를 보여준다.
- [x] production action card가 `말랑잎 포리`와 `방패새싹 모모`를 production roster로 보여준다.
- [x] production rate가 두 생명체 합산으로 보이고 기존 order/progression flow가 유지된다.
- [x] 모바일 393px에서 production roster가 playfield와 bottom tabs를 가리지 않고 card 내부 overflow가 없다.
- [x] Browser Use `iab`, focused visual, full visual, CI가 통과한다.

## Evidence

- Browser Use `iab`: `reports/visual/p0-creature-production-roster-browser-use-20260430.png`
- Visual report: `reports/visual/p0-creature-production-roster-v0-20260430.md`
- Focused visual: `npm run check:visual -- --grep "생산 roster"` 통과
- Full visual: `npm run check:visual` 32개 통과
- Full CI: `npm run check:ci` 통과

## Risks

- roster UI가 production card 밀도를 다시 높일 수 있다. compact chip/portrait로 제한하고 card overflow invariant를 test에 넣는다.
