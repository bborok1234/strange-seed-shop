# #282 달방울 누누 돌보기 기억 보상 Playtest

## Game Studio route

- `game-studio:game-studio`
- `game-studio:game-ui-frontend`
- `game-studio:game-playtest`
- `browser-use:browser` 우선 시도, current-session blocker 후 Playwright fallback

## First actionable screen

- URL: `/?qaLunarOrderReady=1&qaReset=1`
- viewport: 393x852
- 첫 화면에서 `대표 생명체 무대`가 달방울 누누를 보여주고, primary verb `돌보기`가 보인다.

## Main verbs

1. `돌보기` 클릭
2. stage 안에 `달빛 돌보기 기억 보상`이 나타나고 `누누 돌봄 도장`, `+18 잎 기억 보상`이 보인다.
3. localStorage save에 `claimedCareMemoryIds: ["care_lunar_nunu_001"]`가 남고 leaves가 244 → 262로 증가한다.
4. `도감 기록 보기`를 누르면 도감 memory photo로 이동한다.
5. 도감 상단 photo에 `album-care-stamp`와 `도감 돌봄 기억 도장`이 reward grid보다 먼저 보인다.
6. 다시 `도감 기록 보기`를 눌러도 leaves가 중복 증가하지 않는다.

## HUD/playfield obstruction

- reward motion은 `.creature-stage-focus` 안에서 absolute HUD affordance로 뜨며 `.starter-panel`과 bottom tab을 밀지 않는다.
- focused visual test가 body scroll 없음, reward bottom <= stage focus bottom, action panel bottom <= bottom tab top - 4를 검증한다.

## Evidence

- Browser Use blocker: `reports/visual/browser-use-blocker-0282-20260503.md`
- Stage reward screenshot: `reports/visual/lunar-care-memory-reward-20260503.png`
- Album stamp screenshot: `reports/visual/lunar-care-album-stamp-20260503.png`

## Findings

- S1 없음.
- S2 없음.
- S3 Browser Use `iab` hands-on path는 Node REPL `js` tool 미노출로 막혀 Playwright fallback을 사용했다.
