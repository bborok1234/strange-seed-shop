# 초승달순 source planting loop

## 요약

첫 원정 보상 source preview를 실제 `초승달순 심기` player verb로 연결했습니다. `GardenState`에 source seed inventory/planting state를 추가하고, accepted raster asset `seed_lunar_002_icon`을 Phaser playfield에 preload/render하며, mobile 393 checker가 source preview -> source planting까지 검증합니다.

## Small win

- 이번 PR이 만든 가장 작은 승리: 원정 귀환 보상이 “다음 route 단서”에서 끝나지 않고 빈 밭에 새 source seed를 심는 행동으로 이어집니다.

## Plan-first evidence

- Plan artifact: `items/0265-lunar-source-planting-loop.md`
- Plan에서 벗어난 변경이 있다면 이유: 없음.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:web-game-foundations -> game-studio:game-ui-frontend -> game-studio:phaser-2d-game -> game-studio:game-playtest`
- 적용한 playfield/HUD/playtest 기준: source seed inventory, selected empty plot action, `seed_lunar_002_icon` plot overlay, HUD source surface, mobile 393 screenshot/telemetry regression.
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

- 게임 가치: 플레이어가 첫 원정 보상으로 받은 source seed를 곧바로 심어 다음 collection desire를 이해한다.
- 운영사 가치: `seed_lunar_002` v1 route가 telemetry, runtime raster binding, screenshot evidence로 검증된다.

## Before / After 또는 Visual evidence

- Before: #497 이후 `초승달순 씨앗 source`와 `expedition_moon_fence_locked` route preview는 보였지만 실제 planting action과 plot seed state가 없었다.
- After: source preview 후 빈 unlocked plot에서 `초승달순 심기` action이 보이고, action 후 plot에 `seed_lunar_002` icon/chip과 planted state가 남는다.
- Browser Use evidence 또는 blocker: Browser Use plugin tool이 현재 세션에 노출되지 않아 `reports/visual/issue-0498-lunar-source-planting-loop/visual-report-20260508.md`에 blocker와 Playwright fallback을 기록했다.
- N/A 사유: N/A.

## Playable mode

- main 실행 명령: `npm run play:main` 후 필요 시 `npm run play:main:install`, 그리고 `cd ../strange-seed-shop-play && npm run dev:legacy -- --host 127.0.0.1 --port 5174`
- 이 PR이 사람 플레이 환경을 막지 않는 이유: Phaser runtime state/action/checker만 확장하고 playable main worktree 계약이나 dev server 명령은 변경하지 않는다.

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
- 새 generated asset 생성 없음. 기존 accepted raster `seed_lunar_002_icon`만 Phaser에서 preload/render한다.

## 남은 위험

- `seed_lunar_002`의 실제 650잎 구매/22분 성장/수확 reward bridge는 후속 plan-first issue로 분리했다.
- Browser Use hands-on QA는 tool 미노출로 수행하지 못했고 Playwright mobile 393 screenshot/telemetry fallback으로 검증했다.

## 연결된 issue

Closes #498
