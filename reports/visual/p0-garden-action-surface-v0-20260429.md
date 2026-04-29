# P0 Garden action surface v0

Date: 2026-04-29
Branch: `codex/0080-garden-action-surface-v0`
Issue: #140
Route: `game-studio:game-studio` -> `game-studio:game-ui-frontend`, `game-studio:game-playtest`, `game-studio:web-game-foundations`

## 목적

정원 기본 화면의 하단 `starter-panel`이 작은 스크롤 패널처럼 보이는 문제를 줄이고, 생산/주문/다음 생명체 정보를 현재 게임 동사 중심의 action surface로 정리했다.

## Evidence

- After production/order state: `reports/visual/p0-garden-action-surface-v0-20260429.png`
- Garden ready state: `reports/visual/p0-garden-action-surface-v0-garden-393-20260429.png`
- Short in-app browser production state: `reports/visual/p0-garden-action-surface-v0-short-399x666-20260429.png`
- Short in-app browser garden state: `reports/visual/p0-garden-action-surface-v0-garden-399x666-20260429.png`

## Browser Use

사용자가 현재 in-app browser screenshot으로 399x666에 가까운 짧은 viewport에서 하단 action surface가 잘리는 문제를 지적했다. 이 viewport를 visual gate에 추가하고, 5175 dev server를 현재 브랜치 코드로 재시작했다.

## Game Playtest Findings

- PASS: `?qaProductionReady=1` 모바일 화면에서 `starter-panel` 내부 스크롤이 생기지 않는다.
- PASS: 399x666 짧은 in-app browser 크기에서도 production action surface가 하단 탭 위에서 잘리지 않는다.
- PASS: 생산/주문 CTA는 44px 이상 터치 영역으로 검증된다.
- PASS: 다음 생명체 목표가 compact strip으로 유지된다.
- PASS: body scroll 없이 playfield와 하단 탭이 유지된다.
- PASS: 보이는 React plot card가 실제 입력 surface가 되어 tap/harvest telemetry가 통과한다.
- 남은 위험: 정원 board 자체의 빈 영역과 생명체 actor 배치/주문 상자 표현은 아직 다음 runtime visual work가 필요하다.

## Verification

- `npm run build` PASS
- `npm run check:visual -- --grep "399x666|짧은 모바일|모바일 자동 생산과 첫 주문|모바일 성장 밭 탭|모바일 ready 밭 수확"` PASS
- `npm run check:visual` PASS, 15 passed
- `npm run check:ci` PASS
