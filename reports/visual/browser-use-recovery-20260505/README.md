# Browser Use Recovery Evidence — 2026-05-05

## Context

사용자 지적: in-app Browser Use가 QA에 사용되지 않았고 Ralph/Studio loop가 끊겼다.

## Browser Use Result

- Browser surface: Codex in-app browser, `iab` backend.
- Dev server discovered at `http://localhost:3000/`.
- Initial incorrect assumption: `http://localhost:5173/` returned connection refused.
- Captured screenshot: `reports/visual/browser-use-recovery-20260505/garden-current-iab.png`
- Captured DOM snapshot: `reports/visual/browser-use-recovery-20260505/dom-current.txt`

## Visual Observation

Fresh garden 화면에서 배경 art는 보이지만, 중앙 plot surface가 여전히 큰 cream rectangle로 읽힌다. 이는 `garden-respecting-hud-assets` spec의 첫 적용 순간을 `GardenPlotCard` plot marker로 고정한 결정과 일치한다.

## Loop Observation

Process check 기준 현재 실행 중인 long-run Ralph/Studio process는 없다. 실행 중인 관련 local process는 Vite dev server뿐이다.

## Correction

다음 visible-gameplay implementation PR부터는 Browser Use evidence를 PR gate로 먼저 남긴다. Playwright/DOM checks는 반복 gate로 쓰되, Browser Use screenshot evidence를 대체하지 않는다.
