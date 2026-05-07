## 요약
- 씨앗 메뉴의 목표 CTA가 정원으로만 이동하던 회귀를 고쳐, `젤리콩 씨앗` 목표가 `구매하고 심기` 한 번으로 구매/심기/receipt까지 이어지게 했습니다.
- PR checks가 느렸던 원인 중 하나인 `Agent Automerge Trial`의 중복 `npm run check:ci` 실행을 제거하고, baseline 검증은 `CI / Verify game baseline`이 단독으로 소유하게 했습니다.

## Small win
- 사용자가 지적한 `정원에서 심기` no-op을 Browser Use `iab`로 재현했고, 같은 버튼 클릭으로 실제 정원 plot에 `젤리콩 씨앗`이 심기는 것을 다시 Browser Use로 확인했습니다.

## 사용자/운영자 가치
- 플레이어는 씨앗 목표 배너를 눌렀을 때 기대한 행동을 즉시 얻습니다.
- 운영자는 중복 CI 실행을 줄여 PR feedback loop 시간을 줄입니다.

## Before / After 또는 Visual evidence
- Before: `reports/visual/issue-seed-goal-plant-cta/browser-use-before-noop-20260507.png`
- After button ready: `reports/visual/issue-seed-goal-plant-cta/browser-use-after-button-ready-20260507.png`
- After planted: `reports/visual/issue-seed-goal-plant-cta/browser-use-after-one-tap-planted-20260507.png`
- Report: `reports/visual/issue-seed-goal-plant-cta/visual-report-20260507.md`

## Playable mode
- URL: `http://127.0.0.1:4173/?qaResearchExpeditionReady=1&qaTab=seeds`
- Flow: `씨앗` 탭 -> `젤리콩 씨앗` 목표 CTA `구매하고 심기` -> 정원에서 `젤리콩 씨앗 성장시키기` 확인

## 검증
- [x] Browser Use `iab` before/after reproduction
- [x] `npm run build`
- [x] `npx playwright test tests/visual/p0-mobile-game-shell.spec.ts --config playwright.config.ts -g "도감 목표 CTA|연구 단서 씨앗 구매와 심기|새 기록 다음 씨앗 심기"` — 3 passed
- [x] `npm run check:governance`
- [x] `npm run check:closed-workunit-mirrors`
- [x] `npm run check:ci`
- [x] `git diff --check`

## 안전 범위
- Runtime image generation 없음.
- 결제/실채널/고객 데이터 변경 없음.
- CI baseline은 제거하지 않고 중복 실행만 제거했습니다.

## 남은 위험
- `check:art-share`는 이번 변경의 직접 범위가 아니어서 별도 실행하지 않았습니다. UI 동작은 Browser Use와 focused Playwright, `check:ci`로 검증했습니다.

## 연결된 issue
- Local user-reported regression
- Item: `items/0226-seed-goal-plant-cta-fix.md`

## 작업 checklist
- [x] Plan artifact 작성
- [x] Browser Use 우선 QA evidence 저장
- [x] Focused regression 추가
- [x] Local CI green
- [ ] GitHub checks 확인
