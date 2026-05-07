## 요약

#453은 세 번째 밭 확장이 빈 capacity 보상으로 끝나는 문제를 닫습니다. 확장 보상에 starter seed를 1개 지급하고, 이미 선택된 `3번 햇살 밭`에서 바로 `심기`가 가능하도록 first-session chain을 이어 붙였습니다.

## Small win

- 이번 PR이 만든 가장 작은 승리: 새로 열린 `3번 햇살 밭`에 즉시 씨앗을 심고 `돌보기`로 이어갈 수 있습니다.

## Plan-first evidence

- Plan artifact: `items/0243-third-plot-seed-planting-loop.md`
- Plan에서 벗어난 변경이 있다면 이유: 없음.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:phaser-2d-game`, `game-studio:game-ui-frontend`, `game-studio:game-playtest`
- 적용한 playfield/HUD/playtest 기준: expansion payoff가 playfield state와 action rail affordance로 즉시 읽히고, smoke path가 screenshot evidence를 남깁니다.
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

- 게임 가치: 첫 주문 납품과 밭 확장 이후 “하나만 더 심기” 행동이 즉시 생겨 첫 5분 루프가 끊기지 않습니다.
- 운영사 가치: Phaser v1 first-session chain이 capacity expansion 후 planting으로 재순환한다는 자동 evidence를 확보했습니다.

## Before / After 또는 Visual evidence

- Before: #451 이후 `3번 햇살 밭`은 열리지만 첫 루프 경로에서 seed가 0이라 바로 사용할 수 없었습니다.
- After: `3번 밭 확장 · 잎 -60 · 씨앗 +1 · 새 재배 자리 +1` receipt 후 `plot_03`에서 `심기`가 가능하고, 심기 뒤 `plot_03` state는 `planted`, growth `20`입니다.
- Browser Use evidence 또는 blocker: Browser Use `iab` backend가 현재 세션에 노출되지 않아 `reports/visual/issue-0453-third-plot-seed-planting-loop/visual-report-20260508.md`에 blocker와 Playwright fallback evidence를 기록했습니다.
- N/A 사유: 새 accepted manifest asset은 추가하지 않았습니다.

## Playable mode

- main 실행 명령: `npm run play:main` 후 필요 시 `npm run play:main:install`, 그리고 `cd ../strange-seed-shop-play && npm run dev:legacy -- --host 127.0.0.1 --port 5174`
- 이 PR이 사람 플레이 환경을 막지 않는 이유: Phaser app runtime/state/check script만 변경하고 playable main worktree 계약과 legacy playable command는 변경하지 않았습니다.

## 검증

- [x] `npm run check:phaser` PASS
- [x] `npm run check:ci` PASS
- [x] UI/visual 변경이면 Browser Use QA와 `npm run check:visual` 또는 명시 blocker + fallback PASS

## 안전 범위

- [x] 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음
- [x] `ENABLE_AGENT_AUTOMERGE` 변경 없음
- [x] Branch protection 우회 없음

## 남은 위험

반복 주문, storage unlock, 새 seed 종류/도감 reveal은 후속 WorkUnit입니다. 이 PR은 #451 이후 `plot_03` 재심기 loop만 닫습니다.

## 연결된 issue

Closes #453
