# Seed purchase shortfall copy

Status: review
Owner: agent
Created: 2026-04-28
Updated: 2026-04-28
Scope-risk: narrow
Work type: game_feature
Issue: #66
Branch: `codex/seed-purchase-shortfall-copy`

## Intent

도감 목표 seed row가 보이더라도 잎이 부족하면 왜 구매가 막혔는지 즉시 이해하게 해, 다음 행동이 “잎 몇 개만 더 모으기”로 이어지게 한다.

## Acceptance Criteria

- 잎이 부족한 seed shop 구매 버튼은 필요한 부족분을 보여준다.
- 다음 발견 target row에는 비용 부족분 안내가 함께 보인다.
- 구매 가능 상태의 기존 구매 문구는 유지된다.
- 저장 스키마, 경제 수치, 콘텐츠 JSON을 변경하지 않는다.
- `npm run check:loop`와 `npm run check:all`이 통과한다.
- 모바일/데스크톱 visual evidence가 `reports/visual/`에 저장된다.

## Evidence

- Issue #66: https://github.com/bborok1234/strange-seed-shop/issues/66
- PR: #67 https://github.com/bborok1234/strange-seed-shop/pull/67
- Context snapshot: `.omx/context/seed-purchase-shortfall-20260428T065145Z.md`
- Mobile evidence: `reports/visual/seed-purchase-shortfall-mobile-20260428.png`
- Desktop evidence: `reports/visual/seed-purchase-shortfall-desktop-20260428.png`
- Browser Use first attempt: project policy still prefers Browser Use, but the current in-app browser `js` execution tool remains unavailable in this runtime; accepted CDP fallback capture was used.
- Local check: `npm run check:loop` PASS
- Checker reinforcement: `scripts/check-game-loop.mjs` now validates the non-negative shortfall calculation, positive-shortfall helper gate, purchase fallback copy, and leaf-affordability disabled condition.
- Local build: `npm run build` PASS
- Visual verdict: PASS score 96 (`.omx/state/seed-purchase-shortfall/ralph-progress.json`)
- Architect verification: APPROVED
- Deslop: changed-files-only pass completed; no production-code cleanup needed beyond checker reinforcement
- Post-deslop check: `npm run check:all` PASS

## Proposed Plan

1. 정원 seed shop의 구매 가능 여부 계산에서 부족 잎 수를 함께 계산한다.
2. 부족 상태의 target row에 “n 잎 더 모으면 구매 가능” 안내와 버튼 문구를 노출한다.
3. `check-game-loop`가 shortfall copy와 상태 계산 회귀를 잡게 한다.
4. 모바일/데스크톱 visual evidence와 Ralph verdict를 남긴다.

## Apply Conditions

- 기존 Phase 0 save/content/analytics contract를 깨지 않는다.
- 실제 고객 데이터, credential, 실채널 GTM을 건드리지 않는다.
- 새 dependency를 추가하지 않는다.
- 결제/로그인/ads SDK/external navigation/runtime image generation을 추가하지 않는다.

## Verification

- `npm run check:loop` PASS
- `npm run build` PASS
- `npm run check:all` PASS
- Visual: `reports/visual/seed-purchase-shortfall-mobile-20260428.png`, `reports/visual/seed-purchase-shortfall-desktop-20260428.png`
- GitHub PR checks: pending for PR #67
