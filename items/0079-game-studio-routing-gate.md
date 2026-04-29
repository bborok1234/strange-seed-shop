# Game Studio routing gate

Status: active
Work type: agent_ops
Branch: `codex/0078-playfield-readable-board-fix`
Date: 2026-04-29

## 문제 / 배경

`$seed-ops` 운영 루프가 issue -> plan -> PR -> CI -> merge 절차는 수행했지만, 게임 작업을 Game Studio plugin 기준으로 분류하고 UI/HUD/playtest specialist route를 강제하지 않았다. 그 결과 정원 화면 작업이 일반 웹앱 카드/패널 polish처럼 처리되었고, `docs/GAME_UI_UX_RESEARCH_20260428.md`와 `docs/IDLE_CORE_CREATIVE_GUIDE.md`의 playfield-first, one immediate action, low-HUD 원칙이 merge gate로 작동하지 않았다.

## Small win

앞으로 게임 기능/UI/에셋/QA issue는 `game-studio:game-studio` umbrella와 specialist route를 plan/PR에 기록해야 하며, 빠지면 project-command 또는 GitHub metadata checker가 실패한다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route:
  - `game-studio:game-ui-frontend` for HUD/menu/layout/playfield protection
  - `game-studio:game-playtest` for browser-game screenshot QA and production-ready claims
  - `game-studio:phaser-2d-game` for Phaser runtime changes
  - `game-studio:web-game-foundations` for simulation/render/UI/input boundaries
  - `game-studio:sprite-pipeline` for 2D sprite/FX workflow

## Plan

1. `AGENTS.md`에 게임 작업 Game Studio routing rule을 추가한다.
2. `docs/PROJECT_COMMANDS.md`의 `$seed-ops`, `$seed-design`, `$seed-qa` 계약에 Game Studio gate를 추가한다.
3. `.codex/skills/seed-ops`, `seed-design`, `seed-qa`에 같은 routing rule을 추가한다.
4. GitHub issue/PR template에 `Game Studio route`와 playfield/HUD/playtest checklist를 추가한다.
5. `scripts/check-project-commands.mjs`와 `scripts/check-github-metadata-quality.mjs`가 route 누락을 잡게 한다.
6. `npm run check:project-commands`, `npm run check:github-metadata`, `npm run check:ci`로 검증한다.

## 수용 기준

- `seed-ops`가 게임 기능/UI/에셋/QA issue를 시작할 때 Game Studio route를 기록해야 한다.
- `seed-design`은 구현 전 fantasy, player verbs, core loop, UI surface, asset workflow, playtest approach를 정렬한다.
- `seed-qa`는 DOM/layout assertion만이 아니라 game-playtest 기준 screenshot review findings를 남긴다.
- Issue/PR template에서 Game Studio route가 보인다.
- Checker가 Game Studio route 문구를 검증한다.

## 검증 명령

- `npm run check:project-commands`
- `npm run check:github-metadata`
- `npm run check:ci`

## 안전 범위

- 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음
- Branch protection 우회 없음
- runtime game behavior 변경 없음
