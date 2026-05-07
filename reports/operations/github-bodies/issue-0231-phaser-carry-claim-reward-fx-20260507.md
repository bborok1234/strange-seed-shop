## 요약

신규 Phaser vertical slice Stage 3으로 수확/수령 보상 순간을 구현한다. 캐릭터가 보상을 나르고, 상자가 채워지고, reward FX가 밭/actor에서 HUD나 crate로 이동하는 장면을 만든다.

## Small win

수치와 카드 receipt만 바뀌는 보상을, actor state + crate state + reward FX가 함께 변하는 게임 장면으로 바꾼다.

## 사용자/운영자 가치

- 사용자: 생명체가 정원을 관리한 결과를 직접 만들어냈다는 감각을 얻는다.
- 운영자: Studio가 state machine, sprite/FX, reward path, Browser Use sequence QA를 하나의 production slice로 닫는다.

## Before / After 또는 Visual evidence

- Before: 보상 수령은 주로 숫자/카드 변화로 읽힘.
- After 목표: 수확/claim 순간에 actor, crate, reward FX가 함께 변함.

## Playable mode

- Depends on Stage 1
- Recommended after Stage 2
- Browser Use `iab`: ready -> harvest/claim -> reward complete sequence

## 검증

- 신규 app build script
- Browser Use `iab` 연속 캡처
- focused visual regression: actor state, crate state, reward FX bounds
- asset provenance/style/normalization checks when assets are registered

## 안전 범위

- 장기 주문/economy/offline migration 제외
- 기존 앱 production card 수령 UI 수정 제외
- 실결제, 로그인, 외부 배포 금지

## 남은 위험

FX를 많이 넣으면 산만해질 수 있다. strong motion은 harvest/claim 순간으로 제한한다.

## 연결된 문서

- GitHub issue: https://github.com/bborok1234/strange-seed-shop/issues/432
- `docs/PHASER_GREENFIELD_VERTICAL_SLICE_SPEC.md`
- `items/0231-phaser-carry-claim-reward-fx.md`
