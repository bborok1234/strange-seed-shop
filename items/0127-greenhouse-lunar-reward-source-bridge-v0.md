# Greenhouse lunar reward source bridge v0

Status: review
Owner: agent
Issue: #251
Branch: `codex/0127-greenhouse-lunar-reward-source-bridge-v0`
Started: 2026-05-01

## 문제 / 배경

`물안개 응축 납품`은 `달빛 온실 단서 +1`을 남기고, 이전 작업은 그 단서를 `달빛 온실 조사` 원정 시작으로 소비하게 만들었다. 하지만 원정이 완료되어 보상을 수령하는 순간에는 기존 `moon_hint` 보상 흐름과 합쳐지면서 온실/응축기 source가 사라진다. 플레이어 입장에서는 “온실 단서로 보낸 조사”가 “달방울 씨앗과 달방울 누누 수집 루프”로 돌아왔다는 연결이 약하다.

## Game Studio route

- Umbrella: `game-studio:game-studio` — 2D browser idle collection game의 core loop/progression/UI/QA가 함께 걸린 vertical slice다.
- Specialist route: `game-studio:game-ui-frontend`, `game-studio:game-playtest`, `game-studio:web-game-foundations`.
- 북극성/플레이어 동사: 플레이어가 `원정 보상 받기`를 누른 뒤, 응축기에서 온 달빛 단서가 `달방울 씨앗` 구매/심기/수확 목표로 이어진다고 이해한다.
- Playfield 보호 또는 UI surface 원칙: expedition tab 안의 reward card와 seed/album affordance로 처리하고 garden playfield persistent HUD는 늘리지 않는다.
- Playtest evidence 계획: Browser Use `iab`로 `qaGreenhouseLunarClaimReady=1&qaTab=expedition` 보상 수령을 확인하고, `npm run check:visual -- --grep "달빛 온실 조사 보상"`으로 모바일 회귀를 고정한다.

## Issue selection gate

- `player verb`: 원정 완료 후 보상을 수령하고 달방울 씨앗으로 이동한다.
- `production/progression role`: 온실 물안개/응축기 production chain이 연구/원정 장기 메타와 lunar collection progression으로 돌아온다.
- `screen moment`: 복귀 후 30초 안에 expedition tab에서 `원정 보상 받기`를 누른 직후 reward card가 온실 source와 다음 수집 목표를 보여준다.
- `asset/FX`: 새 bitmap asset 없이 `reward motion` card state, `HUD affordance`, `seed/album source badge`로 concrete visual/game-feel payoff를 만든다. 기존 asset 재사용만으로 끝내지 않고 source badge와 reward card variant를 추가한다.
- `playtest evidence`: Browser Use screenshot, focused Playwright visual test, save-state assertion.
- 경쟁작 production gap: idle 경쟁작은 긴 생산/원정 chain의 보상 source와 다음 unlock을 보상 화면에서 분명히 연결한다. 현재는 source가 claim 뒤 사라져 chain payoff가 약하다.

## Plan

1. save schema에 `activeExpedition.source`와 `lunarRewardSource`를 추가하고 normalize 기본값을 보존한다.
2. `달빛 온실 조사 시작` 경로에서 `moon_hint` active expedition source를 `greenhouse_mist`로 저장한다.
3. `claimExpedition`에서 greenhouse source를 보상 수령 후에도 저장하고, reward card/seed goal/album goal에 `응축기에서 회수한 온실 단서` source badge를 노출한다.
4. `qaGreenhouseLunarClaimReady=1` deterministic save를 추가한다.
5. Playwright visual test를 추가해 claim 전/후 source, seed unlock, next goal, layout invariants를 검증한다.
6. Browser Use `iab`로 실제 화면 evidence를 저장하고 report를 남긴다.
7. roadmap/dashboard/control room/heartbeat/GitHub metadata를 갱신한다.

## 수용 기준

- [x] `달빛 온실 조사` 시작 save가 `activeExpedition.source = "greenhouse_mist"`를 저장한다.
- [x] greenhouse source 원정 보상 수령 후 `seed_lunar_001`이 해금되고 `lunarRewardSource = "greenhouse_mist"`가 남는다.
- [x] expedition reward card가 `응축기에서 회수한 온실 단서`와 `달방울 씨앗` / `달방울 누누` 다음 목표를 함께 보여준다.
- [x] seeds/album 목표 surface도 온실 단서 source를 잃지 않는다.
- [x] 모바일 expedition panel이 bottom tab과 겹치지 않고 body scroll을 만들지 않는다.
- [x] Browser Use `iab`, `npm run check:visual -- --grep "달빛 온실 조사 보상"`, `npm run check:ci`가 통과한다.

## Evidence

- Browser Use `iab`: `reports/visual/p0-greenhouse-lunar-reward-source-bridge-browser-use-claim-20260501.png`, `reports/visual/p0-greenhouse-lunar-reward-source-bridge-browser-use-seeds-20260501.png`, `reports/visual/p0-greenhouse-lunar-reward-source-bridge-browser-use-album-20260501.png`
- Visual report: `reports/visual/p0-greenhouse-lunar-reward-source-bridge-20260501.md`
- `npm run check:visual -- --grep "달빛 온실 조사 보상"`: 1 passed
- `npm run check:ci`: passed

## 검증 명령

- `npm run check:visual -- --grep "달빛 온실 조사 보상"`
- `npm run check:ci`

## 건드리지 않을 범위

- 신규 bitmap asset 생성.
- 실제 결제, 광고, 로그인, 외부 배포, 고객 데이터.
- 기존 `moon_hint` 연구 원정 보상 수치 변경.
