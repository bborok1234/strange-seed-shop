# Seed growth and harvest summary

Status: review
Owner: agent
Created: 2026-04-28
Updated: 2026-04-28
Scope-risk: narrow
Work type: game_feature
Issue: #72
Branch: `codex/seed-growth-harvest-summary`

## Intent

씨앗 row에 성장 시간과 수확 잎 보상을 함께 보여줘, 플레이어가 어떤 씨앗을 사고 심을지 더 쉽게 판단하게 한다.

## Acceptance Criteria

- 정원 seed shop row가 각 씨앗의 성장 시간과 수확 잎 보상을 보여준다.
- 씨앗 주머니 row도 같은 요약을 보여 기존 `60s` 단독 표기보다 명확하다.
- 기존 만날 아이/발견 상태/부족분/구매·심기 CTA는 유지한다.
- 저장 스키마, 경제 수치, 콘텐츠 JSON, dependency를 변경하지 않는다.
- `npm run check:loop`와 `npm run check:all`이 통과한다.
- 모바일/데스크톱 visual evidence가 `reports/visual/`에 저장된다.

## Evidence

- Issue #72: https://github.com/bborok1234/strange-seed-shop/issues/72
- PR: #73 https://github.com/bborok1234/strange-seed-shop/pull/73
- Context snapshot: `.omx/context/seed-growth-harvest-summary-20260428T073000Z.md`
- Mobile garden evidence: `reports/visual/seed-growth-harvest-summary-mobile-20260428.png`
- Mobile seeds evidence: `reports/visual/seed-growth-harvest-summary-seeds-mobile-20260428.png`
- Desktop evidence: `reports/visual/seed-growth-harvest-summary-desktop-20260428.png`
- Browser Use first attempt: project policy still prefers Browser Use, but the current in-app browser `js` execution tool remains unavailable in this runtime; accepted CDP fallback capture was used.
- Local check: `npm run check:loop` PASS
- Local build: `npm run build` PASS
- Visual verdict: PASS score 95 (`.omx/state/seed-growth-harvest-summary/ralph-progress.json`)
- Architect verification: APPROVED
- Deslop: changed-files-only pass completed; summary copy shortened for mobile readability
- Post-deslop check: `npm run check:all` PASS

## Proposed Plan

1. seed content의 `baseGrowthSeconds`와 `baseHarvestLeaves`를 format하는 helper를 추가한다.
2. 정원 seed shop creature preview line에 성장/수확 요약을 붙인다.
3. 씨앗 주머니 row의 우측 time-only meta를 성장/수확 요약으로 교체한다.
4. `check-game-loop`가 helper와 copy를 검증하게 한다.
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
- Visual: `reports/visual/seed-growth-harvest-summary-mobile-20260428.png`, `reports/visual/seed-growth-harvest-summary-seeds-mobile-20260428.png`, `reports/visual/seed-growth-harvest-summary-desktop-20260428.png`
- GitHub PR checks: pending for PR #73
