# 플레이테스트 intake와 첫 5분 fun rubric v0

Status: in_progress
Owner: agent
Created: 2026-04-28
Updated: 2026-04-28
Scope-risk: narrow
Work type: feedback
Issue: #36
PR: TBD

## Intent

에이전트 네이티브 운영사가 실제 고객 데이터나 외부 채널 접근 없이도 플레이테스트 신호를 안전하게 work item 후보로 바꿀 수 있게 한다. 동시에 `이상한 씨앗상회`의 게임 북극성인 첫 5분 재미를 감정 중심 rubric으로 점수화해, 이후 자동 이슈 생성과 우선순위 판단의 입력으로 사용한다.

## Acceptance Criteria

- `reports/playtests/README.md`가 feedback intake 필수 필드와 금지 데이터를 설명한다.
- `reports/playtests/playtest-intake-sample-20260428.md`가 severity, product axis, evidence, duplicate links, next item 후보를 포함한다.
- `docs/NORTH_STAR.md`가 첫 5분 명확성, 귀여움, 수집 욕구, 복귀 hook, 혼란도 rubric을 정의한다.
- `scripts/check-playtest-intake.mjs`와 `npm run check:playtest-intake`가 필수 문구/점수 범위를 검증한다.
- `npm run check:all`이 playtest intake 검증을 포함해 통과한다.

## Evidence

- Issue #36: https://github.com/bborok1234/strange-seed-shop/issues/36
- `npm run check:playtest-intake` PASS — intake 필수 필드와 5개 rubric 점수 범위 검증
- `npm run check:all` PASS — 기존 제품/운영사 gate에 playtest intake 검증 포함

## Proposed Plan

1. North Star에 fun rubric을 추가한다.
2. `reports/playtests/`에 intake 운영 규칙과 sample report를 추가한다.
3. 검증 스크립트와 npm script를 추가한다.
4. ROADMAP/DASHBOARD를 갱신한다.

## Apply Conditions

- 실제 고객 개인정보, 외부 계정, SNS/email/ads/GTM 실게시, 결제/로그인/런타임 이미지 생성 없음.
- 이 작업은 mock/local report와 문서/검증 스크립트 범위로 제한한다.
- 실제 고객 피드백을 수집하는 것이 아니라 이후 수집 시 사용할 구조만 만든다.

## Verification

- `npm run check:playtest-intake`
- `npm run check:all`
