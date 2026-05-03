## 요약

P0.5 Idle Core + Creative Rescue 다음 WorkUnit이다. #306이 연구 단서 목표 씨앗 구매/심기를 playfield payoff로 연결했으므로, #308은 심은 목표 씨앗이 성장 중일 때 `연구 단서 추적` 상태와 수확 예고가 정원 첫 화면에서 읽히게 만든다.

## Small win

플레이어가 연구 단서 씨앗을 심은 뒤 밭을 보면 “그냥 성장 중”이 아니라 “이 씨앗을 수확하면 다음 생명체 단서가 풀린다”를 즉시 이해한다.

## 사용자/운영자 가치

- 사용자: 연구 단서 → 씨앗 심기 → 성장/수확 기대가 한 장면에서 이어져 “하나만 더 키워볼까?”가 강화된다.
- 운영자: queue-empty 이후에도 P0.5 campaign chain을 다음 player verb와 visual evidence로 계속 전진시킨다.

## Before / After 또는 Visual evidence

- Before: 연구 단서 씨앗은 심기 payoff가 생겼지만, 성장 중 상태가 일반 씨앗 성장과 충분히 구분되지 않았다.
- After: 연구 단서 source plot과 next creature card에 `연구 단서`/`수확 예고` HUD affordance가 보이고, 다음 생명체 단서 추적 문구가 성장 중 기대를 유지한다.
- Browser Use blocker: `reports/visual/browser-use-blocker-0308-20260503.md` — 현재 세션 iab backend 미발견.
- Screenshot: `reports/visual/issue-308-research-clue-seed-growth-preview-393.png`.

## Playable mode

- `npm run dev -- --host 127.0.0.1 --port 3000`
- Stable main playable mirror: `npm run play:main`, then `cd ../strange-seed-shop-play && npm run dev -- --host 127.0.0.1 --port 5174`

## 검증

- [x] `npm run build` — pass
- [x] `npx playwright test --config playwright.config.ts --grep "연구 단서 씨앗|연구 단서 성장"` — 2 passed
- [x] `npm run check:visual` — 57 passed
- [x] `npm run check:ci` — pass
- [x] `npm run update:dashboard` — pass
- [x] `npm run operator:control-room -- --output docs/OPERATOR_CONTROL_ROOM.md` — pass
- [x] `npm run check:dashboard` / `npm run check:control-room` / `npm run check:ops-live` / `npm run check:github-metadata` / `npm run check:seed-ops-queue` / `npm run check:closed-workunit-mirrors` — pass

## 안전 범위

- runtime image generation/API 호출 금지.
- 신규 accepted manifest asset 없음. DOM/CSS HUD affordance, playfield state, reward motion으로 제한한다.
- real payment, customer data, external production deployment 없음.

## 남은 위험

- Browser Use iab는 현재 세션에서 backend discovery 실패로 blocked다. 다음 UI/visual WorkUnit에서 반드시 새로 재시도해야 한다.
- 신규 asset/FX가 필요한 더 강한 수확 예고는 별도 asset provenance WorkUnit으로 분리해야 한다.

## 연결된 issue

- GitHub issue: #308 https://github.com/bborok1234/strange-seed-shop/issues/308
- Follows #306
- Campaign: P0.5 Idle Core + Creative Rescue
