# Next creature goal card

Status: in_progress
Owner: agent
Created: 2026-04-28
Updated: 2026-04-28
Scope-risk: narrow
Work type: game_feature
Issue: #44
Branch: `codex/next-creature-goal-card`

## Intent

첫 생명체를 수확한 뒤 플레이어가 “다음엔 누구를 만날 수 있지?”를 바로 느끼도록, 현재 deterministic harvest 규칙에서 실제로 얻을 수 있는 다음 미발견 생명체 목표를 정원 HUD와 도감에 보여준다.

## Acceptance Criteria

- 첫 발견 이후 “다음에 만날 아이” 카드가 렌더링된다.
- 카드는 unlock된 seed 중 deterministic 첫 creature가 아직 미발견인 다음 목표를 가리킨다.
- 카드에 이름, 힌트, 어울리는 씨앗, 도감 진행도가 표시된다.
- runtime image generation 없이 기존 manifest asset만 사용한다.
- `npm run check:loop`가 next collection goal 데이터를 검증한다.
- `npm run check:all`이 통과한다.

## Evidence

- Issue #44: https://github.com/bborok1234/strange-seed-shop/issues/44
- Context snapshot: `.omx/context/next-creature-goal-card-20260428T041000Z.md`
- Mobile evidence: `reports/visual/next-creature-goal-mobile-20260428.png`
- Desktop evidence: `reports/visual/next-creature-goal-desktop-20260428.png`
- Local check: `npm run check:loop` PASS
- Local check: `npm run check:all` PASS
- PR: 생성 예정

## Proposed Plan

1. save/content에서 다음 미발견 deterministic creature goal을 derived state로 계산한다.
2. 정원 HUD 상단에 다음 생명체 카드와 도감 진행도를 보여준다.
3. 도감 tab에도 다음 도감 칸 teaser를 추가한다.
4. `check-game-loop`가 첫 이후 목표 seed/creature를 검증하게 한다.
5. 모바일/데스크톱 visual evidence를 남기고 PR을 생성한다.

## Apply Conditions

- save schema를 변경하지 않는다.
- runtime image generation, external navigation, 결제/로그인/ads SDK를 추가하지 않는다.
- 새 dependency를 추가하지 않는다.
- 현재 harvest deterministic 규칙과 어긋나는 creature를 목표로 보여주지 않는다.

## Verification

- `npm run check:loop`
- `npm run check:all`
- Visual: `reports/visual/next-creature-goal-mobile-20260428.png`, `reports/visual/next-creature-goal-desktop-20260428.png`
- GitHub PR checks: `Verify game baseline`, `Check automerge eligibility`
