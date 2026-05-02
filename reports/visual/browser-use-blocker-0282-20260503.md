# Browser Use blocker — #282 lunar care memory reward

## 목적

#282 `정원에서 달방울 누누를 돌보면 도감 기억 보상이 움직인다`의 Browser Use `iab` visual/playtest evidence를 수집하려 했다.

## 현재 세션 시도

- `browser-use:browser` skill 지침을 확인했다.
- `tool_search`로 `Node REPL js JavaScript execution Browser Use iab`를 검색했다.
- `tool_search`로 `mcp__node_repl__js JavaScript node repl execute`를 검색했다.
- 검색 결과는 GitHub/Computer Use 도구만 노출했고, Node REPL `js` execution tool은 현재 세션 도구 표면에 노출되지 않았다.

## 판정

Browser Use `iab` hands-on QA는 현재 세션에서 막혔다. 과거 blocker를 재사용하지 않고 #282 기준 blocker를 새로 기록한다.

## Fallback evidence

Playwright visual regression과 screenshot fallback을 사용한다.

- `reports/visual/lunar-care-memory-reward-20260503.png`
- `reports/visual/lunar-care-album-stamp-20260503.png`
- focused gate: `npm run check:visual -- --grep "돌보기|기억 도장|care reward"` → 1 passed
- adjacent gate: `npm run check:visual -- --grep "creature stage|도감은 보상표|달빛 보호 주문|돌보기|기억 도장|care reward"` → 4 passed
