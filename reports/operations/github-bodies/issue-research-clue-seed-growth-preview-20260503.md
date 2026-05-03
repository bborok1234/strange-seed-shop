## 요약

P0.5 Idle Core + Creative Rescue 다음 WorkUnit이다. #306이 연구 단서 목표 씨앗 구매/심기를 playfield payoff로 연결했으므로, 이제 심은 목표 씨앗이 성장 중일 때 `연구 단서 추적` 상태와 수확 예고가 정원 첫 화면에서 읽히게 만든다.

## Small win

플레이어가 연구 단서 씨앗을 심은 뒤 밭을 보면 “그냥 성장 중”이 아니라 “이 씨앗을 수확하면 다음 생명체 단서가 풀린다”를 즉시 이해한다.

## 사용자/운영자 가치

- 사용자: 연구 단서 → 씨앗 심기 → 성장/수확 기대가 한 장면에서 이어져 “하나만 더 키워볼까?”가 강화된다.
- 운영자: queue-empty 이후에도 P0.5 campaign chain을 다음 player verb와 visual evidence로 계속 전진시킨다.

## Before / After 또는 Visual evidence

- Before: 연구 단서 씨앗은 심기 payoff가 생겼지만, 성장 중 상태가 일반 씨앗 성장과 충분히 구분되지 않는다.
- After: 연구 단서 source plot, next creature card, action surface에 `연구 단서 추적`/`수확 예고` HUD affordance와 reward motion이 보인다.
- Visual evidence target: `reports/visual/issue-308-research-clue-seed-growth-preview-393.png` 및 Browser Use evidence/blocker.

## Playable mode

- `npm run dev -- --host 127.0.0.1 --port 3000`
- QA state는 #306 focused flow 또는 최소 QA helper를 사용한다.

## 검증

- `npm run build`
- focused Playwright: 연구 단서 씨앗 성장/수확 예고
- `npm run check:visual`
- `npm run check:ci`
- `npm run update:dashboard`
- `npm run operator:control-room -- --output docs/OPERATOR_CONTROL_ROOM.md`
- `npm run check:dashboard`
- `npm run check:control-room`
- `npm run check:ops-live`
- `npm run check:github-metadata`
- `npm run check:seed-ops-queue`
- `npm run check:closed-workunit-mirrors`

## 안전 범위

- runtime image generation/API 호출 금지.
- 신규 accepted manifest asset 없음. DOM/CSS HUD affordance, playfield state, reward motion으로 제한한다.
- real payment, customer data, external production deployment 없음.

## 남은 위험

- 성장 중 카드가 이미 밀도가 높아 393px에서 next creature card와 겹칠 수 있다.
- Browser Use iab가 현재 세션에서 계속 미발견될 수 있다. 이 경우 issue 전용 blocker를 새로 남긴다.

## 연결된 issue

- GitHub issue: #308 https://github.com/bborok1234/strange-seed-shop/issues/308
- Follows #306
- Campaign: P0.5 Idle Core + Creative Rescue
