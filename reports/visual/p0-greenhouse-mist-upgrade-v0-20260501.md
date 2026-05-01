# P0 온실 물안개 강화 v0 visual QA

Date: 2026-05-01
Issue: #232
Branch: `codex/0120-greenhouse-mist-upgrade-v0`
Route: `game-studio:game-playtest`

## Scope

`온실 물길 점검` 주문 보상이 `온실 물안개` 강화로 이어지고, 강화 완료 뒤 오프라인 복귀 보관 보너스가 `+30%`로 보이는지 확인했다.

## Browser Use evidence

- Browser Use `iab`: PASS
- Runtime: Node REPL `js` + `/Users/mirlim/.codex/plugins/cache/openai-bundled/browser-use/0.1.0-alpha1/scripts/browser-client.mjs`
- Flow: `보상 확인` -> `생산 잎 수령` -> `주문 납품 +135 잎 · +3 꽃가루 · +1 재료` -> `온실 물안개` 구매 -> `qaGreenhouseMist=1` 복귀 modal 확인
- Screenshot: `reports/visual/p0-greenhouse-mist-upgrade-browser-use-20260501.png`

## Evidence

- Browser Use screenshot: `reports/visual/p0-greenhouse-mist-upgrade-browser-use-20260501.png`
- Playwright screenshot: `reports/visual/p0-greenhouse-mist-upgrade-v0-20260501.png`
- Focused visual: `npm run check:visual -- --grep "온실 물안개"` — PASS
- Fast loop: `npm run check:loop` — PASS
- Content: `npm run check:content` — PASS
- Build: `npm run build` — PASS

## Playtest observations

- First actionable screen: 모바일 393px 정원에서 생산 카드와 주문 CTA가 보인다.
- Main verbs: `생산 잎 수령` -> `주문 납품` -> `온실 물안개` 구매로 이어진다.
- HUD/readability: 재료/꽃가루가 1/3에서 0/0으로 줄고, 성장 선택이 `물안개 완료`와 `복귀 보관 +10% 가동`을 표시한다.
- Playfield obstruction: screenshot 기준 playfield, action surface, bottom tabs가 겹치지 않는다.
- Offline hook: 저장 상태를 60분 복귀로 돌린 뒤 복귀 modal에서 `보관 보상 +30%`를 확인했다.

## Layout invariants

- Body scroll 없음.
- `.starter-panel` scrollHeight가 clientHeight를 넘지 않음.
- production card와 `온실 물안개` card가 bottom tabs 위에 있음.
- visible child overflow 없음.

## Remaining risk

Browser Use screenshot은 현재 in-app browser viewport 기준이고, 393px 모바일 layout invariant는 Playwright visual gate가 별도로 검증한다.
