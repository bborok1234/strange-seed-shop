# Expedition unlock hint

Status: review
Owner: agent
Created: 2026-04-28
Updated: 2026-04-28
Scope-risk: narrow
Work type: game_feature
Issue: #78
PR: #79 https://github.com/bborok1234/strange-seed-shop/pull/79
Branch: `codex/expedition-unlock-hint`

## Intent

원정 탭에서 첫 원정을 아직 시작할 수 없을 때 필요한 생명체 수를 직접 보여줘, 첫 수확 후 원정으로 이어지는 루프를 더 명확하게 만든다.

## Acceptance Criteria

- 생명체가 부족할 때 원정 탭이 남은 발견 수를 알려준다.
- 생명체가 충분하고 active expedition이 없을 때는 시작 가능 상태를 긍정적으로 알려준다.
- 기존 원정 preview, 시작 버튼, 보상 수령 CTA, unlock 조건은 유지한다.
- 저장 스키마, 경제 수치, 콘텐츠 JSON, dependency를 변경하지 않는다.
- `npm run check:loop`와 `npm run check:all`이 통과한다.
- 모바일/데스크톱 visual evidence가 `reports/visual/`에 저장된다.

## Evidence

- Issue #78: https://github.com/bborok1234/strange-seed-shop/issues/78
- Context snapshot: `.omx/context/expedition-unlock-hint-20260428T080800Z.md`
- Mobile locked evidence: `reports/visual/expedition-unlock-hint-mobile-20260428.png`
- Desktop ready evidence: `reports/visual/expedition-unlock-hint-desktop-20260428.png`
- Browser Use first attempt: tool discovery did not expose the in-app browser `js` execution tool in this runtime; accepted CDP fallback capture was used.
- Local check: `npm run check:loop` PASS
- Local build: `npm run build` PASS
- Local full check: `npm run check:all` PASS
- Visual verdict: PASS score 94 (`.omx/state/expedition-unlock-hint/ralph-progress.json`)
- Architect verification: APPROVED
- Deslop: changed-files-only pass PASS (`.omx/state/expedition-unlock-hint/deslop-report-20260428.md`)
- Post-deslop check: `npm run check:all` PASS

## Proposed Plan

1. first expedition requirement와 discovered creature count로 shortfall을 계산한다.
2. 원정 버튼 위에 locked/ready hint copy를 추가한다.
3. 기존 start/claim semantics와 preview를 보존한다.
4. `check-game-loop`가 unlock hint copy/class를 검증하게 한다.
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
- Visual: `reports/visual/expedition-unlock-hint-mobile-20260428.png`, `reports/visual/expedition-unlock-hint-desktop-20260428.png`
- GitHub PR checks: pending for PR #79
