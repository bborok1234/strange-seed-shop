# Operator Control Room Snapshot

Generated at: 2026-04-28T12:09:37.128Z

## Current mission

`docs/NORTH_STAR.md`가 게임 프로젝트와 에이전트 네이티브 운영사 프로젝트의 공통 헌장으로 추가되었다. Issue #53의 4h supervised trial report와 Issue #84 heartbeat daemon hardening은 merge 완료되었다. 현재 안전한 다음 작업은 Issue #87의 operator control room + playable mode를 PR로 검증·merge해 사람이 자동화 중에도 현재 mission과 게임 실행 상태를 즉시 파악하게 하는 것이다.

## Local state

- Branch: codex/operator-control-room
- Latest commit: e2b5564 24시간 운영 전 heartbeat 공백을 실패로 만들기
- Dirty files: present

## Open PRs

- unavailable or none

## Open issues

- #87 Agent Ops: add operator control room and playable mode — https://github.com/bborok1234/strange-seed-shop/issues/87

## Playable mode

- Prepare stable main worktree: `npm run play:main`
- Serve stable main game: `cd ../strange-seed-shop-play && npm run dev -- --host 127.0.0.1 --port 5174`
- URL: http://127.0.0.1:5174

## Visual evidence rule

- UI/game PR: link before/after screenshots under `reports/visual/`.
- Docs/scripts-only PR: write `N/A — UI 변화 없음` and link check output/report.

## Next safe stop

Stop only after PR required checks, main CI, and local `npm run check:all` are green, or after a written blocker report.

## Playable mode smoke proof

- `npm run play:main:install` PASS — `../strange-seed-shop-play` prepared as detached `origin/main` worktree and dependencies installed.
- Temporary Vite server on `http://127.0.0.1:5174/` returned index HTML (`614` bytes).
- Server was stopped after smoke verification; no long-running play server remains.
