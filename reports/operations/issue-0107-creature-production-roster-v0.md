# [P0.5] 두 번째 생명체를 생산 roster에 합류시키기

## 요약

두 번째 생명체를 발견한 뒤에도 정원 생산 화면이 첫 생명체 한 명만 작업하는 것처럼 보이는 문제를 고친다. 실제 simulation은 이미 `discoveredCreatureIds` 전체를 생산량에 반영하므로, 화면도 `정원 동료 2명`, 각 생명체 role contribution, 합산 생산량을 보여야 한다.

## Small win

두 번째 생명체 발견이 즉시 production idle fantasy로 보인다. 수집한 아이가 도감에만 남는 것이 아니라 정원 경제에 합류한다.

## 사용자/운영자 가치

플레이어는 “하나 더 얻으면 생산이 커진다”를 첫 화면에서 이해한다. 운영자는 작은 copy polish가 아니라 production loop vertical slice를 다음 작업으로 선택했다는 증거를 남긴다.

## Game Studio route

- `game-studio:game-studio`: 수집 -> 생산 roster 합류 -> rate 상승 -> 다음 주문/연구 progression으로 이어지는 vertical slice.
- `game-studio:web-game-foundations`: save/simulation truth를 UI view model이 읽어 표시.
- `game-studio:game-ui-frontend`: 모바일 playfield와 bottom tab을 가리지 않는 compact roster surface.
- `game-studio:game-playtest`: roster readability, HUD weight, card overflow를 Browser Use와 visual gate로 확인.

## 수용 기준

- [x] 두 생명체 발견 상태에서 정원 자동 생산 장면이 `정원 동료 2명` 또는 동등 roster copy를 보여준다.
- [x] production action card가 `말랑잎 포리`와 `방패새싹 모모`를 production roster로 보여준다.
- [x] production rate가 두 생명체 합산으로 보이고 기존 order/progression flow가 유지된다.
- [x] 모바일 393px에서 production roster가 playfield와 bottom tabs를 가리지 않고 card 내부 overflow가 없다.
- [x] Browser Use `iab`, focused visual, full visual, CI가 통과한다.

## 검증

- Browser Use `iab`: `reports/visual/p0-creature-production-roster-browser-use-20260430.png`
- Visual report: `reports/visual/p0-creature-production-roster-v0-20260430.md`
- `npm run check:visual -- --grep "생산 roster"` 통과
- `npm run check:visual` 32개 통과
- `npm run check:ci` 통과

## 안전 범위

- 신규 asset 생성 없음.
- 저장 schema 변경 없음.
- 실제 결제, 광고, 외부 배포 없음.

## 남은 위험

- 세 번째 이상 생명체 roster는 현재 최대 3개 compact chip으로 제한한다. 더 많은 생명체가 production roster에 들어올 때는 overflow 정책을 별도 slice로 확장해야 한다.
