# 프로젝트 대시보드

Updated: 2026-04-27

> 이 파일은 `npm run update:dashboard`로 갱신한다. 수동 편집 후에는 `npm run check:dashboard`가 실패할 수 있다.

## 현재 상태

| 영역 | 상태 | 증거 |
| --- | --- | --- |
| Phase 0 제품 루프 | verified | `npm run check:loop` |
| 정적 에셋 파이프라인 | verified | `public/assets/manifest/assetManifest.json` |
| 경제 검증 | verified | `npm run simulate:economy` |
| 브라우저 QA | done | `reports/visual/browser_use_qa_20260427.md` |
| PR 자동 검증 | verified | PR #1, PR #2 |
| Apply gate | verified | `npm run check:apply` |
| 대시보드 자동 갱신 | review | `npm run update:dashboard`, `npm run check:dashboard` |
| 자동 머지 거버넌스 | review | `npm run check:governance` |

## 로드맵 요약

| 상태 | 개수 |
| --- | ---: |
| done | 24 |
| review | 6 |
| todo | 0 |
| blocked | 0 |

## 다음 작업

1. PR 자동화 결과를 audit report에 누적한다.
2. GitHub Branch protection 설정 여부를 별도 audit로 확인한다.
3. 다음 게임 기능 작업을 `items/` 단위로 등록한다.

## 검증 상태

| 명령 | 상태 |
| --- | --- |
| `npm run check:content` | tracked |
| `npm run check:loop` | tracked |
| `npm run simulate:economy` | tracked |
| `npm run check:docs` | tracked |
| `npm run check:apply` | tracked |
| `npm run check:dashboard` | tracked |
| `npm run check:governance` | tracked |
| `npm run build` | tracked |

## 열린 위험

- `ENABLE_AGENT_AUTOMERGE` 저장소 변수와 Branch protection은 문서화됐지만 실제 GitHub 설정 변경은 별도 승인 대상이다.
- Browser Use QA는 Phase 0 기준을 통과했지만, 신규 UI가 생기면 같은 캡처 절차로 갱신해야 한다.
- 대시보드는 자동 생성되지만 검증 결과 자체를 실행해 저장하지는 않는다.
