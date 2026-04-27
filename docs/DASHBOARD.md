# 프로젝트 대시보드

Updated: 2026-04-27

## 현재 상태

| 영역 | 상태 | 증거 |
| --- | --- | --- |
| Phase 0 제품 루프 | verified | `npm run check:loop`, Browser Use 클릭 플로우 |
| 정적 에셋 파이프라인 | verified | `public/assets/manifest/assetManifest.json`, `reports/assets/asset_review_20260427.md` |
| 경제 검증 | verified | `npm run simulate:economy` |
| 브라우저 QA | review | `reports/visual/browser_use_qa_20260427.md` |
| PR 자동 검증 | verified | PR #1, CI success |
| 자동 머지 실험 | verified | PR #1 squash merge, main CI success |
| Apply gate | review | `docs/APPLY_CONDITIONS.md`, `npm run check:apply` |

## 다음 작업

1. 오프라인 복귀 Browser Use QA를 완료한다.
2. 데스크톱 폭 Browser Use QA를 완료한다.
3. `items/`와 `reports/` 상태를 읽어 대시보드를 갱신하는 스크립트를 추가한다.

## 검증 상태

| 명령 | 상태 |
| --- | --- |
| `npm run check:content` | pass |
| `npm run check:loop` | pass |
| `npm run simulate:economy` | pass |
| `npm run check:docs` | pass |
| `npm run check:apply` | pending |
| `npm run build` | pass |

## 열린 위험

- `ENABLE_AGENT_AUTOMERGE` 저장소 변수와 브랜치 보호 규칙은 아직 명시적으로 고정하지 않았다.
- Browser Use QA는 모바일 클릭 플로우 중심이며 오프라인 복귀와 데스크톱 폭 검증이 남아 있다.
- 대시보드는 아직 수동 갱신 문서다.
