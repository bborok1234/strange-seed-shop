# 밤유리 source preview bridge

## 요약

`은빛이끼 루미` reveal 이후 `밤유리 source`가 텍스트 hint에 머무르지 않도록 `밤유리 source 보기` action, rare route locked state, accepted `creature_lunar_rare_001` silhouette marker, `seed_rare_001` / `research_rare_glass` / `expedition_night_glass` HUD promise를 추가했습니다.

## Small win

- 이번 PR이 만든 가장 작은 승리: 초승달순을 수확해 루미를 만난 직후 플레이어가 다음 장기 목표인 `밤유리 source`를 직접 눌러 locked route로 확인한다.

## Plan-first evidence

- Plan artifact: `items/0267-night-glass-source-preview.md`
- Plan에서 벗어난 변경이 있다면 이유: 없음.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:web-game-foundations -> game-studio:game-ui-frontend -> game-studio:phaser-2d-game -> game-studio:game-playtest`
- 적용한 playfield/HUD/playtest 기준: 루미 reveal 다음 player verb, rare source HUD surface, accepted rare creature silhouette marker, mobile 393 screenshot/telemetry regression.
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

- 게임 가치: rare seed route가 단순 예고 문구가 아니라 action과 화면의 locked node로 남아 D30 목표를 읽게 한다.
- 운영사 가치: #502 source preview가 state, HUD, accepted raster preload, screenshot evidence, checker assertion으로 검증된다.

## Before / After 또는 Visual evidence

- Before: #501 이후 `밤유리 source`는 `은빛이끼 루미 발견` surface의 텍스트 hint였다.
- After: `밤유리 source 보기` action 후 `nightGlassSourcePreviewVisible === true`, `nightGlassRoutePreviewId === expedition_night_glass`, accepted `creature_lunar_rare_001` 기반 locked silhouette marker가 남는다.
- Browser Use evidence 또는 blocker: Browser Use iab 도구가 현재 Codex tool surface에 노출되지 않아 `reports/visual/issue-0502-night-glass-source-preview/visual-report-20260508.md`에 blocker와 Playwright fallback을 기록했다.
- N/A 사유: N/A.

## Playable mode

- main 실행 명령: `npm run play:main` 후 필요 시 `npm run play:main:install`, 그리고 `cd ../strange-seed-shop-play && npm run dev:legacy -- --host 127.0.0.1 --port 5174`
- 이 PR이 사람 플레이 환경을 막지 않는 이유: Phaser route의 source preview state/action/checker만 확장하고 playable main worktree 계약이나 dev server 명령은 변경하지 않는다.

## 검증

- [x] `npm run check:phaser` PASS
- [x] `npm run check:ci` PASS
- [x] `npm run check:control-room` PASS
- [x] `npm run check:ops-live` PASS
- [x] `npm run check:dashboard` PASS
- [x] `npm run check:github-metadata` PASS
- [x] `git diff --check` PASS
- [x] UI/visual 변경이면 Browser Use QA와 `npm run check:visual` 또는 명시 blocker + fallback PASS

## 안전 범위

- [x] 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음
- [x] `ENABLE_AGENT_AUTOMERGE` 변경 없음
- [x] Branch protection 우회 없음
- Runtime image generation/API/cache 호출 없음.
- 새 generated asset 생성 없음. 기존 accepted raster `creature_lunar_rare_001`만 Phaser에서 preload/render한다.

## 남은 위험

- `seed_rare_001` 전용 seed icon/FX는 아직 없다.
- `expedition_night_glass` 실행, `research_rare_glass` unlock, rare seed 실제 획득은 후속 plan-first issue로 분리해야 한다.
- Browser Use hands-on QA는 tool 미노출로 수행하지 못했고 Playwright mobile 393 screenshot/telemetry fallback으로 검증했다.

## 연결된 issue

Closes #502
