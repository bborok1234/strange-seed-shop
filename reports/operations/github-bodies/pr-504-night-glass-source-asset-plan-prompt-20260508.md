# 밤유리 source icon/FX plan-prompt

## 요약

#503의 `밤유리 source` locked preview가 accepted rare creature silhouette stand-in에 머무르지 않도록 `seed_rare_001_icon`과 `fx_night_glass_source_unlock_strip_v1`을 generation-ready asset plan/prompt에 추가했습니다. 실제 PNG generation, manifest acceptance, Phaser runtime binding은 후속 WorkUnit으로 분리합니다.

## Small win

- 이번 PR이 만든 가장 작은 승리: 밤유리 rare route가 전용 seed icon과 unlock FX production queue를 갖는다.

## Plan-first evidence

- Plan artifact: `items/0268-night-glass-source-asset-plan-prompt.md`
- Plan에서 벗어난 변경이 있다면 이유: 없음.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:sprite-pipeline -> game-studio:game-ui-frontend -> game-studio:phaser-2d-game -> game-studio:game-playtest`
- 적용한 playfield/HUD/playtest 기준: asset/FX payoff는 runtime 이전 plan-prompt stage라 Browser Use는 N/A, 대신 frame contract와 manifest binding candidate를 checker로 고정.
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

- 게임 가치: `밤유리 source`가 placeholder preview가 아니라 전용 rare seed icon/FX로 이어질 준비가 된다.
- 운영사 가치: generation 전에 asset ids, output paths, prompt acceptance, frame count, frame size, animation binding이 deterministic checker로 검증된다.

## Before / After 또는 Visual evidence

- Before: #503 이후 `seed_rare_001`은 HUD text와 accepted `creature_lunar_rare_001` silhouette marker로만 예고됐다.
- After: `seed_rare_001_icon`과 `fx_night_glass_source_unlock_strip_v1`이 `assets/source/asset_plan.json` / `assets/source/asset_prompts.json`에 generation-ready로 추가됐다.
- Browser Use evidence 또는 blocker: runtime 화면 변경이 아닌 asset source plan/prompt slice라 Browser Use N/A.
- N/A 사유: 화면/DOM/runtime 변경 없음.

## Playable mode

- main 실행 명령: `npm run play:main` 후 필요 시 `npm run play:main:install`, 그리고 `cd ../strange-seed-shop-play && npm run dev:legacy -- --host 127.0.0.1 --port 5174`
- 이 PR이 사람 플레이 환경을 막지 않는 이유: asset source JSON만 확장하고 runtime route, manifest accepted assets, playable worktree 계약은 변경하지 않는다.

## 검증

- [x] `npm run check:topology-asset-plan` PASS
- [x] `npm run check:asset-provenance` PASS
- [x] `npm run check:asset-style` PASS
- [x] `npm run check:ci` PASS
- [x] `git diff --check` PASS
- [x] UI/visual 변경이면 Browser Use QA와 `npm run check:visual` 또는 명시 blocker + fallback PASS

## 안전 범위

- [x] 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음
- [x] `ENABLE_AGENT_AUTOMERGE` 변경 없음
- [x] Branch protection 우회 없음
- Runtime image generation/API/cache 호출 없음.
- 새 accepted manifest asset 추가 없음. 이번 PR은 plan/prompt source만 추가한다.

## 남은 위험

- 실제 PNG generation, asset review, manifest acceptance가 아직 필요하다.
- Phaser runtime은 후속 binding 전까지 #503의 accepted `creature_lunar_rare_001` silhouette marker를 계속 사용한다.

## 연결된 issue

Closes #504
