# [P0.5] 온실 확장 준비 주문으로 선반 정리 이후 루프 열기

## 요약

`선반 정리` 완료 후 production lane이 완료 상태에 머물지 않게 `온실 확장 준비` 주문을 열고, 납품 보상으로 다음 온실 재료를 확보하게 만든다.

## Small win

선반 정리 +20% 강화가 다음 온실 주문으로 이어져, 온실 vertical slice가 다시 생산/납품 루프로 돌아간다.

## 사용자/운영자 가치

플레이어는 강화가 끝이 아니라 다음 온실 확장 목표의 시작임을 본다. 운영 가치는 작은 UI polish가 아니라 #203-#214 온실 production loop를 다음 반복 주문으로 확장한다는 점이다.

## Reference teardown

- `docs/NORTH_STAR.md`: production bar는 다음 해금 목표가 계속 보여야 한다.
- `docs/IDLE_CORE_CREATIVE_GUIDE.md`: order/commission v0는 납품 progress와 다음 보상 연결을 요구한다.
- `docs/PROJECT_COMMANDS.md`: safe/local/small은 선택 기준이 아니며 vertical slice가 우선이다.

## Game Studio route

- `game-studio:game-studio`: 선반 정리 완료 -> 새 온실 확장 주문 -> 다음 시설 재료 확보 vertical slice.
- `game-studio:web-game-foundations`: order definition/state progression 확장.
- `game-studio:game-ui-frontend`: 모바일 action surface 밀도 보호.
- `game-studio:game-playtest`: Browser Use와 visual regression evidence.

## 수용 기준

- [x] `greenhouseStorageLevel=1` save에서 현재 주문이 `온실 확장 준비`로 전환된다.
- [x] 새 주문은 `60 잎` 요구량과 `+70 잎 · +3 꽃가루 · +2 재료` 보상을 보여준다.
- [x] 생산 수령 후 주문 납품이 가능하고, 납품 뒤 save에 재료 보상이 반영된다.
- [x] 모바일 393px에서 playfield, action surface, bottom tabs가 서로 가리지 않는다.
- [x] Browser Use `iab`, focused visual, full visual, CI가 통과한다.

## 검증 계획

- Browser Use `iab`: `/?qaOfflineMinutes=60&qaLunarGuardian=1&qaGreenhouseShelf=1&qaGreenhouseStorage=1&qaReset=1`에서 새 확장 주문 확인.
- `npm run check:visual -- --grep "온실 확장 준비"`
- `npm run check:visual`
- `npm run check:ci`

## 현재 증거

- Browser Use `iab`: PASS, `reports/visual/p0-greenhouse-expansion-order-browser-use-20260430.png`
- Visual report: `reports/visual/p0-greenhouse-expansion-order-v0-20260430.md`
- Focused visual: `npm run check:visual -- --grep "온실 확장 준비"` PASS
- Full visual: `npm run check:visual` PASS, 39 passed
- CI: `npm run check:ci` PASS
- PR: #216 merged
- PR checks: #216 PASS (`Check automerge eligibility`, `Verify game baseline`)
- Main CI: `25155573462` PASS

## 안전 범위

- 신규 asset 생성 없음.
- runtime image generation 없음.
- 실제 결제, 광고, 외부 배포, credential, 고객 데이터 없음.

## 남은 위험

- 현재 남은 known blocker 없음. 다음 작업은 별도 vertical slice로 plan-first 선택한다.
