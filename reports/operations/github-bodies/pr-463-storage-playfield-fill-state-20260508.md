## 요약

보관 바구니가 playfield 위에서 `4/24` 또는 `0/24` 채움 상태를 직접 보여주게 만들었습니다. #461의 `회수` action은 유지하면서, storage 상태를 action rail을 읽기 전에도 board에서 확인할 수 있습니다.

## Small win

- 이번 PR이 만든 가장 작은 승리: 보관 바구니 prop 위에 fill bar/chip이 생겨 생산 수령 후 `4/24`, 회수 후 `0/24`가 같은 자리에서 보인다.

## Plan-first evidence

- Plan artifact: `items/0248-storage-playfield-fill-state.md`
- Plan에서 벗어난 변경이 있다면 이유: 없음

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:game-ui-frontend`, `game-studio:phaser-2d-game`, `game-studio:game-playtest`
- 적용한 playfield/HUD/playtest 기준: 보관 바구니 selected state가 persistent HUD를 늘리지 않고 playfield facility 위에 작게 표시되며, 393px screenshot과 `__seedGardenStorageFillRatio`로 filled/claimed state를 확인했다.
- Game Studio route에서 벗어난 변경이 있다면 이유: 없음

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

- 게임 가치: storage/offline reward가 숫자 설명이 아니라 정원 보드의 facility state로 읽힌다.
- 운영사 가치: #462 main CI 관찰 후 다음 WorkUnit plan commit에서 이전 완료 상태를 정리하고, 새 issue-first PR로 이어갔다.

## Before / After 또는 Visual evidence

- Before: #461 이후 storage 상태는 objective/action rail을 읽어야만 알 수 있었다.
- After: `reports/visual/issue-0463-storage-playfield-fill-state/phaser-check-storage-buffer-393.png`, `reports/visual/issue-0463-storage-playfield-fill-state/phaser-check-storage-claimed-393.png`
- Browser Use evidence 또는 blocker: Browser Use `iab` backend는 현재 세션에서 직접 노출되지 않았다. `tool_search`로 Browser Use/Node REPL 도구를 확인했고, Browser Use 실행 도구가 없어 `npm run check:phaser` Playwright fallback screenshot을 사용했다.
- N/A 사유: N/A

## Playable mode

- main 실행 명령: `npm run play:main` 후 필요 시 `npm run play:main:install`, 그리고 `cd ../strange-seed-shop-play && npm run dev:legacy -- --host 127.0.0.1 --port 5174`
- 이 PR이 사람 플레이 환경을 막지 않는 이유: feature branch의 Phaser v1 renderer/smoke만 변경하며 main playable worktree 계약은 유지한다.

## 검증

- [x] `npm run check:phaser` PASS
- [x] `npm run check:ci` PASS
- [x] `npm run check:control-room` PASS
- [x] `npm run check:ops-live` PASS
- [x] `git diff --check` PASS
- [x] UI/visual 변경이면 Browser Use QA와 `npm run check:visual` 또는 명시 blocker + fallback PASS

## 안전 범위

- [x] 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음
- [x] `ENABLE_AGENT_AUTOMERGE` 변경 없음
- [x] Branch protection 우회 없음
- [x] Runtime image generation/API/cache 호출 없음
- [x] 새 accepted manifest game asset 없음

## 남은 위험

- 보관 바구니는 아직 dedicated storage raster가 아니라 order crate fallback texture를 쓴다.
- OPENAI_API_KEY/SEED_ASSET_IMAGE_MODEL이 없어 dedicated storage raster generation은 별도 asset WorkUnit에서 처리해야 한다.
- Browser Use 직접 QA는 이번 Codex 세션에서 도구가 노출되지 않아 Playwright fallback으로 대체했다.

## 연결된 issue

Closes #463
