# GTM mock lane v0

Status: in_progress
Owner: agent
Created: 2026-04-28
Updated: 2026-04-28
Scope-risk: narrow
Work type: gtm_mock
Issue: #38
PR: #39

## Intent

에이전트 네이티브 운영사가 플레이테스트/개발 변경을 실제 외부 채널에 게시하지 않고도 devlog, release note, community post 초안으로 바꿀 수 있게 한다. 이 작업은 GTM 실행이 아니라 **proposal-only mock lane**이며, 향후 실채널 승인 gate를 분명히 하기 위한 안전 scaffold다.

## Acceptance Criteria

- `reports/gtm/README.md`가 GTM mock lane의 허용/금지 행동과 approval gate를 설명한다.
- `reports/gtm/gtm-mock-sample-20260428.md`가 devlog, release note, community post proposal을 포함한다.
- `docs/APPLY_CONDITIONS.md`가 real channel action 승인 gate를 명시한다.
- `scripts/check-gtm-mock.mjs`와 `npm run check:gtm-mock`가 필수 문구를 검증한다.
- `npm run check:all`이 `check:gtm-mock`을 포함해 통과한다.

## Evidence

- Issue #38: https://github.com/bborok1234/strange-seed-shop/issues/38
- PR #39: https://github.com/bborok1234/strange-seed-shop/pull/39
- `npm run check:gtm-mock` PASS — GTM mock lane, sample proposal, approval gate 필수 문구 검증
- `npm run check:all` PASS — 기존 제품/운영사 gate에 GTM mock 검증 포함

## Proposed Plan

1. GTM mock lane report 규칙과 sample proposal을 추가한다.
2. Apply Conditions에 실채널 승인 gate를 추가한다.
3. 검증 스크립트와 dashboard/roadmap/package script를 갱신한다.
4. PR을 만들고 required checks를 확인한다.

## Apply Conditions

- 실제 외부 채널 게시, 댓글, DM, 광고 집행, store listing 수정, email 발송 없음.
- credential, 고객 개인정보, 결제/로그인/account/ads SDK/runtime image generation 없음.
- 문서/report/check scaffold만 적용한다.

## Verification

- `npm run check:gtm-mock`
- `npm run check:all`
