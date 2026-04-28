# Sprite animation mapping Browser QA 기록

Date: 2026-04-28
Status: fallback-pass
Issue: #21
Branch: `codex/sprite-animation-mapping`

## Browser Use 우선 시도

- `browser-use:browser` 스킬을 먼저 읽고 `iab` backend 초기화를 시도했다.
- 현재 세션의 JavaScript REPL은 Browser Use plugin의 `browser-client.mjs` static `node:` import를 로드하지 못해 직접 Browser Use 조작을 완료할 수 없었다.
- 따라서 기존 프로젝트 fallback인 Chrome DevTools Protocol 캡처로 mapping layer 변경 후 playfield가 렌더링되는지 확인했다.

## Fallback 검증

- Dev server: `npm run dev -- --host 127.0.0.1 --port 5175`
- Growing state:
  - URL: `http://127.0.0.1:5175/?qaSpriteState=growing&qaReset=1`
  - Evidence: `reports/visual/sprite-mapping-growing-20260428.png`
- Ready state:
  - URL: `http://127.0.0.1:5175/?qaSpriteState=ready&qaReset=1`
  - Evidence: `reports/visual/sprite-mapping-ready-20260428.png`

## 판정

- manifest animation binding metadata를 추가한 뒤에도 Phaser playfield가 growing/ready QA 상태에서 렌더링된다.
- `scripts/check-sprite-batch.mjs`가 GardenScene의 hard-coded sprite key 제거와 manifest animation binding 누락을 검증한다.
- graphics fallback은 유지된다.
