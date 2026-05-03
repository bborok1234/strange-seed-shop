# Browser Use blocker — #314 새 기록 다음 씨앗 CTA

- 일시: 2026-05-03
- WorkUnit: #314 `도감 새 기록 다음 씨앗 목표 CTA가 구매/심기 준비로 이어지게 만든다`
- Game Studio route: `game-studio:game-studio` → `game-studio:game-ui-frontend` → `game-studio:game-playtest`
- 대상: 모바일 393×852, `/?qaResearchComplete=1&qaTab=seeds`

## 시도

Codex Browser Use 플러그인의 in-app browser(`iab`) 백엔드로 현재 세션 hands-on QA를 먼저 시도했다.

## 결과

실패 메시지:

```text
Failed to connect to browser-use backend "iab". No Codex IAB backends were discovered. Discovery diagnostics: listedPipes=0, candidates=2, browsers=0, iabBrowsers=0, failures=["legacy-iab/connect/Error","legacy-chrome/connect/Error"], pipeListingError=none.
```

## 현재 세션 blocker 판단

- `iab` backend discovery가 0개로 반환되어 현재 세션에서 Browser Use hands-on QA를 진행할 수 없다.
- 과거 blocker가 아니라 #314 작업 중 동일 세션에서 재시도한 결과를 별도 evidence로 남긴다.

## Fallback 검증

Browser Use hands-on QA를 대체했다고 주장하지 않고, 반복 회귀 게이트로 다음을 수행한다.

- `npm run build`
- `npx playwright test --config playwright.config.ts --grep "새 단서 기록 다음 씨앗|도감 기록 다음 씨앗"`
- `npx playwright test --config playwright.config.ts --grep "연구 단서 씨앗|연구 단서 성장|연구 단서 수확|단서 생명체|연구 단서 도감|새 단서 기록|새 단서 기록 다음 씨앗|도감 기록 다음 씨앗"`
- `npm run check:visual`
- `npm run check:ci`

Playwright screenshot은 `reports/visual/issue-314-album-record-next-seed-cta-393.png`로 보존한다.
