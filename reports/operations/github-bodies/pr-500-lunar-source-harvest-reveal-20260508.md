# 초승달순 source harvest reveal bridge

## 요약

`seed_lunar_002`가 planted state에서 멈추지 않도록 source 전용 care -> ready -> `초승달순 수확` -> `은빛이끼 루미` reveal로 연결했습니다. accepted `creature_lunar_uncommon_001` raster와 `fx_lunar_harvest_moonburst_001` FX binding을 Phaser runtime에 추가하고, mobile 393 checker가 source harvest/reveal까지 검증합니다.

## Small win

- 이번 PR이 만든 가장 작은 승리: 원정 보상으로 심은 초승달순 씨앗을 수확해 달방울 생명체와 다음 `밤유리 source` 목표를 본다.

## Plan-first evidence

- Plan artifact: `items/0266-lunar-source-harvest-reveal.md`
- Plan에서 벗어난 변경이 있다면 이유: 없음.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:web-game-foundations -> game-studio:game-ui-frontend -> game-studio:phaser-2d-game -> game-studio:game-playtest`
- 적용한 playfield/HUD/playtest 기준: source seed ready/harvest action, lunar creature playfield reveal, lunar harvest moonburst FX, HUD rare route hint, mobile 393 screenshot/telemetry regression.
- Game Studio route에서 벗어난 변경이 있다면 이유: 없음.

## 작업 checklist

- [x] Plan artifact의 수용 기준을 모두 확인했다.
- [x] 게임 기능/UI/에셋/QA 변경이면 Game Studio route를 기록했다.
- [x] UI/HUD 변경이면 `game-studio:game-ui-frontend` 기준으로 playfield 보호와 persistent HUD 밀도를 확인했다.
- [x] 게임 화면 QA이면 `game-studio:game-playtest` 기준으로 첫 actionable screen, main verbs, HUD readability, playfield obstruction을 확인했다.
- [x] UI/visual 변경이면 Browser Use 우선 QA를 시도하고 evidence 또는 blocker를 남겼다.
- [x] 필요한 문서/roadmap/dashboard/report를 갱신했다.
- [x] GitHub issue/PR/comment evidence를 축약 없이 남겼다.
- [x] all merge-blocking evidence must be in the original PR before merge/close.
- [x] post-merge main CI is observation-only; do not create a post-merge closeout PR or main-targeted closeout commit.

## 사용자/운영자 가치

- 게임 가치: 첫 원정 보상 씨앗이 심기에서 끝나지 않고 수확 보상, 달방울 creature, 다음 rare source 욕구로 이어진다.
- 운영사 가치: `seed_lunar_002` source loop가 state, accepted raster/FX binding, screenshot evidence로 검증된다.

## Before / After 또는 Visual evidence

- Before: #499 이후 `seed_lunar_002`는 `growth: 28` planted state와 source HUD에서 멈췄다.
- After: `돌보기` 두 번으로 ready가 되고 `초승달순 수확` 후 `은빛이끼 루미`, moonburst FX, `밤유리 source` hint가 남는다.
- Browser Use evidence 또는 blocker: Browser Use plugin tool이 현재 세션에 노출되지 않아 `reports/visual/issue-0500-lunar-source-harvest-reveal/visual-report-20260508.md`에 blocker와 Playwright fallback을 기록했다.
- N/A 사유: N/A.

## Playable mode

- main 실행 명령: `npm run play:main` 후 필요 시 `npm run play:main:install`, 그리고 `cd ../strange-seed-shop-play && npm run dev:legacy -- --host 127.0.0.1 --port 5174`
- 이 PR이 사람 플레이 환경을 막지 않는 이유: Phaser route의 source harvest state/action/checker만 확장하고 playable main worktree 계약이나 dev server 명령은 변경하지 않는다.

## 검증

- [x] `npm run check:phaser` PASS
- [x] `npm run check:ci` PASS
- [x] `git diff --check` PASS
- [x] UI/visual 변경이면 Browser Use QA와 `npm run check:visual` 또는 명시 blocker + fallback PASS

## 안전 범위

- [x] 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음
- [x] `ENABLE_AGENT_AUTOMERGE` 변경 없음
- [x] Branch protection 우회 없음
- Runtime image generation/API/cache 호출 없음.
- 새 generated asset 생성 없음. 기존 accepted raster/FX `creature_lunar_uncommon_001`, `fx_lunar_harvest_moonburst_001`만 Phaser에서 preload/render한다.

## 남은 위험

- `seed_lunar_002`의 실제 650잎 구매/22분 real-time growth는 후속 plan-first issue로 분리했다.
- `초승달순 오로`와 `밤유리 source`의 실제 route unlock은 이번 PR에서 preview promise만 남긴다.
- Browser Use hands-on QA는 tool 미노출로 수행하지 못했고 Playwright mobile 393 screenshot/telemetry fallback으로 검증했다.

## 연결된 issue

Closes #500
