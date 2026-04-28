# Seed tab album target highlight

Status: in_progress
Owner: agent
Created: 2026-04-28
Updated: 2026-04-28
Scope-risk: narrow
Work type: game_feature
Issue: #60
Branch: `codex/seed-tab-target-highlight`

## Intent

도감 CTA로 씨앗 탭에 도착한 뒤에도 플레이어가 “어떤 씨앗이 다음 아이와 연결되는지”를 즉시 알게 해, 다음 구매/심기 행동의 마찰을 줄인다.

## Acceptance Criteria

- 씨앗 탭 상단에 다음 도감 목표 씨앗 안내가 표시된다.
- 안내는 목표 생명체 이름, 희귀도, 연결 씨앗 이름을 포함한다.
- 해당 seed inventory row가 `다음 발견` 배지 또는 시각 강조를 가진다.
- 저장 스키마, 경제 수치, 콘텐츠 JSON을 변경하지 않는다.
- `npm run check:loop`와 `npm run check:all`이 통과한다.
- 모바일/데스크톱 visual evidence가 `reports/visual/`에 저장된다.

## Evidence

- Issue #60: https://github.com/bborok1234/strange-seed-shop/issues/60
- Context snapshot: `.omx/context/seed-tab-target-highlight-20260428T060808Z.md`
- Mobile evidence: `reports/visual/seed-tab-target-highlight-mobile-20260428.png`
- Desktop evidence: `reports/visual/seed-tab-target-highlight-desktop-20260428.png`
- Browser Use first attempt: skill read; Node REPL `js` execution tool unavailable after tool discovery, so accepted CDP fallback capture was used.
- Local check: `npm run check:loop` PASS
- Local build: `npm run build` PASS
- Local check: `npm run check:all` PASS
- Visual verdict: PASS score 95 (`.omx/state/seed-tab-target-highlight/ralph-progress.json`)
- Architect verification: APPROVED
- Deslop: changed-files-only pass; scoped CSS and future target visibility edge handled
- PR: #61 https://github.com/bborok1234/strange-seed-shop/pull/61

## Proposed Plan

1. `nextCreatureGoal`을 씨앗 탭에서도 재사용해 목표 씨앗 배너를 렌더링한다.
2. `availableSeeds` row 중 목표 seed에 target class와 `다음 발견` badge를 붙인다.
3. `check-game-loop`가 배너/target row/badge 문구를 검증하게 한다.
4. 모바일/데스크톱 visual evidence와 Ralph verdict를 남긴다.
5. 로컬 검증, PR checks, merge 후 main 검증까지 완료한다.

## Apply Conditions

- 기존 Phase 0 save/content/analytics contract를 깨지 않는다.
- 실제 고객 데이터, credential, 실채널 GTM을 건드리지 않는다.
- 새 dependency를 추가하지 않는다.
- 결제/로그인/ads SDK/external navigation/runtime image generation을 추가하지 않는다.

## Verification

- `npm run check:loop`
- `npm run check:all`
- Visual: `reports/visual/seed-tab-target-highlight-mobile-20260428.png`, `reports/visual/seed-tab-target-highlight-desktop-20260428.png`
- GitHub PR checks: `Verify game baseline`, `Check automerge eligibility`
