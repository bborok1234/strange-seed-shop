## 요약

Phaser greenfield 구현 전에 repo의 **코드 entrypoint와 source-of-truth boundary**를 분리합니다. 현재 root `src/`, `index.html`, `vite.config.ts`, 기본 `dev/build` 경로가 기존 React playable을 active game처럼 보이게 하므로, 기존 React 앱 코드를 `apps/legacy-react-playable/` 같은 명시적 legacy lane으로 격리하고 신규 Phaser game은 `apps/seed-garden-phaser/` active lane으로 분리합니다. 기존 P0/P0.5 문서는 legacy/reference로, Studio/operator 문서는 cross-game 운영 계층으로 분류합니다.

## Small win

Issue #433이 root 기존 React 앱 구조, 기존 `docs/DESIGN.md`, `docs/ART_HUD_PRODUCTION_SPEC.md`, 기존 visual reports를 active Phaser spec으로 오인하지 않도록 막습니다.

## 사용자/운영자 가치

- 게임 가치: 신규 Phaser 정원이 기존 React/CSS/DOM rescue 기준에 끌려가지 않고 낮은 관리 카메라와 actor loop를 제대로 구현할 수 있습니다.
- 운영사 가치: Studio가 어떤 코드 lane과 문서를 active source로 읽어야 하는지 명확해져 WorkUnit 선택과 critique가 덜 꼬입니다.

## Before / After 또는 Visual evidence

- Before: 기존 React game code가 root active app으로 남아 있고, legacy game docs, Phaser spec, Studio docs가 모두 top-level에 섞여 있음.
- After 목표: `apps/legacy-react-playable`, `apps/seed-garden-phaser`, `docs/phaser`, `docs/legacy`, Studio/operator lane이 분리되고, roadmap/checker가 #433 전에 boundary split을 요구함.
- Visual evidence: N/A — 문서/운영 boundary 작업.

## Playable mode

- main 실행 명령: `npm run play:main` 후 필요 시 `npm run play:main:install`, 그리고 `cd ../strange-seed-shop-play && npm run dev -- --host 127.0.0.1 --port 5174`
- 이 이슈 구현은 기존 runtime behavior를 바꾸는 것이 아니라 legacy lane으로 격리하는 작업입니다. 기존 playable은 `dev:legacy` 또는 `play:main` 계열로 계속 실행되어야 합니다.

## 검증

- `npm run check:docs`
- `npm run check:dashboard`
- `npm run check:github-metadata`
- `npm run check:ci`

## 안전 범위

- 기존 앱 코드 삭제 없음. 이동/격리만 허용
- root active app entrypoint를 모호하게 남기지 않음
- 대량 파일 이동은 migration map 없이 하지 않음
- 실결제, 로그인, 외부 배포, 고객 데이터 없음

## 남은 위험

코드와 문서를 실제로 이동하면 과거 PR/evidence 링크나 기존 CI script가 깨질 수 있습니다. #436 구현은 migration map을 먼저 쓰고, legacy playable이 새 lane에서 계속 실행되는지 검증해야 합니다.

## 연결된 문서

- GitHub issue: https://github.com/bborok1234/strange-seed-shop/issues/436
- `items/0232-repo-boundary-split.md`
- `docs/PHASER_GREENFIELD_VERTICAL_SLICE_SPEC.md`
- Blocks #433
