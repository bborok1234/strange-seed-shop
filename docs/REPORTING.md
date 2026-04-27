# 자율 작업 보고 체계

## 목적

작업을 자동화할수록 에이전트가 남기는 증거의 형식이 중요해진다. 이 문서는 제안, 적용, 검증, 감사 결과가 어디에 쌓이고 어떤 기준으로 닫히는지 정의한다.

## 보고서 위치

| 위치 | 용도 |
| --- | --- |
| `items/` | 현재 열려 있거나 검증 중인 작업 기록 |
| `reports/reviews/` | 변경 전 제안과 위험 검토 |
| `reports/audits/` | 문서, 코드, item, 검증 상태의 드리프트 점검 |
| `reports/visual/` | Browser Use 기반 시각 QA 증거 |

## review report 최소 형식

```markdown
# <작업명> Review

Status: proposed | blocked | ready_to_apply | rejected
Item: items/<id>.md
Created: YYYY-MM-DD
Scope-risk: narrow | moderate | broad

## 제안
- 적용할 변경

## 근거
- 파일, 테스트, 스크린샷, 로그

## 위험
- 남는 위험

## 적용 조건
- 이 조건이 깨지면 적용하지 않는다
```

## audit report 최소 형식

```markdown
# Autonomous Audit - YYYY-MM-DD

Status: pass | warn | fail

## 확인 항목
- 문서 인덱스와 실제 문서 일치
- 로드맵 상태와 item 상태 일치
- 검증 명령 최신성
- 시각 QA 증거 최신성

## 발견 사항
- 항목

## 다음 조치
- 항목
```

## 현재 자동 점검

`npm run check:docs`는 필수 문서, 필수 디렉터리, 로드맵의 Milestone 5 추적 문구를 확인한다.
