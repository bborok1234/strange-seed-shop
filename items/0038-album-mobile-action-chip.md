# Album mobile next-action chip

Status: in_progress
Owner: agent
Created: 2026-04-28
Updated: 2026-04-28
Scope-risk: narrow
Work type: game_feature
Issue: #58
Branch: `codex/album-mobile-action-chip`

## Intent

도감 탭에 들어오자마자 다음 수집 행동을 모바일 첫 화면에서도 보이게 해, 잠긴 슬롯 탐색이 “무엇을 눌러야 하지?”로 끊기지 않고 바로 씨앗 행동으로 이어지게 한다.

## Acceptance Criteria

- 도감 상단 진행 요약 근처에 compact `다음 발견` CTA chip이 표시된다.
- Chip은 다음 미발견 생명체 이름, 희귀도, 추천 씨앗 단서, 씨앗 탭 이동 행동을 포함한다.
- Chip 클릭은 기존 도감 next-goal CTA와 동일하게 `setActiveTab("seeds")`로 씨앗 탭을 연다.
- 저장 스키마, 결제/로그인/ads SDK, 외부 배포, runtime image generation을 추가하지 않는다.
- `npm run check:loop`와 `npm run check:all`이 통과한다.
- 모바일/데스크톱 visual evidence가 `reports/visual/`에 저장된다.

## Evidence

- Issue #58: https://github.com/bborok1234/strange-seed-shop/issues/58
- Context snapshot: `.omx/context/album-mobile-action-chip-20260428T055429Z.md`
- Mobile evidence: `reports/visual/album-mobile-action-chip-mobile-20260428.png`
- Desktop evidence: `reports/visual/album-mobile-action-chip-desktop-20260428.png`
- Browser Use first attempt: skill read; Node REPL `js` execution tool unavailable after tool discovery, so accepted CDP fallback capture was used.
- Local check: `npm run check:loop` PASS
- Local build: `npm run build` PASS
- Local check: `npm run check:all` PASS after `npm run update:dashboard`
- Visual verdict: PASS score 94 (`.omx/state/album-mobile-action-chip/ralph-progress.json`)
- Architect verification: APPROVED
- Deslop: changed-files-only pass; production code cleanup not needed
- PR: #59 https://github.com/bborok1234/strange-seed-shop/pull/59

## Proposed Plan

1. `src/App.tsx` 도감 상단에 `nextCreatureGoal` 기반 compact action chip을 추가한다.
2. `src/styles.css`에서 모바일 첫 화면에 맞는 작고 강한 CTA 스타일을 추가한다.
3. `scripts/check-game-loop.mjs`가 chip 문구/클래스/희귀도 단서/씨앗 탭 이동을 검증하게 한다.
4. 모바일/데스크톱 visual evidence와 Ralph verdict를 남긴다.
5. 로컬 검증, PR checks, merge 후 main 검증까지 완료한다.

## Apply Conditions

- 기존 Phase 0 save/content/analytics contract를 깨지 않는다.
- 실제 고객 데이터, credential, 실채널 GTM을 건드리지 않는다.
- 새 dependency를 추가하지 않는다.

## Verification

- `npm run check:loop`
- `npm run check:all`
- Visual: `reports/visual/album-mobile-action-chip-mobile-20260428.png`, `reports/visual/album-mobile-action-chip-desktop-20260428.png`
- GitHub PR checks: `Verify game baseline`, `Check automerge eligibility`
