# Browser Use iab recovery diagnostic

Status: in_progress
Owner: agent
Created: 2026-04-28
Updated: 2026-04-28
Scope-risk: narrow
Work type: agent_ops
Issue: #18
Branch: `codex/browser-use-iab-recovery`

## Intent

Phaser playfield Browser QA에서 Browser Use `iab` backend 직접 검증을 복구할 수 있는지 확인하고, 현재 세션에서 복구가 불가능하면 환경 차단과 CDP fallback 기준을 검증 가능한 문서로 고정한다.

## Acceptance Criteria

- Browser Use 직접 검증 또는 명확한 환경 차단 기록이 `reports/visual/`에 저장된다.
- `docs/BROWSER_QA.md`가 최신 Browser Use diagnostic과 fallback evidence를 가리킨다.
- `scripts/check-browser-qa.mjs`가 최신 diagnostic report와 CDP fallback screenshots를 검증한다.
- `npm run check:browser-qa`와 `npm run check:all`이 통과한다.

## Evidence

- Issue #18: https://github.com/bborok1234/strange-seed-shop/issues/18
- Diagnostic report: `reports/visual/browser-use-iab-runtime-diagnostic-20260428.md`
- Mobile fallback screenshot: `reports/visual/browser-use-iab-fallback-phaser-mobile-20260428.png`
- Desktop fallback screenshot: `reports/visual/browser-use-iab-fallback-phaser-desktop-20260428.png`
- Context snapshot: `.omx/context/browser-use-iab-recovery-20260428T040100Z.md`
- Local check: `npm run check:browser-qa` PASS
- Local check: `npm run check:all` PASS
- PR: 생성 예정

## Proposed Plan

1. Browser Use skill 절차대로 Node REPL `js` 노출 상태와 `iab` bootstrap을 재시도한다.
2. 실패하면 환경 차단 원인과 허용 fallback 조건을 `reports/visual/`에 기록한다.
3. CDP fallback으로 Phaser playfield mobile/desktop 증거를 갱신한다.
4. `docs/BROWSER_QA.md`와 `scripts/check-browser-qa.mjs`가 최신 증거를 가리키게 한다.
5. 로컬 검증 후 draft PR을 만들고 GitHub checks를 확인한다.

## Apply Conditions

- Browser Use 직접 시도 전 Computer Use나 CDP를 기본 경로로 사용하지 않는다.
- 실제 credential, 고객 데이터, 외부 배포, 실채널 GTM, 결제/로그인/ads SDK를 건드리지 않는다.
- Browser Use plugin cache 자체를 repo 변경으로 패치하지 않는다.
- 새 dependency를 추가하지 않는다.

## Verification

- `npm run check:browser-qa`
- `npm run check:all`
- GitHub PR checks: `Verify game baseline`, `Check automerge eligibility`
