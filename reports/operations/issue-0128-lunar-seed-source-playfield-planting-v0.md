## 문제 / 배경

`달빛 온실 조사` 보상 source는 `달방울 씨앗` / `달방울 누누` 목표까지 이어졌지만, 실제 구매/심기 순간은 아직 generic seed planting처럼 읽힌다. 온실 응축기 production chain의 payoff가 정원 playfield의 달빛 성장 state로 들어오는 화면 순간이 필요하다.

## 목표

온실 단서로 얻은 `달방울 씨앗`을 구매하고 심으면 garden playfield의 plot이 `응축기에서 회수한 온실 단서` source와 달빛 성장 state를 보여주게 만든다.

GitHub issue: #254

## Small win

- 이번 issue가 만들 가장 작은 승리: 달방울 씨앗을 심은 직후 밭에서 “온실 단서에서 싹튼 달빛 성장”이 보인다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:game-ui-frontend`, `game-studio:game-playtest`, `game-studio:web-game-foundations`
- 북극성/플레이어 동사: 플레이어가 온실 source 달방울 씨앗을 구매하고 정원 밭에 심는다.
- Playfield 보호 또는 UI surface 원칙: plot source state와 compact action surface를 추가하고 persistent HUD는 늘리지 않는다.
- Playtest evidence 계획: Browser Use `iab` + focused visual test + save-state assertion.

## Plan

- 구현 전 작성/검토할 plan artifact: `items/0128-lunar-seed-source-playfield-planting-v0.md`
- 예상 변경 단계:
  - lunar seed purchase/planting source persistence 추가.
  - gpt-image-2 API 우선 경로와 Codex native fallback provenance 추가.
  - generated raster seed icon + 4-frame FX strip manifest 연결.
  - garden plot source badge / glow / planting pulse 추가.
  - QA fixture와 mobile visual regression 추가.
  - Browser Use evidence, roadmap, dashboard, control room 갱신.
- 검증 계획:
  - Browser Use `iab`
  - `npm run check:asset-provenance`
  - `npm run check:asset-style`
  - `npm run check:asset-alpha`
  - `npm run check:content`
  - `npm run build`
  - `npm run check:visual -- --grep "신규 asset"`
  - `npm run check:visual -- --grep "fallback"`
  - `npm run check:ci`
- 건드리지 않을 범위:
  - SVG/vector/code-native game asset acceptance.
  - 달방울 보상 수치 변경.

## 플레이어 가치 또는 운영사 가치

- 게임 가치: 긴 온실 production chain의 보상이 실제 정원 playfield 성장 상태로 변해 collection payoff가 강해진다.
- 운영사 가치: source bridge가 reward card에서 끝나지 않고 playfield state까지 닫히는 vertical slice를 이어간다.

## 수용 기준

- [x] 온실 source로 열린 `달방울 씨앗` 구매/심기 flow가 source를 잃지 않는다.
- [x] 정원 playfield의 심긴 달방울 plot이 `응축기에서 회수한 온실 단서` source state를 보여준다.
- [x] 심기 직후 player action surface가 달빛 성장 다음 행동을 안내한다.
- [x] 모바일 garden panel이 bottom tab과 겹치지 않고 body scroll을 만들지 않는다.
- [x] Browser Use와 focused visual/asset/content/build/`check:ci` 검증이 통과한다.

## Visual evidence 계획

- Before screenshot: `reports/visual/p0-greenhouse-lunar-reward-source-bridge-20260501.md`
- After screenshot: `reports/visual/p0-lunar-seed-source-playfield-planting-20260501.md`
- Browser Use 우선 QA 계획 또는 N/A 사유: Browser Use `iab`로 purchase/planting/playfield source state를 직접 확인한다.
- N/A 사유: 해당 없음.

## Playable mode 영향

- [x] 사람이 `npm run play:main`으로 main 게임을 계속 실행할 수 있다.
- 변경 확인 URL/port: local dev server, `http://127.0.0.1:5174/?qaGreenhouseLunarSeedPlantReady=1&qaTab=seeds&qaReset=1&qaFxTelemetry=1`

## 안전 범위

- 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음.
- Branch protection 우회 없음.

## 검증 명령

- 기본 CI gate: `npm run check:ci`
- UI/visual 변경: Browser Use QA + `npm run check:visual -- --grep "온실 단서 달방울"` + `npm run check:visual -- --grep "신규 asset"` + `npm run check:visual -- --grep "fallback"`


## 진행 결과

- `gpt-image-2` API는 `.env`의 `OPENAI_API_KEY`를 읽고 OpenAI까지 도달했지만 organization verification propagation blocker가 계속 반환되어 Codex native image generation fallback을 사용했다.
- fallback 산출물은 SVG가 아니라 raster PNG이며, seed icon은 alpha cutout을 적용했고 FX는 strict 4-frame strip으로 정규화했다.
- Browser Use `iab`에서 `qaGreenhouseLunarSeedPlantReady=1&qaTab=seeds&qaReset=1&qaFxTelemetry=1` 흐름을 직접 확인했다.
- 사용자 screenshot에서 지적된 정적 FX strip 오염 회귀를 수정했다. DOM `.playfield-plot-source-fx` 렌더는 제거했고, 첫 탭의 `tap_growth` 이벤트에서 Phaser spritesheet FX telemetry가 기록된다.
- `npm run check:ci` 통과.
- evidence: `reports/visual/p0-lunar-seed-source-playfield-planting-20260501.md`
