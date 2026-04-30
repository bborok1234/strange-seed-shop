# E2E/visual QA 운영 개선 기록

Date: 2026-04-30
Source: https://dev.to/debs_obrien/how-i-used-ai-to-fix-our-e2e-test-architecture-444a

## Trigger

`?qaOfflineMinutes=60&qaLunarGuardian=1&qaReset=1`에서 `방울새싹 씨앗 구매하고 심기` 후 수확 준비 상태까지 탭하면, action surface의 생산/주문 카드 하위 내용이 화면에서 잘렸다. 기존 QA는 DOM text와 button state를 확인했지만, visible card 내부 overflow를 실패로 보지 않았다.

## Article-derived operating changes

- 기사에서 사용한 tracer bullet 방식처럼, 큰 QA 개선을 한 번에 갈아엎지 않고 사용자 제보 화면 하나를 thin slice로 고정한다.
- 기사에서 강조한 skill/process 반복성을 받아들여, `seed-qa`, `seed-ops`, `docs/BROWSER_QA.md`, `docs/PROJECT_COMMANDS.md`, `AGENTS.md`에 같은 QA 규칙을 반영했다.
- green CI가 충분한 증거가 아니라는 교훈을 적용해, Playwright 통과와 Browser Use screenshot evidence를 분리해서 기록한다.
- “보인다” 계열 assertion 대신 실패 mode를 직접 측정한다. 이번 회귀 gate는 production card의 `scrollHeight <= clientHeight + 1`, panel bottom과 bottom tabs 간격, visible child overflow를 확인한다.

## New QA rule

사용자 screenshot으로 제보된 visual bug는 같은 URL, viewport, QA 파라미터, 클릭/탭 sequence를 재현한 뒤 before/after screenshot과 자동 회귀 gate를 남긴다. DOM에 텍스트가 있어도 화면에서 카드 내부가 잘리면 실패다.

## Evidence

- Before Browser Use screenshot: `reports/visual/p0-comeback-ready-occlusion-browser-use-before-20260430.png`
- After Browser Use screenshot: `reports/visual/p0-comeback-ready-action-surface-browser-use-after-20260430.png`
- Regression test: `npm run check:visual -- --grep "복귀 성장 100%"` PASS
