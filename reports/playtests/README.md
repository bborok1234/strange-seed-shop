# 플레이테스트 / 피드백 intake

이 폴더는 `이상한 씨앗상회`와 에이전트 네이티브 운영사의 안전한 feedback lane 증거를 저장한다. 현재 단계에서는 실제 고객 데이터, 외부 계정, SNS/email/ads/GTM 실게시를 사용하지 않는다. 모든 샘플은 mock/local report여야 한다.

## Intake 필수 필드

각 플레이테스트/피드백 보고서는 아래 항목을 포함한다.

- `Source`: `mock`, `internal-playtest`, `human-note`, `customer-feedback` 중 하나. 현재 자동 작업은 `mock` 또는 `internal-playtest`만 허용한다.
- `Privacy`: 개인정보/연락처/계정 식별자 포함 여부. 현재 repo에 커밋 가능한 값은 `none`이어야 한다.
- `Severity`: `low`, `medium`, `high`, `critical` 중 하나.
- `Product axis`: `first_5m_clarity`, `cuteness`, `collection_desire`, `comeback_hook`, `confusion`, `economy`, `performance`, `agent_ops` 중 하나 이상.
- `Evidence`: 스크린샷, 재현 단계, 관찰 문장, 로그, PR/issue 링크 중 하나 이상.
- `Duplicate links`: 관련 issue/report가 없으면 `none`으로 명시한다.
- `Fun rubric scores`: North Star의 첫 5분 rubric 5개 점수를 모두 기록한다.
- `Recommended next item`: 생성할 work item 또는 `none`.

## 금지 데이터

- 이메일, 전화번호, 실명, 결제 정보, 광고 계정, session token, API key, 비공개 커뮤니티 원문
- 실제 외부 채널 게시/댓글/DM 자동 실행 결과
- 승인되지 않은 고객 데이터 export

## 운영 원칙

- feedback lane은 먼저 report를 남기고, 별도 issue/work item으로 apply lane을 분리한다.
- 혼란도 점수는 높을수록 나쁘다. 다른 네 지표는 높을수록 좋다.
- `critical` severity 또는 개인정보/credential이 보이면 report만 남기고 적용 작업은 중단한다.
