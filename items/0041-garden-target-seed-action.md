# Garden target seed action bridge

Status: in_progress
Owner: agent
Created: 2026-04-28
Updated: 2026-04-28
Scope-risk: narrow
Work type: game_feature
Issue: #64
Branch: `codex/garden-target-seed-action`

## Intent

씨앗 탭에서 다음 도감 목표 seed를 알게 된 뒤, 실제 구매/심기 버튼이 있는 정원 seed shop에서도 같은 목표가 즉시 보이게 해 행동 전환을 끊기지 않게 한다.

## Acceptance Criteria

- 정원 seed shop에서 다음 도감 목표 seed row가 `다음 발견` 배지와 시각 강조를 가진다.
- 목표 seed가 기본 표시 목록 밖에 있어도 정원 seed shop에 표시된다.
- 씨앗 탭 목표 배너에 정원 행동으로 돌아가는 CTA가 있다.
- 저장 스키마, 경제 수치, 콘텐츠 JSON을 변경하지 않는다.
- `npm run check:loop`와 `npm run check:all`이 통과한다.
- 모바일/데스크톱 visual evidence가 `reports/visual/`에 저장된다.

## Evidence

- Issue #64: https://github.com/bborok1234/strange-seed-shop/issues/64
- Context snapshot: `.omx/context/garden-target-seed-action-20260428T063832Z.md`
- Garden mobile evidence: `reports/visual/garden-target-seed-action-mobile-20260428.png`
- Seed tab CTA mobile evidence: `reports/visual/garden-target-seed-action-seeds-mobile-20260428.png`
- Desktop evidence: `reports/visual/garden-target-seed-action-desktop-20260428.png`
- Browser Use first attempt: skill read; Node REPL `js` execution tool unavailable after tool discovery, so accepted CDP fallback capture was used.
- Local check: `npm run check:loop` PASS
- Local build: `npm run build` PASS
- Local check: `npm run check:all` PASS
- Visual verdict: PASS score 95 (`.omx/state/garden-target-seed-action/ralph-progress.json`)
- Architect verification: APPROVED
- Deslop: changed-files-only pass completed; no production-code cleanup needed beyond scoped target-row reuse
- PR: #65 https://github.com/bborok1234/strange-seed-shop/pull/65

## Proposed Plan

1. 정원 seed shop list도 `seedInventorySeeds`의 target-first/fallback-injected ordering을 재사용한다.
2. 목표 seed shop row에 target class와 `다음 발견` badge를 붙인다.
3. 씨앗 탭 목표 배너에 `정원에서 심기` CTA를 추가한다.
4. `check-game-loop`가 정원 seed shop target row와 CTA 문구/handler를 검증하게 한다.
5. 모바일/데스크톱 visual evidence와 Ralph verdict를 남긴다.

## Apply Conditions

- 기존 Phase 0 save/content/analytics contract를 깨지 않는다.
- 실제 고객 데이터, credential, 실채널 GTM을 건드리지 않는다.
- 새 dependency를 추가하지 않는다.
- 결제/로그인/ads SDK/external navigation/runtime image generation을 추가하지 않는다.

## Verification

- `npm run check:loop`
- `npm run check:all`
- Visual: `reports/visual/garden-target-seed-action-mobile-20260428.png`, `reports/visual/garden-target-seed-action-desktop-20260428.png`
- GitHub PR checks: `Verify game baseline`, `Check automerge eligibility`
