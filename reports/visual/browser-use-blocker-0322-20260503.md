# Browser Use blocker — #322 새 기록 후속 저장 다음 목표 재순환

- 일시: 2026-05-03
- WorkUnit: #322 `새 기록 후속 수확 도감 저장을 다음 씨앗 목표 재순환으로 이어지게 만든다`
- Game Studio route: `game-studio:game-studio` → `game-studio:game-ui-frontend` → `game-studio:game-playtest`
- 대상: 모바일 393×852, `/?qaResearchComplete=1&qaTab=seeds`

## 시도

Codex Browser Use 플러그인의 in-app browser(`iab`) 백엔드를 사용하기 위해 `browser-client.mjs`를 Node REPL에서 bootstrap하고 `agent.browser.nameSession("🔎 #322 새 기록 후속 저장 다음 목표 QA")`를 시도했다.

## 결과

실패 메시지:

```text
Failed to connect to browser-use backend "iab". No Codex IAB backends were discovered. Discovery diagnostics: listedPipes=0, candidates=2, browsers=0, iabBrowsers=0, failures=["legacy-iab/connect/Error","legacy-chrome/connect/Error"], pipeListingError=none.
```

## 현재 세션 blocker 판단

- `iab` backend discovery가 0개로 반환되어 현재 세션에서 Browser Use hands-on QA를 진행할 수 없다.
- 과거 blocker를 재사용하지 않고 #322 작업 중 현재 세션 재시도 결과를 별도 evidence로 남긴다.

## Fallback 검증 계획

Browser Use hands-on QA를 대체했다고 주장하지 않고, 반복 회귀 게이트로 다음을 수행한다.

- `npm run build`
- `npx playwright test --config playwright.config.ts --grep "새 기록 후속 저장|다음 목표 재순환|다음 기록"`
- `npm run check:visual`
- `npm run check:ci`

Playwright screenshot은 `reports/visual/issue-322-album-record-followup-next-goal-loop-393.png`로 보존한다.
