# Harvest reveal next-goal teaser

Status: in_progress
Owner: agent
Created: 2026-04-28
Updated: 2026-04-28
Scope-risk: narrow
Work type: game_feature
Issue: #48
Branch: `codex/harvest-reveal-next-goal`

## Intent

첫 수확 reveal은 플레이어가 생명체에 애착을 느끼는 가장 강한 순간이다. 이 모달 안에 다음에 만날 수 있는 아이를 살짝 보여줘 “하나만 더 키워보자”는 수집 루프를 강화한다.

## Acceptance Criteria

- harvest reveal modal에 다음 목표 creature 이름/씨앗 힌트가 표시된다.
- `qaHarvestReveal=1`은 local dev에서만 동작하고 첫 생명체 reveal + 다음 목표 상태를 재현한다.
- `npm run check:loop`가 reveal next-goal 문구와 QA helper를 검증한다.
- `npm run check:all`이 통과한다.
- visual evidence가 `reports/visual/`에 저장된다.

## Evidence

- Issue #48: https://github.com/bborok1234/strange-seed-shop/issues/48
- Context snapshot: `.omx/context/harvest-reveal-next-goal-20260428T043500Z.md`
- Mobile evidence: `reports/visual/harvest-reveal-next-goal-mobile-20260428.png`
- Desktop evidence: `reports/visual/harvest-reveal-next-goal-desktop-20260428.png`
- Local check: `npm run check:loop` PASS
- Local check: `npm run check:all` PASS
- PR: 생성 예정

## Proposed Plan

1. harvest reveal modal에 `nextCreatureGoal` teaser를 추가한다.
2. local-only `qaHarvestReveal=1` state를 추가해 visual QA가 reveal을 재현할 수 있게 한다.
3. `check-game-loop`가 reveal teaser/QA helper 문구를 검증하게 한다.
4. 모바일/데스크톱 visual evidence를 남긴다.
5. 로컬 검증 후 draft PR을 만들고 GitHub checks를 확인한다.

## Apply Conditions

- save schema를 변경하지 않는다.
- runtime image generation, external navigation, 결제/로그인/ads SDK를 추가하지 않는다.
- 새 dependency를 추가하지 않는다.
- QA URL은 dev localhost에서만 동작한다.

## Verification

- `npm run check:loop`
- `npm run check:all`
- Visual: `reports/visual/harvest-reveal-next-goal-mobile-20260428.png`, `reports/visual/harvest-reveal-next-goal-desktop-20260428.png`
- GitHub PR checks: `Verify game baseline`, `Check automerge eligibility`
