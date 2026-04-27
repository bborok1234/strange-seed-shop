# 프로젝트 대시보드

Updated: 2026-04-27

> 이 파일은 `npm run update:dashboard`로 갱신한다. 수동 편집 후에는 `npm run check:dashboard`가 실패할 수 있다.

## 현재 상태

| 영역 | 상태 | 증거 |
| --- | --- | --- |
| Phase 0 제품 루프 | verified | `npm run check:loop` |
| 정적 에셋 파이프라인 | verified | `public/assets/manifest/assetManifest.json` |
| 경제 검증 | verified | `npm run simulate:economy` |
| 브라우저 QA | review | `reports/visual/browser_use_qa_20260427.md` |
| PR 자동 검증 | verified | PR #1, PR #2 |
| Apply gate | verified | `npm run check:apply` |
| 대시보드 자동 갱신 | review | `npm run update:dashboard`, `npm run check:dashboard` |

## 로드맵 요약

| 상태 | 개수 |
| --- | ---: |
| done | 23 |
| review | 6 |
| todo | 0 |
| blocked | 0 |

## 다음 작업

1. Browser Use로 오프라인 복귀 QA를 완료한다.
2. Browser Use로 데스크톱 폭 QA를 완료한다.
3. 대시보드와 audit report를 PR 이후 상태에 맞춰 계속 갱신한다.

## 검증 상태

| 명령 | 상태 |
| --- | --- |
| `npm run check:content` | tracked |
| `npm run check:loop` | tracked |
| `npm run simulate:economy` | tracked |
| `npm run check:docs` | tracked |
| `npm run check:apply` | tracked |
| `npm run check:dashboard` | tracked |
| `npm run build` | tracked |

## 열린 위험

- `ENABLE_AGENT_AUTOMERGE` 저장소 변수와 브랜치 보호 규칙은 아직 명시적으로 고정하지 않았다.
- Browser Use QA는 모바일 클릭 플로우 중심이며 오프라인 복귀와 데스크톱 폭 검증이 남아 있다.
- 대시보드는 자동 생성되지만 검증 결과 자체를 실행해 저장하지는 않는다.
