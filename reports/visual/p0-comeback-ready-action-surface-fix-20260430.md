# P0 comeback ready action surface clipping fix

Date: 2026-04-30
Issue: #190
Branch: `codex/0105-comeback-tap-feedback-countdown-v0`

## Scope

사용자 제보 screenshot 상태를 기준으로, 복귀 보상 modal에서 `방울새싹 씨앗 구매하고 심기` 후 성장 탭을 반복해 `현재 100% · 수확할 준비가 됐어요...`가 표시될 때 action surface 하단 콘텐츠가 잘리지 않는지 확인했다.

## Before

- Browser Use: `iab`
- URL: `http://127.0.0.1:5173/?qaOfflineMinutes=60&qaLunarGuardian=1&qaReset=1`
- Screenshot: `reports/visual/p0-comeback-ready-occlusion-browser-use-before-20260430.png`
- Failure: `.production-action-card`가 화면에서는 약 66px 높이지만 내부 `scrollHeight`가 208px으로, 주문/버튼 내용이 `overflow: hidden`에 의해 가려졌다.

## Fix

active plot이 있는 생산형 action surface에서는 생산/주문 카드의 상세 행을 숨기고, 카드가 compact summary만 보여주도록 했다. 생산/주문 상세는 playfield 상단 production lane과 별도 production-ready 상태에서 확인한다.

## After Browser Use evidence

- Browser Use: `iab`
- Session: `🔎 comeback ready clipping QA`
- URL: `http://127.0.0.1:5173/?qaOfflineMinutes=60&qaLunarGuardian=1&qaReset=1`
- Action sequence: `방울새싹 씨앗 구매하고 심기` -> 성장 탭 11회 -> `방울새싹 씨앗 수확` ready state 확인
- Screenshot: `reports/visual/p0-comeback-ready-action-surface-browser-use-after-20260430.png`
- Observed copy: `현재 100% · 수확할 준비가 됐어요. 반짝이는 밭을 눌러 도감 보상으로 이어가세요.`

## Regression gate

- Focused visual: `npm run check:visual -- --grep "복귀 성장 100%"` PASS
- New check: body scroll 없음, starter panel bottom이 bottom tabs 위에 있음, production card `scrollHeight <= clientHeight + 1`, visible action surface children overflow 없음.

## Result

PASS. 사용자 제보 상태에서 생산 카드 내부 잘림이 사라졌고, 같은 failure mode를 자동 회귀 gate로 고정했다.
