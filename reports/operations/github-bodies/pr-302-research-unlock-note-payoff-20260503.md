## 요약

두 번째 주문 `연구 준비 잎 묶음` 납품 직후 research note unlock receipt, playfield `연구 노트 발견`, `새싹 기록법 연구` CTA glow가 보이도록 연결했습니다.

## Small win

- 이번 PR이 만든 가장 작은 승리: 플레이어가 두 번째 주문을 납품한 즉시 “연구 노트가 열렸고 다음 장기 메타 행동은 연구”라고 이해합니다.

## Plan-first evidence

- Plan artifact: `items/0153-research-unlock-note-payoff.md`
- Plan에서 벗어난 변경이 있다면 이유: N/A — plan의 research note/action-surface/playfield/research CTA payoff 범위 안에서 구현했습니다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- 적용한 playfield/HUD/playtest 기준: playfield order state, persistent HUD 저밀도, research CTA 가독성, Browser Use 우선 QA 시도, screenshot evidence, 393px overflow/bottom-tab invariant.
- Game Studio route에서 벗어난 변경이 있다면 이유: N/A — visible gameplay/HUD/QA 변경이므로 route를 유지했습니다.

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

- 게임 가치: 반복 주문 완료가 연구 unlock과 다음 수집/원정 메타로 확장되는 이유를 한 화면에서 보여줍니다.
- 운영사 가치: #301/main CI 이후 queue-empty를 종료하지 않고 #302 WorkUnit으로 이어가며, plan-first/Browser Use blocker/visual evidence/CI evidence를 PR 전에 남겼습니다.

## Before / After 또는 Visual evidence

- Before: 두 번째 주문 완료 후 연구 unlock은 카드 상태 전환 중심이었습니다.
- After: `reports/visual/issue-302-research-unlock-note-payoff-393.png` — 연구 노트 열림 receipt, playfield research state, `새싹 기록법 연구` CTA가 보입니다.
- Browser Use evidence 또는 blocker: `reports/visual/browser-use-blocker-0302-20260503.md` — 현재 세션에서 Browser Use `iab` bootstrap이 `No Codex IAB backends were discovered`로 실패했습니다.
- N/A 사유: Browser Use hands-on QA를 대체 완료로 주장하지 않고 Playwright는 regression gate로만 기록했습니다.

## Playable mode

- main 실행 명령: `npm run play:main` 후 필요 시 `npm run play:main:install`, 그리고 `cd ../strange-seed-shop-play && npm run dev -- --host 127.0.0.1 --port 5174`
- 이 PR이 사람 플레이 환경을 막지 않는 이유: feature branch의 React/CSS/test/report 변경이며, main playable worktree/port 5174 계약을 변경하지 않습니다.

## 검증

- [x] `npm run build` PASS
- [x] `npx playwright test --config playwright.config.ts --grep "연구 unlock"` PASS — 1 passed
- [x] `npm run check:visual` PASS — 55 passed
- [x] `npm run check:ci` PASS
- [x] UI/visual 변경이면 Browser Use QA와 `npm run check:visual` 또는 명시 blocker + fallback PASS

## 안전 범위

- [x] 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음
- [x] `ENABLE_AGENT_AUTOMERGE` 변경 없음
- [x] Branch protection 우회 없음
- [x] 런타임 이미지 생성 없음
- [x] SVG/vector/code-native accepted game graphics 추가 없음

## 남은 위험

- Browser Use `iab` backend가 현재 세션에서 발견되지 않아 hands-on QA screenshot은 남기지 못했습니다. blocker는 PR 전 evidence에 포함했습니다.
- 새 그래픽 asset은 생성하지 않았습니다. 이번 범위는 기존 UI/FX surface의 research note unlock payoff 연결입니다.

## 연결된 issue

Closes #302
