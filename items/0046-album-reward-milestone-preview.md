# Album reward milestone preview

Status: review
Owner: agent
Created: 2026-04-28
Updated: 2026-04-28
Scope-risk: narrow
Work type: game_feature
Issue: #74
Branch: `codex/album-reward-milestone-preview`

## Intent

도감 화면에 다음 album milestone의 필요 발견 수와 보상을 보여줘, 플레이어가 “몇 마리만 더 모으면 보상”을 즉시 이해하게 한다.

## Acceptance Criteria

- 도감 화면에 다음 미달성 album milestone의 진행도와 보상이 표시된다.
- 현재 발견 수/필요 발견 수, 남은 발견 수, 잎/꽃가루 보상이 읽힌다.
- 기존 도감 다음 목표 CTA와 미발견 슬롯 단서는 유지한다.
- 저장 스키마, 경제 수치, 콘텐츠 JSON, dependency를 변경하지 않는다.
- 이번 작업은 보상 claim 로직을 확장하지 않고 preview/teaser만 추가한다.
- `npm run check:loop`와 `npm run check:all`이 통과한다.
- 모바일/데스크톱 visual evidence가 `reports/visual/`에 저장된다.

## Evidence

- Issue #74: https://github.com/bborok1234/strange-seed-shop/issues/74
- PR: #75 https://github.com/bborok1234/strange-seed-shop/pull/75
- Context snapshot: `.omx/context/album-reward-milestone-preview-20260428T074000Z.md`
- Mobile evidence: `reports/visual/album-reward-milestone-preview-mobile-20260428.png`
- Desktop evidence: `reports/visual/album-reward-milestone-preview-desktop-20260428.png`
- Browser Use first attempt: project policy still prefers Browser Use, but the current in-app browser `js` execution tool remains unavailable in this runtime; accepted CDP fallback capture was used.
- Local check: `npm run check:loop` PASS
- Local build: `npm run build` PASS
- Visual verdict: PASS score 96 (`.omx/state/album-reward-milestone-preview/ralph-progress.json`)
- Architect verification: APPROVED
- Deslop: changed-files-only pass completed; claim logic remains intentionally unchanged
- Post-deslop check: `npm run check:all` PASS

## Proposed Plan

1. 기존 rewards config에서 다음 unclaimed/incomplete album milestone을 찾는 preview helper를 추가한다.
2. 도감 panel에 진행도, 남은 발견 수, 잎/꽃가루 reward teaser를 표시한다.
3. 보상 claim logic은 확장하지 않고 preview-only임을 item에 명시한다.
4. `check-game-loop`가 milestone preview 문구와 helper를 검증하게 한다.
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
- Visual: `reports/visual/album-reward-milestone-preview-mobile-20260428.png`, `reports/visual/album-reward-milestone-preview-desktop-20260428.png`
- GitHub PR checks: pending for PR #75
