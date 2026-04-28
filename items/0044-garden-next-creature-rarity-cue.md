# Garden next creature rarity cue

Status: review
Owner: agent
Created: 2026-04-28
Updated: 2026-04-28
Scope-risk: narrow
Work type: game_feature
Issue: #70
Branch: `codex/garden-next-creature-rarity-cue`

## Intent

정원 첫 화면의 `다음에 만날 아이` 카드에 희귀도·계열·씨앗 단서를 붙여, 다음 수집 목표가 더 카드 수집처럼 느껴지게 한다.

## Acceptance Criteria

- 정원 next creature card가 다음 생명체의 희귀도와 계열을 표시한다.
- 기존 힌트/씨앗/도감 진행 copy는 유지한다.
- 모바일 360px에서 카드가 과하게 커지거나 주요 seed shop CTA를 밀어내지 않는다.
- 저장 스키마, 경제 수치, 콘텐츠 JSON, dependency를 변경하지 않는다.
- `npm run check:loop`와 `npm run check:all`이 통과한다.
- 모바일/데스크톱 visual evidence가 `reports/visual/`에 저장된다.

## Evidence

- Issue #70: https://github.com/bborok1234/strange-seed-shop/issues/70
- PR: #71 https://github.com/bborok1234/strange-seed-shop/pull/71
- Context snapshot: `.omx/context/garden-next-creature-rarity-cue-20260428T071800Z.md`
- Mobile evidence: `reports/visual/garden-next-creature-rarity-cue-mobile-20260428.png`
- Desktop evidence: `reports/visual/garden-next-creature-rarity-cue-desktop-20260428.png`
- Browser Use first attempt: project policy still prefers Browser Use, but the current in-app browser `js` execution tool remains unavailable in this runtime; accepted CDP fallback capture was used.
- Local check: `npm run check:loop` PASS
- Local build: `npm run build` PASS
- Visual verdict: PASS score 95 (`.omx/state/garden-next-creature-rarity-cue/ralph-progress.json`)
- Architect verification: APPROVED
- Deslop: changed-files-only pass completed; removed no-wrap overflow risk from the new pill
- Post-deslop check: `npm run check:all` PASS

## Proposed Plan

1. 정원 next creature card에 rarity/family/seed trait line을 추가한다.
2. trait line을 작은 pill copy로 스타일링해 모바일 카드 높이 증가를 최소화한다.
3. `check-game-loop`가 trait line helper 사용을 검증하게 한다.
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
- Visual: `reports/visual/garden-next-creature-rarity-cue-mobile-20260428.png`, `reports/visual/garden-next-creature-rarity-cue-desktop-20260428.png`
- GitHub PR checks: pending for PR #71
