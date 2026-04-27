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

## 검증 증거

적용 후에는 최소 하나 이상의 증거를 남긴다.

- 통과한 로컬 명령
- GitHub Actions run URL
- Browser Use 스크린샷 또는 DOM 검증 결과
- 관련 PR URL
- 업데이트된 roadmap 또는 dashboard 상태

## 현재 자동 점검

`npm run check:apply`는 apply gate 문서, dashboard, roadmap 상태, 필수 보고 위치가 존재하는지 확인한다.
