# Expedition tab status badge

Status: review
Owner: agent
Created: 2026-04-28
Updated: 2026-04-28
Scope-risk: narrow
Work type: game_feature
Issue: #82
PR: #83 https://github.com/bborok1234/strange-seed-shop/pull/83
Branch: `codex/expedition-tab-status-badge`

## Intent

원정이 진행 중이거나 완료됐을 때 하단 `원정` 탭 자체에 상태 배지를 보여, 다른 화면에서도 복귀/수령 이유를 놓치지 않게 한다.

## Acceptance Criteria

- active expedition이 진행 중이면 하단 `원정` 탭에 `진행` 배지가 보인다.
- active expedition이 완료되어 보상 수령 가능하면 하단 `원정` 탭에 `완료` 배지가 보인다.
- 기존 원정 preview, unlock/progress hint, start/claim 지급 로직은 유지한다.
- 저장 스키마, 경제 수치, 콘텐츠 JSON, dependency를 변경하지 않는다.
- `npm run check:loop`와 `npm run check:all`이 통과한다.
- 모바일/데스크톱 visual evidence가 `reports/visual/`에 저장된다.

## Evidence

- Issue #82: https://github.com/bborok1234/strange-seed-shop/issues/82
- Context snapshot: `.omx/context/expedition-tab-status-badge-20260428T084500Z.md`
- Mobile ready evidence: `reports/visual/expedition-tab-status-badge-mobile-20260428.png`
- Desktop active evidence: `reports/visual/expedition-tab-status-badge-desktop-20260428.png`
- Browser Use first attempt: tool discovery did not expose the in-app browser `js` execution tool in this runtime; accepted CDP fallback capture was used.
- Local check: `npm run check:loop` PASS
- Local build: `npm run build` PASS
- Local full check: `npm run check:all` PASS
- Visual verdict: PASS score 95 (`.omx/state/expedition-tab-status-badge/ralph-progress.json`)
- Architect verification: APPROVED
- Deslop: changed-files-only pass PASS (`.omx/state/expedition-tab-status-badge/deslop-report-20260428.md`)
- Post-deslop check: `npm run check:all` PASS

## Proposed Plan

1. bottom tab render에서 active expedition 상태를 `진행`/`완료` badge로 계산한다.
2. 기존 도감 progress badge 스타일을 재사용한다.
3. 원정 tab panel의 start/claim/progress semantics는 건드리지 않는다.
4. `check-game-loop`가 badge 상태 계산/copy를 검증하게 한다.
5. 모바일/데스크톱 visual evidence와 Ralph verdict를 남긴다.

## Apply Conditions

- 기존 Phase 0 save/content/analytics contract를 깨지 않는다.
- 실제 고객 데이터, credential, 실채널 GTM을 건드리지 않는다.
- 새 dependency를 추가하지 않는다.
- 결제/로그인/ads SDK/external navigation/runtime image generation을 추가하지 않는다.

## Verification

- `npm run check:loop` PASS
- `npm run build` PASS
- `npm run check:all` PASS
- Visual: `reports/visual/expedition-tab-status-badge-mobile-20260428.png`, `reports/visual/expedition-tab-status-badge-desktop-20260428.png`
- GitHub PR checks: pending for PR #83
