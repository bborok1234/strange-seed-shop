# Expedition progress hint

Status: review
Owner: agent
Created: 2026-04-28
Updated: 2026-04-28
Scope-risk: narrow
Work type: game_feature
Issue: #80
PR: #81 https://github.com/bborok1234/strange-seed-shop/pull/81
Branch: `codex/expedition-progress-hint`

## Intent

원정 시작 후 남은 시간과 보상 준비 상태를 보여줘, 짧은 idle wait/comeback 루프를 더 명확하게 만든다.

## Acceptance Criteria

- 진행 중인 원정은 남은 시간 힌트를 보여준다.
- 완료된 원정은 보상 수령 가능 상태와 보상 요약을 보여준다.
- 기존 원정 시작/보상 받기 CTA, reward preview, unlock hint, claim 지급 로직은 유지한다.
- 저장 스키마, 경제 수치, 콘텐츠 JSON, dependency를 변경하지 않는다.
- `npm run check:loop`와 `npm run check:all`이 통과한다.
- 모바일/데스크톱 visual evidence가 `reports/visual/`에 저장된다.

## Evidence

- Issue #80: https://github.com/bborok1234/strange-seed-shop/issues/80
- Context snapshot: `.omx/context/expedition-progress-hint-20260428T082200Z.md`
- Mobile active evidence: `reports/visual/expedition-progress-hint-mobile-20260428.png`
- Desktop ready evidence: `reports/visual/expedition-progress-hint-desktop-20260428.png`
- Browser Use first attempt: tool discovery did not expose the in-app browser `js` execution tool in this runtime; accepted CDP fallback capture was used.
- Local check: `npm run check:loop` PASS
- Local build: `npm run build` PASS
- Local full check: `npm run check:all` PASS
- Visual verdict: PASS score 94 (`.omx/state/expedition-progress-hint/ralph-progress.json`)
- Architect verification: APPROVED
- Deslop: changed-files-only pass PASS (`.omx/state/expedition-progress-hint/deslop-report-20260428.md`)
- Post-deslop check: `npm run check:all` PASS

## Proposed Plan

1. active expedition의 남은 시간을 `startedAt + durationSeconds - now`로 계산한다.
2. 진행 중/완료 상태별 progress note를 원정 탭에 추가한다.
3. preview의 reward summary를 helper로 재사용해 완료 보상 요약과 맞춘다.
4. active/ready QA fixture와 `check-game-loop` 회귀 문구를 추가한다.
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
- Visual: `reports/visual/expedition-progress-hint-mobile-20260428.png`, `reports/visual/expedition-progress-hint-desktop-20260428.png`
- GitHub PR checks: pending for PR #81
