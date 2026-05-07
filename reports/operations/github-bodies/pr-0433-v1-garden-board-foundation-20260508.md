## 요약

게임 v1 구현을 `GAME_BIBLE`/`GAME_PRODUCTION_SPEC` 기준으로 이어가고, Issue #433을 신규 Phaser `garden board foundation`으로 재작성했습니다. `apps/seed-garden-phaser`는 이제 placeholder text가 아니라 최소 3개 build slot, runtime plot/facility entity, starter seed 심기/돌보기/수확, `말랑잎 포리` actor task, contextual HUD/action rail을 보여줍니다.

## Small win

신규 Phaser lane에서 fresh start -> `심기` -> `돌보기` -> `수확` -> actor 합류 -> 작업대 `수령`까지 한 번의 playable smoke로 검증되는 v1 runtime 기준점이 생겼습니다.

## 사용자/운영자 가치

사용자는 정원이 정적 배경이나 카드 UI가 아니라 slot과 actor가 있는 작은 운영 게임으로 읽히는 첫 화면을 봅니다.

운영자는 `studio operate`가 전문팀 scorecard를 거쳐 GitHub Issue #433을 plan-first로 재작성하고, 구현/검증/증거/heartbeat/control room까지 남기는 루프를 실행했음을 확인할 수 있습니다.

## Before / After 또는 Visual evidence

Before:

- `apps/seed-garden-phaser`는 “#433 Stage 1 구현 대기 중” placeholder였습니다.
- #433/#434/#432는 리부트 전 Stage 문맥에 남아 있었습니다.

After:

- `reports/visual/issue-0433-garden-board-foundation/phaser-fresh-start-393-20260508.png`
- `reports/visual/issue-0433-garden-board-foundation/phaser-after-harvest-actor-393-20260508.png`
- `reports/visual/issue-0433-garden-board-foundation/phaser-workbench-claim-393-20260508.png`
- `reports/visual/issue-0433-garden-board-foundation/visual-report-20260508.md`

Browser Use `iab`는 이번 세션에서 도구가 노출되지 않아 blocker를 report에 기록했고, Playwright/Node REPL fallback으로 screenshot과 state smoke를 남겼습니다.

## Playable mode

- 신규 Phaser lane: `npm run dev:phaser`
- 검증 viewport: 393x852 mobile frame
- 안정 main playable은 기존 계약대로 `npm run play:main` / port `5174`를 유지합니다.

## 검증

- `npm run build:phaser` — pass
- `npm run check:phaser` — pass
  - build
  - `scripts/check-phaser-foundation.mjs`
  - final evidence: leaves `20`, seeds `0`, `포리 작업 수령`, `3번 밭 확장`, no body/document scroll, one Phaser canvas
- `npm run check:ci` — pass

## 안전 범위

- 기존 React playable 대규모 rewrite 없음
- accepted manifest game asset 추가 없음
- 실제 결제, 로그인, 광고, 외부 배포, 런타임 이미지 생성 없음
- Phaser placeholder shape는 production art가 아니라 topology proof로만 취급합니다.

## 남은 위험

이번 PR은 final art가 아닙니다. 다음 WorkUnit은 accepted raster asset/sprite bundle 또는 first 5m vertical slice로 이어져야 하며, gpt-image-2 또는 Codex native image-generation provenance와 asset/style checks가 필요합니다.

## 연결된 issue

Closes #433

## 작업 checklist

- [x] Plan-first WorkUnit 작성
- [x] Department Scorecard 작성
- [x] GitHub Issue #433 body 갱신
- [x] Phaser runtime foundation 구현
- [x] Browser Use blocker 기록 및 Playwright fallback evidence 작성
- [x] `check:phaser` verifier 강화
- [x] `check:ci` 통과
