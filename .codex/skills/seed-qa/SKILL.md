---
name: seed-qa
description: 이상한 씨앗상회 프로젝트 전용 실기 QA/visual QA 모드. 사용자가 `$seed-qa`, 화면 확인, 모바일 QA, visual regression, 스크린샷, Browser Use, Playwright, Computer Use 대체 검증을 요청할 때 사용한다.
---

# Seed QA

## Purpose

실제 브라우저 화면 기준으로 모바일 게임 UI/UX 회귀를 잡는다.

## Tool order

1. `browser-use:browser` 스킬/도구가 가능하면 먼저 사용한다.
2. Browser Use가 막히면 blocker를 기록하고 Playwright CLI/CDP fallback을 사용한다.
3. Computer Use는 in-app browser/CLI fallback이 부적합할 때만 사용한다.

## Required evidence

- 모바일 393/375/360 중 관련 viewport
- 데스크톱 1280x900 또는 명시된 game frame
- `reports/visual/` screenshot 또는 markdown report
- UI 변경이면 `npm run check:visual`
- 게임 화면 QA는 `game-studio:game-playtest` 기준으로 첫 actionable screen, main verbs, HUD readability, playfield obstruction, screenshot review findings를 남긴다.

## Guardrails

- 스크린샷 없이 “괜찮아 보임”이라고 보고하지 않는다.
- DOM assertion만으로 “production-ready”라고 보고하지 않는다.
- 모바일 정원은 body scroll 없이 playfield와 하단 탭을 보존해야 한다.
- non-garden 모바일 탭은 half overlay가 아니라 full tab screen이어야 한다.
