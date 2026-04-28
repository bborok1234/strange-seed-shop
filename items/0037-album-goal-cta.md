# Album next-goal CTA to seed action

Status: in_progress
Owner: agent
Created: 2026-04-28
Updated: 2026-04-28
Scope-risk: narrow
Work type: game_feature
Issue: #56
Branch: `codex/album-goal-cta`

## Intent

도감의 다음 목표 카드가 “무엇을 해야 하는지”를 보여주는 데서 멈추지 않고, 관련 씨앗 행동 화면으로 바로 이어지게 해 수집 루프의 마찰을 줄인다.

## Acceptance Criteria

- 도감 다음 목표 카드에 다음 생명체를 만나기 위한 CTA가 있다.
- CTA를 누르면 관련 씨앗 구매/심기 흐름을 볼 수 있는 씨앗 탭으로 이동한다.
- CTA 문구는 실제 결제/상점 구매가 아니라 게임 내 씨앗/정원 행동임을 명확히 한다.
- `npm run check:loop`가 CTA 문구와 tab 전환 handler를 검증한다.
- `npm run check:all`이 통과한다.
- visual evidence가 `reports/visual/`에 저장된다.

## Evidence

- Issue #56: https://github.com/bborok1234/strange-seed-shop/issues/56
- Context snapshot: `.omx/context/album-goal-cta-20260428T054100Z.md`
- Mobile evidence: `reports/visual/album-goal-cta-mobile-20260428.png`
- Desktop evidence: `reports/visual/album-goal-cta-desktop-20260428.png`
- Browser Use first attempt: skill read; Node REPL `js` tool still unavailable in this environment, so accepted CDP fallback capture was used.
- Local check: `npm run check:loop` PASS
- Local build: `npm run build` PASS
- Local check: `npm run check:all` PASS
- Visual verdict: PASS score 93 (`.omx/state/album-goal-cta/ralph-progress.json`)
- PR: #57 https://github.com/bborok1234/strange-seed-shop/pull/57

## Proposed Plan

1. 도감 next-goal card에 관련 씨앗으로 이동하는 CTA를 추가한다.
2. CTA는 `setActiveTab("seeds")`로 씨앗 주머니/구매/심기 흐름을 보여준다.
3. `check-game-loop`가 CTA 문구와 handler를 검증하게 한다.
4. 모바일/데스크톱 visual evidence를 남긴다.
5. 로컬 검증 후 PR을 만들고 GitHub checks를 확인한다.

## Apply Conditions

- save schema를 변경하지 않는다.
- runtime image generation, external navigation, 결제/로그인/ads SDK를 추가하지 않는다.
- 실제 고객 데이터, credential, 실채널 GTM을 건드리지 않는다.
- 새 dependency를 추가하지 않는다.

## Verification

- `npm run check:loop`
- `npm run check:all`
- Visual: `reports/visual/album-goal-cta-mobile-20260428.png`, `reports/visual/album-goal-cta-desktop-20260428.png`
- GitHub PR checks: `Verify game baseline`, `Check automerge eligibility`
