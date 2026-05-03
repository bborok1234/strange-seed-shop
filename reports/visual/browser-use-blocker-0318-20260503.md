# Browser Use blocker — #318 새 기록 후속 성장 수확 예고

- 일시: 2026-05-03
- WorkUnit: #318 `새 기록 후속 재배 성장 중 다음 생명체 수확 예고를 보이게 만든다`
- Game Studio route: `game-studio:game-studio` → `game-studio:game-ui-frontend` → `game-studio:game-playtest` → 필요 시 `game-studio:phaser-2d-game`
- 대상: 모바일 393×852, `/?qaResearchComplete=1&qaTab=seeds`

## 시도

Codex Browser Use 플러그인의 in-app browser(`iab`) 백엔드를 사용하기 위해 `browser-client.mjs`를 Node REPL에서 bootstrap하고 `agent.browser.nameSession("🔎 #318 새 기록 후속 성장 QA")` 및 새 tab 생성을 시도했다.

## 결과

실패 메시지:

```text
Failed to connect to browser-use backend "iab". No Codex IAB backends were discovered. Discovery diagnostics: listedPipes=0, candidates=2, browsers=0, iabBrowsers=0, failures=["legacy-iab/connect/Error","legacy-chrome/connect/Error"], pipeListingError=none.
```

## 현재 세션 blocker 판단

- `iab` backend discovery가 0개로 반환되어 현재 세션에서 Browser Use hands-on QA를 진행할 수 없다.
- 과거 blocker를 재사용하지 않고 #318 작업 중 현재 세션 재시도 결과를 별도 evidence로 남긴다.

## Fallback 검증

Browser Use hands-on QA를 대체했다고 주장하지 않고, 반복 회귀 게이트로 다음을 수행한다.

- `npm run build`
- `npx playwright test --config playwright.config.ts --grep "새 기록 후속 성장|후속 재배 성장|수확 예고"`
- `npm run check:visual`
- `npm run check:ci`

Playwright screenshot은 `reports/visual/issue-318-album-record-followup-growth-preview-393.png`로 보존한다.
