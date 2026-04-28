# Expedition reward preview

Status: review
Owner: agent
Created: 2026-04-28
Updated: 2026-04-28
Scope-risk: narrow
Work type: game_feature
Issue: #76
PR: #77 https://github.com/bborok1234/strange-seed-shop/pull/77
Branch: `codex/expedition-reward-preview`

## Intent

원정 탭에서 첫 원정의 시간, 필요 생명체 수, 보상 요약을 시작 전부터 보여줘 원정이 다음 성장 루프임을 명확히 한다.

## Acceptance Criteria

- 원정 탭이 첫 원정의 이름, duration, required creatures, rewards를 시작 전 preview로 보여준다.
- 활성 원정 상태에서도 같은 보상 요약이나 완료 상태가 읽힌다.
- 기존 원정 시작/보상 받기 CTA와 unlock 조건은 유지한다.
- 저장 스키마, 경제 수치, 콘텐츠 JSON, dependency를 변경하지 않는다.
- `npm run check:loop`와 `npm run check:all`이 통과한다.
- 모바일/데스크톱 visual evidence가 `reports/visual/`에 저장된다.

## Evidence

- Issue #76: https://github.com/bborok1234/strange-seed-shop/issues/76
- Context snapshot: `.omx/context/expedition-reward-preview-20260428T075300Z.md`
- Mobile evidence: `reports/visual/expedition-reward-preview-mobile-20260428.png`
- Desktop evidence: `reports/visual/expedition-reward-preview-desktop-20260428.png`
- Browser Use first attempt: project policy still prefers Browser Use, but the current in-app browser `js` execution tool remains unavailable in this runtime; accepted CDP fallback capture was used.
- Local check: `npm run check:loop` PASS
- Local build: `npm run build` PASS
- Local full check: `npm run check:all` PASS
- Architect verification: APPROVED
- Visual verdict: PASS score 95 (`.omx/state/expedition-reward-preview/ralph-progress.json`)
- Deslop: changed-files-only pass PASS (`.omx/state/expedition-reward-preview/deslop-report-20260428.md`)
- Post-deslop check: `npm run check:all` PASS

## Proposed Plan

1. 첫 원정 config를 expedition tab render에서 preview로 읽는다.
2. duration/required creature/reward summary card를 추가한다.
3. 기존 start/claim button과 ready state를 유지한다.
4. `check-game-loop`가 preview copy/helper를 검증하게 한다.
5. 모바일/데스크톱 visual evidence와 Ralph verdict를 남긴다.

## Reward scope note

현재 Phase 0 claim 로직이 실제로 지급하는 보상은 `rewardLeaves`와 `rewardMaterials`다. `pollenChance`는 기존 claim semantics에도 반영되지 않으므로 이번 preview에서는 지급 보상으로 표시하지 않고, 별도 원정 보상 정렬 작업으로 남긴다.

## Apply Conditions

- 기존 Phase 0 save/content/analytics contract를 깨지 않는다.
- 실제 고객 데이터, credential, 실채널 GTM을 건드리지 않는다.
- 새 dependency를 추가하지 않는다.
- 결제/로그인/ads SDK/external navigation/runtime image generation을 추가하지 않는다.

## Verification

- `npm run check:loop` PASS
- `npm run build` PASS
- `npm run check:all` PASS
- Visual: `reports/visual/expedition-reward-preview-mobile-20260428.png`, `reports/visual/expedition-reward-preview-desktop-20260428.png`
- GitHub PR checks: pending for PR #77
