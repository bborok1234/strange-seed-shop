## 요약

보관 바구니에 쌓인 `storedLeaves`를 플레이어가 `회수` action으로 가져가게 만들었습니다. Phaser v1 storage branch가 `오프라인 보관 4/24` 표시에서 끝나지 않고, `잎 +4`, `오프라인 보관 0/24` receipt/objective로 닫힙니다.

## Small win

- 이번 PR이 만든 가장 작은 승리: `오프라인 보관 4/24`가 보관 바구니 선택 후 `회수` 한 번으로 잎 자원에 합산된다.

## Plan-first evidence

- Plan artifact: `items/0247-offline-storage-reward-claim.md`
- Plan에서 벗어난 변경이 있다면 이유: 없음

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:phaser-2d-game`, `game-studio:game-ui-frontend`, `game-studio:game-playtest`
- 적용한 playfield/HUD/playtest 기준: 보관 바구니 selected HUD/action rail에 `회수` verb를 추가하고, 393px scripted playtest에서 storage fill -> claim -> receipt/objective/state를 확인했다.
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

- 게임 가치: 보관 바구니가 passive capacity가 아니라 오프라인 보상을 직접 회수하는 gameplay surface가 된다.
- 운영사 가치: issue-first/plan-first, Browser Use blocker 기록, Playwright fallback screenshot, local CI evidence가 원 PR 안에 묶인다.

## Before / After 또는 Visual evidence

- Before: #459 이후 `오프라인 보관 4/24`가 보여도 가져가는 action이 없었다.
- After: `reports/visual/issue-0461-offline-storage-reward-claim/phaser-check-storage-claimed-393.png`
- Browser Use evidence 또는 blocker: Browser Use `iab` backend는 현재 세션에서 직접 노출되지 않았다. `tool_search`로 Browser Use/Node REPL 도구를 확인했고, Browser Use 실행 도구가 없어 `npm run check:phaser` Playwright fallback screenshot을 사용했다.
- N/A 사유: N/A

## Playable mode

- main 실행 명령: `npm run play:main` 후 필요 시 `npm run play:main:install`, 그리고 `cd ../strange-seed-shop-play && npm run dev:legacy -- --host 127.0.0.1 --port 5174`
- 이 PR이 사람 플레이 환경을 막지 않는 이유: feature branch의 Phaser v1 local smoke와 문서만 변경하며 main playable worktree 계약은 유지한다.

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

- 보관 바구니는 아직 dedicated storage raster가 아니라 order crate fallback texture를 쓴다. 다음 WorkUnit에서 dedicated storage raster 또는 storage claim FX가 우선 후보다.
- Browser Use 직접 QA는 이번 Codex 세션에서 도구가 노출되지 않아 Playwright fallback으로 대체했다.

## 연결된 issue

Closes #461
