# P0 정원 playfield 밝기와 게임 보드 polish

Status: in_progress
Owner: agent
Created: 2026-04-28
Updated: 2026-04-28
Scope-risk: narrow
Work type: game_feature
Issue: #93
Branch: codex/p0-playfield-board-polish

## Intent

정원 playfield가 어두운 overlay처럼 보여 온실 배경과 귀여운 수집 감각을 압도한다. 기능 변경 없이 Phaser board/plot 밝기와 host surface를 조정해 첫 화면을 더 게임답고 미려하게 만든다.

## Acceptance Criteria

- playfield board가 어두운 녹색 판이 아니라 밝은 온실 보드로 보인다.
- plot/progress label이 읽힌다.
- mobile/desktop visual evidence가 저장된다.
- `npm run check:all`가 통과한다.

## Evidence

- Visual report: `reports/visual/p0-playfield-board-polish-20260428.md`
- Mobile: `reports/visual/p0-playfield-board-polish-mobile-20260428.png`
- Desktop: `reports/visual/p0-playfield-board-polish-desktop-20260428.png`

## Verification

- `npm run check:p0-ui-ux`
- `npm run check:all`
- CDP mobile/desktop screenshot
