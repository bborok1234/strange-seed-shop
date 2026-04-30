# [P0.5] 작업대 강화 뒤 첫 온실 설비 목표 보여주기

## 요약

원정 재료로 작업대 강화를 완료한 뒤, 정원 action surface에 첫 `온실 설비` 목표를 보여준다. 재료 사용이 일회성 강화로 끝나지 않고, idle tycoon식 온실 확장 실루엣으로 이어져야 한다.

## Small win

플레이어가 작업대 강화 후 “다음은 온실 설비를 열면 되겠구나”를 정원 화면에서 바로 이해한다.

## 사용자/운영자 가치

게임 가치는 업그레이드 선택이 장기 시설 progression으로 확장되는 데 있다. 운영 가치는 `safe small item`이 아니라 `player verb + progression role + screen moment + playtest evidence`가 있는 다음 vertical slice를 선택했다는 점이다.

## Game Studio route

- `game-studio:game-studio`: 작업대 강화 -> 온실 설비 목표 -> 장기 성장 실루엣 vertical slice.
- `game-studio:web-game-foundations`: saveable facility progression과 생산/UI boundary 유지.
- `game-studio:game-ui-frontend`: 모바일 action surface와 playfield 보호.
- `game-studio:game-playtest`: Browser Use와 visual regression evidence.

## 수용 기준

- [x] 작업대 강화 완료 후 정원 action surface에 `온실 설비` 목표가 등장한다.
- [x] 설비 목표는 재료/잎 등 현재 production loop 자원과 연결된다.
- [x] 설비 해금 또는 준비 상태가 save에 남고 reload 후 유지된다.
- [x] 모바일 393px과 짧은 viewport에서 body scroll, bottom tab overlap, visible child overflow가 없다.
- [x] Browser Use `iab`, focused visual, full visual, CI가 통과한다.

## 검증 계획

- Browser Use `iab`: 작업대 강화 완료 -> 온실 설비 목표 화면 확인. Evidence: `reports/visual/p0-greenhouse-facility-unlock-browser-use-20260430.png`
- `npm run check:visual -- --grep "온실 설비"` PASS
- `npm run check:visual` PASS, 34 passed
- `npm run check:ci` PASS
- PR #201 checks PASS
- Main CI `25150219782` PASS

## 안전 범위

- 신규 asset 생성 없음.
- runtime image generation 없음.
- 실제 결제, 광고, 외부 배포, credential, 고객 데이터 없음.

## 남은 위험

- 없음. PR #201 checks와 main CI `25150219782`가 통과했다.
