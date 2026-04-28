# Apply Conditions

## 목적

자율 에이전트가 변경을 적용하기 전에 확인해야 하는 최소 조건을 고정한다. 이 문서는 “무엇을 해도 되는가”보다 “무엇을 확인하지 않으면 적용하지 않는가”를 정의한다.

## Apply gate

적용 lane은 아래 조건을 모두 만족할 때만 파일을 수정하거나 PR을 생성한다.

| 조건 | 기준 |
| --- | --- |
| 작업 기록 | 관련 `items/*.md`가 있고 `Status`가 `open`, `proposed`, `in_progress` 중 하나다. |
| 범위 | 변경 파일과 작업 기록의 Intent가 직접 연결된다. |
| 위험 | `Scope-risk: broad`이면 바로 적용하지 않는다. |
| 제안 | broad 변경 또는 제품/경제/자동화 정책 변경에는 `reports/reviews/` 제안이 먼저 있어야 한다. |
| 검증 | 작업 기록 또는 보고서에 실행할 검증 명령이 명시되어 있다. |
| 외부 영향 | GitHub PR 생성, merge, label 변경, 저장소 설정 변경은 action-time 승인을 거친다. |
| 언어 | 문서, 보고, 커밋은 한국어 우선 규칙을 따른다. |

## 중단 조건

아래 중 하나라도 해당하면 적용을 멈추고 보고한다.

- destructive 변경이 필요하다.
- credential, 결제, 실제 사용자 데이터, 저장소 권한 설정을 건드린다.
- 작업 범위가 `items/*.md`의 Intent를 벗어난다.
- 검증 명령이 없거나 반복 실패한다.
- 기존 사용자 변경과 충돌한다.
- 자동 머지 조건을 우회해야만 진행할 수 있다.

## 실채널 GTM 승인 gate

GTM mock lane은 proposal 작성까지만 허용한다. SNS/email/ads/store/community 같은 실채널 action은 아래 조건을 모두 만족하기 전까지 적용 lane에 들어갈 수 없다.

| 조건 | 기준 |
| --- | --- |
| Mock proposal | `reports/gtm/*.md`에 `Status: mock-proposal`과 `Do-not-publish boundary`가 있다. |
| 작업 기록 | 관련 `items/*.md`가 `gtm_mock` 또는 `feedback` work type으로 존재한다. |
| 개인정보/credential | 고객 개인정보, credential, API key, session token, 비공개 피드백 원문이 없다. |
| 사람 승인 | exact channel과 exact copy에 대해 `human approval required` 상태가 해소되어야 한다. |
| 실행 계획 | 게시/발송 후 증거, 수정, rollback 계획이 있다. |

이 gate가 충족되지 않으면 에이전트는 실제 게시, 댓글, DM, 이메일 발송, 광고 집행, store listing 변경을 수행하지 않는다.

## 검증 증거

적용 후에는 최소 하나 이상의 증거를 남긴다.

- 통과한 로컬 명령
- GitHub Actions run URL
- Browser Use 스크린샷 또는 DOM 검증 결과
- 관련 PR URL
- 업데이트된 roadmap 또는 dashboard 상태

## 현재 자동 점검

`npm run check:apply`는 apply gate 문서, dashboard, roadmap 상태, 필수 보고 위치가 존재하는지 확인한다.
