# #275 visual/playtest evidence — creature stage, care clue, album appreciation

Date: 2026-05-03
Issue: #275
Branch: codex/0275-creature-stage-care-album-production
Game Studio route: `game-studio:game-studio` → `game-studio:game-ui-frontend` / `game-studio:game-playtest`
Browser route: `browser-use:browser` attempted, current-session blocker recorded at `reports/visual/browser-use-blocker-0275-20260503.md`; fallback evidence collected with Playwright.

## 확인 URL / viewport / action

- Stage idle: `http://127.0.0.1:4173/?qaLunarOrderReady=1&qaReset=1`, viewport `393x852`.
- Care clue: same URL, click `돌보기` once.
- Album appreciation: `http://127.0.0.1:4173/?qaGreenhouseLunarClaimReady=1&qaTab=album&qaReset=1`, viewport `393x852`.
- Album clue focus: click `기록 넘기기`, then `단서 보기`.

## Screenshot evidence

- `reports/visual/creature-stage-production-20260503.png`
- `reports/visual/care-clue-production-20260503.png`
- `reports/visual/album-appreciation-production-20260503.png`
- `reports/visual/album-clue-focus-production-20260503.png`
- Metrics: `reports/visual/0275-production-visual-metrics-20260503.json`

## Findings by severity

### 통과 — first actionable screen

- 달방울 누누가 첫 정원 화면의 중앙 stage로 먼저 읽힌다.
- `돌보기` CTA가 하단 생산/주문 panel과 분리되어 보이고, 클릭 후 눈빛/반짝임/발자국 clue가 즉시 보인다.
- body scroll은 `852px` viewport 안에서 발생하지 않았고, 하단 tab은 panel을 가리지 않았다.

### 통과 — main verbs

- `돌보기` → `단서 따라가기` 흐름이 text/FX/footprint state로 바뀐다.
- 도감은 보상표보다 큰 `오늘의 표정 PHOTO`와 creature memory surface를 먼저 보여준다.
- `기록 넘기기`와 `단서 보기`로 memory variant와 clue polaroid를 확인할 수 있다.

### 통과 — HUD / playfield obstruction

- stage가 보이는 동안 기존 plot/order click 회귀가 전체 visual suite에서 통과했다.
- 달빛 주문 stage는 `check:visual` 52개 전체 회귀에서 greenhouse/order chain을 막지 않았다.
- #275 적용 후 `npm run check:visual` 결과: `52 passed (4.6m)`.

## 남은 위험

- Browser Use `iab` hands-on QA는 current session에서 Node REPL `js` tool 미노출로 막혀 Playwright fallback을 사용했다.
- stage는 달빛 resident가 발견된 상태에서만 켜지도록 범위를 좁혔다. 일반 연구/온실 QA 화면은 기존 action surface를 유지한다.
