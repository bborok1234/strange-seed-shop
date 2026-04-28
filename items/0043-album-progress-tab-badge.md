# Album progress tab badge

Status: review
Owner: agent
Created: 2026-04-28
Updated: 2026-04-28
Scope-risk: narrow
Work type: game_feature
Issue: #68
Branch: `codex/album-progress-tab-badge`

## Intent

하단 `도감` 탭에 발견 수/전체 수 배지를 붙여, 플레이어가 어느 화면에 있든 수집 진행률을 계속 의식하고 “하나만 더”를 떠올리게 한다.

## Acceptance Criteria

- 하단 `도감` 탭은 save 로드 후 발견 수/전체 수 진행 배지를 보여준다.
- 진행 배지는 active/inactive 상태 모두 읽을 수 있고 기존 5개 탭 레이아웃을 깨지 않는다.
- 기존 도감 화면의 `발견한 생명체 x/y` 계산과 일관되게 유지된다.
- 저장 스키마, 경제 수치, 콘텐츠 JSON, dependency를 변경하지 않는다.
- `npm run check:loop`와 `npm run check:all`이 통과한다.
- 모바일/데스크톱 visual evidence가 `reports/visual/`에 저장된다.

## Evidence

- Issue #68: https://github.com/bborok1234/strange-seed-shop/issues/68
- PR: #69 https://github.com/bborok1234/strange-seed-shop/pull/69
- Context snapshot: `.omx/context/album-progress-tab-badge-20260428T070700Z.md`
- Mobile evidence: `reports/visual/album-progress-tab-badge-mobile-20260428.png`
- Desktop evidence: `reports/visual/album-progress-tab-badge-desktop-20260428.png`
- Browser Use first attempt: project policy still prefers Browser Use, but the current in-app browser `js` execution tool remains unavailable in this runtime; accepted CDP fallback capture was used.
- Local check: `npm run check:loop` PASS
- Local build: `npm run build` PASS
- Visual verdict: PASS score 96 (`.omx/state/album-progress-tab-badge/ralph-progress.json`)
- Architect verification: APPROVED
- Deslop: changed-files-only pass completed; no production-code cleanup needed
- Post-deslop check: `npm run check:all` PASS

## Proposed Plan

1. bottom tab render에서 album tab에만 `albumDiscoveredCount/content.creatures.length` badge를 계산한다.
2. 5-tab 레이아웃을 유지하는 compact badge style을 추가한다.
3. `check-game-loop`가 badge 계산과 접근성 label/copy를 검증하게 한다.
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
- Visual: `reports/visual/album-progress-tab-badge-mobile-20260428.png`, `reports/visual/album-progress-tab-badge-desktop-20260428.png`
- GitHub PR checks: pending for PR #69
