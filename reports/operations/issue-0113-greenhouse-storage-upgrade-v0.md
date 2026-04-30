# [P0.5] 온실 선반 정리 강화로 보관 보너스 키우기

## 요약

온실 선반 납품 보상으로 받은 `재료 1`을 `선반 정리` 강화에 쓰게 만들고, 강화 후 오프라인 보관 보너스를 +10%에서 +20%로 올린다.

## Small win

온실 선반 납품 보상이 다음 온실 성장 선택으로 다시 돌아오며, 다음 복귀 보상이 더 커진다.

## 사용자/운영자 가치

플레이어는 시설 납품 보상 재료를 다시 시설 강화에 쓰는 idle tycoon식 성장 루프를 경험한다. 운영 가치는 #203-#209 온실 vertical slice를 재료 소비와 복귀 보상 성장까지 이어간다는 점이다.

## Game Studio route

- `game-studio:game-studio`: 선반 납품 보상 재료 -> 선반 정리 강화 -> 다음 복귀 보너스 성장 vertical slice.
- `game-studio:web-game-foundations`: `greenhouseStorageLevel` save progression 추가.
- `game-studio:game-ui-frontend`: 모바일 upgrade choice/action surface 밀도 보호.
- `game-studio:game-playtest`: Browser Use와 visual regression evidence.

## 수용 기준

- [x] 온실 선반 납품 완료 뒤 `선반 정리` 성장 선택이 보이고 재료 1개로 강화할 수 있다.
- [x] 강화 후 save의 `greenhouseStorageLevel`이 1이 되고 playfield에 `선반 보관 +20%`가 보인다.
- [x] `qaGreenhouseStorage=1` 60분 복귀 경로에서 보관 보상 +20%와 105 잎 보상이 보인다.
- [x] 모바일 393px에서 playfield, action surface, bottom tabs가 서로 가리지 않는다.
- [x] Browser Use `iab`, focused visual, full visual, CI가 통과한다.

## 검증 계획

- Browser Use `iab`: `/?qaOfflineMinutes=60&qaLunarGuardian=1&qaGreenhouseShelf=1&qaReset=1`에서 `보상 확인` 후 `선반 정리` 클릭, playfield +20% 확인.
- `npm run check:visual -- --grep "선반 정리 강화"`
- `npm run check:visual`
- `npm run check:ci`

## 현재 증거

- Browser Use `iab`: PASS, `reports/visual/p0-greenhouse-storage-upgrade-browser-use-20260430.png`
- Visual report: `reports/visual/p0-greenhouse-storage-upgrade-v0-20260430.md`
- Focused visual: `npm run check:visual -- --grep "선반 정리 강화"` PASS
- Regression fix visual: `npm run check:visual -- --grep "온실 설비는 새 납품 주문"` PASS
- Full visual: `npm run check:visual` PASS, 38 passed
- CI: `npm run check:ci` PASS

## 안전 범위

- 신규 asset 생성 없음.
- runtime image generation 없음.
- 실제 결제, 광고, 외부 배포, credential, 고객 데이터 없음.

## 남은 위험

- PR checks에서 같은 visual/CI gate를 재확인해야 한다.
