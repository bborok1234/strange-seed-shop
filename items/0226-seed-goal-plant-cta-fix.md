# WorkUnit — 씨앗 목표 CTA one-tap 심기 복구

- ID: `0226`
- Status: review
- GitHub issue: local user-reported regression
- Draft PR: #426 — https://github.com/bborok1234/strange-seed-shop/pull/426
- Branch: `codex/seed-goal-plant-cta-fix`
- Campaign source: P0.5 Idle Core + Creative Rescue
- Game Studio route: `game-studio:game-studio` -> `game-studio:game-ui-frontend` -> `game-studio:game-playtest`
- Source specs: `docs/DESIGN.md`, `docs/ART_HUD_PRODUCTION_SPEC.md`, `docs/IDLE_CORE_PRODUCTION_SPEC.md`

## Problem

사용자가 `?qaResearchExpeditionReady=1` 상태에서 씨앗 메뉴의 `젤리콩 씨앗` 목표 CTA를 눌렀을 때 정원으로만 이동하고 실제 구매/심기가 일어나지 않는다고 보고했다. Browser Use `iab`로 재현한 결과, 버튼 라벨은 행동처럼 보였지만 구현은 `setActiveTab("garden")`뿐이라 플레이어가 다음 목표를 진행할 수 없었다.

또한 PR checks에서 `npm run check:ci`가 CI workflow와 Agent Automerge Trial workflow에서 중복 실행되어 내부 검증 시간이 불필요하게 늘어나는 구조가 확인됐다.

## Plan

1. Browser Use `iab`로 사용자가 본 URL과 흐름을 재현하고 before screenshot을 저장한다.
2. 목표 CTA를 단순 이동이 아니라 상태 기반 액션으로 바꾼다.
   - 보유 씨앗이 있으면 열린 밭에 심는다.
   - 보유 씨앗이 없고 구매 가능하면 구매 후 같은 클릭에서 심는다.
   - 잎 부족, 밭 없음, 잠금 상태는 라벨과 disabled 상태로 드러낸다.
3. 연구 단서/새 기록 후속 재배 source와 receipt가 기존 행 심기 흐름과 같은 의미를 유지하게 한다.
4. 모바일 시각 회귀에 목표 CTA 클릭 자체를 검증하는 테스트를 추가한다.
5. Agent Automerge Trial에서 중복 `check:ci`를 제거하고, CI workflow의 baseline check는 유지한다.
6. Browser Use after screenshot과 로컬 검증 결과를 남긴다.

## Acceptance Criteria

- [x] `?qaResearchExpeditionReady=1&qaTab=seeds`에서 목표 CTA가 `구매하고 심기`로 표시된다.
- [x] 같은 버튼을 한 번 누르면 잎이 차감되고 `젤리콩 씨앗`이 정원 plot에 심어진다.
- [x] 정원 화면에서 `젤리콩 씨앗 성장시키기`와 심기 receipt가 보인다.
- [x] 잎 부족/밭 없음/잠금 상태는 no-op이 아니라 disabled 라벨로 설명된다.
- [x] Browser Use `iab` before/after evidence가 `reports/visual/issue-seed-goal-plant-cta/`에 저장된다.
- [x] 중복 CI baseline 실행은 제거하되 PR baseline 검증은 유지된다.

## Verification Commands

```bash
npm run build
npx playwright test tests/visual/p0-mobile-game-shell.spec.ts --config playwright.config.ts -g "도감 목표 CTA|연구 단서 씨앗 구매와 심기|새 기록 다음 씨앗 심기"
npm run check:ci
```

## Browser Use Evidence

- Before no-op: `reports/visual/issue-seed-goal-plant-cta/browser-use-before-noop-20260507.png`
- After button ready: `reports/visual/issue-seed-goal-plant-cta/browser-use-after-button-ready-20260507.png`
- After one-tap planted: `reports/visual/issue-seed-goal-plant-cta/browser-use-after-one-tap-planted-20260507.png`
- Report: `reports/visual/issue-seed-goal-plant-cta/visual-report-20260507.md`

## Implementation Evidence

- Commit: `ace282c` — 씨앗 목표 CTA one-tap 구매/심기, focused regression, 중복 CI 제거.
- PR body artifact: `reports/operations/github-bodies/pr-seed-goal-plant-cta-fix-20260507.md`
- Draft PR: #426 — https://github.com/bborok1234/strange-seed-shop/pull/426
- Local verification: Browser Use `iab` before/after, `npm run build`, focused mobile visual regression 3 passed, `npm run check:governance`, `npm run check:closed-workunit-mirrors`, `npm run check:ci`, `git diff --check`.

## Risks

- 목표 CTA와 개별 씨앗 행의 `심기` 버튼이 같은 semantic source를 유지해야 한다. 이후 씨앗 목표가 늘어나면 `plantSeedGoal` 경로에 동일한 회귀 테스트를 추가해야 한다.
- 긴 visual regression 전체 묶음은 여전히 느릴 수 있다. 이번 수정은 클릭 경로 회귀와 CI 중복 제거로 범위를 제한한다.
