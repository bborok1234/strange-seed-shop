# P0 UI/UX Rescue Visual Evidence

Status: review
Issue: #89
Branch: codex/p0-game-ui-ux-rescue
Date: 2026-04-28

## Browser Use status

Browser Use 직접 도구는 현재 세션 tool surface에 노출되지 않았다. `docs/BROWSER_QA.md`의 2026-04-28 진단과 동일하게, 이번 iteration은 CLI 기반 Chrome DevTools Protocol 캡처를 사용했다.

## Before — current main

- Mobile 390x844: `reports/visual/p0-ui-ux-before-main-mobile-20260428.png`
- Desktop 1280x900: `reports/visual/p0-ui-ux-before-main-desktop-20260428.png`

Observed failures:

- Phaser playfield 내부 안내 문구가 plot 위에 겹친다.
- Garden starter panel이 seed shop list를 펼쳐 playfield보다 지배적인 정보가 된다.
- Desktop garden tab에서 오른쪽 debug/status/mission panel이 플레이어 UI처럼 보인다.

## After — branch

- Mobile 390x844: `reports/visual/p0-ui-ux-after-mobile-20260428.png`
- Desktop 1280x900: `reports/visual/p0-ui-ux-after-desktop-20260428.png`
- Explicit debug desktop 1280x900: `reports/visual/p0-ui-ux-debug-mode-desktop-20260428.png`

Verified changes:

- 정원 기본 화면에서 Phaser headline/hint overlay를 제거했다.
- 정원 action panel에서 full seed shop list를 제거하고 compact `씨앗 탭 열기` action dock으로 대체했다.
- Desktop garden playable 기본 화면은 중앙 game frame만 보이고 오른쪽 debug/status panel은 숨겨진다.
- `?debug=1`에서는 기존 debug/status panel을 명시적으로 확인할 수 있다.

## Remaining visual risk

- 일부 creature/seed/icon asset은 alpha가 없는 RGB PNG라 reveal/card에서 배경이 노출된다. 이번 PR은 `scripts/check-asset-alpha-quality.mjs`와 `assets/source/asset_alpha_exceptions.json`로 현재 예외를 추적하고, P0 종료 전 cutout/remaster를 요구한다.
- Playwright CLI visual regression은 새 dependency 설치 승인 후 별도 work item으로 도입한다. 이번 iteration은 기존 CDP CLI를 사용했다.
