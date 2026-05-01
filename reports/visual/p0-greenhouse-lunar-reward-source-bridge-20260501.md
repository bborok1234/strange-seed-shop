# P0 Greenhouse lunar reward source bridge QA

Date: 2026-05-01
Issue: #251
Branch: `codex/0127-greenhouse-lunar-reward-source-bridge-v0`
Route: `game-studio:game-studio` -> `game-studio:game-ui-frontend`, `game-studio:game-playtest`, `game-studio:web-game-foundations`

## Scope

`물안개 응축 납품`에서 온 `달빛 온실 단서`가 `달빛 온실 조사` 보상 수령 뒤에도 사라지지 않고 `달방울 씨앗` / `달방울 누누` 수집 목표로 이어지는지 확인했다.

## Browser Use iab evidence

URL: `http://127.0.0.1:5173/?qaGreenhouseLunarClaimReady=1&qaTab=expedition&qaReset=1`

- Claim screenshot: `reports/visual/p0-greenhouse-lunar-reward-source-bridge-browser-use-claim-20260501.png`
- Seeds screenshot: `reports/visual/p0-greenhouse-lunar-reward-source-bridge-browser-use-seeds-20260501.png`
- Album screenshot: `reports/visual/p0-greenhouse-lunar-reward-source-bridge-browser-use-album-20260501.png`

확인 결과:

- `원정 보상 받기` 후 reward card가 `달빛 온실 조사 보상`, `응축기에서 회수한 온실 단서`, `달방울 씨앗`, `달방울 누누`를 함께 표시했다.
- `달방울 씨앗 보러가기` CTA가 씨앗 탭으로 이동했고 `도감 목표 씨앗` card에 `온실 단서 source: 응축기에서 회수한 온실 단서`가 남았다.
- 도감 탭의 `도감 다음 수집 목표`도 `달방울 누누`와 같은 source를 유지했다.
- 하단 탭과 보상/목표 card가 겹치지 않았고, 모바일 reward surface가 첫 화면 안에서 읽혔다.

## Automated evidence

- `npm run check:visual -- --grep "달빛 온실 조사 보상"`: 1 passed.
- `npm run check:ci`: passed.
