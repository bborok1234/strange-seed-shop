## 요약

Issue #436 구현입니다. 기존 root React/Vite playable을 `apps/legacy-react-playable/`로 격리하고, 신규 Phaser-first 정원은 `apps/seed-garden-phaser/` active lane으로 분리했습니다. root는 더 이상 게임 app root가 아니라 scripts/docs/CI/operator orchestrator입니다.

## Small win

- 이번 PR이 만든 가장 작은 승리: #433이 root `src/` 기존 React 앱을 active Phaser app으로 착각할 수 없게 했습니다.

## Plan-first evidence

- Plan artifact: `items/0232-repo-boundary-split.md`
- Plan에서 벗어난 변경이 있다면 이유: N/A — plan의 code entrypoint, docs, checker, evidence boundary를 구현했습니다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:web-game-foundations`, `game-studio:game-playtest`
- 적용한 playfield/HUD/playtest 기준: runtime/source ownership을 legacy playable과 Phaser active lane으로 분리하고, Browser Use `iab`로 두 lane smoke evidence를 남겼습니다.
- Game Studio route에서 벗어난 변경이 있다면 이유: N/A

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

- 게임 가치: 기존 React/CSS rescue 루프와 신규 Phaser greenfield 루프가 파일 구조에서 분리되어, #433부터 낮은 관리 카메라/actor loop를 새 앱에서 시작할 수 있습니다.
- 운영사 가치: Studio가 active source를 잘못 읽는 실패를 `check:app-boundaries`와 README/roadmap boundary로 막습니다.

## Before / After 또는 Visual evidence

- Before: root `src/`, `index.html`, `vite.config.ts`가 기존 React playable을 active app처럼 보이게 함.
- After: 기존 playable은 `apps/legacy-react-playable/`, 신규 Phaser는 `apps/seed-garden-phaser/`, docs는 `docs/legacy`와 `docs/phaser`로 분리됨.
- Browser Use evidence:
  - `reports/visual/issue-0436-boundary-split/browser-use-smoke-20260507.md`
  - `reports/visual/issue-0436-boundary-split/browser-use-legacy-smoke-20260507.png`
  - `reports/visual/issue-0436-boundary-split/browser-use-phaser-scaffold-20260507.png`

## Playable mode

- main 실행 명령: `npm run play:main` 후 필요 시 `npm run play:main:install`, 그리고 `cd ../strange-seed-shop-play && npm run dev:legacy -- --host 127.0.0.1 --port 5174`
- 이 PR이 사람 플레이 환경을 막지 않는 이유: legacy playable을 삭제하지 않고 `dev:legacy`/`build:legacy`/`check:legacy`로 보존했습니다. root `npm run dev`도 호환 alias로 legacy app을 엽니다.

## 검증

- [x] `npm run check:app-boundaries` PASS
- [x] `npm run check:content` PASS
- [x] `npm run check:loop` PASS
- [x] `npm run simulate:economy` PASS
- [x] `npm run build:legacy` PASS
- [x] `npm run build:phaser` PASS
- [x] `npm run check:docs` PASS
- [x] `npm run check:dashboard` PASS
- [x] `npm run check:ops-live` PASS
- [x] `npm run check:github-metadata` PASS
- [x] `npm run check:ci` PASS
- [x] `npm run check:art-share` PASS — 17 passed
- [x] Browser Use `iab` legacy smoke PASS
- [x] Browser Use `iab` Phaser scaffold smoke PASS

## 안전 범위

- [x] 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음
- [x] `ENABLE_AGENT_AUTOMERGE` 변경 없음
- [x] Branch protection 우회 없음
- [x] 기존 React playable 삭제 없음. 이동/격리만 수행

## 남은 위험

기존 historical docs/items/reports 안에는 과거 `src/App.tsx` 같은 경로 언급이 많이 남아 있습니다. 이번 PR은 active app boundary와 checker를 고정하는 작업이며, 과거 evidence 경로를 전부 rewrite하지는 않았습니다. 신규 Phaser WorkUnit은 `docs/phaser/*`와 `apps/seed-garden-phaser/*`를 기준으로 시작해야 합니다.

## 연결된 issue

Closes #436
Blocks #433
