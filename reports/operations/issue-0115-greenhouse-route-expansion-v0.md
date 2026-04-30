# [P0.5] 온실 동선 확장으로 3번 밭 열기

## 요약

`온실 확장 준비` 주문 보상 `재료 2`를 `온실 동선 확장`에 쓰게 만들고, 구매 후 3번 밭을 열어 주문 보상이 실제 재배 용량 증가로 이어지게 한다.

## Small win

확장 주문 납품 보상이 다음 성장 선택으로 돌아와, 플레이어가 더 넓어진 온실을 실제 밭 슬롯으로 확인한다.

## 사용자/운영자 가치

플레이어는 온실 주문/강화 루프가 숫자 보상이 아니라 정원 용량 증가로 이어지는 장면을 본다. 운영 가치는 #203-#217 온실 vertical slice를 주문 보상 -> 시설 확장 -> 재배 용량 증가까지 연결한다는 점이다.

## Reference teardown

- `docs/NORTH_STAR.md`: 다음 해금 목표와 생산/업그레이드 선택이 항상 보여야 한다.
- `docs/IDLE_CORE_CREATIVE_GUIDE.md`: order 보상은 다음 시설/생산 목표로 이어져야 한다.
- `docs/PROJECT_COMMANDS.md`: safe/small이 아니라 vertical slice 기준으로 issue를 선택한다.

## Game Studio route

- `game-studio:game-studio`: 온실 확장 주문 보상 -> 온실 동선 확장 -> 3번 밭 개방 vertical slice.
- `game-studio:web-game-foundations`: save progression과 `plotCount` 확장.
- `game-studio:game-ui-frontend`: 모바일 playfield/action surface 밀도 보호.
- `game-studio:game-playtest`: Browser Use와 visual regression evidence.

## 수용 기준

- [x] `온실 확장 준비` 납품 완료 뒤 `온실 동선` 성장 선택이 보인다.
- [x] `재료 2`로 구매하면 save의 `greenhouseRouteLevel`이 1, `plotCount`가 3이 된다.
- [x] 구매 후 playfield에서 3번 밭이 `빈 자리`로 열려 보인다.
- [x] 모바일 393px에서 playfield, action surface, bottom tabs가 서로 가리지 않는다.
- [x] Browser Use `iab`, focused visual, full visual, CI가 통과한다.

## 검증 계획

- Browser Use `iab`: 확장 주문 완료 상태에서 `온실 동선` 구매 후 3번 밭 확인.
- `npm run check:visual -- --grep "온실 동선 확장"`
- `npm run check:visual`
- `npm run check:ci`

## 현재 증거

- Browser Use `iab`: PASS, `reports/visual/p0-greenhouse-route-expansion-browser-use-20260430.png`
- Visual report: `reports/visual/p0-greenhouse-route-expansion-v0-20260430.md`
- Focused visual: `npm run check:visual -- --grep "온실 동선 확장"` PASS
- Regression focused visual: `npm run check:visual -- --grep "온실 확장 준비|온실 동선 확장"` PASS
- Full visual: `npm run check:visual` PASS, 40 passed
- CI: `npm run check:ci` PASS
- PR: #219 merged
- PR checks: #219 PASS (`Check automerge eligibility`, `Verify game baseline`)
- Main CI: `25157053868` PASS

## 안전 범위

- 신규 asset 생성 없음.
- runtime image generation 없음.
- 실제 결제, 광고, 외부 배포, credential, 고객 데이터 없음.

## 남은 위험

- Browser Use에서 발견한 3번 밭 부분 가림은 3열 compact layout과 visual regression으로 고정했다.
- 남은 follow-up blocker 없음.
