# Seed creature preview

Status: in_progress
Owner: agent
Created: 2026-04-28
Updated: 2026-04-28
Scope-risk: narrow
Work type: game_feature
Issue: #46
Branch: `codex/seed-creature-preview`

## Intent

씨앗을 구매하거나 주머니에서 고를 때 “이 씨앗에서 누구를 만날 수 있는지”를 바로 보여줘, 씨앗 선택이 단순 경제 버튼이 아니라 다음 생명체 수집 기대가 되게 한다.

## Acceptance Criteria

- 씨앗 구매 row에 “만날 아이” creature preview copy가 표시된다.
- 씨앗 주머니 tab에도 같은 preview가 표시된다.
- preview creature는 `seed.creaturePool[0]`와 일치한다.
- runtime image generation 없이 기존 manifest asset/render 경로만 사용한다.
- `npm run check:loop`가 seed row preview 문구와 deterministic creature mapping을 검증한다.
- `npm run check:all`이 통과한다.

## Evidence

- Issue #46: https://github.com/bborok1234/strange-seed-shop/issues/46
- Context snapshot: `.omx/context/seed-creature-preview-20260428T042700Z.md`
- Mobile evidence: `reports/visual/seed-creature-preview-mobile-20260428.png`
- Desktop evidence: `reports/visual/seed-creature-preview-desktop-20260428.png`
- Local check: `npm run check:loop` PASS
- Local check: `npm run check:all` PASS
- PR: 생성 예정

## Proposed Plan

1. `getDeterministicCreatureForSeed(seed)` helper로 현재 harvest outcome과 preview source를 통일한다.
2. seed shop row와 seed inventory row에 creature name + 발견/미발견 상태를 표시한다.
3. `check-game-loop`에 seed creature preview mapping 검증을 추가한다.
4. 모바일/데스크톱 visual evidence를 남긴다.
5. 로컬 검증 후 draft PR을 만들고 GitHub checks를 확인한다.

## Apply Conditions

- save schema를 변경하지 않는다.
- runtime image generation, external navigation, 결제/로그인/ads SDK를 추가하지 않는다.
- 새 dependency를 추가하지 않는다.
- 현재 harvest deterministic 규칙과 다른 creature를 preview하지 않는다.

## Verification

- `npm run check:loop`
- `npm run check:all`
- Visual: `reports/visual/seed-creature-preview-mobile-20260428.png`, `reports/visual/seed-creature-preview-desktop-20260428.png`
- GitHub PR checks: `Verify game baseline`, `Check automerge eligibility`
